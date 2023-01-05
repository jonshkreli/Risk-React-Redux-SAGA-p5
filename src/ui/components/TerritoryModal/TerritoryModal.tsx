import React, {useEffect, useState} from 'react';
import {Button, DialogActions, DialogContent, Input, Popover} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import {clickTerritory, setGameObject} from "../../../redux/actions";
import {Game, gameState} from "../../../game/models/Game";
import {CountryName} from "../../../game/constants/CountryName";
import {canNotAttackOwnTerritoryMessage, territoryDoesNotBelongToPlayerMessage} from "../helperMessages";
import {Territory} from "../../../game/constants/Territory";
import {Player} from "../../../game/models/Player";
import {canPlayerAttackFromThisTerritory} from "../../../game/functions/utils";

export const TerritoryModal = () => {
    const {
        players,
        rules,
        settings,
        game,
        clickedTerritoryFrom,
        clickedTerritoryTo,
        modalCoordinates: {x: left, y: top}
    } = useSelector((state: DefaultReducerStateType) => state);
    const dispatch = useDispatch()

    console.log({clickedTerritoryFrom, clickedTerritoryTo})

    let maxSolders = React.useMemo(() => game?.soldiersToPut, [game?.soldiersToPut])

    const closeModal = React.useCallback(() => {
        let terrToClick: CountryName | '' = ''
        switch (game?.getState) {
            case gameState.attackFrom:
            case gameState.moveSoldiersFromAfterAttack:
            case gameState.moveSoldiersFromNoAttack:
                terrToClick = clickedTerritoryFrom
                break;
        }

        // console.log(`close modal ${terrToClick}`)
        return dispatch(clickTerritory(terrToClick, {x: 0, y: 0}));
    }, [game?.getState])

    const [solders, setSolders] = useState(maxSolders)
    useEffect(() => {
        setSolders(maxSolders)
    }, [maxSolders])
    // console.log({maxSolders, solders})

    if (!game || !clickedTerritoryFrom) return ''

    const { getState, playerTurn} = game
    const gamePhase = getState

    let isPopoverOpen = true
    let showActionButtons = false

        switch (gamePhase) {
            case gameState.newGame:
                break;
            case gameState.cardsDistributed:
                break;
            case gameState.soldersDistributed:
                break;
            case gameState.newTurn:
                maxSolders = game.soldiersToPut;
                break;
            case gameState.finishedNewTurnSoldiers:
                showActionButtons = true
                break;
            case gameState.attackFrom:
                isPopoverOpen = false
                break;
            case gameState.attackFinished:
                showActionButtons = true
                break;
            case gameState.moveSoldiersFromNoAttack:
                isPopoverOpen = false
                break;
            case gameState.turnFinished:
                break;
        }


    const onOk = () => {
        if (!clickedTerritoryFrom) throw `One territory must have been clicked`
        switch (gamePhase) {
            case gameState.newGame:
                break;
            case gameState.cardsDistributed:
                break;
            case gameState.soldersDistributed:
                break;
            case gameState.newTurn:
                game.putAvailableSoldiers(clickedTerritoryFrom, solders)
                dispatch(setGameObject(game))
                closeModal()
                break;
            case gameState.finishedNewTurnSoldiers:
                break;
            case gameState.attackFrom:
                break;
            case gameState.attackFinished:
                break;
            case gameState.moveSoldiersFromNoAttack:
                break;
            case gameState.turnFinished:
                break;
        }
    }

    const setPlayerAction = (buttonClicked: 'attack' | 'move') => {
        if (buttonClicked === "attack") game.attackFromPhase()
        if (buttonClicked === "move") {
            switch (gamePhase) {
                case gameState.finishedNewTurnSoldiers:
                    game.moveFromNoAttackPhase()
                    break;
                case gameState.attackFinished:
                    game.moveFromPhase()
                    break;
                default: throw "When clicking move player should be in finishedNewTurnSoldiers or attackFinished phase"
            }

        }
        dispatch(setGameObject(game))
        closeModal()
    }

    const territoryBelongToPlayer = !!clickedTerritoryFrom && game.doesTerritoryBelongToPlayer(clickedTerritoryFrom, playerTurn)
    const playerTerritory = game.playerTurn.getTerritory(clickedTerritoryFrom)

    return <Popover open={isPopoverOpen} anchorPosition={{left, top}} anchorReference='anchorPosition'>
        {clickedTerritoryFrom ? <DialogContent>
            <h4>Territory {clickedTerritoryFrom} clicked</h4>
            <span style={{color: game.playerTurn.color}}>{game.playerTurn.name}</span>
            {showActionButtons ?
                <ButtonsDialogContent territoryBelongToPlayer={territoryBelongToPlayer} gameStatus={gamePhase}
                                      buttonAction={setPlayerAction} playerTerritory={playerTerritory} player={playerTurn}/> :
                <PutSoldersDialogContent {...{
                    territoryBelongToPlayer,
                    clickedTerritoryFrom,
                    clickedTerritoryTo,
                    solders,
                    maxSolders,
                    setSolders,
                    game,
                }} />
            }
        </DialogContent> : "No territory is clicked"}
            <DialogActions>
                {gamePhase === gameState.newTurn ? <Button onClick={onOk}>OK</Button> : ''}
                    <Button onClick={() => {closeModal()}}>Cancel</Button>
            </DialogActions>
    </Popover>
}

