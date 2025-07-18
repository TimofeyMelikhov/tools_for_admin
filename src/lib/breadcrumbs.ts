const pathNames: Record<string, string> = {
	TrainingManagement: 'Управление обучением',
	RewardsUpdate: 'Обновление наград',
	MentorProfile: 'Профиль наставника'
}

export const getDisplayName = (path: string) => pathNames[path] || path
