import { TerminalAdapter } from './terminal_adapter.js';
import { MonacoEditorAdapter } from './editor_adapter.js';
import { FileExplorer } from './file_explorer.js';

class AppController {
    constructor() {
        this.state = {
            ultimaAnaliseIA: "",
            arquivoAbertoAtual: null,
            sanityLevel: 100
        };

        this.terminal = null;
        this.editor = null;

        this.bindEvents();
    }

    async init() {
        this.terminal = new TerminalAdapter('terminal-container', (comando) => {
            this.handleTerminalCommand(comando);
        });
        this.terminal.printLine("[SYSTEM] Torre de Controlo Instância 42 inicializada.");
        this.terminal.printPrompt();

        this.editor = new MonacoEditorAdapter('editor-container');
        const codigoInicial = `# Neuro Audit - Espaço de Trabalho em Branco\n# Aguardando a seleção de um ficheiro no explorador...`;
        await this.editor.initialize(codigoInicial, 'python');

        await FileExplorer.loadFiles();
    }

    bindEvents() {
        const btnAudit = document.getElementById('btn-audit');
        if (btnAudit) {
            btnAudit.addEventListener('click', () => this.auditarCodigoDeTeste());
        }

        const btnOpenFolder = document.getElementById('btn-open-folder');
        if (btnOpenFolder) {
            btnOpenFolder.addEventListener('click', () => this.selecionarDiretorioAlvo());
        }

        const tabs = ['tab-explorer', 'tab-vcs', 'tab-analytics'];
        tabs.forEach(tabId => {
            const el = document.getElementById(tabId);
            if (el) {
                el.addEventListener('click', () => this.switchSidebarTab(tabId));
            }
        });
    }

    switchSidebarTab(activeId) {
        ['tab-explorer', 'tab-vcs', 'tab-analytics'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('bg-brand-highlight', 'text-black', 'font-bold');
                el.classList.add('text-gray-400');
            }
        });

        const activeEl = document.getElementById(activeId);
        if (activeEl) {
            activeEl.classList.remove('text-gray-400');
            activeEl.classList.add('bg-brand-highlight', 'text-black', 'font-bold');
        }
    }

    async handleTerminalCommand(comando) {
        if (!comando.trim()) {
            this.terminal.printPrompt();
            return;
        }

        this.terminal.printLine(`\r\n[MATRIZ] A processar comando: ${comando}...`);

        try {
            const response = await fetch("http://127.0.0.1:5000/command", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: comando })
            });

            if (!response.ok) throw new Error(`Falha HTTP`);

            const data = await response.json();

            let saida = "";
            if (typeof data === "string") {
                saida = data;
            } else if (data && typeof data === "object") {
                saida = data.output || data.analysis || data.resultado || data.message || JSON.stringify(data, null, 2);
            }

            if (saida) {
                this.terminal.printLine(saida.replace(/\n/g, "\r\n"));
            } else {
                this.terminal.printLine("[AVISO] Comando executado, mas o Python não retornou output visível.");
            }

        } catch (error) {
            this.terminal.printLine(`[ERRO] Falha de comunicação com o Backend.`);
        }

        this.terminal.printPrompt();
    }

    async selecionarDiretorioAlvo() {
        this.terminal.printLine("\r\n[SYSTEM] A invocar o sistema operativo nativo...");

        try {
            const response = await fetch("http://127.0.0.1:5000/selecionar-pasta", {
                method: 'GET'
            });

            if (!response.ok) throw new Error(`Falha HTTP: ${response.status}`);

            const data = await response.json();

            if (data.status === "sucesso") {
                this.terminal.printLine(`[OK] Workspace montado: ${data.pasta}`);

                await FileExplorer.loadFiles(data.pasta);

            } else if (data.status === "cancelado") {
                this.terminal.printLine("[AVISO] O utilizador cancelou a seleção.");
            } else {
                this.terminal.printLine(`[ERRO] Não foi possível mapear o diretório.`);
            }

            this.terminal.printPrompt();

        } catch (error) {
            this.terminal.printLine(`\r\n[ERRO CRÍTICO] Falha de ligação à API: ${error.message}`);
            this.terminal.printPrompt();
        }
    }

    async auditarCodigoDeTeste() {
        this.terminal.printLine("\r\n[PROCESSANDO] Matriz Neural S.A.R.A ativada...");
        this.reduzirSanidadeVisual(15);
        this.terminal.printLine("[INFO] Auditoria requer ficheiro carregado no editor.");
        this.terminal.printPrompt();
    }

    reduzirSanidadeVisual(dano) {
        this.state.sanityLevel = Math.max(0, this.state.sanityLevel - dano);
        const bar = document.getElementById('sanity-progress-bar');
        const valueText = document.getElementById('sanity-value');
        valueText.textContent = `${this.state.sanityLevel}%`;
        bar.style.width = `${this.state.sanityLevel}%`;

        if(this.state.sanityLevel <= 50) {
            bar.classList.replace('bg-brand-neon', 'bg-red-500');
            valueText.classList.replace('text-brand-neon', 'text-red-500');
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    window.app = new AppController();
    await window.app.init();
});
