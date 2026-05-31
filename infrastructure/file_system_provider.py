from core.interfaces import IFileSystemService


class OsFileSystemService(IFileSystemService):
    def list_directory(self, target_path: str) -> list:
        raise NotImplementedError(
            "OsFileSystemService.list_directory aguardando codificação."
        )

    def read_file(self, file_path: str) -> str:
        raise NotImplementedError(
            "OsFileSystemService.read_file aguardando codificação."
        )

    def write_file(self, file_path: str, content: str) -> None:
        raise NotImplementedError(
            "OsFileSystemService.write_file aguardando codificação."
        )
import os
from typing import List, Dict, Any
from core.interfaces import IFileSystemService


class OsFileSystemService(IFileSystemService):

    def list_directory(self, path: str) -> List[Dict[str, Any]]:
        """
        Lê o disco rígido e devolve a lista de pastas e ficheiros.
        """
        if not path or not os.path.exists(path):
            return {
                "status": "erro",
                "mensagem": "Caminho inválido ou sessão não conectada.",
            }

        try:
            itens = []
            for nome in os.listdir(path):
                if nome.startswith(".git") or nome == "__pycache__":
                    continue

                caminho_completo = os.path.join(path, nome)
                is_dir = os.path.isdir(caminho_completo)

                itens.append(
                    {
                        "nome": nome,
                        "tipo": "diretorio" if is_dir else "arquivo",
                        "caminho": caminho_completo,
                    }
                )

            itens.sort(key=lambda x: (x["tipo"] != "diretorio", x["nome"].lower()))

            return itens

        except Exception as e:
            return {"status": "erro", "mensagem": f"Falha ao ler o disco: {str(e)}"}

    def read_file(self, file_path: str) -> Dict[str, str]:
        """
        Abre o ficheiro e devolve o texto para injetar no Monaco Editor.
        """
        if not file_path or not os.path.exists(file_path):
            return {"status": "erro", "mensagem": "Ficheiro não encontrado."}

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                conteudo = f.read()
            return {"status": "sucesso", "conteudo": conteudo}

        except UnicodeDecodeError:
            return {
                "status": "erro",
                "mensagem": "O ficheiro é um binário e não pode ser lido no editor de texto.",
            }
        except Exception as e:
            return {"status": "erro", "mensagem": f"Erro de leitura: {str(e)}"}

    def write_file(self, file_path: str, content: str) -> Dict[str, str]:
        """
        Guarda as alterações feitas no editor de volta para o disco.
        """
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            return {"status": "sucesso", "mensagem": "Ficheiro salvo com sucesso."}
        except Exception as e:
            return {"status": "erro", "mensagem": f"Erro de gravação: {str(e)}"}