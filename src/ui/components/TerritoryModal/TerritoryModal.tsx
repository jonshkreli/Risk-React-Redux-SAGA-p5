import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Popover} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import * as constants from "constants";
import {clickTerritory, setGameObject} from "../../../redux/actions";
import {Game, gameState} from "../../../game/models/Game";
import {CountryName} from "../../../game/constants/CountryName";
import {canNotAttackOwnTerritoryMessage, territoryDoesNotBelongToPlayerMessage} from "../helperMessages";

export const TerritoryModal = () => {
    const {players, rules, settings, game, clickedTerritoryFrom, clickedTerritoryTo, modalCoordinates: {x: left, y: top}} = useSelector((state: DefaultReducerStateType) => state);
    const dispatch = useDispatch()


    let maxSolders = 0;

    if(clickedTerritoryFrom)
    switch (game?.currentState) {
        case gameState.newGame:
            break;
        case gameState.cardsDistributed:
            break;
        case gameState.soldersDistributed:
            break;
        case gameState.newTurn:
            maxSolders = game.soldierToPut;
            break;
        case gameState.finishedNewTurnSoldiers:
            break;
        case gameState.attackTo:
        case gameState.moveSoldiersTo:
            const playerTerritory = game.playerTurn.getTerritory(clickedTerritoryFrom)
            if(!playerTerritory) throw 'Territory must belong to player'
            maxSolders = playerTerritory.soldiers - 1;
            break;
        case gameState.finishTurn:
            break;
        case gameState.attackFinished:
    }

    const closeModal = React.useCallback(() => dispatch(clickTerritory('', {x: 0, y: 0})), [])

    const [solders, setSolders] = useState(maxSolders)
    useEffect(() => { setSolders(maxSolders) }, [maxSolders])
    console.log({maxSolders, solders})

    if(!game) return ''

    const {currentState, playerTurn} = game

    const onOk = () => {
        if(!clickedTerritoryFrom) throw `One territory must have been clicked`
      switch (currentState) {
          case gameState.newGame:
              break;
          case gameState.cardsDistributed:
              break;
          case gameState.soldersDistributed:
              break;
          case gameState.newTurn:
              game.playerTurn.putSoldersInTerritory(clickedTerritoryFrom, solders)
              if(solders === maxSolders) game.currentState = gameState.finishedNewTurnSoldiers
              dispatch(setGameObject(game))
              closeModal()
              break;
          case gameState.finishedNewTurnSoldiers:
              break;
          case gameState.attackTo:
              if(!clickedTerritoryTo) throw `One territory must have been clicked`
              console.log('attack from ' + clickedTerritoryFrom + ' to ' + clickedTerritoryTo)
              break;
          case gameState.moveSoldiersTo:
              if(!clickedTerritoryTo) throw `One territory must have been clicked`
              console.log('move from ' + clickedTerritoryFrom + ' to ' + clickedTerritoryTo)
              break;
          case gameState.finishTurn:
              break;
          case gameState.attackFinished:
      }
    }

    const setPlayerAction = (buttonClicked: 'attack' | 'move') => {
      if(buttonClicked === "attack") game.currentState = gameState.attackTo
      if(buttonClicked === "move") game.currentState = gameState.moveSoldiersTo
        dispatch(setGameObject(game))
        dispatch(clickTerritory('', {x: 0, y: 0}))
    }

    const territoryBelongToPlayer = !!clickedTerritoryFrom && game.doesTerritoryBelongToPlayer(clickedTerritoryFrom, playerTurn)

    return <Popover open={clickedTerritoryFrom !== ""} anchorPosition={{left, top}} anchorReference='anchorPosition'>
        {clickedTerritoryFrom? <DialogContent>
            <h4>Territory {clickedTerritoryFrom} clicked</h4>
            <span style={{color: game.playerTurn.color}} >{game.playerTurn.name}</span>
            {currentState === gameState.finishedNewTurnSoldiers ?
                <ButtonsDialogContent territoryBelongToPlayer={territoryBelongToPlayer} gameStatus={currentState} buttonAction={setPlayerAction}/> :
                <PutSoldersDialogContent {...{territoryBelongToPlayer, clickedTerritoryFrom, clickedTerritoryTo, solders, maxSolders, setSolders, game,}} />
            }
        </DialogContent> : "No territory is clicked"}

        {currentState === gameState.newTurn ?
            <DialogActions>
                <Button onClick={onOk}>OK</Button>
                <Button onClick={() => { closeModal() }}>Cancel</Button>
            </DialogActions>
            : '' }
    </Popover>
}

