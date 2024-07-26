import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'chats',
        loadComponent: () =>
          import('../chats/chats.page').then((m) => m.ChatsPage),
      },
      {
        path: 'statuses',
        loadComponent: () =>
          import('../statuses/statuses.page').then((m) => m.StatusesPage),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('../groups/groups.page').then((m) => m.GroupsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/chats',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/chats',
    pathMatch: 'full',
  },
];
