import { documentDirectory, readAsStringAsync, writeAsStringAsync, getInfoAsync, deleteAsync } from "expo-file-system";

import { NutritionData } from "@/@types/@types";

const fileName = `${documentDirectory}calories.json`;
const environment = process.env;

export async function readFile(): Promise<Record<string, NutritionData[]>> {
	const content = await readAsStringAsync(fileName);
	return JSON.parse(content);
}

export async function writeFile(data: Record<string, NutritionData[]>) {
	const file = await readFile();
	const [key, value] = Object.entries(data)[0];
	file[key] = value;
	await writeAsStringAsync(fileName, JSON.stringify(file));

	return readFile();
}

export async function createFile() {
	const fileExists = (await getInfoAsync(fileName)).exists;
	if (!fileExists) {
		await writeAsStringAsync(fileName, JSON.stringify({}));
	} else if (environment.NODE_ENV === "development") {
		await deleteAsync(fileName);
		await writeAsStringAsync(fileName, JSON.stringify({}));
	}
}
