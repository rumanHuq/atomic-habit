import { Layout, Text } from "@ui-kitten/components";
import { uniq, uniqBy } from "lodash";
import { useState } from "react";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { ActionInput } from "./ActionInput";
import { ActionModal, ActionModalProps } from "./ActionModal";
import { DataGrid } from "./DataGrid";

import { FoodHistory as FoodHistoryType } from "@/@types/@types";
import caloriesDb from "@/calories_db.json";
import { useStore } from "@/hooks/useStore";
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
					<Text style={{ flex: 1, textAlign: "center" }}>{item.title}</Text>
					<Text style={{ flex: 1, textAlign: "center" }}>{item.calorie.toFixed(0)}</Text>
				</Layout>
			</MenuTrigger>
			<MenuOptions optionsContainerStyle={{ padding: 8, marginLeft: 50 }}>
				<MenuOption style={{ height: 40, justifyContent: "center" }} onSelect={() => onSelect("edit")} text="Edit" />
				<MenuOption style={{ height: 40, justifyContent: "center" }} onSelect={() => onSelect("delete")} text="delete" />
			</MenuOptions>
		</Menu>
	);
}

export function FoodHistory({ foodHistories, date }: { foodHistories: FoodHistoryType[]; date: string }) {
	const setCalorieOfTheDay = useStore((state) => state.setCalorieOfTheDay);
	const deleteCalorieOfTheDay = useStore((state) => state.deleteCalorieOfTheDay);
	const onPressModalActionCta: ActionModalProps["onPress"] = (props) => {
		if (props.action === "delete") {
			deleteCalorieOfTheDay(props.date, props.inputs.index);
		} else if (props.action === "edit") {
			setCalorieOfTheDay(
				props.date,
				{
					calorie: props.inputs.resultValue,
					title: props.inputs.title,
					gram: props.inputs.numberValue,
					id: props.inputs.id,
				},
				props.inputs.index
			);
		}
	};
	const [modalState, setModalState] = useState<ModalProps>({ visibility: false });
	const dataSet = uniqBy(
		caloriesDb.filter((c) => !foodHistories.map((f) => f.title).includes(c.title)),
		"title"
	);
	return (
		<>
			{modalState.data && (
				<ActionModal
					resultValueCalculationFn={(value) =>
						modalState.data
							? (modalState.data.foodHistory.calorie * parseFloat(value.replace(",", "."))) / modalState.data.foodHistory.gram
							: 0
					}
					date={date}
					inputs={{
						numberValue: modalState.data.foodHistory.gram,
						title: modalState.data.foodHistory.title,
						id: modalState.data.foodHistory.id,
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
				tableFooters={["Total", foodHistories.reduce((acc, { calorie }) => acc + calorie, 0).toFixed(0)]}
				title="Food Consumption"
				data={foodHistories}
				renderItem={(props) =>
					foodListItem({
						...props,
						onSelect(modal) {
							setModalState({
								action: modal,
								data: { foodHistory: props.item, date, index: props.index },
								visibility: true,
							});
						},
					})
				}
				autoSuggestionPlaceholder={
					<ActionInput
						dataSet={dataSet}
						resultValueFn={({ numberValue, selectedItem }) => getCalorieInfo({ gram: numberValue, foodItem: selectedItem })}
						resultPlaceHolderSuffix="cal"
						numberPlaceHolder="g/ml"
						onSetItem={(val) => {
							const calorie = getCalorieInfo({ gram: val.numberValue, foodItem: val.selectedItem });
							if (!calorie || !val.numberValue || !val.selectedItem?.title) return;
							setCalorieOfTheDay(date, {
								title: val.selectedItem.title,
								id: val.selectedItem.id,
								calorie,
								gram: parseFloat(val.numberValue.replace(",", ".")),
							});
						}}
					/>
				}
			/>
		</>
	);
}
