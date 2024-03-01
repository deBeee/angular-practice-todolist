import { Component } from '@angular/core';
import { TasksListComponent } from './tasks-list.component';
import { SubmitTextComponent } from './submit-text.component';
import { Task } from './Task';
import { NgIf } from '@angular/common';
import { getTasks, addTask } from './tasks.service';
import { ComponentListState } from './list-state.type';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [TasksListComponent, SubmitTextComponent, NgIf],
  template: `
    <app-submit-text
      (submitText)="listState.state === 'success' && addTask($event, listState.results)"
    />
    <app-tasks-list
      *ngIf="listState.state === 'success'"
      class="block mt-4"
      [tasks]="listState.results"
    />
    <p *ngIf="listState.state === 'error'">{{ listState.error.message }}</p>
    <p *ngIf="listState.state === 'loading'">Loading...</p>
  `,
})
export class TaskListPageComponent {
  listState: ComponentListState<Task> = { state: 'idle' };

  constructor() {
    this.listState = { state: 'loading' };
    getTasks().then((response) => {
      if (Array.isArray(response)) {
        this.listState = {
          state: 'success',
          results: response,
        };
      } else {
        this.listState = {
          state: 'error',
          error: response,
        };
      }
    });
  }

  addTask(name: string, tasks: Task[]) {
    addTask(name).then((response) => {
      if ('id' in response) {
        this.listState = {
          state: 'success',
          results: tasks.concat(response),
        };
      } else {
        alert(response.message);
      }
    });
  }
}
