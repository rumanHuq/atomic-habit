import { StyleSheet, Platform, StatusBar, SafeAreaView } from "react-native";

const style = StyleSheet.create({
	AndroidSafeArea: {
		flex: 1,
		backgroundColor: "white",
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 2,
	},
});

export function Page({ children }: { children: React.ReactNode }) {
	return <SafeAreaView style={style.AndroidSafeArea}>{children}</SafeAreaView>;
}
