import {
  GET_ALL_NEWS,
  ALL_NEWS_RECEIVED,
  LAST_NEWS_RECEIVED,
  GET_LAST_NEWS,
  ALL_NEWS_DELETED,
  UPDATE_PLAYERS_TABLE, CREATE_GAME_OBJECT, ReducerActionType
} from "../types";
import {Game} from "../../game/models/Game";
import {Player} from "../../game/models/Player";
import {initialSettings, rules, Rules, SettingsInterface} from "../../game/constants/settingsConfig";
import {GameActions} from "../actions/gameActions";
import {CountryName} from "../../game/constants/CountryName";
import {Point} from "../../game/constants/coordinates";

export interface DefaultReducerStateType {
  game: Game | undefined,
  players: Player[] | undefined,
  rules: Rules,
  settings: SettingsInterface,
  loading: boolean,
  clickedTerritoryFrom: CountryName | '',
  clickedTerritoryTo: CountryName | '',
  modalCoordinates: Point,
}

const defaultReducerState: DefaultReducerStateType = {
  game: undefined,
  players: undefined,
  rules: rules,
  settings: initialSettings,
  loading: false,
  clickedTerritoryFrom: '',
  clickedTerritoryTo: '',
  modalCoordinates: {x: 0, y: 0}
}

const reducer = (state = defaultReducerState, action: GameActions): DefaultReducerStateType => {
  console.log('reducer',state, action)

  const game = state.game

  switch (action.type) {
    // case GET_ALL_NEWS: case GET_LAST_NEWS:
    //   return { ...state, loading: true };
    // case LAST_NEWS_RECEIVED:
    //   return { ...state, lastNews: action.json[0], loading: false }
    // case ALL_NEWS_RECEIVED:
    //   return { ...state, news: action.json, loading: false }
    // case ALL_NEWS_DELETED:
    //   return { ...state, news: undefined, lastNews: undefined, loading: false }
    // case UPDATE_PLAYERS_TABLE:
    //   return { ...state, loading: false }
    case ReducerActionType.CREATE_GAME_OBJECT:
      return { ...state, game: action.payload.game, loading: false }
    case ReducerActionType.SET_PLAYERS:
      if(game) game.players = action.payload.players
      return { ...state, players: action.payload.players, game, loading: false }
    case ReducerActionType.ADD_PLAYER: {
      const players = [...state.players || []]
      players.push(action.payload.player)
      if(game) game.players = players
      return { ...state, players, game, loading: false }
    }
    case ReducerActionType.REMOVE_LAST_PLAYER: {
      if(!state.players) throw 'There is no player to remove'
      const players = [...state.players]
      players.pop()
      if(game) game.players = players
      return { ...state, players, game, loading: false }
    }
    case ReducerActionType.CLICK_TERRITORY:
      if(!state.clickedTerritoryFrom) {
        return { ...state, clickedTerritoryFrom: action.payload.territory, modalCoordinates: action.payload.clickCoordinates, clickedTerritoryTo: ""}
      } else {
        return { ...state, clickedTerritoryFrom: action.payload.territory, modalCoordinates: action.payload.clickCoordinates, clickedTerritoryTo: ""}
      }
      return { ...state, }

    default:
      return state;
  }
};

export default reducer;
