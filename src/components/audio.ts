export class Sounds {
    constructor() {}

    play(name: string, num = 0.3) {
        const audio = new Audio(`../assets/готовая/${name}.mp3`);
        audio.volume = +`${num}`;
        audio.play();
    }

    stop(name: string) {
        const audio = new Audio(`../assets/готовая/${name}.mp3`);
        audio.pause();
    }

    openMus() {
        const music = new Audio('../assets/audio.mp3');
        music.volume = 0.3;
        music.play();
    }

    clickButton() {
        const click = new Audio('../assets/click.mp3');
        click.volume = 0.3;
        click.play();
    }

    scrollGun() {
        const scroll = new Audio('../assets/scroll_gun.mp3');
        scroll.volume = 0.5;
        scroll.play();
    }

    bangTank() {
        const bang = new Audio('../assets/готовая/bang-tank.mp3');
        bang.volume = 0.3;
        bang.play();
    }

    shotTank() {
        const shot = new Audio('../assets/готовая/shot-tank.mp3');
        shot.volume = 0.3;
        shot.play();
    }

    damageLand() {
        const dmgLand = new Audio('../assets/готовая/damage-po-zemle.mp3');
        // dmgLand.volume = 0.3;
        dmgLand.play();
    }
}
