import { checkedQuerySelector } from './utils';
import { Field } from './field';
import { Player } from './player';
import { Sounds } from './audio';

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
    sound = new Sounds();

    setControlKeys() {
        document.addEventListener('keydown', (event) => {
            if (!this.curentPl.isFired) {
                this.curentPl.projectileTrajectory = [];
                switch (event.code) {
                    case 'ArrowUp':
                        this.curentPl.powerUp();
                        this.sound.play('scroll_gun', 0.5);
                        break;
                    case 'ArrowDown':
                        this.curentPl.powerDown();
                        this.sound.play('scroll_gun', 0.5);
                        break;
                    case 'ArrowLeft':
                        this.curentPl.angleUp();
                        this.sound.play('scroll_gun', 0.5);
                        break;
                    case 'ArrowRight':
                        this.curentPl.angleDown();
                        this.sound.play('scroll_gun', 0.5);
                        break;
                    case 'Space':
                        this.curentPl.fireProjectile(this.players);
                        this.sound.play('shot-tank');
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
            player.initialTankPositionY = this.field.findGround(player.initialTankPositionX) - 5;
            player.positionY = player.initialTankPositionY + 5;
        }
        this.curentPl.drawFire();
        this.checkHit();
        if (Player.animationExplosionFlag) {
            Player.drawExplosion();
            // this.sound.play('bang-tank', 0.3);
            // this.sound.bangTank();
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
        }
    }
}
