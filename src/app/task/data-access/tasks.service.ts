import { inject, Injectable } from '@angular/core';
import { TasksStateService } from './tasks.state.service';
import { tap } from 'rxjs';
import {
  GetAllTasksSearchParams,
  TasksApiService,
  TaskUpdatePayload,
} from './tasks.api.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private httpService = inject(TasksApiService);
  private state = inject(TasksStateService);

  getAll(searchParams: GetAllTasksSearchParams) {
    return this.httpService.getAll(searchParams).pipe(
      tap((response) => {
        this.state.setTaskList(response);
      }),
    );
  }

  getAllByProjectId(projectId: string, searchParams: GetAllTasksSearchParams) {
    return this.httpService.getAllByProjectId(projectId, searchParams).pipe(
      tap((response) => {
        this.state.setTaskList(response);
      }),
    );
  }

  delete(taskId: number) {
    return this.httpService.delete(taskId).pipe(
      tap(() => {
        this.state.removeTask(taskId);
      }),
    );
  }

  update(taskId: number, payload: TaskUpdatePayload) {
    return this.httpService.update(taskId, payload).pipe(
      tap((task) => {
        this.state.updateTask(task);
      }),
    );
  }

  add(name: string) {
    return this.httpService.add(name).pipe(
      tap((task) => {
        this.state.addTask(task);
      }),
    );
  }
}
