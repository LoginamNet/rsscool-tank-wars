import { Player } from '../components/player';

/* interfaces ------------------------------------------------- */

export interface stateGame {
    players: Player[];
    currentPl?: Player;
}

/* enums ------------------------------------------------- */

export enum Sound {
    intro = 'intro',
    click = 'click',
    move = 'move',
    scroll = 'scroll_gun',
    shot = 'shot_tank',
    tankExplosion = 'bang_tank',
    terrainExplosion = 'damage_po_zemle',
    winner = 'winner',
}
