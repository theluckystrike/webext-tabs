[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-tabs)](https://www.npmjs.com/package/@theluckystrike/webext-tabs)
[![CI](https://github.com/theluckystrike/webext-tabs/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-tabs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/@theluckystrike/webext-tabs)](https://www.npmjs.com/package/@theluckystrike/webext-tabs)
[![GitHub stars](https://img.shields.io/github/stars/theluckystrike/webext-tabs)](https://github.com/theluckystrike/webext-tabs/stargazers)

# webext-tabs

Pre-built typed tab query patterns for Chrome extensions — active tab, search, group, duplicate detection, and more. Part of [@zovo/webext](https://github.com/theluckystrike).

A TypeScript-first utility library that simplifies Chrome extension tab management with fully typed APIs, comprehensive error handling, and battle-tested patterns for common tab operations.

## Features

- **🔍 Active Tab Retrieval** — Get the currently focused tab in any window with a single function call
- **📑 Query All Tabs** — Retrieve tabs across all windows or within a specific window
- **🎯 URL Pattern Matching** — Find tabs matching specific URL patterns using Chrome's built-in matching
- **🚫 Duplicate Prevention** — Check if a tab already exists before opening to avoid duplicates
- **📦 Tab Operations** — Create, close, reload, duplicate, and move tabs with simple async functions
- **💬 Cross-Context Messaging** — Send messages to content scripts in specific tabs
- **🛡️ TypeScript-First** — Full TypeScript support with autocomplete and type safety
- **✅ Zero Dependencies** — Lightweight with no external runtime dependencies

## Install

```bash
npm install @theluckystrike/webext-tabs
# or
pnpm add @theluckystrike/webext-tabs
# or
yarn add @theluckystrike/webext-tabs
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
  TabInfo,
} from "@theluckystrike/webext-tabs";

// Get the active tab
const tab = await getActiveTab();
if (tab) {
  console.log(tab.url, tab.title);
}

// Get just the URL
const url = await getActiveTabUrl();

// Query tabs by URL pattern
const githubTabs = await getTabsByUrl("https://github.com/*");

// Open a new tab
const newTab = await openTab("https://example.com");

// Open or focus existing tab (no duplicates)
const existing = await openOrFocusTab("https://example.com");

// Send a message to a tab's content script
const response = await sendMessageToTab<{ data: string }>(tab.id, { action: "getData" });
```

## API Reference

### Query Helpers

| Function | Returns | Description |
|----------|---------|-------------|
| `getActiveTab()` | `TabInfo \| null` | Get the active tab in the current window |
| `getActiveTabUrl()` | `string \| null` | Get the URL of the active tab |
| `getAllTabs()` | `TabInfo[]` | Get all tabs across all windows |
| `getTabsInWindow(windowId?)` | `TabInfo[]` | Get tabs in a specific window (defaults to current window) |
| `getPinnedTabs()` | `TabInfo[]` | Get all pinned tabs in the current window |
| `getTabsByUrl(pattern)` | `TabInfo[]` | Find tabs matching a URL pattern |
| `getTabById(id)` | `TabInfo \| null` | Get a specific tab by its ID |

### Tab Actions

| Function | Returns | Description |
|----------|---------|-------------|
| `openTab(url, active?)` | `TabInfo` | Open a new tab (defaults to active) |
| `openOrFocusTab(url)` | `TabInfo` | Open a tab or focus it if already open |
| `closeTab(id)` | `void` | Close a single tab |
| `closeTabs(ids)` | `void` | Close multiple tabs at once |
| `reloadTab(id, bypassCache?)` | `void` | Reload a tab (optionally bypassing cache) |
| `duplicateTab(id)` | `TabInfo` | Duplicate an existing tab |
| `moveTab(id, index, windowId?)` | `TabInfo` | Move a tab to a new position |

### Messaging

| Function | Returns | Description |
|----------|---------|-------------|
| `sendMessageToTab(id, message)` | `T` | Send a message to a content script in a tab |

### Type Definitions

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

## Examples

### Find and Close Duplicate Tabs

```typescript
import { getAllTabs, closeTabs } from "@theluckystrike/webext-tabs";

function findDuplicateUrls(tabs: TabInfo[]): Map<string, TabInfo[]> {
  const urlMap = new Map<string, TabInfo[]>();
  
  for (const tab of tabs) {
    // Normalize by hostname to find duplicates
    try {
      const hostname = new URL(tab.url).hostname;
      const existing = urlMap.get(hostname) || [];
      existing.push(tab);
      urlMap.set(hostname, existing);
    } catch {
      // Skip invalid URLs
    }
  }
  
  // Filter to only duplicates
  const duplicates = new Map<string, TabInfo[]>();
  for (const [url, tabs] of urlMap) {
    if (tabs.length > 1) duplicates.set(url, tabs);
  }
  
  return duplicates;
}

async function closeDuplicateTabs() {
  const allTabs = await getAllTabs();
  const duplicates = findDuplicateUrls(allTabs);
  
  for (const [, tabs] of duplicates) {
    // Keep the first tab, close the rest
    const tabsToClose = tabs.slice(1).map(t => t.id);
    if (tabsToClose.length > 0) {
      await closeTabs(tabsToClose);
    }
  }
}
```

### Batch Close Tabs by Pattern

```typescript
import { getTabsByUrl, closeTabs } from "@theluckystrike/webext-tabs";

// Close all GitHub PR tabs
async function closePRTabs() {
  const prTabs = await getTabsByUrl("https://github.com/*/pull/*");
  const prIds = prTabs.map(t => t.id);
  if (prIds.length > 0) {
    await closeTabs(prIds);
    console.log(`Closed ${prIds.length} PR tabs`);
  }
}

// Close all tabs from a specific domain
async function closeDomainTabs(domain: string) {
  const pattern = `https://${domain}/*`;
  const tabs = await getTabsByUrl(pattern);
  const ids = tabs.map(t => t.id);
  if (ids.length > 0) {
    await closeTabs(ids);
  }
}
```

### Smart Tab Opener (Avoid Duplicates)

```typescript
import { openOrFocusTab } from "@theluckystrike/webext-tabs";

// Always opens a tab, but focuses it if it already exists
// Great for extension popup actions
async function openExtensionPage(url: string) {
  const tab = await openOrFocusTab(url);
  return tab;
}

// Usage in popup
await openOrFocusTab("https://github.com/notifications");
```

### Reload All Tabs in Current Window

```typescript
import { getTabsInWindow, reloadTab } from "@theluckystrike/webext-tabs";

async function reloadAllTabsInWindow(bypassCache = false) {
  const tabs = await getTabsInWindow();
  for (const tab of tabs) {
    await reloadTab(tab.id, bypassCache);
  }
}
```

### Reorder Tabs

```typescript
import { getTabsInWindow, moveTab } from "@theluckystrike/webext-tabs";

async function reverseTabOrder() {
  const tabs = await getTabsInWindow();
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    // Move to reverse index
    await moveTab(tab.id, tabs.length - 1 - i);
  }
}

async function groupTabsAtStart() {
  const tabs = await getTabsInWindow();
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    if (tab.index !== i) {
      await moveTab(tab.id, i);
    }
  }
}
```

### Communication with Content Scripts

```typescript
import { sendMessageToTab, getActiveTab } from "@theluckystrike/webext-tabs";

// Send message from popup/background to content script
async function getPageData() {
  const tab = await getActiveTab();
  if (!tab) return null;
  
  const response = await sendMessageToTab<{ title: string; items: string[] }>(
    tab.id,
    { action: "getPageData" }
  );
  return response;
}

// In your content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getPageData") {
    sendResponse({
      title: document.title,
      items: Array.from(document.querySelectorAll("h1")).map(h => h.textContent)
    });
  }
  return true; // Keep channel open for async response
});
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

