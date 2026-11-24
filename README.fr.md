<p align="center">
  <img src="assets/banner/locktab-banner-fr.webp" width="100%" alt="LockTab — Vos onglets, rien que pour vous" />
</p>

<h1 align="center">LockTab — Vos onglets, rien que pour vous</h1>

<p align="center">Verrouillez n'importe quel onglet en un clic avec un code à 6 chiffres. Ajoutez un code privé pour un site, conservez un code de récupération à usage unique et éloignez-vous en sachant que personne ne peut lire votre écran. Huit langues, RTL arabe complet et aucun cloud.</p>

<p align="center">
  <a href="https://github.com/el9a7rawi/LockTab/releases"><img src="https://img.shields.io/github/v/release/el9a7rawi/LockTab?color=4f46e5" alt="Dernière version" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-E8710A" alt="Apache 2.0" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/pulls"><img src="https://img.shields.io/badge/PRs-Welcome-22C55E" alt="PRs bienvenues" /></a>
  <a href="https://developer.chrome.com/docs/extensions"><img src="https://img.shields.io/badge/Manifest-V3-4285F4" alt="Manifest V3" /></a>
  <img src="https://img.shields.io/badge/8_Languages-7c3aed" alt="8 langues" />
  <img src="https://img.shields.io/badge/Works-Offline-059669" alt="Hors ligne" />
</p>

<h4 align="center">
  <a href="README.md">English</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a> · <a href="README.ar.md">العربية</a> · <a href="README.zh-CN.md">中文（简体）</a>
</h4>

<h3 align="center">Download for your browser — click the icon</h3>

<div align="center">

