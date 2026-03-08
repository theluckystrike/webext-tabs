<div align="center">

# @theluckystrike/webext-tabs

Pre-built typed tab query patterns for Chrome extensions. Active tab, search, group, duplicate detection, and more.

[![npm version](https://img.shields.io/npm/v/@theluckystrike/webext-tabs)](https://www.npmjs.com/package/@theluckystrike/webext-tabs)
[![npm downloads](https://img.shields.io/npm/dm/@theluckystrike/webext-tabs)](https://www.npmjs.com/package/@theluckystrike/webext-tabs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@theluckystrike/webext-tabs)

[Installation](#installation) · [Quick Start](#quick-start) · [API](#api) · [License](#license)

</div>

---

## Features

- **Common patterns** -- active tab, current window, all tabs, pinned, audible, and more
- **Search** -- find tabs by URL pattern or title
- **Duplicate detection** -- find tabs with the same URL
- **Tab groups** -- query by group ID
- **Fully typed** -- every query returns typed `chrome.tabs.Tab[]`
- **Zero boilerplate** -- one-liner replacements for common `chrome.tabs.query()` calls

## Installation

```bash
npm install @theluckystrike/webext-tabs
```

<details>
<summary>Other package managers</summary>

```bash
pnpm add @theluckystrike/webext-tabs
# or
yarn add @theluckystrike/webext-tabs
```

</details>

## Quick Start

```typescript
import { Tabs } from "@theluckystrike/webext-tabs";

const active = await Tabs.getActive();              // current active tab
const all = await Tabs.getAll();                     // all tabs
const pinned = await Tabs.getPinned();               // pinned tabs
const matches = await Tabs.findByUrl("*://github.com/*");
const dupes = await Tabs.getDuplicates();            // tabs sharing a URL
```

## API

| Method | Description |
|--------|-------------|
| `getActive()` | Active tab in the current window |
| `getAll()` | All tabs across all windows |
| `getCurrentWindow()` | All tabs in the current window |
| `getPinned()` | All pinned tabs |
| `getAudible()` | Tabs currently playing audio |
| `getByStatus(status)` | Tabs by loading status |
| `findByUrl(pattern)` | Match tabs by URL pattern |
| `findByTitle(pattern)` | Match tabs by title |
| `getDuplicates()` | Find tabs sharing a URL |
| `getByGroupId(groupId)` | Tabs in a specific tab group |

## Permissions

```json
{ "permissions": ["tabs"] }
```

## Part of @zovo/webext

This package is part of the [@zovo/webext](https://github.com/theluckystrike) family -- typed, modular utilities for Chrome extension development:

| Package | Description |
|---------|-------------|
| [webext-storage](https://github.com/theluckystrike/webext-storage) | Typed storage with schema validation |
| [webext-messaging](https://github.com/theluckystrike/webext-messaging) | Type-safe message passing |
| [webext-tabs](https://github.com/theluckystrike/webext-tabs) | Tab query helpers |
| [webext-cookies](https://github.com/theluckystrike/webext-cookies) | Promise-based cookies API |
| [webext-i18n](https://github.com/theluckystrike/webext-i18n) | Internationalization toolkit |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License -- see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)

</div>
