import { Field } from './field';
import { checkedQuerySelector, drawCanvasArc } from './utils';

export class Player {
    field: Field;
    ctx: CanvasRenderingContext2D;
    xPosition: number;
    yPosition: number;
    angle: number;
    power: number;
    projectileTrajectory: { x: number; y: number }[];
    currentTrajectoryIndex: number;
    intervalId: number;
    isFired: boolean;
    isHitted: boolean;

    constructor(ctx: CanvasRenderingContext2D, field: Field, xInitialPosition: number, yInitialPosition: number) {
        this.ctx = ctx;
        this.field = field;
        this.xPosition = xInitialPosition;
        this.yPosition = yInitialPosition;
        this.angle = this.xPosition > 400 ? 135 : 45;
        this.power = 100;
        this.projectileTrajectory = [];
        this.currentTrajectoryIndex = 0;
        this.intervalId = 0;
        this.isFired = false;
        this.isHitted = false;
    }

    setAngle() {
        const angleText = checkedQuerySelector(document, '.angle');
        angleText.innerHTML = 'Angle: ' + this.angle;
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

    private calculateTrajectory(playerState: Player[]) {
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
        } while (
            xCoordinate >= -20 &&
            xCoordinate <= 810 &&
            yCoordinate <= 600 &&
            !this.isTargetHit(playerState)?.isHitted
        );
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

    // isTerrainHit(field: Field) {
    //     const canvas = field.canvas;
    //     const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

    //     for (let i = 0; i < this.projectileTrajectory.length - 1; i++) {
    //         const pixel = ctx.getImageData(this.projectileTrajectory[i].x, this.projectileTrajectory[i].y, 1, 1).data;
    //         if (pixel[0] !== 75) {
    //             return true;
    //         }
    //     }
    // }

    // isTerrainHit() {
    //     for (let i = 0; i < this.projectileTrajectory.length - 1; i++) {
    //         // const x = this.field.findGround(Math.round(this.projectileTrajectory[i].x));
    //         if (this.projectileTrajectory[i].y > this.field.findGround(Math.round(this.projectileTrajectory[i].x))) {
    //             return true;
    //         }
    //     }
    // }

    isTargetHit(playerState: Player[]) {
        for (const player of playerState) {
            for (let i = 0; i < this.projectileTrajectory.length - 1; i++) {
                if (
                    this.projectileTrajectory[i].x > player.xPosition - 8 &&
                    this.projectileTrajectory[i].x < player.xPosition + 8 &&
                    this.projectileTrajectory[i].y > player.yPosition - 8 &&
                    this.projectileTrajectory[i].y < player.yPosition + 8 &&
                    this.xPosition !== player.xPosition
                ) {
                    this.ctx.fillStyle = 'orange';
                    drawCanvasArc(this.ctx, player.xPosition, player.yPosition, 15);
                    playerState.map((item) => {
                        if (item.xPosition === player.xPosition) {
                            item.isHitted = true;
                        }
                    });

                    setTimeout(() => {
                        for (const player of playerState) {
                            if (player.isHitted) {
                                playerState.splice(playerState.indexOf(player), 1);
                                this.projectileTrajectory = [];
                            }
                        }
                    }, 1000);
                    return player;
                }
            }
        }
    }

    fireProjectile(playerState: Player[]) {
        this.calculateTrajectory(playerState);
        this.shoot();
    }

    drawPlayer() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.xPosition, this.yPosition, 10, 10);
    }

    drawTerrainHit() {
        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1) {
            this.ctx.fillStyle = 'red';
            drawCanvasArc(
                this.ctx,
                this.projectileTrajectory[this.projectileTrajectory.length - 1].x + 5,
                this.projectileTrajectory[this.projectileTrajectory.length - 1].y,
                10
            );
        }
    }

    drawHit(playerState: Player[]) {
        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1 && this.isTargetHit(playerState)) {
            this.ctx.fillStyle = 'red';
            drawCanvasArc(
                this.ctx,
                this.projectileTrajectory[this.projectileTrajectory.length - 1].x + 5,
                this.projectileTrajectory[this.projectileTrajectory.length - 1].y,
                10
            );
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
