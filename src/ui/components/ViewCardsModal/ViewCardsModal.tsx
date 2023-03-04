import React, {useEffect, useMemo, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import {openCards, toggleCardsModal} from "../../../redux/actions";
import {CountryName} from "../../../game/constants/CountryName";
import {Card, cards} from "../../../game/constants/cards";
import "./style.scss";

export const ViewCardsModal = () => {
    const dispatch = useDispatch()
    const {game, modals: {cardsModalOpen}, settings} = useSelector((state: DefaultReducerStateType) => state);

    const playerCards = useMemo(() => game?.playerTurn.cards, [game?.playerTurn.cards])
    const is3CardsMode = useMemo(() => settings.openCards.amount === "3", [settings.openCards.amount])
    const playerHasNothingToChoose = is3CardsMode && playerCards?.length === 3

    const [selectedCards, setSelectedCards] = useState(playerHasNothingToChoose ? playerCards : [])

    const toggleCardSelection = (card: Card, select: boolean) => {
        let selectedCards_copy = [...selectedCards]
        if (select) {
            selectedCards_copy.push(card)
        } else {
            selectedCards_copy = selectedCards_copy.filter(sc => sc.name !== card.name)
        }
        console.log(selectedCards_copy)
        setSelectedCards(selectedCards_copy)
    }

    return <Dialog open={cardsModalOpen} className='ViewCardsModal'>
        <DialogContent>
            {playerCards?.map(c => {
                const isCardSelected = selectedCards?.find(sc => sc.name === c.name)
                const starsElements = []

                for (let i = 1; i <= c.stars; i++) {
                    starsElements.push(<span>*</span>)
                }

                return <div className={`card ${isCardSelected ? 'selected' : 'unselected'}`}
                            onClick={() => {toggleCardSelection(c, !isCardSelected)}}>
                    <div className='name'>{c.name}</div>
                    <div className='stars'>{starsElements.map(s => s)}</div>
                </div>
            })}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => {
                dispatch(toggleCardsModal())
            }} color='secondary'>Close</Button>
            <Button onClick={() => {
                dispatch(openCards(selectedCards));
                // open cards will also close the modal
            }} color='primary'>Open Selected Cards</Button>
        </DialogActions>
    </Dialog>
}