import { Link } from "expo-router";
import { Text, SafeAreaView, View } from "react-native";

export default function Home() {
	return (
		<SafeAreaView>
			<View>
				<Link href="/">Main</Link>
				<Text>Currently at home!</Text>
			</View>
		</SafeAreaView>
	);
}
