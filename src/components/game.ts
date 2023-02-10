import { checkedQuerySelector, checkElClass, toggleElClass } from './utils';
import { Field } from './field';
import { Player } from './player';
import { Page } from './pages';
import { Controls } from './controls';

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
    frame = 0;

    setControlKeys() {
        document.addEventListener('keydown', (event) => {
            if (!this.curentPl.isFired) {
                this.curentPl.projectileTrajectory = [];
                switch (event.code) {
                    case 'ArrowUp':
                        this.curentPl.powerUp();
                        this.curentPl.setPower();
                        break;
                    case 'ArrowDown':
                        this.curentPl.powerDown();
                        this.curentPl.setPower();
                        break;
                    case 'ArrowLeft':
                        this.curentPl.angleUp();
                        this.curentPl.setAngle();
                        this.updateTanks();
                        break;
                    case 'ArrowRight':
                        this.curentPl.angleDown();
                        this.curentPl.setAngle();
                        this.updateTanks();
                        break;
                    case 'Space':
                        if (!Player.animationFlag) {
                            Player.animationFlag = true;
                            window.requestAnimationFrame(this.updateAnimation.bind(this));
                            this.curentPl.fireProjectile(this.players);
                        }
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
        console.log(this.players);
        this.clean();
        this.field.generate(this.setPositionTank, this.players, this.field); //drawing ground and sky and setTank
        this.setControlKeys();
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
        }
    }

    checkHit() {
        const i = this.players.indexOf(this.curentPl);

        if (this.curentPl.isTerrainHit() && !this.curentPl.isTargetHit(this.players) && !this.curentPl.isFired) {
            this.curentPl.projectileTrajectory = [];
            this.curentPl = this.players.length - 1 !== i ? this.players[i + 1] : this.players[0];
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
