import {CountryName} from "../../game/constants/CountryName";

export const territoryDoesNotBelongToPlayerMessage = (clickedTerritoryFrom: CountryName, playerName: string) => `${clickedTerritoryFrom} does not belong to ${playerName}!. Please select a territory that belongs to this player`
export const canNotAttackOwnTerritoryMessage = (clickedTerritoryTo: CountryName, playerName: string) => `${clickedTerritoryTo} belongs to ${playerName}. Can not attack its own territory!`
