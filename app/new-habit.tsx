import { ListItem } from "@ui-kitten/components";
import { useEffect } from "react";
import { View } from "react-native";

import { ActionInput } from "@/components/ActionInput";
import { Container } from "@/components/Container";
import { DataGrid } from "@/components/DataGrid";
import { FoodHistory } from "@/components/FoodHistory";
import { TabScreen } from "@/components/TabScreen";
import { useStore } from "@/hooks/useStore";
import { getCalorieInfo } from "@/utils/getCalorieInfo";
import { getDateOfTheDay } from "@/utils/getDateOfTheDay";

export default function DetailsScreen() {
	const date = getDateOfTheDay();
	const dateRecords = useStore((state) => state.dailyRecords[date]);
	const setInitialDataOfTheDay = useStore((state) => state.setInitialDataOfTheDay);
	const setExerciseOfTheDay = useStore((state) => state.setExerciseOfTheDay);

	useEffect(() => {
		if (!dateRecords) {
			setInitialDataOfTheDay(date);
		}
	}, [date, dateRecords, setInitialDataOfTheDay]);

	if (!dateRecords) return null;
	return (
		<Container>
			<FoodHistory foodHistory={dateRecords.foodHistories} date={date} />
			<View style={{ marginVertical: 5 }} />
			<DataGrid
				title="Exercises!"
				tableHeaders={["Exercise", "Weight"]}
				tableFooters={[]}
				data={dateRecords?.exercises ?? []}
				renderItem={({ item }) => <ListItem title={item.name} onPress={() => console.log(date, item)} />}
				autoSuggestionPlaceholder={
					<ActionInput
						resultValueFn={getCalorieInfo}
						resultPlaceHolderSuffix="%"
						textPlaceHolder="Pump it!"
						numberPlaceHolder="kg"
						onSetItem={console.log}
						autoCompleteListFromGivenKeywordFn={() => []}
					/>
				}
			/>
			<TabScreen {...{ title: "What's up!", iconName: "calendar" }} />
		</Container>
	);
}
