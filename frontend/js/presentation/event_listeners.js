import { HandleButtonClickUseCase } from '../core/application/use_cases/handle_buttons.js';
import { NotificationAdapter } from '../infrastructure/ui/notification_adapter.js';

const notificationAdapter = new NotificationAdapter();

const buttonUseCase = new HandleButtonClickUseCase(notificationAdapter);

const punishmentButtons = document.querySelectorAll('#btn-vcs, #btn-analytics, #btn-settings');

punishmentButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const buttonId = event.currentTarget.id;
        buttonUseCase.execute(buttonId);
    });
});
