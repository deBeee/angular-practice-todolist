import { Injectable } from '@angular/core';
import { Task } from '../model/Task';
import { ListFetchingError } from '../../utils/list-state.type';
import { wait } from '../../utils/wait';

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

  async getAll(searchParams: GetAllTasksSearchParams) {
    await wait();

    const url = new URL('/tasks', this.URL); // equivalent `${this.URL}/tasks`
    url.search = new URLSearchParams(searchParams).toString();

    return fetch(url).then<Task[] | ListFetchingError>((response) => {
      if (response.ok) {
        return response.json();
      }

      return { status: response.status, message: response.statusText };
    });
  }

  async delete(taskId: string) {
    return fetch(`${this.URL}/tasks/${taskId}`, {
      method: 'DELETE',
    }).then<Error | undefined>((response) => {
      if (response.ok) {
        return response.json();
      }

      return new Error('Cant delete task');
    });
  }

  async update(taskId: string, payload: TaskUpdatePayload) {
    return fetch(`${this.URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then<Task | Error>((response) => {
      if (response.ok) {
        return response.json();
      }

      return new Error('Cant update task');
    });
  }

  async add(name: string) {
    await wait();

    return fetch(`${this.URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        createdAt: new Date().getTime(),
        name,
        done: false,
      } as Task),
    }).then<Task | Error>((response) => {
      if (response.ok) {
        return response.json();
      }

      return new Error('Cant add task');
    });
  }
}
