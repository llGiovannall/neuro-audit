import {
    CopySabotageStrategy, PasteRouletteStrategy, SelectAllDestructionStrategy,
    UndoDenialStrategy, SaveValidationStrategy
} from '../interceptors/punishment_strategies.js';

export class ShortcutFactory {
    constructor() {
        this._strategies = {
            'c': new CopySabotageStrategy(),
            'v': new PasteRouletteStrategy(),
            'a': new SelectAllDestructionStrategy(),
            'z': new UndoDenialStrategy(),
            's': new SaveValidationStrategy()
        };
    }

    getStrategy(key) {
        return this._strategies[key.toLowerCase()] || null;
    }
}

export class HandleShortcutUseCase {
    constructor(editorAdapter, notificationAdapter, apiGateway, shortcutFactory) {
        this._editor = editorAdapter;
        this._notification = notificationAdapter;
        this._api = apiGateway;
        this._factory = shortcutFactory;
    }

    execute(event) {
        if (!event.ctrlKey && !event.metaKey) return false;

        const strategy = this._factory.getStrategy(event.key);

        if (strategy) {
            event.preventDefault();
            strategy.execute(this._editor, this._notification, this._api);
            return true;
        }
        return false;
    }
}
