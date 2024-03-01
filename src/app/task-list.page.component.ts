import { Component } from '@angular/core';
import { TasksListComponent } from './tasks-list.component';
import { SubmitTextComponent } from './submit-text.component';
import { Task } from './Task';
import { NgIf } from '@angular/common';

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

    <ng-template #loadingTemplate>
      <p>Loading...</p>
    </ng-template>
  `,
})
export class TaskListPageComponent {
  tasks: Task[] = [];

  loading = false;

  private readonly URL = 'http://localhost:3000';

  constructor() {
    this.loading = true;
    fetch(`${this.URL}/tasks`)
      .then<Task[]>((response) => {
        return response.json();
      })
      .then((response) => {
        setTimeout(() => {
          this.tasks = response;
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
