import os
import sys
from dotenv import load_dotenv


class AppConfig:
    def __init__(self):
        self.base_path = self._resolve_base_path()
        self._load_environment()

        self.flask_host = "127.0.0.1"
        self.flask_port = 5000

        self.app_title = "Developed by Spectra Core Division"
        self.window_width = 1000
        self.window_height = 700
        self.background_color = "#0a0a0a"
        self.windows_app_id = "neuroaudit.app.1.0"

        # Caminhos Dinâmicos
        self.static_folder = os.path.join(self.base_path, "frontend")
        self.logo_path = os.path.join(self.base_path, "logo.ico")
        self.gemini_key = os.getenv("GEMINI_KEY")

    def _resolve_base_path(self) -> str:
        if hasattr(sys, "_MEIPASS"):
            return sys._MEIPASS
        return os.path.abspath(".")

    def _load_environment(self) -> None:
        dotenv_path = os.path.join(self.base_path, ".env")
        load_dotenv(dotenv_path)
