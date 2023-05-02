import { Text } from "@ui-kitten/components";
import { useEffect } from "react";
import { Alert, NativeModules } from "react-native";
import Midnight from "react-native-midnight";

import { Container } from "@/components/Container";
import { TabScreen } from "@/components/TabScreen";

export default function App() {
	useEffect(() => {
		const listener = Midnight.addListener(() => {
			Alert.alert("The day has changed");
		});
		return () => listener.remove();
	}, []);

	return (
		<Container>
			<Text>History of food consumption and Exercise information are shown here.</Text>
			<Text>UI would be a card, with date and all the data as facebook timeline</Text>
			<TabScreen {...{ title: "Home", iconName: "home" }} />
		</Container>
	);
}