interface PutSoldersDialogContentProps {
    solders: number;
    maxSolders: number;
    setSolders: (solders: number) => void
    game: Game
    clickedTerritoryFrom: CountryName
    clickedTerritoryTo: CountryName | ''
    territoryBelongToPlayer: boolean
}

export const PutSoldersDialogContent: React.FC<PutSoldersDialogContentProps> = ({
                                                                                    solders,
                                                                                    setSolders,
                                                                                    maxSolders,
                                                                                    game,
                                                                                    clickedTerritoryFrom,
                                                                                    clickedTerritoryTo,
                                                                                    territoryBelongToPlayer
                                                                                }) => {
    console.log({solders})

    let header = ''

    const DoesNotBelongToPlayerMessage = territoryDoesNotBelongToPlayerMessage(clickedTerritoryFrom, game.playerTurn.name)
    const canNotAttackOwnMessage = clickedTerritoryTo ? canNotAttackOwnTerritoryMessage(clickedTerritoryTo, game.playerTurn.name) : ''

    switch (game.getState) {
        case gameState.newTurn:
            header = territoryBelongToPlayer ? 'How many solders do you want to put here?' : DoesNotBelongToPlayerMessage
            break;
        case gameState.finishedNewTurnSoldiers:
            header = 'What do you want to do?'
            break;
    }


    return <div>
        <h3>{header}</h3>
        {territoryBelongToPlayer ? <div>
            <div>You have {maxSolders} solders to put</div>
            <Input onChange={(e) => {
                setSolders(Number(e.target.value))
            }} value={solders} type={'number'} inputProps={{max: maxSolders, min: 0}}/>
            <Button onClick={() => {
                setSolders(maxSolders)
            }}>All</Button>
        </div> : ''}
    </div>
}


interface ButtonsDialogContentProps {
    buttonAction: (buttonClicked: 'attack' | 'move') => void
    territoryBelongToPlayer: boolean
    gameStatus: gameState
    playerTerritory: Territory | undefined
    player: Player,
}

export const ButtonsDialogContent: React.FC<ButtonsDialogContentProps> = ({
                                                                              buttonAction,
                                                                              territoryBelongToPlayer,
                                                                              gameStatus,
                                                                              playerTerritory,
    player,
                                                                          }) => {
    const attackFromEnabled = gameStatus === gameState.finishedNewTurnSoldiers && playerTerritory && canPlayerAttackFromThisTerritory(player, playerTerritory.name)
    const moveFromEnabled = (gameStatus === gameState.finishedNewTurnSoldiers || gameStatus === gameState.attackFinished) && playerTerritory && playerTerritory.soldiers > 1


    return <div>
        <h3>Time to move</h3>
        solders {playerTerritory?.soldiers}
        {territoryBelongToPlayer ?
            <div>
                <Button disabled={!attackFromEnabled} onClick={() => {buttonAction('attack')}}>Attack From</Button>
                <Button disabled={!moveFromEnabled} onClick={() => {buttonAction('move')}}>Move Solders From</Button>
            </div>
            :
            <span>Territory does not belong to this player</span>
        }
    </div>
}
