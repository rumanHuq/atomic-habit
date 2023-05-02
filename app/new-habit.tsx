import { useEffect } from "react";
import { View } from "react-native";

import { Container } from "@/components/Container";
import { ExerciseHistory } from "@/components/ExerciseHistory";
import { FoodHistory } from "@/components/FoodHistory";
import { TabScreen } from "@/components/TabScreen";
import { useStore } from "@/hooks/useStore";
import { getDateOfTheDay } from "@/utils/getDateOfTheDay";

const { env } = process;

export default function DetailsScreen() {
	const date = getDateOfTheDay();
	const dateRecords = useStore((state) => state.dailyRecords[date]);
	const setInitialDataOfTheDay = useStore((state) => state.setInitialDataOfTheDay);
	const resetState = useStore((state) => state.resetState);

	useEffect(() => {
		if (env.NODE_ENV === "development") {
			resetState();
			setInitialDataOfTheDay(date);
		} else if (!dateRecords) {
			setInitialDataOfTheDay(date);
		}
	}, []);

	if (!dateRecords) return null;
	return (
		<Container>
			<FoodHistory foodHistories={dateRecords.foodHistories} date={date} />
			<View style={{ marginVertical: 5 }} />
			<ExerciseHistory exerciseHistories={dateRecords.exerciseHistories} date={date} />

			<TabScreen {...{ title: "What's up!", iconName: "calendar" }} />
		</Container>
	);
}
