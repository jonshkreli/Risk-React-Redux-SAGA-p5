import {CountryName} from "../constants/CountryName";
import {Card} from "../constants/cards";
import {Territory} from "../constants/Territory";
import {AttackingRates} from "../models/AttackingRates";

export function twoAttacks(attackers, defenders1, defenders2) {
    let result = [];

    let firstAttack = threeDice(attackers, defenders1);


    if(firstAttack[0] > 0) {
        let attackersForNewRound = firstAttack[0] - 1; //one soldier needs to stay back
        if(attackersForNewRound >= 3)
        result = [firstAttack[0], ...threeDice(attackersForNewRound, defenders2)]

        else if(attackersForNewRound === 2)
            result = [firstAttack[0], ...twoDice(attackersForNewRound, defenders2)]
        else if(attackersForNewRound === 1)
            result = [firstAttack[0], ...oneDice(attackersForNewRound, defenders2)]
        else if (attackersForNewRound === 0)
            result = [...firstAttack, defenders2];

    } else {
        result = [...firstAttack, defenders2]
    }

    return result;

    // [4,2,0]
    //first number attackers who were succeeded in first attack
    // second attackers/defenders left
    //third defenders left in second attack
}

export function nAttacks(attackers: number, defendersLine: DefenderLine): WinsOnDefenderLines {
    if(attackers < 0) throw 'Attackers must be 0 or more. Attackers: ' + attackers;
    if(defendersLine.length === 0)
        throw 'defendersLine row must be at least 1. defendersLine: ' + defendersLine;

    let count= 0;

    let winsOnDefenderLines: WinsOnDefenderLines = {};

    for (let d = 0; d < defendersLine.length; d++) {

        if(count++ === 1000) {
            console.warn('to much loop');
            count=0;
            break;
        }

        if(defendersLine[d] === 0) {
            console.warn('defenders can not be 0');
            continue;
        }

        // console.log(attackers + " vs " +defenders[d])
        // winsOnDefenderLines[d] = {};
        winsOnDefenderLines[d] = {match: {
            attackers: attackers, defenders: defendersLine[d],
            visual: attackers + " vs " + defendersLine[d]
    }}


        let result: [number, number];
        if (attackers >= 3) {
             result = threeDice(attackers, defendersLine[d]);
        } else if (attackers === 2) {
             result = twoDice(attackers, defendersLine[d]);
        } else if (attackers === 1) {
             result = oneDice(attackers, defendersLine[d]);
        } else if (attackers === 0) {
            winsOnDefenderLines[d].noMoreAttackers= defendersLine[d]
          continue;
        } else {throw 'Attackers must be a positive number'}

        // console.log(result)

        if (result[0] > 0) { //attack successful
            winsOnDefenderLines[d].win = result[0]

            //modify attackers for next turn
            attackers = result[0] - 1;
        } else { // @ts-ignore
            if (result[1] > 0) { //defenders win
                //show how many defenders left
                winsOnDefenderLines[d].lose = result[1]
                attackers = 0;
            }
        }
    }

    return winsOnDefenderLines;
}


export function countWinningChanceOfTwoAttacks(attackers, defenders1, defenders2, times = 100) {

    let wins = 0;

    for (let i = 0; i < times; i++) {
       let result = twoAttacks(attackers, defenders1, defenders2);
       if(result[2] === 0) wins++;
       //if no defender is left after second attack then declare win
    }

    return wins/times;

}

/**
 * attackers Number
 * defendersLine Number
 * */
