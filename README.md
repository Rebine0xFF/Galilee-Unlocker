<div align="right">
  <a href="README_Fr.md">🇫🇷 Lire en français</a>
</div>


<div align="center">
  <h1>Galilee Unlocker</h1>
  <p><strong>Browser extension that removes the subscription paywall on <a href="https://galilee.ac">galilee.ac</a></strong></p>

  <p>
    <img src="https://img.shields.io/github/license/Rebine0xFF/Galilee-Unlocker?style=for-the-badge" alt="GitHub License">
    <img src="https://img.shields.io/badge/Status-Finished-green?style=for-the-badge" alt="Status">
  </P>

  <p>
    <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-5838c9?style=flat-square&logo=googlechrome&logoColor=white">
    <img alt="Microsoft Edge" src="https://img.shields.io/badge/Edge-Supported-0078D4?style=flat-square&logo=microsoftedge&logoColor=white">
    <img alt="Google Chrome" src="https://img.shields.io/badge/Chrome-Supported-4285F4?style=flat-square&logo=googlechrome&logoColor=white">
  </p>
</div>

---

## Overview

A lightweight browser extension that automatically removes the subscription overlay on [galilee.ac](https://galilee.ac), a French math e-learning platform built on Moodle.

When an answer is submitted, the platform injects a blur overlay and locks the correction behind a paywall (`div.blur` + CSS class `gure-is-locked`). This extension intercepts and removes these elements in real time, without any user interaction.

---

## Features

- **Instant CSS shield** : a stylesheet injected at `document_start` hides the overlay before it is ever rendered, preventing any visual flash
- **Dynamic DOM cleanup** : a `MutationObserver` watches for runtime injections by `ai_logger.js` and removes the paywall the moment it appears
- **iframe support** : exercises are embedded as cross-origin iframes; the extension runs inside each of them via `all_frames: true`
- **Attribute watching** : also listens for `class` attribute mutations to catch the `gure-is-locked` lock being added to existing elements
- **Recognisable console logs** : every action is logged with a distinctive styled badge for easy debugging

---

## Installation

> No store listing, load the extension manually in developer mode.

1. **Download** the [latest release](../../releases/latest) and unzip it, or clone this repository
2. Open your browser and navigate to:
   - **Edge**: `edge://extensions/`
   - **Chrome**: `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `galilee-unlocker/` folder
5. The extension is active, navigate to any page on `galilee.ac`

To update after a code change, click **↻ reload** on the extension card.

---

## How it works

The paywall is applied client-side by `ai_logger.js`, a script bundled with the platform. After answer submission it checks the user's subscription status and, if the paywall is active, adds:

- a `div.blur` overlay containing the `div.gosabonner` upsell banner
- the CSS class `gure-is-locked` on the parent `div.outcome`

The extension counters this in two layers:

| Layer | File | Timing | Mechanism |
|---|---|---|---|
| CSS shield | `styles.css` | `document_start` | `div.blur { display: none !important }` hides any future overlay before paint |
| JS cleanup | `content.js` | `document_idle` | `MutationObserver` removes injected nodes and strips the locking class on mutation |

Both layers are injected into the main page **and** all iframes (`all_frames: true`), since each exercise runs in its own `showquestion.php` iframe.

---

## Compatibility

| Browser | Status |
|---|---|
| Microsoft Edge (Chromium) | ✅ Tested |
| Google Chrome | ✅ Compatible (Manifest V3) |
| Firefox | ⚠️ Not tested (requires Manifest V2 adaptation) |