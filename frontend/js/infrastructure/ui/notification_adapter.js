export class NotificationAdapter {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(this.container);
    }

    _showToast(title, message, borderColor, icon) {
        const toast = document.createElement('div');
        toast.className = `bg-[#1e1e1e] border-l-4 ${borderColor} text-gray-300 p-4 rounded shadow-2xl w-80 transform transition-all duration-300 translate-x-full opacity-0 flex items-start gap-3 pointer-events-auto`;

        toast.innerHTML = `
            <div class="text-2xl">${icon}</div>
            <div class="flex-1">
                <h4 class="text-white font-bold text-sm uppercase mb-1">${title}</h4>
                <p class="text-xs text-gray-400 leading-relaxed">${message}</p>
            </div>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        }, 10);

        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 10000);
    }

    showWarning(message) {
        this._showToast('Aviso do Sistema', message, 'border-yellow-500', '⚠️');
    }

    showError(message) {
        this._showToast('Punição Crítica', message, 'border-red-600', '❌');
    }

    showInfo(message) {
        this._showToast('Auditoria Forense', message, 'border-blue-500', 'ℹ️');
    }

    showSuccess(message) {
        this._showToast('Milagre', message, 'border-green-500', '✅');
    }
}
