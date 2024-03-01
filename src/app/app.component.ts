import { Component } from '@angular/core';
import { TasksListComponent } from './tasks-list.component';
import { SubmitTextComponent } from './submit-text.component';
import { TaskListPageComponent } from './task-list.page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TasksListComponent, SubmitTextComponent, TaskListPageComponent],

  template: `
    <h1 class="text-orange-500 bg-black py-4 text-xl text-center mb-4">
      Another boring todolist
    </h1>
    <main class="grid place-items-center pt-4">
      <app-task-list-page />
    </main>
  `,
})
export class AppComponent {
  tasks = [
    {
      name: 'Angular introduction',
      done: false,
    },
    {
      name: 'Learn components',
      done: true,
    },
  ];

  addTask(name: string) {
    this.tasks.push({
      name,
      done: false,
    });
  }
}
