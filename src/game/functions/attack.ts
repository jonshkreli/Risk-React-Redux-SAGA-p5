import {Game, gameState} from "../models/Game";
import {CountryName} from "../constants/CountryName";
import {Territory} from "../constants/Territory";
import {getBiggestSmallestDices, getNRandomDices, getRandomDice} from "./smallUtils";
import {AttackSettings, FromTo} from "../models/HelperTypes";
import {Message} from "../models/Message";
import {
    couldNotInvadeTerritory,
    playerInvadedTerritoryFromPlayer,
    playerIsOutOfTheGame,
    soldersLeftAfterAttack
} from "./messageCreators";

export function attack(game: Game, {from, to}: FromTo, {attackingDices = 3, attackAgain = false}: AttackSettings, messages: Message[]) {
    const attackingPlayer = game.playerTurn

    const fromTerritory = attackingPlayer.getTerritory(from)
    if(!fromTerritory) throw `Territory ${from} does not belong to attacking player ${attackingPlayer.name}`

    const terrAndPlayer = getTerritoryAndPLayerFromName(to, game)
    if(!terrAndPlayer) throw `Territory ${to} does not belong to any player`

    const {territory: toTerritory, player: attackedPLayer} = terrAndPlayer

    const defendingNumber = toTerritory.soldiers;

    // console.log(fromTerritory.soldiers +" "+ defendingNumber)

    const attackingNumber = fromTerritory.soldiers - 1;

    let result;
    if(attackingDices === 3) {
         result = threeDice(attackingNumber, defendingNumber, attackAgain, messages);
    } else if(attackingDices === 2) {
         result = twoDice(attackingNumber, defendingNumber, attackAgain, messages);
    } else if(attackingDices === 1) {
         result = oneDice(attackingNumber, defendingNumber, attackAgain, messages);
    } else throw 'number of dices is '+ attackingDices;

    const [attackingSoldersLeft, defendingSoldersLeft] = result

    messages.push(soldersLeftAfterAttack(attackingSoldersLeft, defendingSoldersLeft))

    fromTerritory.soldiers = attackingSoldersLeft + 1 // attacking solders + 1 solder that stays in the ground
    toTerritory.soldiers = defendingSoldersLeft


    if (defendingSoldersLeft === 0) { //occupy territory
        attackedPLayer.removeTerritory(to)
        attackingPlayer.addTerritory(toTerritory)

        messages.push(playerInvadedTerritoryFromPlayer(attackingPlayer, attackedPLayer, to))

        //check if attacked player is out of game
        if (attackedPLayer.isPlayerOutOfGame()) {
            messages.push(playerIsOutOfTheGame(attackedPLayer))
        }

        return true
    }
    messages.push(couldNotInvadeTerritory(attackingPlayer, to))
    // both territories have still solders
    return false
}


function threeDice(attackingNumber: number, defendingNumber: number, attackAgain = false, messages: Message[]): [number, number] {
    if(attackingNumber < 3 ) throw 'attacking number is '+ attackingNumber +". Must be 3 or more";

    if(defendingNumber === 0) return [attackingNumber, 0]

    if(defendingNumber === 1) { //1 defending dice
        const attackerDiceBig = Math.max(...getNRandomDices(3));
        const defenderDice = getRandomDice();

        if(attackerDiceBig > defenderDice) defendingNumber--; else attackingNumber--;
    }
    else if(defendingNumber >= 2){ //2 defending dice
        const attackerDices = getNRandomDices(3)
        const defenderDices = getNRandomDices(2)
        const {attackerDiceBig, attackerDiceSmall, defenderDiceBig, defenderDiceSmall} = getBiggestSmallestDices(attackerDices, defenderDices)

        if (attackerDiceBig > defenderDiceBig) defendingNumber--; else attackingNumber--;
        if (attackerDiceSmall > defenderDiceSmall) defendingNumber--; else attackingNumber--;
    } else throw 'defenders are '+ defendingNumber;

    if (attackAgain)
        if (attackingNumber >= 3) return threeDice(attackingNumber, defendingNumber, attackAgain, messages);
        else if (attackingNumber === 2) return twoDice(attackingNumber, defendingNumber, attackAgain, messages);
        else if (attackingNumber === 1) return oneDice(attackingNumber, defendingNumber, attackAgain, messages);
        else if (attackingNumber === 0) return [0, defendingNumber];
        else throw 'Attackers are ' + attackingNumber;
    else return [attackingNumber, defendingNumber]

}

function twoDice(attackingNumber: number, defendingNumber: number, attackAgain = false, messages: Message[]): [number, number]  {
    if(attackingNumber < 2) throw 'attacking number is '+ attackingNumber +". Must be 2 or more";

    if(defendingNumber === 0) return [attackingNumber, 0]

    if(defendingNumber === 1) { //1 defending dice
        let attackerDiceBig = Math.max(...getNRandomDices(2));
        let defenderDice = getRandomDice();

        // TODO test message
        messages.push({type: "INFO", message: `attacker biggest dice: ${attackerDiceBig} VS defender dice: ${defenderDice}`, origin: ['attacker 2 dices, defender 1 dice']})

        if(attackerDiceBig > defenderDice) defendingNumber--; else attackingNumber--;
    }
    else if(defendingNumber >= 2){ //2 defending dice
        const attackerDices = getNRandomDices(2)
        const defenderDices = getNRandomDices(2)
        const {attackerDiceBig, attackerDiceSmall, defenderDiceBig, defenderDiceSmall} = getBiggestSmallestDices(attackerDices, defenderDices)

        if(attackerDiceBig > defenderDiceBig) defendingNumber--; else attackingNumber--;
        if(attackerDiceSmall > defenderDiceSmall) defendingNumber--; else attackingNumber--;
    } else throw 'defenders are '+ defendingNumber;

    if (attackAgain) //will attack with 3 dices as did in first time. If player wants to attack with more he/she can use threeDice (if there are enough solders)
        if (attackingNumber >= 2) return twoDice(attackingNumber, defendingNumber, attackAgain, messages);
        else if (attackingNumber === 1) return oneDice(attackingNumber, defendingNumber, attackAgain, messages);
        else if (attackingNumber === 0) return [0, defendingNumber];
        else throw 'Attackers are ' + attackingNumber;
    else return [attackingNumber, defendingNumber]
}

function oneDice(attackingNumber: number, defendingNumber: number, attackAgain = false, messages: Message[]): [number, number]  {

    if(defendingNumber === 0) return [attackingNumber, 0]

    if(defendingNumber === 1) { //1 defending dice
        let attackersDice = getRandomDice();
        let defenderDice = getRandomDice();

        if(attackersDice > defenderDice) defendingNumber--; else attackingNumber--;
    }
    else if(defendingNumber >= 2){ //2 defending dice
        let attackersDice = getRandomDice();
        let defenderDice = Math.max(...getNRandomDices(2));

        if(attackersDice > defenderDice) defendingNumber--; else attackingNumber--;

    } else throw 'defenders are '+ defendingNumber;

    if (attackAgain)
        if (attackingNumber >= 1) return oneDice(attackingNumber, defendingNumber, attackAgain, messages);
        else if (attackingNumber === 0) return [0, defendingNumber];
        else throw 'Attackers are ' + attackingNumber;
    else return [attackingNumber, defendingNumber]

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
