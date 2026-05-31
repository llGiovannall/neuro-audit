import os
import re
import datetime
import sqlite3
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from core.state import WorkspaceSession
from core.use_cases import ExecuteTerminalCommandUseCase, FileManagementUseCase
from core.interfaces import IWindowDialogService, IPdfService, IGitService
from core.interfaces import IAiService

from infrastructure.sql_repository import SqliteAuditRepository
from infrastructure.json_repository import JsonReportRepository

_LAST_AUDIT_CACHE = {"texto": "Análise não registrada. Punição padrão aplicada."}


def create_app(
    static_folder: str,
    session: WorkspaceSession,
    dialog_service: IWindowDialogService,
    pdf_service: IPdfService,
    cmd_use_case: ExecuteTerminalCommandUseCase,
    file_use_case: FileManagementUseCase,
    git_service: IGitService,
    ai_service: IAiService,
) -> Flask:

    app = Flask(__name__, static_folder=static_folder, static_url_path="")
    CORS(app)

    sql_repo = SqliteAuditRepository()
    json_repo = JsonReportRepository()

    @app.route("/")
    def index():
        return app.send_static_file("index.html")

    @app.route("/selecionar-pasta", methods=["GET"])
    def selecionar_pasta():
        folder = dialog_service.ask_for_folder()
        if folder:
            session.set_directory(folder)
            return jsonify({"status": "sucesso", "pasta": folder})
        return jsonify({"status": "cancelado"})

    @app.route("/command", methods=["POST"])
    def executar_comando():
        raw_cmd = request.json.get("command", "")
        result = cmd_use_case.execute(raw_cmd)
        return jsonify(result)

    @app.route("/auditar-codigo", methods=["POST"])
    def auditar_codigo():
        dados = request.get_json()
        codigo = dados.get("codigo", "")
        arquivo = dados.get("arquivo", "")
        extensao = arquivo.split(".")[-1]

        resultado = ai_service.audit_code(codigo, extensao)
        print("[SISTEMA] Auditoria Executada pela Matriz IA.")

        _LAST_AUDIT_CACHE["texto"] = resultado.get("analysis", "")

        return jsonify(resultado)

    @app.route("/api/database/save", methods=["POST"])
    def salvar_no_banco():
        dados = request.json
        arquivo = dados.get("arquivo")
        codigo = dados.get("codigo")
        sanity = dados.get("sanity", 100)
        nome = dados.get("nome", "Dev Cobaia")
        email = dados.get("email", "cobaia@neuroaudit.com")

        analise_ia = _LAST_AUDIT_CACHE["texto"]

        coffee = 0
        sleep = 0

        match_coffee = re.search(r"XÍCARAS DE CAFÉ:\s*(\d+)", analise_ia, re.IGNORECASE)
        if match_coffee:
            coffee = int(match_coffee.group(1))

        match_sleep = re.search(r"HORAS SEM DORMIR:\s*(\d+)", analise_ia, re.IGNORECASE)
        if match_sleep:
            sleep = int(match_sleep.group(1))

        try:
            sql_repo.save_audit_log(nome, email, sanity, "")
            sql_repo.increment_torture_metrics(email, coffee, sleep)

            json_repo.append_report(nome, email, analise_ia)

            if arquivo and codigo:
                file_use_case.save_file(arquivo, codigo)

            return jsonify({"status": "sucesso"})
        except Exception as e:
            print(f"[ERRO] Falha na persistência: {e}")
            return jsonify({"status": "erro", "mensagem": str(e)}), 500

    @app.route("/api/reports/generate-pdf", methods=["POST"])
    def gerar_dossie_pdf():
        try:
            historico_json = json_repo.get_all_reports()
            email_alvo = "cobaia@neuroaudit.com"
            coffee_total = 0
            sleep_total = 0
            sanity_atual = 100

            with sqlite3.connect(sql_repo.db_path) as conn:
                query = """
                    SELECT Sanity, SUM(CoffeeCups), SUM(HoursWithoutSleep)
                    FROM Users
                    WHERE Email = ?
                    ORDER BY Id DESC LIMIT 1
                """
                cursor = conn.execute(query, (email_alvo,))
                row = cursor.fetchone()
                if row and row[0] is not None:
                    sanity_atual = row[0]
                    coffee_total = row[1] or 0
                    sleep_total = row[2] or 0

            meta = {
                "nome": "Dev Cobaia",
                "email": email_alvo,
                "sanity": sanity_atual,
                "coffee": coffee_total,
                "sleep": sleep_total,
            }

            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            nome_dinamico = f"Dossie_NeuroAudit_{timestamp}.pdf"
            save_path = dialog_service.ask_for_save_file(nome_dinamico)

            if save_path:
                if not save_path.endswith(".pdf"):
                    save_path += ".pdf"

                pdf_service.generate_report(save_path, historico_json, meta)
                return jsonify({"status": "sucesso", "caminho": save_path})

            return jsonify({"status": "cancelado"})
        except Exception as e:
            print(f"[ERRO] Falha ao gerar Dossiê: {e}")
            return jsonify({"status": "erro", "mensagem": str(e)}), 500

    @app.route("/listar-arquivos", methods=["POST", "GET"])
    def listar_arquivos():
        caminho = request.json.get("caminho") if request.method == "POST" else None
        return jsonify(file_use_case.list_files(caminho))

    @app.route("/ler-arquivo", methods=["POST"])
    def ler_arquivo():
        caminho = request.json.get("caminho")
        return jsonify(file_use_case.read_file(caminho))

    @app.route("/criar-item", methods=["POST"])
    def criar_item():
        dados = request.json
        caminho = dados.get("caminho")
        is_dir = dados.get("is_dir", False)

        if not caminho:
            return (
                jsonify({"status": "erro", "mensagem": "Caminho não fornecido."}),
                400,
            )

        try:
            if is_dir:
                os.makedirs(caminho, exist_ok=True)
            else:
                open(caminho, "a").close()
            return jsonify({"status": "sucesso"})
        except Exception as e:
            return jsonify({"status": "erro", "mensagem": str(e)}), 500

    @app.route("/deletar-item", methods=["DELETE"])
    def deletar_item():
        caminho = request.json.get("caminho")

        if not caminho:
            return (
                jsonify({"status": "erro", "mensagem": "Caminho não fornecido."}),
                400,
            )

        try:
            import shutil

            if os.path.isdir(caminho):
                shutil.rmtree(caminho)
            else:
                os.remove(caminho)
            return jsonify({"status": "sucesso"})
        except Exception as e:
            return jsonify({"status": "erro", "mensagem": str(e)}), 500

    @app.route("/salvar-arquivo-editor", methods=["POST"])
    def salvar_arquivo_editor():
        dados = request.json
        return jsonify(
            file_use_case.save_file(dados.get("caminho"), dados.get("conteudo"))
        )

    @app.route("/exibir-midia", methods=["GET"])
    def exibir_midia():
        caminho = request.args.get("caminho")
        if not caminho or not caminho.startswith(session.get_directory()):
            return "Acesso negado", 403
        try:
            return send_file(caminho)
        except Exception as e:
            return f"Erro ao carregar mídia: {e}", 500

    return app
