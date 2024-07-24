import { jwtDecode } from 'jwt-decode';
import { ToastService } from '../toast.service';
import { FetchesService } from '../fetches.service';

export default class ChatManager {
  static sendMessage({
    newMessage,
    toast,
    fetches,
    receiverId,
    chatService,
    type = 'text',
  }: SendMessage) {
    const token = localStorage.getItem('token') as string;
    const decoded = jwtDecode(token) as any;

    if (newMessage.trim()) {
      const idUser = localStorage.getItem('userId');

      if (!idUser)
        return toast.showToast({
          message: 'Error al enviar mensaje',
          type: 'danger',
        });

      const message = {
        typeMessage: type,
        message: {
          type,
          content: newMessage,
        },
        senderId: localStorage.getItem('userId'),
        isSendByMe: true,
        senderData: {
          userName: decoded.userName,
          email: decoded.email,
          role: decoded.role,
        },
      };

      this.addToBDD({
        idReceiver: receiverId,
        typeMessage: 'text',
        messageString: message.message.content,
        fetches,
        toast,
      });

      chatService.sendMessage(receiverId, newMessage);
      toast.showToast({ message: 'Se envio el mensaje', type: 'success' });
    }
    return;
  }

  private static async addToBDD({
    idReceiver,
    typeMessage,
    messageString,
    fetches,
    toast,
  }: {
    idReceiver: string;
    typeMessage: typeMessage;
    messageString: string;
    fetches: FetchesService;
    toast: ToastService;
  }) {
    try {
      await fetches.addMessage({
        idReceiver,
        typeMessage,
        messageString,
      });
    } catch (error) {
      toast.showToast({
        message: 'Error al enviar mensaje',
        type: 'danger',
      });
    }
  }
}

type typeMessage = 'text' | 'image' | 'audio';

interface SendMessage {
  newMessage: string;
  toast: ToastService;
  fetches: FetchesService;
  receiverId: string;
  chatService: {
    sendMessage: (receiverId: string, message: string, type?: string) => void;
  };
  type?: typeMessage;
}
