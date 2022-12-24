import {ContinentName} from "./continents";
import {CountryName} from "./CountryName";

export interface Point {
    x: number, y: number
}

export interface Surface {
    type: 'rect' | 'ellipse'
    x: number
    y: number
    w: number
    h: number
}

export type ContinentCoordinates = {
    [K in ContinentName]?: {
        [index in CountryName]?: Surface[]
    };
}

const startingPoint: Point = {x: 20,y: 60};

const x = startingPoint.x, y= startingPoint.y;

/*Coordinates are relative to starting point*/
export const continentsCoordinates: ContinentCoordinates = {
    "North-America": {
        "alaska": [
            {type: 'rect', x: x, y: y, w: 70, h: 80}
        ],
        "northwest-territory": [
            {type: 'rect', x: x + 70, y: y, w: 170, h: 70}
        ],
        "greenland": [
            {type: 'ellipse', x: x + 260, y: y - 50, w: 140, h: 70},
            {type: 'rect', x: x + 310, y: y + 20, w: 50, h: 65}
        ],
        "alberta": [
            {type: 'rect', x: 110, y: 134, w: 76, h: 60},
        ],
        "ontario": [
            {type: 'rect', x: x + 175, y: y + 75, w: 30, h: 67},
            {type: 'rect', x: x + 196, y: y + 96, w: 38, h: 52},
        ],
        "quebec": [
            {type: 'rect', x: 274, y: 131, w: 38, h: 94},
            {type: 'rect', x: 312, y: 155, w: 27, h: 63},
        ],
        "western-united-states": [
            {type: 'rect', x: 119, y: 211, w: 89, h: 51},
            {type: 'rect', x: 112, y: 263, w: 69, h: 28},

        ],
        "eastern-united-states": [
            {type: 'rect', x: 220, y: 234, w: 73, h: 79},
            {type: 'ellipse', x: 183, y: 267, w: 41, h: 47},
        ],
        "central-america": [
            {type: 'rect', x: 118, y: 302, w: 50, h: 50},
            {type: 'rect', x: 167, y: 335, w: 37, h: 61},
        ],
    },
    "South-America": {
        "venezuela": [
            {type: 'rect', x: 211, y: 369, w: 96, h: 40},
            {type: 'ellipse', x: 200, y: 400, w: 40, h: 27},
        ],
        "brazil": [
            {type: 'rect', x: 293, y: 420, w: 91, h: 85},
            {type: 'rect', x: 304, y: 500, w: 44, h: 70},
            {type: 'rect', x: 236, y: 426, w: 60, h: 44},

        ],
        "peru": [
            {type: 'rect', x: 192, y: 462, w: 35, h: 40},
            {type: 'rect', x: 180, y: 423, w: 35, h: 39},
            {type: 'rect', x: 230, y: 477, w: 48, h: 45},
        ],
        "argentina": [
            {type: 'rect', x: 230, y: 526, w: 47, h: 170},
            {type: 'rect', x: 272, y: 544, w: 27, h: 70},
        ],
    },

    // "Europe": {
    //     "iceland": [
    //         {type: 'rect', x: x, y: y, w: 70, h: 80}
    //     ],
    //     "great-britain": [
    //         {type: 'rect', x: x + 70, y: y, w: 170, h: 70}
    //     ],
    //     "scandinavia": [
    //         {type: 'ellipse', x: x + 260, y: y - 50, w: 140, h: 70},
    //         {type: 'rect', x: x + 310, y: y + 20, w: 50, h: 65}
    //     ],
    //     "ukraine": [
    //         {type: 'rect', x: 110, y: 134, w: 76, h: 60},
    //     ],
    //     "northern-europe": [
    //         {type: 'rect', x: x + 175, y: y + 75, w: 30, h: 67},
    //         {type: 'rect', x: x + 196, y: y + 96, w: 38, h: 52},
    //     ],
    //     "southern-europe": [
    //         {type: 'rect', x: 274, y: 131, w: 38, h: 94},
    //         {type: 'rect', x: 312, y: 155, w: 27, h: 63},
    //     ],
    //     "western-europe": [
    //         {type: 'rect', x: 119, y: 211, w: 89, h: 51},
    //         {type: 'rect', x: 112, y: 263, w: 69, h: 28},
    //
    //     ],
    // }


}