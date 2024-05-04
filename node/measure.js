const fs = require('fs');
const constraints = require('../store/constraints.json');

const stations_data = new Map();

function handleLine(line) {
    const [station, _sample] = line.split(';');
    const sample = +_sample;
    const station_data = stations_data.get(station);
    if (!station_data) {
        stations_data.set(station, {
            min: sample,
            max: sample,
            sum: sample,
            count: 1,
            mean: sample,
        });
        return;
    }
    station_data.min = Math.min(station_data.min, sample);
    station_data.max = Math.max(station_data.max, sample);
    station_data.sum += sample;
    station_data.count++;
    station_data.mean = station_data.sum / station_data.count;
    stations_data.set(station, station_data);
}

(async () => {
    const file = await fs.promises.open('../samples.txt', 'r');
    let i = 0;
    for await (const line of file.readLines()) {
        handleLine(line);
        i++;
        console.clear();
        console.log(`progress: ${((i + 1) / constraints.lines_count * 100).toFixed(2)}%`);
    }
    console.log(stations_data);
})();