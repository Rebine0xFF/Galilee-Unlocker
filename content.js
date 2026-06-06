/**
 * Galilée Unlocker – content.js  v1.2
 * Cible : https://galilee.ac/* (page principale + tous les iframes)
 */

(function () {
  "use strict";

  // ─── Logger ────────────────────────────────────────────────────────────────
  const TAG   = "%c🔓 Galilée Unlocker";
  const STYLE = "background:#5838c9;color:#fff;font-weight:bold;padding:2px 6px;border-radius:4px;font-size:11px;";
  const DIM   = "color:#aaa;font-size:11px;";

  const log = {
    info : (...args) => console.log (TAG, STYLE, ...args),
    ok   : (...args) => console.log ("%c🔓 Galilée Unlocker%c ✔",
                          STYLE + "background:#5838c9;", "color:#22c55e;font-weight:bold;", ...args),
    warn : (...args) => console.warn(TAG, STYLE, ...args),
    dim  : (...args) => console.log (TAG + "%c", STYLE, DIM, ...args),
  };
  // ───────────────────────────────────────────────────────────────────────────

  const ctx = window === window.top ? "page principale" : `iframe (${location.pathname.split("/").pop()})`;
  log.info(`Actif sur ${ctx}`);

  /**
   * Supprime div.blur et retire la classe gure-is-locked.
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

  // --- Passe initiale ---
  const init = unlock(document);
  if (init.blurRemoved || init.locksRemoved) {
    log.ok(`Passe initiale — paywall: ${init.blurRemoved} supprimé(s), verrous: ${init.locksRemoved} retiré(s)`);
  } else {
    log.dim(`Passe initiale — rien à nettoyer`);
  }

  // --- MutationObserver ---
  const observer = new MutationObserver((mutations) => {
    let needsUnlock  = false;
    let directBlur   = 0;
    let directLock   = 0;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        // Cas 1 : nœud ajouté = div.blur
        if (node.classList && node.classList.contains("blur")) {
          node.remove();
          directBlur++;
          log.warn(`div.blur intercepté et supprimé immédiatement`);
          continue;
        }

        // Cas 2 : nœud ajouté contient des éléments à nettoyer
        if (node.querySelector) {
          if (node.querySelector(".blur") || node.querySelector(".gure-is-locked")) {
            needsUnlock = true;
          }
        }
      }

      // Modification de l'attribut class → ajout de gure-is-locked
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class" &&
        mutation.target.classList &&
        mutation.target.classList.contains("gure-is-locked")
      ) {
        mutation.target.classList.remove("gure-is-locked");
        directLock++;
        log.warn(`Classe gure-is-locked interceptée sur <${mutation.target.tagName.toLowerCase()}> et retirée`);
      }
    }

    if (needsUnlock) {
      const r = unlock(document);
      log.ok(`Nettoyage dynamique — paywall: ${r.blurRemoved} supprimé(s), verrous: ${r.locksRemoved} retiré(s)`);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  log.dim(`Observer actif — en attente de soumission...`);
})();
