import React, {useCallback, useEffect} from 'react';
import {SketchContainer} from "../sketch/SketchContainer";
import {exportGame, setPlayers} from "../redux/actions";
import {useDispatch} from 'react-redux'
import {Player} from "../game/models/Player";
import {PlayersTable} from "./components/PlayersTable";
import {TerritoryModal} from "./components/TerritoryModal/TerritoryModal";
import {GameStatusView} from "./components/GameStatusView";
import "./style.css"
import {SideBar} from "./containers/SideBar";
import {PlayerDetails} from "../game/models/PlayerDetails";
import {ViewCardsModal} from "./components/ViewCardsModal/ViewCardsModal";

if(window.c === undefined)
window.c = 0
let App = () => {
    const dispatch = useDispatch()

    useEffect(() => {

        const player1 = new PlayerDetails('player1', "human")
        const player2 = new PlayerDetails('player2', "human")

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

    const handleKeyPress = useCallback((e) => {

        if (e.key.toLowerCase() === 's' && e.ctrlKey && e.shiftKey) {
            dispatch(exportGame())
        }
    }, []);

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <div>
            <div className='map-and-sidebar'>
                <SketchContainer/>
                <SideBar/>
            </div>
            <PlayersTable/>
            <TerritoryModal/>
            <ViewCardsModal/>
        </div>
    );
};


export default App;
