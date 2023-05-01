import { Layout } from "@ui-kitten/components";
import { ReactNode } from "react";
import { TouchableWithoutFeedback } from "react-native";

import { useStore } from "@/hooks/useStore";

export function Container({ children }: { children: ReactNode }) {
	const setDropdownVisible = useStore((state) => state.setDropdownVisible);

	return (
		<TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => setDropdownVisible(false)}>
			<Layout style={{ flex: 1, padding: 8 }}>{children}</Layout>
		</TouchableWithoutFeedback>
	);
}
