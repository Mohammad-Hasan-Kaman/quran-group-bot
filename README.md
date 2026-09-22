# 🤲 Quran Group Bot

![Version](https://img.shields.io/badge/version-1.2.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Cloudflare%20Workers-orange?style=for-the-badge&logo=cloudflare)
![Stars](https://img.shields.io/github/stars/Mohammad-Hasan-Kaman/quran-group-bot?style=for-the-badge&logo=github&color=blue)

Bale Messenger bot for automated weekly Quran juz reading group management.

## Overview

This bot manages a 30-person Quran reading circle where:
- **30 participants** each read one juz per week
- Juz numbers **rotate weekly** (+1 each week, wrapping around)
- A **weekly hadith** from Imam Hussain (ع) is shared with an image
- Messages are posted **every Saturday at 8 AM** (Iran time)
- Admin receives a **Friday night reminder** to prepare content

## Features

- 📅 **Automated scheduling** via Cloudflare Workers cron triggers
- 🔄 **Juz rotation** — each person's juz number increases by 1 each week
- 📖 **25 weekly hadiths** — one per week for 25 remaining weeks
- 🖼️ **Image support** — admin sends the hadith image, bot includes it
- ✅ **Admin approval flow** — preview before posting to group
- 📊 **Status commands** — check current week, list assignments
- 🛡️ **Admin-only access** — bot ignores all non-admin messages

## Architecture

```
┌─────────────────────────────────────────────┐
│            Cloudflare Worker                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Webhook  │  │  Cron    │  │   KV     │  │
│  │ Handler  │  │ Trigger  │  │  State   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │              │              │        │
│  ┌────┴──────────────┴──────────────┴────┐  │
│  │           Bale API Client             │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
         │                    │
    ┌────┴────┐          ┌───┴────┐
    │  Bale   │          │  Bale  │
    │  Group  │          │  Admin │
    └─────────┘          └────────┘
```

## Flow

### Weekly Cycle

```
Friday 9 PM ──→ Bot reminds admin with hadith text
                    │
Admin sends image ──→ Bot prepares message + preview
                    │
Admin clicks ✅ ──→ Message saved for posting
                    │
Saturday 8 AM ──→ Bot posts to group
                    │
Week advances ──→ Juz numbers rotate +1
```

### Juz Rotation Formula

```
juz = (person_index + week_number - 1) % 30 + 1
```

Example for week 5:
- Person 0 (جواهریان): juz 5
- Person 25 (نینا خانم): juz 30
- Person 26 (زهرا سعدی راد): juz 1 (wrapped)

## Setup

### Prerequisites

1. [Node.js](https://nodejs.org/) 18+
2. [Cloudflare account](https://dash.cloudflare.com/) (Workers Paid plan for cron triggers)
3. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Step 1: Install Dependencies

```bash
cd Quran_group_bot
npm install
```

### Step 2: Create KV Namespace

```bash
npx wrangler kv namespace create BOT_STATE
```

Copy the `id` from the output and paste it into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "KV"
id = "YOUR_KV_NAMESPACE_ID"
```

### Step 3: Configure the Bot Token (Secret)

The bot token is **not** stored in the code. Set it as a Cloudflare Worker secret:

```bash
npx wrangler secret put BOT_TOKEN
```

Paste your Bale bot token when prompted (get it from [@BotFather](https://tapi.bale.ai/BotFather) in Bale).

> ⚠️ Never hardcode the token in `src/index.js`. The worker reads it from the environment (`env.BOT_TOKEN`) at runtime.

### Step 4: Deploy

```bash
npx wrangler deploy
```

### Step 5: Set Up Webhook

After deployment, visit:

```
https://quran-group-bot.<your-subdomain>.workers.dev/setup
```

This will register the webhook with Bale automatically.

### Step 6: Verify

```
# Check bot status
https://quran-group-bot.<your-subdomain>.workers.dev/api/status

# Health check
https://quran-group-bot.<your-subdomain>.workers.dev/
```

## Bot Commands (Admin Only)

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/status` | Show current week, state, and hadith number |
| `/help` | Show all commands |
| `/list` | Show juz assignments for current week |
| `/preview` | Show the pending message preview |
| `/members` | List all members with numbers |
| `/add <name>` | Add a new member |
| `/del <number|name>` | Delete a member |
| `/edit <number> <new name>` | Edit member name |
| `/setweek <N>` | Set current week number (1-30) |
| `/skip` | Skip current week and advance |
| `/reset` | Reset bot state to idle |

## Admin Workflow

1. **Friday 9 PM**: Bot sends reminder with hadith text
2. **Admin sends image**: Bot shows preview with ✅/❌ buttons
3. **Admin approves**: Message is queued
4. **Saturday 8 AM**: Bot posts to group automatically

## Configuration

### Bot Settings (`src/index.js`)

```javascript
const CONFIG = {
  BOT_TOKEN: '',          // ← keep empty! Set via `wrangler secret put BOT_TOKEN`
  GROUP_ID: '-100...',    // Target group ID
  ADMINS: [123456789],    // Admin user IDs
  BALE_API: 'https://tapi.bale.ai/bot',
  TOTAL_WEEKS: 30,        // Total weeks in program
  TOTAL_JUZ: 30,          // Total juz in Quran
};
```

> 🔒 The bot token is stored as a Cloudflare secret (`env.BOT_TOKEN`) and never committed to the repository.

### Schedule (Iran Time / UTC)

| Event | Iran Time | UTC | Cron |
|-------|-----------|-----|------|
| Friday reminder | Fri 21:00 | Fri 17:30 | `30 17 * * 5` |
| Saturday post | Sat 08:00 | Sat 04:30 | `30 4 * * 6` |

## File Structure

```
Quran_group_bot/
├── wrangler.toml          # Cloudflare Workers config
├── package.json           # Node.js dependencies
├── src/
│   └── index.js           # Main worker (all logic + data)
├── LICENSE                # MIT License
├── CONTRIBUTING.md        # Contribution guidelines
└── README.md              # This file
```

## Adding New Hadiths

Edit the `HADITHS` array in `src/index.js`:

```javascript
const HADITHS = [
  {
    text: 'متن حدیث...',
    source: 'منبع حدیث...',
  },
  // ... more hadiths
];
```

## Modifying the Members List

The member list is stored in KV (`member_names`) and can be modified **at runtime** via bot commands — no code edit or redeploy needed. If no KV entry exists, the bot falls back to the `PEOPLE` array in `src/index.js`.

| Command | Example | Effect |
|---------|---------|--------|
| `/members` | — | Show numbered list |
| `/add <name>` | `/add فاطمه احمدی` | Append member |
| `/del <number>` | `/del 12` | Remove by number |
| `/del <name>` | `/del سلیمانی` | Remove by exact name |
| `/edit <number> <new>` | `/edit 12 فاطمه رضایی` | Rename member |

Juz rotation uses `CONFIG.TOTAL_JUZ` (30), so wrap is always 1→30 regardless of member count.

## Troubleshooting

### Bot not responding to messages
- Check webhook is set: visit `/setup` endpoint
- Verify admin IDs in `CONFIG.ADMINS`

### Cron not firing
- Requires Cloudflare Workers **Paid plan** ($5/month)
- Check cron expressions in `wrangler.toml`
- Verify timezone: Iran = UTC+3:30

### Message not posting to group
- Bot must be a member of the group
- Check `CONFIG.GROUP_ID` matches the group
- Verify KV state via `/api/status`

## License

MIT
