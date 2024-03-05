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

  constructor() {}

  getAll(searchParams: GetAllTasksSearchParams) {
    return this.http.get<Task[]>(`${this.URL}/tasks`, {
      //observe : "response" - then get returns whole HttpResponse not Task[]
      params: searchParams,
    });
  }

  delete(taskId: string) {
    return this.http.delete(`${this.URL}/tasks/${taskId}`);
  }

  update(taskId: string, payload: TaskUpdatePayload) {
    return this.http.patch<Task>(`${this.URL}/tasks/${taskId}`, payload);
  }

  add(name: string) {
    return this.http.post<Task>(`${this.URL}/tasks`, { name, done: false });
  }
}
