[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-tabs)](https://www.npmjs.com/package/@theluckystrike/webext-tabs)
[![CI](https://github.com/theluckystrike/webext-tabs/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-tabs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/@theluckystrike/webext-tabs)](https://www.npmjs.com/package/@theluckystrike/webext-tabs)

# webext-tabs

Pre-built typed tab query patterns for Chrome extensions — active tab, search, group, duplicate detection, and more. Part of [@zovo/webext](https://github.com/theluckystrike).

## Features

- **Active Tab** — Get the currently focused tab in any window
- **All Tabs** — Query all tabs across windows or within a specific window
- **Search by URL** — Find tabs matching specific URL patterns
- **Duplicate Detection** — Check if a tab already exists before opening
- **Tab Grouping** — Organize tabs into color-coded groups
- **Tab Operations** — Move, create, close, reload, and duplicate tabs
- **Tab Events** — Listen for tab creation, updates, and removal
- **Fully Typed** — TypeScript-first API with full autocomplete

## Install

```bash
npm install @theluckystrike/webext-tabs
# or
pnpm add @theluckystrike/webext-tabs
```

## Quick Start

```typescript
import {
  getActiveTab,
  getActiveTabUrl,
  getAllTabs,
  getTabsByUrl,
  openTab,
  openOrFocusTab,
  closeTab,
  reloadTab,
  sendMessageToTab,
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

## Common Patterns

### Find Duplicate Tabs

```typescript
import { getAllTabs } from "@theluckystrike/webext-tabs";

function findDuplicateUrls(tabs: TabInfo[]): Map<string, TabInfo[]> {
  const urlMap = new Map<string, TabInfo[]>();
  
  for (const tab of tabs) {
    const normalizedUrl = new URL(tab.url).hostname;
    const existing = urlMap.get(normalizedUrl) || [];
    existing.push(tab);
    urlMap.set(normalizedUrl, existing);
  }
  
  // Filter to only duplicates
  const duplicates = new Map<string, TabInfo[]>();
  for (const [url, tabs] of urlMap) {
    if (tabs.length > 1) duplicates.set(url, tabs);
  }
  
  return duplicates;
}

const allTabs = await getAllTabs();
const dupes = findDuplicateUrls(allTabs);
console.log("Duplicates:", Array.from(dupes.entries()));
```

### Close Tabs by Pattern

```typescript
import { getTabsByUrl, closeTabs } from "@theluckystrike/webext-tabs";

// Close all GitHub PR tabs
const prTabs = await getTabsByUrl("https://github.com/*/pull/*");
const prIds = prTabs.map(t => t.id);
if (prIds.length > 0) {
  await closeTabs(prIds);
}
```

### Group Tabs by Color

```typescript
import { getAllTabs, getTabById } from "@theluckystrike/webext-tabs";

const tabs = await getAllTabs();
const hostname = (url: string) => new URL(url).hostname;

// Group by domain
const groups = new Map<string, TabInfo[]>();
for (const tab of tabs) {
  const host = hostname(tab.url);
  const group = groups.get(host) || [];
  group.push(tab);
  groups.set(host, group);
}

// Color palette for groups
const colors = ["grey", "blue", "red", "yellow", "green", "pink", "purple", "cyan"] as const;

let colorIndex = 0;
for (const [, groupTabs] of groups) {
  if (groupTabs.length < 2) continue;
  
  const color = colors[colorIndex % colors.length];
  const groupId = await chrome.tabs.group({ tabIds: groupTabs.map(t => t.id) });
  await chrome.tabGroups.update(groupId, { title: "example.com", color });
  
  colorIndex++;
}
```

## API

### Query Helpers

| Function | Returns | Description |
|----------|---------|-------------|
| `getActiveTab()` | `TabInfo \| null` | Active tab in current window |
| `getActiveTabUrl()` | `string \| null` | URL of active tab |
| `getAllTabs()` | `TabInfo[]` | All tabs across all windows |
| `getTabsInWindow(windowId?)` | `TabInfo[]` | Tabs in window (default: current) |
| `getPinnedTabs()` | `TabInfo[]` | Pinned tabs in current window |
| `getTabsByUrl(pattern)` | `TabInfo[]` | Tabs matching URL pattern |
| `getTabById(id)` | `TabInfo \| null` | Single tab by ID |

### Tab Actions

| Function | Returns | Description |
|----------|---------|-------------|
| `openTab(url, active?)` | `TabInfo` | Open new tab |
| `openOrFocusTab(url)` | `TabInfo` | Open or focus existing tab (avoids duplicates) |
| `closeTab(id)` | `void` | Close a single tab |
| `closeTabs(ids)` | `void` | Close multiple tabs |
| `reloadTab(id, bypassCache?)` | `void` | Reload a tab |
| `duplicateTab(id)` | `TabInfo` | Duplicate a tab |
| `moveTab(id, index, windowId?)` | `TabInfo` | Move tab to new position |

### Messaging

| Function | Returns | Description |
|----------|---------|-------------|
| `sendMessageToTab(id, message)` | `T` | Send message to content script |

### TabInfo Type

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

## Permissions

This library requires the `tabs` permission in your `manifest.json`:

```json
{
  "permissions": [
    "tabs"
  ]
}
```

### `tabs` vs `activeTab`

- **`tabs` permission**: Required for `getAllTabs()`, `getTabsByUrl()`, and accessing any tab's URL/title. Grants access to all tabs across all windows.
  
- **`activeTab` permission**: Only provides access to the currently active tab when the user invokes your extension (clicks the icon or presses a shortcut). More restrictive but doesn't require host permissions.

Use `tabs` when you need to query or manipulate tabs programmatically. Use `activeTab` if you only need to interact with the tab the user is currently viewing.

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)

Part of the [@zovo/webext](https://github.com/theluckystrike) ecosystem — typed utilities for Chrome extension development.
