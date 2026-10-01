# CM Chat App

A fully responsive chat application built with **React 19**, **Vite**, **Tailwind CSS**, and **React Router**, backed by a **json-server** REST API. The UI follows the "CM Chat App" Figma design: an icon rail, Chats / Groups / Call Log panels, a message thread with attachments and reactions, group creation, and a profile screen.

## Features

- **Chats** — direct conversations, pinned section, unread badges, search, and a working **Archive** and **Unread** filter (each its own view with a back arrow, reachable from the Archived link / filter icon)
- **Contact info / Group info panel** — click a chat's header to open a slide-in (desktop) or full-screen (mobile) panel with phone number, About, shared media grid, mute toggle, common groups (direct) or member list (group), and Block/Delete or Exit Group. Drill further into **Media / Links / Docs** (tabbed, grouped by date) and **Starred Messages** (grouped by date, reuses the real message bubbles)
- **Message starring** — hover a message to reveal a star toggle; starred messages surface in the Starred Messages view
- **Full Settings section** — Notifications (checkboxes), Privacy (dedicated Last Seen / Profile Photo / About / Groups pages with Everyone/My Contacts/Nobody radio options, read receipts, and a Blocked Contacts page with a "Block New Contact" picker), Security (informational), Theme (modal: Light/Dark/System Default with Cancel/Apply), Chat Wallpaper (21-color picker with a live preview pane that actually applies to your chat background), Request Account Info (downloads a real JSON export of your profile + settings), a Keyboard Shortcuts modal, and Help
- **Archiving** — archive a chat from the "⋮" menu on any row (always visible on touch screens, hover on desktop; right-click also works), from the chat's Contact Info panel, or by picking a contact via **Add chat to archive** inside the Archive view. Archived chats leave the main list and live under Chats → Archived until you unarchive them
- **Groups** — group conversations with a "Create New Group" flow (name + member picker)
- **Add New Contact** — the "New conversation" picker (opened from the Chats pencil icon, or "Start new conversation" in Call Log) has a "New Contact" action at the top to create a brand-new contact (name, phone, about), which then opens a chat with them immediately
- **Updates** — WhatsApp-style status/stories: "Not seen" / "Seen" sections with dashed/solid rings, a full story viewer with auto-advancing progress bars, prev/next navigation, reply-to-status (opens a DM), and an editor for your own update (add/remove slides)
- **Audio & video calls** — click the phone/video icons in a chat header to start a simulated call: a floating "Connecting…" card for audio, a full-bleed video overlay with a self-view PiP for video, both logging to the Call Log on hang up
- **Call Log** — recent calls with outgoing/missed indicators, "start new conversation" contact picker (search + call/video buttons)
- **Chat window** — text, image, and file messages, emoji reactions, day dividers, quick emoji picker, file/image attach
- **Profile & Settings** — editable name/about, light/dark theme toggle (persisted)
- **Persistent active conversation** — the open chat stays visible in the detail pane even when you switch between Chats / Groups / Call Log tabs, just like the source design
- **Fully responsive** — desktop shows list + detail side by side; mobile shows one pane at a time with a bottom tab bar and back navigation
- **json-server backed** — all data (users, chats, messages, calls, statuses) is served from `db.json` over a local REST API; messages refresh on send (no polling)

## Getting started

```bash
npm install
npm run dev:all
```

