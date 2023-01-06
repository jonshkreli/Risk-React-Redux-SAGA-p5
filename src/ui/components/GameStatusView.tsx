import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../redux/reducers";
import {gameState} from "../../game/models/Game";
import {canNotAttackOwnTerritoryMessage, territoryDoesNotBelongToPlayerMessage} from "./helperMessages";
import {Button} from "@mui/material";
import {setGameObject} from "../../redux/actions";

export const GameStatusView = () => {
    const {
        game,
        clickedTerritoryFrom,
        clickedTerritoryTo,
        message: reducerMsg
    } = useSelector((state: DefaultReducerStateType) => state);
    const dispatch = useDispatch()

    if (!game) return <span>Game has not started yet</span>

    const {playerTurn, soldiersToPut, getInitialSoldersToPut} = game

    const playerName = playerTurn.name

    let message = ''

    const territoryBelongToPlayer = !!clickedTerritoryFrom && game.doesTerritoryBelongToPlayer(clickedTerritoryFrom, playerTurn)
    clickedTerritoryFrom ? territoryDoesNotBelongToPlayerMessage(clickedTerritoryFrom, game.playerTurn.name) : 'invalid territory clicked';
    const canNotAttackOwnMessage = clickedTerritoryTo ? canNotAttackOwnTerritoryMessage(clickedTerritoryTo, game.playerTurn.name) : 'invalid territory clicked'


    const currentState = game.getState;

    switch (currentState) {
        case gameState.newGame:
            message = "New game"
            break;
        case gameState.cardsDistributed:
            message = "Cards Distributed, next distribute solders."
            break;
        case gameState.soldersDistributed:
            message = "Solders Distributed."
            break;
        case gameState.newTurn:
            message = `${playerName} turn`
            break;
        case gameState.finishedNewTurnSoldiers:
            message = `What does ${playerName} want to do?`
            break;
        case gameState.firstAttackFrom:
        case gameState.attackFrom:
            message = territoryBelongToPlayer ? canNotAttackOwnMessage : `${playerName}: is attacking from ${clickedTerritoryFrom} to ${clickedTerritoryTo}`
            break;
        case gameState.moveSoldiersFromAfterAttack:
        case gameState.moveSoldiersFromNoAttack:
            message = territoryBelongToPlayer ? 'How many solders do you want to move here?' : `${playerName}: is moving solders from ${clickedTerritoryFrom} to ${clickedTerritoryTo}`
            break;
        case gameState.turnFinished:
            message = `${playerName} finished turn`
            break;
        case gameState.attackFinished:
            message = `${playerName} finished attack`
            break;
    }

    return <div>
        <div>{currentState}</div>
        <h3>Player {playerTurn.name} has a total of {getInitialSoldersToPut} solders to put</h3>
        <h3>Player {playerTurn.name} has {soldiersToPut} solders remaining to put</h3>
        <h3>{message}</h3>
        <div>{clickedTerritoryFrom} <span>-&gt;</span> {clickedTerritoryTo}</div>
        <div>{reducerMsg}</div>
    </div>
}