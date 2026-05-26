# myShelf

A personal media collection tracker built with Next.js. Rate, review, and organize your movies, games, music, TV shows, and books — all in one place.

## Features

- **Rate & Review** — Add items to your shelf with a 0-10 interactive rating wheel and written reviews
- **Photo Covers** — Upload cover images, auto-compressed for efficient storage
- **Media Types** — Movies, Games, Music, TV, and Books with category filtering and search
- **Parent-Child Hierarchy** — Albums contain songs, series contain episodes. View children in the detail modal or manage them via drag-and-drop
- **Subtab Filters** — Drill into Albums/Songs or Series/Episodes within Music and TV tabs
- **Detail View** — Click any card to see the full review, rating, and child items
- **Edit & Delete** — Modify any item or remove it with a custom confirmation dialog
- **Sort** — By rating or title
- **Persistent Storage** — Everything saved to localStorage, no account needed

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
myshelf-next/
├── app/
│   ├── globals.css           Global styles & nav
│   ├── layout.js             Root layout with shared Nav
│   ├── page.js               Landing page
│   ├── home/page.js          Collection/shelf view
│   └── rate/page.js          Add new items
├── components/
│   ├── Nav.js                Shared navigation
│   ├── RatingWheel.js        Interactive SVG rating wheel
│   ├── PhotoUpload.js        Photo upload with compression
│   ├── CharCountTextarea.js  Textarea with character counter
│   ├── CategorySelect.js     Category, subtype & parent pickers
│   ├── Toast.js              Toast notification
│   ├── ShelfGrid.js          Card grid + empty state
│   ├── ShelfCard.js          Individual shelf card
│   ├── MediaTabs.js          Type filter tabs + subtabs
│   ├── ShelfHeader.js        Title, item count & sort control
│   ├── DetailModal.js        Full item detail with children list
│   ├── EditModal.js          Edit item modal
│   ├── ConfirmModal.js       Delete confirmation modal
│   └── ManageModal.js        Add/remove children modal
├── hooks/
│   └── useCollection.js      localStorage CRUD + hydration guard
├── lib/
│   ├── data.js               Rating color, image compression, ID generation
│   └── constants.js          Type emojis, labels, subtype labels
├── css/
│   ├── home.css              Shelf grid, cards, modals, filters
│   └── rate.css              Rate form & rating wheel
└── public/
    ├── favicon.svg
    ├── logo.png
    └── logo-transparent.png
```

## Data Model

Each item in the collection:

| Field      | Description                                      |
|------------|--------------------------------------------------|
| `id`       | Unique identifier                                |
| `title`    | Item name                                        |
| `type`     | `movie`, `game`, `music`, `tv`, or `book`        |
| `subtype`  | `album`/`song` for music, `series`/`episode` for TV |
| `rating`   | 0-10 (one decimal)                               |
| `review`   | Text review (max 1200 characters)                |
| `photo`    | Compressed base64 cover image                    |
| `children` | Array of child item IDs                          |
| `parentId` | Parent item ID (for songs/episodes)              |

## Tech

- Next.js 16 (App Router)
- React 19
- CSS (no Tailwind, no UI libraries)
- localStorage for persistence
- SVG circle stroke-dashoffset for rating wheels
- HSL color interpolation for rating colors
- HTML5 Drag and Drop API
- Canvas API for image compression

## Deploy

Push to GitHub and connect to [Vercel](https://vercel.com) for automatic deployments.
