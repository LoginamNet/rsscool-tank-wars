import { State } from './state';

export class Sounds {
    play(name: string, num = 0.3) {
        const audio = new Audio(`../assets/audio/${name}.mp3`);
        if (State.settings.sound === 'OFF') {
            audio.volume = 0;
        } else {
            audio.volume = +`${num}`;
        }
        audio.play();
    }
}
