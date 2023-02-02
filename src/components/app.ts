import { Player } from './player';
import { playerState } from './state';
import { checkedQuerySelector } from './utils';
import { Field } from './field';

export function x() {
    const canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas');
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

    const field = new Field();
    field.generate();

    const p1 = new Player(ctx, 30, 590);
    playerState.push(p1);
    const p2 = new Player(ctx, 650, 590);
    playerState.push(p2);
    const p3 = new Player(ctx, 70, 530);
    playerState.push(p3);

    start();

    const curentPl = playerState[0];

    function setControlKeys() {
        document.addEventListener('keydown', (event) => {
            if (!curentPl.isFired) {
                curentPl.projectileTrajectory = [];
                switch (event.code) {
                    case 'ArrowUp':
                        curentPl.angleUp();
                        break;
                    case 'ArrowDown':
                        curentPl.angleDown();
                        break;
                    case 'ArrowLeft':
                        curentPl.powerDown();
                        break;
                    case 'ArrowRight':
                        curentPl.powerUp();
                        break;
                    case 'Space':
                        curentPl.fireProjectile(playerState);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    function clean() {
        ctx.clearRect(0, 0, 800, 600);
    }

    function start() {
        clean();
        setControlKeys();
        for (const player of playerState) {
            player.drawPlayer();
        }

        window.requestAnimationFrame(update);
    }

    function update() {
        curentPl.setAngle();
        clean();
        renderField(field.export()); //drawing ground and sky
        curentPl.yPosition = field.findGround(curentPl.xPosition);
        for (const player of playerState) {
            player.drawPlayer();
        }
        curentPl.drawPlayerProjectile();
        curentPl.drawProjectilePath();
        curentPl.drawHit(playerState);
        curentPl.drawTerrainHit();

        window.requestAnimationFrame(update);
    }

    function renderField(field: ImageData) {
        ctx.putImageData(field, 0, 0);
    }
}
