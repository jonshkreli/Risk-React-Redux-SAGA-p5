import {ReducerActionType} from "../types";
import {Game, gameState} from "../../game/models/Game";
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
  message: string,
}

const defaultReducerState: DefaultReducerStateType = {
  game: undefined,
  players: undefined,
  rules: rules,
  settings: initialSettings,
  loading: false,
  clickedTerritoryFrom: '',
  clickedTerritoryTo: '',
  modalCoordinates: {x: 0, y: 0},
  message: ''
}

const reducer = (state = defaultReducerState, action: GameActions): DefaultReducerStateType => {
  console.log('reducer',state, action)

  const {game, clickedTerritoryFrom, clickedTerritoryTo} = state

  switch (action.type) {
    // case ReducerActionType.SET_RULES:
    //   break;
    // case ReducerActionType.SET_SETTINGS:
    //   break;
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
      switch (state.game?.getState) {
        case gameState.firstAttackFrom:
        case gameState.attackFrom:
        case gameState.moveSoldiersFromAfterAttack:
        case gameState.moveSoldiersFromNoAttack:
          return { ...state, modalCoordinates: action.payload.clickCoordinates, clickedTerritoryTo: action.payload.territory}
        default:
          return { ...state, modalCoordinates: action.payload.clickCoordinates, clickedTerritoryFrom: action.payload.territory}
      }
    case ReducerActionType.PLAYER_CHOOSE_ATTACKING_TO:
      //perform an attack
        if(game && clickedTerritoryFrom && clickedTerritoryTo) {
          console.log('reducer perform attack')
          const result = game.performAnAttack(clickedTerritoryFrom, clickedTerritoryTo)
          let message = state.message
          if(result) {
            message = result
            return { ...state, modalCoordinates: {x: 0, y: 0}, clickedTerritoryTo: '', message}
          } else {
            return { ...state, game, message: 'Attack was performed successfully', modalCoordinates: {x: 0, y: 0}, clickedTerritoryFrom: '', clickedTerritoryTo: '', }
          }
        }
        return state
    default:
      return state;
  }
};

export default reducer;
