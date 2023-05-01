/* eslint-disable no-param-reassign */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { Calorie, DailyRecords, Exercise } from "@/@types/@types";

interface State {
	dailyRecords: DailyRecords;
	dropdownVisible: boolean;
}

interface Actions {
	setCalorieOfTheDay(date: string, calorie: Calorie, index?: number): void;
	setExerciseOfTheDay(date: string, exercise: Exercise, index?: number): void;
	setInitialDataOfTheDay(date: string): void;
	setDropdownVisible(toggle: boolean): void;
}

export const useStore = create(
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
				state.dailyRecords[date] = { calories: [], exercises: [] };
			});
		},
		setCalorieOfTheDay(date, calorie, index) {
			set((state) => {
				if (typeof index === "number") {
					state.dailyRecords[date].calories[index] = calorie;
				} else {
					state.dailyRecords[date].calories.push(calorie);
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
	}))
);
