class MonacoEditorAdapter{
    constructor(divId) {
        this.divId = divId;
        this.editor = null;
    }

    async initialize(textoInicial, linguagem) {
        window.MonacoEnvironment = {
            getWorkerUrl: function (workerId, label) {
                return `data:text/javascript;charset=utf-8,${encodeURIComponent(
                    "self.MonacoEnvironment = { baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/' }; importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/base/worker/workerMain.js');"
                )}`;
            }
        };

        return new Promise((resolve) => {
            require(['vs/editor/editor.main'], () => {
                this.editor = monaco.editor.create(document.getElementById(this.divId), {
                    value: textoInicial || '',
                    theme: 'vs-dark',
                    language: linguagem || 'language'
                });
                resolve();
            });
        });
    }

 
getValue(){
    return this.editor.getValue();
}

updateContent(novoTexto){
    this.editor.setValue(novoTexto);
}


setLanguage(lang){
    monaco.editor.setModelLanguage(this.editor.getModel(), lang);

}
refreshLayout(){
    this.editor.layout();
}

bindSaveShortCut(callback){
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        callback();
    });
}}