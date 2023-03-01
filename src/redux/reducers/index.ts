import {ReducerActionType} from "../types";
import {AttackFromToCases, Game, gameState, MoveFromToCases} from "../../game/models/Game";
import {Player} from "../../game/models/Player";
import {initialSettings, rules, Rules, SettingsInterface} from "../../game/constants/settingsConfig";
import {GameActions} from "../actions/gameActions";
import {CountryName} from "../../game/constants/CountryName";
import {Point} from "../../game/constants/coordinates";
import {PlayerDetails} from "../../game/models/PlayerDetails";
import {Message} from "../../game/models/Message";

export interface DefaultReducerStateType {
  game: Game | undefined,
  players: PlayerDetails[],
  rules: Rules,
  settings: SettingsInterface,
  loading: boolean,
  clickedTerritoryFrom: CountryName | '',
  clickedTerritoryTo: CountryName | '',
  modalCoordinates: Point,
  solders: number,
  message: string,
  messages: Message[],
  cardsModalOpen: boolean,
}

const defaultReducerState: DefaultReducerStateType = {
  game: undefined,
  players: [],
  rules: rules,
  settings: initialSettings,
  loading: false,
  clickedTerritoryFrom: '',
  clickedTerritoryTo: '',
  modalCoordinates: {x: 0, y: 0},
  solders: 0,
  message: '',
  messages: [],
  cardsModalOpen: false,
}

const reducer = (state = defaultReducerState, action: GameActions): DefaultReducerStateType => {
  console.log('reducer',state, action)

  const {game, clickedTerritoryFrom, clickedTerritoryTo, messages} = state

  switch (action.type) {
    // case ReducerActionType.SET_RULES:
    //   break;
    // case ReducerActionType.SET_SETTINGS:
    //   break;
    case ReducerActionType.CREATE_GAME_OBJECT:
      return { ...state, game: action.payload.game, loading: false }

    case ReducerActionType.SET_PLAYERS:
      if(game) game.setPlayersFromPlayerDetails = action.payload.players
      return { ...state, players: action.payload.players, game, loading: false }

    case ReducerActionType.ADD_PLAYER: {
      const players = [...state.players || []]
      players.push(action.payload.player)
      // if(game) game.players = players
      return { ...state, players, loading: false }
    }

    case ReducerActionType.REMOVE_LAST_PLAYER: {
      if(!state.players) throw 'There is no player to remove'
      const players = [...state.players]
      players.pop()
      return { ...state, players, loading: false }
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
        case gameState.moveSoldiersFrom:
        case gameState.firstMoveSoldersFrom:
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
          const moveAllSoldersAfterAttack = state.settings.moveAllSoldersAfterAttack.value
          const result = game.performAnAttack(
              {from: clickedTerritoryFrom, to: clickedTerritoryTo},
              {attackingDices, attackAgain, moveAllSoldersAfterAttack},
              messages
          )
          let message = result.toString()

          switch (result) {
            case AttackFromToCases.YES:
              message = 'Attack was performed successfully'
              return { ...state, game, message, modalCoordinates: {x: 0, y: 0}, messages}
            case AttackFromToCases.COULD_NOT_INVADE_TERRITORY:
              return { ...state, game, message, modalCoordinates: {x: 0, y: 0}, clickedTerritoryFrom: '', clickedTerritoryTo: '', messages}
            default:
              return { ...state, game, modalCoordinates: {x: 0, y: 0}, clickedTerritoryTo: '', message, messages}
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
        console.log('reducer performAMove')
        let message: string = game.performAMove({from: clickedTerritoryFrom, to: clickedTerritoryTo}, action.payload.solders, messages)
        if(message !== MoveFromToCases.YES) {
          return { ...state, modalCoordinates: {x: 0, y: 0}, clickedTerritoryTo: '', message, messages}
        } else {
          message = `${action.payload.solders} solders moved from ${clickedTerritoryFrom} to ${clickedTerritoryTo}`
          return { ...state, game, modalCoordinates: {x: 0, y: 0}, message, clickedTerritoryFrom: '', clickedTerritoryTo: '', messages}
        }
      }
      return state
    case ReducerActionType.CANCEL_ACTION:
      if(!game) return state

      game.previousGamePhase()
      return { ...state, game, modalCoordinates: {x: 0, y: 0}, message: 'Action was canceled', clickedTerritoryFrom: '', clickedTerritoryTo: '', }
    case ReducerActionType.SET_SETTINGS:
      return {...state, settings: action.payload.settings}
    case ReducerActionType.PLAYER_VIEW_CARDS:
      return {...state, cardsModalOpen: !state.cardsModalOpen}
    case ReducerActionType.PLAYER_OPEN_CARDS:
      game?.playerOpenCards(action.payload.cards, messages)
      return {...state, cardsModalOpen: false, game}
    case ReducerActionType.EXPORT_GAME:
      const exported = game?.exportGame(messages)
      navigator.clipboard.writeText("This is the text to be copied").then(() => {
        console.log(exported);
      },() => {
        messages.push({message: 'Failed to copy to clipboard', origin: ["EXPORT IMPORT"], type: "ERROR"})
      });
      return {...state, messages}
    default:
      return state;
  }
};

export default reducer;
