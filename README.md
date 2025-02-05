# Get A Date - Valentine's Day Special 💘

A fun and interactive Next.js app that lets users create personalized Valentine’s Day invite links and share them with their crushes. Includes secret admirer mode, GIFs, AI-generated poems, and more!

## 🚀 Features
- **Personalized Invite Links** – Unique URLs for each recipient.
- **Secret or Anonymous Mode** – Reveal or hide the sender’s name.
- **Fun GIFs & Emojis** – Add reactions to invitations.
- **Countdown Timer** – Urgency for Valentine's Day.
- **Custom Themes** – Romantic, funny, or mysterious.
- **Confession Messages** – Write heartfelt or humorous notes.
- **AI-Generated Poems** – Auto-create love poems.

## 🛠️ Tech Stack
- **Frontend:** Next.js
- **Database:** MongoDB
- **Caching & Rate Limiting:** Upstash Redis

## 🔧 Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/MeAshikeqbal/get-a-date.git
   cd get-a-date
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file and add the following environment variables:
   ```env
   MONGODB_URI=""
   OPENAI_API_KEY=""
   GIPHY_API_KEY=""
   RESEND_API_KEY=""
   NEXT_PUBLIC_APP_URL=""
   UPSTASH_REDIS_REST_URL=""
   UPSTASH_REDIS_REST_TOKEN=""
   ADMIN_API_KEY=""
   ALLOWED_ORIGIN=""
   ```
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 License
This project is open-source and available under the MIT License.

---
💌 Spread love and fun this Valentine’s Day with Get A Date! 💕

