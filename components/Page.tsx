import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PageProps extends ViewProps {
	children: React.ReactNode;
	center?: boolean;
}

export function Page({ children, center = false, style, ...props }: PageProps) {
	const insets = useSafeAreaInsets();
	const baseStyle: ViewProps["style"] = {
		flex: 1,
		paddingTop: insets.top,
		...(center ? { justifyContent: "center", alignItems: "center" } : {}),
	};
	return (
		<View style={Object.assign(baseStyle, style)} {...props}>
			{children}
		</View>
	);
}
