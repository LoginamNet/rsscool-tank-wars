import { Game } from './game';
import { Page } from './pages';
import { stop } from './btn';

export class App {
    page = new Page();

    render() {
        this.page.renderGame();
        const game = new Game();
        game.start();
        stop();
    }
}
