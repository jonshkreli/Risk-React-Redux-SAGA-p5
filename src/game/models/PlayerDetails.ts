import {PlayerType} from "./Player";
import {PlayerColors} from "../constants/settingsConfig";
import {Territory} from "../constants/Territory";
import {Card} from "../constants/cards";

export class PlayerDetails {
    name: string;
    type: PlayerType;
    protected _color: keyof typeof PlayerColors | undefined = undefined;
    territories: Territory[] = [];
    cards: Card[] = [];


    constructor(name: string, type: PlayerType = 'human') {
        this.name = name;
        this.type = type
    }
}