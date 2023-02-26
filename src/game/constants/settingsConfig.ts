import {ContinentName} from "./continents";

export interface SettingsInterface {
    fastGame: {
        value: boolean,
    },
    ContinuousAndMoveAll: {
        value: boolean,
    },
    TerritoriesToWin: {
        value: number | 'all'
    }
    MAXPlayerNumber: {
        value: number
    },
    dicesNumber: {
        value: DiceNumber
    },
    continueAttack: {
      value: boolean
    },
    moveAllSoldersAfterAttack: {
        value: boolean
    },
    openCards: {
        amount: '3+' | '3'
        stars: 'as stated in card' | '1 per card'
    }
}

export type DiceNumber = 1 | 2 | 3 | 'max'

export const initialSettings: SettingsInterface = {
    dicesNumber: {value: "max"},
    moveAllSoldersAfterAttack: {value: false},
    continueAttack: {value: false},
    fastGame: {
        value: true,
    },
    ContinuousAndMoveAll: {
        value: true,
    },
    TerritoriesToWin: {
        value: 20, // number or "all"
    },
    MAXPlayerNumber: {
        value: 6
    },
    openCards: {
        amount: "3+",
        stars: "as stated in card"
    }
};

export interface Rules {
    SoldiersFromContinents: {
        [K in ContinentName]: {territories: number, soldiers: number}
    }
}

export const rules: Rules = {
    SoldiersFromContinents: {
        "North-America": {territories: 9, soldiers: 5},
        "South-America": {territories: 4, soldiers: 2},
        "Europe": {territories: 7, soldiers: 2},
        "Africa": {territories: 6, soldiers: 2},
        "Asia": {territories: 12, soldiers: 2},
        "Australia": {territories: 4, soldiers: 2},
    },
};

export enum PlayerColors {
    'red', 'green', 'blue', 'yellow', 'orange', 'black',
}
