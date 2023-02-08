import { CANVAS_HEIGHT, CANVAS_WIDTH, POWER_GUN } from '../common/constants';
import { checkedQuerySelector } from './utils';
import { Game } from './game';
import { Player } from './player';
import './styles/console.css';
import './styles/home.css';
import './styles/winner.css';

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
                        <span class="options_text">Pause</span>
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
            <button class="home__screen_start">START GAME</button>
        </div>
        `;

        screen.innerHTML = template;

        const start = checkedQuerySelector(document, '.home__screen_start');
        start.addEventListener('click', () => {
            Page.renderGame();
        });
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
}
