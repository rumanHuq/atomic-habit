import { BackgroundFetchResult, registerTaskAsync, unregisterTaskAsync } from "expo-background-fetch";
import { defineTask } from "expo-task-manager";

import { crons } from "@/constants/constants";

Object.values(crons).forEach((cron) => {
	defineTask(cron, async () => {
		// get all the tasks from sqlite table
		// set notification
		// remove the entry when a task is executed in notification handler

		return BackgroundFetchResult.NewData;
	});
});

export async function registerBackgroundFetchAsync(cron: keyof typeof crons) {
	return registerTaskAsync(cron, {
		minimumInterval: 60 * 15, // 15 minutes
		stopOnTerminate: false, // android only,
		startOnBoot: true, // android only
	});
}

export async function unregisterBackgroundFetchAsync(cron: keyof typeof crons) {
	return unregisterTaskAsync(cron);
}
