import { checkedQuerySelector } from './utils';

export class State {
    static settings = {
        screen: 'HOME',
        mode: 'PvP',
        players: '4',
        sound: 'ON',
        language: 'EN',
    };

    static setSettings() {
        const item = checkedQuerySelector(document, '.menu__item_selected');
        const option = item.querySelector('.menu__switcher_selected');

        if (option) {
            switch (true) {
                case item.classList.contains('menu__item_mode'):
                    State.settings.mode = option.innerHTML;
                    break;
                case item.classList.contains('menu__item_players'):
                    State.settings.players = option.innerHTML;
                    break;
                case item.classList.contains('menu__item_sound'):
                    State.settings.sound = option.innerHTML;
                    break;
                case item.classList.contains('menu__item_language'):
                    State.settings.language = option.innerHTML;
                    break;
                default:
                    break;
            }
        }

        console.log(State.settings);
    }
}
