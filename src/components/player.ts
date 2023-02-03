import { Field } from './field';
import { checkedQuerySelector, drawCanvasArc, degToRad } from './utils';

export class Player {
    angle: number;
    power = 100;
    projectileTrajectory: { x: number; y: number }[] = [];
    currentTrajectoryIndex = 0;
    intervalId = 0;
    isFired = false;
    isHitted = false;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private field: Field,
        public initialPositionX: number,
        public initialPositionY: number
    ) {
        this.angle = initialPositionX > 400 ? 135 : 45;
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
            xCoordinate =
                this.initialPositionX + 15 + (this.power / 20) * Math.cos((this.angle / 180) * Math.PI) * time;

            yCoordinate =
                this.initialPositionY -
                13 -
                ((this.power / 20) * Math.sin((this.angle / 180) * Math.PI) * time + 0.5 * g * Math.pow(time, 2));

            this.projectileTrajectory.push({ x: xCoordinate, y: yCoordinate });
            time++;
        } while (
            xCoordinate >= -20 &&
            xCoordinate <= 810 &&
            !this.isTerrainHit() &&
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
        console.log(this.isFired);

        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1) {
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

    isTerrainHit() {
        const canvas = this.field.canvas;
        const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        for (let i = 0; i < this.projectileTrajectory.length - 1; i++) {
            const pixel = ctx.getImageData(this.projectileTrajectory[i].x, this.projectileTrajectory[i].y, 1, 1).data;
            if (pixel[0] === 19) {
                return true;
            }
        }
    }

    // isTerrainHit() {
    //     for (let i = 0; i < this.projectileTrajectory.length - 1; i++) {
    //         if (this.projectileTrajectory[i].y > this.field.findGround(Math.round(this.projectileTrajectory[i].x))) {
    //             console.log(1);
    //             return true;
    //         }
    //     }
    // }

    isTargetHit(playerState: Player[]) {
        for (const player of playerState) {
            for (let i = 0; i < this.projectileTrajectory.length - 1; i++) {
                if (
                    this.projectileTrajectory[i].x > player.initialPositionX - 2.5 &&
                    this.projectileTrajectory[i].x < player.initialPositionX + 34 &&
                    this.projectileTrajectory[i].y > player.initialPositionY - 10 &&
                    this.projectileTrajectory[i].y < player.initialPositionY + 2.5 &&
                    this.initialPositionX !== player.initialPositionX
                ) {
                    this.ctx.fillStyle = 'orange';
                    drawCanvasArc(this.ctx, player.initialPositionX + 15, player.initialPositionY - 5, 25);
                    playerState.map((item) => {
                        if (item.initialPositionX === player.initialPositionX) {
                            item.isHitted = true;
                        }
                    });
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
        // wheels
        const step = 10;
        let x = this.initialPositionX;
        for (let i = 0; i < 4; i++) {
            this.ctx.beginPath();
            this.ctx.arc(x, this.initialPositionY, 3, degToRad(0), degToRad(360));
            this.ctx.fillStyle = '#000000';
            this.ctx.fill();
            this.ctx.stroke();
            x += step;
        }

        // tank hull
        this.ctx.beginPath();
        this.ctx.moveTo(this.initialPositionX - 7, this.initialPositionY);
        this.ctx.lineTo(this.initialPositionX - 3, this.initialPositionY - 6);
        this.ctx.lineTo(this.initialPositionX + 33, this.initialPositionY - 6);
        this.ctx.lineTo(this.initialPositionX + 37, this.initialPositionY);
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();

        // tank tower
        this.ctx.beginPath();
        this.ctx.arc(this.initialPositionX + 15, this.initialPositionY - 7, 10, degToRad(180), degToRad(0));
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
        this.ctx.stroke();

        // tank gun
        this.ctx.beginPath();
        this.ctx.moveTo(this.initialPositionX + 15, this.initialPositionY - 9);
        this.ctx.lineTo(this.initialPositionX + 40, this.initialPositionY - 20);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();
    }

    drawTerrainHit() {
        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1) {
            this.ctx.fillStyle = 'red';
            drawCanvasArc(
                this.ctx,
                this.projectileTrajectory[this.projectileTrajectory.length - 1].x,
                this.projectileTrajectory[this.projectileTrajectory.length - 1].y - 5,
                10
            );
        }
    }

    drawHit(playerState: Player[]) {
        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1 && this.isTargetHit(playerState)) {
            this.ctx.fillStyle = 'red';
            drawCanvasArc(
                this.ctx,
                this.projectileTrajectory[this.projectileTrajectory.length - 1].x,
                this.projectileTrajectory[this.projectileTrajectory.length - 1].y - 5,
                10
            );

            setTimeout(() => {
                for (const player of playerState) {
                    if (player.isHitted) {
                        playerState.splice(playerState.indexOf(player), 1);
                        this.projectileTrajectory = [];
                    }
                }
            }, 700);
        }
    }

    drawPlayerProjectile() {
        this.ctx.fillStyle = 'red';
        if (this.currentTrajectoryIndex && this.projectileTrajectory[this.currentTrajectoryIndex] !== undefined) {
            drawCanvasArc(
                this.ctx,
                this.projectileTrajectory[this.currentTrajectoryIndex].x,
                this.projectileTrajectory[this.currentTrajectoryIndex].y,
                3
            );
        }
    }

    drawProjectilePath() {
        this.ctx.fillStyle = 'white';
        if (this.currentTrajectoryIndex) {
            for (let i = 0; i < this.currentTrajectoryIndex; i++) {
                if (this.projectileTrajectory[i] !== undefined) {
                    drawCanvasArc(this.ctx, this.projectileTrajectory[i].x, this.projectileTrajectory[i].y, 1);
                }
            }
        }
    }
}
