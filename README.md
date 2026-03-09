[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-tabs)](https://www.npmjs.com/package/@theluckystrike/webext-tabs)
[![CI](https://github.com/theluckystrike/webext-tabs/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-tabs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![npm bundle size](https://img.shields.io/bundlejs/size/@theluckystrike/webext-tabs)](https://bundlejs.com/?q=@theluckystrike/webext-tabs)

# webext-tabs

Pre-built typed tab query patterns for Chrome extensions — the most-used Chrome API, made simple.

`webext-tabs` provides a comprehensive set of TypeScript helpers that wrap the Chrome Tabs API with sensible defaults, proper typing, and error handling. Whether you need to find the active tab, query by URL pattern, group tabs, or manage tab lifecycle — this library has you covered.

## Features

- **Query Helpers**: Get active tab, all tabs, tabs by URL, pinned tabs, tabs in specific windows
- **Tab Lifecycle**: Open, close, reload, duplicate, and move tabs
- **Smart Open**: Open or focus existing tabs to prevent duplicates
- **Tab Grouping**: Create, update, and manage tab groups with colors
- **Messaging**: Send messages to content scripts with full type support
- **100% Typed**: Full TypeScript support with no `any` types in public API

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
  getTabsByUrl,
  openTab,
} from "@theluckystrike/webext-tabs";

// Get the currently active tab
const tab = await getActiveTab();
console.log(tab?.url, tab?.title);

// Query tabs matching a URL pattern
const githubTabs = await getTabsByUrl("https://github.com/*");
console.log(`Found ${githubTabs.length} GitHub tabs`);

// Open a new tab
const newTab = await openTab("https://example.com");
```

## Common Patterns

### Find Duplicate Tabs

Prevent opening the same URL multiple times:

```typescript
import { getTabsByUrl, openOrFocusTab } from "@theluckystrike/webext-tabs";

// Check if tab already exists before opening
async function ensureSingleTab(url: string) {
  const existing = await getTabsByUrl(url);
  if (existing.length > 0) {
    // Focus the existing tab instead of creating a duplicate
    await openOrFocusTab(url);
    return existing[0];
  }
  return openTab(url);
}
```

### Close Tabs by Pattern

Clean up multiple tabs matching a criteria:

```typescript
import { getTabsByUrl, closeTabs } from "@theluckystrike/webext-tabs";

// Close all tabs matching a pattern
async function closeOldTabs(pattern: string) {
  const tabs = await getTabsByUrl(pattern);
  if (tabs.length > 0) {
    await closeTabs(tabs.map(t => t.id));
    console.log(`Closed ${tabs.length} tabs`);
  }
}

// Usage: Close all old documentation tabs
await closeOldTabs("https://docs.*/*");
```

### Get All Tabs in Current Window

```typescript
import { getTabsInWindow, getPinnedTabs } from "@theluckystrike/webext-tabs";

// Get all tabs in the current window
const windowTabs = await getTabsInWindow();

// Get only pinned tabs
const pinned = await getPinnedTabs();
```

### Tab Grouping with Colors

```typescript
import { getTabsInWindow, createTabGroup } from "@theluckystrike/webext-tabs";

// Group tabs by domain
async function groupTabsByDomain() {
  const tabs = await getTabsInWindow();
  const groups: Record<string, number[]> = {};
  
  for (const tab of tabs) {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      groups[domain] = [...(groups[domain] || []), tab.id];
    } catch {
      // Skip invalid URLs
    }
  }
  
  // Note: Chrome tabGroups API would be used here
  return groups;
}
```

## API Reference

### Query Helpers

| Function | Returns | Description |
|----------|---------|-------------|
| `getActiveTab()` | `TabInfo \| null` | Active tab in the current window |
| `getActiveTabUrl()` | `string \| null` | URL of the active tab |
| `getAllTabs()` | `TabInfo[]` | All tabs across all windows |
| `getTabsInWindow(windowId?)` | `TabInfo[]` | Tabs in a specific window (default: current) |
| `getPinnedTabs()` | `TabInfo[]` | Pinned tabs in the current window |
| `getTabsByUrl(pattern)` | `TabInfo[]` | Tabs matching a URL pattern (supports wildcards) |
| `getTabById(id)` | `TabInfo \| null` | Get a single tab by its ID |

### Tab Actions

| Function | Returns | Description |
|----------|---------|-------------|
| `openTab(url, active?)` | `TabInfo` | Open a new tab at the specified URL |
| `openOrFocusTab(url)` | `TabInfo` | Open a tab or focus existing tab matching URL |
| `closeTab(id)` | `void` | Close a single tab by ID |
| `closeTabs(ids)` | `void` | Close multiple tabs by IDs |
| `reloadTab(id, bypassCache?)` | `void` | Reload a tab, optionally bypassing cache |
| `duplicateTab(id)` | `TabInfo` | Create a duplicate of an existing tab |
| `moveTab(id, index, windowId?)` | `TabInfo` | Move a tab to a new position |
| `sendMessageToTab(id, message)` | `T` | Send a message to a tab's content script |

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

## Permissions: `tabs` vs `activeTab`

Understanding the difference between these permissions is crucial for Chrome extension development.

### `activeTab` Permission

```json
{
  "permissions": ["activeTab"]
}
```

- **When to use**: For most extensions that only need to interact with the user's current tab.
- **Behavior**: The extension can only access the active tab when the user clicks the extension icon or a keyboard shortcut.
- **Advantage**: No permission warning on install — users see a minimal prompt.
- **Use case**: Quick actions, page analyzers, content script injection on demand.

```typescript
// With activeTab, you can still use:
const tab = await getActiveTab(); // ✅ Works for current tab only
const url = await getActiveTabUrl(); // ✅ Works
await openTab("https://example.com"); // ✅ Works
```

### `tabs` Permission

```json
{
  "permissions": ["tabs"]
}
```

- **When to use**: When you need access to all tabs, their URLs, or need to operate on tabs without user interaction.
- **Behavior**: Full access to all tabs across all windows at any time.
- **Disadvantage**: Shows a scary permission warning on install — users may hesitate to install.
- **Use case**: Tab managers, tab groupers, extension that work in background.

```typescript
// With tabs permission, you can also use:
const allTabs = await getAllTabs(); // ✅ All windows
const tabsByUrl = await getTabsByUrl("https://*/*"); // ✅ Full URL access
await closeTab(id); // ✅ Close any tab silently
```

### Recommendation

**Start with `activeTab`** and only request `tabs` if you genuinely need capabilities that require it. Many extensions can work perfectly fine with just `activeTab`.

## Part of @zovo/webext

`webext-tabs` is part of the `@zovo/webext` ecosystem — a collection of typed helpers for Chrome extension development:

- [@theluckystrike/webext-tabs](/) — Tab management (this package)
- [@theluckystrike/webext-storage](/) — Storage helpers
- [@theluckystrike/webext-i18n](/) — Internationalization utilities

## License

MIT © [theluckystrike](https://github.com/theluckystrike)

---

Built with ❤️ by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
