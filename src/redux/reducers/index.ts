import {ReducerActionType} from "../types";
import {AttackFromToCases, Game, gameState} from "../../game/models/Game";
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
  solders: number,
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
  solders: 0,
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
      // if(state.clickedTerritoryFrom) {
      //       return { ...state, modalCoordinates: action.payload.clickCoordinates, clickedTerritoryTo: action.payload.territory}
      // } else {
      //       return { ...state, modalCoordinates: action.payload.clickCoordinates, clickedTerritoryFrom: action.payload.territory}
      // }
      console.log(state.game?.getState, action.payload.territory)
      switch (state.game?.getState) {
        case gameState.firstAttackFrom:
        case gameState.attackFrom:
        case gameState.moveSoldiersFromAfterAttack:
        case gameState.moveSoldiersFromNoAttack:
          if(state.clickedTerritoryFrom !== '')
          return { ...state, modalCoordinates: action.payload.clickCoordinates, clickedTerritoryTo: action.payload.territory}
          else return state
        default:
          return { ...state, modalCoordinates: action.payload.clickCoordinates, clickedTerritoryFrom: action.payload.territory}
      }
    case ReducerActionType.PLAYER_CHOOSE_ATTACKING_TO:
      //perform an attack
        if(game && clickedTerritoryFrom && clickedTerritoryTo) {
          const attackingDices = state.settings.dicesNumber.value
          const attackAgain = state.settings.continueAttack.value
          const result = game.performAnAttack(clickedTerritoryFrom, clickedTerritoryTo, attackingDices, attackAgain)
          let message = result.toString()

          switch (result) {
              // @ts-ignore
            case AttackFromToCases.YES:
              message = 'Attack was performed successfully'
              return { ...state, game, message, modalCoordinates: {x: 0, y: 0}}
            case AttackFromToCases.COULD_NOT_INVADE_TERRITORY:
              return { ...state, game, message, modalCoordinates: {x: 0, y: 0}, clickedTerritoryFrom: '', clickedTerritoryTo: ''}
            default:
              return { ...state, game, modalCoordinates: {x: 0, y: 0}, clickedTerritoryTo: '', message}
          }
        }
        return state
    case ReducerActionType.PLAYER_CHOOSE_MOVING_TO:
      if (!game) return state
      //trigger a move
      game.playerWantToMoveSolders = true
      return {...state, game}
    case ReducerActionType.PLAYER_WANT_TO_MOVE_SOLDERS_TO:
      //perform a move
      if(game && clickedTerritoryFrom && clickedTerritoryTo) {
        console.log('reducer perform attack')
        const result = game.performAMove(clickedTerritoryFrom, clickedTerritoryTo, action.payload.solders)
        let message = state.message
        if(result) {
          message = result
          return { ...state, modalCoordinates: {x: 0, y: 0}, clickedTerritoryTo: '', message}
        } else {
          return { ...state, game, modalCoordinates: {x: 0, y: 0}, message: 'Move was performed successfully', clickedTerritoryFrom: '', clickedTerritoryTo: '', }
        }
      }
      return state
    case ReducerActionType.SET_SETTINGS:
      return {...state, settings: action.payload.settings}
    default:
      return state;
  }
};

export default reducer;
