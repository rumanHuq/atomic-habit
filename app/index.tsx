import { Text } from "@ui-kitten/components";

import { Container } from "@/components/Container";
import { TabScreen } from "@/components/TabScreen";

export default function App() {
	return (
		<Container>
			<Text>History of food consumption and Exercise information are shown here.</Text>
			<Text>UI would be a card, with date and all the data as facebook timeline</Text>
			<TabScreen {...{ title: "Home", iconName: "home" }} />
		</Container>
	);
}
