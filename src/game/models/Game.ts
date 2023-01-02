import {Player} from "./Player";
import {Card, cards} from "../constants/cards";
import {PlayerColors, rules, Rules, SettingsInterface} from "../constants/settingsConfig";
import {ContinentName} from "../constants/continents";
import {generateEmptyContinentsWithNumber, shuffleArray} from "../functions/smallUtils";
import {CountryName} from "../constants/CountryName";
import {attack} from "../functions/attack";
import {Territory} from "../constants/Territory";

export class Game {

    players: Player[] = [];
    playerTurn: Player;
    soldierToPut: number = 0;
    colors: (keyof typeof PlayerColors)[];
    winner: Player | undefined = undefined;
    cards: Card[];

    currentState: gameState;

    // newGame cardsDistributed soldersDistributed
    // newTurn finishedNewTurnSoldiers attackTo attackFinished moveSoldiersTo finishTurn

    //cards[]
    private settings: SettingsInterface;
    private rules: Rules
    UpdateTable: () => void

    constructor(players: Player[], settings: SettingsInterface, rules: Rules, UpdateTable: () => void) {
        this.players = players;
        this.settings = settings;
        this.rules = rules;
        this.colors = Object.keys(PlayerColors).filter((v) => isNaN(Number(v))) as (keyof typeof PlayerColors)[]
        this.UpdateTable = UpdateTable;

        if(players.length > 6) {
            throw 'max number of players is 6';
        }

        for (let i = 0; i< this.players.length; i++) {
            this.players[i].color = this.colors[i];
        }

        this.playerTurn = this.players[0];
        this.calculateSoldiersToPut();

        this.cards =  [...cards];
        this.shuffleCards()

        this.currentState = gameState.newTurn;
    }

    shufflePlayers() {
        shuffleArray(this.players)
    }

    shuffleCards() {
        shuffleArray(this.cards)
    }

    nextPlayerTurn() {
        if(this.playerTurn.hasOccupiedTerritory) {
            this.currentPLayerDrawOneCard();
            this.playerTurn.hasOccupiedTerritory = false; //reset
        }

        let position = this.players.indexOf(this.playerTurn);

        if(position === this.players.length - 1) { //if it the last player in array
            this.playerTurn = this.players[0];
        } else if(position < this.players.length - 1) {
            this.playerTurn = this.players[position+1];
        }

        this.currentState = gameState.newTurn;
        this.playerTurn.isPlaying = false;
        this.calculateSoldiersToPut();
        this.UpdateTable();
    }

    hasCurrentPlayerWon() {
        if(this.settings.TerritoriesToWin.value === 'all') {
            let Won = true;

            for (let pl of this.players) {
                if(pl === this.playerTurn) continue;
                if(pl.territories.length > 0) Won = false;
            }

            return Won;
        } else return this.playerTurn.territories.length >= this.settings.TerritoriesToWin.value;
    }

    currentPLayerDrawOneCard() {
        if(this.cards.length === 0) {
            this.cards = [...cards];
            this.shuffleCards()
        }

        // @ts-ignore
        let card: Card = this.cards.pop();
        this.playerTurn.cards.push(card);
    }

    assignCardsToPlayers() {
        let playerTurnToTakeCard = 0;
        let th: Game = this;
        assignCardToPlayerRecursive();

        function  assignCardToPlayerRecursive () {
            if(th.cards.length === 0) throw "Game don't have any card to distribute."

            // @ts-ignore
            th.players[playerTurnToTakeCard].cards.push(th.cards.pop());

            //if player turn goes to the last element of players array restart it to 0
            if(playerTurnToTakeCard === th.players.length -1 ) {
                playerTurnToTakeCard = 0;
            } else { //just increase it
                playerTurnToTakeCard++;
            }
          //  if there are enough cards assign again
          if(th.cards.length>0){
              assignCardToPlayerRecursive();
          }
        }
        // this.UpdateTable();
    }

    putSoldiersInFieldFromPlayersHand() {
        for (let p of this.players) {
            p.territories = p.cards.map(c => ({
                name: c.name,
                player: p,
                soldiers: c.stars,
                borders: c.borders,
                continent: c.continent
            }));

            p.cards = [];
        }

        //put cards in game ready to draw and shuffle
        this.cards = [...cards]
        this.shuffleCards()

        // this.UpdateTable();
    }

