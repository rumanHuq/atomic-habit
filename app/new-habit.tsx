import { ListItem } from "@ui-kitten/components";
import { uniq } from "lodash";
import { useEffect } from "react";

import caloriesDb from "@/calories_db.json";
import { ActionInput } from "@/components/ActionInput";
import { ActionableList } from "@/components/ActionableList";
import { Container } from "@/components/Container";
import { TabScreen } from "@/components/TabScreen";
import { useStore } from "@/hooks/useStore";

function getDateToday() {
	const today = new Date();
	const date = today.getDate();
	const month = today.getMonth() + 1;
	const year = today.getFullYear();

	return `${year}-${month}-${date}`;
}

function foodFilterFunction(keyword: string) {
	if (keyword.length < 3) return [];
	return uniq(
		caloriesDb
			.filter(
				(item) =>
					item.group.toLowerCase().startsWith(keyword.toLowerCase()) ||
					item.name.toLowerCase().startsWith(keyword.toLowerCase()) ||
					item.group.toLowerCase().includes(keyword.toLowerCase()) ||
					item.name.toLowerCase().includes(keyword.toLowerCase())
			)
			.map((i) => i.name)
			.sort()
	);
}

export default function DetailsScreen() {
	const today = getDateToday();
	const todayRecords = useStore((state) => state.dailyRecords[today]);
	const setInitialDataOfTheDay = useStore((state) => state.setInitialDataOfTheDay);
	const setCalorieOfTheDay = useStore((state) => state.setCalorieOfTheDay);
	const setExerciseOfTheDay = useStore((state) => state.setExerciseOfTheDay);

	useEffect(() => {
		if (!todayRecords) {
			setInitialDataOfTheDay(today);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Container>
			<ActionableList
				header="Food Consumption"
				data={todayRecords?.calories ?? []}
				renderItem={({ item }) => <ListItem title={item.food} onPress={() => console.log(today, item)} />}
				autoSuggestionPlaceholder={
					<ActionInput
						resultValue="n/a"
						textPlaceHolder="What did you eat"
						numberPlaceHolder="gram"
						onSetItem={console.log}
						autoCompleteListFromGivenKeywordFn={foodFilterFunction}
					/>
				}
			/>

			<ActionableList
				header="Exercises!"
				data={todayRecords?.exercises ?? []}
				renderItem={({ item }) => <ListItem title={item.name} onPress={() => console.log(today, item)} />}
				autoSuggestionPlaceholder={
					<ActionInput
						resultValue="n/a"
						textPlaceHolder="What exercise did you do?"
						numberPlaceHolder="kg"
						onSetItem={console.log}
						autoCompleteListFromGivenKeywordFn={() => []}
					/>
				}
			/>
			<TabScreen {...{ title: "What's up!", iconName: "plus" }} />
		</Container>
	);
}
