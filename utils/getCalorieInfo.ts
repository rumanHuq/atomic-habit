import { TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";

interface GetCalorieInfoProps {
	foodItem: (TAutocompleteDropdownItem & Record<string, unknown>) | null;
	gram: string;
}

export function getCalorieInfo(props: GetCalorieInfoProps) {
	const { foodItem, gram } = props;
	if (!gram || typeof foodItem?.serving !== "string" || typeof foodItem?.calories !== "string") return 0;

	const gramInt = parseFloat(gram.replace(",", "."));

	const quantity = (foodItem.serving.match(/[0-9]+\s(g|ml)/) ?? [])[0]?.split(" ")[0];
	if (!quantity) return 0;
	const gramFloat = parseFloat(quantity.replace(",", "."));
	const calories = parseFloat(foodItem.calories.split(" ")[0].replace(",", "."));
	const calorie = (calories * gramInt) / gramFloat;
	return calorie;
}
