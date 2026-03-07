import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getActiveTab, getActiveTabUrl, getAllTabs, getTabsInWindow,
  getPinnedTabs, getTabsByUrl, getTabById, openTab, openOrFocusTab,
  closeTab, closeTabs, reloadTab, duplicateTab, moveTab, sendMessageToTab,
} from "./index";

const mockTab = (overrides: Partial<chrome.tabs.Tab> = {}): chrome.tabs.Tab => ({
  id: 1, url: "https://example.com", title: "Example", active: true,
  pinned: false, windowId: 1, index: 0, highlighted: false,
  incognito: false, selected: false, discarded: false, autoDiscardable: true,
  groupId: -1, ...overrides,
});

const globalAny = globalThis as any;

beforeEach(() => {
  vi.clearAllMocks();
  globalAny.chrome = {
    tabs: {
      query: vi.fn().mockResolvedValue([mockTab()]),
      get: vi.fn().mockResolvedValue(mockTab()),
      create: vi.fn().mockResolvedValue(mockTab({ id: 2 })),
      update: vi.fn().mockResolvedValue(mockTab()),
      remove: vi.fn().mockResolvedValue(undefined),
      reload: vi.fn().mockResolvedValue(undefined),
      duplicate: vi.fn().mockResolvedValue(mockTab({ id: 3 })),
      move: vi.fn().mockResolvedValue(mockTab({ index: 5 })),
      sendMessage: vi.fn().mockResolvedValue({ ok: true }),
    },
    windows: {
      update: vi.fn().mockResolvedValue(undefined),
    },
  };
});

describe("webext-tabs", () => {
  it("gets the active tab", async () => {
    const tab = await getActiveTab();
    expect(tab).not.toBeNull();
    expect(tab!.id).toBe(1);
    expect(tab!.url).toBe("https://example.com");
    expect(globalAny.chrome.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true });
  });

  it("returns null when no active tab", async () => {
    globalAny.chrome.tabs.query.mockResolvedValue([]);
    const tab = await getActiveTab();
    expect(tab).toBeNull();
  });

  it("gets active tab URL", async () => {
    const url = await getActiveTabUrl();
    expect(url).toBe("https://example.com");
  });

  it("returns null URL when no active tab", async () => {
    globalAny.chrome.tabs.query.mockResolvedValue([]);
    const url = await getActiveTabUrl();
    expect(url).toBeNull();
  });

  it("gets all tabs", async () => {
    globalAny.chrome.tabs.query.mockResolvedValue([mockTab(), mockTab({ id: 2 })]);
    const tabs = await getAllTabs();
    expect(tabs).toHaveLength(2);
    expect(globalAny.chrome.tabs.query).toHaveBeenCalledWith({});
  });

  it("gets tabs in current window", async () => {
    await getTabsInWindow();
    expect(globalAny.chrome.tabs.query).toHaveBeenCalledWith({ currentWindow: true });
  });

  it("gets tabs in specific window", async () => {
    await getTabsInWindow(5);
    expect(globalAny.chrome.tabs.query).toHaveBeenCalledWith({ windowId: 5 });
  });

  it("gets pinned tabs", async () => {
    globalAny.chrome.tabs.query.mockResolvedValue([mockTab({ pinned: true })]);
    const tabs = await getPinnedTabs();
    expect(tabs[0].pinned).toBe(true);
  });

  it("gets tabs by URL pattern", async () => {
    await getTabsByUrl("https://*.example.com/*");
    expect(globalAny.chrome.tabs.query).toHaveBeenCalledWith({ url: "https://*.example.com/*" });
  });

  it("gets tab by ID", async () => {
    const tab = await getTabById(1);
    expect(tab).not.toBeNull();
    expect(globalAny.chrome.tabs.get).toHaveBeenCalledWith(1);
  });

  it("returns null for invalid tab ID", async () => {
    globalAny.chrome.tabs.get.mockRejectedValue(new Error("not found"));
    const tab = await getTabById(999);
    expect(tab).toBeNull();
  });

  it("opens a new tab", async () => {
    const tab = await openTab("https://example.com");
    expect(tab.id).toBe(2);
    expect(globalAny.chrome.tabs.create).toHaveBeenCalledWith({ url: "https://example.com", active: true });
  });

  it("opens or focuses existing tab", async () => {
    globalAny.chrome.tabs.query.mockResolvedValue([mockTab()]);
    const tab = await openOrFocusTab("https://example.com");
    expect(tab.id).toBe(1);
    expect(globalAny.chrome.tabs.update).toHaveBeenCalledWith(1, { active: true });
  });

  it("closes a tab", async () => {
    await closeTab(1);
    expect(globalAny.chrome.tabs.remove).toHaveBeenCalledWith(1);
  });

  it("closes multiple tabs", async () => {
    await closeTabs([1, 2, 3]);
    expect(globalAny.chrome.tabs.remove).toHaveBeenCalledWith([1, 2, 3]);
  });

  it("reloads a tab", async () => {
    await reloadTab(1, true);
    expect(globalAny.chrome.tabs.reload).toHaveBeenCalledWith(1, { bypassCache: true });
  });

  it("duplicates a tab", async () => {
    const tab = await duplicateTab(1);
    expect(tab.id).toBe(3);
  });

  it("moves a tab", async () => {
    const tab = await moveTab(1, 5);
    expect(globalAny.chrome.tabs.move).toHaveBeenCalledWith(1, { index: 5 });
  });

  it("sends message to tab", async () => {
    const result = await sendMessageToTab(1, { action: "ping" });
    expect(result).toEqual({ ok: true });
  });
});
