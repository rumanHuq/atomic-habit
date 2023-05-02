/* eslint-disable no-param-reassign */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { FoodHistory, DailyRecords, ExerciseHistory } from "@/@types/@types";

interface State {
	dailyRecords: DailyRecords;
	allDropdownVisible: boolean;
}

interface Actions {
	setCalorieOfTheDay(date: string, foodHistory: FoodHistory, index?: number): void;
	deleteCalorieOfTheDay(date: string, index: number): void;
	setExerciseOfTheDay(date: string, exercise: ExerciseHistory, index?: number): void;
	setInitialDataOfTheDay(date: string): void;
	setAllDropdownVisible(toggle: boolean): void;
	resetState(): void;
}

export const useStore = create(
	persist(
		immer<State & Actions>((set) => ({
			allDropdownVisible: false,
			dailyRecords: {},
			resetState() {
				set((state) => {
					state.dailyRecords = {};
				});
			},
			setInitialDataOfTheDay(date) {
				set((state) => {
					if (!state.dailyRecords[date]) {
						state.dailyRecords[date] = { foodHistories: [], exerciseHistories: [] };
					}
				});
			},
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

			setCalorieOfTheDay(date, foodHistory, index) {
				set((state) => {
					if (typeof index === "number") {
						state.dailyRecords[date].foodHistories[index] = foodHistory;
					} else {
						state.dailyRecords[date].foodHistories.push(foodHistory);
					}
				});
			},
			setExerciseOfTheDay(date, exercise, index) {
				set((state) => {
					if (typeof index === "number") {
						state.dailyRecords[date].exerciseHistories[index] = exercise;
					} else {
						state.dailyRecords[date].exerciseHistories.push(exercise);
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
