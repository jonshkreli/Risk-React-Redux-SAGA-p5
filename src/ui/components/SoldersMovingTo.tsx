import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../redux/reducers";
import {CountryName} from "../../game/constants/CountryName";
import {gameState} from "../../game/models/Game";
import {clickTerritory, performAMove, setGameObject} from "../../redux/actions";
import {SoldersInput} from "./SoldersInput/SoldersInput";
import {Button} from "@mui/material";

export const SoldersMovingTo = () => {
    const {
        game,
        clickedTerritoryFrom,
        clickedTerritoryTo,
        settings,
    } = useSelector((state: DefaultReducerStateType) => state);

    const playerTerritory = clickedTerritoryFrom ? game?.playerTurn.getTerritory(clickedTerritoryFrom) : undefined

    const maxSolders = (playerTerritory?.soldiers || 0) - 1
    useEffect(() => {
        setSolders(maxSolders)
    }, [maxSolders])
    const [solders, setSolders] = useState(maxSolders)

    if(!game || !playerTerritory || !clickedTerritoryFrom || !clickedTerritoryTo || !game.playerWantToMoveSolders) return <span></span>

    let minSolders = 0;

    switch (game.getState) {
        case gameState.firstAttackFrom:
        case gameState.attackFrom:
            minSolders = 3
            break;
        case gameState.moveSoldiersFromAfterAttack:
        case gameState.moveSoldiersFromNoAttack:
            minSolders = 1
            break;
        default:
            return <span></span>
    }

    const dispatch = useDispatch()

    const onOk = () => {
        dispatch(performAMove(solders))
    }


    return <div>
        <h4>How many players you want to move to {clickedTerritoryTo}</h4>
        <SoldersInput minSolders={minSolders} maxSolders={maxSolders} solders={solders} setSolders={setSolders} actionName={'move'}/>
        <Button onClick={onOk}>MOVE</Button>
    </div>
}