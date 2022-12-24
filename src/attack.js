function attack(numberOfDices = 3) {

    let attackingFromNumber;

    for (let t of game.playerTurn.territories) {
        if(t.name === attackFromState) {
            attackingFromNumber = t.soldiers;
            break;
        }
    }

    let defendingNumber = getTerritoryFromName(activeState).soldiers;

    console.log(attackingFromNumber +" "+ defendingNumber)


    let attackingNumber = attackingFromNumber - 1;

    let result;
    if(numberOfDices === 3) {
         result = threeDice(attackingNumber, defendingNumber);

    } else if(numberOfDices === 2) {
         result = twoDice(attackingNumber, defendingNumber);

    } else if(numberOfDices === 1) {
         result = oneDice(attackingNumber, defendingNumber);

    } else throw 'number of dices is '+ numberOfDices;

    if(result[0] === 0) { //attacking finished in this part no more soldiers to attack
        console.log("attacking finished from this state no more soldiers to attack");
        game.playerTurn.territories.find(e => e.name === attackFromState).soldiers = 1;

    } else if(result[1] === 0) { //occupy territory
        console.log(result[0] + " moving to " + activeState);

        //remove territory from loser
        let LoserAndTerritoryIndex = getTerritoryIndexAndPlayerIndexFromName(activeState);

        console.log(LoserAndTerritoryIndex);

       let territory = game.players[LoserAndTerritoryIndex.playerIndex].territories.
        splice(LoserAndTerritoryIndex.territoryIndex, 1);

       console.log(territory);

        //add territory to winner
        territory[0].soldiers = result[0];
        game.playerTurn.territories.push(territory[0]);

        //make player able to draw a card
        game.playerTurn.hasOccupiedTerritory = true;

        //change number of soldiers to attacking territory to 1
        game.playerTurn.territories.find(e => e.name === attackFromState).soldiers = 1;

        let playerWins = game.hasCurrentPlayerWon();

        if(playerWins) {
            game.winner = game.playerTurn;
            console.log(game.playerTurn.name + " won!!!");
        }

        //check if attacked player is out of game
        let outOfGamePlayer = game.isPlayerOutOfGame(LoserAndTerritoryIndex.playerIndex);
       if(outOfGamePlayer  !== false) {
           console.log('player '+ outOfGamePlayer.name + " is out of game.")
       }
    }

}


function threeDice(attackingNumber, defendingNumber) {
    if(attackingNumber < 3 ) throw 'attacking number is '+ attackingNumber +". Must be 3";


    if(defendingNumber === 0) {
        return [attackingNumber, 0]
    }
    if(attackingNumber === 0){
        return [0, defendingNumber]
    }

    if(defendingNumber === 1) { //1 defending dice
        let attackersDice = max(getRandomDice(), max(getRandomDice(), getRandomDice()));
        let defenderDice = getRandomDice();

        if(attackersDice > defenderDice) {
            defendingNumber--;
        } else {
            attackingNumber--;
        }


        if(attackingNumber>=3) {
            return threeDice(attackingNumber, defendingNumber);
        } else if(attackingNumber === 2) {
            return twoDice(attackingNumber, defendingNumber);
        }
         else throw 'Attackers are ' + attackingNumber;
    }
    else if(defendingNumber >= 2){ //2 defending dice
        let attackerDice1 = getRandomDice(), attackerDice2 = getRandomDice(), attackerDice3 = getRandomDice(),
            defenderDice1 = getRandomDice(), defenderDice2 = getRandomDice();

        let attackerDiceBig = max(attackerDice1, max(attackerDice2, attackerDice3));
        let attackerDiceSmall = [attackerDice1,attackerDice2,attackerDice3].sort()[1];
        let defenderDiceBig = max(defenderDice1, defenderDice2), defenderDiceSmall = min(defenderDice1, defenderDice2);

        if(attackerDiceBig > defenderDiceBig) {
            defendingNumber--;
        } else {
            attackingNumber--;
        }
        if(attackerDiceSmall > defenderDiceSmall) {
            defendingNumber--;
        } else {
            attackingNumber--;
        }

        if(attackingNumber>=3) {
            return threeDice(attackingNumber, defendingNumber);
        } else if(attackingNumber === 2) {
            return twoDice(attackingNumber, defendingNumber);
        } else if(attackingNumber === 1) {
            return oneDice(attackingNumber, defendingNumber);
        }else if(attackingNumber === 0){
            return [0, defendingNumber]
        }
        else throw 'Attackers are ' + attackingNumber;

    } else throw 'defenders are '+ defendingNumber;

}

