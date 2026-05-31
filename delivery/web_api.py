import os
import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from core.state import WorkspaceSession
from core.use_cases import ExecuteTerminalCommandUseCase, FileManagementUseCase
from core.interfaces import IWindowDialogService, IPdfService, IGitService
from core.interfaces import IAiService


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

    @app.route("/salvar-laudo", methods=["POST"])
    def salvar_laudo():
        conteudo = request.json.get("laudo", "")
        diretorio_projeto = session.get_directory()
        dados_usuario = git_service.get_user_info(diretorio_projeto)
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        nome_dinamico = f"NeuroAudit_Report_{timestamp}.pdf"
        save_path = dialog_service.ask_for_save_file(nome_dinamico)
        if save_path:
            if not save_path.endswith(".pdf"):
                save_path += ".pdf"
            pdf_service.generate_report(save_path, conteudo, dados_usuario)
            return jsonify({"status": "sucesso", "caminho": save_path})

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
        print("AUDITORIA EXECUTADA")

        return jsonify(resultado)

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
            import os

            if is_dir:
                os.makedirs(caminho, exist_ok=True)
            else:
                open(caminho, "a").close()

            return jsonify({"status": "sucesso"})
        except Exception as e:
            return jsonify({"status": "erro", "mensagem": str(e)}), 500

    @app.route("/deletar-item", methods=["DELETE"])
    def deletar_item():
        """Rota tática para eliminar ficheiros e pastas a partir do Frontend"""
        caminho = request.json.get("caminho")

        if not caminho:
            return (
                jsonify({"status": "erro", "mensagem": "Caminho não fornecido."}),
                400,
            )

        try:
            import os
            import shutil

            if os.path.isdir(caminho):
                shutil.rmtree(caminho)  # Remove a pasta e tudo lá dentro
            else:
                os.remove(caminho)  # Remove apenas o ficheiro

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
