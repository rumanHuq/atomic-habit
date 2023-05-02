import { uniq } from "lodash";

import { ExerciseHistory } from "@/@types/@types";
import exercisesDB from "@/exercises_db.json";

export function exerciseFilterFunction(word: string, exerciseHistories: ExerciseHistory[]) {
	const keyword = word.trim();
	if (keyword.length < 3) return [];
	const exerciseNamesInHistory = exerciseHistories.map((c) => c.name);
	return uniq(
		exercisesDB
			.filter(
				(item) =>
					item.group.toLowerCase().startsWith(keyword.toLowerCase()) ||
					item.name.toLowerCase().startsWith(keyword.toLowerCase()) ||
					item.name.toLowerCase().includes(keyword.toLowerCase())
			)
			.map((item) => item.name)
			.filter((item) => !exerciseNamesInHistory.includes(item))
			.sort((a, b) => (a.length < b.length ? -1 : 1))
	);
}
