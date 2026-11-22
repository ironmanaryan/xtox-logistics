"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "./LanguageProvider";
import { translateText, type PhraseTable } from "@/lib/auto-i18n";
import type { Locale } from "@/lib/i18n";

/**
 * Translates the parts of the page that are still hard-coded English —
 * including server components such as legal policies and blog posts.
 *
 * Components that already use the i18n dictionary render their own Hindi or
 * Kannada; this layer deliberately leaves that text alone (it is not English),
 * so switching languages can always go back and forth cleanly. The phrase
 * table for a language is loaded lazily, so English visitors download none of
 * it.
 */

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "SVG"]);
const ATTRS = ["placeholder", "aria-label", "title"];

const ASCII = /[A-Za-z]/;

function looksEnglish(text: string): boolean {
  let ascii = 0;
  let other = 0;
  for (const char of text) {
    if (/[A-Za-z]/.test(char)) ascii++;
    else if (/[\u0900-\u0DFF]/.test(char)) other++;
  }
  return ascii > 0 && ascii >= other;
}

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
    const load = locale === "hi" ? import("@/lib/auto-phrases-hi") : import("@/lib/auto-phrases-kn");
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
    if (!root) return;
    const dict = locale === "en" ? null : table?.locale === locale ? table.data : null;
    if (locale !== "en" && !dict) return; // wait for the language table

    const store = originals.current;
    const attrStore = attrOriginals.current;

    const translateNode = (node: Text) => {
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return;
      if (parent.closest("[data-no-translate]")) return;

      if (locale === "en") {
        if (store.has(node)) {
          const source = store.get(node);
          if (source !== undefined && node.data !== source) node.data = source;
        } else if (ASCII.test(node.data)) {
          store.set(node, node.data);
        }
        return;
      }

      if (!store.has(node)) {
        // Text rendered by a translated component is not English; leave it be.
        if (!looksEnglish(node.data)) return;
        store.set(node, node.data);
      }
      const source = store.get(node);
      if (source === undefined) return;
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
        if (!(name in saved)) {
          if (locale !== "en" && !looksEnglish(current)) continue;
          saved[name] = current;
        }
        if (locale === "en") {
          if (saved[name] && current !== saved[name]) el.setAttribute(name, saved[name]);
          continue;
        }
        // A component already localised this attribute; don't override it.
        if (current !== saved[name]) continue;
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
        // React rewrote a text node on re-render. If it put our English source
        // back, translate it again; otherwise (component-localised text) leave it.
        if (mutation.type === "characterData") {
          const node = mutation.target as Text;
          const source = store.get(node);
          if (source === undefined || node.data !== source) continue;
          const next = locale === "en" ? source : translateText(source, dict, locale);
          if (next !== node.data) node.data = next;
          continue;
        }
        if (mutation.type !== "childList") continue;
        mutation.addedNodes.forEach((node) => walk(node));
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [locale, table]);

  return <div ref={ref}>{children}</div>;
}
