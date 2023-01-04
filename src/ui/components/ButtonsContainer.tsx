import React from "react";
import {Button} from "@mui/material";
import {setGameObject} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../redux/reducers";
import {Game} from "../../game/models/Game";

export const ButtonsContainer = () => {
    const dispatch = useDispatch()
    const {players, rules, settings} = useSelector((state: DefaultReducerStateType) => state);

    const onStartGameClick = () => {
        if(players) {
            const game = new Game(players, settings, rules)
            game.assignCardsToPlayers()
            game.putSoldiersInFieldFromPlayersHand()

            dispatch(setGameObject(game))
            // console.log(game)
        } else {
            alert('Create players first')
        }
    }

    return <div>
        <Button onClick={onStartGameClick}>Start game</Button>
    </div>
}