import { checkedQuerySelector } from './utils';
import { Field } from './field';
import { Player } from './player';

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

    private addKeys = (event: KeyboardEvent) => {
        if (!this.curentPl.isFired) {
            this.curentPl.projectileTrajectory = [];
            switch (event.code) {
                case 'ArrowUp':
                    this.curentPl.powerUp();
                    break;
                case 'ArrowDown':
                    this.curentPl.powerDown();
                    break;
                case 'ArrowLeft':
                    this.curentPl.angleUp();
                    break;
                case 'ArrowRight':
                    this.curentPl.angleDown();
                    break;
                case 'Space':
                    this.curentPl.fireProjectile(this.players);
                    break;
                default:
                    break;
            }
        }
    };

    private addButtons = (event: Event) => {
        if (!this.curentPl.isFired) {
            this.curentPl.projectileTrajectory = [];
            const target = <HTMLElement>event.target;
            switch (true) {
                case target.classList.contains('cross__arrow_up'):
                    this.curentPl.powerUp();
                    break;
                case target.classList.contains('cross__arrow_down'):
                    this.curentPl.powerDown();
                    break;
                case target.classList.contains('cross__arrow_left'):
                    this.curentPl.angleUp();
                    break;
                case target.classList.contains('cross__arrow_right'):
                    this.curentPl.angleDown();
                    break;
                case target.classList.contains('launch__button'):
                    this.curentPl.fireProjectile(this.players);
                    break;
                default:
                    break;
            }
        }
    };

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

        window.requestAnimationFrame(this.update.bind(this));
    }

    update() {
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

        window.requestAnimationFrame(this.update.bind(this));
    }

    renderField(field: ImageData) {
        this.ctx.putImageData(field, 0, 0);
    }

    checkHit() {
        const i = this.players.indexOf(this.curentPl);

        if (this.curentPl.isTerrainHit() && !this.curentPl.isTargetHit(this.players) && !this.curentPl.isFired) {
            this.curentPl.projectileTrajectory = [];
            this.curentPl = this.players.length - 1 !== i ? this.players[i + 1] : this.players[0];
        } else if (this.players.length === 1) {
            this.removeControlKeys();
        }
    }
}
