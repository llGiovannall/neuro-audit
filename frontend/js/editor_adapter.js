export class MonacoEditorAdapter {
    constructor(divId) {
        this.divId = divId;
        this.editor = null;
    }

    async initialize(textoInicial, linguagem) {
        window.require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' }});

        window.MonacoEnvironment = {
            getWorkerUrl: function (workerId, label) {
                return `data:text/javascript;charset=utf-8,${encodeURIComponent(
                    "self.MonacoEnvironment = { baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/' }; importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/base/worker/workerMain.js');"
                )}`;
            }
        };

        return new Promise((resolve) => {
            window.require(['vs/editor/editor.main'], () => {
                this.editor = window.monaco.editor.create(document.getElementById(this.divId), {
                    value: textoInicial || '',
                    theme: 'vs-dark',
                    language: linguagem || 'python',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    fontFamily: 'JetBrains Mono'
                });
                resolve();
            });
        });
    }

    getValue() { return this.editor.getValue(); }
    updateContent(novoTexto) { this.editor.setValue(novoTexto); }
    setLanguage(lang) { window.monaco.editor.setModelLanguage(this.editor.getModel(), lang); }
}
