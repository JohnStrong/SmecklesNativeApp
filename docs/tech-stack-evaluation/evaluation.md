# Hybrid Web + Android Framework Evaluation

Given your requirements — React-based, web-first, JSON API communication via WebSockets/AJAX, and eventual Android extension with minimal pain — here are the realistic candidates:

---

## 1. Expo (React Native + Web) — RECOMMENDED

| Criterion | Assessment |
|-----------|-----------|
| GitHub Stars | ~50k (expo/expo) — built atop React Native (126k stars) |
| Active Development | Extremely active: 32,544 commits, 299 open PRs, latest release in 2026 |
| Usage | 1.2 million dependents on GitHub. Massive ecosystem |
| Support Channels | Discord, forums (chat.expo.dev), GitHub Discussions, Reddit r/expo, X, Bluesky |
| Cost | Open source, MIT License. EAS (Expo Application Services) has paid tiers for cloud builds/OTA updates, but you don't need them |
| Web support | Built-in via Expo Router + React Native for Web. Single codebase → web + Android + iOS |

**Why it fits your case:** You write React components. They render in a browser today. When you're ready for Android, you run `npx expo run:android` and get a native app from the same code. Expo Router gives you file-based routing that works across all platforms. WebSocket/fetch to your Scala Play backend works identically on web and native.

**Honest downsides:** Native device APIs (camera, NFC, etc.) require Expo modules or custom native code. Performance is near-native but not identical to fully native apps. The "web" output is React Native for Web, which has some CSS/DOM differences from a typical React SPA.

---

## 2. Ionic + Capacitor (React)

| Criterion | Assessment |
|-----------|-----------|
| GitHub Stars | Ionic Framework: ~52.4k; Capacitor: ~15.8k |
| Active Development | Active: Ionic released April 2025, Capacitor v7.6.6 released June 2026 |
| Usage | Ionic is one of the most-used hybrid frameworks. Millions of apps deployed |
| Support Channels | Ionic Forum, Discord, GitHub Issues/Discussions, Ionic Enterprise support (paid) |
| Cost | MIT License (both). Ionic has paid Enterprise tier for premium plugins + support, but core is free |
| Web support | You write a standard React SPA → Capacitor wraps it in a native WebView for Android/iOS |

**Why it fits your case:** You build a normal React app with standard HTML/CSS/JS. It runs in a browser today. When you want Android, Capacitor wraps your existing web app in a native shell. Zero code changes required for the basic case. Your WebSocket/AJAX code stays identical.

**Honest downsides:** It's a WebView-based approach — your Android app is essentially a browser tab in a native wrapper. Performance is worse than React Native for complex UIs or heavy animation. Native-feeling interactions (scrolling inertia, transitions) require Ionic's UI components. If you later want truly native rendering, you'd need to rewrite.

---

## 3. Tauri 2.0 (React frontend)

| Criterion | Assessment |
|-----------|-----------|
| GitHub Stars | ~108k |
| Active Development | Very active: 1,617 releases, Rust-based backend |
| Usage | 821 direct dependents (much lower than Expo/Ionic for mobile use cases) |
| Support Channels | Discord, GitHub Discussions, OpenCollective sponsors |
| Cost | MIT / Apache 2.0 dual license. Fully open source |
| Web support | Not really — Tauri is desktop/mobile native. No "run in browser" story |

**Why you should probably skip it:** Tauri's mobile support (Android/iOS) landed in v2.0 (Oct 2024) and is still relatively immature. More critically, it has no web deployment story — it's for packaging apps, not serving them in a browser. Since you want browser-first, this is the wrong tool.

---

## 4. React Native for Web (standalone)

| Criterion | Assessment |
|-----------|-----------|
| GitHub Stars | ~22.1k |
| Active Development | Moderate: last release 0.20 (React 19 support), maintained by one person (Nicolas Gallagher, ex-Meta) |
| Usage | Used by Meta (Twitter's web, etc.), but much narrower community than Expo |
| Support Channels | GitHub Discussions only |
| Cost | MIT License |

**Why you should use Expo instead of this directly:** Expo already integrates react-native-web under the hood. Using it standalone means you're doing all the integration work yourself.

---

## Verdict

For your shopping-list-to-budgeting-app scenario:

**If you want the smoothest web-first experience with React conventions you already know:**
→ **Ionic + Capacitor**. Write a standard React SPA. Use `fetch` or WebSocket to your Scala Play API. Ship to browser immediately. Add Capacitor later for Android with near-zero code changes.

**If you want the best long-term mobile experience with one codebase:**
→ **Expo (React Native)**. Slightly steeper initial learning curve (React Native layout vs CSS), but produces genuinely native Android/iOS apps and a web app from one codebase. Given your long-term budgeting-app vision with possible native features, this pays off.

**My recommendation for you specifically:** Start with **Ionic + Capacitor**. Your app is CRUD-heavy (persons, shopping lists, budget entries) with no heavy animations or complex native interactions needed. A standard React SPA with Capacitor wrapping gives you the fastest path to web, the lowest learning curve, and a reasonable Android app later. If you eventually outgrow WebView performance, you can migrate to Expo — but for a budgeting/list app, you almost certainly won't need to.
