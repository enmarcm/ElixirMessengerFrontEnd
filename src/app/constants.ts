export const BASE_URL = 'http://localhost:9090';

export enum URL_REQUEST {
  LOGIN = `${BASE_URL}/auth/login`,
  CHATS = `${BASE_URL}/messages/getAllChats`,
  ADD_MESSAGE = `${BASE_URL}/messages/addMessage`,
  GET_MESSAGES_CHAT = `${BASE_URL}/messages/getMessages`,
}
