import { inject, Injectable } from '@angular/core';
import { Task } from '../model/Task';
import { HttpClient } from '@angular/common/http';
import { TasksStateService } from './tasks.state.service';
import { tap } from 'rxjs';

export type TaskUpdatePayload = { name?: string; done?: boolean; urgent?: boolean };

export type GetAllTasksSearchParams = {
  q: string;
  _sort: 'createdAt';
  _order: 'desc' | 'asc';
  done_like: 'true' | 'false' | '';
  urgent_like: 'true' | '';
};
@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private URL = 'http://localhost:3000';

  private http = inject(HttpClient);
  private state = inject(TasksStateService);

  // HttpClient request methods return cold observable which means it is getting automatically unsubscribed once data is received so we don't have to unsubscribe explicitly
  getAll(searchParams: GetAllTasksSearchParams) {
    return this.http
      .get<Task[]>(`${this.URL}/tasks`, {
        //observe : "response" - then get returns whole HttpResponse not Task[]
        params: searchParams,
      })
      .pipe(
        tap((response) => {
          this.state.setTaskList(response);
        }),
      );
  }

  getAllByProjectId(projectId: string, searchParams: GetAllTasksSearchParams) {
    return this.http
      .get<Task[]>(`${this.URL}/tasks`, {
        params: { ...searchParams, projectId },
      })
      .pipe(
        tap((response) => {
          this.state.setTaskList(response);
        }),
      );
  }

  delete(taskId: number) {
    return this.http.delete(`${this.URL}/tasks/${taskId}`).pipe(
      tap(() => {
        this.state.removeTask(taskId);
      }),
    );
  }

  update(taskId: number, payload: TaskUpdatePayload) {
    return this.http.patch<Task>(`${this.URL}/tasks/${taskId}`, payload).pipe(
      tap((task) => {
        this.state.updateTask(task);
      }),
    );
  }

  add(name: string) {
    return this.http.post<Task>(`${this.URL}/tasks`, { name }).pipe(
      tap((task) => {
        this.state.addTask(task);
      }),
    );
  }
}
