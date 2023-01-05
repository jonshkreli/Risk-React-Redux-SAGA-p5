import {Game, gameState} from "../game/models/Game";
import {ContinentCoordinates, Surface} from "../game/constants/coordinates";
import p5Types from "p5";
import {CountryName} from "../game/constants/CountryName";
import {ContinentName} from "../game/constants/continents";
import {useDispatch} from "react-redux";
import {clickTerritory} from "../redux/actions"; //Import this for typechecking and intellisense

export function initTouchingRect(p5: p5Types, game: Game, continentsCoordinates: ContinentCoordinates) {
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

                                        // activeState = stateKey;
                                        //
                                        //
                                        // if(game.currentState === gameState.newTurn) { //put solders in field
                                        //
                                        //     for (let t of game.playerTurn.territories) {
                                        //         if(t.name === stateKey) { //find correct state
                                        //             t.soldiers += game.soldiersToPut;
                                        //             game.currentState = gameState.finishedNewTurnSoldiers;
                                        //
                                        //         }
                                        //     }
                                        //
                                        //     $('#nextTurn').removeClass('disabled');
                                        // }
                                        //
                                        // // time to open menu on state
                                        // else if ((game.currentState === gameState.finishedNewTurnSoldiers ||
                                        //     game.currentState === gameState.attackFinished)) {
                                        //     // ellipse(mouseX, mouseY, 50, 50);
                                        //     // console.log((stateKey + " " + continentKey));
                                        //
                                        //     //check if it territory belong to player
                                        //     let PlayerTerritory = game.playerTurn.territories.find(e => e.name === stateKey);
                                        //
                                        //     if (PlayerTerritory !== undefined) {
                                        //
                                        //         if (game.currentState === gameState.finishedNewTurnSoldiers) {
                                        //             // buttonAttackFrom.click(() => onAttackFromClick(stateKey));
                                        //             buttonAttackFrom.attr("disabled", false);
                                        //         } //if attack has not finished enable attack
                                        //
                                        //         if(PlayerTerritory.soldiers === 1) {
                                        //             buttonMoveSoldersFrom.attr("disabled", true);
                                        //         } else {
                                        //             buttonMoveSoldersFrom.attr("disabled", false);
                                        //             // buttonMoveSoldersFrom.click(() => onMoveSoldersFromClick(stateKey));
                                        //         }
                                        //
                                        //         statePressMenu.show('fast', () => {
                                        //             if(game.playerTurn.territories.find(e => e.name === activeState).soldiers ===1 ){
                                        //                 buttonAttackFrom.off(); //remove all event listeners before
                                        //                 buttonAttackFrom.attr("disabled", true);
                                        //             }
                                        //         });
                                        //
                                        //     }
                                        //
                                        // } //finishedNewTurnSoldiers/attackFinished
                                        //
                                        //
                                        // //pick where to attack
                                        // else if(game.currentState === gameState.attackTo) {
                                        //
                                        //     let AttackingTerritory = game.playerTurn.territories.find(e => e.name === attackFromState);
                                        //
                                        //     //check if it territory belong to player
                                        //     let AttackedTerritory = game.playerTurn.territories.find(e => e.name === stateKey);
                                        //
                                        //     if(AttackedTerritory !== undefined) { //can not attack own territory
                                        //         console.log("can not attack your territory")
                                        //     } else if(AttackingTerritory.borders.find(e => e === stateKey) === undefined){ //check if attacked state is in border
                                        //         console.log("territory not in border")
                                        //     } else { //attack
                                        //         console.log("att with all forces till to the end");
                                        //
                                        //         if(AttackingTerritory.soldiers > 3) {
                                        //             attack(3);
                                        //         } else if(AttackingTerritory.soldiers === 3){
                                        //             attack(2);
                                        //         } else if(AttackingTerritory.soldiers === 2){
                                        //             attack(1);
                                        //         } else if(AttackingTerritory.soldiers === 1){
                                        //             throw 'can not attack from here. Here are '+AttackingTerritory.soldiers +' soldiers.'
                                        //         } else throw  AttackingTerritory.soldiers+' soldiers.';
                                        //
                                        //         /*check if player can not attack anymore because he/she has only 1 soldier per territory*/
                                        //         if(game.playerTurn.territories.find(e => e.soldiers > 1)) {
                                        //             game.currentState = gameState.finishedNewTurnSoldiers;
                                        //         } else { //means all territories have only 1 soldier
                                        //             game.currentState = gameState.attackFinished;
                                        //         }
                                        //
                                        //         attackFromState = undefined;
                                        //         activeState = undefined;
                                        //         $('#nextTurn').removeClass('disabled');
                                        //
                                        //
                                        //     }
                                        //
                                        // }
                                        //
                                        // //pick where to mov soldiers
                                        // else if ((game.currentState === gameState.moveSoldiersTo)) {
                                        //     let PlayerTerritory = game.playerTurn.territories.find(e => e.name === stateKey);
                                        //
                                        //     if(PlayerTerritory === undefined) { //can not move in others territory
                                        //         console.log("can not move in others territory")
                                        //     } else if (stateKey === moveSoldiersFromState) {
                                        //         console.log("can not move into same territory")
                                        //
                                        //     } else if (! canMoveToTerritory()) {
                                        //         console.log("can not move into unconnected territory")
                                        //
                                        //     } else { //move
                                        //         console.log("move to " + activeState);
                                        //
                                        //         $('#howManySoldiersToMove').modal('show')
                                        //
                                        //     }
                                        //
                                        // }

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
                                        p5.stroke(10); p5.textSize(46); p5.rectMode(p5.CENTER); // Set rectMode to CENTER
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