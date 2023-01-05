import {put, takeLatest, all} from 'redux-saga/effects';
import {
    GET_ALL_NEWS,
    ALL_NEWS_RECEIVED,
    LAST_NEWS_RECEIVED,
    GET_LAST_NEWS,
    ALL_NEWS_DELETED,
    DELETE_ALL_NEWS, UPDATE_PLAYERS_TABLE, PLAYER_CHOOSE_ATTACKING_TO, ReducerActionType
} from "../types";
import {DefaultReducerStateType} from "../reducers";
import {select} from 'redux-saga/effects';
import {Game, gameState} from "../../game/models/Game";


function* fetchNews() {

    // @ts-ignore
    const json = yield fetch('https://newsapi.org/v1/articles?source=cnn&apiKey=c39a26d9c12f48dba2a5c00e35684ecc')
        .then(response => response.json());

    yield put({type: ALL_NEWS_RECEIVED, json: json.articles || [{error: json.message}]});
}

function* fetchLatestNews() {
    // @ts-ignore
    const json = yield fetch('https://newsapi.org/v1/articles?source=cnn&apiKey=c39a26d9c12f48dba2a5c00e35684ecc')
        .then(response => response.json());

    yield put({type: LAST_NEWS_RECEIVED, json: json.articles || [{error: json.message}]});

}

function* deleteAllNews() {

    yield put({type: ALL_NEWS_DELETED,});
}

function* updatePlayersTable() {

    yield put({type: UPDATE_PLAYERS_TABLE,});
}

function* triggerAttackOrMove() {
    const game: Game | undefined = yield select((state: DefaultReducerStateType) => state.game);

    if (!game) return
    switch (game.getState) {
        case gameState.moveSoldiersFromNoAttack:
            yield put({type: ReducerActionType.PLAYER_CHOOSE_MOVING_TO});
            // TODO implement PLAYER_CHOOSE_MOVING_TO in reducer
            break;
        case gameState.attackFrom:
            yield put({type: ReducerActionType.PLAYER_CHOOSE_ATTACKING_TO});
            break;
        default:
            // do nothing
    }
}

function* actionWatcher1() {
    yield takeLatest(GET_LAST_NEWS, fetchLatestNews)
    yield takeLatest(GET_ALL_NEWS, fetchNews)

}

function* actionWatcher2() {
    yield takeLatest(GET_LAST_NEWS, fetchLatestNews)
}

function* actionDeleter() {
    yield takeLatest(DELETE_ALL_NEWS, deleteAllNews)
}

function* action_updatePlayersTable() {
    yield takeLatest(UPDATE_PLAYERS_TABLE, updatePlayersTable)
}

function* gameWatcher() {
    yield takeLatest(ReducerActionType.CLICK_TERRITORY, triggerAttackOrMove)
}

export default function* rootSaga() {
    yield all([
        actionWatcher1(),
        actionDeleter(),
        action_updatePlayersTable(),
        gameWatcher()
    ]);
}
