import { checkedQuerySelector } from './utils';
import { Page } from './pages';
import { State } from './state';
import { Sounds } from './audio';

export class Controls {
    static sound = new Sounds();
    private static addMainMenuKeys = (event: KeyboardEvent) => {
        event.preventDefault();
        switch (event.code) {
            case 'ArrowUp':
                this.menuUp();
                this.sound.play('click');
                break;
            case 'ArrowDown':
                this.menuDown();
                this.sound.play('click');
                break;
            case 'ArrowLeft':
                this.menuLeft();
                this.sound.play('move');
                break;
            case 'ArrowRight':
                this.menuRight();
                this.sound.play('move');
                break;
            case 'Enter':
                State.settings.screen === 'HOME' ? Page.renderGame() : Page.renderHome();
                break;
            case 'Space':
                this.mainMenuFire();
                break;
            case 'Tab':
                Page.renderHome();
                break;
            case 'Escape':
                Page.renderHome();
                break;
            default:
                break;
        }
    };

    static addMainMenuButtons = (event: Event) => {
        event.preventDefault();
        const target = <HTMLElement>event.target;
        switch (true) {
            case target.classList.contains('cross__arrow_up'):
                this.menuUp();
                this.sound.play('click', 1);
                break;
            case target.classList.contains('cross__arrow_down'):
                this.menuDown();
                this.sound.play('click', 1);
                break;
            case target.classList.contains('cross__arrow_left'):
                this.menuLeft();
                this.sound.play('move', 1);
                break;
            case target.classList.contains('cross__arrow_right'):
                this.menuRight();
                this.sound.play('move', 1);
                break;
            case target.classList.contains('options_buttons_pause'):
                State.settings.screen === 'HOME' ? Page.renderGame() : Page.renderHome();
                this.sound.play('click', 1);
                break;
            case target.classList.contains('options_buttons_settings'):
                Page.renderHome();
                break;
            case target.classList.contains('launch__button'):
                this.mainMenuFire();
                this.sound.play('click', 1);
                break;
            default:
                break;
        }
    };

    static menuDown() {
        const items = document.querySelectorAll('.menu__item');
        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('menu__item_selected')) {
                if (i === items.length - 1) {
                    items[i].classList.remove('menu__item_selected');
                    items[0].classList.add('menu__item_selected');
                    return;
                } else {
                    items[i].classList.remove('menu__item_selected');
                    items[i + 1].classList.add('menu__item_selected');
                    return;
                }
            }
        }
    }

    static menuUp() {
        const items = document.querySelectorAll('.menu__item');
        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('menu__item_selected')) {
                if (i === 0) {
                    items[i].classList.remove('menu__item_selected');
                    items[items.length - 1].classList.add('menu__item_selected');
                    return;
                } else {
                    items[i].classList.remove('menu__item_selected');
                    items[i - 1].classList.add('menu__item_selected');
                    return;
                }
            }
        }
    }

    static menuLeft() {
        const item = checkedQuerySelector(document, '.menu__item_selected');
        const options = item.querySelectorAll('.menu__switcher');
        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains('menu__switcher_selected')) {
                if (i === 0) {
                    options[i].classList.remove('menu__switcher_selected');
                    options[options.length - 1].classList.add('menu__switcher_selected');
                    State.setSettings();
                    return;
                } else {
                    options[i].classList.remove('menu__switcher_selected');
                    options[i - 1].classList.add('menu__switcher_selected');
                    State.setSettings();
                    return;
                }
            }
        }
    }

    static menuRight() {
        const item = checkedQuerySelector(document, '.menu__item_selected');
        const options = item.querySelectorAll('.menu__switcher');
        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains('menu__switcher_selected')) {
                if (i === options.length - 1) {
                    options[i].classList.remove('menu__switcher_selected');
                    options[0].classList.add('menu__switcher_selected');
                    State.setSettings();
                    return;
                } else {
                    options[i].classList.remove('menu__switcher_selected');
                    options[i + 1].classList.add('menu__switcher_selected');
                    State.setSettings();
                    return;
                }
            }
        }
    }

    private static mainMenuFire() {
        const item = checkedQuerySelector(document, '.menu__item_selected');
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
            case item.innerText === 'RESTART GAME':
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
