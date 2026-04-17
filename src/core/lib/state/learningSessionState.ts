import { proxy } from 'valtio';

import type { Id } from 'core/lib/apiClient/endpoints/types/basemodel';

export const learningSessionState = proxy({
  learningSetId: undefined as Id | undefined,
});

export const setLearningSetId = (id: Id | undefined) => {
  learningSessionState.learningSetId = id;
};
