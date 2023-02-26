import {
  CREATE_GAME_OBJECT,
  DELETE_ALL_NEWS,
  GET_ALL_NEWS,
  GET_LAST_NEWS,
  ReducerActionType,
  UPDATE_PLAYERS_TABLE
} from "../types";
import {Game} from "../../game/models/Game";
import {Player} from "../../game/models/Player";
import {
  AddPlayerAction, ClickTerritoryAction,
  SetGameObjectAction,
  CreatePlayersAction,
  RemoveLastPlayerAction,
  SetPlayerAction, PlayerWantsToAttackAction, MoveSoldersAction, SetSettingsAction, CancelAction, ToggleViewCardsAction
} from "./gameActions";
import {CountryName} from "../../game/constants/CountryName";
import {Point} from "../../game/constants/coordinates";
import {SettingsInterface} from "../../game/constants/settingsConfig";
import {PlayerDetails} from "../../game/models/PlayerDetails";

export const getLastNews = () => ({
  type: GET_LAST_NEWS,
});

export const getNews = () => ({
  type: GET_ALL_NEWS,
});

export const deleteNews = () => ({
  type: DELETE_ALL_NEWS,
});

export const updatePlayersTable = () => ({
  type: UPDATE_PLAYERS_TABLE,
});

export const setGameObject = (game: Game): SetGameObjectAction => ({
  type: ReducerActionType.CREATE_GAME_OBJECT,
  payload: {game}
});
export const setSettings = (settings: SettingsInterface): SetSettingsAction => ({
  type: ReducerActionType.SET_SETTINGS,
  payload: {settings}
});

export const setPlayers = (players: PlayerDetails[]): CreatePlayersAction => ({
  type: ReducerActionType.SET_PLAYERS,
  payload: {players}
});

export const addPlayer = (player: PlayerDetails): AddPlayerAction => ({
  type: ReducerActionType.ADD_PLAYER,
  payload: {player}
});
export const setPlayer = (player: PlayerDetails): SetPlayerAction => ({
  type: ReducerActionType.SET_PLAYER,
  payload: {player}
});
export const removeLastPlayer = (): RemoveLastPlayerAction => ({
  type: ReducerActionType.REMOVE_LAST_PLAYER,
});
export const clickTerritory = (territory: CountryName | '', clickCoordinates: Point): ClickTerritoryAction => ({
  type: ReducerActionType.CLICK_TERRITORY,
  payload: {territory, clickCoordinates}
});

export const performAMove = (solders: number): MoveSoldersAction => ({
  type: ReducerActionType.PLAYER_WANT_TO_MOVE_SOLDERS_TO,
  payload: {solders}
});

export const cancelAction = (): CancelAction => ({
  type: ReducerActionType.CANCEL_ACTION,
});

export const toggleCardsModal = (): ToggleViewCardsAction => ({
  type: ReducerActionType.PLAYER_VIEW_CARDS,
});

