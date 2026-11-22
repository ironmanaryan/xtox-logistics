"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "./LanguageProvider";
import { translateText, type PhraseTable } from "@/lib/auto-i18n";
import type { Locale } from "@/lib/i18n";

/**
 * Translates the whole rendered page, including server components.
 *
 * Mounted once in the root layout, it walks every text node and a few
 * user-visible attributes, swaps in the Hindi / Kannada phrase when the
 * dictionary has one, and restores the original English when the visitor
 * switches back. The phrase table for a language is loaded lazily, so English
 * visitors download none of it.
 */

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "SVG"]);
const ATTRS = ["placeholder", "aria-label", "title"];

export default function AutoTranslate({ children }: { children: React.ReactNode }) {
  const { locale } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const originals = useRef(new WeakMap<Text, string>());
  const attrOriginals = useRef(new WeakMap<Element, Record<string, string>>());
  const [table, setTable] = useState<{ locale: Locale; data: PhraseTable } | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (locale === "en") {
      setTable({ locale, data: {} });
      return;
    }
    const load =
      locale === "hi"
        ? import("@/lib/auto-phrases-hi")
        : import("@/lib/auto-phrases-kn");
    load
      .then((mod) => {
        if (!cancelled) setTable({ locale, data: mod.phrases });
      })
      .catch(() => {
        if (!cancelled) setTable({ locale, data: {} });
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    const root = ref.current;
    if (!root || !table || table.locale !== locale) return;

    const dict = locale === "en" ? null : table.data;
    const store = originals.current;
    const attrStore = attrOriginals.current;

    const translateNode = (node: Text) => {
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return;
      if (parent.closest("[data-no-translate]")) return;

      if (!store.has(node)) store.set(node, node.data);
      const source = store.get(node) ?? node.data;
      const next = translateText(source, dict, locale);
      if (node.data !== next) node.data = next;
    };

    const translateAttrs = (el: Element) => {
      if (el.closest("[data-no-translate]")) return;
      let saved = attrStore.get(el);
      if (!saved) {
        saved = {};
        attrStore.set(el, saved);
      }
      for (const name of ATTRS) {
        const current = el.getAttribute(name);
        if (current === null) continue;
        if (!(name in saved)) saved[name] = current;
        const next = translateText(saved[name], dict, locale);
        if (current !== next) el.setAttribute(name, next);
      }
    };

    const walk = (start: Node) => {
      if (start.nodeType === Node.TEXT_NODE) {
        translateNode(start as Text);
        return;
      }
      if (start.nodeType !== Node.ELEMENT_NODE && start.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
        return;
      }
      if (start.nodeType === Node.ELEMENT_NODE) translateAttrs(start as Element);
      const walker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let current = walker.nextNode();
      while (current) {
        if (current.nodeType === Node.TEXT_NODE) translateNode(current as Text);
        else translateAttrs(current as Element);
        current = walker.nextNode();
      }
    };

    walk(root);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") continue;
        mutation.addedNodes.forEach((node) => walk(node));
      }
    });
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [locale, table]);

  return <div ref={ref}>{children}</div>;
}
