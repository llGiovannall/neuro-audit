import {file_explorer} from "./file_explorer.js";
import {editor_adapter} from "./editor_adapter.js";
import {apiservice} from "./api_service.js";
import {terminaladapter} from "./terminal_adapter.js";
import {refreshLayout} from "./layout_manager.js";


class AppController {
    constructor() {
        this.state = {
            ultimaAnaliseIA:"",
            arquivoAbertoAtual: null
        }
  this.fileExplorer = new file_explorer('file-tree',
 this.handleFileSelect.bind(this));

this.editorAdapter = new editor_adapter('editor');
this.apiService = new apiservice();

this.terminalAdapter = new terminaladapter( 'terminal',
    document.getElementById("terminal"));

this.editorReady = this.initEditor();
    

        this.bindEvents();
        this.switchTab(this.terminalAdapter);
        this.handleTerminalCommand(command);
        this.handleFileSelect = this.handleFileSelect(filepath);
        this.editorReady = this.initEditor();
    }

   bindEvents() {
    document.getElementById('tab-terminal')
            .addEventListener('click', () => this.switchTab('terminal'));
 
        document.getElementById('tab-editor')
            .addEventListener('click', () => this.switchTab('editor'));
 
        document.getElementById('save-btn')
            .addEventListener('click', () => this.salvarArquivo());
 
        document.getElementById('analyze-btn')
            .addEventListener('click', () => this.auditarCodigoAtual());
 
        document.getElementById('export-btn')
            .addEventListener('click', () => this.exportarLaudo());

        };
    

 switchTab(tab) {
      const terminal = document.getElementById('terminal');
      const editor = document.getElementById('editor');
      const explorer = document.getElementById('file-tree');


     if (tab === 'terminal') {
            terminalPane.classList.remove('hidden');
            editorPane.classList.add('hidden');
        } else {
            terminalPane.classList.add('hidden');
            editorPane.classList.remove('hidden');
           
            this.editorAdapter.refreshLayout();
        }
    }
    



 async   handleTerminalCommand(command) {
        ApiService.post('/commands', { command });
    if (command = terminalCommand) {
        console.log('Terminal command received:', command.data);
      if (command = analysis) {
        state.ultimaAnaliseIA = command.data;

      
    }
}
 }

async handleFileSelect(filepath) {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
    const extension = '.' + filepath.split('.').pop().toLowerCase();
    const domEditor = document.getElementById('editor-container');
    const domViewer = document.getElementById('viewer-container');


    if (imageExtensions.includes(extension)) {
        domEditor.classList.add('hidden');
        domViewer.classList.remove('hidden');

this.state.arquivoAbertoAtual = filepath;
    const nomeArquivo = filepath.split('/').pop();
    document.getElementById('current-file-name').innerText = `Arquivo: ${nomeArquivo}`;

       const img = document.getElementById('image-viewer');
         if (img) img.src = filepath;
        } else { 
            domViewer.classList.add('hidden');
            domEditor.classList.remove('hidden');

    }

 try { await this.editorReady;
                const response = await this.apiService.readFile(filepath);
                if (response.success) {
                    this.editorAdapter.setContent(response.data);
                }
            } catch (error) {
                console.error('Erro ao abrir arquivo:', error);
            }
 
            this.switchTab('editor');
        }
    
        


    async initEditor() {
        try {
            return Promise.resolve("NeuroAudit Iniciado");

        } catch (error) {
            console.error('Error initializing editor:', error);
        }

    }

    async salvarArquivo(){
         if (!this.state.arquivoAbertoAtual) {
            this.terminalAdapter.print('Nenhum arquivo aberto para salvar.');
            return;
        }
    
 const content = this.editorAdapter.getContent();
        await this.apiService.saveFile(this.state.arquivoAbertoAtual, content);
        this.terminalAdapter.print(`Arquivo salvo: ${this.state.arquivoAbertoAtual}`);}

    async auditarCodigoAtual(){
     
            const content = this.editorAdapter.getContent();
            switchTab('terminal');
           this.terminalAdapter.print('Auditando código...');
            const response = await this.apiService.auditCode(content);
            if (response.success) {
                this.state.ultimaAnaliseIA = response.data;
                this.terminalAdapter.print(response.data);
        } else {
            this.terminalAdapter.print('Erro na auditoria: ' + response.error);
        }
                ;
            }
        

        async exportarLaudo(){
         if (!this.state.ultimaAnaliseIA) {
            this.terminalAdapter.print('Nenhuma análise disponível para exportar. Execute a auditoria primeiro.');
            return;
    }
     const result = await this.apiService.exportData(this.state.ultimaAnaliseIA);
        this.terminalAdapter.print(`Laudo exportado: ${result.filename || 'laudo.pdf'}`);}

   
}
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
});