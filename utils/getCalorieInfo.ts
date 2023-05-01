import caloriesDb from "@/calories_db.json";

export function getCalorieInfo({ textValue, numberValue }: { textValue: string; numberValue: number }) {
	const found = caloriesDb.find((i) => i.name === textValue);
	if (!found) return 0;
	const quantity = (found.serving.match(/[0-9]+\s(g|ml)/) ?? [])[0]?.split(" ")[0];
	if (!quantity) return 0;
	const gram = parseInt(quantity, 10);
	const calories = parseInt(found.calories.split(" ")[0], 10);
	const calorie = (calories * numberValue) / gram;
	return calorie;
}
