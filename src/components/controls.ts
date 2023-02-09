import { checkedQuerySelector } from './utils';
import { Page } from './pages';
import { State } from './state';

export class Controls {
    private static addMainMenuKeys = (event: KeyboardEvent) => {
        event.preventDefault();
        switch (event.code) {
            case 'ArrowUp':
                this.menuUp();
                break;
            case 'ArrowDown':
                this.menuDown();
                break;
            case 'ArrowLeft':
                this.menuLeft();
                break;
            case 'ArrowRight':
                this.menuRight();
                break;
            case 'Enter':
                Page.renderGame();
                break;
            case 'Space':
                this.mainMenuFire();
                break;
            case 'Tab':
                Page.renderHome();
                break;
            default:
                break;
        }
    };

    private static addMainMenuButtons = (event: Event) => {
        event.preventDefault();
        const target = <HTMLElement>event.target;
        switch (true) {
            case target.classList.contains('cross__arrow_up'):
                this.menuUp();
                break;
            case target.classList.contains('cross__arrow_down'):
                this.menuDown();
                break;
            case target.classList.contains('cross__arrow_left'):
                this.menuLeft();
                break;
            case target.classList.contains('cross__arrow_right'):
                this.menuRight();
                break;
            case target.classList.contains('options_buttons_pause'):
                Page.renderGame();
                break;
            case target.classList.contains('options_buttons_settings'):
                Page.renderHome();
                break;
            case target.classList.contains('launch__button'):
                this.mainMenuFire();
                break;
            default:
                break;
        }
    };

    private static menuDown() {
        const items = document.querySelectorAll('.home__menu_item');
        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('menu_item_selected')) {
                if (i === items.length - 1) {
                    items[i].classList.remove('menu_item_selected');
                    items[0].classList.add('menu_item_selected');
                    return;
                } else {
                    items[i].classList.remove('menu_item_selected');
                    items[i + 1].classList.add('menu_item_selected');
                    return;
                }
            }
        }
    }

    private static menuUp() {
        const items = document.querySelectorAll('.home__menu_item');
        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('menu_item_selected')) {
                if (i === 0) {
                    items[i].classList.remove('menu_item_selected');
                    items[items.length - 1].classList.add('menu_item_selected');
                    return;
                } else {
                    items[i].classList.remove('menu_item_selected');
                    items[i - 1].classList.add('menu_item_selected');
                    return;
                }
            }
        }
    }

    private static menuLeft() {
        const item = checkedQuerySelector(document, '.menu_item_selected');
        const options = item.querySelectorAll('.home__menu_switcher');
        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains('menu_switcher_selected')) {
                if (i === 0) {
                    options[i].classList.remove('menu_switcher_selected');
                    options[options.length - 1].classList.add('menu_switcher_selected');
                    State.setSettings();
                    return;
                } else {
                    options[i].classList.remove('menu_switcher_selected');
                    options[i - 1].classList.add('menu_switcher_selected');
                    State.setSettings();
                    return;
                }
            }
        }
    }

    private static menuRight() {
        const item = checkedQuerySelector(document, '.menu_item_selected');
        const options = item.querySelectorAll('.home__menu_switcher');
        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains('menu_switcher_selected')) {
                if (i === options.length - 1) {
                    options[i].classList.remove('menu_switcher_selected');
                    options[0].classList.add('menu_switcher_selected');
                    State.setSettings();
                    return;
                } else {
                    options[i].classList.remove('menu_switcher_selected');
                    options[i + 1].classList.add('menu_switcher_selected');
                    State.setSettings();
                    return;
                }
            }
        }
    }

    private static mainMenuFire() {
        const item = checkedQuerySelector(document, '.menu_item_selected');
        switch (true) {
            case item.innerText === 'HOW TO PLAY':
                Page.renderInstructions();
                break;
            case item.innerText === 'START GAME':
                Page.renderGame();
                break;
            case item.innerText === 'BACK TO MENU':
                Page.renderHome();
                break;
            default:
                break;
        }
    }

    static setMainMenuControls() {
        document.addEventListener('keydown', this.addMainMenuKeys);
        document.addEventListener('click', this.addMainMenuButtons);
    }

    static removeMainMenuControls() {
        document.removeEventListener('keydown', this.addMainMenuKeys);
        document.removeEventListener('click', this.addMainMenuButtons);
    }
}
