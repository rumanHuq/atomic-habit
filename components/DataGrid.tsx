import { Divider, Layout, Text } from "@ui-kitten/components";
import { ReactNode } from "react";
import { FlatList, ListRenderItem, View, ViewProps } from "react-native";

interface DataGridProps<Data> extends ViewProps {
	title: string;
	tableHeaders: string[];
	tableFooters: string[];
	data: Data[];
	renderItem: ListRenderItem<Data>;
	autoSuggestionPlaceholder: ReactNode;
}

export function DataGrid<Data>(props: DataGridProps<Data>) {
	const { title, data, renderItem, autoSuggestionPlaceholder, tableHeaders, tableFooters, style, ...rest } = props;

	return (
		<View style={[style, { flex: 1, zIndex: -1 }]} {...rest}>
			<Text category="h2">{title}</Text>
			<View style={{ marginVertical: 5 }}>{autoSuggestionPlaceholder}</View>
			<Layout
				style={{ borderRadius: 3, height: 35, marginTop: 2, flexDirection: "row", alignItems: "center", zIndex: -1 }}
				level="4">
				{tableHeaders.map((header, key) => (
					<Text style={{ flex: 1, textAlign: "center" }} key={key}>
						{header}
					</Text>
				))}
			</Layout>
			{data.length > 0 ? (
				<FlatList
					style={{ zIndex: -1 }}
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
			{tableFooters.length > 0 && (
				<Layout style={{ borderRadius: 3, height: 35, flexDirection: "row", alignItems: "center", zIndex: -1 }} level="4">
					{tableFooters.map((header, key) => (
						<Text style={{ flex: 1, textAlign: "center" }} key={key}>
							{header}
						</Text>
					))}
				</Layout>
			)}
		</View>
	);
}
