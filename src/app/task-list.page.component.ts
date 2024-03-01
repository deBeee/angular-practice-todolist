import { Component } from '@angular/core';
import { TasksListComponent } from './tasks-list.component';
import { SubmitTextComponent } from './submit-text.component';
import { Task } from './Task';
import { NgIf } from '@angular/common';

type ListFetchingError = { status: number; message: string };

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [TasksListComponent, SubmitTextComponent, NgIf],
  template: `
    <app-submit-text (submitText)="addTask($event)" />
    <app-tasks-list
      *ngIf="!loading; else loadingTemplate"
      class="block mt-4"
      [tasks]="tasks"
    />

    <p *ngIf="error">{{ error.message }}</p>

    <ng-template #loadingTemplate>
      <p>Loading...</p>
    </ng-template>
  `,
})
export class TaskListPageComponent {
  tasks: Task[] = [];

  loading = false;
  error?: ListFetchingError;
  private readonly URL = 'http://localhost:3000';

  constructor() {
    this.loading = true;
    fetch(`${this.URL}/tasks`)
      .then<Task[] | ListFetchingError>((response) => {
        if (response.ok) {
          return response.json();
        }
        return { status: response.status, message: response.statusText };
      })
      .then((response) => {
        setTimeout(() => {
          if (Array.isArray(response)) {
            this.tasks = response;
          } else {
            this.error = response;
          }
          this.loading = false;
        }, 1200);
      });
  }

  addTask(name: string) {
    // this.tasks.push({
    //   name,
    //   done: false,
    // });
  }
}
