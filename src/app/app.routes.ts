import { Routes } from '@angular/router';
import { ProjectListPageComponent } from './project/project-list.page.component';
import { TaskListPageComponent } from './task/task-list.page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'projects',
    component: ProjectListPageComponent,
    title: 'Projects',
  },
  {
    path: 'tasks',
    title: 'Tasks',
    children: [
      {
        path: '',
        component: TaskListPageComponent,
      },
      {
        path: 'urgent',
        title: 'Urgent tasks',
        data: {
          urgent: true,
        },
        component: TaskListPageComponent,
      },
      {
        path: ':projectId',
        title: 'Project tasks',
        component: TaskListPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
