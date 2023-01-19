import {CountryName} from "../constants/CountryName";
import {AttackFromToCases, MoveFromToCases} from "./Game";
import {DiceNumber} from "../constants/settingsConfig";

export interface GameActions {
    assignCardsToPlayers(): void
    putSoldiersInFieldFromPlayersHand(): void
    putAvailableSoldiers(territory: CountryName, soldersNumber: number): void
    performAnAttack(from: CountryName, to: CountryName, attackingDices: DiceNumber, attackAgain: boolean, moveAllSoldersAfterAttack: boolean): AttackFromToCases
    performAMove(from: CountryName, to: CountryName, soldersAmount: number): MoveFromToCases
}