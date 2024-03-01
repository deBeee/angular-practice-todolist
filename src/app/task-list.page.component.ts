import { Component } from '@angular/core';
import { TasksListComponent } from './tasks-list.component';
import { SubmitTextComponent } from './submit-text.component';
import { Task } from './Task';
import { NgIf } from '@angular/common';

type ListFetchingError = { status: number; message: string };

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
type ComponentListState = IdleState | LoadingState | SuccessState | ErrorState;

const URL = 'http://localhost:3000';

async function wait(time = 1200) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
}

async function getTasks() {
  await wait();

  return fetch(`${URL}/tasks`).then<Task[] | ListFetchingError>((response) => {
    if (response.ok) {
      return response.json();
    }
    return { status: response.status, message: response.statusText };
  });
}

async function addTask(name: string) {
  await wait();

  return fetch(`${URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      createdAt: new Date().getTime(),
      name,
      done: false,
    } as Task),
  }).then<Task | Error>((response) => {
    if (response.ok) {
      return response.json();
    }
    return new Error('Cant add task');
  });
}

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
  listState: ComponentListState = { state: 'idle' };

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
