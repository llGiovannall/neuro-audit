import json
import os
import datetime


class JsonReportRepository:
    def __init__(self, filepath: str = "neuro_audit_dossier.json"):
        self.filepath = filepath
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        if not os.path.exists(self.filepath):
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump([], f)

    def append_report(self, autor: str, email: str, content: str):
        with open(self.filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        novo_registro = {
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "autor": autor,
            "email": email,
            "analise_ia": content,
        }

        data.append(novo_registro)

        with open(self.filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

    def get_all_reports(self) -> list:
        with open(self.filepath, "r", encoding="utf-8") as f:
            return json.load(f)
