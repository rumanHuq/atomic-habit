import type { TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";

export interface FoodHistory extends NonNullable<TAutocompleteDropdownItem> {
	title: string;
	gram: number;
	calorie: number;
}
export interface ExerciseHistory extends NonNullable<TAutocompleteDropdownItem> {
	title: string;
	href: string;
	weight: number;
	progressiveOverload: number;
}
export interface DateRecords {
	[date: string]: {
		foodHistories: FoodHistory[];
		exerciseHistories: ExerciseHistory[];
	};
}

export interface FoodItem {
	id: string;
	group: string;
	title: string;
	calories: string;
	serving: string;
}
