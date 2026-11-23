# LockTab

[![Version](https://img.shields.io/badge/version-1.0.1-4f46e5)](https://github.com/el9a7rawi/LockTab/releases)
[![Licence : Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-047857)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-7c3aed)](manifest.json)

**Vos onglets, derrière un code PIN.**

LockTab est une petite extension hors ligne qui masque n'importe quel onglet derrière un code PIN
à 6 chiffres. Définissez un code global, attribuez-en un autre à une page sensible, et éloignez-vous
de votre écran l'esprit tranquille.

> Lire dans une autre langue : [English](README.md) · [Español](README.es.md) · [Deutsch](README.de.md) ·
> [Português (Brasil)](README.pt-BR.md) · [Русский](README.ru.md) · [العربية](README.ar.md) ·
> [简体中文](README.zh-CN.md)

## Pourquoi LockTab

- **Il masque vraiment la page.** Une couche à shadow root fermé recouvre le contenu, capture le focus
  et bloque le défilement. Si la page la supprime, elle revient.
- **Aucun secret en clair.** Le code est dérivé avec PBKDF2-HMAC-SHA256 (600 000 itérations et un sel
  unique de 16 octets). Seul le hachage est conservé, sur votre appareil.
- **Le popup ne contourne rien.** Toute action qui élargit l'accès redemande le code.
- **Un compteur partagé.** Les erreurs montent jusqu'à 30 s → 60 s → 300 s → 900 s de blocage. Ouvrir
  un autre onglet ne réinitialise pas le compteur avec le code global.
- **Récupération sans serveur.** Un code à usage unique est affiché à la création du PIN ; il se
  consomme une fois utilisé et efface tous les verrous.
- **Privé par construction.** Aucun compte, aucune télémétrie, aucun code distant, aucune requête réseau.

## Installation

### Chrome, Edge, Brave et Opera

1. Téléchargez `locktab-chrome-1.0.1.zip` depuis [Releases](https://github.com/el9a7rawi/LockTab/releases).
2. Extrayez-le dans un dossier.
3. Ouvrez `chrome://extensions` et activez le **mode développeur**.
4. Cliquez sur **Charger l'extension non empaquetée** et sélectionnez le dossier extrait.

### Firefox 121+

1. Téléchargez `locktab-firefox-1.0.1.zip` depuis [Releases](https://github.com/el9a7rawi/LockTab/releases).
2. Extrayez-le dans un dossier.
3. Ouvrez `about:debugging#/runtime/this-firefox` et choisissez **Charger un module complémentaire temporaire**.
4. Sélectionnez `manifest.json` dans le dossier extrait.

## Utilisation

1. Cliquez sur l'icône LockTab. Au premier lancement, créez un code PIN (6 chiffres).
2. **Conservez le code de récupération** : il n'est affiché qu'une seule fois.
3. Ouvrez l'onglet à protéger, cliquez sur l'icône puis sur **Verrouiller cet onglet**.
4. Pour le relire, saisissez le code dans la couche. Le popup propose **Déverrouiller un moment** et
   **Retirer le verrou** ; les deux demandent le code au préalable.
5. Vous pouvez aussi définir un code propre à un site depuis la carte **Code PIN de ce site**.

Le popup contient également le thème, la langue, la durée de déverrouillage, le compteur de l'icône,
le changement de code et la réinitialisation complète.

## Modèle de sécurité

| Décision | Raison |
| --- | --- |
| La vérification a lieu uniquement dans le background | Un content script s'exécute dans une page que le web peut influencer ; il ne voit jamais le hachage, le sel ni le compteur. |
| La query et le fragment sont ignorés | Une redirection ne doit pas pouvoir lever le verrou en ajoutant `?utm_source=…`. |
| La couche utilise un shadow root fermé | La page hôte ne peut ni lire ni styliser l'interface de verrouillage. |
| Les tentatives sont écrites en série | Deux clics simultanés ne peuvent pas offrir un essai gratuit. |
| Les déverrouillages temporaires sont effacés au démarrage | Fermer le navigateur compte comme quitter son poste. |

LockTab masque une page à quelqu'un qui s'assoit à votre place. Ce n'est pas un chiffrement de disque
et cela ne protège pas contre un navigateur compromis ou un administrateur qui supprime l'extension.

La politique de confidentialité complète se trouve dans [privacy.html](privacy.html).

## Langues

English, Español, Français, Deutsch, Português (Brasil), Русский, العربية (RTL) et 简体中文. L'interface
suit la langue du navigateur et peut être modifiée dans le popup.

## Compiler depuis les sources

```bash
python tools/build.py          # valide les langues et génère les deux archives
node --test tests/core.test.mjs
```

Aucun bundler, aucune dépendance npm.

## Soutien

Si LockTab vous a évité une situation gênante, vous pouvez soutenir le projet :

- PayPal : <https://paypal.me/27medYousry>
- InstaPay : <https://ipn.eg/S/el9a7rawi/instapay/30U5SS>

## Licence

Apache-2.0 © Ahmed Yousry

Fait avec soin ❤️ Ahmed Yousry · [GitHub](https://github.com/el9a7rawi/LockTab)
