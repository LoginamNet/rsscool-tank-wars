import { Game } from './game';

export class App {
    game = new Game();

    render() {
        this.game.start();
    }
}
