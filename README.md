# Secret Poets Society

Secret Poets Society is a full-stack web application designed for poetry enthusiasts and creators.
It allows users to create, read, like, save, search for and comment on poems. Additionally, it integrates Google's Gemini AI model
to allow users to generate poetry from prompts and translate those drafts instantly into final published works.

---

## Features

*   **User Accounts & Profiles:** Secure authentication (JWT + bcrypt), custom user bios, and unique avatars.
*   **Poetry Micro-Publishing:** Create, edit, and categorize poems using structured theme tagging.
*   **AI Generation:** Built-in generative helper using Google GenAI (`@google/genai`) to generate poetry drafts that can be seamlessly pre-filled into the creation flow.
*   **Social Interactions:** Real-time following systems, deep multi-threaded nesting for comments and replies, and personal "Likes" and "Saves" indices.
*   **Privacy Controls:** Security guards protecting user data (e.g., hidden tabs for foreign profiles, restricted route edits).
*   **Defensive UI Boundaries:** Layouts equipped with strict string truncation handling and responsive word-wrap architectures to prevent text breakages.

---

## Tech Stack

### Frontend (`/client`)
*   **Core:** React, Vite
*   **Styling & UI:** Tailwind CSS, Shadcn, Lucide Icons
*   **Client Network:** Axios (HTTP client handling)

### Backend (`/server`)
*   **Core:** Node.js, Express
*   **Database:** PostgreSQL, Supabase
*   **Security & Encryption:** JSON Web Tokens (`jsonwebtoken`), `bcrypt` hashing
*   **AI Service:** Google GenAI SDK (`@google/genai`)

---

## Local Development Setup

### Prerequisites
*   [Node.js](https://nodejs.org/)
*   A running PostgreSQL Database instance (e.g., local Postgres or a cloud-hosted Supabase connection)
*   A Google Gemini API key

### Instructions
#### Backend
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file inside the root of your `/server` directory and declare runtime variables:
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_string
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3001
```
4. (Optional) Seed the database to populate database with dummy data: `npm run seed`
5. Run using command `npm run dev` (server will run on `http://localhost:3001`)

#### Frontend
1. Navigate to the client folder: `cd ../client`
2. Install dependencies: `npm install`
3. Create a `.env` file inside the root of your `/client` directory and declare runtime variables:
```
VITE_API_URL="http://localhost:3001"
```
4. Run using command `npm run dev` (app will launch at `http://localhost:5173`)
