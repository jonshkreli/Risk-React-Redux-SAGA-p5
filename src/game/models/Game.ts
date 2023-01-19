import {Player} from "./Player";
import {Card, cards} from "../constants/cards";
import {DiceNumber, PlayerColors, rules, Rules, SettingsInterface} from "../constants/settingsConfig";
import {generateEmptyContinentsWithNumber, shuffleArray} from "../functions/smallUtils";
import {CountryName} from "../constants/CountryName";
import {attack, searchInBorders} from "../functions/attack";
import {Territory} from "../constants/Territory";
import {canPlayerAttackFromThisTerritory, isInBorder} from "../functions/utils";
import {GamePhases} from "./GamePhases";
import {GameActions} from "./GameActions";

export class Game implements GamePhases, GameActions {
    players: Player[] = [];
    playerTurn: Player;
    private _soldiersToPut: number = 0;
    private initialSoldersToPut: number = 0;
    colors: (keyof typeof PlayerColors)[];
    winner: Player | undefined = undefined;
    cards: Card[];
    private _playerWantToMoveSolders: boolean = false;

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

        this.currentState = gameState.newGame;

        this.playerTurn = this.players[0];
        this.setSoldiersToPut();

        this.cards =  [...cards];
        this.shuffleCards()
    }

    // ==== getters setters ====
    get playerWantToMoveSolders(): boolean {
        return this._playerWantToMoveSolders;
    }

    set playerWantToMoveSolders(value: boolean) {
        switch (this.currentState) {
            case gameState.firstAttackFrom:
            case gameState.attackFrom:
            case gameState.moveSoldiersFrom:
            case gameState.firstMoveSoldersFrom:
                this._playerWantToMoveSolders = value;
                break;
            default: throw 'Can change state only when move or attack is finished'
        }
    }

    get getInitialSoldersToPut() {
        return this.initialSoldersToPut
    }

    get soldiersToPut(): number {
        return this._soldiersToPut;
    }

    private set soldiersToPut(value: number) {
        this.calculateSoldersTuPutStatusChecker()
        this._soldiersToPut = value;
    }

    // ==== actions ====

    private currentPLayerDrawOneCard() {
        if(this.getState !== gameState.turnFinished) throw "Can not draw card when turn is not finished."

        if(this.cards.length === 0) {
            this.cards = [...cards];
            this.shuffleCards()
        }

        // @ts-ignore
        let card: Card = this.cards.pop();
        this.playerTurn.cards.push(card);
    }

    assignCardsToPlayers() {
        if(this.getState !== gameState.newGame) throw `Can not assign cards in ${this.getState} state. This can happen only in ${gameState.newGame}`

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
        if(this.getState !== gameState.cardsDistributed) throw `Can not put solders in ${this.getState} state. This can happen only in ${gameState.newGame}`

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

    private setSoldiersToPut() {
        this.calculateSoldersTuPutStatusChecker()

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
        if(this.getState !== gameState.newTurn) throw `Game state must be ${gameState.newTurn}`

        if(soldersNumber > this.soldiersToPut) throw `Can not put more than ${soldersNumber} solders.`
        this.playerTurn.putSoldersInTerritory(territory, soldersNumber)
        this.soldiersToPut -= soldersNumber

        if (this.soldiersToPut === 0) this.nextGamePhase()
    }

    performAnAttack(from: CountryName, to: CountryName, attackingDices: DiceNumber, attackAgain: boolean, moveAllSoldersAfterAttack: boolean) {
        this.attackStatusChecker()

        const {status, fromTerritory} = Game.canPlayerAttackFromTo(from, to, this.playerTurn)

        // console.log(status, fromTerritory, this.playerTurn)
        if(status !== AttackFromToCases.YES) return status;
        if(!fromTerritory) throw 'fromTerritory must not come undefined'

        let attackingDicesFinal = attackingDices === "max" ? Game.getMaximumDicesAttackerCanUse(fromTerritory.soldiers) : attackingDices

        if(fromTerritory.soldiers - 1 < attackingDicesFinal) throw `Can not attack with ${attackingDices} dices from a territory with ${fromTerritory.soldiers} solders.`

        let attackResult = attack(this, from, to, attackingDicesFinal, attackAgain);

        //make player able to draw a card
        this.playerHasOccupiedTerritory = attackResult

        if(attackResult) {
            this.removeOutOfGamePlayers()

            if(this.hasCurrentPlayerWon()) {
                this.winner = this.playerTurn;
                console.log(this.playerTurn.name + " won!!!");
            }

            if(moveAllSoldersAfterAttack) {
                this.performAMove(from, to,fromTerritory.soldiers-1)
            } else {
                this.playerWantToMoveSolders = true
            }
            return AttackFromToCases.YES
        } else {
            this.changeStatusAfterAttackAfterSoldersMoved()
        }

        // console.log(attackResult, this.playerWantToMoveSolders)

        return AttackFromToCases.COULD_NOT_INVADE_TERRITORY
    }

    performAMove(from: CountryName, to: CountryName, soldersAmount: number) {
        if(soldersAmount<=0) throw `Player wants to move ${soldersAmount} solders. It must be at least 1 solder.`

        const {status, fromTerritory, toTerritory} = Game.canPlayerMoveFromTo(from, to, this.playerTurn)

        // console.log(status)
        if(status !== MoveFromToCases.YES) return status;
        if(!fromTerritory || !toTerritory) throw 'fromTerritory and toTerritory must not come undefined'

        fromTerritory.soldiers -= soldersAmount
        toTerritory.soldiers += soldersAmount

        // console.log(soldersAmount + " moving to " + to);

        switch (this.getState) {
            case gameState.firstAttackFrom:
            case gameState.attackFrom:
                this.changeStatusAfterAttackAfterSoldersMoved()
                break;
            case gameState.moveSoldiersFrom:
            case gameState.firstMoveSoldersFrom:
                this.finishMovePhase()
                break;
            default:
                throw "Move can be performed after an attack or when player knows where to move"
        }

        return status
    }

    private changeStatusAfterAttackAfterSoldersMoved() {
        this.attackStatusChecker()

        const canPlayerAttack = Game.canStillPlayerAttackThisTurn(this.playerTurn)
        this.playerWantToMoveSolders = false
        console.log("game.canStillPlayerAttackThisTurn()", canPlayerAttack)

        switch (this.getState) {
            case gameState.firstAttackFrom:
                if (canPlayerAttack) this.nextGamePhase()
                else this.finishAttackImmediatelyPhase()
                break
            case gameState.attackFrom:
                if (canPlayerAttack) this.previousGamePhase()
                else this.nextGamePhase()
                break
            default:
                throw "When an attack happens game phase must be firstAttackFrom or attackFrom"
        }
    }

    private set playerHasOccupiedTerritory(occupation: boolean) {
        this.attackStatusChecker()
        this.playerTurn.hasOccupiedTerritory = occupation
    }

    private shuffleCards() {
        if(!(this.getState === gameState.newGame || this.getState === gameState.cardsDistributed || this.getState === gameState.turnFinished))
            throw `Game state must be ${gameState.newGame} or ${gameState.cardsDistributed} or ${gameState.turnFinished}`
        shuffleArray(this.cards)
    }

    private removeOutOfGamePlayers() {
        this.players = this.players.filter(p => p.territories.length > 0)
    }

    // utils status checkers for actions

    private attackStatusChecker() {
        if(!(this.getState === gameState.attackFrom || this.getState === gameState.firstAttackFrom)) throw `Game state must be ${gameState.attackFrom} or ${gameState.firstAttackFinished}`
    }

    private calculateSoldersTuPutStatusChecker() {
        if(!(this.getState === gameState.newTurn || this.getState === gameState.newGame)) throw `Game state must be ${gameState.newTurn} or ${gameState.newGame}`
    }

    // ==== status changing ====

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
                        this.currentState = gameState.firstMoveSoldersFrom
                        break;
                    case "next":
                        this.currentState = gameState.turnFinished
                        break;
                    default: throw `${this.currentState}: Action must be attack or move or next`
                }
                break;
            case gameState.firstAttackFrom:
                switch (action) {
                    case "previous": // if attack is canceled
                        this.currentState = gameState.finishedNewTurnSoldiers
                        break;
                    case "attackFinished": //if player does not have resources to attack anymore
                        this.currentState = gameState.attackFinished
                        break;
                    case "next": //if player can attack again or move
                        this.currentState = gameState.firstAttackFinished
                        break;
                    default: throw `${this.currentState}: Action must be previous or attackFinished or next`

                }
                break;
            case gameState.firstAttackFinished:
                switch (action) {
                    case "attack": // attack again
                        this.currentState = gameState.attackFrom
                        break;
                    case "move": // move solders
                        this.currentState = gameState.moveSoldiersFrom
                        break;
                    case "next":
                        this.currentState = gameState.turnFinished
                        break;
                    default: throw `${this.currentState}: Action must be attack or move or next`
                }
                break;
            case gameState.attackFrom:
                switch (action) {
                    case "previous": // if attack will continue or if attack is canceled
                        this.currentState = gameState.firstAttackFinished
                        break;
                    case "next":
                        this.currentState = gameState.attackFinished
                        break;
                    default: throw `${this.currentState}: Action must be previous or next`
                }
                break;
            case gameState.attackFinished:
                switch (action) {
                    case "move":
                        this.currentState = gameState.moveSoldiersFrom
                        break;
                    case "next":
                        this.currentState = gameState.turnFinished
                        break;
                    default: throw `${this.currentState}: Action must be move or next`
                }
                break;
            case gameState.firstMoveSoldersFrom:
                switch (action) {
                    case "previous": // if move is canceled in the beginning of turn
                        this.currentState = gameState.finishedNewTurnSoldiers
                        break;
                    case "moveFinished": // if move is finished
                        this.currentState = gameState.attackFinished
                        break;
                    // case "next":
                    //     this.currentState = gameState.turnFinished
                    //     break;
                    default: throw `${this.currentState}: Action must be previous or moveFinished or next`
                }
                break;
            case gameState.moveSoldiersFrom:
                switch (action) {
                    case "previous": // if we want to cancel moving of players and want to continue attacking
                        this.currentState = gameState.attackFinished
                        break;
                    case "moveFinished": // if move is canceled in the beginning of turn
                        this.currentState = gameState.attackFinished
                        break;
                    // case "next":
                    //     this.currentState = gameState.turnFinished
                    //     break;
                    default: throw `${this.currentState}: Action must be previous or moveFinished or next`
                }
                break;
            case gameState.turnFinished:
                this.currentState = gameState.newTurn
                break;
        }
    }

    nextGamePhase() {
        this.changeGameStatus("next")
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
    moveFromPhase() {
        this.changeGameStatus("move")
    }
    finishMovePhase() {
        this.changeGameStatus("moveFinished")
    }
    nextPlayerTurn() {
        if(this.getState !== gameState.turnFinished) throw "Can not change turn when turn is not finished."

        if(this.playerTurn.hasOccupiedTerritory) {
            this.currentPLayerDrawOneCard();
            this.playerHasOccupiedTerritory = false; //reset
        }

        let position = this.players.indexOf(this.playerTurn);

        if(position === this.players.length - 1) { //if it is the last player in array
            this.playerTurn = this.players[0];
        } else if(position < this.players.length - 1) {
            this.playerTurn = this.players[position+1];
        }

        this.currentState = gameState.newTurn;
        this.playerTurn.isPlaying = false;
        this.setSoldiersToPut();
    }


    // utils. Can be accessed only via actions

    private hasCurrentPlayerWon() {
        if(this.settings.TerritoriesToWin.value === 'all') {
            let Won = true;

            for (let pl of this.players) {
                if(pl === this.playerTurn) continue;
                if(pl.territories.length > 0) Won = false;
            }

            return Won;
        } else return this.playerTurn.territories.length >= this.settings.TerritoriesToWin.value;
    }

    // pure functions
    private static canPlayerMoveFromTo(from: CountryName, to: CountryName, player: Player) {
        if(from === to) return {status: MoveFromToCases.SAME_TERRITORY}

        const fromTerritory = player.getTerritory(from), toTerritory = player.getTerritory(to);

        if(!fromTerritory) return {status: MoveFromToCases.NO_OWNERSHIP}
        if(!toTerritory) return {status: MoveFromToCases.NO_OWNERSHIP}

        const areTerritoriesConnected = searchInBorders(fromTerritory, to, player.territories, [from])

        if(!areTerritoriesConnected) return {status: MoveFromToCases.NO_BORDER_LINK}

        return {status: MoveFromToCases.YES, fromTerritory, toTerritory}
    }

    private static canPlayerAttackFromTo(from: CountryName, to: CountryName, player: Player) {
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

    private static canStillPlayerAttackThisTurn(player: Player) {
        for (const territory of player.territories) {
            if(canPlayerAttackFromThisTerritory(player, territory.name)) return true
        }
        return false
    }

    static getMaximumDicesAttackerCanUse(attackingTerritorySolders: number) {
        if(attackingTerritorySolders <= 1) throw "Can not attack with 1 solder or less."
        switch (attackingTerritorySolders) {
            case 2: return 1
            case 3: return 2
            default: return 3
        }
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
    moveSoldiersFrom = 'Move Soldiers From',
    firstMoveSoldersFrom = 'First Move Soldiers From',
    turnFinished='Turn Finished',
}

export enum AttackFromToCases {
    YOUR_OWN_TERRITORY = 'Can not attack your territory',
    NO_OWNERSHIP = 'Not your territory',
    NO_BORDER = 'Territory not in border',
    COULD_NOT_INVADE_TERRITORY = 'Could not invade territory',
    YES = 'Yes'
}
export enum MoveFromToCases {
    SAME_TERRITORY = 'Can not move in same territory',
    NO_OWNERSHIP = 'Not your territory',
    NO_BORDER_LINK = 'Territory not connected',
    YES = 'Yes'
}