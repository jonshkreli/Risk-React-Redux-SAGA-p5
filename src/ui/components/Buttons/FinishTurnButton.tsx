import React from 'react';
import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import {gameState} from "../../../game/models/Game";
import {setGameObject} from "../../../redux/actions";

export const FinishTurnButton: React.FC = () => {
    const {game} = useSelector((state: DefaultReducerStateType) => state);
    const dispatch = useDispatch()

    if (!game) return <span></span>

    let isFinishTurnButtonDisabled = true

    const currentState = game.getState;

    switch (currentState) {
        case gameState.finishedNewTurnSoldiers:
        case gameState.firstAttackFinished:
        case gameState.attackFinished:
            isFinishTurnButtonDisabled = false
            break;
    }

    const finishTurn = () => {
        game.nextGamePhase() // finish turn
        game.nextPlayerTurn()
        dispatch(setGameObject(game))
    }

    return <Button disabled={isFinishTurnButtonDisabled} onClick={finishTurn}>Finish Turn</Button>
}