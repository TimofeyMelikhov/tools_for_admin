import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ExcelPreviewTable } from './ExcelPreviewTable'

describe('ExcelPreviewTable', () => {
	it('does not render an empty preview', () => {
		const { container } = render(<ExcelPreviewTable data={[]} />)

		expect(container).toBeEmptyDOMElement()
	})

	it('renders mapped headers and values', () => {
		render(
			<ExcelPreviewTable
				data={[{ fullname: 'Иван Иванов', position: 'Разработчик' }]}
				columnMap={[
					['Сотрудник', 'fullname'],
					['Должность', 'position']
				]}
			/>
		)

		expect(screen.getByText('Сотрудник')).toBeInTheDocument()
		expect(screen.getByText('Иван Иванов')).toBeInTheDocument()
		expect(screen.getByText('Всего строк: 1')).toBeInTheDocument()
	})
})
