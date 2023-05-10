import * as eva from "@eva-design/eva";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { focusManager, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import type { AppStateStatus } from "react-native";
import { useColorScheme, AppState, Platform } from "react-native";
import { EventProvider } from "react-native-outside-press";
import { MenuProvider } from "react-native-popup-menu";

import { FeatherIconsPack } from "@/lib/iconPack";
import { appTheme } from "@/theme";

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}
function dynamicLayoutStyles(mode: "dark" | "light") {
	const styles = {
		dark: {
			backgroundColor: "rgb(34,43,64)",
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

	useEffect(() => {
		const subscription = AppState.addEventListener("change", onAppStateChange);
		return () => subscription.remove();
	}, []);
	const theme = { ...eva[colorScheme], ...appTheme };
	return (
		<PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
			<IconRegistry icons={FeatherIconsPack} />
			<EventProvider style={{ flex: 1 }}>
				<ApplicationProvider {...eva} theme={theme}>
					<MenuProvider>
						<Tabs
							screenOptions={{
								headerStyle: { backgroundColor: styles.backgroundColor },
								headerTitleStyle: { color: styles.color },
								tabBarStyle: { backgroundColor: styles.backgroundColor, paddingTop: 8 },
							}}
						/>
					</MenuProvider>
				</ApplicationProvider>
			</EventProvider>
		</PersistQueryClientProvider>
	);
}
