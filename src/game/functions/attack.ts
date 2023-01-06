import {Game, gameState} from "../models/Game";
import {CountryName} from "../constants/CountryName";
import {Territory} from "../constants/Territory";

export function attack(game: Game, from: CountryName, to: CountryName, numberOfDices: number = 3, ) {
    const attackingPlayer = game.playerTurn

    const fromTerritory = attackingPlayer.territories.find(t => t.name === from)
    if(!fromTerritory) throw `Territory ${from} does not belong to attacking player ${attackingPlayer.name}`

    const terrAndPlayer = getTerritoryAndPLayerFromName(to, game)
    if(!terrAndPlayer) throw `Territory ${to} does not belong to any player`

    const {territory: toTerritory, player: attackedPLayer} = terrAndPlayer

    const defendingNumber = toTerritory.soldiers;

    console.log(fromTerritory.soldiers +" "+ defendingNumber)

    let attackingNumber = fromTerritory.soldiers - 1;

    let result;
    if(numberOfDices === 3) {
         result = threeDice(attackingNumber, defendingNumber);

    } else if(numberOfDices === 2) {
         result = twoDice(numberOfDices, defendingNumber);

    } else if(numberOfDices === 1) {
         result = oneDice(numberOfDices, defendingNumber);

    } else throw 'number of dices is '+ numberOfDices;

    const attackingSoldersLeft = result[0]

    if(attackingSoldersLeft === 0) { //attacking finished in this part no more soldiers to attack
        console.log("attacking finished from this state no more soldiers to attack");
        fromTerritory.soldiers = 1;
    } else if(result[1] === 0) { //occupy territory
        console.log(attackingSoldersLeft + " moving to " + to);

        attackedPLayer.removeTerritory(to)
        toTerritory.soldiers = attackingSoldersLeft
        attackingPlayer.addTerritory(toTerritory)

        //make player able to draw a card
        attackingPlayer.hasOccupiedTerritory = true;

        //change number of soldiers to attacking territory to 1
        // TODO user must decide how many solders he/she wants to move
        fromTerritory.soldiers = 1;


        let playerWins = game.hasCurrentPlayerWon();

        if(playerWins) {
            game.winner = attackingPlayer;
            console.log(attackingPlayer.name + " won!!!");
        }

        //check if attacked player is out of game
       if(attackedPLayer.isPlayerOutOfGame()) {
           console.log('player '+ attackedPLayer.name + " is out of game.")
       }
    }

    const canPlayerAttack = game.canStillPlayerAttackThisTurn()

    console.log("game.canStillPlayerAttackThisTurn()", canPlayerAttack)

    switch (game.getState) {
        case gameState.firstAttackFrom:
            if (canPlayerAttack) game.nextGamePhase()
            else game.finishAttackImmediatelyPhase()
            break
        case gameState.attackFrom:
            if (canPlayerAttack) game.previousGamePhase()
            else game.nextGamePhase()
            break
        default:
            throw "When an attack happens game phase must be firstAttackFrom or attackFrom"
    }

}


function threeDice(attackingNumber: number, defendingNumber: number): [number, number] {
    if(attackingNumber < 3 ) throw 'attacking number is '+ attackingNumber +". Must be 3";


    if(defendingNumber === 0) {
        return [attackingNumber, 0]
    }
    if(attackingNumber === 0){
        return [0, defendingNumber]
    }

    if(defendingNumber === 1) { //1 defending dice
        let attackersDice = Math.max(getRandomDice(), Math.max(getRandomDice(), getRandomDice()));
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

        let attackerDiceBig = Math.max(attackerDice1, Math.max(attackerDice2, attackerDice3));
        let attackerDiceSmall = [attackerDice1,attackerDice2,attackerDice3].sort()[1];
        let defenderDiceBig = Math.max(defenderDice1, defenderDice2), defenderDiceSmall = Math.max(defenderDice1, defenderDice2);

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

function twoDice(attackingNumber: 2, defendingNumber: number): [number, number]  {
    if(attackingNumber !== 2) throw 'attacking number is '+ attackingNumber +". Must be 2";


    if(defendingNumber === 0) {
        return [attackingNumber, 0]
    }

    if(defendingNumber === 1) { //1 defending dice
        let attackersDice = Math.max(getRandomDice(), getRandomDice());
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

        let attackerDiceBig = Math.max(attackerDice1, attackerDice2), attackerDiceSmall = Math.min(attackerDice1, attackerDice2);
        let defenderDiceBig = Math.max(defenderDice1, defenderDice2), defenderDiceSmall = Math.min(defenderDice1, defenderDice2);

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

function oneDice(attackingNumber: 1, defendingNumber: number): [number, number]  {

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
        let defenderDice = Math.max(getRandomDice(), getRandomDice());

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
    return Math.floor( Math.random() * 6 ) + 1;
}

function getTerritoryAndPLayerFromName(territoryToFind: CountryName, game: Game) {
    for (let player of game.players) {
        for (let territory of player.territories) {
            if(territoryToFind === territory.name){
                return {territory,player};
            }
        }
    }
}
export function searchInBorders(fromTerritoryObj: Territory, toTerritory: CountryName, playerTerritories: Territory[], previousFromTerritories: CountryName[]): boolean {
    let res = false
    for (let bt of fromTerritoryObj.borders) {

        //do not check territory that we came from
        if(previousFromTerritories.find(pt => pt === bt)) continue;

        //get territory object from territory name
        let playerTerritory = playerTerritories.find(e => e.name === bt);

        // if this border territory does not belong to this player skip this search
        if(playerTerritory === undefined) continue;

        // console.log(bt, toTerritory)
        if(bt === toTerritory) {
            return true;
        } else {
            res = searchInBorders(playerTerritory, toTerritory, playerTerritories, [...previousFromTerritories, bt])
            if(res) return true
        }

    }
    // console.log('do wea rrive here')
    return res
}


function soldiersByStars(stars: number) {
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
