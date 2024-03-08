import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AutosizeTextareaComponent } from '../../shared/ui/autosize-textarea.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RemoveItemButtonComponent } from '../../shared/ui/remove-item-button.component';
import { Task } from '../model/Task';
import { TaskUpdatePayload } from '../data-access/tasks.service';
import { CustomDatePipe } from '../../utils/pipes/custom-date.pipe';
import { NgIf } from '@angular/common';
import { bootstrapBookmark, bootstrapBookmarkFill } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    AutosizeTextareaComponent,
    NgIcon,
    RemoveItemButtonComponent,
    CustomDatePipe,
    NgIf,
  ],
  template: `
    <div
      class="rounded-md shadow-md hover:shadow-lg p-4 block"
      [class.bg-green-300]="task.done"
    >
      <button
        class="w-full"
        (click)="!editMode && handleSingleClick()"
        (dblclick)="switchToEditMode()"
      >
        <header class="flex justify-end">
          <app-remove-item-button (confirm)="delete.emit()" />
        </header>
        <section class="text-left">
          @if (editMode) {
            <app-autosize-textarea
              (keyup.escape)="editMode = false"
              (submitText)="updateTaskName($event)"
              [value]="task.name"
            />
          } @else {
            <span [class.line-through]="task.done">
              {{ task.name }}
            </span>
          }
        </section>
        <footer class=" pt-2 flex justify-between">
          <button
            class="flex items-center"
            (click)="updateTaskUrgentStatus(); $event.stopPropagation()"
          >
            <ng-icon
              [name]="task.urgent ? 'bootstrapBookmarkFill' : 'bootstrapBookmark'"
              class="text-sm"
            />
          </button>
          <div class="flex items-center justify-end">
            <span class="text-xs pr-1">{{ task.createdAt | customDate }} </span>
            <ng-icon name="featherCalendar" class="text-sm" />
          </div>
        </footer>
      </button>
    </div>
  `,
  styles: ``,
  viewProviders: [provideIcons({ bootstrapBookmarkFill, bootstrapBookmark })],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() update = new EventEmitter<TaskUpdatePayload>();
  @Output() delete = new EventEmitter<void>();

  editMode = false;

  isSingleClick = true;

  updateTaskUrgentStatus() {
    this.update.emit({ urgent: !this.task.urgent });
  }

  updateTaskName(newTaskName: string) {
    this.update.emit({ name: newTaskName });

    this.editMode = false;
  }

  handleSingleClick() {
    this.isSingleClick = true;

    setTimeout(() => {
      if (this.isSingleClick) {
        this.update.emit({ done: !this.task.done });
      }
    }, 200);
  }

  switchToEditMode() {
    this.isSingleClick = false;
    this.editMode = true;
  }
}
