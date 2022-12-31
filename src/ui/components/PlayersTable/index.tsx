import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import {Button, Input, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@mui/material";
import {Player, PlayerType} from "../../../game/models/Player";
import {addPlayer, removeLastPlayer, setPlayer, setPlayers} from "../../../redux/actions";
import {PlayerTypeSwitch} from "../PlayerTypeSwitch";

import "./style.css"

interface PlayersTableProps {

}

export const PlayersTable = (props: PlayersTableProps) => {
    const {players, rules, settings, game} = useSelector((state: DefaultReducerStateType) => state);
    const dispatch = useDispatch()

    // if(game && players && JSON.stringify(game.players.map(p => ({...p, game: undefined}))) !== JSON.stringify(players.map(p => ({...p, game: undefined})))) {throw "no consistency"}

    const hasReachedMAXPlayers = players && players.length >= settings.MAXPlayerNumber.value

    const createPlayer = () => {
        if(game) throw 'Game has started'
        if(hasReachedMAXPlayers) throw `Maximum allowed players is ${settings.MAXPlayerNumber.value}`

        const player = new Player('player', "human")
        dispatch(addPlayer(player))
    }
    const deleteLastPlayer = () => {
        if(game) throw 'Game has started'

        dispatch(removeLastPlayer())
    }

    const setPlayerType = (field: 'type' | 'name', value: string | PlayerType,p: Player) => {
        if(game) throw 'Game has started!'
        if(!players) throw 'No players available!'

        const player = players.find(pl => pl.name === p.name)

        if(!player) throw `Could not find player ${p.name}`

        // @ts-ignore
        player[field] = value

        dispatch(setPlayers(players))
    }


    return <div>
        <Table>
            <TableHead>
                <TableRow>
                    {playerTableColumns.map(c => {
                        return <TableCell>{c.headerName}</TableCell>
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {players?.map(p => {
                    const playerHasTurn = game?.playerTurn.name === p.name
                    const tableCellStyle = {color: p.color}

                    return <TableRow  className={playerHasTurn ? 'playerHasTurn' : ''}>
                        <TableCell style={tableCellStyle}>{<PlayerTypeSwitch onChange={(e) => setPlayerType('type', e.target.checked ? 'human' : 'computer',p)} checked={p.type === 'human'} disabled={!!game}/>}</TableCell>
                        <TableCell style={tableCellStyle}>{game? p.name : <Input onChange={e => setPlayerType('name', e.target.value, p)} value={p.name}/>}</TableCell>
                        <TableCell style={tableCellStyle}>{p.territories.length}</TableCell>
                        <TableCell style={tableCellStyle}>{p.cards.length}</TableCell>
                        <TableCell style={tableCellStyle}>{playerHasTurn && game ? game?.soldierToPut : 0}</TableCell>
                        <TableCell style={tableCellStyle}>{p.name}</TableCell>
                        <TableCell style={tableCellStyle}>{p.name}</TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
        <div>
            <Button disabled={hasReachedMAXPlayers || !!game} onClick={createPlayer}>Add player</Button>
            <Button disabled={!players || players.length === 0 || !!game} onClick={deleteLastPlayer}>Remove player</Button>
        </div>
    </div>

}

export const playerTableColumns: Column[] = [
    {field: 'name', headerName: 'Name', type: 'value'},
    {field: 'name', headerName: 'Name', type: 'value'},
    {field: 'territories', headerName: 'Territories', type: 'value'},
    {field: 'cards', headerName: 'Cards', type: 'value'},
    {headerName: 'Solders to put', type: 'function'},
    {headerName: 'Continents', type: 'function'},
    {headerName: 'Extra Solders', type: 'function'},
]

export type Column = {
    field?: string, headerName?: string, type: 'value' | 'function'
}