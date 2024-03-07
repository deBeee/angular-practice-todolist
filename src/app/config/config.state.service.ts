import { Injectable, signal } from '@angular/core';

export type TasksListView = 'list' | 'kanban';

@Injectable({
  providedIn: 'root',
})
export class AppConfigStateService {
  tasksListView = signal<TasksListView>('list');
}
