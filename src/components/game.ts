import { checkedQuerySelector, checkElClass, getRandomInt, toggleElClass } from './utils';
import { Field } from './field';
import { Player } from './player';
import { Page } from './pages';
import { Controls } from './controls';
import { Sounds } from './audio';
import { Count } from './countPlayers';
import { State } from './state';
import { ROUND_TIME } from '../common/constants';
import { Translate } from './translation';

export class Game {
    canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas_animation');
    ctx = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    field = new Field();
    count = new Count(+State.settings.players);
    player = this.count.getPlayers();
    players = Player.players;
    curentPl = this.players[getRandomInt(0, +State.settings.players - 1)];
    roundTime = ROUND_TIME;
    timerIsOn = false;
    static timeInt: ReturnType<typeof setInterval>;

    private addKeys = (event: KeyboardEvent) => {
        event.preventDefault();
        if (!this.curentPl.isFired) {
            this.curentPl.projectileTrajectory = [];
            if (checkElClass('info__screen', 'info__screen_hidden')) {
                switch (event.code) {
                    case 'ArrowUp':
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.powerUp();
                            this.curentPl.setPlayerInfo();
                            if (!this.timerIsOn) this.startTimer();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuUp();
                        }
                        break;
                    case 'ArrowDown':
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.powerDown();
                            this.curentPl.setPlayerInfo();
                            if (!this.timerIsOn) this.startTimer();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuDown();
                        }
                        break;
                    case 'ArrowLeft':
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.angleUp();
                            this.curentPl.setPlayerInfo();
                            if (!this.timerIsOn) this.startTimer();
                            this.updateTanks();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuRight();
                            this.curentPl.setPlayerInfo();
                            this.renderTime();
                        }
                        break;
                    case 'ArrowRight':
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.angleDown();
                            this.curentPl.setPlayerInfo();
                            if (!this.timerIsOn) this.startTimer();
                            this.updateTanks();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuLeft();
                            this.curentPl.setPlayerInfo();
                            this.renderTime();
                        }
                        break;
                    case 'Space':
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            if (!Player.animationFlag) {
                                Player.animationFlag = true;
                                window.requestAnimationFrame(this.updateAnimation.bind(this));
                                this.curentPl.fireProjectile(this.players);
                                if (!this.timerIsOn) this.startTimer();
                                Sounds.play('shot_tank', 0.3);
                            }
                        } else {
                            this.menuFire();
                            Sounds.play('click');
                        }
                        break;
                    case 'Pause':
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.switchTimer();
                        } else {
                            toggleElClass('game__menu_container', 'game__menu_hidden');
                        }
                        Sounds.play('move');
                        break;
                    case 'Escape':
                        this.stopTimer();
                        toggleElClass('game__menu_container', 'game__menu_hidden');
                        Sounds.play('move');
                        break;
                    default:
                        break;
                }
            } else {
                const instructions = checkedQuerySelector(document, '.info__screen');
                switch (event.code) {
                    case 'Space':
                        instructions.classList.remove('info__screen_hidden');
                        break;
                    case 'Escape':
                        this.stopTimer();
                        instructions.classList.remove('info__screen_hidden');
                        toggleElClass('game__menu_container', 'game__menu_hidden');
                        break;
                    default:
                        break;
                }
            }
        }
    };

    private addButtons = (event: Event) => {
        event.preventDefault();
        if (!this.curentPl.isFired) {
            this.curentPl.projectileTrajectory = [];
            const target = <HTMLElement>event.target;
            if (checkElClass('info__screen', 'info__screen_hidden')) {
                switch (true) {
                    case target.classList.contains('cross__arrow_up'):
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.powerUp();
                            this.curentPl.setPlayerInfo();
                            if (!this.timerIsOn) this.startTimer();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuUp();
                        }
                        break;
                    case target.classList.contains('cross__arrow_down'):
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.powerDown();
                            this.curentPl.setPlayerInfo();
                            if (!this.timerIsOn) this.startTimer();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuDown();
                        }
                        break;
                    case target.classList.contains('cross__arrow_left'):
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.angleUp();
                            this.curentPl.setPlayerInfo();
                            if (!this.timerIsOn) this.startTimer();
                            this.updateTanks();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuRight();
                            this.curentPl.setPlayerInfo();
                            this.renderTime();
                        }
                        break;
                    case target.classList.contains('cross__arrow_right'):
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.angleDown();
                            this.curentPl.setPlayerInfo();
                            if (!this.timerIsOn) this.startTimer();
                            this.updateTanks();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuLeft();
                            this.curentPl.setPlayerInfo();
                            this.renderTime();
                        }
                        break;
                    case target.classList.contains('launch__button'):
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            if (!Player.animationFlag) {
                                Player.animationFlag = true;
                                window.requestAnimationFrame(this.updateAnimation.bind(this));
                                this.curentPl.fireProjectile(this.players);
                                if (!this.timerIsOn) this.startTimer();
                                Sounds.play('shot_tank', 0.3);
                            }
                        } else {
                            this.menuFire();
                            Sounds.play('click');
                        }
                        break;
                    case target.classList.contains('options_buttons_pause'):
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.switchTimer();
                        } else {
                            toggleElClass('game__menu_container', 'game__menu_hidden');
                        }
                        Sounds.play('move');
                        break;
                    case target.classList.contains('options_buttons_settings'):
                        this.stopTimer();
                        toggleElClass('game__menu_container', 'game__menu_hidden');
                        Sounds.play('move');
                        break;
                    default:
                        break;
                }
            } else {
                const instructions = checkedQuerySelector(document, '.info__screen');
                switch (true) {
                    case target.classList.contains('launch__button'):
                        instructions.classList.remove('info__screen_hidden');
                        break;
                    case target.classList.contains('options_buttons_settings'):
                        instructions.classList.remove('info__screen_hidden');
                        toggleElClass('game__menu_container', 'game__menu_hidden');
                        break;
                    default:
                        break;
                }
            }
        }
    };

    private menuFire() {
        const item = checkedQuerySelector(document, '.menu__item_selected');
        switch (true) {
            case item.id === 'btn_instructions':
                Page.renderInstructions();
                break;
            case item.id === 'btn_back':
                toggleElClass('game__menu_container', 'game__menu_hidden');
                break;
            case item.id === 'btn_menu':
                this.removeControlKeys();
                Player.players = [];
                Page.renderHome();
                break;
            default:
                break;
        }
    }

    setControlKeys() {
        document.addEventListener('keydown', this.addKeys);
        document.addEventListener('click', this.addButtons);
    }

    removeControlKeys() {
        document.removeEventListener('keydown', this.addKeys);
        document.removeEventListener('click', this.addButtons);
    }

    clean() {
        this.ctx.clearRect(0, 0, 800, 600);
    }

    start() {
        console.log(this.players);
        this.clean();
        this.field.generate(this.setPositionTank, this.players, this.field); //drawing ground and sky and setTank
        this.setControlKeys();
        this.curentPl.setPlayerInfo();
        this.startTimer();
    }

    end() {
        if (this.players.length === 1) {
            this.removeControlKeys();
            this.stopTimer();
            Page.renderWinner(this.players[0]);
            Player.players = [];
        }
    }

    updateAnimation() {
        this.clean();
        this.curentPl.drawFire();
        this.checkHit();

        if (Player.animationExplosionFlag) {
            Player.drawExplosion();
        }

        if (Player.animationFlag) {
            window.requestAnimationFrame(this.updateAnimation.bind(this));
        } else {
            this.clean();
            this.end();
        }
    }

    checkHit() {
        const i = this.players.indexOf(this.curentPl);

        if (
            ((this.curentPl.isTerrainHit() && !this.curentPl.isTargetHit(this.players)) || this.curentPl.isHitted) &&
            !this.curentPl.isFired
        ) {
            this.curentPl.projectileTrajectory = [];
            this.curentPl = this.players.length - 1 !== i ? this.players[i + 1] : this.players[0];
            this.curentPl.setPlayerInfo();
            this.setTime();
        }
    }

    checkTime() {
        const i = this.players.indexOf(this.curentPl);

        if (this.roundTime === 0 && !this.curentPl.isFired) {
            this.curentPl.projectileTrajectory = [];
            this.curentPl = this.players.length - 1 !== i ? this.players[i + 1] : this.players[0];
            this.curentPl.setPlayerInfo();
        }
    }

    setPositionTank(players: Player[], field: Field) {
        for (const player of players) {
            player.initialTankPositionY = field.findGround(player.initialTankPositionX);
            player.positionY = player.initialTankPositionY;
        }
        players[0].updatePlayers();
    }

    updateTanks() {
        this.curentPl.updatePlayers();
    }

    startTimer() {
        this.renderTime();
        this.timerIsOn = true;
        Page.removePause();

        Game.timeInt = setInterval(() => {
            if (this.roundTime > 0) {
                this.roundTime--;
                this.renderTime();
            } else {
                if (!this.curentPl.isFired) {
                    this.checkTime();
                    this.setTime();
                }
            }
            return this.roundTime;
        }, 1000);
    }

    stopTimer() {
        this.renderTime();
        this.timerIsOn = false;
        clearInterval(Game.timeInt);
        Page.renderPause();
    }

    switchTimer() {
        this.timerIsOn ? this.stopTimer() : this.startTimer();
    }

    renderTime() {
        const timeText = checkedQuerySelector(document, '.time');
        timeText.innerHTML = Translate.setLang().screen.time + this.roundTime.toString().padStart(2, '0');
    }

    setTime() {
        this.roundTime = ROUND_TIME;
        this.renderTime();
    }
}
