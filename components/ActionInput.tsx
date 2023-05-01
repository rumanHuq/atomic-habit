import { Icon, Button, Input, List, ListItem, useTheme } from "@ui-kitten/components";
import { omit } from "lodash";
import { useState } from "react";
import { ImageProps, TextStyle, ViewStyle, View, TouchableWithoutFeedback } from "react-native";

import { useStore } from "@/hooks/useStore";

interface ActionInputProps {
	onSetItem: (val: { textValue: string; numberValue: number }) => void;
	textPlaceHolder: string;
	numberPlaceHolder: string;
	autoCompleteListFromGivenKeywordFn: (keyword: string) => string[];
	resultValueFn: (val: { textValue: string; numberValue: number }) => number;
	resultPlaceHolderSuffix: string;
}

function AddIcon({ style }: { style: { height: number; marginHorizontal: number; tintColor: string; width: number } }) {
	const iconStyle: TextStyle = omit(style, "tintColor");
	iconStyle.color = style.tintColor;
	return <Icon name="plus" style={iconStyle} size={16} />;
}

const styles: ViewStyle = { flexDirection: "row", justifyContent: "space-between", alignItems: "center", columnGap: 6 };

function RemoveIcon({ onPress, ...imageProps }: Partial<ImageProps> & { onPress: () => void }) {
	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<Icon {...imageProps} name="x" style={{ display: "flex" }} />
		</TouchableWithoutFeedback>
	);
}

export function ActionInput(props: ActionInputProps) {
	const theme = useTheme();
	const {
		onSetItem,
		textPlaceHolder,
		numberPlaceHolder,
		autoCompleteListFromGivenKeywordFn,
		resultValueFn,
		resultPlaceHolderSuffix,
	} = props;
	const [textValue, setTextValue] = useState("");
	const [numberValue, setNumberValue] = useState(-1);
	const dropdownVisible = useStore((state) => state.dropdownVisible);
	const setDropdownVisible = useStore((state) => state.setDropdownVisible);
	const restInputs = () => {
		setNumberValue(-1);
		setTextValue("");
		setDropdownVisible(false);
	};
	const onPressAddButton = () => {
		onSetItem({ textValue, numberValue });
		restInputs();
	};
	const data = autoCompleteListFromGivenKeywordFn(textValue);
	let resultValue: number | string = resultValueFn({ numberValue, textValue });
	resultValue = resultValue > 0 ? `${resultValue.toFixed(0)} ${resultPlaceHolderSuffix}` : "n/a";
	const invalidTextValue = data.includes(textValue) === false;
	const disabled = invalidTextValue || numberValue <= 0;
	return (
		<View style={[styles]}>
			<View style={{ flex: 1 }}>
				<Input
					onBlur={() => setDropdownVisible(false)}
					placeholder={textPlaceHolder ?? "provide value"}
					size="small"
					keyboardType="web-search"
					onChangeText={(txt) => {
						setTextValue(txt);
						setDropdownVisible(txt.length > 2);
					}}
					value={textValue}
					accessoryRight={(imageProps) => RemoveIcon({ ...imageProps, onPress: () => setTextValue("") })}
				/>
				{textValue && dropdownVisible && data.length > 0 && (
					<List
						style={{
							borderWidth: 1,
							borderRadius: 3,
							borderColor: theme["text-hint-color"],
							position: "absolute",
							width: "100%",
							maxHeight: 180,
							top: 36,
							left: 0,
							zIndex: 1,
						}}
						data={data}
						renderItem={({ item }) => (
							<ListItem
								title={item}
								onPress={() => {
									setTextValue(item);
									setDropdownVisible(false);
								}}
							/>
						)}
					/>
				)}
			</View>
			<Input
				onBlur={() => setDropdownVisible(false)}
				disabled={invalidTextValue}
				style={{ flex: 0.45 }}
				placeholder={numberPlaceHolder ?? "provide value"}
				size="small"
				value={`${numberValue < 0 ? "" : numberValue}`}
				keyboardType="decimal-pad"
				onChangeText={(val) => {
					const num = parseFloat(val);
					setNumberValue(num >= 0 ? num : -1);
				}}
			/>
			<Input
				style={{ flex: 0.55 }}
				onPressIn={() => setDropdownVisible(false)}
				size="small"
				value={resultValue}
				keyboardType="decimal-pad"
				disabled
			/>
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
