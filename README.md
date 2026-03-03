# 💼 Briefcase

**Your personal workspace in a browser tab.** Organize notes, files, and ideas in a Chrome-style tabbed interface — fast, clean, and all yours.

---

## ✨ Features

- 🗂️ **Chrome-style tabs** — Top-level tabs + sub-tabs (2-level hierarchy)
- 🔄 **Drag & drop** — Reorder tabs by dragging them around
- 📌 **Pinnable tabs** — Pin tabs to keep them compact and always accessible
- 📝 **Rich text notes** — Google Keep-style cards with bold, italic, lists, and more (Tiptap editor)
- 📎 **File attachments** — Upload and manage files per tab (stored in Supabase Storage)
- 🌙 **Dark mode** — Toggle between light and dark themes, persisted across sessions
- 🔐 **Google OAuth** — Secure sign-in with your Google account via Supabase Auth
- 🖱️ **Right-click menus** — Pin, rename, or close tabs from the context menu

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript 5.9 |
| **Build** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **Rich Text** | Tiptap 3 (ProseMirror) |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Auth** | Google OAuth via Supabase |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Supabase](https://supabase.com/) project
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/nurulashraf/briefcase.git
cd briefcase

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Then fill in your Supabase URL and anon key (see below)

# Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🗄️ Database Setup

1. Go to your Supabase project dashboard
2. Open the **SQL Editor**
3. Paste the contents of `supabase/migrations/schema.sql` and run it

This creates the `tabs`, `notes`, and `attachments` tables, along with indexes, triggers, and a private storage bucket.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous (public) API key |

---

## 📁 Project Structure

```
src/
├── App.tsx                        # Auth gate + root component
├── main.tsx                       # Entry point
├── index.css                      # Tailwind + global styles
│
├── components/
│   ├── auth/
│   │   └── LoginPage.tsx          # Google sign-in page
│   ├── layout/
│   │   ├── AppShell.tsx           # Main layout (tab bars + board)
│   │   └── ThemeToggle.tsx        # Dark/light mode switch
│   ├── board/
│   │   ├── Board.tsx              # Masonry grid of notes & files
│   │   ├── NoteCard.tsx           # Note preview card
│   │   ├── NoteModal.tsx          # Rich text editor modal
│   │   └── FileCard.tsx           # File attachment card
│   ├── tabs/
│   │   ├── TabBar.tsx             # Reusable tab bar (dark/light)
│   │   ├── TabItem.tsx            # Tab with drag, pin, close, rename
│   │   └── CreateTabButton.tsx    # "+" button to add tabs
│   └── icons.tsx                  # SVG icon components
│
├── hooks/
│   ├── useAuth.ts                 # Google OAuth + session state
│   ├── useTabs.ts                 # Tab CRUD + reorder + pin
│   ├── useBoard.ts                # Notes & attachments loader
│   ├── useAttachments.ts          # File upload/download/delete
│   └── useTheme.ts                # Dark mode (localStorage)
│
├── services/
│   ├── tabService.ts              # Tab database queries
│   ├── noteService.ts             # Note CRUD operations
│   └── attachmentService.ts       # File storage operations
│
├── lib/
│   ├── supabase.ts                # Supabase client init
│   └── utils.ts                   # Helpers (formatFileSize, etc.)
│
└── types/
    └── index.ts                   # TypeScript interfaces
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
