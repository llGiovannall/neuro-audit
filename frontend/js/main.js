import { TerminalAdapter } from './terminal_adapter.js';
import { MonacoEditorAdapter } from './editor_adapter.js';
import { FileExplorer } from './file_explorer.js';
import { AuditReport } from './audit_report.js';
import { NotificationAdapter } from './infrastructure/ui/notification_adapter.js';
import { ShortcutFactory } from './core/application/factories/shortcut_factory.js';
import { HandleShortcutUseCase } from './core/application/use_cases/handle_shortcuts.js';
import { HandleButtonClickUseCase } from './core/application/use_cases/handle_buttons.js';

class AppController {
    constructor() {
        this.state = {
            ultimaAnaliseIA: "",
            arquivoAbertoAtual: null,
            sanityLevel: 100
        };

        this.terminal = null;
        this.editor = null;
        this.lastAudit = null;
        this.notificationAdapter = new NotificationAdapter();
        this.shortcutFactory = new ShortcutFactory();
        this.buttonUseCase = new HandleButtonClickUseCase(this.notificationAdapter);
        this.shortcutUseCase = null;

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

        this.shortcutUseCase = new HandleShortcutUseCase(
            this.editor,
            this.notificationAdapter,
            this,
            this.shortcutFactory
        );

        window.addEventListener('keydown', (e) => {
            this.shortcutUseCase.execute(e);
        }, true);

        await FileExplorer.loadFiles();
        FileExplorer.initCreateActions();
    }

    bindEvents() {
        const btnAudit = document.getElementById('btn-audit');
        if (btnAudit) btnAudit.addEventListener('click', () => this.auditarESalvarNoBanco());

        const btnOpenFolder = document.getElementById('btn-open-folder');
        if (btnOpenFolder) btnOpenFolder.addEventListener('click', () => this.selecionarDiretorioAlvo());

        const tabExplorer = document.getElementById('tab-explorer');
        if (tabExplorer) {
            tabExplorer.addEventListener('click', () => {
                this.switchSidebarTab('tab-explorer');
            });
        }

        const fakeTabs = ['tab-vcs', 'tab-analytics', 'tab-settings'];
        fakeTabs.forEach(tabId => {
            const el = document.getElementById(tabId);
            if (el) {
                el.addEventListener('click', () => {
                    this.buttonUseCase.execute(tabId);
                });
            } else {
                console.warn(`[DEBUG] O botão com ID ${tabId} não foi encontrado no HTML.`);
            }
        });

        const closeReport = document.getElementById('btn-close-report');
        if (closeReport) {
            closeReport.addEventListener('click', () => {
                const modal = document.getElementById('audit-report-modal');
                if (modal) {
                    modal.classList.add('hidden');
                }

                if (typeof AuditReport !== 'undefined' && typeof AuditReport.hide === 'function') {
                    AuditReport.hide();
                }
            });
        }
        const btnGeneratePdf = document.getElementById('btn-generate-pdf');
        if (btnGeneratePdf) {
            btnGeneratePdf.addEventListener('click', async () => {
                this.terminal.printLine("\r\n[SYSTEM] A compilar dossiê forense a partir do arquivo JSON...");
                try {
                    const response = await fetch("http://127.0.0.1:5000/api/reports/generate-pdf", { method: 'POST' });
                    if(response.ok) {
                        this.notificationAdapter.showSuccess("Dra. S.A.R.A.: PDF Consolidado gerado com sucesso.");
                        this.terminal.printLine("[SYSTEM] Dossiê gerado. Verifique a pasta raiz.");
                    } else {
                        throw new Error("Dra. S.A.R.A.: Falha na geração do PDF.");
                    }
                } catch(error) {
                    this.notificationAdapter.showError("Erro fatal: " + error.message);
                }
            });
        }
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
                const rawOutput = data.output || data.resultado || data.mensagem || data.error;

                if (rawOutput) {
                    saida = String(rawOutput);
                } else {
                    const cleanData = {};
                    for (const key in data) {
                        if (data[key] !== null) cleanData[key] = data[key];
                    }
                    saida = JSON.stringify(cleanData, null, 2);
                }
            }