export function countWinningChanceOfnAttacks(attackers: number, defendersLine: DefenderLine, times = 100): WinningChanceOfnAttacks {

    if(attackers < 0) throw 'Attackers must be 0 or more. Attackers: ' + attackers;
    if(defendersLine.length === 0)
        throw 'defendersLine row must be at least 1. defendersLine: ' + defendersLine;

    let winAllTotal = 0;
    let defendersBeatTotal = 0;
    let attackersLeftTotal = 0;
    let defendersLeftTotal = 0;
    let totalDefenders = defendersLine.reduce((a, b) => a + b, 0);
    let territoriesOccupiedTotal = 0;
    let territoriesLeftTotal = 0;

    for (let i = 0; i < times; i++) {
        let result: WinsOnDefenderLines = nAttacks(attackers, defendersLine);

        let winAll = true;
        let defendersBeat = 0;
        let attackersLeft = 0;
        let defendersLeft = 0;
        let territoriesOccupied = 0;
        let territoriesLeft = 0;


        for (let match of Object.values(result)) {
            if(match.win) {
                attackersLeft = match.win;
                defendersBeat += match.match.defenders;
                territoriesOccupied ++;
            }
           else if(match.lose || match.noMoreAttackers){
               defendersLeft += match.match.defenders;
               territoriesLeft++;
                winAll = false
            }
        }

        if(winAll) winAllTotal++;
        defendersBeatTotal += defendersBeat;
        attackersLeftTotal += attackersLeft;
        defendersLeftTotal += defendersLeft;
        territoriesOccupiedTotal += territoriesOccupied;
        territoriesLeftTotal += territoriesLeft;

    }

    return {
        winAll: winAllTotal/times,
        totalDefenders: totalDefenders,
        territoriesOccupiedTotal: territoriesOccupiedTotal/times,
        territoriesLeftTotal: territoriesLeftTotal/times,
        attackersLeft: attackersLeftTotal/times,
        defendersLeft: defendersLeftTotal/times,
        defendersBeat: defendersBeatTotal/times,
    };

}


/*
* @attackers Number
* @defenderLines [[]]
* */
export function checkWhereToAttack(attackers, defenderLines) {


    let attackingRates = new AttackingRates();
    attackingRates.defenderLines = defenderLines;
    attackingRates.AttackingStrategiesPoints = AttackingStrategiesPoints;

    attackingRates.testAttacks(attackers, defenderLines);

    attackingRates.calculateAvgForBestStrategy();


    // console.log(attackingRates)

    return attackingRates;

    }


export const AttackingStrategiesPoints: Strategies = {
    "general" : {
        WinAll: 60,
        TerritoriesOccupiedTotal: 6,
        AttackersLeft: 8,
    },
    "drawACard": {
        WinAll: 100,
        TerritoriesOccupiedTotal: 0,
        AttackersLeft: 0,
    },
    "OccupyAsMuchAsPossible": {
        WinAll: 30,
        TerritoriesOccupiedTotal: 15,
        AttackersLeft: 0,
    },
    "Protect": {
        WinAll: 60,
        TerritoriesOccupiedTotal: 0,
        AttackersLeft: 15,
    }
};

export function ratesByStrategy(attacks, staticPointsOfWisdom) {
    let rates = {};

    for (let s of Object.keys(staticPointsOfWisdom)) {
        rates[s] = addPointsToStrategy(attacks, staticPointsOfWisdom[s]);
    }

    return rates;
}

/**
 * @attacks comes from countWinningChanceOfnAttacks()
 * @strategy staticPointsOfWisdom.strategy
 * */
export function addPointsToStrategy(attacks: WinningChanceOfnAttacks, strategy: StrategyPoints) {

  let strategyPoints: StrategyPoints = {
        WinAll: attacks.winAll * strategy.WinAll,
        TerritoriesOccupiedTotal: attacks.territoriesOccupiedTotal * strategy.TerritoriesOccupiedTotal,
        AttackersLeft: attacks.attackersLeft * strategy.AttackersLeft,
    };
    let totalPoints = 0;
    for(let p of Object.values(strategyPoints)) {
        totalPoints += p;
    }
    strategyPoints.totalPoints = totalPoints;

    return strategyPoints;

}

export function clone(A: any) {
    return JSON.parse(JSON.stringify(A));
}

export function calculatePathsFromTo(from: CountryName, to: CountryName, allTerritories: Territory[], ownedTerritories: Territory[]): Path[] {
    if(ownedTerritories === undefined) console.warn("To many results may be shown. Some may get disposed!-")

    // @ts-ignore
    let fromTerr: Territory = allTerritories.find(e => e.name === from);
    // @ts-ignore
    let toTerr: Territory = allTerritories.find(e => e.name === to);

    if(!fromTerr ) throw 'Could not find card with name ' + from
    if(!toTerr) throw 'Could not find card with name ' + to

   let res = allPathsFromTo(fromTerr,toTerr, allTerritories,[],[], ownedTerritories);

    // console.log(res)

    return res;

}

