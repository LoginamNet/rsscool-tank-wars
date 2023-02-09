import { LENGTH_GUN, POWER_GUN } from '../common/constants';
import { checkedQuerySelector, drawCanvasArc, degToRad, isGround, isOutsidePlayZone } from './utils';
import { Field } from './field';
import { Page } from './pages';
import { expl } from './explosion';

export class Player {
    name: string;
    angle: number;
    power = POWER_GUN;
    projectileTrajectory: { x: number; y: number }[] = [];
    currentTrajectoryIndex = 0;
    intervalId = 0;
    isFired = false;
    isHitted = false;
    positionX: number;
    positionY: number;
    static tick = 0;
    static explosionX = 0;
    static explosionY = 0;
    static players: Player[] = [];
    static animationExplosionFlag = false;
    static ctx: CanvasRenderingContext2D;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private field: Field,
        public initialTankPositionX: number,
        public initialTankPositionY: number,
        public nameStr: string
    ) {
        this.name = nameStr;
        this.angle = initialTankPositionX > 400 ? 135 : 45;
        Player.players.push(this);
        this.positionX = initialTankPositionX;
        this.positionY = initialTankPositionY;
    }

    setPlayerInfo() {
        const angleText = checkedQuerySelector(document, '.angle');
        const powerText = checkedQuerySelector(document, '.power');

        angleText.innerHTML = 'Angle: ' + this.angle;
        powerText.innerHTML = 'Power: ' + this.power;
    }

    angleUp() {
        this.angle < 180 ? this.angle++ : (this.angle = 180);
        const angleText = checkedQuerySelector(document, '.angle');
        angleText.innerHTML = 'Angle: ' + this.angle;
    }

    angleDown() {
        this.angle > 0 ? this.angle-- : (this.angle = 0);
        const angleText = checkedQuerySelector(document, '.angle');
        angleText.innerHTML = 'Angle: ' + this.angle;
    }

    powerUp() {
        this.power < 100 ? this.power++ : (this.power = 100);
        const powerText = checkedQuerySelector(document, '.power');
        powerText.innerHTML = 'Power: ' + this.power;
    }

    powerDown() {
        this.power > 0 ? this.power-- : (this.power = 0);
        const powerText = checkedQuerySelector(document, '.power');
        powerText.innerHTML = 'Power: ' + this.power;
    }

    private calcAngle() {
        return ((360 - this.angle) * Math.PI) / 180;
    }

    private calcXCoords() {
        return this.initialTankPositionX + 15 + Math.cos(this.calcAngle()) * LENGTH_GUN;
    }

    private calcYCoords() {
        return this.initialTankPositionY - 9 + Math.sin(this.calcAngle()) * LENGTH_GUN;
    }

    private calculateTrajectory(players: Player[]) {
        this.projectileTrajectory = [];
        let xCoordinate = 0;
        let yCoordinate = 0;
        let time = 0;
        const g = -9.8 / 100;
        do {
            xCoordinate = this.calcXCoords() + (this.power / 10) * Math.cos((this.angle / 180) * Math.PI) * time;

            yCoordinate =
                this.calcYCoords() -
                ((this.power / 10) * Math.sin((this.angle / 180) * Math.PI) * time + 0.5 * g * Math.pow(time, 2));

            this.projectileTrajectory.push({ x: xCoordinate, y: yCoordinate });
            time++;
        } while (
            xCoordinate >= -20 &&
            xCoordinate <= 810 &&
            !this.isTerrainHit() &&
            !this.isTargetHit(players)?.isHitted
        );
    }

    private shoot() {
        this.currentTrajectoryIndex = 0;
        this.intervalId = window.setInterval(this.nextProjectilePosition.bind(this), 10);
        if (this.power === 0) {
            clearInterval(this.intervalId);
            this.intervalId = 0;
            this.isFired = false;
        } else {
            this.isFired = true;
        }
    }

    private nextProjectilePosition() {
        this.currentTrajectoryIndex++;
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
            const pixel = ctx.getImageData(this.projectileTrajectory[i].x, this.projectileTrajectory[i].y, 1, 1);
            if (isGround(pixel)) {
                return true;
            }
            if (isOutsidePlayZone(this.projectileTrajectory[i].x)) {
                return true;
            }
        }
    }

    isTargetHit(players: Player[]) {
        for (const player of players) {
            for (let i = 0; i < this.projectileTrajectory.length - 1; i++) {
                if (
                    this.projectileTrajectory[i].x > player.initialTankPositionX - 2.5 &&
                    this.projectileTrajectory[i].x < player.initialTankPositionX + 34 &&
                    this.projectileTrajectory[i].y > player.initialTankPositionY - 10 &&
                    this.projectileTrajectory[i].y < player.initialTankPositionY + 2.5 &&
                    this.initialTankPositionX !== player.initialTankPositionX
                ) {
                    // this.ctx.fillStyle = 'orange';
                    // drawCanvasArc(this.ctx, player.initialPositionX + 15, player.initialPositionY - 5, 25);
                    players.map((item) => {
                        if (item.initialTankPositionX === player.initialTankPositionX) {
                            item.isHitted = true;
                        }
                    });
                    return player;
                }
            }
        }
    }

    fireProjectile(players: Player[]) {
        this.calculateTrajectory(players);
        this.shoot();
    }

    drawPlayer() {
        // wheels
        const step = 10;
        let x = this.initialTankPositionX;
        for (let i = 0; i < 4; i++) {
            this.ctx.beginPath();
            this.ctx.arc(x, this.initialTankPositionY, 3, degToRad(0), degToRad(360));
            this.ctx.fillStyle = '#000000';
            this.ctx.fill();
            this.ctx.stroke();
            x += step;
        }

        // tank hull
        this.ctx.beginPath();
        this.ctx.moveTo(this.initialTankPositionX - 7, this.initialTankPositionY);
        this.ctx.lineTo(this.initialTankPositionX - 3, this.initialTankPositionY - 6);
        this.ctx.lineTo(this.initialTankPositionX + 33, this.initialTankPositionY - 6);
        this.ctx.lineTo(this.initialTankPositionX + 37, this.initialTankPositionY);
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();

        // tank tower
        this.ctx.beginPath();
        this.ctx.arc(this.initialTankPositionX + 15, this.initialTankPositionY - 7, 10, degToRad(180), degToRad(0));
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
        this.ctx.stroke();

        // tank gun
        this.ctx.beginPath();
        this.ctx.moveTo(this.initialTankPositionX + 15, this.initialTankPositionY - 9);
        this.ctx.lineTo(this.calcXCoords(), this.calcYCoords());
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();
    }

    drawTerrainHit() {
        if (
            this.currentTrajectoryIndex === this.projectileTrajectory.length - 1 &&
            isOutsidePlayZone(this.projectileTrajectory[this.projectileTrajectory.length - 1].x)
        ) {
            this.ctx.fillStyle = 'red';
            drawCanvasArc(
                this.ctx,
                this.projectileTrajectory[this.projectileTrajectory.length - 1].x,
                this.projectileTrajectory[this.projectileTrajectory.length - 1].y - 5,
                10
            );
        }
    }

    drawHit(players: Player[]) {
        if (this.currentTrajectoryIndex === this.projectileTrajectory.length - 1 && this.isTargetHit(players)) {
            //this.ctx.fillStyle = 'red';
            // drawCanvasArc(
            //     this.ctx,
            //     this.projectileTrajectory[this.projectileTrajectory.length - 1].x,
            //     this.projectileTrajectory[this.projectileTrajectory.length - 1].y,
            //     10
            // );

            Player.animationExplosionFlag = true;
            Player.ctx = this.ctx;

            for (const player of players) {
                if (player.isHitted) {
                    Player.explosionX = player.positionX;
                    Player.explosionY = player.positionY;
                    players.splice(players.indexOf(player), 1);
                    this.projectileTrajectory = [];
                }
            }
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

    drawFire() {
        this.drawPlayerProjectile();
        this.drawProjectilePath();
        this.drawHit(Player.players);
        this.drawTerrainHit();
    }

    static drawExplosion() {
        const image = [
            [0, 0],
            [30, 0],
            [60, 0],
            [90, 0],
            [0, 30],
            [30, 30],
            [60, 30],
            [90, 30],
            [0, 60],
            [30, 60],
            [60, 60],
            [90, 60],
            [0, 90],
            [30, 90],
            [60, 90],
        ];
        const tickFrame = Math.floor(Player.tick / 10);

        Player.ctx.drawImage(
            expl,
            image[tickFrame][0],
            image[tickFrame][1],
            30,
            30,
            Player.explosionX - 10,
            Player.explosionY - 40,
            45,
            45
        );
        Player.tick++;
        if (Math.floor(this.tick / 10) === 15) {
            this.tick = 0;
            Player.animationExplosionFlag = false;
        }
    }
}
