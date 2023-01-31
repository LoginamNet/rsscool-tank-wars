import { checkedQuerySelector, drawCanvasArc } from './utils';

export class Player {
    ctx: CanvasRenderingContext2D;
    xPosition: number;
    yPosition: number;
    angle: number;
    power: number;
    projectileTrajectory: { x: number; y: number }[];
    currentTrajectoryIndex: number;
    intervalId: number;
    isFired: boolean;

    constructor(ctx: CanvasRenderingContext2D, xInitialPosition: number, yInitialPosition: number) {
        this.ctx = ctx;
        this.xPosition = xInitialPosition;
        this.yPosition = yInitialPosition;
        this.angle = 45;
        this.power = 100;
        this.projectileTrajectory = [];
        this.currentTrajectoryIndex = 0;
        this.intervalId = 0;
        this.isFired = false;
    }

    angleUp() {
        this.angle++;
        const angleText = checkedQuerySelector(document, '.angle');
        angleText.innerHTML = 'Angle: ' + this.angle;
    }

    angleDown() {
        this.angle--;
        const angleText = checkedQuerySelector(document, '.angle');
        angleText.innerHTML = 'Angle: ' + this.angle;
    }

    powerUp() {
        this.power++;
        const powerText = checkedQuerySelector(document, '.power');
        powerText.innerHTML = 'Power: ' + this.power;
    }

    powerDown() {
        this.power--;
        const powerText = checkedQuerySelector(document, '.power');
        powerText.innerHTML = 'Power: ' + this.power;
    }

    private calculateTrajectory() {
        this.projectileTrajectory = [];
        let xCoordinate = 0;
        let yCoordinate = 0;
        let time = 0;
        const g = -9.8 / 100;
        do {
            xCoordinate = this.xPosition + (this.power / 20) * Math.cos((this.angle / 180) * Math.PI) * time;

            yCoordinate =
                this.yPosition -
                ((this.power / 20) * Math.sin((this.angle / 180) * Math.PI) * time + 0.5 * g * Math.pow(time, 2));

            this.projectileTrajectory.push({ x: xCoordinate, y: yCoordinate });

            time++;
        } while (xCoordinate >= -10 && xCoordinate <= 800 && yCoordinate <= 600);
    }

    private shoot() {
        this.currentTrajectoryIndex = 0;
        this.isFired = true;
        this.intervalId = window.setInterval(this.nextProjectilePosition.bind(this), 10);
        console.log('shoot');
    }

    private nextProjectilePosition() {
        this.currentTrajectoryIndex++;

        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1) {
            console.log(this.projectileTrajectory[this.projectileTrajectory.length - 1]);
            this.endShot();
        }
    }

    private endShot() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = 0;
            this.isFired = false;
        }
    }

    fireProjectile() {
        this.calculateTrajectory();
        this.shoot();
    }

    drawPlayer() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.xPosition, this.yPosition, 10, 10);
    }

    drawHit() {
        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1) {
            if (this.projectileTrajectory[this.projectileTrajectory.length - 1].y > 600) {
                this.ctx.fillStyle = 'purple';
                drawCanvasArc(
                    this.ctx,
                    this.projectileTrajectory[this.projectileTrajectory.length - 1].x + 5,
                    this.projectileTrajectory[this.projectileTrajectory.length - 1].y,
                    10
                );
            }
        }
    }

    drawPlayerProjectile() {
        this.ctx.fillStyle = 'red';

        if (this.currentTrajectoryIndex && this.projectileTrajectory[this.currentTrajectoryIndex] !== undefined) {
            drawCanvasArc(
                this.ctx,
                this.projectileTrajectory[this.currentTrajectoryIndex].x + 5,
                this.projectileTrajectory[this.currentTrajectoryIndex].y + 5,
                5
            );
        }
    }

    drawProjectilePath() {
        this.ctx.fillStyle = 'gray';
        if (this.currentTrajectoryIndex) {
            for (let i = 0; i < this.currentTrajectoryIndex; i++) {
                if (this.projectileTrajectory[i] !== undefined) {
                    drawCanvasArc(this.ctx, this.projectileTrajectory[i].x + 5, this.projectileTrajectory[i].y + 5, 1);
                }
            }
        }
    }
}
