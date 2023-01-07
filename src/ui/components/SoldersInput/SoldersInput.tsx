import React from 'react';
import {Button, Input} from "@mui/material";


interface SoldersInputParams {
    minSolders: number;
    maxSolders: number;
    solders: number;
    setSolders: (solders: number) => void;
    actionName: string;
}

export const SoldersInput: React.FC<SoldersInputParams> = ({minSolders, maxSolders, actionName, solders, setSolders}) => {

    return <div>
        <div>You have {minSolders} - {maxSolders} solders to {actionName}</div>
        <Input onChange={(e) => {
            setSolders(Number(e.target.value))
        }} value={solders} type={'number'} inputProps={{max: maxSolders, min: 0}}/>
        <Button onClick={() => {
            setSolders(maxSolders)
        }}>All</Button>
    </div>
}