/* eslint-disable no-param-reassign */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { Calorie, DailyRecords, Exercise } from "@/@types/@types";

interface State {
	dailyRecords: DailyRecords;
	dropdownVisible: boolean;
}

interface Actions {
	setCalorieOfTheDay(date: string, consumptionInfo: Calorie, index?: number): void;
	setExerciseOfTheDay(date: string, exercise: Exercise, index?: number): void;
	setInitialDataOfTheDay(date: string): void;
	setDropdownVisible(toggle: boolean): void;
}

export const useStore = create(
	persist(
		immer<State & Actions>((set) => ({
			dropdownVisible: false,
			dailyRecords: {},
			setDropdownVisible(toggle) {
				set((state) => {
					state.dropdownVisible = toggle;
				});
			},
			setInitialDataOfTheDay(date) {
				set((state) => {
					if (!state.dailyRecords[date]) {
						state.dailyRecords[date] = { calories: [], exercises: [] };
					}
				});
			},
			setCalorieOfTheDay(date, consumptionInfo) {
				set((state) => {
					const index = state.dailyRecords[date].calories.findIndex((c) => c.food === consumptionInfo.food);
					if (index !== -1) {
						state.dailyRecords[date].calories[index].calorie += consumptionInfo.calorie;
					} else {
						state.dailyRecords[date].calories.push(consumptionInfo);
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
