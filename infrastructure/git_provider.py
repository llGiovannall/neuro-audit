import subprocess
import os
from typing import Dict, Any
from core.interfaces import IGitService


class SubprocessGitService(IGitService):

    def execute_command(self, command: str, working_directory: str) -> Dict[str, Any]:
        if not working_directory or not os.path.exists(working_directory):
            return {
                "status": "error",
                "output": "Nenhum Workspace selecionado. Use o ícone de pasta para abrir um repositório.",
            }

        if not command.strip().startswith("git "):
            return {
                "status": "error",
                "output": "O Terminal S.A.R.A está restrito apenas a comandos 'git'.",
            }

        try:
            resultado = subprocess.run(
                command,
                cwd=working_directory,
                shell=True,
                capture_output=True,
                text=True,
            )

            if resultado.returncode != 0:
                return {
                    "status": "error",
                    "output": resultado.stderr.strip()
                    or f"Erro desconhecido. Código: {resultado.returncode}",
                }

            saida = resultado.stdout.strip()
            return {
                "status": "success",
                "output": saida if saida else "Comando executado silenciosamente.",
            }

        except Exception as e:
            return {
                "status": "error",
                "output": f"Falha catastrófica no subprocesso: {str(e)}",
            }

    def get_user_info(self, working_directory: str) -> Dict[str, str]:
        try:
            nome = subprocess.check_output(
                "git config user.name", cwd=working_directory, shell=True, text=True
            ).strip()
            email = subprocess.check_output(
                "git config user.email", cwd=working_directory, shell=True, text=True
            ).strip()
            return {"name": nome, "email": email}
        except Exception:
            return {"name": "Desenvolvedor Anónimo", "email": "unknown@matrix.local"}
