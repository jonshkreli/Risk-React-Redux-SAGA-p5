import {Message} from "../models/Message";
import {MessageOrigins} from "../models/MessageOrigins";
import {Player} from "../models/Player";
import {CountryName} from "../constants/CountryName";
import {DiceNumber} from "../constants/settingsConfig";

export const soldersLeftAfterAttack = (attackingSoldersLeft: number, defendingSoldersLeft: number): Message => {
    return {
        type: "INFO",
        message: `attacking solders left: ${attackingSoldersLeft}, defending solders left: ${defendingSoldersLeft}`,
        origin: ['ATTACK', "ATTACK RESULT", "SOLDERS LEFT"]
    }
}

export const playerInvadedTerritoryFromPlayer = (attackingPlayer: Player, attackedPLayer: Player, invadedTerritory: CountryName): Message => {
    return {
        type: "SUCCESS",
        message: `${attackingPlayer.name} invaded ${invadedTerritory} from ${attackedPLayer.name}`,
        origin: ['ATTACK', "ATTACK RESULT", "TERRITORY INVADED"]
    }
}

export const playerIsOutOfTheGame = (attackedPLayer: Player): Message => {
    return {
        type: "SUCCESS",
        message: `${attackedPLayer.name} is out of the game`,
        origin: ['ATTACK', "ATTACK RESULT", "PLAYER OUT OF GAME"]
    }
}
export const couldNotInvadeTerritory = (attackingPlayer: Player, invadedTerritory: CountryName): Message => {
    return {
        type: "SUCCESS",
        message: `${attackingPlayer.name} could not invade ${invadedTerritory}`,
        origin: ['ATTACK', "ATTACK RESULT", "TERRITORY NOT INVADED"]
    }
}
export const startingAttack = (attackingPlayer: Player, invadedTerritory: CountryName, attackingDices: DiceNumber): Message => {
    return {
        type: "INFO",
        message: `${attackingPlayer.name} will attack ${invadedTerritory} with ${attackingDices} dices`,
        origin: ['ATTACK', "ATTACK WILL START",]
    }
}