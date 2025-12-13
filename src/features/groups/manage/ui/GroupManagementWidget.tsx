import { Box, Button, Typography } from '@mui/material'
import Select from 'react-select'

import { useAppDispatch } from '@/shared/hooks/redux'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'
import { ExcelUploader } from '@/shared/ui/excelUploader'
import { Preloader } from '@/shared/ui/preloader'

import { optionsForAction } from '../model/constants'
import { groupManagementColumnMap } from '../model/excelMapping'
import { clearExcel, setExcelData } from '../model/groupManagementSlice'
import type {
	ActionOption,
	CollaboratorOption,
	UploadListItem
} from '../model/types'
import { useGroupManagement } from '../model/useGroupManagement'

import { EditGroupTable } from './EditGroupTable'
import { GroupManagementErrors } from './GroupManagementErrors'
import styles from './groupManagement.module.scss'

export const GroupManagementWidget = () => {
	const dispatch = useAppDispatch()

	const {
		state,
		groups,
		filteredGroups,
		personsList,
		personsListLoading,
		collaboratorsOptions,
		collaboratorsLoading,
		manageData,
		isLoading,
		onExcelParsed,
		onActionChange,
		onCurrentGroupChange,
		onTargetGroupChange,
		onSearchChange,
		onSelectedUserChange,
		buttonText,
		submit,
		showPersonsList,
		showExcelUploader
	} = useGroupManagement()

	const {
		excelObj,
		selectedAction,
		currentGroup,
		targetGroup,
		searchString,
		selectedUser
	} = state

	const showUserSelect = excelObj.length === 0
	const showSubmitButton =
		excelObj.length > 0 || showPersonsList || !!selectedUser

	// чтобы react-select показывал выбранного руководителя корректно
	const collaboratorValue: CollaboratorOption | null = selectedUser
		? {
				value: selectedUser.id,
				label: `${selectedUser.fullname} (${selectedUser.position_name})`,
				employee: selectedUser
			}
		: null

	return (
		<div className={styles.container}>
			<Typography variant='h4' gutterBottom align='center'>
				Управление группами
			</Typography>

			<div className={styles.filters}>
				<Select<ActionOption>
					options={optionsForAction}
					placeholder='Выберите действие'
					onChange={opt => onActionChange(opt ?? null)}
					isClearable
					value={selectedAction}
				/>

				{selectedAction && (
					<>
						<Select<UploadListItem>
							options={groups}
							getOptionLabel={e => e.name}
							getOptionValue={e => e.id}
							onChange={opt => onCurrentGroupChange(opt ?? null)}
							placeholder='Выберите группу'
							value={currentGroup}
							isLoading={personsListLoading}
							isClearable
							isDisabled={personsListLoading}
							className={styles.groupSelect}
						/>

						{selectedAction.value === 'moveToGroup' && (
							<Select<UploadListItem>
								options={filteredGroups}
								getOptionLabel={e => e.name}
								getOptionValue={e => e.id}
								onChange={opt => onTargetGroupChange(opt ?? null)}
								value={targetGroup}
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
									onInputChange={onSearchChange}
									onChange={opt => onSelectedUserChange(opt ?? null)}
									inputValue={searchString}
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
						onClick={() => {
							dispatch(setExcelData([]))
							dispatch(clearExcel())
						}}
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
						{buttonText}
					</Button>
				</Box>
			)}

			{(personsListLoading || isLoading) && <Preloader />}

			<GroupManagementErrors data={manageData} className={styles.errorsBlock} />
		</div>
	)
}
