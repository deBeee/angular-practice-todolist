import { Injectable, signal } from '@angular/core';

export type TasksListView = 'list' | 'kanban';

type AppConfigState = {
  tasksListView: TasksListView;
};
@Injectable({
  providedIn: 'root',
})
export class AppConfigStateService {
  private state = signal<AppConfigState>({
    tasksListView: 'list',
  });

  $value = this.state.asReadonly(); //access point to state

  updateTaskListView(value: TasksListView) {
    this.state.update((state) => {
      return {
        ...state,
        tasksListView: value,
      };
    });
  }
}
