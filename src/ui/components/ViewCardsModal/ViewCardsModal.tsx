import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import {toggleCardsModal} from "../../../redux/actions";

export const ViewCardsModal = () => {
    const dispatch = useDispatch()
    const {game, cardsModalOpen} = useSelector((state: DefaultReducerStateType) => state);


    return <Dialog open={cardsModalOpen}>
        <DialogContent>
            <pre>{JSON.stringify(game?.playerTurn.cards)}</pre>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => {dispatch(toggleCardsModal())} }>Close</Button>
        </DialogActions>
    </Dialog>
}