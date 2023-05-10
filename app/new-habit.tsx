import { useEffect } from "react";
import { View } from "react-native";

import { Container } from "@/components/Container";
import { ExerciseHistory } from "@/components/ExerciseHistory";
import { FoodHistory } from "@/components/FoodHistory";
import { TabScreen } from "@/components/TabScreen";
import { useAppStore } from "@/hooks/useAppStore";
import { getDateOfTheDay } from "@/utils/getDateOfTheDay";

const { env } = process;

export default function DetailsScreen() {
	const date = getDateOfTheDay();
	const dateRecords = useAppStore((state) => state.dateRecords);
	const setInitialDataOfTheDay = useAppStore((state) => state.setInitialDataOfTheDay);
	const resetState = useAppStore((state) => state.resetState);
	const todayRecord = dateRecords[date];

	useEffect(() => {
		if (env.NODE_ENV === "development") {
			resetState();
			setInitialDataOfTheDay(date);
		} else if (!dateRecords) {
			setInitialDataOfTheDay(date);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!todayRecord) return null;
	return (
		<Container>
			<FoodHistory foodHistories={todayRecord.foodHistories} date={date} />
			<View style={{ marginVertical: 5 }} />
			<ExerciseHistory dateRecords={dateRecords} date={date} />

			<TabScreen {...{ title: "What's up!", iconName: "calendar" }} />
		</Container>
	);
}
