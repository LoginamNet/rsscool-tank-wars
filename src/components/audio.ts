import { State } from './state';

export class Sounds {
    static play(name: string, num = 1) {
        const audio = new Audio(`../assets/audio/${name}.mp3`);
        if (State.settings.sound === 'OFF') {
            audio.volume = 0;
        } else {
            audio.volume = +`${num}`;
        }
        audio.play();
    }
}
