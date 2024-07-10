export const ChatsPageMock: Array<ChatInterface> = [
  {
    id: 'Chat 1',
    avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Chat 1',
    lastMessage: 'Último mensaje del chat 1',
    lastMessageDate: new Date(),
    unreadCount: 2,
  },
  {
    id: 'Chat 2',
    avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Chat 2',
    lastMessage: 'Último mensaje del chat 2',
    lastMessageDate: new Date(),
    unreadCount: 0,
  },
  {
    id: 'Chat 3',
    avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Chat 3',
    lastMessage: 'Último mensaje del chat 3',
    lastMessageDate: new Date(),
    unreadCount: 5,
  },
  {
    id: 'Chat 4',
    avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Chat 4',
    lastMessage: 'Último mensaje del chat 4',
    lastMessageDate: new Date(),
    unreadCount: 1,
  },
  {
    id: 'Chat 5',
    avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Chat 5',
    lastMessage: 'Último mensaje del chat 5',
    lastMessageDate: new Date(),
    unreadCount: 3,
  },
  {
    id: 'Chat 6',
    avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Chat 6',
    lastMessage: 'Último mensaje del chat 6',
    lastMessageDate: new Date(),
    unreadCount: 0,
  },
  {
    id: 'Chat 7',
    avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Chat 7',
    lastMessage: 'Último mensaje del chat 7',
    lastMessageDate: new Date(),
    unreadCount: 4,
  },
  {
    id: 'Chat 8',
    avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Chat 8',
    lastMessage: 'Último mensaje del chat 8',
    lastMessageDate: new Date(),
    unreadCount: 0,
  },
  {
    id: 'Chat 9',
    avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Chat 9',
    lastMessage: 'Último mensaje del chat 9',
    lastMessageDate: new Date(),
    unreadCount: 6,
  },
  {
    id: 'Chat 10',
    avatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Chat 10',
    lastMessage: 'Último mensaje del chat 10',
    lastMessageDate: new Date(),
    unreadCount: 0,
  },
];

interface ChatInterface {
  id: string;
  avatar: string;
  name: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
}