| [<img src="assets/browsers/chrome.svg" width="52" alt="Chrome" /><br><b>Chrome</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/edge.svg" width="52" alt="Edge" /><br><b>Edge</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/firefox.svg" width="52" alt="Firefox" /><br><b>Firefox</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/brave.svg" width="52" alt="Brave" /><br><b>Brave</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/opera.svg" width="52" alt="Opera" /><br><b>Opera</b>](https://github.com/el9a7rawi/LockTab/releases/latest) |
|---|---|---|---|---|

</div>

Chrome et les navigateurs Chromium sont la cible principale. Firefox 121+ est pris en charge via une archive dédiée avec son propre manifeste.

---

## 1. Pourquoi LockTab ?

<div align="center">

| Without LockTab | With LockTab |
|---|---|
| N'importe qui peut lire un onglet ouvert | Votre onglet est masqué jusqu'à la saisie du code |
| Un mot de passe partagé pour tous les sites | Un code dédié aux pages qui comptent |
| Perdre le code, c’est perdre accès | Un code de récupération à usage unique efface tout |
| Des extensions qui envoient vos données | Entièrement hors ligne, sans compte ni suivi |

</div>

undefined

---

## 2. Comment ça marche — trois étapes

1. Créez un code à 6 chiffres et conservez le code de récupération affiché une seule fois.
2. Ouvrez l'onglet à protéger et cliquez sur Verrouiller cet onglet.
3. Saisissez le code pour le relire, ou accordez un déverrouillage temporaire.

---

## 3. Visite de l'interface — toutes les parties de l'extension

### 3.1 Header — everything in reach
<p align="center"><img src="assets/screenshots/fr/sections/section-header.webp" width="400" alt="Header" /></p>

The title, theme toggle, GitHub link and language picker share one compact row.

### 3.2 One primary action
<p align="center"><img src="assets/screenshots/fr/sections/section-hero.webp" width="400" alt="Primary action" /></p>

A single gradient button covers the active page. Temporary unlock and lock removal ask for the PIN first.

### 3.3 Tab status
<p align="center"><img src="assets/screenshots/fr/sections/section-status.webp" width="400" alt="Tab status" /></p>

A flat status plate shows whether the tab is locked, open, or open for a while.

### 3.4 First run — create your PIN
<p align="center"><img src="assets/screenshots/fr/sections/section-setup.webp" width="400" alt="PIN setup" /></p>

Six boxes appear one after another, stop exactly at six, and centre the asterisk.

### 3.5 Recovery code shown once
<p align="center"><img src="assets/screenshots/fr/sections/section-recovery.webp" width="400" alt="Recovery code" /></p>

The code is displayed only at setup. Store it somewhere safe; a used code can never be replayed.

### 3.6 A PIN for one site
<p align="center"><img src="assets/screenshots/fr/sections/section-pin.webp" width="400" alt="Site PIN" /></p>

A site PIN overrides the global one on that domain, so sensitive pages can stay separate.

### 3.7 Locked sites
<p align="center"><img src="assets/screenshots/fr/sections/section-sites.webp" width="400" alt="Locked sites" /></p>

Numbered rows list every locked domain. Past five sites, arrows page through the list.

### 3.8 Lock from anywhere
The Alt+Shift+L shortcut locks the current tab without opening the popup.

### 3.9 Paramètres
<p align="center"><img src="assets/screenshots/fr/sections/section-settings.webp" width="400" alt="Settings" /></p>

Flou, badge, durée, thème et langue dans une seule carte.

### 3.10 Huit langues, vrai RTL
<p align="center"><img src="assets/screenshots/fr/sections/section-language.webp" width="400" alt="Language menu" /></p>

Basculez instantanément ; l’arabe inverse la mise en page.

### 3.11 Thème sombre noir profond
<p align="center"><img src="assets/screenshots/fr/popup-dark.webp" width="280" alt="LockTab popup — dark theme" /></p>

Un vrai fond noir au contraste réglé, mémorisé entre les sessions.

### 3.12 Saisie du code
<p align="center"><img src="assets/screenshots/fr/lockscreen.webp" width="600" alt="PIN entry" /></p>

Le volet utilise une shadow root fermée : le focus reste à l’intérieur.

### 3.13 État vide
<p align="center"><img src="assets/screenshots/fr/sections/section-empty.webp" width="400" alt="Empty state" /></p>

Une invitation honnête à verrouiller un onglet.

### 3.14 Soutien
<p align="center"><img src="assets/screenshots/fr/sections/section-donate.webp" width="400" alt="Support section" /></p>

PayPal et InstaPay aident à garder le projet indépendant.

## 4. Ce que protège le verrou

1. **A 6-digit PIN.** Stored as a PBKDF2 hash with a unique 16-byte salt; the plaintext is never written to disk.
2. **A closed gate.** The overlay runs in a closed shadow root, traps focus and blocks scrolling underneath.
3. **A shared counter.** Wrong guesses escalate through 30, 60, 300 and 900 second lock-outs; switching tabs does not reset it.
4. **One-time recovery.** The code is shown once, consumed once, and clears every lock.

---

## 5. Installation (non empaquetée)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the extracted release folder.
4. Click the LockTab icon in the toolbar.

La confidentialité est détaillée à la section 7 et dans `privacy.html`.

---

## 6. Développement

Le dépôt publié ne contient que l’extension et sa documentation. Les scripts de capture et les tests locaux sont exclus ; GitHub Actions valide le manifeste, le CSP et les langues.

---

## 7. Confidentialité

Voir `privacy.html`. Le code est stocké uniquement comme hachage PBKDF2 avec un sel unique ; aucun contenu de page n’est lu et aucune requête ne quitte l’extension.

---

## 8. Licence

Le projet est open source sous **Apache-2.0** ; texte intégral dans [LICENSE](LICENSE). Polices sous [SIL OFL 1.1](fonts/OFL.txt). Historique dans [CHANGELOG.md](CHANGELOG.md).

---

<p align="center">Fait avec soin ❤️ <b>Ahmed Yousry</b> · <a href="https://github.com/el9a7rawi/LockTab">LockTab</a> · <a href="LICENSE">Apache-2.0</a></p>
