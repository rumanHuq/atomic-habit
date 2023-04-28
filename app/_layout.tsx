import * as eva from "@eva-design/eva";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { focusManager, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ApplicationProvider } from "@ui-kitten/components";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme, AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";

import { appTheme } from "@/theme";

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}
function dynamicLayoutStyles(mode: "dark" | "light") {
	const styles = {
		dark: {
			backgroundColor: "rgb(44,43,70)",
			color: "#fff",
		},
		light: {
			backgroundColor: "#fff",
			color: appTheme["color-primary-900"],
		},
	};

	return styles[mode];
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: Infinity,
		},
	},
});

const asyncStoragePersister = createAsyncStoragePersister({
	storage: AsyncStorage,
});

export default function Layout() {
	const colorScheme = useColorScheme() ?? "light";
	const styles = dynamicLayoutStyles(colorScheme);

	const screenOptions = {
		contentStyle: { backgroundColor: styles.backgroundColor, flex: 1, justifyContent: "center", alignItems: "center" },
		headerStyle: { backgroundColor: styles.backgroundColor },
		headerTitleStyle: { color: styles.color },
	} as const;

	useEffect(() => {
		const subscription = AppState.addEventListener("change", onAppStateChange);

		return () => subscription.remove();
	}, []);
	return (
		<PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
			<ApplicationProvider {...eva} theme={Object.assign(eva[colorScheme], appTheme)}>
				<Stack screenOptions={screenOptions} />
			</ApplicationProvider>
		</PersistQueryClientProvider>
	);
}
