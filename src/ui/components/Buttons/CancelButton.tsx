import React from 'react';
import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import {gameState} from "../../../game/models/Game";
import {cancelAction, setGameObject} from "../../../redux/actions";

export const CancelButton: React.FC = () => {
    const {game} = useSelector((state: DefaultReducerStateType) => state);
    const dispatch = useDispatch()

    if (!game) return <span></span>

    let isCancelDisabled = true

    const currentState = game.getState;

    switch (currentState) {
        case gameState.firstAttackFrom:
        case gameState.attackFrom:
            isCancelDisabled = false
            break;
        case gameState.moveSoldiersFrom:
        case gameState.firstMoveSoldersFrom:
            isCancelDisabled = false
            break;
    }

    const onCancelClick = () => {
        dispatch(cancelAction())
    }

    return <Button disabled={isCancelDisabled} onClick={onCancelClick}>Cancel</Button>
}