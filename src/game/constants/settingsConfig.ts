import {ContinentName} from "./continents";

export interface SettingsInterface {
    fastGame: {
        value: boolean,
    },
    DoOrDieAttack: {
        value: boolean,
    },
    TerritoriesToWin: {
        value: number | 'all'
    }
    MAXPlayerNumber: {
        value: number
    }
}

export const initialSettings: SettingsInterface = {
    fastGame: {
        value: true,
    },
    DoOrDieAttack: {
        value: true,
    },
    TerritoriesToWin: {
        value: 20, // number or "all"
    },
    MAXPlayerNumber: {
        value: 6
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