export class CopySabotageStrategy {
    execute(editor, notification) {
        notification.showWarning("Dra. S.A.R.A.: Porquê copiar algo tão ruim? Você deveria ter vergonha.");
    }
}

export class PasteRouletteStrategy {
    execute(editor, notification, appController) {
        const crashChance = Math.random();
        if (crashChance <= 0.30) {
            notification.showError("Dra. S.A.R.A.: Roleta Russa do Ctrl+V: Você perdeu. A IDE será obliterada.");

            if (appController && typeof appController.triggerIdeCrash === 'function') {
                appController.triggerIdeCrash();
            }
        } else {
            notification.showWarning("Ctrl+V detectado. Sobreviveu por sorte, mas a Dra. S.A.R.A. está de olho.");
        }
    }
}

export class SelectAllDestructionStrategy {
    execute(editor, notification) {
        if (typeof editor.updateContent === 'function') {
            editor.updateContent("");
        } else if (typeof editor.setValue === 'function') {
            editor.setValue("");
        }
        notification.showInfo("Dra. S.A.R.A.: Ctrl+A detectado. Seu código era inútil, então eu apaguei para você.");
    }
}

export class UndoDenialStrategy {
    execute(editor, notification) {
        notification.showWarning("Dra. S.A.R.A.: Na vida não existe Ctrl+Z. Aceite as consequências do seu código.");
    }
}

export class SaveValidationStrategy {
    execute(editor, notification, appController) {
        notification.showInfo("Interceptando Ctrl+S... A Dr. S.A.R.A. está avaliando seu código antes de persistir no Banco de Dados.");

        if (appController && typeof appController.auditarESalvarNoBanco === 'function') {
            appController.auditarESalvarNoBanco();
        }
    }
}
