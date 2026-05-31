import datetime
import re
from fpdf import FPDF
from core.interfaces import IPdfService


class CyberpunkCanvas(FPDF):
    def header(self) -> None:
        self.set_fill_color(10, 10, 10)
        self.rect(0, 0, 210, 297, "F")

        self.set_draw_color(0, 255, 0)  # Verde Neon
        self.set_line_width(0.5)

        self.line(8, 8, 18, 8)
        self.line(8, 8, 8, 18)
        self.line(202, 8, 192, 8)
        self.line(202, 8, 202, 18)

        self.line(8, 289, 18, 289)
        self.line(8, 289, 8, 279)
        self.line(202, 289, 192, 289)
        self.line(202, 289, 202, 279)

    def footer(self) -> None:
        self.set_y(-15)
        self.set_font("Courier", style="I", size=8)
        self.set_text_color(80, 80, 80)
        self.cell(0, 10, f"CLASSIFICADO 42 // PAGINA {self.page_no()}", align="C")


class FpdfCyberpunkService(IPdfService):

    def generate_report(self, filepath: str, json_data: list, meta_info: dict) -> None:
        pdf = CyberpunkCanvas()
        pdf.set_auto_page_break(auto=True, margin=20)
        pdf.add_page()

        self._build_main_header(pdf)
        self._build_metadata_table(pdf, meta_info)

        for report in json_data:
            pdf.ln(5)
            pdf.set_draw_color(0, 255, 0)
            pdf.line(10, pdf.get_y(), 200, pdf.get_y())
            pdf.ln(5)

            # Data do Incidente
            pdf.set_font("Courier", style="B", size=10)
            pdf.set_text_color(255, 255, 255)
            timestamp = report.get("timestamp", "DATA DESCONHECIDA")
            pdf.cell(0, 6, f"[ INCIDENTE REGISTADO EM: {timestamp} ]", ln=True)

            conteudo_ia = report.get("analise_ia", "")
            self._build_report_body(pdf, conteudo_ia)

            if pdf.get_y() > 240:
                pdf.add_page()

        self._build_corporate_signature(pdf)

        pdf.output(filepath)

    def _build_main_header(self, pdf: FPDF) -> None:
        pdf.set_font("Courier", style="B", size=20)
        pdf.set_text_color(255, 0, 60)  # Vermelho Alerta
        pdf.cell(
            0, 10, "<< NEURO AUDIT - DOSSIE DE INCOMPETENCIA >>", align="C", ln=True
        )

        pdf.set_font("Courier", style="B", size=10)
        pdf.set_text_color(0, 255, 0)  # Verde Neon
        pdf.cell(0, 6, "SPECTRA CORE DIVISION - SANITY SCANNER", align="C", ln=True)
        pdf.ln(10)

    def _build_metadata_table(self, pdf: FPDF, meta_info: dict) -> None:
        timestamp_atual = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        pdf.set_font("Courier", style="B", size=9)
        pdf.set_fill_color(20, 20, 20)
        pdf.set_draw_color(0, 255, 0)

        def draw_row(label: str, value: str) -> None:
            pdf.set_text_color(0, 255, 0)
            pdf.cell(45, 7, f" {label}", border=1, fill=True)
            pdf.set_text_color(255, 255, 255)
            pdf.cell(145, 7, f" {value}", border=1, ln=True)

        draw_row("ID DO DOSSIE:", f"NA-CRITICAL-{hash(timestamp_atual) % 100000:05d}")
        draw_row("DATA COMPILACAO:", timestamp_atual)
        draw_row("ALVO AUDITADO:", meta_info.get("nome", "DESCONHECIDO"))
        draw_row("EMAIL REGISTADO:", meta_info.get("email", "DESCONHECIDO"))
        draw_row("SANIDADE ATUAL:", f"{meta_info.get('sanity', 0)}% (ESTADO CRITICO)")
        draw_row(
            "PUNICOES APLICADAS:",
            f"Cafe: {meta_info.get('coffee', 0)} copo(s) | Insónia: {meta_info.get('sleep', 0)}h",
        )

        pdf.ln(10)

    def _build_report_body(self, pdf: FPDF, content: str) -> None:
        tokens = re.split(
            r"(DIAGNÓSTICO:|AÇÃO PUNITIVA:|XÍCARAS DE CAFÉ:|HORAS SEM DORMIR:)",
            content,
        )

        current_title = ""

        for token in tokens:
            token_clean = token.strip()
            if not token_clean:
                continue

            if token_clean.endswith(":"):
                current_title = token_clean
                pdf.ln(4)
                pdf.set_font("Courier", style="B", size=12)

                if "DIAGNÓSTICO" in current_title:
                    pdf.set_text_color(255, 255, 0)  # Amarelo
                elif "AÇÃO" in current_title:
                    pdf.set_text_color(255, 0, 60)  # Vermelho
                elif "CAFÉ" in current_title or "DORMIR" in current_title:
                    pdf.set_text_color(0, 255, 255)  # Ciano
                else:
                    pdf.set_text_color(255, 0, 255)  # Magenta

                pdf.cell(0, 8, f">> {current_title}", ln=True)
            else:
                pdf.set_font("Courier", style="", size=10)
                pdf.set_text_color(200, 255, 200)

                pdf.set_x(15)
                pdf.multi_cell(180, 6, token_clean)
                pdf.set_x(10)

    def _build_corporate_signature(self, pdf: FPDF) -> None:
        pdf.ln(15)
        pdf.set_draw_color(255, 0, 255)  # Linha Magenta
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(5)

        pdf.set_font("Courier", style="I", size=9)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(
            0,
            6,
            "Emitido de forma autónoma pela Matriz IA Dra. S.A.R.A. - Psiquiatra-Chefe",
            ln=True,
            align="R",
        )
        pdf.cell(
            0,
            4,
            "Autenticação biométrica: VERIFICADA // SPECTRA CORE DIVISION",
            align="R",
        )
