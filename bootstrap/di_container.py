import webview
from bootstrap.config import AppConfig
from core.state import WorkspaceSession
from core.use_cases import ExecuteTerminalCommandUseCase, FileManagementUseCase
from infrastructure.ai_provider import GeminiAiService
from infrastructure.git_provider import SubprocessGitService
from infrastructure.pdf_provider import FpdfCyberpunkService
from infrastructure.ui_provider import PyWebViewDialogService
from infrastructure.file_system_provider import OsFileSystemService
from delivery.web_api import create_app
from infrastructure.ai_provider import GeminiAiService


class ApplicationContainer:
    def __init__(self, config: AppConfig):
        self.config = config
        self.session = WorkspaceSession()

        self.ai_service = GeminiAiService(api_key=self.config.gemini_key)
        self.git_service = SubprocessGitService()
        self.pdf_service = FpdfCyberpunkService()
        self.dialog_service = PyWebViewDialogService()
        self.fs_service = OsFileSystemService()

        self.cmd_use_case = ExecuteTerminalCommandUseCase(
            git_service=self.git_service,
            ai_service=self.ai_service,
            session=self.session,
        )
        self.file_use_case = FileManagementUseCase(
            fs_service=self.fs_service, session=self.session
        )

    def build_flask_app(self):
        return create_app(
            static_folder=self.config.static_folder,
            session=self.session,
            dialog_service=self.dialog_service,
            pdf_service=self.pdf_service,
            cmd_use_case=self.cmd_use_case,
            file_use_case=self.file_use_case,
            git_service=self.git_service,
            ai_service=self.ai_service,
        )

    def build_webview_window(self, url: str) -> webview.Window:
        window = webview.create_window(
            title=self.config.app_title,
            url=url,
            maximized=True,
            resizable=False,
            background_color=self.config.background_color,
        )
        self.dialog_service.set_window(window)
        return window
