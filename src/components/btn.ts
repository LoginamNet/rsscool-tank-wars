import { Sounds } from './audio';
const sound = new Sounds();

export function stop() {
    document.addEventListener('click', (e) => {
        const target = <HTMLButtonElement>e.target;
        if (target.classList.contains('stop__mus')) {
          console.log(1);
          sound.allStop();
          console.log(sound.allStop());
        }
    });
}