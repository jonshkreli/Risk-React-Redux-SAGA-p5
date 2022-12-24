import {ReducerActionType} from "../types";
import {Game} from "../../game/models/Game";
import {Player} from "../../game/models/Player";
import {Rules, SettingsInterface} from "../../game/constants/settingsConfig";
import {CountryName} from "../../game/constants/CountryName";
import {Point} from "../../game/constants/coordinates";

export type GameActions =
    SetGameObjectAction |
    CreatePlayersAction | AddPlayerAction | RemoveLastPlayerAction |
    SetRulesAction | SetSettingsAction |
    ClickTerritoryAction

export interface SetGameObjectAction {
    type: ReducerActionType.CREATE_GAME_OBJECT,
    payload: { game: Game }
}
export interface CreatePlayersAction {
    type: ReducerActionType.SET_PLAYERS,
    payload: { players: Player[] }
}
export interface AddPlayerAction {
    type: ReducerActionType.ADD_PLAYER,
    payload: { player: Player }
}
export interface SetPlayerAction {
    type: ReducerActionType.SET_PLAYER,
    payload: { player: Player }
}
export interface RemoveLastPlayerAction {
    type: ReducerActionType.REMOVE_LAST_PLAYER,
}
export interface SetRulesAction {
    type: ReducerActionType.SET_RULES,
    payload: { rules: Rules }
}
export interface SetSettingsAction {
    type: ReducerActionType.SET_SETTINGS,
    payload: { settings: SettingsInterface }
}
export interface ClickTerritoryAction {
    type: ReducerActionType.CLICK_TERRITORY,
    payload: { territory: CountryName | '', clickCoordinates: Point }
}