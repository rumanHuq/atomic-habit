import { NUTRITION_API_KEY } from "@env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "use-debounce";

import { NutritionData } from "@/@types/@types";
import mockData from "@/NutritionData.json";
import { readFile, writeFile } from "@/utils/fileSystem";

function newAbortSignal(timeoutMs: number) {
	const abortController = new AbortController();
	setTimeout(() => abortController.abort(), timeoutMs);

	return abortController.signal;
}

const environment = process.env;

export function useNutritionApi(searchTerm = "") {
	const [query] = useDebounce(searchTerm.toLowerCase().trim(), 1000);
	/**
	 * 1. create a file which stores all the calories in json
	 * 2. first check if food info exists in the calories file
	 * 3. if exists return, otherwise do a fetch call
	 */
	return useQuery<NutritionData[]>(
		["nutrition", query],
		async () => {
			const file = await readFile();
			if (file[query]) {
				console.log("found in file system");
				return file[query];
			}

			if (environment.NODE_ENV === "development") {
				console.log("loading from mock data");
				const data = mockData[query] ?? [];
				await writeFile({ [query]: data });
				return data;
			}

			const { data } = await axios.get(`https://api.api-ninjas.com/v1/nutrition?query=${query}`, {
				headers: { "X-Api-Key": NUTRITION_API_KEY },
				// @ts-expect-error
				contentType: "application/json",
				signal: newAbortSignal(1000),
			});
			await writeFile({ [query]: data });
			return data;
		},
		{
			enabled: query?.length > 0,
			retry: false,
		}
	);
}
