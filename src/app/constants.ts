// export const BASE_URL = 'http://localhost:9090';
export const BASE_URL = 'https://elixirbackend-production.up.railway.app';

export enum URL_REQUEST {
  LOGIN = `${BASE_URL}/auth/login`,
  CHATS = `${BASE_URL}/messages/getAllChats`,
  ADD_MESSAGE = `${BASE_URL}/messages/addMessage`,
  GET_MESSAGES_CHAT = `${BASE_URL}/messages/getMessages`,
  GET_USER_INFO = `${BASE_URL}/profile/info`,
  CREATE_CHAT = `${BASE_URL}/messages/addChat`,
  VERIFY_CHAT = `${BASE_URL}/messages/verifyChatUser`,
  GET_USER_CHATS = `${BASE_URL}/messages/getUserChats`,
  GET_CONTACTS = `${BASE_URL}/contacts/getAllContacts`,
  USER_EXIST = `${BASE_URL}/profile/info/userExist`,
  ADD_CONTACT = `${BASE_URL}/contacts/addContact`,
  GET_CONTACTS_STATUS = `${BASE_URL}/status/getAllStatusContacts`,
  ADD_STATUS = `${BASE_URL}/status/createStatus`,
  DELETE_STATUS = `${BASE_URL}/status/deleteStatus`,
  GET_MY_STATUS = `${BASE_URL}/status/getMyStatus`,
  GET_STATUS_USER = `${BASE_URL}/status/getStatusUser`,
  REGISTER = `${BASE_URL}/auth/register`,
  DELETE_ACCOUNT = `${BASE_URL}/profile/dellete`,
  UPDATE_USER = `${BASE_URL}/profile/update`,
  DELETE_CHAT = `${BASE_URL}/messages/deleteChat`,
  DELETE_CONTACT = `${BASE_URL}/contacts/deleteContact`,
}
