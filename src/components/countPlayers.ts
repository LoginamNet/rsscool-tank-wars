import { checkedQuerySelector, getRandomColor, getRandomName } from './utils';
import { Player } from './player';
import { Field } from './field';

export class Count {
    canvas = <HTMLCanvasElement>checkedQuerySelector(document, '.canvas_animation');
    ctx = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    field = new Field();

    constructor(public num: number) {}

    getPlayers() {
        // for (let i = 0; i < this.num; i++) {
        //     new Player(this.ctx, this.field, 350, 590, getRandomName(), getRandomColor());
        // }
        switch (this.num) {
            case 2:
                new Player(this.ctx, this.field, 35, 0, getRandomName(), getRandomColor());
                new Player(this.ctx, this.field, 745, 0, getRandomName(), getRandomColor());
                break;
            case 3:
                new Player(this.ctx, this.field, 35, 0, getRandomName(), getRandomColor());
                new Player(this.ctx, this.field, 385, 0, getRandomName(), getRandomColor());
                new Player(this.ctx, this.field, 745, 0, getRandomName(), getRandomColor());
                break;
            case 4:
                new Player(this.ctx, this.field, 35, 0, getRandomName(), getRandomColor());
                new Player(this.ctx, this.field, 265, 0, getRandomName(), getRandomColor());
                new Player(this.ctx, this.field, 505, 0, getRandomName(), getRandomColor());
                new Player(this.ctx, this.field, 745, 0, getRandomName(), getRandomColor());
                break;
        }
    }
}
