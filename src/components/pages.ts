import { CANVAS_HEIGHT, CANVAS_WIDTH, POWER_GUN } from '../common/constants';
import { checkedQuerySelector } from './utils';

export class Page {
    body = checkedQuerySelector(document, 'body');

    renderGame() {
        this.body.innerHTML = `
        <div class="game">
            <canvas class="canvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
        </div>
        <div id= "game-data">
            <div class="angle" >Angle: 45</div>
            <div class="power" >Power: ${POWER_GUN}</div>
            <button class="stop__mus">STOP</button>
        </div>
        `;
    }
}
