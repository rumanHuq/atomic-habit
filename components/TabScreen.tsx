import { Icon, useTheme } from "@ui-kitten/components";
import { Tabs } from "expo-router";

function TabbarIcon(props: { focused: boolean; size: number; name: string; color: string }) {
	return <Icon {...props} />;
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
