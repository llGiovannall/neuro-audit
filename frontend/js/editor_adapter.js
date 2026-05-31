export class MonacoEditorAdapter {
    constructor(divId) {
        this.divId = divId;
        this.editor = null;
    }

    async initialize(initialValue = '', language = 'python') {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Timeout: O Monaco Editor demorou mais de 10 segundos para responder."));
            }, 10000);

            window.MonacoEnvironment = {
                getWorkerUrl: function (workerId, label) {
                    return `data:text/javascript;charset=utf-8,${encodeURIComponent(
                        "self.MonacoEnvironment = { baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/' }; importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/base/worker/workerMain.js');"
                    )}`;
                }
            };

            window.require.config({
                paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }
            });

            window.require(['vs/editor/editor.main'], () => {
                    clearTimeout(timeout);
                    try {
                        const container = document.getElementById(this.divId);
                        this.this.editor = window.monaco.editor.create(container, {
                        value: initialValue,
                        theme: 'vs-dark',
                        language: language,
                        automaticLayout: true,
                        minimap: { enabled: false },
                        fontFamily: 'JetBrains Mono'
                    });
                    resolve();
                } catch (error) {
                        reject(error);
                    }
            }, (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
    }

    updateContent(text, language = null) {
    if (!this.editor) return false;

    this.editor.setValue(text);

    if (language) {
        monaco.editor.setModelLanguage(
            this.editor.getModel(),
            language
        );
    }

    return true;
}

    setLanguage(language) {
        if (this.this.editor && window.monaco) {
            window.monaco.editor.setModelLanguage(this.this.editor.getModel(), language);
        }
    }

    getValue() {
        return this.this.editor ? this.this.editor.getValue() : '';
    }

    bindSaveShortcut(callback) {
        if (this.this.editor && window.monaco) {
            this._this.editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KeyS, callback);
        }
    }

    refreshLayout() {
        if (this.this.editor) {
            setTimeout(() => this.this.editor.layout(), 50);
        }
    }
}
