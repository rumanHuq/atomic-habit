import { Layout, Text, Input, Divider } from "@ui-kitten/components";
import { useState } from "react";

import { useNutritionApi } from "@/hooks/useNutritionApi";

export default function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const { data, isLoading } = useNutritionApi(searchTerm);
	return (
		<Layout>
			<>
				<Input placeholder="Place your Text" value={searchTerm} onChangeText={(nextValue) => setSearchTerm(nextValue)} />
				<Divider style={{ marginVertical: 5 }} />
				{searchTerm.length === 0 && <Text>Insert some food name to display nutrition information</Text>}
				{searchTerm.length === 0 && isLoading && <Text>Loading</Text>}
				{data?.flatMap((item) =>
					Object.entries(item).map(([key, val]) => (
						<Text key={key}>
							{key}: {val}
						</Text>
					))
				)}
			</>
		</Layout>
	);
}
