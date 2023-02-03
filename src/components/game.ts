import { checkedQuerySelector } from './utils';
import { Field } from './field';
import { Player } from './player';
import { Page } from './pages';

export class Game {
    canvas = <HTMLCanvasElement>checkedQuerySelector(document, 'canvas');
    ctx = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    field = new Field();
    p1 = new Player(this.ctx, this.field, 350, 590);
    p2 = new Player(this.ctx, this.field, 650, 590);
    p3 = new Player(this.ctx, this.field, 70, 530);
    players: Player[] = [this.p1, this.p2, this.p3];
    curentPl = this.players[1];

    setControlKeys() {
        document.addEventListener('keydown', (event) => {
            if (!this.curentPl.isFired) {
                this.curentPl.projectileTrajectory = [];
                switch (event.code) {
                    case 'ArrowUp':
                        this.curentPl.angleUp();
                        break;
                    case 'ArrowDown':
                        this.curentPl.angleDown();
                        break;
                    case 'ArrowLeft':
                        this.curentPl.powerDown();
                        break;
                    case 'ArrowRight':
                        this.curentPl.powerUp();
                        break;
                    case 'Space':
                        console.log(this.curentPl.isFired);
                        this.curentPl.fireProjectile(this.players);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    clean() {
        this.ctx.clearRect(0, 0, 800, 600);
    }

    start() {
        this.clean();
        this.field.generate();
        this.setControlKeys();
        for (const player of this.players) {
            player.drawPlayer();
        }

        window.requestAnimationFrame(this.update.bind(this));
    }

    update() {
        this.curentPl.setAngle();
        this.clean();
        this.renderField(this.field.export()); //drawing ground and sky
        for (const player of this.players) {
            player.drawPlayer();
            player.initialPositionY = this.field.findGround(player.initialPositionX) - 5;
        }
        this.curentPl.drawPlayerProjectile();
        this.curentPl.drawProjectilePath();
        this.curentPl.drawHit(this.players);
        this.curentPl.drawTerrainHit();
        this.checkHit();

        window.requestAnimationFrame(this.update.bind(this));
    }

    renderField(field: ImageData) {
        this.ctx.putImageData(field, 0, 0);
    }

    checkHit() {
        const i = this.players.indexOf(this.curentPl);

        if (this.curentPl.isTerrainHit() && !this.curentPl.isTargetHit(this.players) && !this.curentPl.isFired) {
            setTimeout(() => {
                this.curentPl.projectileTrajectory = [];
                this.curentPl = this.players.length - 1 !== i ? this.players[i + 1] : this.players[0];
            }, 700);
        }
    }
}
