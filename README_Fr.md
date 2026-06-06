<div align="right">
  <a href="README.md">🇬🇧 Read in English</a>
</div>


<div align="center">
  <h1>Galilee Unlocker</h1>
  <p><strong>Extension navigateur qui supprime le paywall d'abonnement sur <a href="https://galilee.ac">galilee.ac</a></strong></p>

  <p>
    <img src="https://img.shields.io/github/license/Rebine0xFF/Galilee-Unlocker?style=for-the-badge" alt="GitHub License">
    <img src="https://img.shields.io/badge/Statut-Terminé-green?style=for-the-badge" alt="Status">
  </P>

  <p>
    <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-5838c9?style=flat-square&logo=googlechrome&logoColor=white">
    <img alt="Microsoft Edge" src="https://img.shields.io/badge/Edge-Supporté-0078D4?style=flat-square&logo=microsoftedge&logoColor=white">
    <img alt="Google Chrome" src="https://img.shields.io/badge/Chrome-Supporté-4285F4?style=flat-square&logo=googlechrome&logoColor=white">
  </p>
</div>

---

## Présentation

Une extension navigateur légère qui supprime automatiquement l'overlay d'abonnement sur [galilee.ac](https://galilee.ac), une plateforme d'apprentissage des mathématiques construite sur Moodle.

Lorsqu'une réponse est soumise, la plateforme injecte un voile flou et verrouille la correction derrière un paywall (`div.blur` + classe CSS `gure-is-locked`). Cette extension intercepte et supprime ces éléments en temps réel, sans aucune interaction de l'utilisateur.

---

## Fonctionnalités

- **Bouclier CSS instantané** : une feuille de style injectée dès `document_start` masque l'overlay avant même qu'il soit rendu, sans flash visuel
- **Nettoyage DOM dynamique** : un `MutationObserver` surveille les injections effectuées par `ai_logger.js` et supprime le paywall à la milliseconde où il apparaît
- **Support des iframes** : les exercices sont intégrés dans des iframes ; l'extension s'y exécute également grâce à `all_frames: true`
- **Surveillance des attributs** : écoute aussi les mutations de l'attribut `class` pour détecter l'ajout de `gure-is-locked` sur des éléments existants
- **Logs console reconnaissables** : chaque action est tracée avec un badge stylisé distinctif pour faciliter le débogage

---

## Installation

> Aucune publication sur un store, chargez manuellement l'extension en mode développeur.

1. **Télécharger** la [dernière release](../../releases/latest) et dézipper, ou cloner ce dépôt
2. Ouvrir le navigateur et accéder à :
   - **Edge** : `edge://extensions/`
   - **Chrome** : `chrome://extensions/`
3. Activer le **mode développeur**
4. Cliquer sur **Charger l'extension décompressée** et sélectionner le dossier `galilee-unlocker/`
5. L'extension est active, naviguer sur n'importe quelle page de `galilee.ac`

Pour mettre à jour après une modification du code, cliquer sur l'icône **↻ recharger** sur la carte de l'extension.

---

## Fonctionnement

Le paywall est appliqué côté client par `ai_logger.js`, un script embarqué dans la plateforme. Après la soumission d'une réponse, il vérifie le statut d'abonnement de l'utilisateur et, si le paywall est actif, ajoute :

- un overlay `div.blur` contenant la bannière de promotion `div.gosabonner`
- la classe CSS `gure-is-locked` sur la `div.outcome` parente

L'extension contrebalance cela en deux couches :

| Couche | Fichier | Timing | Mécanisme |
|---|---|---|---|
| Bouclier CSS | `styles.css` | `document_start` | `div.blur { display: none !important }` masque tout futur overlay avant le rendu |
| Nettoyage JS | `content.js` | `document_idle` | `MutationObserver` supprime les nœuds injectés et retire la classe de verrouillage |

Les deux couches s'injectent dans la page principale **et** dans tous les iframes (`all_frames: true`), chaque exercice s'exécutant dans son propre iframe `showquestion.php`.

---

## Compatibilité

| Navigateur | Statut |
|---|---|
| Microsoft Edge (Chromium) | ✅ Testé |
| Google Chrome | ✅ Compatible (Manifest V3) |
| Firefox | ⚠️ Non testé (nécessite une adaptation Manifest V2) |