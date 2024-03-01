import { Task } from './Task';
import { wait } from './wait';
import { ListFetchingError } from './list-state.type';

const URL = 'http://localhost:3000';

export async function getTasks() {
  await wait();

  return fetch(`${URL}/tasks`).then<Task[] | ListFetchingError>((response) => {
    if (response.ok) {
      return response.json();
    }
    return { status: response.status, message: response.statusText };
  });
}

export async function addTask(name: string) {
  await wait();

  return fetch(`${URL}/tasks`, {
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
