import { Layout } from "@ui-kitten/components";
import { ReactNode } from "react";
import { TouchableWithoutFeedback } from "react-native";

import { useStore } from "@/hooks/useStore";

export function Container({ children }: { children: ReactNode }) {
	const setAllDropdownVisible = useStore((state) => state.setAllDropdownVisible);

	return (
		<TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => setAllDropdownVisible(false)}>
			<Layout style={{ flex: 1, padding: 8 }}>{children}</Layout>
		</TouchableWithoutFeedback>
	);
}
