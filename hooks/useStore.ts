/* eslint-disable no-param-reassign */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { FoodHistory, DailyRecords, Exercise } from "@/@types/@types";

interface State {
	dailyRecords: DailyRecords;
	allDropdownVisible: boolean;
}

interface Actions {
	setCalorieOfTheDay(date: string, consumptionInfo: FoodHistory, index?: number): void;
	deleteCalorieOfTheDay(date: string, index: number): void;
	setExerciseOfTheDay(date: string, exercise: Exercise, index?: number): void;
	setInitialDataOfTheDay(date: string): void;
	setAllDropdownVisible(toggle: boolean): void;
}

export const useStore = create(
	persist(
		immer<State & Actions>((set) => ({
			allDropdownVisible: false,
			dailyRecords: {},
			setAllDropdownVisible(toggle) {
				set((state) => {
					state.allDropdownVisible = toggle;
				});
			},
			deleteCalorieOfTheDay(date, index) {
				set((state) => {
					state.dailyRecords[date].foodHistories.splice(index, 1);
				});
			},
			setInitialDataOfTheDay(date) {
				set((state) => {
					if (!state.dailyRecords[date]) {
						state.dailyRecords[date] = { foodHistories: [], exercises: [] };
					}
				});
			},
			setCalorieOfTheDay(date, consumptionInfo, index) {
				set((state) => {
					if (typeof index === "number") {
						state.dailyRecords[date].foodHistories[index] = consumptionInfo;
					} else {
						state.dailyRecords[date].foodHistories.push(consumptionInfo);
					}
				});
			},
			setExerciseOfTheDay(date, exercise, index) {
				set((state) => {
					if (typeof index === "number") {
						state.dailyRecords[date].exercises[index] = exercise;
					} else {
						state.dailyRecords[date].exercises.push(exercise);
					}
				});
			},
		})),
		{
			name: "habit-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
