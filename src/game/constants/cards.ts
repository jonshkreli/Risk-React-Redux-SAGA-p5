import {CountryName} from "./CountryName";
import {ContinentName} from "./continents";

export type Card = {
    readonly name: CountryName,
    readonly continent: ContinentName,
    readonly stars: 1 | 2,
    readonly borders: CountryName[]
}

export const cards: Card[] = [
    {name: "alaska", continent: "North-America", stars: 1, borders: ["northwest-territory", "alberta"]},
    {name: "northwest-territory", continent: "North-America", stars: 1, borders: ["alaska", "alberta", "ontario", "greenland"]},
    {name: "alberta", continent: "North-America", stars: 1, borders: ["northwest-territory", "alaska", "western-united-states", "ontario"]},
    {name: "ontario", continent: "North-America", stars: 1, borders: ["northwest-territory", "alberta", "quebec", "greenland", "western-united-states", "eastern-united-states"]},
    {name: "quebec", continent: "North-America", stars: 1, borders: ["eastern-united-states", "greenland", "ontario"]},
    {name: "greenland", continent: "North-America", stars: 1, borders: ["northwest-territory", "ontario", "quebec", "iceland"]},
    {name: "western-united-states", continent: "North-America", stars: 1, borders: ["eastern-united-states", "alberta", "ontario", "central-america"]},
    {name: "eastern-united-states", continent: "North-America", stars: 1, borders: ["western-united-states", "quebec", "ontario", "central-america"]},
    {name: "central-america", continent: "North-America", stars: 1, borders: ["western-united-states", "eastern-united-states", "venezuela"]},

    {name: "venezuela", continent: "South-America", stars: 1, borders: ["peru", "brazil", "central-america"]},
    {name: "brazil", continent: "South-America", stars: 1, borders: ["peru", "venezuela", "argentina", "north-africa"]},
    {name: "peru", continent: "South-America", stars: 1, borders: ["venezuela", "argentina", "brazil"]},
    {name: "argentina", continent: "South-America", stars: 1, borders: ["peru", "brazil"]},

    // {name: "iceland", continent: "Europe", stars: 1,borders: ["greenland", "great-britain", "scandinavia"]},
    // {name: "great-britain", continent: "Europe", stars: 1,borders: ["iceland", "northern-europe", "scandinavia", "western-europe"]},
    // {name: "scandinavia", continent: "Europe", stars: 1,borders: ["iceland", "great-britain", "northern-europe", "ukraine"]},
    // {name: "ukraine", continent: "Europe", stars: 1,borders: ["southern-europe", "northern-europe", "scandinavia", "ural", "afghanistan", "middle-east"]},
    // {name: "northern-europe", continent: "Europe", stars: 1,borders: ["ukraine", "great-britain", "scandinavia", "southern-europe", "western-europe"]},
    // {name: "southern-europe", continent: "Europe", stars: 1,borders: ["northern-europe", "western-europe", "ukraine", "egypt", "north-africa", "middle-east"]},
    // {name: "western-europe", continent: "Europe", stars: 1,borders: ["north-africa", "great-britain", "southern-europe", "northern-europe"]},
    //
    // {name: "north-africa", continent: "Africa", stars: 1},
    // {name: "egypt", continent: "Africa", stars: 1},
    // {name: "east-africa", continent: "Africa", stars: 1},
    // {name: "congo", continent: "Africa", stars: 1},
    // {name: "south-africa", continent: "Africa", stars: 1},
    // {name: "madagascar", continent: "Africa", stars: 1},
    //
    // {name: "ural", continent: "Asia", stars: 1},
    // {name: "siberia", continent: "Asia", stars: 1},
    // {name: "yakutsk", continent: "Asia", stars: 1},
    // {name: "kamchatka", continent: "Asia", stars: 1},
    // {name: "irkutsk", continent: "Asia", stars: 1},
    // {name: "mongolia", continent: "Asia", stars: 1},
    // {name: "japan", continent: "Asia", stars: 1},
    // {name: "afghanistan", continent: "Asia", stars: 1},
    // {name: "china", continent: "Asia", stars: 1},
    // {name: "middle-east", continent: "Asia", stars: 1},
    // {name: "india", continent: "Asia", stars: 1},
    // {name: "siam", continent: "Asia", stars: 1},
    //
    // {name: "indonesia", continent: "Australia", stars: 1},
    // {name: "new-guinea", continent: "Australia", stars: 1},
    // {name: "western-australia", continent: "Australia", stars: 1},
    // {name: "eastern-australia", continent: "Australia", stars: 1},
]