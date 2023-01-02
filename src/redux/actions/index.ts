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
  SetPlayerAction, PlayerWantsToAttackAction
} from "./gameActions";
import {CountryName} from "../../game/constants/CountryName";
import {Point} from "../../game/constants/coordinates";

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

export const setPlayers = (players: Player[]): CreatePlayersAction => ({
  type: ReducerActionType.SET_PLAYERS,
  payload: {players}
});

export const addPlayer = (player: Player): AddPlayerAction => ({
  type: ReducerActionType.ADD_PLAYER,
  payload: {player}
});
export const setPlayer = (player: Player): SetPlayerAction => ({
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
export const performAnAttack = (): PlayerWantsToAttackAction => ({
  type: ReducerActionType.PLAYER_CHOOSE_ATTACKING_TO,
});

