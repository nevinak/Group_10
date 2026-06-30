import { create } from 'zustand';

const useConversation = create((set) => ({
  selectedConversation: null,
  messages: [],
  messagesByConversation: {},
  setSelectedConversation: (conversation) =>
    set((state) => ({
      selectedConversation: conversation,
      messages: conversation ? state.messagesByConversation[conversation._id] || [] : [],
    })),
  setMessagesForConversation: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages,
      },
      messages: state.selectedConversation?._id === conversationId ? messages : state.messages,
    })),
  appendMessageToConversation: (conversationId, message) =>
    set((state) => {
      const existingMessages = state.messagesByConversation[conversationId] || [];
      const nextMessages = [...existingMessages, message];

      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: nextMessages,
        },
        messages: state.selectedConversation?._id === conversationId ? nextMessages : state.messages,
      };
    }),
  removeMessageFromConversation: (conversationId, messageId) =>
    set((state) => {
      const existingMessages = state.messagesByConversation[conversationId] || [];
      const nextMessages = existingMessages.filter((message) => message._id !== messageId);

      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: nextMessages,
        },
        messages: state.selectedConversation?._id === conversationId ? nextMessages : state.messages,
      };
    }),
}));

export default useConversation;
