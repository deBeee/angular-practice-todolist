import { Component, inject, Input } from '@angular/core';
import { Task } from '../model/Task';
import { NgFor, NgIf } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherCalendar } from '@ng-icons/feather-icons';
import { RemoveItemButtonComponent } from '../../shared/ui/remove-item-button.component';
import { AutosizeTextareaComponent } from '../../shared/ui/autosize-textarea.component';
import { TasksService, TaskUpdatePayload } from '../data-access/tasks.service';
import { TaskCardComponent } from './task-card.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  viewProviders: [provideIcons({ featherCalendar })],
  imports: [
    NgFor,
    NgIconComponent,
    NgIf,
    RemoveItemButtonComponent,
    AutosizeTextareaComponent,
    TaskCardComponent,
  ],
  template: `
    <ul>
      <li *ngFor="let task of tasks" class="mb-2">
        <app-task-card
          [task]="task"
          (update)="updateTask(task.id, $event)"
          (delete)="deleteTask(task.id)"
        />
      </li>
    </ul>
  `,
  styles: [],
})
export class TasksListComponent {
  @Input({ required: true }) tasks: Task[] = [];

  private tasksService = inject(TasksService);

  deleteTask(taskId: string) {
    this.tasksService.delete(taskId).then((response) => {
      if (response instanceof Error) {
        alert(response.message);
      } else {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
      }
    });
  }

  updateTask(taskId: string, newTaskPayload: TaskUpdatePayload) {
    this.tasksService.update(taskId, newTaskPayload).then((response) => {
      if ('id' in response) {
        this.tasks = this.tasks.map((task) => {
          if (task.id === taskId) {
            return response;
          }
          return task;
        });
      } else {
        alert(response.message);
      }
    });
  }
}