### tabs vs activeTab

- **`tabs` permission**: Required for `getAllTabs()`, `getTabsByUrl()`, and accessing any tab's URL or title. Grants access to all tabs across all windows.

- **`activeTab` permission**: Only provides access to the currently active tab when the user invokes your extension (clicks the icon or presses a shortcut). More restrictive but doesn't require host permissions.

Use `tabs` when you need to query or manipulate tabs programmatically. Use `activeTab` if you only need to interact with the tab the user is currently viewing.

For more details on Chrome extension permissions, see the [Chrome Extension Guide](https://chrome-extension-guide.github.io/).

## Related

This package is part of the [@zovo/webext](https://github.com/theluckystrike) ecosystem:

- [@theluckystrike/webext-tabs](https://github.com/theluckystrike/webext-tabs) — Tab management utilities
- [@theluckystrike/webext-storage](https://github.com/theluckystrike/webext-storage) — Typed storage wrapper
- [@theluckystrike/webext-messaging](https://github.com/theluckystrike/webext-messaging) — Type-safe message passing

Visit [zovo.one](https://zovo.one) for more information about the zovo ecosystem.

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike)

[zovo.one](https://zovo.one) — [GitHub](https://github.com/theluckystrike) — [Chrome Extension Guide](https://chrome-extension-guide.github.io/)
