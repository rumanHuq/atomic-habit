import { ListItem } from "@ui-kitten/components";

import { ActionInput } from "./ActionInput";
import { DataGrid } from "./DataGrid";

import { ExerciseHistory as ExerciseHistoryType } from "@/@types/@types";

export function ExerciseHistory({
	exerciseHistories,
	date,
}: {
	exerciseHistories: ExerciseHistoryType[];
	date: string;
}) {
	return (
		<DataGrid
			title="Exercises!"
			tableHeaders={["Exercise", "Weight"]}
			tableFooters={[]}
			data={exerciseHistories}
			renderItem={({ item }) => <ListItem title={item.name} onPress={() => console.log(date, item)} />}
			autoSuggestionPlaceholder={
				<ActionInput
					resultValueFn={() => 0}
					resultPlaceHolderSuffix="%"
					textPlaceHolder="Pump it!"
					numberPlaceHolder="kg"
					onSetItem={console.log}
					autoCompleteListFromGivenKeywordFn={() => []}
				/>
			}
		/>
	);
}
