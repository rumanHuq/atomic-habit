import { TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";

import { DateRecords } from "@/@types/@types";

interface GetProgressiveOverloadSuggestionProps {
	exercise: (TAutocompleteDropdownItem & Record<string, unknown>) | null;
	weight: string;
	dateRecords: DateRecords;
	editingDate?: string;
}

export function getProgressiveOverloadSuggestion(props: GetProgressiveOverloadSuggestionProps) {
	const { exercise, weight, dateRecords, editingDate } = props;
	const num = parseFloat(weight.replace(",", "."));
	if (!exercise?.id || !weight || num <= 0) {
		return 0;
	}

	let dateRecordsArr = Object.entries(dateRecords);
	if (editingDate) {
		dateRecordsArr = dateRecordsArr.filter(([date]) => date !== editingDate);
	}

	const lastTimeExerciseDone = dateRecordsArr
		.sort((a, b) => (new Date(a[0]) > new Date(b[0]) ? -1 : 1))
		.find(([date, { exerciseHistories }]) => exerciseHistories.find(({ id }) => id === exercise.id));

	if (!lastTimeExerciseDone) return 0;

	const [, { exerciseHistories }] = lastTimeExerciseDone;
	const found = exerciseHistories.find(({ id }) => id === exercise.id);
	if (!found) return 0;

	const progressiveOverLoad = ((num - found.weight) / found.weight) * 100;
	return progressiveOverLoad;
}
