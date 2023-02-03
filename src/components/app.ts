import { Game } from './game';
import { Page } from './pages';

export class App {
    page = new Page();

    render() {
        this.page.renderGame();
        const game = new Game();
        game.start();
    }
}
