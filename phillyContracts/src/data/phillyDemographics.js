var races = [
    { id: 'white', n: 'White', p: 45.1 },
    { id: 'black', n: 'Black', p: 44.0 },
    { id: 'asian', n: 'Asian', p: 7.4 },
    { id: 'american', n: 'American Indian', p: 0.8 },
    { id: 'other', n: 'Other / Mixed', p: 0 } // set below
];
var pTotal = 0;
var racesById = {};
races.forEach(function(race) {
    racesById[race.id] = race;
    pTotal += race.p;
});

racesById.other.p = 100 - pTotal;

module.exports = {
    races: races,
    racesById: racesById
};
