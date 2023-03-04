import React, {createRef} from 'react';
import {Button, Dialog, DialogActions, DialogContent, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import {importGame, toggleImportModal} from "../../../redux/actions";
import "./style.scss";

export const ImportModal = () => {
    const dispatch = useDispatch()
    const {game, modals: {importModalOpen}, settings} = useSelector((state: DefaultReducerStateType) => state);
    const ref = createRef();

    return <Dialog open={importModalOpen} className='ImportCardsModal'>
        <DialogContent>
            <TextField inputRef={ref} multiline />
            </DialogContent>
        <DialogActions>
            <Button onClick={() => {
                dispatch(toggleImportModal())
            }} color='secondary'>Close</Button>
            <Button onClick={() => {
                console.log(ref.current.value)
                dispatch(importGame(ref.current.value));
                // open cards will also close the modal
            }} color='primary'>Import Game</Button>
        </DialogActions>
    </Dialog>
}