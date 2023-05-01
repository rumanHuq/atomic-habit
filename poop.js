const fs = require("fs");

const data = require("./calories_db.json");

const arr = data.flatMap((item) => {
	const { group, ...food } = item;
	const poop = Object.entries(food).map(([name, value]) => ({ group, name, ...value }));
	return poop;
});

fs.writeFileSync("calories.json", JSON.stringify(arr, null, 2), { encoding: "utf-8" });
