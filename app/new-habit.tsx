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
import { getDateToday } from "@/utils/getDateToday";

export default function DetailsScreen() {
	const today = getDateToday();
	const todayRecords = useStore((state) => state.dailyRecords[today]);
	const setInitialDataOfTheDay = useStore((state) => state.setInitialDataOfTheDay);
	const setExerciseOfTheDay = useStore((state) => state.setExerciseOfTheDay);

	useEffect(() => {
		if (!todayRecords) {
			setInitialDataOfTheDay(today);
		}
	}, [setInitialDataOfTheDay, today, todayRecords]);

	if (!todayRecords) return null;
	return (
		<Container>
			<FoodHistory foodHistory={todayRecords.foodHistories} today={today} />
			<View style={{ marginVertical: 5 }} />
			<DataGrid
				title="Exercises!"
				tableHeaders={["Exercise", "Weight"]}
				tableFooters={[]}
				data={todayRecords?.exercises ?? []}
				renderItem={({ item }) => <ListItem title={item.name} onPress={() => console.log(today, item)} />}
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
