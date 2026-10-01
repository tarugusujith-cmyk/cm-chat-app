import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const DataContext = createContext(null);
const CURRENT_USER_ID = 'me';

export function DataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [calls, setCalls] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [u, c, cl, st] = await Promise.all([
        api.getUsers(),
        api.getChats(),
        api.getCalls(),
        api.getStatuses(),
      ]);
      setUsers(u);
      setChats(c);
      setCalls(cl);
      setStatuses(st);
      // Pull messages for every chat up front (small dataset) so list previews work.
      const msgLists = await Promise.all(c.map((chat) => api.getMessages(chat.id)));
      setMessages(msgLists.flat());
    } catch (e) {
      setError(e.message || 'Could not reach the API. Is json-server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const getUser = useCallback((id) => users.find((u) => u.id === id), [users]);

  const currentUser = useMemo(
    () => users.find((u) => u.id === CURRENT_USER_ID),
    [users]
  );

  const getMeta = useCallback(
    (chat) => {
      if (!chat) return { title: '', avatar: null, subtitle: '', online: false };
      if (chat.type === 'group') {
        const memberNames = chat.participantIds
          .filter((id) => id !== CURRENT_USER_ID)
          .map((id) => getUser(id)?.name)
          .filter(Boolean);
        let subtitle = memberNames.slice(0, 2).join(', ');
        const extra = chat.extraCount || Math.max(memberNames.length - 2, 0);
        if (extra > 0) subtitle += `, ${extra} others`;
        return { title: chat.name, avatar: chat.avatar, subtitle, online: true };
      }
      const otherId = chat.participantIds.find((id) => id !== CURRENT_USER_ID);
      const other = getUser(otherId);
      return {
        title: other?.name || 'Unknown',
        avatar: other?.avatar,
        subtitle: other?.online ? 'Online' : 'Offline',
        online: !!other?.online,
      };
    },
    [getUser]
  );

  const messagesByChat = useCallback(
    (chatId) => messages.filter((m) => m.chatId === chatId).sort((a, b) => new Date(a.time) - new Date(b.time)),
    [messages]
  );

  const chatsWithPreview = useMemo(() => {
    return chats
      .map((chat) => {
        const chatMessages = messages.filter((m) => m.chatId === chat.id);
        const last = chatMessages[chatMessages.length - 1];
        let preview = 'Say hi 👋';
        if (last) {
          if (last.type === 'image') preview = '📷 Photo';
          else if (last.type === 'file') preview = `📎 ${last.fileName || 'File'}`;
          else preview = last.text;
          if (last.senderId === CURRENT_USER_ID) preview = `You: ${preview}`;
        }
        return {
          ...chat,
          ...getMeta(chat),
          lastMessage: preview,
          lastTime: last?.time || null,
        };
      })
      .sort((a, b) => {
        if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
        const at = a.lastTime ? new Date(a.lastTime).getTime() : 0;
        const bt = b.lastTime ? new Date(b.lastTime).getTime() : 0;
        return bt - at;
      });
  }, [chats, messages, getMeta]);

  const sendMessage = useCallback(async (chatId, payload) => {
    const optimistic = {
      id: `temp-${Date.now()}`,
      chatId,
      senderId: CURRENT_USER_ID,
      time: new Date().toISOString(),
      reactions: [],
      ...payload,
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const saved = await api.sendMessage({
        chatId,
        senderId: CURRENT_USER_ID,
        time: optimistic.time,
        reactions: [],
        ...payload,
      });
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
    } catch {
      // Keep optimistic message but flag it failed to sync
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...m, syncFailed: true } : m))
      );
    }
  }, []);

  const toggleReaction = useCallback(
    async (messageId, emoji) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg) return;
      const existing = (msg.reactions || []).find((r) => r.emoji === emoji);
      const reactions = existing
        ? msg.reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
        : [...(msg.reactions || []), { emoji, count: 1 }];
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, reactions } : m)));
      try {
        await api.updateMessage(messageId, { reactions });
      } catch {
        /* best effort */
      }
    },
    [messages]
  );

  const toggleStar = useCallback(
    async (messageId) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg) return;
      const starred = !msg.starred;
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, starred } : m)));
      try {
        await api.updateMessage(messageId, { starred });
      } catch {
        /* best effort */
      }
    },
    [messages]
  );

  const markChatRead = useCallback(async (chatId) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c)));
    try {
      await api.updateChat(chatId, { unread: 0 });
    } catch {
      /* best effort */
    }
  }, []);

  const createGroup = useCallback(async ({ name, memberIds, avatar }) => {
    const newChat = await api.createChat({
      type: 'group',
      name,
      avatar: avatar || 'https://i.pravatar.cc/150?img=30',
      participantIds: [CURRENT_USER_ID, ...memberIds],
      extraCount: 0,
      pinned: false,
      archived: false,
      unread: 0,
    });
    setChats((prev) => [newChat, ...prev]);
    return newChat;
  }, []);

  const startDirectChat = useCallback(
    async (userId) => {
      const existing = chats.find(
        (c) => c.type === 'direct' && c.participantIds.includes(userId)
      );
      if (existing) return existing;
      const newChat = await api.createChat({
        type: 'direct',
        participantIds: [CURRENT_USER_ID, userId],
        pinned: false,
        archived: false,
        unread: 0,
      });
      setChats((prev) => [newChat, ...prev]);
      return newChat;
    },
    [chats]
  );

  const addContact = useCallback(async ({ name, phone, about, avatar }) => {
    const newUser = await api.addUser({
      name: name.trim(),
      phone: phone?.trim() || '',
      about: about?.trim() || 'Hey there! I am using CM Chat.',
      avatar: avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      online: false,
    });
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  }, []);

  const updateProfile = useCallback(async (data) => {
    const updated = await api.updateUser(CURRENT_USER_ID, data);
    setUsers((prev) => prev.map((u) => (u.id === CURRENT_USER_ID ? updated : u)));
    return updated;
  }, []);

  const togglePin = useCallback(async (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    const pinned = !chat.pinned;
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, pinned } : c)));
    try {
      await api.updateChat(chatId, { pinned });
    } catch {
      /* best effort */
    }
  }, [chats]);

  const toggleArchive = useCallback(async (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    const archived = !chat.archived;
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, archived } : c)));
    try {
      await api.updateChat(chatId, { archived });
    } catch {
      /* best effort */
    }
  }, [chats]);

  const toggleMute = useCallback(async (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    const muted = !chat.muted;
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, muted } : c)));
    try {
      await api.updateChat(chatId, { muted });
    } catch {
      /* best effort */
    }
  }, [chats]);

  const toggleBlock = useCallback(async (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    const blocked = !chat.blocked;
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, blocked } : c)));
    try {
      await api.updateChat(chatId, { blocked });
    } catch {
      /* best effort */
    }
  }, [chats]);

  const deleteChat = useCallback(async (chatId) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    try {
      await api.deleteChat(chatId);
    } catch {
      /* best effort */
    }
  }, []);

  const commonGroups = useCallback(
    (userId) =>
      chats.filter(
        (c) => c.type === 'group' && c.participantIds.includes(userId) && c.participantIds.includes(CURRENT_USER_ID)
      ),
    [chats]
  );

  const chatMedia = useCallback(
    (chatId) => messages.filter((m) => m.chatId === chatId && (m.type === 'image' || m.type === 'file')),
    [messages]
  );

  const logCall = useCallback(async (userId, kind, status = 'answered') => {
    const call = await api.addCall({
      userId,
      kind,
      direction: 'outgoing',
      status,
      time: 'Just now',
    });
    setCalls((prev) => [call, ...prev]);
  }, []);

  const statusesWithMeta = useMemo(() => {
    return statuses
      .map((s) => ({
        ...s,
        user: getUser(s.userId),
        isMine: s.userId === CURRENT_USER_ID,
        seen: (s.seenBy || []).includes(CURRENT_USER_ID),
      }))
      .filter((s) => s.user)
      .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
  }, [statuses, getUser]);

  const markStatusSeen = useCallback(
    async (statusId) => {
      const status = statuses.find((s) => s.id === statusId);
      if (!status || status.userId === CURRENT_USER_ID) return;
      if ((status.seenBy || []).includes(CURRENT_USER_ID)) return;
      const seenBy = [...(status.seenBy || []), CURRENT_USER_ID];
      setStatuses((prev) => prev.map((s) => (s.id === statusId ? { ...s, seenBy } : s)));
      try {
        await api.updateStatus(statusId, { seenBy });
      } catch {
        /* best effort */
      }
    },
    [statuses]
  );

  const addSlideToMyStatus = useCallback(
    async (imageUrl) => {
      const mine = statuses.find((s) => s.userId === CURRENT_USER_ID);
      if (mine) {
        const images = [...mine.images, imageUrl];
        setStatuses((prev) => prev.map((s) => (s.id === mine.id ? { ...s, images } : s)));
        try {
          await api.updateStatus(mine.id, { images, postedAt: new Date().toISOString() });
        } catch {
          /* best effort */
        }
        return mine.id;
      }
      const created = await api.addStatus({
        userId: CURRENT_USER_ID,
        images: [imageUrl],
        postedAt: new Date().toISOString(),
        seenBy: [],
      });
      setStatuses((prev) => [...prev, created]);
      return created.id;
    },
    [statuses]
  );

  const removeMySlide = useCallback(
    async (statusId, index) => {
      const status = statuses.find((s) => s.id === statusId);
      if (!status) return;
      const images = status.images.filter((_, i) => i !== index);
      setStatuses((prev) => prev.map((s) => (s.id === statusId ? { ...s, images } : s)));
      try {
        await api.updateStatus(statusId, { images });
      } catch {
        /* best effort */
      }
    },
    [statuses]
  );

  const value = {
    users,
    chats,
    calls,
    statuses,
    statusesWithMeta,
    loading,
    error,
    currentUser,
    getUser,
    getMeta,
    messagesByChat,
    chatsWithPreview,
    sendMessage,
    toggleReaction,
    toggleStar,
    markChatRead,
    createGroup,
    startDirectChat,
    addContact,
    updateProfile,
    logCall,
    togglePin,
    toggleArchive,
    toggleMute,
    toggleBlock,
    deleteChat,
    commonGroups,
    chatMedia,
    markStatusSeen,
    addSlideToMyStatus,
    removeMySlide,
    reload: loadAll,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