interface PutSoldersDialogContentProps {
    solders: number;
    maxSolders: number;
    setSolders: (solders: number) => void
    game: Game
    clickedTerritoryFrom: CountryName
    clickedTerritoryTo: CountryName | ''
    territoryBelongToPlayer: boolean
}

export const PutSoldersDialogContent: React.FC<PutSoldersDialogContentProps> = ({solders, setSolders, maxSolders, game, clickedTerritoryFrom, clickedTerritoryTo, territoryBelongToPlayer}) => {
    console.log({solders})

    let header = ''

    const DoesNotBelongToPlayerMessage = territoryDoesNotBelongToPlayerMessage(clickedTerritoryFrom, game.playerTurn.name)
    const canNotAttackOwnMessage = clickedTerritoryTo ? canNotAttackOwnTerritoryMessage(clickedTerritoryTo, game.playerTurn.name) : ''
    const {currentState} = game

    switch (currentState) {
        case gameState.newGame:
            break;
        case gameState.cardsDistributed:
            break;
        case gameState.soldersDistributed:
            break;
        case gameState.newTurn:
            header = territoryBelongToPlayer ? 'How many solders do you want to put here?' : DoesNotBelongToPlayerMessage
            break;
        case gameState.finishedNewTurnSoldiers:
            header = 'What do you want to do?'
            break;
        case gameState.attackTo:
            header = territoryBelongToPlayer ? canNotAttackOwnMessage : 'How many solders do you want to attack here?'
            break;
        case gameState.moveSoldiersTo:
            header = territoryBelongToPlayer ? 'How many solders do you want to move here?' : DoesNotBelongToPlayerMessage
            break;
        case gameState.finishTurn:
            break;
        case gameState.attackFinished:
    }


    return <div>
        <h3>{header}</h3>
        {territoryBelongToPlayer ? <div>
            <Input onChange={(e) => {
                setSolders(Number(e.target.value))
            }} value={solders} type={'number'} inputProps={{max: maxSolders, min: 0}} />
            <Button onClick={() => { setSolders(maxSolders) }}>All</Button>
        </div> : ''}
    </div>
}


interface ButtonsDialogContentProps {
    buttonAction: (buttonClicked: 'attack' | 'move') => void
    territoryBelongToPlayer: boolean
    gameStatus: gameState
}

export const ButtonsDialogContent: React.FC<ButtonsDialogContentProps> = ({buttonAction, territoryBelongToPlayer, gameStatus}) => {

    switch (gameStatus) {
        case gameState.newGame:
            break;
        case gameState.cardsDistributed:
            break;
        case gameState.soldersDistributed:
            break;
        case gameState.newTurn:
            break;
        case gameState.finishedNewTurnSoldiers:
            break;
        case gameState.attackTo:
            break;
        case gameState.moveSoldiersTo:
            break;
        case gameState.finishTurn:
            break;
        case gameState.attackFinished:
    }

    return <div>
        <h3>Time to move</h3>
        {territoryBelongToPlayer ?
            <div>
            <Button onClick={() => { buttonAction('attack') }}>Attack From</Button>
            <Button onClick={() => { buttonAction('move') }}>Move Solders To</Button>
            </div>
            :
            <span>Territory does not belong to this player</span>
        }
    </div>
}
