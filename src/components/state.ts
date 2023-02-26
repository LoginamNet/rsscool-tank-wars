import { stateGame } from '../types/types';
import { Color } from './color';
import { Translate } from './translation';
import { checkedQuerySelector } from './utils';

export class State {
    static settings = {
        screen: 'LAUNCH',
        mode: 'PvP',
        players: '4',
        sound: 'ON',
        color: 'SAND',
        language: 'EN',
    };

    static game: stateGame = {
        players: [],
    };

    static setSettings() {
        const item = checkedQuerySelector(document, '.menu__item_selected');
        const option = item.querySelector('.menu__switcher_selected');

        if (option) {
            switch (true) {
                case item.classList.contains('menu__item_mode'):
                    State.settings.mode = option.id;
                    break;
                case item.classList.contains('menu__item_players'):
                    State.settings.players = option.id;
                    break;
                case item.classList.contains('menu__item_sound'):
                    State.settings.sound = option.id;
                    break;
                case item.classList.contains('menu__item_color'):
                    State.settings.color = option.id;
                    Color.setConsoleColor();
                    break;
                case item.classList.contains('menu__item_language'):
                    State.settings.language = option.id;
                    Translate.setMenuLang();
                    break;
                default:
                    break;
            }
        }
    }

    // set menu switchers based on settings state

    static setMenuItems() {
        const options = document.querySelectorAll('.menu__switcher');

        for (const option of options) {
            for (const item of Object.values(State.settings)) {
                if (option.id === item) {
                    option.classList.add('menu__switcher_selected');
                }
            }
        }
    }
}
