import { Layout, Text } from "@ui-kitten/components";
import { useState } from "react";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { ActionInput } from "./ActionInput";
import { ActionModal, ActionModalProps } from "./ActionModal";
import { DataGrid } from "./DataGrid";

import { FoodHistory as FoodHistoryType } from "@/@types/@types";
import { useStore } from "@/hooks/useStore";
import { foodFilterFunction } from "@/utils/foodFilterFunction";
import { getCalorieInfo } from "@/utils/getCalorieInfo";

interface ModalProps {
	action?: "delete" | "edit";
	data?: { date: string; foodHistory: FoodHistoryType; index: number };
	visibility: boolean;
}

function foodListItem({
	item,
	index,
	onSelect,
}: {
	item: FoodHistoryType;
	index: number;
	onSelect(modal: "edit" | "delete"): void;
}) {
	return (
		<Menu key={index}>
			<MenuTrigger triggerOnLongPress customStyles={{ triggerTouchable: { activeOpacity: 0.3 } }}>
				<Layout style={{ flexDirection: "row", alignItems: "center", height: 50 }} level="2">
					<Text style={{ flex: 1, textAlign: "center" }}>{item.food}</Text>
					<Text style={{ flex: 1, textAlign: "center" }}>{item.calorie.toFixed(0)}</Text>
				</Layout>
			</MenuTrigger>
			<MenuOptions optionsContainerStyle={{ width: "70%", marginLeft: 50 }}>
				<MenuOption onSelect={() => onSelect("edit")} text="Edit" />
				<MenuOption onSelect={() => onSelect("delete")} text="delete" />
			</MenuOptions>
		</Menu>
	);
}

export function FoodHistory({ foodHistory, today }: { foodHistory: FoodHistoryType[]; today: string }) {
	const setCalorieOfTheDay = useStore((state) => state.setCalorieOfTheDay);
	const deleteCalorieOfTheDay = useStore((state) => state.deleteCalorieOfTheDay);
	const onPressModalActionCta: ActionModalProps["onPress"] = (props) => {
		if (props.action === "delete") {
			deleteCalorieOfTheDay(props.date, props.inputs.index);
		} else if (props.action === "edit") {
			setCalorieOfTheDay(
				props.date,
				{ calorie: props.inputs.resultValue, food: props.inputs.textValue, gram: props.inputs.numberValue },
				props.inputs.index
			);
		}
	};
	const [modalState, setModalState] = useState<ModalProps>({ visibility: false });
	return (
		<>
			{modalState.data && (
				<ActionModal
					resultValueCalculationFn={(value) =>
						modalState.data ? (modalState.data.foodHistory.calorie * value) / modalState.data.foodHistory.gram : 0
					}
					date={today}
					inputs={{
						numberValue: modalState.data.foodHistory.gram,
						textValue: modalState.data.foodHistory.food,
						resultValue: modalState.data.foodHistory.calorie,
					}}
					visible={modalState.visibility}
					hideModalCallback={() => setModalState({ visibility: false, data: undefined })}
					action={modalState.action}
					index={modalState.data.index}
					onPress={onPressModalActionCta}
				/>
			)}
			<DataGrid
				tableHeaders={["Food", "Calories"]}
				tableFooters={["Total", foodHistory.reduce((acc, { calorie }) => acc + calorie, 0).toFixed(0)]}
				title="Food Consumption"
				data={foodHistory}
				renderItem={(props) =>
					foodListItem({
						...props,
						onSelect(modal) {
							setModalState({
								action: modal,
								data: { foodHistory: props.item, date: today, index: props.index },
								visibility: true,
							});
						},
					})
				}
				autoSuggestionPlaceholder={
					<ActionInput
						resultValueFn={getCalorieInfo}
						resultPlaceHolderSuffix="cal"
						textPlaceHolder="What did you eat"
						numberPlaceHolder="g/ml"
						onSetItem={(val) => {
							const calorie = getCalorieInfo(val);
							if (!calorie) return;
							setCalorieOfTheDay(today, { food: val.textValue, calorie, gram: val.numberValue });
						}}
						autoCompleteListFromGivenKeywordFn={(w) => foodFilterFunction(w, foodHistory)}
					/>
				}
			/>
		</>
	);
}
