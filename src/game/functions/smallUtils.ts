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

export function getRandomDice() {
    return Math.floor( Math.random() * 6 ) + 1;
}

export const getNRandomDices = (n: number) => {
  const dices = []
    for (let i = 1; i <= n; i++) dices.push(getRandomDice())

    return dices
}

export const getBiggestSmallestDices = (attackerDices: number[], defenderDices: number[]) => {
    const attackerDiceBig = Math.max(...attackerDices), attackerDiceSmall = Math.min(...attackerDices);
    const defenderDiceBig = Math.max(...defenderDices), defenderDiceSmall = Math.min(...defenderDices);

    return {attackerDiceBig, attackerDiceSmall, defenderDiceBig, defenderDiceSmall}
}

export const generateRandomColor = () => {
  const get0255 = () => {
    return Math.round(Math.random() * 255)
  }
  return `rgb(${get0255()},${get0255()},${get0255()})`
}