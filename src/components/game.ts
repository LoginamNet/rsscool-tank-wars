import { checkedQuerySelector, checkElClass, toggleElClass } from './utils';
import { Field } from './field';
import { Player } from './player';
import { Page } from './pages';
import { Controls } from './controls';

export class Game {
    canvas = <HTMLCanvasElement>checkedQuerySelector(document, 'canvas');
    ctx = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    field = new Field();
    p1 = new Player(this.ctx, this.field, 350, 590, 'Gosha');
    p2 = new Player(this.ctx, this.field, 650, 590, 'Modest');
    p3 = new Player(this.ctx, this.field, 70, 530, 'Sigizmund');
    p4 = new Player(this.ctx, this.field, 490, 530, 'Arcadiy');
    players = Player.players;
    curentPl = this.players[0];
    frame = 0;

    private addKeys = (event: KeyboardEvent) => {
        event.preventDefault();
        if (!this.curentPl.isFired) {
            this.curentPl.projectileTrajectory = [];
            switch (event.code) {
                case 'ArrowUp':
                    checkElClass('game__menu_container', 'game__menu_hidden')
                        ? this.curentPl.powerUp()
                        : Controls.menuUp();
                    break;
                case 'ArrowDown':
                    checkElClass('game__menu_container', 'game__menu_hidden')
                        ? this.curentPl.powerDown()
                        : Controls.menuDown();
                    break;
                case 'ArrowLeft':
                    checkElClass('game__menu_container', 'game__menu_hidden')
                        ? this.curentPl.angleUp()
                        : Controls.menuRight();
                    break;
                case 'ArrowRight':
                    checkElClass('game__menu_container', 'game__menu_hidden')
                        ? this.curentPl.angleDown()
                        : Controls.menuLeft();
                    break;
                case 'Space':
                    checkElClass('game__menu_container', 'game__menu_hidden')
                        ? this.curentPl.fireProjectile(this.players)
                        : this.menuFire();
                    break;
                case 'Tab':
                    toggleElClass('game__menu_container', 'game__menu_hidden');
                    break;
                default:
                    break;
            }
        }
    };

    private addButtons = (event: Event) => {
        event.preventDefault();
        if (!this.curentPl.isFired) {
            this.curentPl.projectileTrajectory = [];
            const target = <HTMLElement>event.target;
            switch (true) {
                case target.classList.contains('cross__arrow_up'):
                    checkElClass('game__menu_container', 'game__menu_hidden')
                        ? this.curentPl.powerUp()
                        : Controls.menuUp();
                    break;
                case target.classList.contains('cross__arrow_down'):
                    checkElClass('game__menu_container', 'game__menu_hidden')
                        ? this.curentPl.powerDown()
                        : Controls.menuDown();
                    break;
                case target.classList.contains('cross__arrow_left'):
                    checkElClass('game__menu_container', 'game__menu_hidden')
                        ? this.curentPl.angleUp()
                        : Controls.menuRight();
                    break;
                case target.classList.contains('cross__arrow_right'):
                    checkElClass('game__menu_container', 'game__menu_hidden')
                        ? this.curentPl.angleDown()
                        : Controls.menuLeft();
                    break;
                case target.classList.contains('launch__button'):
                    checkElClass('game__menu_container', 'game__menu_hidden')
                        ? this.curentPl.fireProjectile(this.players)
                        : this.menuFire();
                    break;
                case target.classList.contains('options_buttons_settings'):
                    toggleElClass('game__menu_container', 'game__menu_hidden');
                    break;
                default:
                    break;
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
                window.cancelAnimationFrame(this.frame);
                this.removeControlKeys();
                this.frame = 0;

                Player.players = [];
                Page.renderHome();
                break;
            default:
                break;
        }
    }

    setControlKeys() {
        document.removeEventListener('keydown', this.addKeys);
        document.removeEventListener('click', this.addButtons);
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
        this.field.generate();
        this.setControlKeys();
        for (const player of this.players) {
            player.drawPlayer();
        }

        this.update();
    }

    stop() {
        window.cancelAnimationFrame(this.frame);
        this.removeControlKeys();
        this.frame = 0;

        Page.renderWinner(this.players[0]);
        Player.players = [];
    }

    update = () => {
        this.curentPl.setPlayerInfo();
        this.clean();
        this.renderField(this.field.export()); //drawing ground and sky
        for (const player of this.players) {
            player.drawPlayer();
            player.initialTankPositionY = this.field.findGround(player.initialTankPositionX) - 5;
            player.positionY = player.initialTankPositionY + 5;
        }
        this.curentPl.drawFire();
        this.checkHit();
        if (Player.animationExplosionFlag) {
            Player.drawExplosion();
        }

        this.frame = window.requestAnimationFrame(this.update);

        if (this.players.length === 1 && !Player.animationExplosionFlag) this.stop();
    };

    renderField(field: ImageData) {
        this.ctx.putImageData(field, 0, 0);
    }

    checkHit() {
        const i = this.players.indexOf(this.curentPl);

        if (this.curentPl.isTerrainHit() && !this.curentPl.isTargetHit(this.players) && !this.curentPl.isFired) {
            this.curentPl.projectileTrajectory = [];
            this.curentPl = this.players.length - 1 !== i ? this.players[i + 1] : this.players[0];
        }
    }
}
