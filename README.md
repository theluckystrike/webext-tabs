# webext-tabs

[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-tabs)](https://www.npmjs.com/package/@theluckystrike/webext-tabs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Last Commit](https://img.shields.io/github/last-commit/theluckystrike/webext-tabs)](https://github.com/theluckystrike/webext-tabs/commits/main)

Common tab query patterns as typed helpers for Chrome extensions.

Part of the [chrome-extension-guide](https://github.com/niceByte/chrome-extension-guide) ecosystem.

## Installation

```bash
npm install @theluckystrike/webext-tabs
```

## Usage

### Querying Tabs

```typescript
import {
  getActiveTab,
  getActiveTabUrl,
  getAllTabs,
  getTabsInWindow,
  getPinnedTabs,
  getTabsByUrl,
  getTabById,
} from "@theluckystrike/webext-tabs";

// Get the active tab in the current window
const tab = await getActiveTab();
console.log(tab?.url, tab?.title);

// Get just the URL of the active tab
const url = await getActiveTabUrl();

// Get all tabs across all windows
const allTabs = await getAllTabs();

// Get tabs in a specific window (or current window)
const windowTabs = await getTabsInWindow();
const windowTabsById = await getTabsInWindow(123);

// Get pinned tabs in current window
const pinned = await getPinnedTabs();

// Query tabs by URL pattern
const githubTabs = await getTabsByUrl("https://github.com/*");
const docsTabs = await getTabsByUrl("*://*.example.com/docs/*");

// Get a specific tab by ID
const tab = await getTabById(456);
```

### Opening & Closing Tabs

```typescript
import {
  openTab,
  openOrFocusTab,
  closeTab,
  closeTabs,
} from "@theluckystrike/webext-tabs";

// Open a new tab
const newTab = await openTab("https://example.com");
const backgroundTab = await openTab("https://example.com", false);

// Open or focus existing tab (prevents duplicates)
const tab = await openOrFocusTab("https://example.com");

// Close a single tab
await closeTab(tabId);

// Close multiple tabs
await closeTabs([tabId1, tabId2, tabId3]);
```

### Tab Operations

```typescript
import {
  reloadTab,
  duplicateTab,
  moveTab,
  sendMessageToTab,
} from "@theluckystrike/webext-tabs";

// Reload a tab (optionally bypass cache)
await reloadTab(tabId);
await reloadTab(tabId, true); // bypass cache

// Duplicate a tab
const duplicated = await duplicateTab(tabId);

// Move a tab to a new position
const moved = await moveTab(tabId, 0); // move to first position
const movedToWindow = await moveTab(tabId, 0, windowId); // move to different window

// Send a message to a tab's content script
const response = await sendMessageToTab<{ data: string }>(tabId, { 
  action: "getData" 
});
```

## API Reference

### TabInfo Interface

```typescript
interface TabInfo {
  id: number;
  url: string;
  title: string;
  active: boolean;
  pinned: boolean;
  windowId: number;
  index: number;
}
```

### Query Helpers

| Function | Returns | Description |
|----------|---------|-------------|
| `getActiveTab()` | `TabInfo \| null` | Active tab in current window |
| `getActiveTabUrl()` | `string \| null` | URL of active tab |
| `getAllTabs()` | `TabInfo[]` | All tabs across all windows |
| `getTabsInWindow(windowId?)` | `TabInfo[]` | Tabs in window (default: current) |
| `getPinnedTabs()` | `TabInfo[]` | Pinned tabs in current window |
| `getTabsByUrl(urlPattern)` | `TabInfo[]` | Tabs matching URL pattern |
| `getTabById(tabId)` | `TabInfo \| null` | Single tab by ID |

### Tab Actions

| Function | Returns | Description |
|----------|---------|-------------|
| `openTab(url, active?)` | `TabInfo` | Open new tab (default: active) |
| `openOrFocusTab(url)` | `TabInfo` | Open or focus existing tab by URL |
| `closeTab(tabId)` | `void` | Close a single tab |
| `closeTabs(tabIds)` | `void` | Close multiple tabs |
| `reloadTab(tabId, bypassCache?)` | `void` | Reload a tab |
| `duplicateTab(tabId)` | `TabInfo` | Duplicate a tab |
| `moveTab(tabId, index, windowId?)` | `TabInfo` | Move tab to new position |
| `sendMessageToTab<T>(tabId, message)` | `T` | Send message to content script |

## Project Structure

```
webext-tabs/
├── src/
│   ├── index.ts        # Main library source
│   └── index.test.ts   # Unit tests
├── package.json        # NPM package configuration
├── tsconfig.json       # TypeScript configuration
├── LICENSE             # MIT License
└── README.md           # This file
```

## License

MIT

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
