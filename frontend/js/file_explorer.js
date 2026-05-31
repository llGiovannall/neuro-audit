const icones = {
    py: './assets/py.png',
    js: './assets/js.png',
    css: './assets/css.png',
    html: './assets/html.png',
    php: './assets/php.png',
    java: './assets/java.png',
    txt: './assets/txt.png',
    json: './assets/json.png',
    sql: './assets/sql.png',
    md: './assets/md.png',
    png: './assets/png.png',
    jpg: './assets/jpg.png',
    jpeg: './assets/jpeg.png',
    webp: './assets/webp.png',
    gif: './assets/gif.png',
    c: './assets/c.png',
    cs: './assets/c#.png',
};

function pegarIcone(caminho) {
    if (!caminho || !caminho.includes('.')) return null;
    const extensao = caminho.split('.').pop().toLowerCase();
    return icones[extensao] || null;
}

export class FileExplorer {
    static initCreateActions() {
        const btnNewFile = document.getElementById('btn-new-file');
        const btnNewFolder = document.getElementById('btn-new-folder');

        if (btnNewFile) btnNewFile.onclick = () => this.triggerInlineInput(false);
        if (btnNewFolder) btnNewFolder.onclick = () => this.triggerInlineInput(true);
    }

    static triggerInlineInput(isDir) {
        const targetDir = window.app?.state?.lastActiveDirectory || window.app?.state?.currentWorkspace;

        if (!targetDir) {
            window.app.terminal.printLine("\r\n[ERRO] Selecione um Workspace ou Pasta primeiro.");
            return;
        }
        let targetUl = document.querySelector(`ul[data-path="${targetDir.replace(/\\/g, '\\\\')}"]`);
        if (!targetUl) targetUl = document.getElementById('file-tree-container');

        targetUl.classList.remove('hidden');

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="flex items-center gap-2 px-2 py-1 text-[12px] bg-brand-border border-l-2 border-brand-neon">
                <span class="material-symbols-outlined text-[16px] text-brand-neon" style="font-variation-settings: 'FILL' 1;">${isDir ? 'folder' : 'draft'}</span>
                <input type="text" class="bg-transparent border-none outline-none text-white w-full font-mono text-[12px] p-0 focus:ring-0" placeholder="${isDir ? 'Nova Pasta...' : 'novo_ficheiro.py'}">
            </div>
        `;
        targetUl.insertBefore(li, targetUl.firstChild);

        const input = li.querySelector('input');
        input.focus();

        let processado = false;
        const finalizar = async () => {
            if (processado) return;
            processado = true;
            const nome = input.value.trim();
            if (nome) {
                await this.createItem(targetDir, nome, isDir, targetUl);
            } else {
                li.remove();
            }
        };

        input.addEventListener('blur', finalizar);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') { input.value = ''; input.blur(); }
        });
    }

    static async createItem(basePath, nome, isDir, targetUl) {
        const separador = basePath.includes('\\') ? '\\' : '/';
        const fullPath = `${basePath}${separador}${nome}`;

        try {
            const res = await fetch("http://127.0.0.1:5000/criar-item", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caminho: fullPath, is_dir: isDir })
            });

            if (!res.ok) throw new Error("Backend recusou a criação.");
            const data = await res.json();
            console.log("RESPOSTA ARQUIVO:", data);
            if (data.status === "sucesso") {
                window.app.terminal.printLine(`\r\n[OK] ${nome} criado em ${basePath}.`);
                await this.loadFiles(basePath, targetUl);
            } else {
                window.app.terminal.printLine(`\r\n[ERRO] ${data.mensagem}`);
            }
        } catch (error) {
            window.app.terminal.printLine(`\r\n[ERRO] ${error.message}`);
        }
        window.app.terminal.printPrompt();
    }

    static async loadFiles(caminho = null, parentElement = null) {
        const container = parentElement || document.getElementById('file-tree-container');
        if (!container) return;

        if (!parentElement && caminho) {
            if(!window.app) window.app = {};
            if(!window.app.state) window.app.state = {};
            window.app.state.currentWorkspace = caminho;
            window.app.state.lastActiveDirectory = caminho;

            const folderName = caminho.split(/[/\\]/).pop();
            const titleEl = document.getElementById('root-folder-name');
            if (titleEl) titleEl.textContent = folderName;

            this.initCreateActions();
        }

        if (caminho) container.setAttribute('data-path', caminho);

        try {
            if (!parentElement) container.innerHTML = `<li class="text-brand-neon text-[11px] px-2 py-2 animate-pulse">A varrer...</li>`;
            else container.innerHTML = `<li class="text-brand-neon text-[11px] px-4 py-1">A carregar...</li>`;

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
            if (Array.isArray(payload)) arquivos = payload;
            else if (payload && typeof payload === "object") arquivos = payload.arquivos || payload.files || payload.data || payload.resultado || [];

            if (!Array.isArray(arquivos) || arquivos.length === 0) {
                container.innerHTML = `<li class="text-gray-500 text-[11px] px-2 italic pl-4 border-l border-brand-border ml-3 mt-1">Vazio</li>`;
                return;
            }

            arquivos.forEach(file => {
                const name = file.nome || file.name || file.arquivo || (typeof file === 'string' ? file : "Desconhecido");
                const isDir = file.tipo === 'diretorio' || file.type === 'directory' || file.is_dir || false;
                const filePath = file.caminho || file.path || file.caminho_absoluto || name;

                let iconHtml = '';
                if (isDir) {
                    iconHtml = `<span class="material-symbols-outlined text-[16px] text-brand-highlight folder-icon" style="font-variation-settings: 'FILL' 1;">folder</span>`;
                } else {
                    const iconePersonalizado = pegarIcone(name);
                    if (iconePersonalizado) iconHtml = `<img src="${iconePersonalizado}" class="w-4 h-4 object-contain">`;
                    else iconHtml = `<span class="material-symbols-outlined text-[16px] text-gray-400" style="font-variation-settings: 'FILL' 0;">description</span>`;
                }

                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="flex items-center gap-2 px-2 py-1 text-[12px] hover:bg-brand-border cursor-pointer rounded-none text-gray-300 transition-colors select-none">
                        ${iconHtml}
                        <span class="truncate">${name}</span>
                    </div>
                    <ul data-path="${filePath}" class="pl-4 border-l border-brand-border ml-3 mt-1 hidden"></ul>
                `;

                const clickTarget = li.querySelector('div');
                const subContainer = li.querySelector('ul');
                const iconSpan = li.querySelector('.folder-icon');

                clickTarget.addEventListener('click', async (e) => {
                    e.stopPropagation();

                    if (isDir) {
                        window.app.state.lastActiveDirectory = filePath;

                        const isHidden = subContainer.classList.contains('hidden');
                        if (isHidden) {
                            subContainer.classList.remove('hidden');
                            iconSpan.textContent = 'folder_open';
                            if (subContainer.children.length === 0) await FileExplorer.loadFiles(filePath, subContainer);
                        } else {
                            subContainer.classList.add('hidden');
                            iconSpan.textContent = 'folder';
                        }
                        return;
                    }
                    const isImage = name.match(/\.(png|jpe?g|webp|gif|svg|ico)$/i);
                    const editorDiv = document.getElementById('editor-container');
                    const imgViewerDiv = document.getElementById('image-viewer-container');
                    const imgTag = document.getElementById('image-viewer-img');

                    const editorTab = document.querySelector('#editor-tabs-container div');
                    if (editorTab) editorTab.innerHTML = `${iconHtml} <span class="ml-1 truncate text-brand-neon">${name}</span>`;

                    if (isImage && imgViewerDiv && editorDiv) {
                        window.app.terminal.printLine(`\r\n[SYSTEM] Renderizando imagem...`);
                        editorDiv.classList.add('hidden');
                        imgViewerDiv.classList.remove('hidden');
                        imgTag.src = `http://127.0.0.1:5000/exibir-midia?caminho=${encodeURIComponent(filePath)}`;
                        window.app.terminal.printPrompt();
                        return;
                    }

                    if (editorDiv && imgViewerDiv) {
                        editorDiv.classList.remove('hidden');
                        imgViewerDiv.classList.add('hidden');
                    }

                    window.app.terminal.printLine(`\r\n[SYSTEM] A ler ficheiro de código...`);
                    try {
                        const res = await fetch("http://127.0.0.1:5000/ler-arquivo", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ caminho: filePath })
                        });

                        if (!res.ok) throw new Error("A API falhou.");
                        const data = await res.json();
                        if(data.status === "erro") throw new Error(data.mensagem);

                        let conteudoLimpo = "";
                        if (typeof data === "string") conteudoLimpo = data;
                        else if (data.conteudo) conteudoLimpo = typeof data.conteudo === 'string' ? data.conteudo : JSON.stringify(data.conteudo);
                        else if (data.content) conteudoLimpo = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
                        else if (data.texto) conteudoLimpo = typeof data.texto === 'string' ? data.texto : JSON.stringify(data.texto);
                        else conteudoLimpo = JSON.stringify(data, null, 2);

                        let lang = 'plaintext';
                        if (name.endsWith('.py')) lang = 'python';
                        else if (name.endsWith('.js')) lang = 'javascript';
                        else if (name.endsWith('.json')) lang = 'json';
                        else if (name.endsWith('.html')) lang = 'html';
                        else if (name.endsWith('.css')) lang = 'css';

                        window.app.editor.updateContent(conteudoLimpo, lang);
                        window.app.state.arquivoAbertoAtual = filePath;

                        window.app.terminal.printLine(`[OK] Extração concluída.`);
                    } catch (error) {
                        window.app.terminal.printLine(`[ERRO] ${error.message}`);
                    }
                    window.app.terminal.printPrompt();
                });

                container.appendChild(li);
            });

        } catch (error) {
            if (!parentElement) container.innerHTML = `<li class="text-red-500 text-[11px] px-2">Falha crítica de UI.</li>`;
        }
    }
}
