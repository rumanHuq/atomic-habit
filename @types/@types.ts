export interface FoodHistory {
	food: string;
	gram: number;
	calorie: number;
}
export interface Exercise {
	name: string;
	weight: number;
}
export interface DailyRecords {
	[date: string]: {
		foodHistories: FoodHistory[];
		exercises: Exercise[];
	};
}
