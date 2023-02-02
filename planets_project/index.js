const { parse } = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];

// function that checks if a planet found can be habitable by humans based on certain criteria
// here we are using the disposition, how much sun light the planet gets, and its size compared to Earth
const isHabitablePlanet = (planet) => {
	return (
		planet["koi_disposition"] === "CONFIRMED" &&
		planet["koi_insol"] > 0.36 &&
		planet["koi_insol"] < 1.11 &&
		planet["koi_prad"] < 1.6
	);
};

// reads raw csv data and returns Buffer object, which is just bits and bytes
// pipe with the parse function, parses the raw data and returns it as readable objects
fs.createReadStream("kepler_data.csv")
	.pipe(
		parse({
			comment: "#",
			columns: true,
		})
	)
	.on("data", (data) => {
		if (isHabitablePlanet(data)) {
			habitablePlanets.push(data);
		}
	})
	.on("error", (err) => {
		console.error(err);
	})
	.on("end", () => {
		console.log(
			habitablePlanets.map((planet) => {
				return planet["kepler_name"];
			})
		);
		console.log(`${habitablePlanets.length} habitable planets found!`);
	});
