import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../common/constants';
import { checkedQuerySelector } from './utils';
import { Game } from './game';
import { Player } from './player';
import { Controls } from './controls';
import './styles/console.css';
import './styles/home.css';
import './styles/winner.css';
import './styles/instructions.css';

export class Page {
    static body = checkedQuerySelector(document, 'body');

    static renderConsole() {
        this.body.innerHTML = `
        <div class="game__console">
            <div class="game__screen"></div>
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
            <div class="home__screen_menu">
                <div class="home__screen_mode home__menu_item menu_item_selected">
                <span>GAME MODE:</span>
                <div class="home__menu_switchers">
                    <div class="home__menu_switcher menu_switcher_selected">PvE</div>
                    <div class="home__menu_switcher">PvP</div>
                </div>
                </div>
                <div class="home__screen_players home__menu_item">
                    <span>PvP PLAYERS:</span>
                    <div class="home__menu_switchers">
                        <div class="home__menu_switcher">2</div>
                        <div class="home__menu_switcher">3</div>
                        <div class="home__menu_switcher menu_switcher_selected">4</div>
                    </div>
                </div>
                <div class="home__screen_sound home__menu_item">
                    <span>SOUNDS:</span>
                    <div class="home__menu_switchers">
                        <div class="home__menu_switcher menu_switcher_selected">ON</div>
                        <div class="home__menu_switcher">OFF</div>
                    </div>
                </div>
                <button class="home__screen_rules home__menu_item">HOW TO PLAY</button>
                <button class="home__screen_start home__menu_item">START GAME</button>
            </div>
        </div>
        `;

        screen.innerHTML = template;
        Controls.setMainMenuControls();
    }

    static renderGame() {
        const screen = checkedQuerySelector(document, '.game__screen');
        const template = `
        <div class="game__screen_game">
            <canvas class="canvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
        </div>
        <div class="game__screen_data">
            <div class="data__controls">
                <div class="angle" ></div>
                <div class="power" ></div>
            </div>
        </div>
        `;

        Controls.removeMainMenuControls();
        screen.innerHTML = template;
        const game = new Game();
        game.start();
    }

    static renderWinner(currentPl: Player) {
        const screen = checkedQuerySelector(document, '.game__screen');
        const template = `
        <div class="winner__screen" style="width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px">
            <div>And the winner is ${currentPl.name}</div>
            <button class="winner__screen_restart">RESTART GAME?</button>
        </div>
        `;

        screen.innerHTML = template;

        const start = checkedQuerySelector(document, '.winner__screen_restart');
        start.addEventListener('click', () => {
            this.renderHome();
        });
    }

    static renderInstructions() {
        const screen = checkedQuerySelector(document, '.game__screen');
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
            </div>
            <button class="button__back menu_item_selected">BACK TO MENU</button>
        </div>
        `;

        screen.innerHTML = template;
    }
}
