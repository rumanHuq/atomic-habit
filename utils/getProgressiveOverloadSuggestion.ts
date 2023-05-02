import { DateRecords } from "@/@types/@types";

interface GetProgressiveOverloadSuggestionProps {
	textValue: string;
	numberValue: string;
	dateRecords: DateRecords;
	editingDate?: string;
}

export function getProgressiveOverloadSuggestion(props: GetProgressiveOverloadSuggestionProps) {
	const { textValue, numberValue, dateRecords, editingDate } = props;
	const num = parseFloat(numberValue);
	if (!textValue || !numberValue || num <= 0) return 0;

	let dateRecordsArr = Object.entries(dateRecords);
	if (editingDate) {
		dateRecordsArr = dateRecordsArr.filter(([date]) => date !== editingDate);
	}

	const lastTimeExerciseDone = dateRecordsArr
		.sort((a, b) => (new Date(a[0]) > new Date(b[0]) ? -1 : 1))
		.find(([date, { exerciseHistories }]) =>
			exerciseHistories.find((e) => e.name.toLowerCase() === textValue.toLowerCase())
		);
	if (!lastTimeExerciseDone) return 0;

	const [, { exerciseHistories }] = lastTimeExerciseDone;
	const found = exerciseHistories.find((e) => e.name.toLowerCase() === textValue.toLowerCase());
	if (!found) return 0;

	const progressiveOverLoad = ((num - found.weight) / found.weight) * 100;
	return progressiveOverLoad;
}
