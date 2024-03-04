import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AutosizeTextareaComponent } from '../../ui/autosize-textarea.component';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { RemoveItemButtonComponent } from '../../ui/remove-item-button.component';
import { Task } from '../model/Task';
import { TaskUpdatePayload } from '../data-access/tasks.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [AutosizeTextareaComponent, NgIcon, NgIf, RemoveItemButtonComponent],
  template: `
    <div class="rounded-md shadow-md p-4 block" [class.bg-green-300]="task.done">
      <button
        class="w-full"
        (click)="!editMode && handleSingleClick()"
        (dblclick)="switchToEditMode()"
      >
        <header class="flex justify-end">
          <app-remove-item-button (confirm)="delete.emit()" />
        </header>
        <section class="text-left">
          <app-autosize-textarea
            *ngIf="editMode; else previewModeTemplate"
            (keyup.escape)="editMode = false"
            (submitText)="updateTaskName($event)"
            [value]="task.name"
          />

          <ng-template #previewModeTemplate>
            <span [class.line-through]="task.done">
              {{ task.name }}
            </span>
          </ng-template>
        </section>
        <footer class=" pt-2 flex items-center justify-end">
          <ng-icon name="featherCalendar" class="text-sm" />
        </footer>
      </button>
    </div>
  `,
  styles: ``,
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() update = new EventEmitter<TaskUpdatePayload>();
  @Output() delete = new EventEmitter<void>();

  editMode = false;

  isSingleClick = true;

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
