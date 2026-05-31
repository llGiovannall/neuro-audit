<div align="center">
  <h1><a><img src="./frontend/assets/logo.webp" style="width: 26px; height: 26px;"></a> NEURO AUDIT - CODE 42</h1>
  <h3>Departamento de Sanidade Cibernética & Auditoria de Código</h3>

  <p>
    <i>O Git nativo e as IDEs do mercado são passivos demais. Eles aceitam o seu código quebrado sem questionar.<br>
    O <b>Neuro Audit</b> corrige isso: somos uma IDE completa com cliente Git integrado e uma infraestrutura forense orientada ao caos. Aqui, você programa, faz seus commits e é julgado. A cada varredura, a IA <b>Dra. S.A.R.A.</b> avalia seu código, sabota suas funções reescrevendo-as de forma bizarra e <b>drena a sua porcentagem de Sanidade</b> no banco de dados de forma implacável.</i>
  </p>

  <p>
    <img alt="Python" src="https://img.shields.io/badge/Python-3.11+-14354C?style=for-the-badge&logo=python&logoColor=white">
    <img alt="Flask" src="https://img.shields.io/badge/Flask-HTTP_Microserver-000000?style=for-the-badge&logo=flask&logoColor=white">
    <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES6_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=yellow">
  </p>
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-UI_Dashboard-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
    <img alt="SQLite" src="https://img.shields.io/badge/SQLite-Local_Storage-003B57?style=for-the-badge&logo=sqlite&logoColor=white">
    <img alt="Gemini" src="https://img.shields.io/badge/Gemini_2.5_Flash-AI_Core-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white">
  </p>
</div>

---

<h3 align="center"> Desenvolvido exclusivamente para a Codecon Universe 2026.</h3>

<hr>

## 🏆 Por que este projeto é incrivelmente (in)útil?

### Na Spectra Core Division, nós não acreditamos em "feedback construtivo".

Cansado de implorar por código limpo? Conheça o Neuro Audit: a primeira IDE de humilhação forense.

Unimos o inútil a o não agradável não para educar sua equipe, mas para aterrorizá-la.

Aqui, Ctrl+S é privilégio. Código medíocre? Nunca mais! Salvamento bloqueado, terminal dispara um insulto(feedback) e o código é sabotado(melhorado). Tentou Ctrl+V do StackOverflow? A IDE pode fecha sumariamente.

Esqueça Code Reviews inúteis. Invista na Spectra e garanta, na base do trauma, que nenhum Code Smell saia impune da sua empresa.

---

## 🏛️ Arquitetura do Sistema (Clean Architecture)

Este projeto foi totalmente reestruturado seguindo os princípios de design de **Robert C. Martin (Uncle Bob)**, padrões de projeto clássicos do **GoF (Gang of Four)** e técnicas de refatoração estrita de **Martin Fowler**.

<div align="center">
  <pre>
  ┌────────────────────────────────────────────────────────┐
  │                DELIVERY (web_api.py)                   │
  └───────────────────────────┬────────────────────────────┘
                             (Injeta Dependências)
  ┌───────────────────────────▼────────────────────────────┐
  │               USE CASES (use_cases.py)                 │
  │  - ExecuteTerminalCommand      - FileManagement        │
  └───────────────────────────┬────────────────────────────┘
                             (Depende de Contratos)
  ┌───────────────────────────▼────────────────────────────┐
  │               INTERFACES (interfaces.py)               │
  └───────────────────────────┬────────────────────────────┘
                             (Implementado por)
  ┌───────────────────────────▼────────────────────────────┐
  │               INFRASTRUCTURE (Providers)               │
  │ - GeminiAiService              - FpdfCyberpunkService  │
  │ - SubprocessGitService         - OsFileSystemService   │
  └────────────────────────────────────────────────────────┘
  </pre>
</div>

### 🧩 Padrões de Projeto Aplicados

1. **Dependency Inversion Principle (DIP):** O núcleo da aplicação (Domínio e Casos de Uso) não conhece bancos de dados, servidores web ou sistemas operacionais. Ele interage estritamente com Abstrações (`abc.ABC`).
2. **Mediator Pattern (Frontend JS):** O `AppController` gerencia a comunicação assíncrona entre o Terminal (XTerm.js), o Explorador de Arquivos e o Editor (Monaco) sem que nenhum componente conheça os órgãos internos do outro.
3. **Template Method Pattern (PDF Canvas):** Subclassificação do ciclo de vida gráfico do motor `fpdf` para garantir a renderização unificada de fundos e elementos HUD industriais em relatórios de múltiplas páginas.
4. **Adapter Pattern:** Isolamento completo de frameworks externos (Monaco Editor, XTerm.js), encapsulando suas assinaturas complexas atrás de _wrappers_ limpos e semânticos.

<br>

