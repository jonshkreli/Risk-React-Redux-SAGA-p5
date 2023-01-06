import {Territory} from "../constants/Territory";
import {CountryName} from "../constants/CountryName";
import {Player} from "../models/Player";

export const isInBorder = (territory: Territory, borderTerritoryName: CountryName) => {
    return !!territory.borders.find(t => t === borderTerritoryName)
}

export const canPlayerAttackFromThisTerritory = (player: Player, territoryName: CountryName) => {
    const territory = player.getTerritory(territoryName);
    if (!territory) throw `${territoryName} must belong to player ${player.name}`

    if (territory.soldiers <= 1) return false

    for (const borderTerr of territory.borders) if (!player.getTerritory(borderTerr)) return true

    return false
}