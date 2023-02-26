export const GET_ALL_NEWS = 'GET_NEWS'
export const GET_LAST_NEWS = 'GET_LAST_NEWS'
export const DELETE_ALL_NEWS = 'DELETE_ALL_NEWS'
export const ALL_NEWS_RECEIVED = 'ALL_NEWS_RECEIVED'
export const LAST_NEWS_RECEIVED = 'LAST_NEWS_RECEIVED'
export const ALL_NEWS_DELETED = 'ALL_NEWS_DELETED'

export const CREATE_GAME_OBJECT = 'CREATE_GAME_OBJECT'
export const SET_RULES = 'SET_RULES'
export const SET_SETTINGS = 'SET_SETTINGS'
export const CREATE_GAME = 'CREATE_GAME'
export const START_GAME = 'START_GAME'
export const SET_SETTINGS_DURING_GAME = 'SET_SETTINGS_DURING_GAME'
export const DISTRIBUTE_ALL_CARDS_TO_PLAYERS = 'DISTRIBUTE_ALL_CARDS_TO_PLAYERS'
export const DISTRIBUTE_SOLDERS_FROM_CARDS_TO_FIELD = 'DISTRIBUTE_SOLDERS_FROM_CARDS_TO_FIELD'
export const START_PLAYER_TURN = 'START_PLAYER_TURN'
export const PLAYER_RECEIVES_SOLDERS = 'PLAYER_RECEIVES_SOLDERS'
export const PLAYER_PUT_SOLDERS = 'PLAYER_PUT_SOLDERS'
export const PLAYER_CHOOSE_ATTACKING_FROM = 'PLAYER_CHOOSE_ATTACKING_FROM'
export const PLAYER_CHOOSE_ATTACKING_TO = 'PLAYER_CHOOSE_ATTACKING_TO'
export const PLAYER_CHOOSE_MOVING_FROM = 'PLAYER_CHOOSE_MOVING_FROM'
export const PLAYER_CHOOSE_MOVING_TO = 'PLAYER_CHOOSE_MOVING_TO'
export const END_PLAYER_TURN = 'END_PLAYER_TURN'
export const END_DRAWS_A_CARD = 'END_DRAWS_A_CARD'
export const PLAYER_OPEN_CARDS = 'PLAYER_OPEN_CARDS'
export const PLAYER_WIPED_FROM_GAME = 'PLAYER_WIPED_FROM_GAME'
export const PLAYER_WON = 'PLAYER_WON'
export const UPDATE_PLAYERS_TABLE = 'UPDATE_PLAYERS_TABLE'

export enum ReducerActionType {
    CREATE_GAME_OBJECT = 'CREATE_GAME_OBJECT',
    SET_PLAYERS = 'SET_PLAYERS',
    ADD_PLAYER = 'ADD_PLAYER',
    SET_PLAYER = 'SET_PLAYER',
    REMOVE_LAST_PLAYER = 'REMOVE_LAST_PLAYER',
    SET_RULES = 'SET_RULES',
    SET_SETTINGS = 'SET_SETTINGS',
    CLICK_TERRITORY = 'CLICK_TERRITORY',
    CREATE_GAME = 'CREATE_GAME',
    START_GAME = 'START_GAME',
    SET_SETTINGS_DURING_GAME = 'SET_SETTINGS_DURING_GAME',
    DISTRIBUTE_ALL_CARDS_TO_PLAYERS = 'DISTRIBUTE_ALL_CARDS_TO_PLAYERS',
    DISTRIBUTE_SOLDERS_FROM_CARDS_TO_FIELD = 'DISTRIBUTE_SOLDERS_FROM_CARDS_TO_FIELD',
    START_PLAYER_TURN = 'START_PLAYER_TURN',
    PLAYER_RECEIVES_SOLDERS = 'PLAYER_RECEIVES_SOLDERS',
    PLAYER_PUT_SOLDERS = 'PLAYER_PUT_SOLDERS',
    PLAYER_CHOOSE_ATTACKING_FROM = 'PLAYER_CHOOSE_ATTACKING_FROM',
    PLAYER_CHOOSE_ATTACKING_TO = 'PLAYER_CHOOSE_ATTACKING_TO',
    PLAYER_CHOOSE_MOVING_FROM = 'PLAYER_CHOOSE_MOVING_FROM',
    PLAYER_CHOOSE_MOVING_TO = 'PLAYER_CHOOSE_MOVING_TO',
    PLAYER_WANT_TO_MOVE_SOLDERS_TO = 'PLAYER_WANT_TO_MOVE_SOLDERS_TO',
    CANCEL_ACTION = 'CANCEL_ACTION',
    END_PLAYER_TURN = 'END_PLAYER_TURN',
    END_DRAWS_A_CARD = 'END_DRAWS_A_CARD',
    PLAYER_VIEW_CARDS = 'PLAYER_VIEW_CARDS',
    PLAYER_OPEN_CARDS = 'PLAYER_OPEN_CARDS',
    PLAYER_WIPED_FROM_GAME = 'PLAYER_WIPED_FROM_GAME',
    PLAYER_WON = 'PLAYER_WON',
    UPDATE_PLAYERS_TABLE = 'UPDATE_PLAYERS_TABLE',
}
