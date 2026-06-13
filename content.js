
(function () {
  "use strict";

  // ─── Logger ────────────────────────────────────────────────────────────────
  const TAG   = "%c🔓 Galilee Unlocker";
  const STYLE = "background:#5838c9;color:#fff;font-weight:bold;padding:2px 6px;border-radius:4px;font-size:11px;";
  const DIM   = "color:#aaa;font-size:11px;";

  const log = {
    info : (...args) => console.log (TAG, STYLE, ...args),
    ok   : (...args) => console.log ("%c🔓 Galilee Unlocker%c ✔",
                          STYLE + "background:#5838c9;", "color:#22c55e;font-weight:bold;", ...args),
    warn : (...args) => console.warn(TAG, STYLE, ...args),
    dim  : (...args) => console.log (TAG + "%c", STYLE, DIM, ...args),
  };

  const ctx = window === window.top ? "main page" : `iframe (${location.pathname.split("/").pop()})`;
  log.info(`Active on ${ctx}`);


  
  /**
   * Removes div.blur and removes the gure-is-locked class.
   * @param {Document|Element} root
   * @returns {{ blurRemoved: number, locksRemoved: number }}
   */
  function unlock(root) {
    let blurRemoved  = 0;
    let locksRemoved = 0;

    root.querySelectorAll("div.blur").forEach((el) => {
      el.remove();
      blurRemoved++;
    });

    root.querySelectorAll(".gure-is-locked").forEach((el) => {
      el.classList.remove("gure-is-locked");
      locksRemoved++;
    });

    return { blurRemoved, locksRemoved };
  }

  // --- Initial pass ---
  const init = unlock(document);
  if (init.blurRemoved || init.locksRemoved) {
    log.ok(`Initial pass — paywall: ${init.blurRemoved} removed, locks: ${init.locksRemoved} removed`);
  } else {
    log.dim(`Initial pass — nothing to clean up`);
  }

  // --- MutationObserver ---
  const observer = new MutationObserver((mutations) => {
    let needsUnlock  = false;
    let directBlur   = 0;
    let directLock   = 0;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        // Case 1: added node = div.blur
        if (node.classList && node.classList.contains("blur")) {
          node.remove();
          directBlur++;
          log.warn(`div.blur intercepted and removed immediately`);
          continue;
        }

        // Case 2: added node contains elements to clean up
        if (node.querySelector) {
          if (node.querySelector(".blur") || node.querySelector(".gure-is-locked")) {
            needsUnlock = true;
          }
        }
      }

      // Class attribute modification → gure-is-locked added
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class" &&
        mutation.target.classList &&
        mutation.target.classList.contains("gure-is-locked")
      ) {
        mutation.target.classList.remove("gure-is-locked");
        directLock++;
        log.warn(`gure-is-locked class intercepted on <${mutation.target.tagName.toLowerCase()}> and removed`);
      }
    }

    if (needsUnlock) {
      const r = unlock(document);
      log.ok(`Dynamic cleanup — paywall: ${r.blurRemoved} removed, locks: ${r.locksRemoved} removed`);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  log.dim(`Observer active — waiting for submission...`);
})();
