import {Player} from "./Player";
import {Card, cards} from "../constants/cards";
import {PlayerColors, rules, Rules, SettingsInterface} from "../constants/settingsConfig";
import {ContinentName} from "../constants/continents";
import {generateEmptyContinentsWithNumber, shuffleArray} from "../functions/smallUtils";
import {CountryName} from "../constants/CountryName";
import {attack, searchInBorders} from "../functions/attack";
import {Territory} from "../constants/Territory";
import {canPlayerAttackFromThisTerritory, isInBorder} from "../functions/utils";

export class Game {

    players: Player[] = [];
    playerTurn: Player;
    soldiersToPut: number = 0;
    private initialSoldersToPut: number = 0;
    colors: (keyof typeof PlayerColors)[];
    winner: Player | undefined = undefined;
    cards: Card[];

    private currentState: gameState;

    private settings: SettingsInterface;
    private rules: Rules

    constructor(players: Player[], settings: SettingsInterface, rules: Rules) {
        this.players = players;
        this.settings = settings;
        this.rules = rules;
        this.colors = Object.keys(PlayerColors).filter((v) => isNaN(Number(v))) as (keyof typeof PlayerColors)[]

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

        this.currentState = gameState.newGame;
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
        this.nextGamePhase()

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

        this.nextGamePhase()
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

        this.soldiersToPut = 13 + totalSoldiersFromContinents + soldiersFromTerritories;
        this.initialSoldersToPut = this.soldiersToPut
    }

    putAvailableSoldiers(territory: CountryName, soldersNumber: number) {
        if(soldersNumber > this.soldiersToPut) throw `Can not put more than ${soldersNumber} solders.`
        this.playerTurn.putSoldersInTerritory(territory, soldersNumber)
        this.soldiersToPut -= soldersNumber

        if (this.soldiersToPut === 0) this.nextGamePhase()
    }

    get getInitialSoldersToPut() {
        return this.initialSoldersToPut
    }

    /*
    * If yes, remove from players
    * */
    isPlayerOutOfGame(playerIndex: number) {
        if(this.players[playerIndex].territories.length === 0) {
            let removedPlayer = this.players[playerIndex];
           this.players.splice(playerIndex, 1);

           return removedPlayer;
        } else return false;
    }

    doesTerritoryBelongToPlayer(terr: CountryName, player: Player = this.playerTurn) {
        return !!player.territories.find(e => e.name === terr);
    }

    private canPlayerAttackFromTo(from: CountryName, to: CountryName, player: Player = this.playerTurn) {
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

        const toTerritory = isInBorder(fromTerritory, to);
        if(!toTerritory) return {status: AttackFromToCases.NO_BORDER}

        return {status: AttackFromToCases.YES, fromTerritory}
    }

    canStillPlayerAttackThisTurn(player: Player = this.playerTurn) {
        for (const territory of player.territories) {
            if(canPlayerAttackFromThisTerritory(player, territory.name)) return true
        }
        return false
    }

