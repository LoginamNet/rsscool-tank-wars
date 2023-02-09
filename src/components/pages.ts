import { CANVAS_HEIGHT, CANVAS_WIDTH, POWER_GUN } from '../common/constants';
import { checkedQuerySelector } from './utils';

export class Page {
    body = checkedQuerySelector(document, 'body');

    renderGame() {
        this.body.innerHTML = `
        <div id= "game-data">
            <div class="angle" >Angle: 45</div>
            <div class="power" >Power: ${POWER_GUN}</div>
        </div>
        <div class="game">
            <canvas class="canvas canvas_background" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
            <canvas class="canvas canvas_tank" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
            <canvas class="canvas canvas_animation" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
            <canvas class="canvas canvas_ui" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
        </div>
        
        `;
    }
}
