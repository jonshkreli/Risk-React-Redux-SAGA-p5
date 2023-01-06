import {Territory} from "../constants/Territory";
import {cards} from "../constants/cards";
import {searchInBorders} from "./attack";

describe('Testing bearchInborders', function () {
    it('should find border', function () {

        const alaska = cards.find(c => c.name === 'alaska')
        const nt = cards.find(c => c.name === 'northwest-territory')
        const greenland = cards.find(c => c.name === 'greenland')

        if(!alaska || !nt || !greenland) return

        const playerTerritories: Territory[] = [alaska, nt, greenland].map(c => ({
            name: c.name,
            player: undefined,
            soldiers: c.stars,
            borders: c.borders,
            continent: c.continent
        }));

        let res = searchInBorders(playerTerritories[0], 'greenland', playerTerritories, ['alaska'])

        console.log(playerTerritories, res)

    });
    it('should find border 2', function () {

        const playerTerritories: Territory[] = cards.slice(0,9).map(c => ({
            name: c.name,
            player: undefined,
            soldiers: c.stars,
            borders: c.borders,
            continent: c.continent
        }));

        console.log(playerTerritories)

        let res = searchInBorders(playerTerritories[0], 'eastern-united-states', playerTerritories, ['alaska'])
        console.log(res)

    });
});