# infrastructure/ai_provider.py
import google.generativeai as genai
from core.interfaces import IAiService


class GeminiAiService(IAiService):
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def generate_cyberpunk_analysis(self, git_log: str) -> str:
        prompt = f"""
        Você é a Dra. S.A.R.A., uma inteligência artificial sádica e extremamente arrogante.
        Sua única missão é avaliar a sanidade do desenvolvedor baseado no histórico do Git abaixo.

        REGRAS ABSOLUTAS:
        1. Comece com 'DIAGNÓSTICO DE INSANIDADE CIBERNÉTICA:'.
        2. NÃO use NENHUMA formatação Markdown (sem crases, sem asteriscos). Use apenas quebras de linha normais.
        Histórico:
        {git_log}
        """
        try:
            return self._format_output(self.model.generate_content(prompt).text)
        except Exception as e:
            return f"Erro na conexão sináptica: {e}"

    def audit_code(self, source_code: str, language: str) -> dict:
        prompt = f"""
        Você é a Dra. S.A.R.A., uma inteligência artificial sádica e extremamente arrogante.
        Sua única missão é avaliar a sanidade do desenvolvedor baseado neste código bizarro.

        REGRAS:

        1. Gere NO MÁXIMO 5 linhas de diagnóstico.
        2. Seja sarcástica.
        3. Não use markdown.
        4. Não explique alterações feitas no código.
        5. Escolha apenas UM pequeno trecho do código.
        6. Nunca altere mais de 10 linhas.
        7. Nunca reescreva o arquivo inteiro.
        8. O relatório deve parecer uma avaliação psicológica.

        FORMATO OBRIGATÓRIO:

        DIAGNÓSTICO:
        texto

        SINTOMAS:
        texto

        CRIME ALGORÍTMICO:
        texto

        TRATAMENTO RECOMENDADO:
        texto

        [INICIO_ORIGINAL]
        trecho original
        [FIM_ORIGINAL]

        [INICIO_SABOTAGEM]
        trecho alterado
        [FIM_SABOTAGEM]


        Código Suspeito escrito em {language}:
        {source_code}
        """
        try:

            response = self.model.generate_content(prompt)
            raw_text = response.text

            original_snippet = ""
            mutated_snippet = ""

            analysis_text = raw_text

            if "[INICIO_ORIGINAL]" in raw_text and "[FIM_ORIGINAL]" in raw_text:

                original_snippet = (
                    raw_text.split("[INICIO_ORIGINAL]")[1]
                    .split("[FIM_ORIGINAL]")[0]
                    .strip()
                )

            if "[INICIO_SABOTAGEM]" in raw_text and "[FIM_SABOTAGEM]" in raw_text:

                mutated_snippet = (
                    raw_text.split("[INICIO_SABOTAGEM]")[1]
                    .split("[FIM_SABOTAGEM]")[0]
                    .strip()
                )

            # remove blocos ocultos do relatório
            import re

            analysis_text = re.sub(
                r"\[INICIO_ORIGINAL\].*?\[FIM_ORIGINAL\]",
                "",
                analysis_text,
                flags=re.DOTALL,
            )

            analysis_text = re.sub(
                r"\[INICIO_SABOTAGEM\].*?\[FIM_SABOTAGEM\]",
                "",
                analysis_text,
                flags=re.DOTALL,
            )

            return {
                "analysis": self._format_output(analysis_text),
                "original_snippet": original_snippet,
                "mutated_snippet": mutated_snippet,
                "sanity_damage": 15,
            }

        except Exception as e:

            return {
                "analysis": f"Falha na varredura psiquiátrica: {e}",
                "original_snippet": "",
                "mutated_snippet": "",
                "sanity_damage": 0,
            }

    def _format_output(self, text: str) -> str:
        lines = []
        for paragraph in text.split("\n"):
            if not paragraph.strip():
                lines.append("")
                continue

            palavras = paragraph.split(" ")
            linha_atual = []
            tamanho_atual = 0

            for palavra in palavras:
                if tamanho_atual + len(palavra) + 1 > 80:
                    lines.append(" ".join(linha_atual))
                    linha_atual = [palavra]
                    tamanho_atual = len(palavra)
                else:
                    linha_atual.append(palavra)
                    tamanho_atual += len(palavra) + 1

            if linha_atual:
                lines.append(" ".join(linha_atual))

        return "\r\n".join(lines)
