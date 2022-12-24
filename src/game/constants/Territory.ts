import {CountryName} from "./CountryName";
import {ContinentName} from "./continents";
import {Player} from "../models/Player";

export interface Territory {
    readonly name: CountryName,
    readonly continent: ContinentName,
    readonly borders: CountryName[]
    soldiers: number,
    player?: Player
}