export class HandleButtonClickUseCase {
    constructor(notificationAdapter) {
        this._notification = notificationAdapter;

        this._buttonPhrases = {
            'tab-settings': 'Configurações? A única configuração que você precisa ajustar é a sua lógica de programação.',
            'tab-analytics': 'Analisando suas métricas... Concluímos que 100% do seu código é débito técnico.',
            'tab-vcs': 'Fazer branch para quê? Seu código tem um problema na linha 42, vai quebrar a main de qualquer jeito. Na dúvida, dê um Git Reset.'
        };
    }

    execute(buttonId) {
        const phrase = this._buttonPhrases[buttonId];
        if (phrase) {
            this._notification.showWarning(phrase);
        } else {
            console.warn(`ID de botão não mapeado para punição: ${buttonId}`);
        }
    }
}
