import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from core.state import WorkspaceSession
from core.use_cases import ExecuteTerminalCommandUseCase, FileManagementUseCase
from core.interfaces import IWindowDialogService, IPdfService, IGitService


def create_app(
    static_folder: str,
    session: WorkspaceSession,
    dialog_service: IWindowDialogService,
    pdf_service: IPdfService,
    cmd_use_case: ExecuteTerminalCommandUseCase,
    file_use_case: FileManagementUseCase,
    git_service: IGitService,
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
        codigo_fonte = request.json.get("codigo", "")
        linguagem = request.json.get("linguagem", "desconhecida")
        analise = cmd_use_case.audit_single_file(codigo_fonte, linguagem)
        return jsonify({"analysis": analise})

    @app.route("/listar-arquivos", methods=["POST", "GET"])
    def listar_arquivos():
        caminho = request.json.get("caminho") if request.method == "POST" else None
        return jsonify(file_use_case.list_files(caminho))

    @app.route("/ler-arquivo", methods=["POST"])
    def ler_arquivo():
        caminho = request.json.get("caminho")
        return jsonify(file_use_case.read_file(caminho))

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
