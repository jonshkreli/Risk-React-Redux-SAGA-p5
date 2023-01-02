import React from 'react';
import {useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../redux/reducers";
import {gameState} from "../../game/models/Game";
import {canNotAttackOwnTerritoryMessage, territoryDoesNotBelongToPlayerMessage} from "./helperMessages";

export const GameStatusView = () => {
    const {game, clickedTerritoryFrom, clickedTerritoryTo, message: reducerMsg} = useSelector((state: DefaultReducerStateType) => state);

    if(!game) return <span>Game has not started yet</span>

    const {playerTurn, currentState, soldierToPut} = game

    const playerName = playerTurn.name

    let message = ''

    const territoryBelongToPlayer = !!clickedTerritoryFrom && game.doesTerritoryBelongToPlayer(clickedTerritoryFrom, playerTurn)

    const DoesNotBelongToPlayerMessage = clickedTerritoryFrom ? territoryDoesNotBelongToPlayerMessage(clickedTerritoryFrom, game.playerTurn.name) : 'invalid territory clicked'
    const canNotAttackOwnMessage = clickedTerritoryTo ? canNotAttackOwnTerritoryMessage(clickedTerritoryTo, game.playerTurn.name) : 'invalid territory clicked'


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
        case gameState.attackFrom:
            message = territoryBelongToPlayer ? canNotAttackOwnMessage : `${playerName}: is attacking from ${clickedTerritoryFrom} to ${clickedTerritoryTo}`
            break;
        case gameState.moveSoldiersFrom:
            message = territoryBelongToPlayer ? 'How many solders do you want to move here?' : `${playerName}: is moving solders from ${clickedTerritoryFrom} to ${clickedTerritoryTo}`
            break;
        case gameState.finishTurn:
            message = `${playerName} finished turn`
            break;
        case gameState.attackFinished:
            message = `${playerName} finished attack`
            break;
    }

    return <div>
        <div>{currentState}</div>
        <h3>Player {playerTurn.name} has {soldierToPut} available to put</h3>
        <h3>{message}</h3>
        <div>{clickedTerritoryFrom} <span>-&gt;</span> {clickedTerritoryTo}</div>
        <div>{reducerMsg}</div>
    </div>
}