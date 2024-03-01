import { Task } from './Task';

export type ListFetchingError = { status: number; message: string };

// idle - initial
type IdleState = {
  state: 'idle';
};
// loading
type LoadingState = {
  state: 'loading';
};
// success
type SuccessState = {
  state: 'success';
  results: Task[];
};
// error
type ErrorState = {
  state: 'error';
  error: ListFetchingError;
};
export type ComponentListState = IdleState | LoadingState | SuccessState | ErrorState;
