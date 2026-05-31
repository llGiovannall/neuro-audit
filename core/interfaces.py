from abc import ABC, abstractmethod
from typing import Dict, Any, List


class IGitService(ABC):
    @abstractmethod
    def execute_command(self, command: str, working_directory: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_user_info(self, working_directory: str) -> Dict[str, str]:
        pass


class IAiService(ABC):
    @abstractmethod
    def generate_cyberpunk_analysis(self, git_log: str) -> str:
        pass

    @abstractmethod
    def audit_code(self, source_code: str, language: str) -> dict:
        pass


class IPdfService(ABC):
    @abstractmethod
    def generate_report(self, filepath: str, json_data: list, meta_info: dict) -> None:
        pass


class IWindowDialogService(ABC):
    @abstractmethod
    def ask_for_folder(self) -> str:
        pass

    @abstractmethod
    def ask_for_save_file(self, default_name: str) -> str:
        pass


class IFileSystemService(ABC):
    @abstractmethod
    def list_directory(self, target_path: str) -> list:
        pass

    @abstractmethod
    def read_file(self, file_path: str) -> str:
        pass

    @abstractmethod
    def write_file(self, file_path: str, content: str) -> None:
        pass


class IAuditRepository(ABC):
    @abstractmethod
    def save_audit_log(
        self, author_name: str, sanity_score: int, diagnostic: str
    ) -> None:
        pass

    @abstractmethod
    def get_history_by_author(self, author_name: str) -> List[Dict[str, Any]]:
        pass
