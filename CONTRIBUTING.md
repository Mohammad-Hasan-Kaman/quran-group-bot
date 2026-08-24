# Contributing to Quran Group Bot

Thank you for considering contributing to this project! 🎉

## Reporting Bugs

If you find a bug, please open an [issue](https://github.com/Mohammad-Hasan-Kaman/quran-group-bot/issues) and include:

- A clear, descriptive title
- Steps to reproduce the problem
- Expected behavior vs. actual behavior
- Any relevant logs (e.g., `wrangler tail` output)

> ⚠️ **Never share your bot token** in issues or logs. Redact it first.

## Suggesting Features

Feature requests are welcome! Open an issue with the label `enhancement` and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## Submitting Code

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```
2. **Make your changes** and test them locally:
   ```bash
   npm run dev
   ```
3. **Verify syntax** before committing:
   ```bash
   node --check src/index.js
   ```
4. **Commit** with a clear, descriptive message:
   ```bash
   git commit -m "Add: support for custom posting time"
   ```
5. **Push** and open a Pull Request.

## Code Style

- Plain JavaScript (ES modules) targeting Cloudflare Workers
- No external runtime dependencies — keep it dependency-free
- Keep all bot logic in `src/index.js`
- Persian user-facing strings are intentional (the audience is a Persian-speaking Quran study group); code comments and docs stay in English
- Run `node --check src/index.js` to validate syntax before submitting

## Security

Never commit secrets (`BOT_TOKEN`, KV namespace IDs tied to production, etc.). Use `wrangler secret put BOT_TOKEN` instead. If you accidentally leak a token, revoke it immediately via BotFather-equivalent in Bale.
