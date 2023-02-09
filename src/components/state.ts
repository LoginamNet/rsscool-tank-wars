import { checkedQuerySelector } from './utils';

export class State {
    static settings = {
        mode: 'PvP',
        players: '4',
        sound: 'ON',
        language: 'EN',
    };

    static setSettings() {
        const item = checkedQuerySelector(document, '.menu_item_selected');
        const option = item.querySelector('.menu_switcher_selected');

        if (option) {
            switch (true) {
                case item.classList.contains('home__screen_mode'):
                    State.settings.mode = option.innerHTML;
                    break;
                case item.classList.contains('home__screen_players'):
                    State.settings.players = option.innerHTML;
                    break;
                case item.classList.contains('home__screen_sound'):
                    State.settings.sound = option.innerHTML;
                    break;
                case item.classList.contains('home__screen_language'):
                    State.settings.language = option.innerHTML;
                    break;
                default:
                    break;
            }
        }

        console.log(State.settings);
    }
}
