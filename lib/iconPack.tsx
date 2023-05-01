// https://akveo.github.io/react-native-ui-kitten/docs/guides/icon-packages#3rd-party-icon-packages
import { Feather } from "@expo/vector-icons";

function createIconsMap() {
	return new Proxy(
		{},
		{
			get(_, name) {
				return { toReactElement: (props: any) => <Feather {...props} name={name} /> };
			},
		}
	);
}

export const FeatherIconsPack = {
	name: "feather",
	icons: createIconsMap(),
};
