import { Icon, useTheme } from "@ui-kitten/components";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { CalenderIcon } from "./CalendarIcon";

const andorid = Platform.OS === "android";

function TabbarIcon({ name, ...props }: { focused: boolean; size: number; name: string; color: string }) {
	const day = new Date().getDate();
	if (name === "calendar") {
		return (
			<CalenderIcon {...{ name, day, dayFontSize: 10, position: [andorid ? 9 : 11, 6, undefined, undefined], ...props }} />
		);
	}
	return <Icon {...{ name, ...props }} />;
}

export function TabScreen({ title, iconName }: { title: string; iconName: string }) {
	const theme = useTheme();

	return (
		<Tabs.Screen
			options={{
				title,
				tabBarInactiveTintColor: theme["text-disabled-color"],
				tabBarActiveTintColor: theme["text-primary-color"],
				tabBarIcon: (props) => TabbarIcon({ ...props, name: iconName }),
			}}
		/>
	);
}
