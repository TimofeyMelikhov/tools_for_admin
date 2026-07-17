import { useMutation } from '@tanstack/react-query'

import { uploadQuestions } from '../api/uploadingQuestionsApi'

export const useUploadingQuestionsMutation = () =>
	useMutation({ mutationFn: uploadQuestions })
