import {ReducerActionType} from "../types";
import {Game} from "../../game/models/Game";
import {Player} from "../../game/models/Player";
import {Rules, SettingsInterface} from "../../game/constants/settingsConfig";
import {CountryName} from "../../game/constants/CountryName";
import {Point} from "../../game/constants/coordinates";
import {PlayerDetails} from "../../game/models/PlayerDetails";

export type GameActions =
    SetGameObjectAction |
    CreatePlayersAction | AddPlayerAction | RemoveLastPlayerAction |
    SetRulesAction | SetSettingsAction |
    ClickTerritoryAction | ToggleViewCardsAction |
    PlayerWantsToAttackAction | PlayerWantsToMoveAction | MoveSoldersAction | CancelAction


export interface SetGameObjectAction {
    type: ReducerActionType.CREATE_GAME_OBJECT,
    payload: { game: Game }
}

export interface CreatePlayersAction {
    type: ReducerActionType.SET_PLAYERS,
    payload: { players: PlayerDetails[] }
}

export interface AddPlayerAction {
    type: ReducerActionType.ADD_PLAYER,
    payload: { player: PlayerDetails }
}

export interface SetPlayerAction {
    type: ReducerActionType.SET_PLAYER,
    payload: { player: PlayerDetails }
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

export interface PlayerWantsToAttackAction {
    type: ReducerActionType.PLAYER_CHOOSE_ATTACKING_TO,
}

export interface PlayerWantsToMoveAction {
    type: ReducerActionType.PLAYER_CHOOSE_MOVING_TO,
}

export interface MoveSoldersAction {
    type: ReducerActionType.PLAYER_WANT_TO_MOVE_SOLDERS_TO,
    payload: { solders: number }
}

export interface CancelAction {
    type: ReducerActionType.CANCEL_ACTION,
}
export interface ToggleViewCardsAction {
    type: ReducerActionType.PLAYER_VIEW_CARDS,
}
