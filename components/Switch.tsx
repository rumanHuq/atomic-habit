import { MotiView } from "moti";
import type { MotiTransitionProp } from "moti";
import { Pressable } from "react-native";
import type { ViewProps, PressableProps } from "react-native/types";
import { Easing } from "react-native-reanimated";

interface SwitchProps extends ViewProps, Pick<PressableProps, "onPress"> {
	size: number;
	value: boolean;
}

function switchStyles({ size }: Pick<SwitchProps, "size">) {
	const containerStyle: ViewProps["style"] = { justifyContent: "center", alignItems: "center" };
	const trackStyle: ViewProps["style"] = {
		width: size * 1.5,
		height: size * 0.4,
		borderRadius: (size * 0.4) / 2,
		position: "absolute",
	};
	const ballStyle: ViewProps["style"] = {
		width: size,
		height: size,
		backgroundColor: "#fff",
		borderRadius: size / 2,
		justifyContent: "center",
		alignItems: "center",
	};

	const knobStyle: ViewProps["style"] = {
		width: size * 0.6,
		height: size * 0.6,
		borderRadius: (size * 0.6) / 2,
		borderWidth: size * 0.1,
	};

	const transition: MotiTransitionProp = {
		type: "timing",
		duration: 150,
		easing: Easing.inOut(Easing.ease),
	};

	return { containerStyle, trackStyle, ballStyle, knobStyle, transition };
}

export function Switch({ size, onPress, value, ...containerProps }: SwitchProps) {
	const { ballStyle, containerStyle, knobStyle, trackStyle, transition } = switchStyles({ size });
	return (
		<Pressable {...{ onPress }}>
			<MotiView {...{ transition, style: containerStyle, ...containerProps }}>
				<MotiView
					{...{
						from: { backgroundColor: value ? "grey" : "purple" },
						animate: { backgroundColor: value ? "purple" : "grey" },
						style: trackStyle,
					}}
				/>
				<MotiView {...{ style: ballStyle }}>
					<MotiView
						{...{
							style: knobStyle,
							from: { borderColor: value ? "grey" : "purple" },
							animate: { borderColor: value ? "purple" : "grey" },
						}}
					/>
				</MotiView>
			</MotiView>
		</Pressable>
	);
}
