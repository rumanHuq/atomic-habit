import { MotiView } from "moti";
import type { ViewProps } from "react-native/types";

export function Gallery({ style, ...viewProps }: ViewProps) {
	return <MotiView {...viewProps} style={style} />;
}
