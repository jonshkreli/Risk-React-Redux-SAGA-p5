import {ContinentName} from "../constants/continents";

export type ContinentsWithNumber = { [K in ContinentName]: number }

export const generateEmptyContinentsWithNumber = (): ContinentsWithNumber => ({
    "North-America": 0,
    "South-America": 0,
    "Europe": 0,
    "Africa": 0,
    "Asia": 0,
    "Australia": 0,
})

export function shuffleArray(arr: any[]) {
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i);
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
}