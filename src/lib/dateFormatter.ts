export const formatDate = (date: Date | null) => {
	if (date) {
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		return `${year}-${month}-${day}`
	} else {
		return date
	}
}
