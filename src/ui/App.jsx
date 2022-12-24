import React, {useEffect} from 'react';
import {SketchContainer} from "../sketch/SketchContainer";
import {ButtonsContainer} from "./components/ButtonsContainer";
import {setGameObject, deleteNews, setPlayers, updatePlayersTable} from "../redux/actions";
import { useSelector, useDispatch } from 'react-redux'
import {Player} from "../game/models/Player";
import {PlayersTable} from "./components/PlayersTable";
import {TerritoryModal} from "./components/TerritoryModal/TerritoryModal";

if(window.c === undefined)
window.c = 0
let App = () => {
    const dispatch = useDispatch()

    useEffect(() => {

        const player1 = new Player('player1', "human")
        const player2 = new Player('player2', "human")

if(window.c < 10) {
    console.log('dispatch')
    // dispatch(createGameObject('uuuu'))
    dispatch(setPlayers([player1, player2]))
    ++window.c
}
        // deleteNews()
        // updatePlayersTable()

        return () => {
            // document.body.removeChild(script);
            // document.body.removeChild(script2);
        }
    })

    return (
        <div>
            <ButtonsContainer/>
            <SketchContainer/>
            <PlayersTable/>
            <TerritoryModal/>
        </div>
    );
};


export default App;
