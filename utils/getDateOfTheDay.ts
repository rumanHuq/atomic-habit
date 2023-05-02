export function getDateOfTheDay() {
	const today = new Date();
	const date = today.getDate();
	const month = today.getMonth() + 1;
	const year = today.getFullYear();

	return `${year}-${month}-${date > 9 ? date : `0${date}`}`;
}
