import { Sounds } from './audio';
const sound = new Sounds();

export function stop() {
    document.addEventListener('click', (e) => {
        const target = <HTMLButtonElement>e.target;
        if (target.classList.contains('button')) {
            target.textContent = 'ON';
            sound.stop('scroll_gun');
        }
    });
}
