import { uniq } from "lodash";

import { Calorie } from "@/@types/@types";
import caloriesDb from "@/calories_db.json";

export function foodFilterFunction(word: string, caloriesHistory: Calorie[]) {
	const keyword = word.trim();
	if (keyword.length < 3) return [];
	const foodNamesInHistory = caloriesHistory.map((c) => c.food);
	return uniq(
		caloriesDb
			.filter(
				(item) =>
					item.group.toLowerCase().startsWith(keyword.toLowerCase()) ||
					item.group.toLowerCase().includes(keyword.toLowerCase()) ||
					item.name.toLowerCase().startsWith(keyword.toLowerCase()) ||
					item.name.toLowerCase().includes(keyword.toLowerCase())
			)
			.map((item) => item.name)
			.filter((item) => !foodNamesInHistory.includes(item))
			.sort((a, b) => (a.length < b.length ? -1 : 1))
	);
}
