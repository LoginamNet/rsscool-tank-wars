import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../common/constants';
import { checkedQuerySelector } from './utils';

export class Page {
    body = checkedQuerySelector(document, 'body');
    width = CANVAS_WIDTH;
    height = CANVAS_HEIGHT;

    renderGame() {
        this.body.innerHTML = `
        <div class="game">
            <canvas class="canvas" width="${this.width}" height="${this.height}"></canvas>
        </div>
        <div id= "game-data">
            <div class="angle" >Angle: 45</div>
            <div class="power" >Power: 50</div>
        </div>
        `;
    }
}
