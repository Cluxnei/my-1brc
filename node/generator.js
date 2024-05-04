const fs = require('fs');

const states = require('../store/states.json');
const state_cities = require('../store/state_cities.json');
const constraints = require('../store/constraints.json');

function randomIndex(max) {
    return Math.floor(Math.random() * max);
}

function getRandomState() {
    return states[randomIndex(states.length)];
}

function getRandomCity(state) {
    return state_cities[state][randomIndex(state_cities[state].length)];
}

function generateStationName() {
    return getRandomCity(getRandomState());
}

function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloatBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function generateSampleLine() {
    const station = station_names[randomIndex(station_names.length)];
    const sample = randomFloatBetween(constraints.samples.min, constraints.samples.max);
    return `${station};${sample.toFixed(2)}\n`;
}

const station_count = randomIntBetween(constraints.stations.min, constraints.stations.max);
const station_names = [];

console.log(`generation ${station_count} station names...`);

for (let i = 0; i < station_count; i++) {
    station_names.push(generateStationName());
}

console.log('erasing previous samples...');

fs.writeFileSync('../samples.txt', '');

console.log(`generating ${constraints.lines_count} samples...`);

let generated_samples = 0;

while (generated_samples < constraints.lines_count) {
    let samples_str = "";
    for (let i = 0; i < constraints.engine.samples_batch_count; i++) {
        samples_str += generateSampleLine();
    }
    fs.appendFileSync('../samples.txt', samples_str);
    generated_samples += constraints.engine.samples_batch_count;
    console.clear();
    console.log(`progress: ${((generated_samples + 1) / constraints.lines_count * 100).toFixed(2)}%`);
}

console.log('done!');
