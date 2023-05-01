import { Layout, ListItem, Text } from "@ui-kitten/components";
import { useEffect } from "react";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { ActionInput } from "@/components/ActionInput";
import { Container } from "@/components/Container";
import { DataGrid } from "@/components/DataGrid";
import { TabScreen } from "@/components/TabScreen";
import { useStore } from "@/hooks/useStore";
import { foodFilterFunction } from "@/utils/foodFilterFunction";
import { getCalorieInfo } from "@/utils/getCalorieInfo";
import { getDateToday } from "@/utils/getDateToday";

export default function DetailsScreen() {
	const today = getDateToday();
	const todayRecords = useStore((state) => state.dailyRecords[today]);
	const setInitialDataOfTheDay = useStore((state) => state.setInitialDataOfTheDay);
	const setCalorieOfTheDay = useStore((state) => state.setCalorieOfTheDay);
	const setExerciseOfTheDay = useStore((state) => state.setExerciseOfTheDay);
	const caloriesHistory = todayRecords?.calories ?? [];
	useEffect(() => {
		setInitialDataOfTheDay(today);
	}, [setInitialDataOfTheDay, today]);

	return (
		<Container>
			<DataGrid
				tableHeaders={["Food", "Calories"]}
				tableFooters={["Total", todayRecords.calories.reduce((acc, { calorie }) => acc + calorie, 0).toFixed(0)]}
				title="Food Consumption"
				data={caloriesHistory}
				renderItem={({ item, index }) => (
					<Menu>
						<MenuTrigger triggerOnLongPress customStyles={{ triggerTouchable: { activeOpacity: 0.3 } }}>
							<Layout style={{ flexDirection: "row", alignItems: "center", height: 50 }} level="2">
								<Text style={{ flex: 1, textAlign: "center" }}>{item.food}</Text>
								<Text style={{ flex: 1, textAlign: "center" }}>{item.calorie.toFixed(0)}</Text>
							</Layout>
						</MenuTrigger>
						<MenuOptions optionsContainerStyle={{ width: "70%", marginLeft: 50 }}>
							<MenuOption onSelect={() => alert(`Save`)} text="Edit" />
							<MenuOption onSelect={() => alert(`Not called`)} text="delete" />
						</MenuOptions>
					</Menu>
				)}
				autoSuggestionPlaceholder={
					<ActionInput
						resultValueFn={getCalorieInfo}
						resultPlaceHolderSuffix="cal"
						textPlaceHolder="What did you eat"
						numberPlaceHolder="g/ml"
						onSetItem={(val) => {
							const calorie = getCalorieInfo(val);
							if (!calorie) return;
							setCalorieOfTheDay(today, { food: val.textValue, calorie });
						}}
						autoCompleteListFromGivenKeywordFn={(w) => foodFilterFunction(w, todayRecords.calories)}
					/>
				}
			/>
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
