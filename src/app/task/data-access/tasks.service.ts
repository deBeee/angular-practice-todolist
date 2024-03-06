import { inject, Injectable } from '@angular/core';
import { Task } from '../model/Task';
import { HttpClient } from '@angular/common/http';

export type TaskUpdatePayload = { name?: string; done?: boolean };

export type GetAllTasksSearchParams = {
  q: string;
  _sort: 'createdAt';
  _order: 'desc' | 'asc';
  done_like: 'true' | 'false' | '';
};
@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private URL = 'http://localhost:3000';

  private http = inject(HttpClient);

  // HttpClient request methods return cold observable which means it is getting automatically unsubscribed once data is received so we don't have to unsubscribe explicitly
  getAll(searchParams: GetAllTasksSearchParams) {
    return this.http.get<Task[]>(`${this.URL}/tasks`, {
      //observe : "response" - then get returns whole HttpResponse not Task[]
      params: searchParams,
    });
  }

  getAllByProjectId(projectId: string, searchParams: GetAllTasksSearchParams) {
    return this.http.get<Task[]>(`${this.URL}/tasks`, {
      params: { ...searchParams, projectId },
    });
  }

  delete(taskId: number) {
    return this.http.delete(`${this.URL}/tasks/${taskId}`);
  }

  update(taskId: number, payload: TaskUpdatePayload) {
    return this.http.patch<Task>(`${this.URL}/tasks/${taskId}`, payload);
  }

  add(name: string) {
    return this.http.post<Task>(`${this.URL}/tasks`, { name });
  }
}