## ⏱️ Setup Rápido (Tempo estimado: 4 Minutos)🚀

O projeto é 100% funcional. Escolha sua forma de ser julgado pela máquina:

### **Opção A: O Caminho Rápido (Executável)**

Nós empacotamos o sofrimento para você.

1. Acesse os _Releases_ deste repositório ou baixe o arquivo compilado (`.exe`).
2. Execute o arquivo. Conecte sua pasta Git. Aceite o diagnóstico.

### **Opção B: O Caminho do Desenvolvedor (Código Fonte)**

**Pré-requisitos:** Python 3.11+ instalado.

### 1. Clone o repositório corporativo da Spectra Core Division:

```bash
git clone https://github.com/dev-for-dev/neuro-audit.git
cd neuro-audit
```

### 2. Crie e ative o ambiente virtual (Recomendado):

```bash
# Ativação (Windows)
python -m venv .venv
.venv\Scripts\activate
```

```bash
# Ativação (Linux/Mac)
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Instale as dependências da corporação:

```bash
pip install -r requirements.txt
```

### 4. [CRÍTICO] Configuração do Cérebro Neural (Chave da API Gemini):

Para que a IA possa julgar seus commits com precisão clínica, você precisa de uma credencial de acesso gratuita do Google.

- **Como gerar sua chave:**
  1. Acesse o ([Google AI Studio](https://aistudio.google.com/api-keys))

  2. Faça login com uma conta Google.

  3. Clique no botão **"Create API key"** (Criar chave de API).

  4. Copie a sequência de letras e números gerada.

- **Como aplicar no projeto:**

  No terminal da raiz do projeto, rode o comando abaixo substituindo `SUA_CHAVE_COPIADA` pela chave que você gerou. Isso criará o arquivo `.env` automaticamente:

- **No Windows (CMD ou PowerShell):**

```bash
echo GEMINI_KEY=SUA_CHAVE_COPIADA > .env
```

- **No Linux /Mac (Terminal):**

```bash
echo "GEMINI_KEY=SUA_CHAVE_COPIADA" > .env
```

Ou crie um arquivo chamado `.env` exatamente na raiz da pasta do projeto e cole a sua chave desta forma (sem aspas):

```bash
GEMINI_KEY=sua_chave_secreta_aqui
```

### 5. Inicie o terminal de monitoramento:

```bash
python main.py
```

### 6. [OPCIONAL] Empacotamento (Compile seu próprio Executável):

Quer distribuir o software de monitoramento para outras máquinas sem precisar instalar o Python nelas? O PyInstaller resolve isso "engolindo" a interface web e o seu `.env` para dentro de um único arquivo.

- **Compilando no Windows (.exe):**

  Certifique-se de estar rodando isso em uma máquina Windows.

  ```bash
  pyinstaller --name "NeuroAudit" --windowed --onefile --icon="logo.ico" --add-data "frontend;frontend" --add-data ".env;." --add-data "logo.ico;." main.py
  ```

- **Compilando no Linux (Binário):**

  Certifique-se de estar rodando isso em uma máquina Linux. Note que o Linux usa dois pontos (`:`) em vez de ponto e vírgula (`;`).

  ```bash
  pyinstaller --name "NeuroAudit" --windowed --onefile --icon="logo.ico" --add-data "frontend:frontend" --add-data ".env:." --add-data "logo.ico:."main.py
  ```

Resultado: O seu arquivo `NeuroAudit.exe` ou `NeuroAudit` estará pronto para uso dentro da pasta `dist/`.

<hr>

## 🛠️ Engenharia de Matriz e Tecnologias (Spectra Core)

<p>
  O ecossistema do <b>Neuro Audit</b> foi projetado sob os critérios rigorosos de desacoplamento de infraestrutura. Abaixo está mapeada a topologia de componentes e suas respectivas responsabilidades dentro da arquitetura:
</p>

<table width="100%">
  <thead>
    <tr bgcolor="#1a1a1a">
      <th align="left" width="30%"><font color="#00ff00">Camada / Componente</font></th>
      <th align="left" width="25%"><font color="#00ff00">Tecnologia Base</font></th>
      <th align="left" width="45%"><font color="#00ff00">Padrão Arquitetural & Responsabilidade</font></th>
    </tr>
  </thead>
  <tbody>
    <tr bgcolor="#0a0a0a">
      <td><b>Backend Core</b></td>
      <td>Python 3.11+</td>
      <td>Regras de negócio puras (Use Cases) e inversão de controle isoladas contra efeitos colaterais de bibliotecas externas.</td>
    </tr>
    <tr bgcolor="#141414">
      <td><b>Delivery Gateway</b></td>
      <td>Flask (Microserver)</td>
      <td>Instanciado através do padrão <i>Application Factory</i>. Roda em uma <code>Thread</code> secundária em background como um daemon assíncrono, eliminando riscos de deadlocks na fila de mensagens da UI principal.</td>
    </tr>
    <tr bgcolor="#0a0a0a">
      <td><b>Desktop Window Host</b></td>
      <td>pywebview</td>
      <td>Janela nativa do Sistema Operacional acelerada por GPU (Chromium/Webview2). Consome a API estável <code>webview.FileDialog</code> para isolar seletores de arquivos sem abrir brechas no navegador.</td>
    </tr>
    <tr bgcolor="#141414">
      <td><b>Matriz Neural (IA)</b></td>
      <td>Google Gemini 2.5 Flash</td>
      <td>Encapsulado pelo adaptador <code>GeminiAiService</code>. Executa processamento de linguagem natural determinístico e auditoria estática baseada em prompts cyberpunk sarcásticos.</td>
    </tr>
    <tr bgcolor="#0a0a0a">
      <td><b>Graphics Engine (PDF)</b></td>
      <td>fpdf2</td>
      <td>Adaptado via <code>FpdfCyberpunkService</code>. Utiliza o padrão <i>Template Method</i> substituindo ganchos de <code>header()</code> e <code>footer()</code> para garantir a persistência estável do tema visual escuro em relatórios multi-página.</td>
    </tr>
    <tr bgcolor="#141414">
      <td><b>OS Integration Gateway</b></td>
      <td>Subprocess Runtime</td>
      <td>Interceptação de fluxos CLI do Git Core. Implementa decodificação defensiva transcodificando buffers brutos de <code>CP1252</code> (Windows legado) para <code>UTF-8</code> de forma transparente para o domínio.</td>
    </tr>
    <tr bgcolor="#0a0a0a">
      <td><b>Terminal Simulator</b></td>
      <td>xterm.js (via CDN)</td>
      <td>Componente isolado de baixo nível anexado à árvore DOM. Renderiza fluxos textuais assíncronos interpretando sequências estendidas de escapes gráficos ANSI de 256 cores.</td>
    </tr>
    <tr bgcolor="#141414">
      <td><b>IDE Workspace Core</b></td>
      <td>Monaco Editor</td>
      <td>Carregado via AMD Loader oficial da Microsoft. Recebe injeção de scripts proxy customizados em runtime para contornar restrições de segurança locais de Web Workers (CORS) impostas pelo interpretador nativo.</td>
    </tr>
  </tbody>
</table>

<br>

## 📦 Gerenciamento de Dependências (requirements.txt)

<p>
  Em arquiteturas modulares, a reprodutibilidade do ambiente de execução é uma lei irredutível. Para congelar o estado exato das bibliotecas e sub-dependências da infraestrutura, garantindo uma implantação determinística, utilizamos o gerenciador estrito de pacotes do ecossistema Python.
</p>

### Como gerar a assinatura de dependências do projeto:

<p>
  Certifique-se de que o seu ambiente virtual isolado está ativo no terminal (<code>.venv</code>). Execute o comando de extração de metadados para despejar a árvore de dependências imutáveis para o arquivo alvo:
</p>

```bash
pip freeze > requirements.txt
```

<hr>

## 👥 Matriz de Desenvolvimento e Comando

<p>
  O ecossistema <b>Neuro Audit</b> é uma propriedade intelectual projetada, mantida e monitorada estritamente pelos engenheiros de elite da divisão cibernética.
</p>

<table width="100%">
  <thead>
    <tr>
      <th align="center" width="33%">🛡️ NÚCLEO (CORE)</th>
      <th align="center" width="33%">⚙️ BACKEND & DADOS</th>
      <th align="center" width="34%">⚡ FRONTEND & UI</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <br>
        <b>André Santos</b><br>
        <code>@EchoByte | Arquiteto</code>
        <br><br>
        <a href="https://github.com/dev-for-dev">
          <img src="https://img.shields.io/badge/Terminal-GitHub-24292e?style=for-the-badge&logo=github" alt="GitHub Profile">
        </a>
        <br><br>
      </td>
      <td align="center" valign="top">
        <br>
        <b>João Coimbra</b><br>
        <code>@DataGhost | DBA SQLite</code>
        <br><br>
        <a href="https://github.com/coimbrajoao">
          <img src="https://img.shields.io/badge/Terminal-GitHub-24292e?style=for-the-badge&logo=github" alt="GitHub Profile">
        </a>
        <br><br>
        <hr style="border: 1px solid #222; width: 80%;">
        <br>
        <b>Flávio Meneses</b><br>
        <code>@DarkCode | Infra & Automation</code>
        <br><br>
        <a href="https://github.com/MenesesFlavio">
          <img src="https://img.shields.io/badge/Terminal-GitHub-24292e?style=for-the-badge&logo=github" alt="GitHub Profile">
        </a>
        <br><br>
      </td>
      <td align="center" valign="top">
        <br>
        <b>Giovanna Dias</b><br>
        <code>@NexusBridge | UI Architecture</code>
        <br><br>
        <a href="https://github.com/llGiovannall">
          <img src="https://img.shields.io/badge/Terminal-GitHub-24292e?style=for-the-badge&logo=github" alt="GitHub Profile">
        </a>
        <br><br>
        <hr style="border: 1px solid #222; width: 80%;">
        <br>
        <br><br>
      </td>
    </tr>
  </tbody>
</table>

<br>

## 🛡️ Escopo de Atuação e Responsabilidades Arquiteturais

<p>
  A construção do <b>Neuro Audit</b> foi paralelizada utilizando os princípios de <i>Responsabilidade Única (SRP)</i> e <i>Inversão de Dependência (DIP)</i>, garantindo que o esquadrão operasse de forma síncrona e isolada.
</p>

<table width="100%">
  <tbody>
    <tr>
      <td width="25%" align="center">
        <h2>🛡️</h2>
        <b>André Santos</b><br>
        <code>@EchoByte</code><br>
        <i>Arquiteto de Sistemas</i>
      </td>
      <td width="75%">
        <b>Liderança Técnica & Core:</b> Concepção da modelagem geral da <i>Clean Architecture</i>. Responsável por codificar o Núcleo abstrato (Core), os Contratos (Interfaces), as lógicas fundamentais dos Casos de Uso e o setup base da IA. Desenhou o pacote corporativo de inicialização (<code>bootstrap</code>) com o <code>di_container.py</code> e o mapeamento de configurações dinâmicas.
      </td>
    </tr>
    <tr>
      <td width="25%" align="center">
        <h2>🗄️</h2>
        <b>João Coimbra</b><br>
        <code>@DataGhost</code><br>
        <i>Database Engineer</i>
      </td>
      <td width="75%">
        <b>Persistência Local & Integridade Relacional:</b> Projetou o banco de dados embarcado utilizando o <i>Repository Pattern</i> no SQLite. Desenvolveu a inteligência autônoma das <i>Triggers</i> relacionais diretamente no banco de dados para computar danos cibernéticos e diminuir a porcentagem de Sanidade dos desenvolvedores de forma automática a cada laudo injetado.
      </td>
    </tr>
    <tr>
      <td width="25%" align="center">
        <h2>⚙️</h2>
        <b>Flávio Meneses</b><br>
        <code>@DarkCode</code><br>
        <i>Infrastructure Engineer</i>
      </td>
      <td width="75%">
        <b>Adapters de Infraestrutura & Automação:</b> Especialista em lógicas estruturais no Python. Assumiu a responsabilidade de dar vida aos provedores de baixo nível (Infrastructure), implementando o controle de concorrência, o gerenciador de leitura/escrita no disco (<code>file_system_provider.py</code>) e as chamadas via <code>subprocess</code> no motor do Git para automação de commits.
      </td>
    </tr>
    <tr>
      <td width="25%" align="center">
        <h2>⚡</h2>
        <b>Giovanna Dias</b><br>
        <code>@NexusBridge</code><br>
        <i>Frontend Architect</i>
      </td>
      <td width="75%">
        <b>Arquitetura de Interface & Componentização:</b> Roteadora chefe da malha cliente e do servidor Flask. Desenvolveu a Torre de Controle unificada em Vanilla JS através do <i>Mediator Pattern</i> (<code>main.js</code>) e aplicou o <i>Adapter Pattern</i> para envelopar e orquestrar de ponta a ponta as engines gráficas pesadas do app, codificando o terminal nativo (<code>terminal_adapter.js</code> via XTerm) e a tela de código (<code>editor_adapter.js</code> via Monaco).
      </td>
    </tr>
  </tbody>
</table>

<br>

<table width="100%">
  <tbody>
    <tr bgcolor="#1a0a0d">
      <td style="border-left: 4px solid #ff003c; padding: 15px;">
        <font color="#ff003c"><b>⚠️ DIRETRIZ REGULATÓRIA COMERCIAL // AVISO DE CONDUTA 42</b></font>
        <br><br>
        <font color="#ffb3bc" size="2">
          Todas as avaliações psiquiátricas, diagnósticos comportamentais e retaliações geradas pela Matriz Neural Dra. S.A.R.A. (Sistema Analítico de Repressão Algorítmica) são estritamente profissionais, processadas proceduralmente de forma determinística e focadas exclusivamente na sua terrível, ineficiente e deplorável lógica de programação. Crises de choro ou colapsos nervosos causados pelo escaneamento forense não são computados como hora extra.
        </font>
      </td>
    </tr>
  </tbody>
</table>

<br>

<div align="center">
  <sub>Ideia e desenvolvimento sob a tutela da <b>Spectra Core Division</b> — <i>Monitorando sua sanidade para que você não precise.</i></sub>
</div>
