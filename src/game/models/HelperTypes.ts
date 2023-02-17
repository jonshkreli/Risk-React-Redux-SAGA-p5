import {CountryName} from "../constants/CountryName";
import {DiceNumber} from "../constants/settingsConfig";

export type FromTo = {
    from: CountryName, to: CountryName
}

export type AttackSettings = {
    attackingDices: DiceNumber, attackAgain: boolean, moveAllSoldersAfterAttack?: boolean
}