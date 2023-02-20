/* interfaces ------------------------------------------------- */

import { Player } from '../components/player';

export interface stateGame {
    players: Player[];
    currentPl?: Player;
}
