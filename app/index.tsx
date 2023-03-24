import { BackgroundFetchStatus, getStatusAsync } from "expo-background-fetch";
import { isTaskRegisteredAsync } from "expo-task-manager";
import { useState, useEffect } from "react";
import { Text, Button, View } from "react-native";

import { Page } from "@/components/SafeArea";
import { crons } from "@/constants/constants";
import { unregisterBackgroundFetchAsync, registerBackgroundFetchAsync } from "@/crons/crons";

export default function App() {
	const [isRegistered, setIsRegistered] = useState(false);
	const [status, setStatus] = useState<BackgroundFetchStatus | null>(null);
	const checkStatusAsync = async () => {
		const statusTemp = await getStatusAsync();
		const isRegisteredTemp = await isTaskRegisteredAsync(crons.TODO_REMINDERS);
		setStatus(statusTemp);
		setIsRegistered(isRegisteredTemp);
	};

	useEffect(() => {
		checkStatusAsync().catch(console.error);
	}, []);

	const toggleFetchTask = async () => {
		if (isRegistered) {
			await unregisterBackgroundFetchAsync(crons.TODO_REMINDERS);
		} else {
			await registerBackgroundFetchAsync(crons.TODO_REMINDERS);
		}

		checkStatusAsync();
	};

	return (
		<Page>
			<View>
				<Text>
					Background fetch status: <Text>{status && BackgroundFetchStatus[status]}</Text>
				</Text>
				<Text>
					Background fetch task name: <Text>{isRegistered ? crons.TODO_REMINDERS : "Not registered yet!"}</Text>
				</Text>
			</View>
			<View />ß
			<Button
				title={isRegistered ? "Unregister BackgroundFetch task" : "Register BackgroundFetch task"}
				onPress={toggleFetchTask}
			/>
		</Page>
	);
}
