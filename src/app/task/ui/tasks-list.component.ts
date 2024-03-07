import { Component, inject, Input } from '@angular/core';
import { Task } from '../model/Task';
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
    NgIconComponent,
    RemoveItemButtonComponent,
    AutosizeTextareaComponent,
    TaskCardComponent,
  ],
  template: `
    <ul>
      @for (task of tasks; track task.id) {
        <li class="mb-2">
          <app-task-card
            [task]="task"
            (update)="updateTask(task.id, $event)"
            (delete)="deleteTask(task.id)"
          />
        </li>
      } @empty {
        <p>There are no tasks</p>
      }
    </ul>
  `,
  styles: [],
})
export class TasksListComponent {
  @Input({ required: true }) tasks: Task[] = [];

  private tasksService = inject(TasksService);

  deleteTask(taskId: number) {
    this.tasksService.delete(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
      },
      error: (err) => {
        alert(err.message);
      },
    });
  }

  updateTask(taskId: number, taskUpdatePayload: TaskUpdatePayload) {
    this.tasksService.update(taskId, taskUpdatePayload).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map((task) => {
          if (task.id === updatedTask.id) {
            return updatedTask;
          } else {
            return task;
          }
        });
      },
      error: (err) => {
        alert(err.message);
      },
    });
  }
}
