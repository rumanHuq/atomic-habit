export interface FoodHistory {
	food: string;
	gram: number;
	calorie: number;
}
export interface ExerciseHistory {
	name: string;
	weight: number;
	progressiveOverload: number;
}
export interface DateRecords {
	[date: string]: {
		foodHistories: FoodHistory[];
		exerciseHistories: ExerciseHistory[];
	};
}
