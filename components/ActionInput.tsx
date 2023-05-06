import { Icon, Button, Input } from "@ui-kitten/components";
import { omit } from "lodash";
import { useState } from "react";
import { TextStyle, ViewStyle, View, useColorScheme, Keyboard } from "react-native";
import { AutocompleteDropdown, TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";

interface ActionInputProps<T> {
	direction?: "up" | "down";
	numberPlaceHolder: string;
	resultPlaceHolderSuffix: string;
	onSetItem: (val: { selectedItem: (TAutocompleteDropdownItem & T) | null; numberValue: string }) => void;
	resultValueFn: (val: { selectedItem: (TAutocompleteDropdownItem & T) | null; numberValue: string }) => number;
	dataSet: (TAutocompleteDropdownItem & T)[];
}

function AddIcon({ style }: { style: { height: number; marginHorizontal: number; tintColor: string; width: number } }) {
	const iconStyle: TextStyle = omit(style, "tintColor");
	iconStyle.color = style.tintColor;
	return <Icon name="plus" style={iconStyle} size={16} />;
}

const styles: ViewStyle = { flexDirection: "row", justifyContent: "space-between", alignItems: "center", columnGap: 6 };
const autocompleteStyles = {
	dark: {
		focus: { fontColor: "rgb(132,143,168)", backgroundColor: "rgb(34,43,69)", borderColor: "rgb(100,87,166)" },
		blur: { fontColor: "rgb(132,143,168)", backgroundColor: "rgb(25,33,56)", borderColor: "rgb(22,28,49)" },
	},
	light: {
		focus: { fontColor: "rgb(174,180,198)", backgroundColor: "rgb(247,249,252)", borderColor: "rgb(155,146,210)" },
		blur: { fontColor: "rgb(132,143,168)", backgroundColor: "rgb(247,249,252)", borderColor: "rgb(237,241,247)" },
	},
};

export function ActionInput<T extends Record<string, unknown>>(props: ActionInputProps<T>) {
	const { onSetItem, numberPlaceHolder, resultValueFn, resultPlaceHolderSuffix, dataSet, direction = "down" } = props;
	const [selectedItem, setSelectedItem] = useState<(TAutocompleteDropdownItem & T) | null>(null);
	const [numberValue, setNumberValue] = useState("-1");
	const [styleState, setStyleState] = useState<"focus" | "blur">("focus");
	const colorScheme = useColorScheme() ?? "light";

	const restInputs = () => {
		setNumberValue("-1");
		setSelectedItem(null);
		Keyboard.dismiss();
	};
	const onPressAddButton = () => {
		onSetItem({ selectedItem, numberValue });
		restInputs();
	};
	let resultValue: number | string = resultValueFn({ numberValue, selectedItem });
	resultValue = resultValue >= 0 ? `${resultValue.toFixed(0)} ${resultPlaceHolderSuffix}` : "n/a";
	const invalidNumber = !numberValue.match(/^[1-9]\d*((\.|,)\d+)?$/);
	const disabled = invalidNumber || parseFloat(numberValue.replace(",", ".")) < 0;

	return (
		<View style={[styles]}>
			<AutocompleteDropdown
				direction={direction}
				onFocus={() => setStyleState("focus")}
				onBlur={() => setStyleState("blur")}
				textInputProps={{
					style: { height: 30, fontSize: 12, color: autocompleteStyles[colorScheme][styleState].fontColor },
				}}
				containerStyle={{ flex: 1, justifyContent: "center", alignItems: "center", height: 30 }}
				inputContainerStyle={{
					height: 30,
					flex: 1,
					borderColor: autocompleteStyles[colorScheme][styleState].borderColor,
					backgroundColor: autocompleteStyles[colorScheme][styleState].backgroundColor,
					borderWidth: 1,
				}}
				initialValue={selectedItem ?? undefined}
				rightButtonsContainerStyle={{ height: 30 }}
				clearOnFocus
				closeOnBlur={false}
				// @ts-expect-error
				onSelectItem={setSelectedItem}
				dataSet={dataSet}
			/>
			<Input
				// disabled={invalidTextValue}
				style={{ flex: 0.45 }}
				placeholder={numberPlaceHolder ?? "provide value"}
				size="small"
				value={`${!numberValue || parseFloat(numberValue.replace(",", ".")) < 0 ? "" : numberValue}`}
				keyboardType="decimal-pad"
				onChangeText={setNumberValue}
			/>
			<Input style={{ flex: 0.55 }} size="small" value={resultValue} keyboardType="number-pad" disabled />
			<Button
				accessoryLeft={AddIcon}
				size="small"
				style={{ borderRadius: 24, height: 24, width: 24 }}
				onPress={disabled === false ? onPressAddButton : undefined}
				disabled={disabled}
			/>
		</View>
	);
}