            if (saida && saida.trim() !== "") {
                this.terminal.printLine("\r\n" + saida.replace(/\n/g, "\r\n"));
            } else {
                this.terminal.printLine("\r\n[AVISO] Comando executado, mas sem resposta de texto.");
            }

        } catch (error) {
            this.terminal.printLine(`\r\n[ERRO CRÍTICO] Falha S.O.`);
        }

        this.terminal.printPrompt();
    }

    async selecionarDiretorioAlvo() {
        this.terminal.printLine("\r\n[SYSTEM] A invocar o sistema operativo nativo...");

        try {
            const response = await fetch("http://127.0.0.1:5000/selecionar-pasta", { method: 'GET' });
            if (!response.ok) throw new Error(`Falha HTTP: ${response.status}`);

            const data = await response.json();

            if (data.status === "sucesso") {
                this.terminal.printLine(`[OK] Workspace montado: ${data.pasta}`);
                await FileExplorer.loadFiles(data.pasta);
            } else if (data.status === "cancelado") {
                this.terminal.printLine("[AVISO] Seleção cancelada pelo utilizador.");
            } else {
                this.terminal.printLine(`[ERRO] ${data.message || 'Erro desconhecido.'}`);
            }
            this.terminal.printPrompt();

        } catch (error) {
            this.terminal.printLine(`\r\n[ERRO CRÍTICO] Falha S.O: ${error.message}`);
            this.terminal.printPrompt();
        }
    }

    async auditarCodigoDeTeste() {
        if (!this.state.arquivoAbertoAtual) {
            this.terminal.printLine("[ERRO] Nenhum arquivo aberto.");
            return;
        }

        const codigo = this.editor.getValue();

        const response = await fetch("http://127.0.0.1:5000/auditar-codigo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                codigo,
                arquivo: this.state.arquivoAbertoAtual
            })
        });

        const data = await response.json();

        if (data.original_snippet && data.mutated_snippet) {
            const codigoAtual = this.editor.getValue();
            const codigoNovo = codigoAtual.replace(
                data.original_snippet,
                data.mutated_snippet
            );
            this.editor.updateContent(codigoNovo);
        }

        this.reduzirSanidadeVisual(data.sanity_damage || 15);
        AuditReport.show(data.analysis, this.state.sanityLevel);
    }

    triggerIdeCrash() {
        const container = document.getElementById('editor-container');
        if (container) container.style.display = 'none';

        const crashScreen = document.createElement('div');
        crashScreen.id = 'crash-screen';
        crashScreen.className = 'absolute inset-0 z-[999] flex flex-col items-center justify-center bg-[#050505] bg-opacity-95 backdrop-blur-md';
        crashScreen.innerHTML = `
            <div class="text-center p-12 border border-red-800 bg-black shadow-[0_0_100px_rgba(220,38,38,0.4)]">
                <span class="material-symbols-outlined text-red-600 text-7xl mb-4" style="font-variation-settings: 'FILL' 1;">skull</span>
                <h1 class='text-red-600 font-bold text-5xl mb-2 drop-shadow-[0_0_15px_rgba(220,38,38,1)]'>
                    CODIGO 42: IDE MORTA
                </h1>
                <p class='text-gray-500 mb-10 text-lg uppercase tracking-widest'>Violação de Diretriz Crítica: Ctrl+V</p>
                <button id='btn-restart-ide' class='border border-red-600 px-8 py-3 text-red-500 hover:bg-red-600 hover:text-black transition-all font-bold tracking-widest uppercase'>
                    REINICIAR SISTEMA (PERDER TUDO)
                </button>
            </div>
        `;

        document.querySelector('main').appendChild(crashScreen);

        document.getElementById('btn-restart-ide').addEventListener('click', () => {
            this.restartIDE();
        });
    }

    restartIDE() {
        const crashScreen = document.getElementById('crash-screen');
        if (crashScreen) crashScreen.remove();

        const container = document.getElementById('editor-container');
        if (container) container.style.display = 'block';

        this.state.arquivoAbertoAtual = null;
        this.state.sanityLevel = 100;
        this.reduzirSanidadeVisual(0);

        const codigoInicial = `# Neuro Audit - Sistema Restaurado após falha crítica.\n# O Workspace foi fechado. Selecione um novo repositório...`;
        if (typeof this.editor.updateContent === 'function') {
            this.editor.updateContent(codigoInicial);
        } else {
            this.editor.setValue(codigoInicial);
        }

        const fileTree = document.getElementById('file-tree-container');
        if (fileTree) fileTree.innerHTML = '';
        const rootName = document.getElementById('root-folder-name');
        if (rootName) rootName.textContent = 'NENHUM WORKSPACE';

        this.terminal.printLine("\r\n[SYSTEM] Reinicialização forçada concluída. Todo o estado não salvo foi pulverizado.");
        this.terminal.printPrompt();
    }

    async auditarESalvarNoBanco() {
        await this.auditarCodigoDeTeste();

        const codigoFinal = this.editor.getValue();

        await this.persistirNoBancoDeDados(codigoFinal);
    }

    async persistirNoBancoDeDados(codigo) {
        if (!this.state.arquivoAbertoAtual) {
            this.notificationAdapter.showWarning("Não há arquivo rastreado para salvar no banco.");
            return;
        }

        this.terminal.printLine(`\r\n[DB] Sincronizando Sanidade (${this.state.sanityLevel}%) com o Banco de Dados SQL...`);

        try {
            const response = await fetch("http://127.0.0.1:5000/api/database/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    arquivo: this.state.arquivoAbertoAtual,
                    codigo: codigo,
                    sanity: this.state.sanityLevel,
                    nome: "Dev Cobaia",
                    email: "cobaia@neuroaudit.com"
                })
            });

            if (response.ok) {
                this.notificationAdapter.showSuccess("Sanidade e logs persistidos no Banco de Dados.");
                this.terminal.printLine("[DB] Persistência concluída (O histórico de incompetência foi gravado).");
            } else {
                throw new Error("O Banco de Dados rejeitou essa atrocidade.");
            }
        } catch (error) {
            this.notificationAdapter.showError("Falha de Persistência: " + error.message);
            this.terminal.printLine(`[DB ERRO] ${error.message}`);
        }
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
