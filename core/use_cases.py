from core.interfaces import IGitService, IAiService, IFileSystemService
from core.state import WorkspaceSession


class ExecuteTerminalCommandUseCase:
    SHORTCUTS = {
        "gs": "git status",
        "gcm": "git commit -m",
        "gpo": "git push origin",
        "ga": "git add .",
    }

    def __init__(
        self,
        git_service: IGitService,
        ai_service: IAiService,
        session: WorkspaceSession,
    ):
        self.git = git_service
        self.ai = ai_service
        self.session = session

    def execute(self, raw_command: str) -> dict:
        cmd_trim = raw_command.strip()

        if cmd_trim.lower() == "help":
            help_text = (
                "Spectra OS Terminal - Comandos Autorizados:\r\n"
                "  help  -> Exibe esta matriz de suporte\r\n"
                "  git   -> Comandos nativos (ex: git status)\r\n"
                "\r\nAtalhos Táticos (Aliases):\r\n"
                "  gs    -> git status\r\n"
                "  ga    -> git add .\r\n"
                "  gcm   -> git commit -m\r\n"
                "  gpo   -> git push origin\r\n"
            )
            return {"output": help_text, "analysis": None}

        if not self.session.is_connected():
            return {
                "output": "ERRO: O terminal requer conexão com um diretório alvo.\r\n",
                "analysis": None,
            }

        final_command = self._parse_command(raw_command)
        result = self.git.execute_command(final_command, self.session.get_directory())

        terminal_output = result.get("output", "Comando executado silenciosamente.")

        return {"output": terminal_output.replace("\n", "\r\n"), "analysis": None}

    def _parse_command(self, raw_command: str) -> str:
        parts = raw_command.strip().split(" ", 1)
        if parts[0] not in self.SHORTCUTS:
            return raw_command
        rest = parts[1] if len(parts) > 1 else ""
        if parts[0] == "gcm" and not rest.startswith('"'):
            rest = f'"{rest}"'
        return f"{self.SHORTCUTS[parts[0]]} {rest}".strip()

    def audit_single_file(self, source_code: str, language: str) -> dict:
        if not source_code.strip():
            return {
                "analysis": "Arquivo vazio. Não há crimes algorítmicos aqui.",
                "mutated_code": "",
            }
        return self.ai.audit_code(source_code, language)


class FileManagementUseCase:
    def __init__(self, fs_service: IFileSystemService, session: WorkspaceSession):
        self.fs = fs_service
        self.session = session

    def list_files(self, requested_path: str = None) -> dict:
        if not self.session.is_connected():
            return {"status": "erro", "mensagem": "Sessão não conectada."}

        target = requested_path if requested_path else self.session.get_directory()
        if not target.startswith(self.session.get_directory()):
            return {
                "status": "erro",
                "mensagem": "Acesso negado pela Diretriz 42.",
            }

        try:
            return {"status": "sucesso", "arquivos": self.fs.list_directory(target)}
        except Exception as e:
            return {"status": "erro", "mensagem": str(e)}

    def read_file(self, filepath: str) -> dict:
        if not self.session.is_connected() or not filepath.startswith(
            self.session.get_directory()
        ):
            return {"status": "erro", "mensagem": "Acesso negado."}
        try:
            return self.fs.read_file(filepath)
        except Exception as e:
            return {"status": "erro", "mensagem": str(e)}

    def save_file(self, filepath: str, content: str) -> dict:
        if not self.session.is_connected() or not filepath.startswith(
            self.session.get_directory()
        ):
            return {"status": "erro", "mensagem": "Acesso negado."}
        try:
            return self.fs.write_file(filepath, content)
        except Exception as e:
            return {"status": "erro", "mensagem": str(e)}
