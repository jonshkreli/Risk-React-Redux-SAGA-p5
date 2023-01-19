import {Game, gameState} from "../game/models/Game";
import {ContinentCoordinates, Surface} from "../game/constants/coordinates";
import p5Types from "p5";
import {CountryName} from "../game/constants/CountryName";
import {ContinentName} from "../game/constants/continents";
import {useDispatch} from "react-redux";
import {clickTerritory} from "../redux/actions"; //Import this for typechecking and intellisense

export function initTouchingRect(p5: p5Types, game: Game, continentsCoordinates: ContinentCoordinates, clickedTerritoryFrom: CountryName | '', clickedTerritoryTo: CountryName | '') {
    p5.noFill()
    p5.stroke('blue');

    let {CORNER, mouseX, mouseY, mouseIsPressed} = p5

    let c: { [index in CountryName]: Surface[]}, continentKey: ContinentName;
    for (continentKey in continentsCoordinates) {
        c = continentsCoordinates[continentKey] as { [index in CountryName]: Surface[]};

        let stateKey: CountryName;
        for (stateKey in c) {
            const surfaces: Surface[] = c[stateKey] as Surface[];
            for (const stateCoord of surfaces) {
                if(stateCoord.type === 'rect') {
                    p5.rect(stateCoord.x, stateCoord.y, stateCoord.w, stateCoord.h);
                } else if (stateCoord.type === 'ellipse') {
                    p5.push();
                    p5.ellipseMode(CORNER);
                    p5.ellipse(stateCoord.x, stateCoord.y, stateCoord.w, stateCoord.h);
                    p5.pop();
                }



                    if(game.playerTurn.type === 'human') {
                                if(mouseX > stateCoord.x && mouseX < stateCoord.x + stateCoord.w &&
                                    mouseY > stateCoord.y && mouseY < stateCoord.y + stateCoord.h ) {
                                    // console.log(mouseY);

                                    if(mouseIsPressed) {
                                        // console.log(stateKey)

                                        return {clickedTerritory: stateKey, x: mouseX, y: mouseY}
                                    } //mouse pressed on state
                                }

                    } else if(game.playerTurn.type === 'computer') {

                        // if(!game.playerTurn.isPlaying)
                        //     game.playerTurn.play();
                    }


                if(surfaces.indexOf(stateCoord) === 0) { //only for one zone
                    let textvalue = 0;

                    /*check if players have territories*/
                    if(game && game.players)
                        for (let p of game.players) {

                            if(p.territories)
                                for (let t of p.territories) {
                                    if(t.name.toLowerCase() === stateKey.toLocaleLowerCase()) {
                                        if(p.color === undefined) throw 'Must create player color first'
                                        textvalue = t.soldiers
                                        p5.push();
                                        p5.fill(p.color)

                                        let strokeColor = 'gray', strokeWeight = 1;

                                        if(clickedTerritoryFrom === stateKey) {
                                            strokeColor = 'blue'
                                            strokeWeight = 10
                                        }
                                        if(clickedTerritoryTo === stateKey) {
                                            strokeColor = 'orange'
                                            strokeWeight = 10
                                        }

                                        p5.stroke(strokeColor); p5.strokeWeight(strokeWeight); p5.textSize(46); p5.rectMode(p5.CENTER); // Set rectMode to CENTER
                                        p5.text(textvalue, stateCoord.x+ stateCoord.w /2 ,  stateCoord.y+ stateCoord.h /2 );
                                        p5.pop();
                                    }
                                }
                        }


                }


            }
        }
    }


}