function twoDice(attackingNumber, defendingNumber) {
    if(attackingNumber !== 2) throw 'attacking number is '+ attackingNumber +". Must be 2";


    if(defendingNumber === 0) {
        return [attackingNumber, 0]
    }
    if(attackingNumber === 0){
        return [0, defendingNumber]
    }

    if(defendingNumber === 1) { //1 defending dice
        let attackersDice = max(getRandomDice(), getRandomDice());
        let defenderDice = getRandomDice();

        if(attackersDice > defenderDice) {
            defendingNumber--;
        } else {
            attackingNumber--;
        }

        if(attackingNumber === 2) {
            return twoDice(attackingNumber, defendingNumber);
        } else if(attackingNumber === 1) {
            return oneDice(attackingNumber, defendingNumber);
        }
         else throw 'Attackers are ' + attackingNumber;
    }

    else if(defendingNumber >= 2){ //2 defending dice
        let attackerDice1 = getRandomDice(), attackerDice2 = getRandomDice(),
            defenderDice1 = getRandomDice(), defenderDice2 = getRandomDice();

        let attackerDiceBig = max(attackerDice1, attackerDice2), attackerDiceSmall = min(attackerDice1, attackerDice2);
        let defenderDiceBig = max(defenderDice1, defenderDice2), defenderDiceSmall = min(defenderDice1, defenderDice2);

        if(attackerDiceBig > defenderDiceBig) {
            defendingNumber--;
        } else {
            attackingNumber--;
        }
        if(attackerDiceSmall > defenderDiceSmall) {
            defendingNumber--;
        } else {
            attackingNumber--;
        }


        if(attackingNumber === 2) {
            return twoDice(attackingNumber, defendingNumber);
        } else if(attackingNumber === 1) {
            return oneDice(attackingNumber, defendingNumber);
        }else if(attackingNumber === 0){
            return [0, defendingNumber]
        }
        else throw 'Attackers are ' + attackingNumber;

    } else throw 'defenders are '+ defendingNumber;
}

function oneDice(attackingNumber, defendingNumber) {

    if(attackingNumber !== 1) throw 'attacking number is '+ attackingNumber +". Must be 1";

    if(defendingNumber === 0) {
        return [attackingNumber, 0]
    }

    if(defendingNumber === 1) { //1 defending dice
        let attackersDice = getRandomDice();
        let defenderDice = getRandomDice();

        if(attackersDice > defenderDice) {
            defendingNumber--;
        } else {
            attackingNumber--;
        }

        if(attackingNumber === 1) {
            return oneDice(attackingNumber, defendingNumber);
        } else if(attackingNumber === 0){
            return [0, defendingNumber]
        }
        else throw 'Attackers are ' + attackingNumber;
    }
    else if(defendingNumber >= 2){ //2 defending dice
        let attackersDice = getRandomDice();
        let defenderDice = max(getRandomDice(), getRandomDice());

        if(attackersDice > defenderDice) {
            defendingNumber--;
        } else {
            attackingNumber--;
        }

        if(attackingNumber === 1) {
            return oneDice(attackingNumber, defendingNumber);
        } else if(attackingNumber === 0){
            return [0, defendingNumber]
        }
        else throw 'Attackers are ' + attackingNumber;


    } else throw 'defenders are '+ defendingNumber;
}

function getRandomDice() {
    return Math.floor( Math.random() * 6 ) +1;
}

function getTerritoryFromName(territory) {
    for (let p of game.players) {
        for (let t of p.territories) {
            if(territory === t.name){
                return t;
            }
        }
    }
}

function getTerritoryIndexAndPlayerIndexFromName(territory) {
    for (let p=0; p < game.players.length; p++) {
        for (let t = 0; t < game.players[p].territories.length; t++)
         {
            if(territory === game.players[p].territories[t].name){
                return {
                    playerIndex: p, territoryIndex: t
                };
            }
        }
    }
}

var count=0;
function canMoveToTerritory() {

    let TerritoryFrom = game.playerTurn.territories.find(e => e.name === moveSoldiersFromState);


    //modifies isInPlayersTerritoryTree
    searchInBorders(activeState, TerritoryFrom, game.playerTurn.territories,);


    if(isInPlayersTerritoryTree) {
        isInPlayersTerritoryTree = false; //reset
        count = 0;
        return true;
    }
    return false;
}


function searchInBorders(toTerritory, fromTerritoryObj, playerTerritories, previousFromTerritory) {
    for (let bt of fromTerritoryObj.borders) {
        count ++;
        if(count > 1000) {
            count = 0;
            break;
        }

        //do not check territory that we came from
        if(bt === previousFromTerritory) continue;

        //get territory object from territory name
        let playerTerritory = playerTerritories.find(e => e.name === bt);

        // if this border territory does not belong to this player skip this search
        if(playerTerritory === undefined) continue;

        if(bt === toTerritory) {
            isInPlayersTerritoryTree = true;
            return;
        } else {
            searchInBorders(toTerritory, playerTerritory, playerTerritories, fromTerritoryObj.name)
        }

    }
}


function soldiersByStars(stars) {
    if(stars>10) return 30;

    switch (stars) {
        case 1: return 1;
        case 2: return 2;
        case 3: return 4;
        case 4: return 7;
        case 5: return 10;
        case 6: return 13;
        case 7: return 17;
        case 8: return 21;
        case 9: return 25;
        case 10: return 30;
        default: throw 'please add a valid number of stars. (1 or more)'
    }
}
