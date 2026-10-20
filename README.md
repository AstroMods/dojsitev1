# DOJ Digital Command (Garden State Collective Gaming LLC)
Vanilla HTML/CSS/JS shell for Cloudflare Pages + Functions, and D1.

## Status
Working: app shell, hash router, themes, 16-module sidebar, dashboard, cases list, Drive upload UI, Discord OAuth2
(state check, HttpOnly sessions, revocation), D1 schema and roles, server-side permission checks, Discord-webhook upload/download
with type/size validation and access log, security headers.
Stubs: PDF Studio, Discord Logs, Newsroom, Personnel, Tasks, Calendar, Admin UI, Drive folders/versions/sharing.
Not included: the Discord bot service and slash commands (needs a persistent host).

## Demo vs production
If /api/users reports no DB/OAuth config or is unreachable, the UI shows a DEMO banner with sample data.
Demo mode grants nothing; authorization is enforced only in functions/ using D1 sessions.

## Deploy
1. `npm i`; `npx wrangler d1 create doj-digital-command`; put the id in wrangler.toml.
2. Create a webhook in a PRIVATE Discord channel and set the Pages secret DISCORD_FILES_WEBHOOK. Files are stored as webhook messages; the message ID is saved in D1 and a fresh link is fetched on each download. Anyone with channel or webhook access can see the files, and deleting the channel/webhook destroys them.
3. `npm run migrate` (add `--remote` for production).
4. Discord app: redirect URI https://YOUR_DOMAIN/api/auth/callback.
5. Pages secrets: DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI. Bind DB.
6. `npm run deploy`, sign in once, then promote yourself:
   `UPDATE users SET role_key='system_administrator' WHERE discord_id='YOUR_ID';`

## Discord logging
Run a discord.js bot on a persistent host (intents: GuildMembers, GuildModeration, GuildMessages, MessageContent if needed).
It POSTs HMAC-signed events (DISCORD_EVENT_SECRET) to a Function that verifies and inserts into discord_events.

## PDF Studio
Pin PDF.js and pdf-lib versions from cdnjs (already allowed in the CSP). For real redaction, flatten/rasterize redacted pages.
