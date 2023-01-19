import {gameState} from "./Game";

export interface GamePhases {
    get getState(): gameState
    nextGamePhase(): void
    previousGamePhase(): void
    attackFromPhase(): void
    finishAttackImmediatelyPhase(): void
    moveFromPhase(): void
    finishMovePhase(): void
    nextPlayerTurn(): void
}