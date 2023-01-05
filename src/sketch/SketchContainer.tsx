import React, {useState} from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import {initTouchingRect} from "./touchingTerritories";
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../redux/reducers";
import {continentsCoordinates} from "../game/constants/coordinates";
import {clickTerritory} from "../redux/actions";
import * as constants from "constants";
import {CountryName} from "../game/constants/CountryName";
import {gameState} from "../game/models/Game"; //Import this for typechecking and intellisense

interface ComponentProps {
    //Your component props
}

let x = 50;
const y = 50;

var buttonAttackFrom, buttonMoveSoldersFrom, statePressMenu, activeState;
var game, playersTable;
var attackFromState, moveSoldiersFromState;
let map;
var isInPlayersTerritoryTree = false;

let z = 0;

export const SketchContainer: React.FC<ComponentProps> = (props: ComponentProps) => {
    const {players, rules, settings, game, modalCoordinates, clickedTerritoryFrom} = useSelector((state: DefaultReducerStateType) => state);
    const dispatch = useDispatch()

    const [map, setMap] = useState<p5Types.Image|undefined>(undefined)

    //See annotations in JS for more information
    const setup = (p5: p5Types, canvasParentRef: Element) => {

        p5.createCanvas(1280, 720).parent(canvasParentRef);
        p5.frameRate(20);
        p5.loadImage('risk2.jpg', img => {
            setMap(img)
        });

    };

    const draw = (p5: p5Types) => {
        p5.clear();
        if(map) {
            p5.image(map, 0, 0);
        }

        z = z - 1;
        if (z < 0) {
            z = p5.height;
        }
        // line(0, z, width, z);
        p5.textSize(50)
        p5.text(z, 50,50)

        if(game) {
            const clickResult = initTouchingRect(p5,game, continentsCoordinates)
            if(clickResult) {
                const {clickedTerritory, x, y} = clickResult
                // console.log('set clicket terr ' + clickedTerritory, {x, y})
                if(modalCoordinates.x === 0 && modalCoordinates.y === 0) {
                    dispatch(clickTerritory(clickedTerritory, {x, y}))
                } /*else console.log("modal is open")*/
            }

        }
    };

    const updateTable = () => {

    }

    return <Sketch setup={setup} draw={draw} />;
};