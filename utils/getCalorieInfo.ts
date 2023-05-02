import caloriesDb from "@/calories_db.json";

export function getCalorieInfo({ textValue, numberValue }: { textValue: string; numberValue: string }) {
	if (!numberValue) return 0;
	const num = parseFloat(numberValue);
	const found = caloriesDb.find((i) => i.name === textValue);
	if (!found) return 0;
	const quantity = (found.serving.match(/[0-9]+\s(g|ml)/) ?? [])[0]?.split(" ")[0];
	if (!quantity) return 0;
	const gram = parseFloat(quantity);
	const calories = parseFloat(found.calories.split(" ")[0]);
	const calorie = (calories * num) / gram;
	return calorie;
}
