import { checkedQuerySelector, checkElClass, toggleElClass } from './utils';
import { Field } from './field';
import { Player } from './player';
import { Page } from './pages';
import { Controls } from './controls';
import { Sounds } from './audio';

export class Game {
    canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas_animation');
    ctx = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    field = new Field();
    p1 = new Player(this.ctx, this.field, 350, 590, 'Gosha');
    p2 = new Player(this.ctx, this.field, 650, 590, 'Modest');
    p3 = new Player(this.ctx, this.field, 70, 530, 'Sigizmund');
    p4 = new Player(this.ctx, this.field, 490, 530, 'Arcadiy');
    players = Player.players;
    curentPl = this.players[0];

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
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuUp();
                        }
                        break;
                    case 'ArrowDown':
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.powerDown();
                            this.curentPl.setPlayerInfo();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuDown();
                        }
                        break;
                    case 'ArrowLeft':
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.angleUp();
                            this.curentPl.setPlayerInfo();
                            this.updateTanks();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuRight();
                        }
                        break;
                    case 'ArrowRight':
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.angleDown();
                            this.curentPl.setPlayerInfo();
                            this.updateTanks();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuLeft();
                        }
                        break;
                    case 'Space':
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            if (!Player.animationFlag) {
                                Player.animationFlag = true;
                                window.requestAnimationFrame(this.updateAnimation.bind(this));
                                this.curentPl.fireProjectile(this.players);
                                Sounds.play('shot_tank', 0.3);
                            }
                        } else {
                            this.menuFire();
                            Sounds.play('click');
                        }
                        break;
                    case 'Tab':
                        toggleElClass('game__menu_container', 'game__menu_hidden');
                        Sounds.play('click');
                        break;
                    case 'Escape':
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
                    case 'Tab':
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
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuUp();
                        }
                        break;
                    case target.classList.contains('cross__arrow_down'):
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.powerDown();
                            this.curentPl.setPlayerInfo();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuDown();
                        }
                        break;
                    case target.classList.contains('cross__arrow_left'):
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.angleUp();
                            this.curentPl.setPlayerInfo();
                            this.updateTanks();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuRight();
                        }
                        break;
                    case target.classList.contains('cross__arrow_right'):
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            this.curentPl.angleDown();
                            this.curentPl.setPlayerInfo();
                            this.updateTanks();
                            Sounds.play('scroll_gun');
                        } else {
                            Controls.menuLeft();
                        }
                        break;
                    case target.classList.contains('launch__button'):
                        if (checkElClass('game__menu_container', 'game__menu_hidden')) {
                            if (!Player.animationFlag) {
                                Player.animationFlag = true;
                                window.requestAnimationFrame(this.updateAnimation.bind(this));
                                this.curentPl.fireProjectile(this.players);
                                Sounds.play('shot_tank', 0.3);
                            }
                        } else {
                            this.menuFire();
                            Sounds.play('click');
                        }
                        break;
                    case target.classList.contains('options_buttons_settings'):
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
            case item.innerText === 'HOW TO PLAY':
                Page.renderInstructions();
                break;
            case item.innerText === 'BACK TO GAME':
                toggleElClass('game__menu_container', 'game__menu_hidden');
                break;
            case item.innerText === 'BACK TO MAIN MENU':
                this.removeControlKeys();
                Player.players = [];
                Page.renderHome();
                // Sounds.play('intro', 0.2);
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
    }

    stop() {
        if (this.players.length === 1) {
            this.removeControlKeys();
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
            this.stop();
        }
    }

    checkHit() {
        const i = this.players.indexOf(this.curentPl);

        if (this.curentPl.isTerrainHit() && !this.curentPl.isTargetHit(this.players) && !this.curentPl.isFired) {
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
}