export function allPathsFromTo(fromTerr: Territory,toTerr: Territory, allTerritories: Territory[], path: Path=[], validPaths: Path[], ownedTerritories: Territory[]): Path[] {
    if(fromTerr === undefined){
        fromTerr = allTerritories[0];
    }
    path.push(fromTerr.name);
    //console.log("Current Path", path);
    if(fromTerr === toTerr){
        // console.log("Found Valid", path);
        validPaths.push(clone(path));
        return validPaths;
    }

    //find all border territories as objects
    let bordersObj: Territory[] = [];
    for (let bt of fromTerr.borders) {
        let borderObj = allTerritories.find(e => e.name === bt);
        if(borderObj === undefined) {
            throw (bt + "is does not belong to any territory");
        } else if(ownedTerritories && ownedTerritories.find(e => e.name === borderObj?.name) !== undefined) {
            // console.info(bt + "is your territory");
        } else bordersObj.push(borderObj);
    }

//console.log(bordersObj, node)
    bordersObj.forEach(x => {
        if(path.indexOf(x.name) === -1){
            const newPath = clone(path);
            allPathsFromTo(x,toTerr, allTerritories, newPath, validPaths, ownedTerritories);
        }
    });

    return validPaths
}

export function generateRandomSoldiers(CardsWithoutSoldiers: Card[]) {
    if(CardsWithoutSoldiers.constructor !== Array ) throw 'cards needs to be an Array. cards:' + CardsWithoutSoldiers;

    // let gameTerritories = [];
    let gameTerritories = [...CardsWithoutSoldiers];

    for (let gt of gameTerritories) {

        // for (let c of CardsWithoutSoldiers) {
        // let gt = Object.assign({}, c);

        gt.soldiers = Math.floor( (Math.random()*10) / (1 + Math.random()*2) );
        if(gt.soldiers === 0) {
            gt.soldiers =1;
        }

        // gameTerritories.push(gt);
    }

    return gameTerritories;

}


export function checkAttackingPathsFromTo(attackers: number, from: CountryName, to: CountryName, gameCards: Card[], ownedTerritories: Territory[]) {
    let cardsWithSoldiers: Territory[] = gameCards.map(c => ({
        name: c.name,
        soldiers: c.stars,
        borders: c.borders,
        continent: c.continent
    })) //generateRandomSoldiers(gameCards);


    let getPaths: Path[] = calculatePathsFromTo(from, to, cardsWithSoldiers,ownedTerritories);

    let pathWithSoldiers: TerritoryWithNumber[] = [];
    let defenderLines: DefenderLine[] = [];

    for (let path of getPaths) {
        let pathP: TerritoryWithNumber = {};
        let defenderLine: DefenderLine = [];
        let i=0;

        let t: CountryName
        for (t of path) {
            // console.log(t,p)
            // @ts-ignore
            let soldiers: number = cardsWithSoldiers.find(e => e.name === t).soldiers;
            pathP[t] = soldiers;

            if(i !== 0) //first territory is starting territory
            defenderLine.push(soldiers);
            // console.log(pathP)
            i++;
        }

        pathWithSoldiers.push(pathP)
        defenderLines.push(defenderLine)
    }

// console.log(pathWithSoldiers, defenderLines);

//checkWhereToAttack(attackers, defenderLines);

    let AR = new AttackingRates();

    AR.AttackingStrategiesPoints = AttackingStrategiesPoints;

    AR.paths = pathWithSoldiers;

    AR.convertPathsToDefenderLines();

    // console.log(AR)

   AR.testAttacks(attackers, defenderLines);
   AR.calculateAvgForBestStrategy();


  // let tp = AR.getSelectiveRates(85);

   // let tt = AR.getSelectiveRates()

// console.log(tp,tt)

    return AR
}

export type Path = CountryName[]
export type TerritoryWithNumber = {[K in CountryName]?: number}
export type DefenderLine = number[]
export type StrategyPoints = { WinAll: number, TerritoriesOccupiedTotal: number, AttackersLeft: number, totalPoints?: number }
export type WinsOnDefenderLines = {
    [K in number]: {
        match: {
            attackers: number, defenders: number, visual: string
        },
        noMoreAttackers?: number,
        win?: number,
        lose?: number
    }
}
export type WinningChanceOfnAttacks = {
    winAll: number,
    totalDefenders: number,
    territoriesOccupiedTotal: number,
    territoriesLeftTotal: number,
    attackersLeft: number,
    defendersLeft: number,
    defendersBeat: number,
}
export enum StrategiesNames {general, drawACard, OccupyAsMuchAsPossible, Protect }
export type Strategies = {
    [key in keyof typeof StrategiesNames]: StrategyPoints
}
