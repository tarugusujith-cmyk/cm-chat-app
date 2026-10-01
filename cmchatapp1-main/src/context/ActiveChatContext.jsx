import { createContext, useContext, useState } from 'react';

const ActiveChatContext = createContext(null);

export function ActiveChatProvider({ children }) {
  const [activeChatId, setActiveChatId] = useState(null);
  return (
    <ActiveChatContext.Provider value={{ activeChatId, setActiveChatId }}>
      {children}
    </ActiveChatContext.Provider>
  );
}

export function useActiveChat() {
  const ctx = useContext(ActiveChatContext);
  if (!ctx) throw new Error('useActiveChat must be used within ActiveChatProvider');
  return ctx;
}
