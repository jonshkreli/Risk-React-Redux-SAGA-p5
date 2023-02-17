import {CountryName} from "../constants/CountryName";
import {AttackFromToCases, MoveFromToCases} from "./Game";
import {DiceNumber} from "../constants/settingsConfig";
import {AttackSettings, FromTo} from "./HelperTypes";
import {Message} from "./Message";

export interface GameActions {
    assignCardsToPlayers(): void

    putSoldiersInFieldFromPlayersHand(): void

    putAvailableSoldiers(territory: CountryName, soldersNumber: number): void

    performAnAttack({from, to}: FromTo,
                    {attackingDices, attackAgain, moveAllSoldersAfterAttack}: AttackSettings,
                    messages: Message[]): AttackFromToCases

    performAMove({from, to}: FromTo, soldersAmount: number, messages: Message[]): MoveFromToCases
}