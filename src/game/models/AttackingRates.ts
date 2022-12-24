import {
    addPointsToStrategy,
    AttackingStrategiesPoints,
    countWinningChanceOfnAttacks,
    DefenderLine, Strategies, StrategiesNames, TerritoryWithNumber, WinningChanceOfnAttacks
} from "../ai/helpingFunctions";

export class AttackingRates {
    AttackingStrategiesPoints: Strategies = AttackingStrategiesPoints;
    BestChoseForStrategy: ExtendedStrategies = {
        general : {index: -1, description: null, value: 0, avg: 0},
        drawACard : {index: -1, description: null, value: 0, avg: 0},
        OccupyAsMuchAsPossible : {index: -1, description: null, value: 0, avg: 0},
        Protect : {index: -1, description: null, value: 0, avg: 0},
    };

    defenderLinesRates: DefenderLineRate[] = [];

    attackers: number|undefined = undefined;

    selectiveRates: {
        over60PercentWin: DefenderLineRate[],
        over85PercentWin: DefenderLineRate[],
        over95PercentWin: DefenderLineRate[],
    } = {
        over60PercentWin: [],
        over85PercentWin: [],
        over95PercentWin: [],
    };

    defenderLines: DefenderLine[] = [];

    paths: TerritoryWithNumber[] = [];


    ratesByStrategy(attacks: WinningChanceOfnAttacks, staticPointsOfWisdom: Strategies): Strategies {
        if(staticPointsOfWisdom === undefined) staticPointsOfWisdom = this.AttackingStrategiesPoints;
        let rates: Strategies = staticPointsOfWisdom;

        let s: keyof typeof StrategiesNames;
        for (s in (staticPointsOfWisdom)) {
            rates[s] = addPointsToStrategy(attacks, staticPointsOfWisdom[s]);
        }
        return rates;
    }


    addRateForEachAttack(winningChanceOfnAttacks: WinningChanceOfnAttacks, d: number, defenderLines: DefenderLine[]) {

        this.defenderLinesRates[d] = {
            description: defenderLines[d].toString(),
            rates: this.ratesByStrategy(winningChanceOfnAttacks, AttackingStrategiesPoints),
            attackResults: winningChanceOfnAttacks,
        }

    }

    calculateAvgForBestStrategy() {
        for (let s of Object.values(this.BestChoseForStrategy)) {
            if(s.avg)
            s.avg /= this.defenderLinesRates.length;
            else console.error(`avg is undefined`, s, this.BestChoseForStrategy)
        }

    }

    testAttacks(attackers: number, defenderLines: DefenderLine[]) {
        if(defenderLines === undefined) defenderLines = this.defenderLines;
        if(attackers < 0) throw 'Attackers must be 0 or more. Attackers: ' + attackers;


        this.attackers = attackers;

        for (let d = 0; d < defenderLines.length; d++) {
            let attacks: WinningChanceOfnAttacks = countWinningChanceOfnAttacks(attackers, defenderLines[d], 1000);

            this.addRateForEachAttack(attacks, d, defenderLines);

            let r: keyof typeof StrategiesNames;

            for (r in this.defenderLinesRates[d].rates) {
                const thisRatesTotalPoints = this.defenderLinesRates[d].rates[r].totalPoints
                if(thisRatesTotalPoints === undefined) throw 'total points must not be undefined'

                const thisStrategy = this.BestChoseForStrategy[r]

                if(thisStrategy.value && (thisStrategy.value < thisRatesTotalPoints)) {
                    thisStrategy.value = thisRatesTotalPoints;
                    thisStrategy.index = d;
                    thisStrategy.description = this.defenderLinesRates[d].description;
                    thisStrategy.attackResults = this.defenderLinesRates[d];
                    if(this.paths[d]) {
                        thisStrategy.path = this.paths[d];
                    }
                }

                if(thisStrategy.avg) {
                    //just add points to calc avg
                    thisStrategy.avg += thisRatesTotalPoints;
                }
            }

        }

    }


    convertPathsToDefenderLines() {
        this.defenderLines = [];
        for (let p of this.paths) {
            let defenderLine: DefenderLine = [];
            let i=0;
            for (let s of Object.values(p)) {

                if(i !== 0) //first territory is starting territory
                    defenderLine.push(s);

                i++;
            }

            this.defenderLines.push(defenderLine)
        }

    }

    getSelectiveRates(whichRate: 60|80|95|'60'|'80'|'95'|undefined) {
        if(this.defenderLinesRates.length === 0) {
            console.info("No rate is done yet! defenderLinesRate is empty.")
            return;
        }

        if(whichRate === undefined) {
            if(this.selectiveRates.over60PercentWin.length === 0) {

                for (let dr of this.defenderLinesRates) {
                       if(dr.attackResults.winAll > 0.60) {
                       this.selectiveRates.over60PercentWin.push(dr);
                   }
                       if(dr.attackResults.winAll > 0.85) {
                           this.selectiveRates.over85PercentWin.push(dr);
                       }
                       if(dr.attackResults.winAll > 0.95) {
                           this.selectiveRates.over95PercentWin.push(dr);
                       }

               }//for
        } //if 60rate is empty

            return this.selectiveRates;
        } //get all rates
        else {
            const whichRateStr = whichRate?.toString()

            let selectedRate;
            if(/60/g.test(whichRateStr)) {selectedRate = this.selectiveRates.over60PercentWin}
            if(/85/g.test(whichRateStr)) {selectedRate = this.selectiveRates.over85PercentWin}
            if(/95/g.test(whichRateStr)) {selectedRate = this.selectiveRates.over95PercentWin}

            if(selectedRate === undefined) {console.warn(whichRate + " is not in selectiveRates"); return;}

            if(selectedRate.length === 0) {
                for (let dr of this.defenderLinesRates) { //calculate all rates
                    if(/60/g.test(whichRateStr)) {
                        if(dr.attackResults.winAll > 0.60) {
                            this.selectiveRates.over60PercentWin.push(dr);
                        }
                    } //if 60rate is empty
                    if(/85/g.test(whichRateStr)){
                        if(dr.attackResults.winAll > 0.85) {
                            this.selectiveRates.over85PercentWin.push(dr);
                        }
                    } //if 60rate is empty
                    if(/90/g.test(whichRateStr)) {
                        if(dr.attackResults.winAll > 0.95) {
                            this.selectiveRates.over95PercentWin.push(dr);
                        }
                    } //if 60rate is empty

                }
            }//if selected rate is empty

            return selectedRate;
        }


    }

}

export type ExtendedStrategies = {
    [key in keyof typeof StrategiesNames]: {
        index: number,
        value?: number,
        description?: string | null,
        attackResults?: DefenderLineRate,
        path?: TerritoryWithNumber,
        avg?: number,
    }
}

export type DefenderLineRate = {
    description: string,
    rates: Strategies,
    attackResults: WinningChanceOfnAttacks,
}


