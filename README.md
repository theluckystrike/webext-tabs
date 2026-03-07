[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-tabs)](https://www.npmjs.com/package/@theluckystrike/webext-tabs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

# webext-tabs

Common tab query patterns as typed helpers for Chrome extensions.

Part of the [chrome-extension-guide](https://github.com/niceByte/chrome-extension-guide) ecosystem.

## Install

```bash
npm install @theluckystrike/webext-tabs
```

## Usage

```typescript
import {
  getActiveTab, getActiveTabUrl, getAllTabs, getTabsByUrl,
  openTab, openOrFocusTab, closeTab, reloadTab, sendMessageToTab,
} from "@theluckystrike/webext-tabs";

// Get the active tab
const tab = await getActiveTab();
console.log(tab?.url, tab?.title);

// Get just the URL
const url = await getActiveTabUrl();

// Query tabs by URL pattern
const githubTabs = await getTabsByUrl("https://github.com/*");

// Open a new tab
const newTab = await openTab("https://example.com");

// Open or focus existing tab (no duplicates)
const tab = await openOrFocusTab("https://example.com");

// Send a message to a tab's content script
const response = await sendMessageToTab(tab.id, { action: "getData" });
```

## API

### Query Helpers

| Function | Returns | Description |
|----------|---------|-------------|
| `getActiveTab()` | `TabInfo \| null` | Active tab in current window |
| `getActiveTabUrl()` | `string \| null` | URL of active tab |
| `getAllTabs()` | `TabInfo[]` | All tabs across windows |
| `getTabsInWindow(windowId?)` | `TabInfo[]` | Tabs in window (default: current) |
| `getPinnedTabs()` | `TabInfo[]` | Pinned tabs in current window |
| `getTabsByUrl(pattern)` | `TabInfo[]` | Tabs matching URL pattern |
| `getTabById(id)` | `TabInfo \| null` | Single tab by ID |

### Tab Actions

| Function | Returns | Description |
|----------|---------|-------------|
| `openTab(url, active?)` | `TabInfo` | Open new tab |
| `openOrFocusTab(url)` | `TabInfo` | Open or focus existing tab |
| `closeTab(id)` | `void` | Close a tab |
| `closeTabs(ids)` | `void` | Close multiple tabs |
| `reloadTab(id, bypassCache?)` | `void` | Reload a tab |
| `duplicateTab(id)` | `TabInfo` | Duplicate a tab |
| `moveTab(id, index, windowId?)` | `TabInfo` | Move tab position |
| `sendMessageToTab(id, message)` | `T` | Send message to content script |

### TabInfo

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

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
