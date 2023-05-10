import { Icon, Layout, Text } from "@ui-kitten/components";
import * as WebBrowser from "expo-web-browser";
import { uniqBy } from "lodash";
import { useState } from "react";
import { Pressable } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { ActionInput } from "./ActionInput";
import type { ActionModalProps } from "./ActionModal";
import { ActionModal } from "./ActionModal";
import { DataGrid } from "./DataGrid";

import type { DateRecords, ExerciseHistory as ExerciseHistoryType } from "@/@types/@types";
import exercisesDb from "@/exercises_db.json";
import { useAppStore } from "@/hooks/useAppStore";
import { getProgressiveOverloadSuggestion } from "@/utils/getProgressiveOverloadSuggestion";

interface ModalProps {
	action?: "delete" | "edit";
	data?: { date: string; exerciseHistory: ExerciseHistoryType; index: number };
	visibility: boolean;
}

function exerciseListItem(props: {
	item: ExerciseHistoryType;
	index: number;
	onSelect(modal: "edit" | "delete"): void;
}) {
	const { item, index, onSelect } = props;
	return (
		<Menu key={index}>
			<MenuTrigger triggerOnLongPress customStyles={{ triggerTouchable: { activeOpacity: 0.3 } }}>
				<Layout style={{ flexDirection: "row", alignItems: "center", height: 50 }} level="2">
					<Pressable style={{ flex: 1 }} onPress={() => WebBrowser.openBrowserAsync(item.href)}>
						<Text style={{ textAlign: "center" }}>
							{item.title}&nbsp;
							<Icon name="external-link" />
						</Text>
					</Pressable>
					<Text style={{ flex: 1, textAlign: "center" }}>{item.weight.toFixed(0)}</Text>
				</Layout>
			</MenuTrigger>
			<MenuOptions optionsContainerStyle={{ padding: 8, marginLeft: 50 }}>
				<MenuOption style={{ height: 40, justifyContent: "center" }} onSelect={() => onSelect("edit")} text="Edit" />
				<MenuOption style={{ height: 40, justifyContent: "center" }} onSelect={() => onSelect("delete")} text="delete" />
			</MenuOptions>
		</Menu>
	);
}

export function ExerciseHistory(props: { dateRecords: DateRecords; date: string }) {
	const [modalState, setModalState] = useState<ModalProps>({ visibility: false });
	const setExerciseOfTheDay = useAppStore((state) => state.setExerciseOfTheDay);
	const deleteExerciseOfTheDay = useAppStore((state) => state.deleteExerciseOfTheDay);
	const { dateRecords, date } = props;
	const dayExerciseRecord = dateRecords[date].exerciseHistories;
	const onPressModalActionCta: ActionModalProps["onPress"] = (item) => {
		if (item.action === "delete") {
			deleteExerciseOfTheDay(item.date, item.inputs.index);
		} else if (item.action === "edit") {
			setExerciseOfTheDay(
				item.date,
				{
					weight: item.inputs.resultValue,
					title: item.inputs.title,
					id: item.inputs.id,
					// @ts-expect-error
					href: item.inputs.href,
					progressiveOverload: item.inputs.resultValue,
				},
				item.inputs.index
			);
		}
	};
	const dataSet = uniqBy(
		exercisesDb.filter((c) => !dayExerciseRecord.map((f) => f.title).includes(c.title)),
		"title"
	);
	return (
		<>
			{modalState.data && (
				<ActionModal
					resultValueCalculationFn={(numberValue) =>
						modalState.data
							? getProgressiveOverloadSuggestion({
									dateRecords,
									weight: numberValue,
									exercise: { id: modalState.data?.exerciseHistory.id, title: modalState.data?.exerciseHistory.title },
									editingDate: date,
							  })
							: 0
					}
					date={date}
					inputs={{
						numberValue: modalState.data.exerciseHistory.weight,
						title: modalState.data.exerciseHistory.title,
						id: modalState.data.exerciseHistory.id,
						resultValue: modalState.data.exerciseHistory.progressiveOverload,
					}}
					visible={modalState.visibility}
					hideModalCallback={() => setModalState({ visibility: false, data: undefined })}
					action={modalState.action}
					index={modalState.data.index}
					onPress={onPressModalActionCta}
				/>
			)}
			<DataGrid
				title="Exercises!"
				tableHeaders={["Exercise", "Weight"]}
				tableFooters={[]}
				data={dayExerciseRecord}
				renderItem={(exerciseHistory) =>
					exerciseListItem({
						...exerciseHistory,
						onSelect(modal) {
							setModalState({
								action: modal,
								data: { exerciseHistory: exerciseHistory.item, date, index: exerciseHistory.index },
								visibility: true,
							});
						},
					})
				}
				autoSuggestionPlaceholder={
					<ActionInput
						direction="up"
						resultValueFn={(p) =>
							getProgressiveOverloadSuggestion({ weight: p.numberValue, exercise: p.selectedItem, dateRecords })
						}
						dataSet={dataSet}
						resultPlaceHolderSuffix="%"
						numberPlaceHolder="kg"
						onSetItem={(info) => {
							if (!info.selectedItem?.title) return;
							setExerciseOfTheDay(date, {
								title: info.selectedItem.title,
								id: info.selectedItem.id,
								href: info.selectedItem.href,
								weight: parseFloat(info.numberValue.replace(",", ".")),
								progressiveOverload: getProgressiveOverloadSuggestion({
									dateRecords,
									weight: info.numberValue,
									exercise: info.selectedItem,
								}),
							});
						}}
					/>
				}
			/>
		</>
	);
}
