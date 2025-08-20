




// Модель для хранения состоний Компонента - Chat
// Для сохранения данных между повторными инициализациями компонента при переходе между Calc/Game/Rates

import ChatMessage from "../types/ChatMessage";

class ChatModel {
    static #instance: ChatModel | null;        // # в JS - синтаксис для создания приватных полей

    static get instance(): ChatModel {
        if(ChatModel.#instance == null) {
            ChatModel.#instance = new ChatModel();
        }
        return ChatModel.#instance;
    }

    messages: Array<ChatMessage> = [];
}

export default ChatModel;