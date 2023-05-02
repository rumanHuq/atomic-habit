import { Layout, Text } from "@ui-kitten/components";
import { useState } from "react";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { ActionInput } from "./ActionInput";
import { ActionModal, ActionModalProps } from "./ActionModal";
import { DataGrid } from "./DataGrid";

import { DateRecords, ExerciseHistory as ExerciseHistoryType } from "@/@types/@types";
import { useStore } from "@/hooks/useStore";
import { exerciseFilterFunction } from "@/utils/exerciseFilterFunction";
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
					<Text style={{ flex: 1, textAlign: "center" }}>{item.name}</Text>
					<Text style={{ flex: 1, textAlign: "center" }}>{item.weight.toFixed(0)}</Text>
				</Layout>
			</MenuTrigger>
			<MenuOptions optionsContainerStyle={{ width: "70%", marginLeft: 50 }}>
				<MenuOption onSelect={() => onSelect("edit")} text="Edit" />
				<MenuOption onSelect={() => onSelect("delete")} text="delete" />
			</MenuOptions>
		</Menu>
	);
}

export function ExerciseHistory(props: { dateRecords: DateRecords; date: string }) {
	const [modalState, setModalState] = useState<ModalProps>({ visibility: false });
	const setExerciseOfTheDay = useStore((state) => state.setExerciseOfTheDay);
	const deleteExerciseOfTheDay = useStore((state) => state.deleteExerciseOfTheDay);
	const { dateRecords, date } = props;
	const dayExerciseRecord = dateRecords[date].exerciseHistories;
	const onPressModalActionCta: ActionModalProps["onPress"] = (item) => {
		if (item.action === "delete") {
			deleteExerciseOfTheDay(item.date, item.inputs.index);
		} else if (item.action === "edit") {
			setExerciseOfTheDay(
				item.date,
				{ weight: item.inputs.resultValue, name: item.inputs.textValue, progressiveOverload: item.inputs.resultValue },
				item.inputs.index
			);
		}
	};
	return (
		<>
			{modalState.data && (
				<ActionModal
					resultValueCalculationFn={(numberValue) =>
						modalState.data
							? getProgressiveOverloadSuggestion({
									dateRecords,
									numberValue,
									textValue: modalState.data?.exerciseHistory.name,
									editingDate: date,
							  })
							: 0
					}
					date={date}
					inputs={{
						numberValue: modalState.data.exerciseHistory.weight,
						textValue: modalState.data.exerciseHistory.name,
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
						resultValueFn={(p) => getProgressiveOverloadSuggestion({ ...p, dateRecords })}
						resultPlaceHolderSuffix="%"
						textPlaceHolder="Pump it!"
						numberPlaceHolder="kg"
						onSetItem={(info) =>
							setExerciseOfTheDay(date, {
								name: info.textValue,
								weight: parseFloat(info.numberValue),
								progressiveOverload: getProgressiveOverloadSuggestion({
									dateRecords,
									numberValue: info.numberValue,
									textValue: info.textValue,
								}),
							})
						}
						autoCompleteListFromGivenKeywordFn={(keyword) => exerciseFilterFunction(keyword, dayExerciseRecord)}
					/>
				}
			/>
		</>
	);
}