`npm run dev:all` starts both the Vite dev server (http://localhost:5173) and json-server (http://localhost:4000) together.

If you'd rather run them separately:

```bash
npm run server   # json-server on port 4000
npm run dev      # Vite on port 5173
```

> The app expects the API at `http://localhost:4000` (see `src/api/client.js`). Change `API_URL` there if you run json-server on a different port.

## Building for production

```bash
npm run build
npm run preview
```

Note: `json-server` is fine for a small hosted demo (see Deployment below), but for a real product replace `src/api/client.js` with calls to your production backend (the function signatures are the only thing that matter — swap the implementation, keep the shape).

## Deployment

The app is two separate pieces to deploy: a **static frontend** (Vite build) and the **API** (json-server, which needs a long-running Node process — it won't run on a static host).

### 1. Deploy the API (json-server)

Any Node host works (Render, Railway, Fly.io, a VPS). Render's free tier is the easiest:

1. Push this project to a GitHub repo.
2. On [render.com](https://render.com): **New → Blueprint**, point it at your repo. It will read `render.yaml` in this project and set everything up automatically (build: `npm install`, start: `npm run start`, which runs json-server on Render's assigned `$PORT`).
3. Once deployed, copy the service URL, e.g. `https://cm-chat-api.onrender.com`.

   Railway or Fly.io work the same way — just set the start command to `npm run start`.

   **Important caveat:** `db.json` is a flat file. On most free hosts the filesystem is **ephemeral** — writes (new messages, blocks, pins, etc.) persist while the service stays up, but reset on redeploys or after the free instance spins down from inactivity. Fine for a demo; for anything persistent, attach a paid persistent disk (Render supports this) or swap in a real database.

### 2. Deploy the frontend (Vite build)

Vercel or Netlify both auto-detect Vite projects:

1. Push the repo to GitHub (same repo as above is fine).
2. On [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com): **New Project/Site → Import from Git**, pick the repo. Build command `npm run build`, output directory `dist` (both usually auto-fill this).
3. Add an environment variable: **`VITE_API_URL`** = the API URL from step 1 (e.g. `https://cm-chat-api.onrender.com`). This has to be set *before* the build runs, since Vite bakes it into the bundle at build time — if you change it later, trigger a redeploy.
4. Deploy. `vercel.json` (Vercel) and `public/_redirects` (Netlify) are already included so client-side routes like `/chats/c1` work on refresh instead of 404ing.

### Local production-style test

To sanity-check a deployment config locally before pushing:

```bash
VITE_API_URL=https://your-api-url npm run build
npm run preview
```

## Project structure

```
db.json                     # json-server database (users, chats, messages, calls)
src/
  api/client.js              # fetch wrapper around the json-server REST API
  context/
    ThemeContext.jsx         # light/dark theme, persisted to localStorage
    DataContext.jsx          # users/chats/messages/calls state + actions
    ActiveChatContext.jsx    # keeps the open conversation across tab switches
  components/
    IconRail.jsx             # desktop left nav
    MobileTabBar.jsx / MobileTopBar.jsx
    ChatListRow.jsx, ChatWindow.jsx, MessageBubble.jsx, MessageInput.jsx
    StatusViewer.jsx, CallOverlay.jsx, ContactInfoPanel.jsx
    AttachmentsView.jsx, StarredMessagesView.jsx
    ListDetailLayout.jsx     # responsive list+detail shell
    EmptyState.jsx
    modals/CreateGroupModal.jsx, ContactPickerModal.jsx
  pages/
    ChatsPage.jsx, GroupsPage.jsx, CallLogPage.jsx, UpdatesPage.jsx, ProfilePage.jsx, SettingsPage.jsx
  utils/time.js               # date/time formatting + grouping helpers
```

## Data model (db.json)

- **users** — `{ id, name, about, avatar, online, phone }`
- **chats** — `{ id, type: 'direct' | 'group', participantIds, name?, avatar?, pinned, archived, unread, muted, blocked }`
- **messages** — `{ id, chatId, senderId, type: 'text' | 'image' | 'file' | 'link', text?, fileUrl?, fileName?, fileSize?, linkUrl?, linkDomain?, time, reactions, starred }`
- **calls** — `{ id, userId, kind: 'audio' | 'video', direction, status, time }`
- **statuses** — `{ id, userId, images: string[], postedAt, seenBy: string[] }` — one row per user; `images` is the ordered set of story slides

Routing (`/chats`, `/chats/:id`, `/groups`, `/groups/:id`, `/calls`, `/profile`, `/settings`) is implemented with React Router; all pages are reachable via direct URL.

## Notes

- Avatars use `i.pravatar.cc` and the sample photo attachment uses `images.unsplash.com` — both need internet access to load. Swap them for your own assets if you need it to work fully offline.
- "Start a call" simply logs an entry to the call log (there's no real calling backend) — this mirrors what a Figma prototype would do.