    performAnAttack(from: CountryName, to: CountryName, player: Player = this.playerTurn) {
        const {status, fromTerritory} = this.canPlayerAttackFromTo(from, to, player)

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

    private canPlayerMoveFromTo(from: CountryName, to: CountryName, player: Player = this.playerTurn) {
        if(from === to) return {status: MoveFromToCases.SAME_TERRITORY}

        const fromTerritory = player.getTerritory(from), toTerritory = player.getTerritory(to);

        if(!fromTerritory) return {status: MoveFromToCases.NO_OWNERSHIP}
        if(!toTerritory) return {status: MoveFromToCases.NO_OWNERSHIP}

        const areTerritoriesConnected = searchInBorders(fromTerritory, to, player.territories, [from])

        if(!areTerritoriesConnected) return {status: MoveFromToCases.NO_BORDER_LINK}

        return {status: MoveFromToCases.YES, fromTerritory, toTerritory}
    }

    performAMove(from: CountryName, to: CountryName, soldersAmount: number, player: Player = this.playerTurn) {
        if(soldersAmount<=0) throw `Player wants to move ${soldersAmount} solders. It must be at least 1 solder.`
        const {status, fromTerritory, toTerritory} = this.canPlayerMoveFromTo(from, to, player)

        console.log(status)
        if(status !== MoveFromToCases.YES) return status;
        if(!fromTerritory || !toTerritory) throw 'fromTerritory and toTerritory must not come undefined'

        fromTerritory.soldiers -= soldersAmount
        toTerritory.soldiers += soldersAmount

        this.finishMovePhase()
    }

    get getState() {
        return this.currentState
    }

    private changeGameStatus(action: 'next'| 'attack' | 'attackFinished' | 'move'| 'moveFinished' | 'previous' = "next") {
        switch (this.currentState) {
            case gameState.newGame:
                this.currentState = gameState.cardsDistributed
                break;
            case gameState.cardsDistributed:
                this.currentState = gameState.soldersDistributed
                break;
            case gameState.soldersDistributed:
                this.currentState = gameState.newTurn
                break;

            case gameState.newTurn:
                // even when user put multiple times solders in territories we keep staying in newTurn as it doesn't change anything
                this.currentState = gameState.finishedNewTurnSoldiers
                break;
            case gameState.finishedNewTurnSoldiers:
                switch (action) {
                    case "attack":
                        this.currentState = gameState.firstAttackFrom
                        break;
                    case "move":
                        this.currentState = gameState.moveSoldiersFromNoAttack
                        break;
                    default:
                        this.currentState = gameState.turnFinished
                        break;
                }
                break;
            case gameState.firstAttackFrom:
                switch (action) {
                    case "next": //if player can attack again or move
                        this.currentState = gameState.firstAttackFinished
                        break;
                    case "attackFinished": //if player does not have resources to attack anymore
                        this.currentState = gameState.attackFinished
                        break;
                    case "previous": // if attack is canceled
                        this.currentState = gameState.finishedNewTurnSoldiers
                        break;
                    default: throw "gameState.firstAttackFrom: State must be next or cancel"
                }
                break;
            case gameState.firstAttackFinished:
                switch (action) {
                    case "attack": // attack again
                        this.currentState = gameState.attackFrom
                        break;
                    case "move": // move solders
                        this.currentState = gameState.moveSoldiersFromAfterAttack
                        break;
                    default:
                        this.currentState = gameState.turnFinished
                        break;
                }
                break;
            case gameState.attackFrom:
                switch (action) {
                    case "next": //if player does not have resources to attack anymore or if attack is canceled
                        this.currentState = gameState.attackFinished
                        break;
                    case "previous": // if attack will continue or if attack is canceled
                        this.currentState = gameState.firstAttackFinished
                        break;
                    default: throw "gameState.attackFrom: State must be next or cancel"
                }
                break;
            case gameState.attackFinished:
                switch (action) {
                    case "move":
                        this.currentState = gameState.moveSoldiersFromAfterAttack
                        break;
                    default:
                        this.currentState = gameState.turnFinished
                        break;
                }
                break;
            case gameState.moveSoldiersFromAfterAttack:
                switch (action) {
                    case "previous": // if we want to cancel moving of players and want to continue attacking
                        this.currentState = gameState.attackFinished
                        break;
                    case "moveFinished": // if move is canceled in the beginning of turn
                        this.currentState = gameState.attackFinished
                        break;
                    default:
                        this.currentState = gameState.turnFinished
                        break;
                }
                break;
            case gameState.moveSoldiersFromNoAttack:
                switch (action) {
                    case "previous": // if move is canceled in the beginning of turn
                        this.currentState = gameState.finishedNewTurnSoldiers
                        break;
                    case "moveFinished": // if move is canceled in the beginning of turn
                        this.currentState = gameState.attackFinished
                        break;
                    default:
                        this.currentState = gameState.turnFinished
                        break;
                }
                break;
            case gameState.turnFinished:
                this.currentState = gameState.newTurn
                break;
        }
    }

     nextGamePhase() {
        this.changeGameStatus()
    }

    previousGamePhase() {
        this.changeGameStatus("previous")
    }

    attackFromPhase() {
        this.changeGameStatus("attack")
    }
    finishAttackImmediatelyPhase() {
        this.changeGameStatus("attackFinished")
    }
    finishMovePhase() {
        this.changeGameStatus("moveFinished")
    }
    moveFromPhase() {
        this.changeGameStatus("move")
    }


}

export enum gameState {
    newGame='New Game',
    cardsDistributed='Cards Distributed',
    soldersDistributed='Solders Distributed',
    newTurn='New Turn',
    finishedNewTurnSoldiers='Finished New Turn Soldiers',
    firstAttackFrom='First Attack From',
    firstAttackFinished='First Attack Finished',
    attackFrom='Attack From',
    attackFinished='Attack Finished',
    moveSoldiersFromAfterAttack = 'Move Soldiers From After Attack',
    moveSoldiersFromNoAttack = 'Move Soldiers From No Attack',
    turnFinished='Turn Finished',
}

export enum AttackFromToCases {
    YOUR_OWN_TERRITORY = 'Can not attack your territory',
    NO_OWNERSHIP = 'Not your territory',
    NO_BORDER = 'Territory not in border',
    YES = 'Yes'
}
export enum MoveFromToCases {
    SAME_TERRITORY = 'Can not move in same territory',
    NO_OWNERSHIP = 'Not your territory',
    NO_BORDER_LINK = 'Territory not connected',
    YES = 'Yes'
}