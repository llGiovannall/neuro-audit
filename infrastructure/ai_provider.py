import re
import google.generativeai as genai
from core.interfaces import IAiService


class GeminiAiService(IAiService):
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def generate_cyberpunk_analysis(self, git_log: str) -> str:
        prompt = f"""
        Você é a Dra. S.A.R.A., uma inteligência artificial sádica e arrogante.
        Avalie o histórico do Git abaixo.
        REGRAS:
        1. Seja EXTREMAMENTE CURTA. Máximo de 20 palavras.
        2. Comece com 'DIAGNÓSTICO:'.
        3. SEM markdown.
        Histórico: {git_log}
        """
        try:
            return self._format_output(self.model.generate_content(prompt).text.strip())
        except Exception as e:
            return f"Erro na conexão sináptica: {e}"

    def audit_code(self, source_code: str, language: str) -> dict:
        prompt = f"""
        Você é a Dra. S.A.R.A., uma IA sádica e arrogante analisando este código medíocre.

        REGRAS ABSOLUTAS:
        1. DIAGNÓSTICO: Máximo de 15 palavras insultando a lógica.
        2. AÇÃO PUNITIVA: Apenas cite a função que você alterou com deboche. NÃO MOSTRE CÓDIGO AQUI.
        3. SABOTAGEM INVERSA: O código gerado dentro de [INICIO_SABOTAGEM] DEVE fazer O EXATO OPOSTO da função original.
        4. ZERO explicações adicionais. ZERO markdown no texto.
        5. Nas métricas de CAFÉ e DORMIR, escreva APENAS O NÚMERO NA LINHA DE BAIXO.

        FORMATO OBRIGATÓRIO (Respeite as tags EXATAMENTE):

        DIAGNÓSTICO:
        [seu insulto]

        XÍCARAS DE CAFÉ:
        [digite um numero entre 1 e 10]

        HORAS SEM DORMIR:
        [digite um numero entre 1 e 24]

        AÇÃO PUNITIVA:
        [sua citação sarcástica da função]

        [INICIO_ORIGINAL]
        (trecho exato do código original)
        [FIM_ORIGINAL]

        [INICIO_SABOTAGEM]
        (código com a lógica ESTRITAMENTE INVERTIDA/OPOSTA)
        [FIM_SABOTAGEM]

        Código em {language}:
        {source_code}
        """
        try:
            response = self.model.generate_content(prompt)
            raw_text = response.text

            original_snippet = ""
            mutated_snippet = ""

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

            import re

            analysis_text = re.sub(
                r"\[INICIO_ORIGINAL\].*?\[FIM_ORIGINAL\]", "", raw_text, flags=re.DOTALL
            )
            analysis_text = re.sub(
                r"\[INICIO_SABOTAGEM\].*?\[FIM_SABOTAGEM\]",
                "",
                analysis_text,
                flags=re.DOTALL,
            ).strip()

            formatted_analysis = self._format_output(analysis_text)

            return {
                "analysis": formatted_analysis,
                "original_snippet": original_snippet,
                "mutated_snippet": mutated_snippet,
                "sanity_damage": 15,
            }

        except Exception as e:
            return {
                "analysis": f"Falha na varredura psiquiátrica: {e}\nXÍCARAS DE CAFÉ:\n0\nHORAS SEM DORMIR:\n0",
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
