const icones = {
    py: './assets/icons8-serpente-48.png',
    js: './assets/icons8-javascript-24.png',
    css: './assets/icons8-css-48.png',
    java: './assets/icons8-logo-java-coffee-cup-48.png',
    txt: './assets/icons8-logo-txt-50.png',
    json: './assets/icons8-logo-json-50.png',
    md: './assets/icons8-circled-i-48.png'
};

function pegarIcone(caminho) {
    if (!caminho || !caminho.includes('.')) return null;
    const extensao = caminho.split('.').pop().toLowerCase();
    return icones[extensao] || null;
}

export class FileExplorer {

    static async loadFiles(caminho = null) {
        const container = document.getElementById('file-tree-container');
        if (!container) return;

        try {
            container.innerHTML = `<li class="text-brand-neon text-[11px] px-2 py-2 animate-pulse">A varrer diretório...</li>`;

            const bodyData = caminho ? JSON.stringify({ caminho: caminho }) : JSON.stringify({});

            const response = await fetch("http://127.0.0.1:5000/listar-arquivos", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: bodyData
            });

            if (!response.ok) throw new Error("Falha HTTP");

            const payload = await response.json();
            container.innerHTML = "";

            let arquivos = [];
            if (Array.isArray(payload)) {
                arquivos = payload;
            } else if (payload && typeof payload === "object") {
                arquivos = payload.arquivos || payload.files || payload.data || payload.resultado || [];
            }

            if (!Array.isArray(arquivos) || arquivos.length === 0) {
                container.innerHTML = `<li class="text-gray-500 text-[11px] px-2 italic">Sem ficheiros visíveis.</li>`;
                if (window.app && window.app.terminal) {
                    window.app.terminal.printLine(`\r\n[DEBUG API] O Python retornou isto: ${JSON.stringify(payload)}`);
                    window.app.terminal.printPrompt();
                }
                return;
            }

            arquivos.forEach(file => {
                const name = file.nome || file.name || file.arquivo || (typeof file === 'string' ? file : "Desconhecido");
                const isDir = file.tipo === 'diretorio' || file.type === 'directory' || file.is_dir || false;
                const filePath = file.caminho || file.path || file.caminho_absoluto || name;

                let iconHtml = '';
                if (isDir) {
                    iconHtml = `<span class="material-symbols-outlined text-[16px] text-brand-highlight" style="font-variation-settings: 'FILL' 1;">folder</span>`;
                } else {
                    const iconePersonalizado = pegarIcone(name);
                    if (iconePersonalizado) {
                        iconHtml = `<img src="${iconePersonalizado}" class="w-4 h-4 object-contain">`;
                    } else {
                        iconHtml = `<span class="material-symbols-outlined text-[16px] text-gray-400" style="font-variation-settings: 'FILL' 0;">description</span>`;
                    }
                }

                const li = document.createElement('li');
                li.innerHTML = `
                    <a class="flex items-center gap-2 px-2 py-1 text-[12px] hover:bg-brand-border cursor-pointer rounded-none text-gray-300 transition-colors select-none">
                        ${iconHtml}
                        <span class="truncate">${name}</span>
                    </a>
                `;

                li.addEventListener('click', async () => {
                    if (isDir) {
                        window.app.terminal.printLine(`\r\n[S.A.R.A] '${name}' é um diretório.`);
                        window.app.terminal.printPrompt();
                        return;
                    }

                    window.app.terminal.printLine(`\r\n[SYSTEM] A ler ${name}...`);

                    try {
                        const res = await fetch("http://127.0.0.1:5000/ler-arquivo", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ caminho: filePath })
                        });

                        if (!res.ok) throw new Error("A Instância 42 negou a leitura.");

                        const data = await res.json();
                        const conteudo = String(data.conteudo || data.content || data.texto || (typeof data === 'string' ? data : JSON.stringify(data, null, 2)));

                        window.app.editor.updateContent(conteudo);

                        if (name.endsWith('.py')) window.app.editor.setLanguage('python');
                        else if (name.endsWith('.js')) window.app.editor.setLanguage('javascript');
                        else if (name.endsWith('.json')) window.app.editor.setLanguage('json');
                        else window.app.editor.setLanguage('plaintext');

                        const editorTab = document.querySelector('#editor-tabs-container div');
                        if (editorTab) editorTab.innerHTML = `${iconHtml} <span class="ml-1 truncate">${name}</span>`;

                        window.app.state.arquivoAbertoAtual = filePath;
                        window.app.terminal.printLine(`[OK] Buffer de memória carregado.`);

                    } catch (error) {
                        window.app.terminal.printLine(`[ERRO] ${error.message}`);
                    }

                    window.app.terminal.printPrompt();
                });

                container.appendChild(li);
            });

        } catch (error) {
            console.error("Erro no FileExplorer:", error);
            container.innerHTML = `<li class="text-red-500 text-[11px] px-2">Falha no parsing S.O.</li>`;
        }
    }
}
