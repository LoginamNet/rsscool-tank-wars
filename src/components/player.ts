import { LENGTH_GUN, POWER_GUN } from '../common/constants';
import { Field } from './field';
import { Tank } from './tank';
import { Ui } from './ui';
import { checkedQuerySelector, drawCanvasArc, getRandomWind, isGround, isOutsidePlayZone } from './utils';
import { explTank } from './explosion';
import { explShell } from './explosion-shell';
import { Sounds } from './audio';

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
    wind = getRandomWind();
    tank: Tank;
    ui: Ui;
    static tick = 0;
    static explosionX = 0;
    static explosionY = 0;
    static players: Player[] = [];
    static animationExplosionTankFlag = false;
    static animationExplosionShellFlag = false;
    static animationFlag = false;
    static ctx: CanvasRenderingContext2D;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private field: Field,
        public initialTankPositionX: number,
        public initialTankPositionY: number,
        public nameStr: string,
        public colorTank: string
    ) {
        this.name = nameStr;
        this.angle = initialTankPositionX > 400 ? 135 : 45;
        Player.players.push(this);
        this.positionX = initialTankPositionX;
        this.positionY = initialTankPositionY;
        this.tank = new Tank(this.positionX, this.positionY);
        this.ui = new Ui();
    }

    setPlayerInfo() {
        const angleText = checkedQuerySelector(document, '.angle');
        const powerText = checkedQuerySelector(document, '.power');
        const windText = checkedQuerySelector(document, '.wind');
        const playerText = checkedQuerySelector(document, '.player');
        const playerColor = checkedQuerySelector(document, '.color');
        angleText.innerHTML = 'Angle: ' + this.angle + '°';
        powerText.innerHTML = 'Power: ' + this.power + '%';
        windText.innerHTML = 'Wind: ' + `${Math.abs(Math.round(this.wind * 100))}m/s ${this.wind < 0 ? '<<<' : '>>>'}`;
        playerText.innerHTML = 'Plr: ' + this.name;
        playerColor.style.backgroundColor = this.colorTank;
    }

    setPower() {
        const angleText = checkedQuerySelector(document, '.power');
        angleText.innerHTML = 'Power: ' + this.power;
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
            xCoordinate =
                this.wind * time +
                this.calcXCoords() +
                (this.power / 10) * Math.cos((this.angle / 180) * Math.PI) * time;

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
            Player.explosionX = this.projectileTrajectory[this.currentTrajectoryIndex].x;
            Player.explosionY = this.projectileTrajectory[this.currentTrajectoryIndex].y;
            Player.animationExplosionShellFlag = true;
            Player.ctx = this.ctx;
        }
    }

    private endShot() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = 0;
            this.isFired = false;
            // Player.animationFlag = false;
            this.wind = getRandomWind();
            this.setPlayerInfo();
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
        this.tank.initialTankPositionX = this.positionX;
        this.tank.initialTankPositionY = this.positionY;
        this.tank.drawTankGun(this.calcXCoords(), this.calcYCoords());
        this.tank.drawBodyTank(this.colorTank);
    }

    clearPlayers() {
        this.tank.clearTanks();
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
            Player.animationExplosionTankFlag = true;
            Player.ctx = this.ctx;
            Sounds.play('bang_tank');

            for (const player of players) {
                if (player.isHitted) {
                    Player.explosionX = player.positionX;
                    Player.explosionY = player.positionY;
                    players.splice(players.indexOf(player), 1);
                    this.projectileTrajectory = [];
                    this.updatePlayers();
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

    static drawExplosionTank() {
        const tickFrame = Math.floor(Player.tick / explTank.speed);
        Player.animationFlag = true;
        Player.animationExplosionShellFlag = false;
        Player.ctx.drawImage(
            explTank.img,
            explTank.frame[tickFrame][0],
            explTank.frame[tickFrame][1],
            explTank.width,
            explTank.height,
            Player.explosionX - 20,
            Player.explosionY - 70,
            66,
            81
        );
        Player.tick++;
        if (Math.floor(this.tick / 10) === 24) {
            this.tick = 0;
            Player.animationExplosionTankFlag = false;
            Player.animationFlag = false;
        }
    }

    static drawExplosionShell() {
        const tickFrame = Math.floor(Player.tick / explShell.speed);
        Player.animationFlag = true;
        Player.ctx.drawImage(
            explShell.img,
            explShell.frame[tickFrame][0],
            explShell.frame[tickFrame][1],
            explShell.width,
            explShell.height,
            Player.explosionX - 15,
            Player.explosionY - 22,
            30,
            30
        );
        Player.tick++;
        if (Math.floor(this.tick / 10) === explShell.amountFrame) {
            this.tick = 0;
            Player.animationExplosionShellFlag = false;
            Player.animationFlag = false;
        }
    }

    updatePlayers() {
        this.clearPlayers();
        for (const player of Player.players) {
            player.drawPlayer();
        }
        this.updatePlayersUi();
    }

    private updatePlayersUi() {
        this.ui.renderTanksName(Player.players);
    }
}
