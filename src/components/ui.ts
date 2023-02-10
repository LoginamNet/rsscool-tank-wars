import { checkedQuerySelector } from './utils';
import { Player } from './player';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../common/constants';

export class Ui {
    canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas_ui');
    ctx = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

    renderTanksName(players: Player[]) {
        this.clearUi();
        for (const player of players) {
            this.renderTankName(player);
        }
    }

    private clearUi() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    private renderTankName(player: Player) {
        this.ctx.font = '16px serif';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(player.name, player.positionX - 10, player.positionY - 40);
    }
}
