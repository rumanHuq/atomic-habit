import { Button, Card, Input, Modal, Text } from "@ui-kitten/components";
import { useState } from "react";
import { View } from "react-native";

interface ActionInput {
	textValue: string;
	numberValue: number;
	resultValue: number;
}
export interface ActionModalProps {
	visible: boolean;
	hideModalCallback: () => void;
	action?: "delete" | "edit";
	date: string;
	inputs: ActionInput;
	index: number;
	onPress(props: { date: string; inputs: ActionInput & { index: number }; action: "delete" | "edit" }): void;
	resultValueCalculationFn(val: number): number;
}

function Edit(props: {
	textValue: string;
	numberValue: string;
	resultValue: string;
	onChangeText: (text: string) => void;
}) {
	const { textValue, numberValue, resultValue, onChangeText } = props;
	return (
		<View style={{ flexDirection: "row", columnGap: 8, width: 300 }}>
			<Input disabled value={textValue} style={{ flex: 1 }} />
			<Input value={numberValue} onChangeText={onChangeText} style={{ flex: 0.5 }} />
			<Input disabled value={resultValue} style={{ flex: 0.5 }} />
		</View>
	);
}

export function ActionModal(props: ActionModalProps) {
	const { visible, hideModalCallback, action, date, inputs, onPress, index, resultValueCalculationFn } = props;
	const [value, setValue] = useState(inputs.numberValue.toFixed(0));
	if (!action) return null;

	const result = value ? resultValueCalculationFn(parseInt(value, 10)) : 0;
	const status = action === "delete" ? "danger" : "primary";
	const onPressHandler = () => {
		onPress({
			action,
			date,
			inputs: { numberValue: parseInt(value, 10), resultValue: result, textValue: inputs.textValue, index },
		});
		hideModalCallback();
	};
	const header = () => (
		<Text category="h6" style={{ marginBottom: 8 }}>
			{status === "danger" ? "Are you sure you want to delete?" : "Edit item"}
		</Text>
	);
	const footer = () => (
		<View style={{ justifyContent: "flex-end", flexDirection: "row", columnGap: 12, marginTop: 8 }}>
			<Button size="small" status="basic" onPress={hideModalCallback}>
				CANCEL
			</Button>
			<Button size="small" status={status} onPress={onPressHandler}>
				{status === "danger" ? "Delete" : "Finish"}
			</Button>
		</View>
	);

	return (
		<Modal
			visible={visible}
			onBackdropPress={hideModalCallback}
			backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
			<Card disabled header={header} footer={footer} style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
				{status === "danger" && (
					<Text style={{ right: 20 }}>It wouldn&apos;t be possible to recover the item later on</Text>
				)}
				{status === "primary" && inputs && date && (
					<Edit
						{...{ numberValue: value, onChangeText: setValue, resultValue: result.toFixed(0), textValue: inputs.textValue }}
					/>
				)}
			</Card>
		</Modal>
	);
}
