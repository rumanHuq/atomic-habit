export interface NutritionData {
	name: string;
	calories: number;
	serving_size_g: number;
	fat_total_g: number;
	fat_saturated_g: number;
	protein_g: number;
	sodium_mg: number;
	potassium_mg: number;
	cholesterol_mg: number;
	carbohydrates_total_g: number;
	fiber_g: number;
	sugar_g: number;
}

export interface Calorie {
	food: string;
	calorie: number;
}
export interface Exercise {
	name: string;
	weight: number;
}
export interface DailyRecords {
	[date: string]: {
		calories: Calorie[];
		exercises: Exercise[];
	};
}
