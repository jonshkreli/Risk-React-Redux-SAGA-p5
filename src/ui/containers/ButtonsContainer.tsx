import React from "react";
import {Button} from "@mui/material";
import {setGameObject} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../redux/reducers";
import {Game} from "../../game/models/Game";
import {FinishTurnButton} from "../components/Buttons/FinishTurnButton";
import {CancelButton} from "../components/Buttons/CancelButton";

export const ButtonsContainer = () => {
    const dispatch = useDispatch()
    const {players, rules, settings} = useSelector((state: DefaultReducerStateType) => state);

    const onStartGameClick = () => {
        if(players) {
            const game = new Game(players, settings, rules)
            game.assignCardsToPlayers()
            game.putSoldiersInFieldFromPlayersHand()
            game.nextGamePhase() // new turn

            dispatch(setGameObject(game))
            // console.log(game)
        } else {
            alert('Create players first')
        }
    }

    return <div className={'ButtonsContainer'}>
        <Button onClick={onStartGameClick}>Start game</Button>
        <FinishTurnButton/>
        <CancelButton/>
    </div>
}