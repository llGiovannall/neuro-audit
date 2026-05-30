import tkinter as tk
from tkinter import filedialog
from core.interfaces import IWindowDialogService


class PyWebViewDialogService(IWindowDialogService):

    def __init__(self):
        self.window = None

    def set_window(self, window):
        self.window = window

    def ask_for_folder(self) -> str:
        root = tk.Tk()
        root.withdraw()

        root.attributes("-topmost", True)

        folder_path = filedialog.askdirectory(
            title="Neuro Audit - Selecione o Workspace"
        )

        root.destroy()

        return folder_path

    def ask_for_save_file(self, default_name: str) -> str:
        root = tk.Tk()
        root.withdraw()
        root.attributes("-topmost", True)

        file_path = filedialog.asksaveasfilename(
            title="Neuro Audit - Guardar Laudo",
            initialfile=default_name,
            defaultextension=".pdf",
            filetypes=[("Documentos PDF", "*.pdf"), ("Todos os Arquivos", "*.*")],
        )

        root.destroy()

        return file_path
