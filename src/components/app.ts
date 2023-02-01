import { Player } from './player';
import { checkedQuerySelector } from './utils';
import { Field } from './field';

export function x() {
    const canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas');
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

    const pl = new Player(ctx, 30, 590);

    const field = new Field();
    field.generate();

    start();

    function setControlKeys() {
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'ArrowUp':
                    pl.angleUp();
                    break;
                case 'ArrowDown':
                    pl.angleDown();
                    break;
                case 'ArrowLeft':
                    pl.powerDown();
                    break;
                case 'ArrowRight':
                    pl.powerUp();
                    break;
                case 'Space':
                    if (!pl.isFired) {
                        pl.fireProjectile();
                    }
                    break;
                default:
                    break;
            }
        });
    }

    function clean() {
        ctx.clearRect(0, 0, 800, 600);
    }

    function start() {
        clean();
        setControlKeys();
        pl.drawPlayer();
        pl.drawHit();

        window.requestAnimationFrame(update);
    }

    function update() {
        clean();
        renderField(field.export()); //drawing ground and sky
        pl.yPosition = field.findGround(pl.xPosition);
        pl.drawPlayer();
        pl.drawProjectilePath();
        pl.drawPlayerProjectile();
        pl.drawHit();

        window.requestAnimationFrame(update);
    }

    function renderField(field: ImageData) {
        ctx.putImageData(field, 0, 0);
    }
}
