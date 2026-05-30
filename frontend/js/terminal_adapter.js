export class TerminalAdapter {
    constructor(divId, enterCallBack) {
        this.terminal = new window.Terminal({
            theme: { background: '#0a0a0a', foreground: '#39FF14' },
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13,
            cursorBlink: true
        });

        this.terminal.open(document.getElementById(divId));
        this.onEnterCallback = enterCallBack;
        this.comandoAtual = "";

        this.terminal.onData((tecla) => {
            if (tecla === '\r') {
                if (typeof this.onEnterCallback === 'function') {
                    this.onEnterCallback(this.comandoAtual);
                }
                this.comandoAtual = "";
            } else if (tecla === '\x7f') { // Backspace
                if (this.comandoAtual.length > 0) {
                    this.comandoAtual = this.comandoAtual.slice(0, -1);
                    this.terminal.write('\b \b');
                }
            } else {
                this.comandoAtual += tecla;
                this.terminal.write(tecla);
            }
        });
    }

    printPrompt() {
        this.terminal.write('\r\nuser@neuro-audit:~$ ');
    }

    print(texto){
        this.terminal.write(texto);
    }

    printLine(texto){
        this.terminal.write(texto + '\r\n');
    }
}
