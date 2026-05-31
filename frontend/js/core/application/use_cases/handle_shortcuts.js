export class HandleShortcutUseCase {
    constructor(editorAdapter, notificationAdapter, appController, shortcutFactory) {
        this._editor = editorAdapter;
        this._notification = notificationAdapter;
        this._app = appController;
        this._factory = shortcutFactory;
    }

    execute(event) {
        if (!event.ctrlKey && !event.metaKey) return false;

        const strategy = this._factory.getStrategy(event.key);
        if (strategy) {
            event.preventDefault();
            strategy.execute(this._editor, this._notification, this._app);
            return true;
        }
        return false;
    }
}
