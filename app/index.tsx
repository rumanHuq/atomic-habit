import { Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { Gallery } from "@/components/Gallery";
import { Page } from "@/components/Page";

export default function App() {
	const colors = ["magenta", "green", "blue", "yellow", "limegreen", "papaya"];
	const { width, height } = Dimensions.get("screen");

	return (
		<Page>
			<FlatList
				data={colors}
				keyExtractor={(d) => d}
				horizontal
				showsHorizontalScrollIndicator={false}
				renderItem={({ item: backgroundColor }) => <Gallery style={{ height, width, backgroundColor }} />}
			/>
			<FlatList
				data={colors}
				horizontal
				keyExtractor={(d) => d}
				style={{ position: "absolute", bottom: 100 }}
				contentContainerStyle={{ paddingHorizontal: 12 }}
				renderItem={({ item: backgroundColor }) => (
					<Gallery
						style={{
							backgroundColor,
							height: 100,
							width: 100,
							borderRadius: 12,
							borderColor: "#0f0f0f",
							borderWidth: 2,
							marginRight: 12,
						}}
					/>
				)}
			/>
		</Page>
	);
}
