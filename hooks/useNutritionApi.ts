import { NUTRITION_API_KEY } from "@env";
import { useQuery } from "@tanstack/react-query";

interface NutritionApiResolved {
	name: string;
	calories: number;
	serving_size_g: number;
	fat_total_g: number;
	fat_saturated_g: number;
	protein_g: number;
	sodium_mg: number;
	potassium_mg: number;
	cholesterol_mg: number;
	carbohydrates_total_g: number;
	fiber_g: number;
	sugar_g: number;
}

export function useNutritionApi(searchTerm: string) {
	const query = searchTerm.toLowerCase();
	return useQuery<NutritionApiResolved[]>(
		["nutrition", query],
		async () => {
			const controller = new AbortController();
			const { signal } = controller;
			const promise = new Promise((resolve) => {
				setTimeout(resolve, 1000);
			}).then(() =>
				fetch(`https://api.api-ninjas.com/v1/nutrition?query=${query}`, {
					method: "GET",
					headers: { "X-Api-Key": NUTRITION_API_KEY },
					// @ts-expect-error
					contentType: "application/json",
					signal,
				}).then((d) => d.json())
			);
			// @ts-expect-error
			promise.cancel = () => {
				controller.abort();
			};

			return promise;
		},
		{ enabled: searchTerm?.length > 0 }
	);
}
