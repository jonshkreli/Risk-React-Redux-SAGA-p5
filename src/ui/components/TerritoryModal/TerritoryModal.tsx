import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Popover} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import * as constants from "constants";
import {clickTerritory, setGameObject} from "../../../redux/actions";
import {Game, gameState} from "../../../game/models/Game";

export const TerritoryModal = () => {
    const {players, rules, settings, game, clickedTerritoryFrom, modalCoordinates: {x: left, y: top}} = useSelector((state: DefaultReducerStateType) => state);
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


    const [solders, setSolders] = useState(maxSolders)
    useEffect(() => { setSolders(maxSolders) }, [maxSolders])
    console.log({maxSolders, solders})

    if(!game) return ''

    const onOk = () => {
        if(!clickedTerritoryFrom) throw `One territory must have been clicked`
      switch (game.currentState) {
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
              dispatch(clickTerritory('', {x: 0, y: 0}))
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
    }

    const setPlayerAction = (buttonClicked: 'attack' | 'move') => {
      if(buttonClicked === "attack") game.currentState = gameState.attackTo
      if(buttonClicked === "move") game.currentState = gameState.moveSoldiersTo
        dispatch(setGameObject(game))
        dispatch(clickTerritory('', {x: 0, y: 0}))

    }

    return <Popover open={clickedTerritoryFrom !== ""} anchorPosition={{left, top}} anchorReference='anchorPosition'>
        <DialogContent>
            <h4>Territory {clickedTerritoryFrom} clicked</h4>
            <span style={{color: game.playerTurn.color}} >{game.playerTurn.name}</span>
            {gameState.finishedNewTurnSoldiers ?
            <ButtonsDialogContent buttonAction={setPlayerAction}/> :
                <PutSoldersDialogContent solders={solders} maxSolders={maxSolders} setSolders={setSolders} game={game} />
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={onOk}>OK</Button>
            <Button onClick={() => { dispatch(clickTerritory('', {x: 0, y: 0})) }}>Cancel</Button>

        </DialogActions>
    </Popover>
}

interface PutSoldersDialogContentProps {
    solders: number;
    maxSolders: number;
    setSolders: (solders: number) => void
    game: Game
}

export const PutSoldersDialogContent: React.FC<PutSoldersDialogContentProps> = ({solders, setSolders, maxSolders, game}) => {
    console.log({solders})

    let header = ''

    switch (game.currentState) {
        case gameState.newGame:
            break;
        case gameState.cardsDistributed:
            break;
        case gameState.soldersDistributed:
            break;
        case gameState.newTurn:
            header = 'How many solders do you want to put here?'
            break;
        case gameState.finishedNewTurnSoldiers:
            break;
        case gameState.attackTo:
        header = 'How many solders do you want to attack here?'
            break;
        case gameState.moveSoldiersTo:
            header = 'How many solders do you want to move here?'
            break;
        case gameState.finishTurn:
            break;
        case gameState.attackFinished:
    }


    return <div>
        {}
        <h3>{header}</h3>
        <div>
            <Input onChange={(e) => {
                setSolders(Number(e.target.value))
            }} value={solders} type={'number'} inputProps={{max: maxSolders, min: 0}} />
            <Button onClick={() => { setSolders(maxSolders) }}>All</Button>
        </div>
    </div>
}


interface ButtonsDialogContentProps {
    buttonAction: (buttonClicked: 'attack' | 'move') => void
}

export const ButtonsDialogContent: React.FC<ButtonsDialogContentProps> = ({buttonAction}) => {

    return <div>
        <h3>Time to move</h3>
        <Button onClick={() => { buttonAction('attack') }}>Attack From</Button>
        <Button onClick={() => { buttonAction('move') }}>Move Solders To</Button>
    </div>
}
