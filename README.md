# webext-tabs

<div align="center">

[![CI](https://github.com/theluckystrike/webext-tabs/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-tabs/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@theluckystrike/webext-tabs.svg)](https://www.npmjs.com/package/@theluckystrike/webext-tabs)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178c6.svg)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/npm/l/@theluckystrike/webext-tabs.svg)](./LICENSE)

</div>

Pre-built typed tab query patterns for Chrome extensions — get active tab, find by URL, group tabs, and more.

## Features

- **🔍 Query Helpers** — Get active tab, all tabs, tabs by URL pattern, pinned tabs, tabs in specific windows
- **📑 Tab Operations** — Create, close, reload, duplicate, and move tabs
- **🎯 Smart Open** — Open a tab or focus it if already open (prevent duplicates)
- **💬 Messaging** — Send messages to content scripts with full type inference
- **🛡️ Type Safe** — Full TypeScript support with typed `TabInfo` interface

## Install

```bash
npm install @theluckystrike/webext-tabs
```

## Quick Start

### Get the Active Tab

```typescript
import { getActiveTab, getActiveTabUrl } from "@theluckystrike/webext-tabs";

// Get the full tab object
const tab = await getActiveTab();
console.log(tab?.url, tab?.title);

// Or just get the URL
const url = await getActiveTabUrl();
```

### Query Tabs by URL

```typescript
import { getTabsByUrl } from "@theluckystrike/webext-tabs";

// Find all GitHub tabs
const githubTabs = await getTabsByUrl("https://github.com/*");
console.log(`Found ${githubTabs.length} GitHub tabs`);

// Use glob patterns
const docsTabs = await getTabsByUrl("https://*.example.com/docs/*");
```

### Create a New Tab

```typescript
import { openTab, openOrFocusTab } from "@theluckystrike/webext-tabs";

// Open a new tab
const newTab = await openTab("https://example.com");

// Open or focus existing (no duplicates)
const tab = await openOrFocusTab("https://example.com");
```

## Common Patterns

### Find Duplicate Tabs

```typescript
import { getAllTabs, getTabsByUrl } from "@theluckystrike/webext-tabs";

// Find potential duplicates by URL
async function findDuplicates(urlPattern: string) {
  const tabs = await getTabsByUrl(urlPattern);
  
  if (tabs.length > 1) {
    console.log(`Found ${tabs.length} tabs matching: ${urlPattern}`);
    return tabs; // Keep the first, close the rest
  }
  return [];
}

// Usage
const duplicates = await findDuplicates("https://github.com/*");
```

### Close All Tabs Matching Pattern

```typescript
import { getTabsByUrl, closeTabs } from "@theluckystrike/webext-tabs";

// Close all tabs to a specific domain
async function closeAllToDomain(domain: string) {
  const pattern = `https://${domain}/*`;
  const tabs = await getTabsByUrl(pattern);
  
  if (tabs.length > 0) {
    const ids = tabs.map(t => t.id);
    await closeTabs(ids);
    console.log(`Closed ${ids.length} tabs`);
  }
}

// Usage
await closeAllToDomain("youtube.com");
```

### Get Tabs in Current Window

```typescript
import { getTabsInWindow, getPinnedTabs } from "@theluckystrike/webext-tabs";

// All tabs in current window
const windowTabs = await getTabsInWindow();

// Only pinned tabs
const pinned = await getPinnedTabs();

// Tabs in a specific window
const otherWindowTabs = await getTabsInWindow(12345);
```

### Tab Grouping with Colors

```typescript
import { getTabsInWindow, moveTab } from "@theluckystrike/webext-tabs";

// Group tabs by organizing them in order
// (Chrome's tab grouping API requires chrome.tabs.group)
async function groupTabsByDomain(windowId?: number) {
  const tabs = await getTabsInWindow(windowId);
  
  // Group by domain
  const byDomain = new Map<string, typeof tabs>();
  
  for (const tab of tabs) {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      
      if (!byDomain.has(domain)) {
        byDomain.set(domain, []);
      }
      byDomain.get(domain)!.push(tab);
    } catch {
      // Skip invalid URLs
    }
  }
  
  // Move tabs to group them (sorted by domain)
  let index = 0;
  for (const [, domainTabs] of byDomain) {
    for (const tab of domainTabs) {
      await moveTab(tab.id, index++);
    }
  }
}
```

### Reload and Update Tabs

```typescript
import { reloadTab, duplicateTab, sendMessageToTab } from "@theluckystrike/webext-tabs";

// Reload a tab (optionally bypassing cache)
await reloadTab(tabId, true); // bypass cache

// Duplicate a tab
const newTab = await duplicateTab(tabId);

// Send a message to a content script
const response = await sendMessageToTab<{ data: string }>(tabId, {
  action: "getData",
});
```

## API Reference

### Query Helpers

| Function | Returns | Description |
|----------|---------|-------------|
| `getActiveTab()` | `TabInfo \| null` | Active tab in current window |
| `getActiveTabUrl()` | `string \| null` | URL of active tab |
| `getAllTabs()` | `TabInfo[]` | All tabs across all windows |
| `getTabsInWindow(windowId?)` | `TabInfo[]` | Tabs in window (default: current) |
| `getPinnedTabs()` | `TabInfo[]` | Pinned tabs in current window |
| `getTabsByUrl(pattern)` | `TabInfo[]` | Tabs matching URL pattern (glob supported) |
| `getTabById(id)` | `TabInfo \| null` | Single tab by ID |

### Tab Actions

| Function | Returns | Description |
|----------|---------|-------------|
| `openTab(url, active?)` | `TabInfo` | Open new tab (default: active) |
| `openOrFocusTab(url)` | `TabInfo` | Open or focus existing tab by URL |
| `closeTab(id)` | `void` | Close a single tab |
| `closeTabs(ids)` | `void` | Close multiple tabs |
| `reloadTab(id, bypassCache?)` | `void` | Reload a tab |
| `duplicateTab(id)` | `TabInfo` | Duplicate a tab |
| `moveTab(id, index, windowId?)` | `TabInfo` | Move tab to new position/window |
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

This library uses the Chrome `tabs` API. The permission you need depends on your use case:

### `tabs` Permission

Required for:
- Querying tabs across all windows
- Accessing full URL information
- Using `getAllTabs()`, `getTabsByUrl()`, `getTabsInWindow()`

```json
{
  "permissions": ["tabs"]
}
```

### `activeTab` Permission

Use this for:
- Only getting the active tab in the current window
- Less permission surface (recommended when possible)

```json
{
  "permissions": ["activeTab"]
}
```

**Note:** With `activeTab`, `getActiveTab()` and `getActiveTabUrl()` still work, but `getAllTabs()` will only return the active tab. Use `tabs` permission when you need to query multiple tabs or access URLs of background tabs.

## Part of @zovo/webext

`webext-tabs` is part of the [@zovo/webext](https://github.com/theluckystrike) ecosystem — a collection of typed helpers for Chrome extension development.

Other packages:
- [webext-context-menu](https://github.com/theluckystrike/webext-context-menu) — Typed context menu helpers
- [webext-storage](https://github.com/theluckystrike/webext-storage) — Type-safe storage API
- [webext-badge](https://github.com/theluckystrike/webext-badge) — Badge text and color helpers

## License

MIT

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)

</div>
