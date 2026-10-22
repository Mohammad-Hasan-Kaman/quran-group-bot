# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2026-09-22

### Fixed

- The Saturday post and the admin preview always send a single photo-with-
  caption message, falling back to a split only if Bale rejects the long
  caption.

## [1.2.0] - 2026-09-22

### Added

- Number-based member management: `/members /add /del /edit`, with
  Persian-digit support.
- Admin guidance via `/help` and `/admin help`, with Persian error examples
  and an unknown-command fallback.

### Changed

- Dropped the phone, juz, week and notes fields, `bot_participants`,
  `/api/admin` and `admin.html`.
- Saturday posts longer than 1000 characters are split into a photo plus a
  full-text message, because the Bale caption limit was being exceeded.
- `/setweek` accepts Persian digits and clears the stale image and message.

### Removed

- The `admin.html` panel and the `/api/admin` endpoint, now handled by in-bot
  commands.

## [1.1.0] - 2026-09-13

### Fixed

- The webhook received `env.KV` instead of `env`, which left every admin
  command, photo and approval dead.
- The Persian digit 9 was encoded as the fullwidth form (U+FF19) instead
  of the extended Arabic-Indic form (U+06F9).
- The Saturday group post split, caused by the Bale photo caption limit
  (~1024 characters) versus the ~1400-character message limit.
- The `/status` hadith counter wrapped because of a modulo error.
- `/setweek` cleared the stale image and message.

## [1.0.0] - 2026-08-24

### Added

- Initial release: a Bale messenger bot for automated weekly Quran-juz reading
  group management.
- Single message with photo and caption, instead of two separate messages.
- An admin panel inside the bot, with participants managed through `/admin`
  commands.
