import { useMemo } from 'react'

import { Box, Button, Typography } from '@mui/material'
import Select from 'react-select'

import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'
import { ExcelUploader } from '@/shared/ui/excelUploader'
import { Preloader } from '@/shared/ui/preloader'

import { groupManagementColumnMap } from '../model/excelMapping'
import type {
	CollaboratorOption,
	GroupAction,
	UploadListItem
} from '../model/types'
import { useGroupManagement } from '../model/useGroupManagement'

import { EditGroupTable } from './EditGroupTable'
import { GroupManagementErrors } from './GroupManagementErrors'
import styles from './groupManagement.module.scss'

type Props = {
	forcedAction?: GroupAction
	title?: string
	submitText?: string
}

export const GroupManagementWidget = ({
	forcedAction,
	title = 'Управление группами',
	submitText
}: Props) => {
	const {
		state,
		groups,
		groupsLoading,
		filteredGroups,
		personsList,
		personsListLoading,
		collaboratorsOptions,
		collaboratorsLoading,
		manageData,
		isLoading,
		onExcelParsed,
		onCurrentGroupChange,
		onTargetGroupChange,
		onSearchChange,
		onSelectedUserChange,
		onSelectedUsersChange,
		clearExcel,
		buttonText,
		submit,
		showPersonsList,
		showExcelUploader
	} = useGroupManagement(forcedAction)

	const { excelObj, selectedAction, currentGroup, targetGroup, selectedUser } =
		state

	const showUserSelect = excelObj.length === 0
	const showSubmitButton =
		!!currentGroup && (excelObj.length > 0 || showPersonsList || !!selectedUser)

	const collaboratorValue: CollaboratorOption | null = useMemo(() => {
		if (!selectedUser) return null
		return {
			value: selectedUser.id,
			label: `${selectedUser.fullname} (${selectedUser.position_name})`,
			employee: selectedUser
		}
	}, [selectedUser])

	const currentGroupValue: UploadListItem | null = useMemo(() => {
		if (!currentGroup) return null
		return groups.find(g => g.id === currentGroup.id) ?? currentGroup
	}, [groups, currentGroup])

	const targetGroupValue: UploadListItem | null = useMemo(() => {
		if (!targetGroup) return null
		return filteredGroups.find(g => g.id === targetGroup.id) ?? targetGroup
	}, [filteredGroups, targetGroup])

	return (
		<div className={styles.container}>
			<Typography variant='h4' gutterBottom align='center'>
				{title}
			</Typography>

			<div className={styles.filters}>
				{selectedAction && (
					<>
						<Select<UploadListItem>
							options={groups}
							getOptionLabel={e => e.name}
							getOptionValue={e => e.id}
							onChange={opt => onCurrentGroupChange(opt ?? null)}
							placeholder='Выберите группу'
							value={currentGroupValue}
							isLoading={groupsLoading}
							isClearable
							isDisabled={groupsLoading}
							className={styles.groupSelect}
						/>

						{selectedAction.value === 'moveToGroup' && (
							<Select<UploadListItem>
								options={filteredGroups}
								getOptionLabel={e => e.name}
								getOptionValue={e => e.id}
								onChange={opt => onTargetGroupChange(opt ?? null)}
								value={targetGroupValue}
								placeholder='Выберите целевую группу'
								isClearable
								className={styles.groupSelect}
							/>
						)}

						{showUserSelect &&
							(selectedAction.value === 'installLeader' ||
								selectedAction.value === 'addToGroup') && (
								<Select<CollaboratorOption>
									options={collaboratorsOptions}
									onInputChange={(val, meta) => onSearchChange(val, meta)}
									onChange={opt => onSelectedUserChange(opt ?? null)}
									value={collaboratorValue}
									isLoading={collaboratorsLoading}
									isClearable
									isSearchable
									placeholder='Введите ФИО сотрудника...'
									loadingMessage={() => 'Поиск сотрудников...'}
									styles={{
										control: base => ({ ...base, minWidth: '260px' })
									}}
								/>
							)}
					</>
				)}

				{showExcelUploader && (
					<ExcelUploader
						onSuccess={onExcelParsed}
						columnMap={groupManagementColumnMap}
					/>
				)}

				{!!excelObj.length && (
					<Button
						variant='contained'
						component='span'
						sx={{ fontSize: '14px' }}
						onClick={clearExcel}
					>
						Очистить таблицу
					</Button>
				)}
			</div>

			{!!excelObj.length && (
				<ExcelPreviewTable
					data={excelObj}
					columnMap={groupManagementColumnMap}
				/>
			)}

			{showPersonsList && personsList && (
				<EditGroupTable
							personsList={personsList}
							mode={selectedAction?.value === 'installLeader' ? 'view' : 'select'}
							selectedUsers={state.selectedUsers}
							onSelectedUsersChange={onSelectedUsersChange}
				/>
			)}

			{showSubmitButton && (
				<Box sx={{ display: 'flex', gap: 2 }}>
					<Button
						variant='contained'
						onClick={submit}
						sx={{ mt: 2, mb: 2, ml: 'auto', fontSize: '14px' }}
						disabled={isLoading}
					>
						{submitText ?? buttonText}
					</Button>
				</Box>
			)}

			{(personsListLoading || isLoading) && <Preloader />}

			<GroupManagementErrors data={manageData} className={styles.errorsBlock} />
		</div>
	)
}
