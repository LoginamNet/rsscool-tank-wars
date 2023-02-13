import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../common/constants';
import { checkedQuerySelector } from './utils';
import { Game } from './game';
import { Player } from './player';
import { Controls } from './controls';
import { State } from './state';
import { Sounds } from './audio';
import './styles/console.css';
import './styles/home.css';
import './styles/game.css';
import './styles/winner.css';
import './styles/menu.css';
import './styles/instructions.css';

export class Page {
    static body = checkedQuerySelector(document, 'body');

    static renderConsole() {
        this.body.innerHTML = `
        <div class="game__console">
            <div class="main__screen">
                <div class="game__screen"></div>
                <div class="info__screen info__screen_hidden"></div>
            </div>
            <div class="game__controls">
                <div class="game__controls_circle">
                    <div class="game__controls_cross">
                    <button class="cross__arrow cross__arrow_left"></button>
                    <div class="cross__vertical">
                        <button class="cross__arrow cross__arrow_up"></button>
                        <button class="cross__arrow cross__arrow_down"></button>
                    </div>
                    <button class="cross__arrow cross__arrow_right"></button>
                    </div>
                </div>
                <div class="game__controls_options">
                    <div class="game__naming">
                        <span class="naming__rs"><a class="naming__rs_link" href="https://rs.school">RsSchool</a> Console</span>
                    </div>
                    <div class="cross__options_buttons">
                        <button class="options_button options_buttons_pause"></button>
                        <button class="options_button options_buttons_settings"></button>
                    </div>
                    <div class="cross__options_text">
                        <span class="options_text">Pause/Start</span>
                        <span class="options_text">Settings</span>
                    </div>
                </div>
                <div class="game__controls_circle">
                    <button class="launch__button">FIRE!</button>
                </div>
            </div>
        </div>
        `;
    }

    static renderHome() {
        const screen = checkedQuerySelector(document, '.game__screen');
        const template = `
        <div class="home__screen" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">
            <h1 class="home__screen_title">TANK WARS</h1>
            <div class="screen__menu">
                <div class="menu__item_mode menu__item menu__item_selected">
                <span>GAME MODE:</span>
                <div class="menu__switchers">
                    <div class="menu__switcher menu__switcher_selected">PvE</div>
                    <div class="menu__switcher">PvP</div>
                </div>
                </div>
                <div class="menu__item_players menu__item">
                    <span>PvP PLAYERS:</span>
                    <div class="menu__switchers">
                        <div class="menu__switcher">2</div>
                        <div class="menu__switcher">3</div>
                        <div class="menu__switcher menu__switcher_selected">4</div>
                    </div>
                </div>
                <div class="menu__item_sound menu__item">
                    <span>SOUNDS:</span>
                    <div class="menu__switchers">
                        <div class="menu__switcher menu__switcher_selected">ON</div>
                        <div class="menu__switcher">OFF</div>
                    </div>
                </div>
                <div class="menu__item_language menu__item">
                    <span>LANGUAGE:</span>
                    <div class="menu__switchers">
                        <div class="menu__switcher menu__switcher_selected">EN</div>
                        <div class="menu__switcher">РУС</div>
                    </div>
                </div>
                <button class="menu__item">HOW TO PLAY</button>
                <button class="menu__item">START GAME</button>
            </div>
        </div>
        `;

        Controls.removeMainMenuControls();
        screen.innerHTML = template;
        State.settings.screen = 'HOME';
        Controls.setMainMenuControls();
    }

    static renderGame() {
        const screen = checkedQuerySelector(document, '.game__screen');
        const template = `
        <div class="game__screen_game">
            <div class="game__canvas" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">
                <canvas class="canvas canvas_background" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
                <canvas class="canvas canvas_tank" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
                <canvas class="canvas canvas_animation" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
                <canvas class="canvas canvas_ui" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
            </div>
            <div class="game__menu_container game__menu_hidden" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px"">
                <div class="screen__menu">
                    <div class="menu__item_sound menu__item item menu__item_selected">
                        <span>SOUNDS:</span>
                        <div class="menu__switchers">
                            <div class="menu__switcher menu__switcher_selected">ON</div>
                            <div class="menu__switcher">OFF</div>
                        </div>
                    </div>
                    <div class="menu__item_language menu__item">
                        <span>LANGUAGE:</span>
                        <div class="menu__switchers">
                            <div class="menu__switcher menu__switcher_selected">EN</div>
                            <div class="menu__switcher">РУС</div>
                        </div>
                    </div>
                    <button class="menu__item">HOW TO PLAY</button>
                    <button class="menu__item">BACK TO GAME</button>
                    <button class="menu__item">BACK TO MAIN MENU</button>
                </div>
            </div>
        </div>
        </div>
        <div class="game__screen_data">
            <div class="data__controls">
                <div class="data__controls_section">
                    <div class="angle"></div>
                    <div class="power"></div>
                </div>
                <div class="data__controls_section">
                    <div class="time"></div>
                </div>
                <div class="data__controls_section">
                    <div class="wind"></div>
                    <div class="player"></div>
                </div>
            </div>
        </div>
        `;

        Controls.removeMainMenuControls();
        screen.innerHTML = template;
        State.settings.screen = 'GAME';
        const game = new Game();
        game.start();
    }

    static renderWinner(currentPl: Player) {
        const screen = checkedQuerySelector(document, '.game__screen');
        const template = `
        <div class="winner__screen" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">
            <div class="winner__image_container">
                <div class="winner__image"></div>
            </div>
            <div>And the winner is ${currentPl.name}</div>
            <div class="screen__menu">
                <button class="menu__item menu__item_selected winner__screen_restart">RESTART GAME</button>
            </div>
        </div>
        `;

        screen.innerHTML = template;
        State.settings.screen = 'WINNER';
        Controls.setMainMenuControls();
        Sounds.play('winner', 0.5);
    }

    static renderInstructions() {
        const screen = checkedQuerySelector(document, '.info__screen');
        const template = `
        <div class="instructions__screen" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">
            <div class="instructions__conraiter">
                <h2>HOW TO PLAY</h2>
                <span>You can use your keyboard or display buttons to control the tank</span>
                <ul class="instructions__list">
                    <li class="instructions__list_item">Kbrd UP/Cross UP - increase shot power</li>
                    <li class="instructions__list_item">Kbrd DOWN/Cross DOWN - reduce shot power</li>
                    <li class="instructions__list_item">Kbrd LEFT/Cross LEFT - increase tank canon angle</li>
                    <li class="instructions__list_item">Kbrd RIGHT/Cross RIGHT - reduce tank canon angle</li>
                    <li class="instructions__list_item">Kbrd SPACE/Button FIRE - fire projectile</li>
                    <li class="instructions__list_item">Kbrd PAUSE/Button START/PAUSE - pause game time or start count again</li>
                    <li class="instructions__list_item">Kbrd TAB/Button SETTINGS - open settings menu</li>
                </ul>
                <button class="instructions__button_back">BACK TO MENU</button>
        </div>        
        `;

        screen.innerHTML = template;
        Controls.setInstructionsControls();
    }
}