    calculateSoldiersToPut() {
        let soldiersFromTerritories = 0;

        if(this.playerTurn.territories.length > 11) {
        soldiersFromTerritories = Math.ceil((this.playerTurn.territories.length - 11) / 3);
        console.log(`Player gets ${soldiersFromTerritories} from ${this.playerTurn.territories.length} territories owned.`)
        }

        //check if someone owns a continent
        let playerTerrByContinent = generateEmptyContinentsWithNumber();
        let soldiersFromContinent = generateEmptyContinentsWithNumber();
        let totalSoldiersFromContinents = 0;

        let r = this.rules.SoldiersFromContinents
        let continent: keyof typeof r
        for (continent in this.rules.SoldiersFromContinents) {
           playerTerrByContinent[continent] = 0;//{europe: 0, asia: 0,...etc};
           soldiersFromContinent[continent] = 0; //{europe: 0, asia: 0,...etc};
       }

       for (let t of this.playerTurn.territories) {
           playerTerrByContinent[t.continent] +=1; //{europe: 3, asia: 2,...etc};
       }

        for (continent in this.rules.SoldiersFromContinents) {
            //if europe.territories = 7 and player has 7 territories from europe
            if(rules.SoldiersFromContinents[continent].territories === playerTerrByContinent[continent]) {
                soldiersFromContinent[continent] = this.rules.SoldiersFromContinents[continent].soldiers; //{europe: 5, asia: 0,...etc};
                totalSoldiersFromContinents += this.rules.SoldiersFromContinents[continent].soldiers;
                console.log(`Player ${this.playerTurn.name} gets ${soldiersFromContinent[continent]} from ${continent}`)

            }
        }

        this.soldierToPut = 3 + totalSoldiersFromContinents + soldiersFromTerritories;
    }

    /*
    * If yes, remove from players
    * */
    isPlayerOutOfGame(playerIndex: number) {
        if(this.players[playerIndex].territories.length === 0) {
            let removedPlayer = this.players[playerIndex];
           this.players.splice(playerIndex, 1);
            this.UpdateTable();

           return removedPlayer;
        } else return false;
    }

    doesTerritoryBelongToPlayer(terr: CountryName, player: Player = this.playerTurn) {
        return !!player.territories.find(e => e.name === terr);
    }

    canPlayerAttackFromTo(from: CountryName, to: CountryName, player: Player = this.playerTurn) {
        if (from === to) return {status: AttackFromToCases.YOUR_OWN_TERRITORY,}

        let fromTerritory: Territory | undefined = undefined;

        for (const t of player.territories) {
            // territory to attack to belong to player and so player can not attack its own territory
            if(t.name === to) {
                return {status: AttackFromToCases.YOUR_OWN_TERRITORY,}
            }
            // territory to attack from belongs to player
            if(t.name === from) {
                fromTerritory = t
            }
        }

        if(!fromTerritory) return {status: AttackFromToCases.NO_OWNERSHIP}

        const toTerritory = fromTerritory.borders.find(t => t === to);
        if(!toTerritory) return {status: AttackFromToCases.NO_BORDER}

        return {status: AttackFromToCases.YES, fromTerritory, toTerritory}
    }

    performAnAttack(from: CountryName, to: CountryName, player: Player = this.playerTurn) {
        const {status, fromTerritory, toTerritory} = this.canPlayerAttackFromTo(from, to, player)

        console.log(status)
        if(status !== AttackFromToCases.YES) return status;
        if(!fromTerritory) throw 'fromTerritory must not come undefined'

        if(fromTerritory.soldiers > 3) {
            // TODO work in attack
            attack(this, from, to,3);
        } else if(fromTerritory.soldiers === 3){
            attack(this, from, to,2);
        } else if(fromTerritory.soldiers === 2){
            attack(this, from, to,1);
        } else if(fromTerritory.soldiers === 1){
            throw `Can not attack from here. Here are ${fromTerritory.soldiers} soldiers.`
        } else throw  `${fromTerritory.soldiers} soldiers.`;

    }



}

export enum gameState {
    newGame='New Game',
    cardsDistributed='Cards Distributed',
    soldersDistributed='Solders Distributed',
    newTurn='New Turn',
    finishedNewTurnSoldiers='Finished New Turn Soldiers',
    attackFrom='Attack From',
    attackTo='Attack To',
    attackFinished='Attack Finished',
    moveSoldiersFrom='Move Soldiers From',
    moveSoldiersTo='Move Soldiers To',
    finishTurn='Finish Turn',
}

export enum AttackFromToCases {
    YOUR_OWN_TERRITORY = 'Can not attack your territory',
    NO_OWNERSHIP = 'Can not attack your territory',
    NO_BORDER = 'Territory not in border',
    YES = 'Yes'
}