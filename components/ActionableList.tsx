import { List, Divider, Text } from "@ui-kitten/components";
import { ReactNode } from "react";
import { ListRenderItem, View } from "react-native";

interface ActionableListProps<Data> {
	header: string;
	data: Data[];
	renderItem: ListRenderItem<Data>;
	autoSuggestionPlaceholder: ReactNode;
}

export function ActionableList<Data>(props: ActionableListProps<Data>) {
	const { header, data, renderItem, autoSuggestionPlaceholder } = props;

	return (
		<View style={{ flex: 1, zIndex: -1 }}>
			<Text category="h2">{header}</Text>
			<View style={{ marginVertical: 5 }}>{autoSuggestionPlaceholder}</View>
			{data.length > 0 ? (
				<List
					ItemSeparatorComponent={Divider}
					data={data}
					renderItem={renderItem}
					keyExtractor={(_, index) => index.toString()}
				/>
			) : (
				<View style={{ justifyContent: "center", alignItems: "center", flex: 1, zIndex: -1 }}>
					<Text appearance="hint">No item yet</Text>
				</View>
			)}
		</View>
	);
}
