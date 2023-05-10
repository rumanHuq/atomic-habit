import type { IconProps } from "@ui-kitten/components";
import { Icon, Text, useTheme } from "@ui-kitten/components";
import { View } from "react-native";

interface CalendarIconProps extends IconProps {
	day: number;
	position?: [number | undefined, number | undefined, number | undefined, number | undefined];
	dayFontSize?: number;
}

export function CalenderIcon({ day, dayFontSize, position, ...props }: CalendarIconProps) {
	const theme = useTheme();
	const [top, right, bottom, left] = position ?? [];

	return (
		<View>
			<Icon name="calendar" size={42} {...props} color={props.color ?? theme["text-primary-focus-color"]} />
			<Text
				style={{
					fontSize: dayFontSize,
					color: props.color ?? (props.focused ? theme["text-primary-color"] : theme["text-disabled-color"]),
					position: "absolute",
					top,
					right,
					bottom,
					left,
				}}
				category="label">
				{day > 9 ? day : `0${day}`}
			</Text>
		</View>
	);
}
