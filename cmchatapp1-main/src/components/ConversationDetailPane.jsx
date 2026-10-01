import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import EmptyState from './EmptyState';
import { useData } from '../context/DataContext';
import { useActiveChat } from '../context/ActiveChatContext';

export default function ConversationDetailPane({ backTo, onStartNew }) {
  const { chats, getMeta } = useData();
  const { activeChatId } = useActiveChat();
  const navigate = useNavigate();

  const chat = chats.find((c) => c.id === activeChatId);
  const chatWithMeta = chat ? { ...chat, ...getMeta(chat) } : null;

  if (!chatWithMeta) return <EmptyState onStartNew={onStartNew} />;

  return <ChatWindow chat={chatWithMeta} onBack={() => navigate(backTo)} />;
}
