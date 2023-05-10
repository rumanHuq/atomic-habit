/* eslint-disable no-param-reassign */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { FoodHistory, DateRecords, ExerciseHistory } from "@/@types/@types";

interface State {
	dateRecords: DateRecords;
	allDropdownVisible: boolean;
}

interface Actions {
	setCalorieOfTheDay(date: string, foodHistory: FoodHistory, index?: number): void;
	deleteCalorieOfTheDay(date: string, index: number): void;
	setExerciseOfTheDay(date: string, exercise: ExerciseHistory, index?: number): void;
	deleteExerciseOfTheDay(date: string, index: number): void;
	setInitialDataOfTheDay(date: string): void;
	setAllDropdownVisible(toggle: boolean): void;
	resetState(): void;
}

export const useAppStore = create(
	persist(
		immer<State & Actions>((set) => ({
			allDropdownVisible: false,
			dateRecords: {},
			resetState() {
				set((state) => {
					state.dateRecords = {
						"2023-04-30": {
							exerciseHistories: [
								{
									title: "Farmers Walk",
									id: "113",
									weight: 10,
									progressiveOverload: 0,
									href: "https://www.strengthlog.com/farmers-walk/",
								},
								{ title: "Rich Walk", id: "999999", weight: 10, progressiveOverload: 0, href: "" },
							],
							foodHistories: [],
						},
						"2023-05-01": {
							exerciseHistories: [{ title: "Rich Walk", id: "999999", weight: 10, progressiveOverload: 0, href: "" }],
							foodHistories: [],
						},
					};
				});
			},
			setInitialDataOfTheDay(date) {
				set((state) => {
					if (!state.dateRecords[date]) {
						state.dateRecords[date] = { foodHistories: [], exerciseHistories: [] };
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
					state.dateRecords[date].foodHistories.splice(index, 1);
				});
			},

			setCalorieOfTheDay(date, foodHistory, index) {
				set((state) => {
					if (typeof index === "number") {
						state.dateRecords[date].foodHistories[index] = foodHistory;
					} else {
						state.dateRecords[date].foodHistories.push(foodHistory);
					}
				});
			},
			setExerciseOfTheDay(date, exercise, index) {
				set((state) => {
					if (typeof index === "number") {
						state.dateRecords[date].exerciseHistories[index] = exercise;
					} else {
						state.dateRecords[date].exerciseHistories.push(exercise);
					}
				});
			},
			deleteExerciseOfTheDay(date, index) {
				set((state) => {
					state.dateRecords[date].exerciseHistories.splice(index, 1);
				});
			},
		})),
		{
			name: "habit-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
