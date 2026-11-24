<p align="center">
  <img src="assets/banner/locktab-banner-pt-BR.webp" width="100%" alt="LockTab — Suas abas, só para você" />
</p>

<h1 align="center">LockTab — Suas abas, só para você</h1>

<p align="center">Bloqueie qualquer aba com um clique e um PIN de 6 dígitos. Defina um PIN privado para um site, guarde um código de recuperação de uso único e saia sabendo que ninguém pode ler sua tela. Oito idiomas, RTL árabe completo e nenhuma nuvem.</p>

<p align="center">
  <a href="https://github.com/el9a7rawi/LockTab/releases"><img src="https://img.shields.io/github/v/release/el9a7rawi/LockTab?color=4f46e5" alt="Última versão" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-E8710A" alt="Apache 2.0" /></a>
  <a href="https://github.com/el9a7rawi/LockTab/pulls"><img src="https://img.shields.io/badge/PRs-Welcome-22C55E" alt="PRs bem-vindos" /></a>
  <a href="https://developer.chrome.com/docs/extensions"><img src="https://img.shields.io/badge/Manifest-V3-4285F4" alt="Manifest V3" /></a>
  <img src="https://img.shields.io/badge/8_Languages-7c3aed" alt="8 idiomas" />
  <img src="https://img.shields.io/badge/Works-Offline-059669" alt="Offline" />
</p>

<h4 align="center">
  <a href="README.md">English</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a> · <a href="README.ar.md">العربية</a> · <a href="README.zh-CN.md">中文（简体）</a>
</h4>

<h3 align="center">Download for your browser — click the icon</h3>

<div align="center">

| [<img src="assets/browsers/chrome.svg" width="52" alt="Chrome" /><br><b>Chrome</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/edge.svg" width="52" alt="Edge" /><br><b>Edge</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/firefox.svg" width="52" alt="Firefox" /><br><b>Firefox</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/brave.svg" width="52" alt="Brave" /><br><b>Brave</b>](https://github.com/el9a7rawi/LockTab/releases/latest) | [<img src="assets/browsers/opera.svg" width="52" alt="Opera" /><br><b>Opera</b>](https://github.com/el9a7rawi/LockTab/releases/latest) |
|---|---|---|---|---|

</div>

Chrome e navegadores Chromium são o foco principal. Firefox 121+ é compatível por meio de um arquivo dedicado com seu próprio manifesto.

---

## 1. Por que o LockTab?

<div align="center">

| Without LockTab | With LockTab |
|---|---|
| Qualquer pessoa pode ler uma aba aberta | Sua aba fica coberta até o PIN ser digitado |
| Uma senha compartilhada por todos os sites | Um PIN dedicado às páginas que importam |
| Perder o PIN é perder o acesso | Um código de recuperação único desfaz tudo |
| Extensões que enviam seus dados | Totalmente offline, sem conta e sem rastreamento |

</div>

undefined

---

## 2. Como funciona — três passos

1. Crie um PIN de 6 dígitos e guarde o código de recuperação mostrado uma vez.
2. Abra a aba que deseja proteger e clique em Bloquear esta aba.
3. Digite o PIN para ler novamente, ou conceda um desbloqueio temporário.

---

## 3. Visão geral da interface — todas as partes da extensão

### 3.1 Header — everything in reach
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-header.webp" width="400" alt="Header" /></p>

The title, theme toggle, GitHub link and language picker share one compact row.

### 3.2 One primary action
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-hero.webp" width="400" alt="Primary action" /></p>

A single gradient button covers the active page. Temporary unlock and lock removal ask for the PIN first.

### 3.3 Tab status
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-status.webp" width="400" alt="Tab status" /></p>

A flat status plate shows whether the tab is locked, open, or open for a while.

### 3.4 First run — create your PIN
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-setup.webp" width="400" alt="PIN setup" /></p>

Six boxes appear one after another, stop exactly at six, and centre the asterisk.

### 3.5 Recovery code shown once
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-recovery.webp" width="400" alt="Recovery code" /></p>

The code is displayed only at setup. Store it somewhere safe; a used code can never be replayed.

### 3.6 A PIN for one site
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-pin.webp" width="400" alt="Site PIN" /></p>

A site PIN overrides the global one on that domain, so sensitive pages can stay separate.

### 3.7 Locked sites
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-sites.webp" width="400" alt="Locked sites" /></p>

Numbered rows list every locked domain. Past five sites, arrows page through the list.

### 3.8 Lock from anywhere
The Alt+Shift+L shortcut locks the current tab without opening the popup.

### 3.9 Configurações
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-settings.webp" width="400" alt="Settings" /></p>

Desfoque, contador, duração, tema e idioma em um só cartão.

### 3.10 Oito idiomas, RTL real
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-language.webp" width="400" alt="Language menu" /></p>

Troca instantânea; o árabe inverte o layout de forma lógica.

### 3.11 Tema escuro preto real
<p align="center"><img src="assets/screenshots/pt-BR/popup-dark.webp" width="280" alt="LockTab popup — dark theme" /></p>

Fundo preto de verdade com contraste ajustado e lembrado.

### 3.12 Entrada do PIN
<p align="center"><img src="assets/screenshots/pt-BR/lockscreen.webp" width="600" alt="PIN entry" /></p>

A capa usa uma shadow root fechada; o foco fica dentro.

### 3.13 Estado vazio
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-empty.webp" width="400" alt="Empty state" /></p>

Um convite honesto para bloquear uma aba.

### 3.14 Apoio
<p align="center"><img src="assets/screenshots/pt-BR/sections/section-donate.webp" width="400" alt="Support section" /></p>

PayPal e InstaPay ajudam a manter o projeto independente.

## 4. O que a trava protege

1. **A 6-digit PIN.** Stored as a PBKDF2 hash with a unique 16-byte salt; the plaintext is never written to disk.
2. **A closed gate.** The overlay runs in a closed shadow root, traps focus and blocks scrolling underneath.
3. **A shared counter.** Wrong guesses escalate through 30, 60, 300 and 900 second lock-outs; switching tabs does not reset it.
4. **One-time recovery.** The code is shown once, consumed once, and clears every lock.

---

## 5. Instalar (sem empacotamento)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the extracted release folder.
4. Click the LockTab icon in the toolbar.

A privacidade está na seção 7 e em `privacy.html`.

---

## 6. Desenvolvimento

O repositório publicado contém apenas a extensão e sua documentação. Scripts de captura e testes locais ficam de fora; o GitHub Actions valida o manifesto, o CSP e os idiomas.

---

## 7. Privacidade

Veja `privacy.html`. O PIN fica salvo apenas como hash PBKDF2 com salt único; o conteúdo da página nunca é lido e nenhuma requisição sai da extensão.

---

## 8. Licença

O projeto é de código aberto sob **Apache-2.0**; texto completo em [LICENSE](LICENSE). Fontes sob [SIL OFL 1.1](fonts/OFL.txt). Histórico em [CHANGELOG.md](CHANGELOG.md).

---

<p align="center">Feito com carinho ❤️ <b>Ahmed Yousry</b> · <a href="https://github.com/el9a7rawi/LockTab">LockTab</a> · <a href="LICENSE">Apache-2.0</a></p>
