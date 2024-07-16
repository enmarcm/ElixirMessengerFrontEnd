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
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: '/tabs/chats',
        pathMatch: 'full',
      },
      {
        path: 'chat/:idUser',
        loadComponent: () =>
          import('../chat/chat.page').then((m) => m.ChatPage),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/chats',
    pathMatch: 'full',
  },
];
