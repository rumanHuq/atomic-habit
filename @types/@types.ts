export interface FoodHistory {
	food: string;
	gram: number;
	calorie: number;
}
export interface ExerciseHistory {
	name: string;
	weight: number;
}
export interface DailyRecords {
	[date: string]: {
		foodHistories: FoodHistory[];
		exerciseHistories: ExerciseHistory[];
	};
}
