import {Game} from "./Game";
import {Card} from "../constants/cards";
import {Territory} from "../constants/Territory";
import {CountryName} from "../constants/CountryName";
import {checkAttackingPathsFromTo} from "../ai/helpingFunctions";
import {AttackingRates} from "./AttackingRates";
import {PlayerColors} from "../constants/settingsConfig";

export class Player {
    name: string;
    color: keyof typeof PlayerColors | undefined = undefined;
    hasOccupiedTerritory: boolean = false;
    game: Game | undefined = undefined;
    isPlaying = false;
    territories: Territory[];
    cards: Card[];
    type: PlayerType;

   constructor(name: string, type: PlayerType = 'human') {
       this.name = name;
       this.type = type
       this.territories = [];
       this.cards = [];
   }

   play(activeState: CountryName, attackFromState: CountryName ) {
       if(this.game === undefined) throw 'game is not set yet'

       this.isPlaying = true;

       let territoriesConn = this.whereAreMoreConnectedTerritories();
       let withMostAlliesAndOneEnemy = this.terrWithMostAlliesAndOneEnemy(territoriesConn);
       let bestTerr = this.territories.find( e => e === withMostAlliesAndOneEnemy.territory);
       if(!bestTerr) throw 'Player could not find a territory where to put solders'

       bestTerr.soldiers += this.game.soldiersToPut;

       // think where to attack
       let enemyTerritories: Territory[] = this.getAllEnemyTerritories();
       // console.log(enemyTerritories);

       let ars: AttackingRates[] = [];


       for (let t of enemyTerritories) {
           let ar = checkAttackingPathsFromTo(bestTerr.soldiers-1, bestTerr.name, t.name, this.game.cards, this.territories)
           ars.push(ar)
       }

       // console.log(bestTerr.name, enemyTerritories[0].name)

       let attackChoice = ars[0].BestChoseForStrategy.drawACard;
       for (let attRes of ars) {
           if(attRes.BestChoseForStrategy.drawACard.value > attackChoice.value) {
               attackChoice = attRes.BestChoseForStrategy.drawACard;
           }
       }

       console.log(ars, attackChoice)

        attackFromState = Object.keys(attackChoice.path)[0];
       activeState = Object.keys(attackChoice.path)[1];

       if(this.game.playerTurn.territories[activeState].soldiers > 3) {
           attack(3);
       } else if(this.game.playerTurn.territories[activeState].soldiers === 3) {
           attack(2);
       } else if(this.game.playerTurn.territories[activeState].soldiers === 2) {
           attack(1);
       } else {
           //do not attack
       }



       attackFromState = undefined; activeState = undefined;

       // game.nextPlayerTurn();
   }

   whereAreMoreConnectedTerritories(): TerritoryArmyStatus[] {
       let conn: TerritoryArmyStatus[] = []
       //{"alaska": {allies:2, enemies: 1}}
       for (let t of this.territories) {
           const playerTerritory: TerritoryArmyStatus = {territory: t.name, allies:0, enemies: 0};
           conn.push(playerTerritory)
           for (let b of t.borders) {
               //allies terr
                if(this.territories.find(e => e.name === b) !== undefined) {
                    playerTerritory.allies ++;
           }   else { // enemy territory
                    playerTerritory.enemies ++;
                }
           }
       }

       // console.log(conn);

       return conn;
   }


   //requires object form whereAreMoreConnectedTerritories
    terrWithMostAlliesAndOneEnemy(territoriesConn: TerritoryArmyStatus[]): OneEnemyTerritory {
       if(territoriesConn === undefined) throw 'territoriesConn is required';

        let terrWithMostAlliesAndOneEnemy: OneEnemyTerritory = {territory: this.territories[0], allies: 0};

        for (let connectedTerritory of territoriesConn) {
            if(connectedTerritory && connectedTerritory.enemies > 0) {
                if(terrWithMostAlliesAndOneEnemy.allies < connectedTerritory.allies) {
                    terrWithMostAlliesAndOneEnemy.allies = connectedTerritory.allies;
                    terrWithMostAlliesAndOneEnemy.territory = this.territories.find(t=>t.name === connectedTerritory.territory);
                }

            }
        }

        console.log(terrWithMostAlliesAndOneEnemy);

        return terrWithMostAlliesAndOneEnemy;

    }


    getAllEnemyTerritories(): Territory[] {
        if(this.game === undefined) throw 'game is not set yet'

        let terr: Territory[] = [];
       let p: Player;
        for (p of this.game.players) {
            if(p === this) continue;
            terr = terr.concat(p.territories);
        }

        return terr;
    }

    removeTerritory(territory: CountryName) {
        this.territories = this.territories.filter(t => t.name !== territory)
    }

    addTerritory(territory: Territory) {
       this.territories.push(territory)
    }

    isPlayerOutOfGame() {
       return this.territories.length === 0
    }

    putSoldersInTerritory(territory: CountryName, soldersNumber: number) {
       const territoryToPut = this.getTerritory(territory)
        if(!territoryToPut) throw `${territory} does not belong to player ${this.name}`

        territoryToPut.soldiers += soldersNumber
    }

    getTerritory(territory: CountryName) {
       return this.territories.find(t => t.name === territory)
    }

}


export type PlayerType = "human" | "computer"

export type TerritoryArmyStatus = {territory: CountryName, allies: number, enemies: number}


export type OneEnemyTerritory = {
    territory?: Territory, allies: number
}


