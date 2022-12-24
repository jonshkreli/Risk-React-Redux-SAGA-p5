import { put, takeLatest, all } from 'redux-saga/effects';
import {
  GET_ALL_NEWS,
  ALL_NEWS_RECEIVED,
  LAST_NEWS_RECEIVED,
  GET_LAST_NEWS,
  ALL_NEWS_DELETED,
  DELETE_ALL_NEWS, UPDATE_PLAYERS_TABLE
} from "../types";

function* fetchNews() {

  const json = yield fetch('https://newsapi.org/v1/articles?source=cnn&apiKey=c39a26d9c12f48dba2a5c00e35684ecc')
    .then(response => response.json());

  yield put({ type: ALL_NEWS_RECEIVED, json: json.articles || [{ error: json.message }] });
}

function* fetchLatestNews() {
  const json = yield fetch('https://newsapi.org/v1/articles?source=cnn&apiKey=c39a26d9c12f48dba2a5c00e35684ecc')
      .then(response => response.json());

  yield put({type: LAST_NEWS_RECEIVED, json: json.articles || [{error: json.message}]});

}

function* deleteAllNews() {

  yield put({ type: ALL_NEWS_DELETED, });
}

function* updatePlayersTable() {

  yield put({ type: UPDATE_PLAYERS_TABLE, });
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

export default function* rootSaga() {
  yield all([
    actionWatcher1(),
    actionDeleter(),
    action_updatePlayersTable(),
  ]);
}
