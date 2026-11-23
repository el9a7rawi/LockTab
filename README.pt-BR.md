# LockTab

[![Versão](https://img.shields.io/badge/version-1.0.1-4f46e5)](https://github.com/el9a7rawi/LockTab/releases)
[![Licença: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-047857)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-7c3aed)](manifest.json)

**Suas abas, atrás de um PIN.**

LockTab é uma extensão pequena e offline que esconde qualquer aba atrás de um PIN de 6 dígitos.
Defina um PIN global, dê um PIN próprio a uma página sensível se quiser, e saia do computador sem
preocupação.

> Ler em outro idioma: [English](README.md) · [Español](README.es.md) · [Français](README.fr.md) ·
> [Deutsch](README.de.md) · [Русский](README.ru.md) · [العربية](README.ar.md) · [简体中文](README.zh-CN.md)

## Por que o LockTab

- **Esconde a página de verdade.** Uma camada com shadow root fechado cobre o conteúdo, prende o foco
  e bloqueia a rolagem. Se a página a remover, ela volta.
- **Nenhum segredo em texto puro.** O PIN é derivado com PBKDF2-HMAC-SHA256 (600.000 iterações e um salt
  único de 16 bytes). Apenas o hash é armazenado — no seu dispositivo.
- **O popup não é atalho.** Toda ação que amplia o acesso pede o PIN novamente.
- **Um contador compartilhado.** Erros escalam para 30 s → 60 s → 300 s → 900 s de bloqueio. Abrir
  outra aba não reinicia o contador quando se usa o PIN global.
- **Recuperação sem servidor.** Um código de uso único aparece na configuração; ao usá-lo, ele é
  consumido e todos os bloqueios são removidos.
- **Privado por construção.** Sem conta, sem telemetria, sem código remoto, sem requisições de rede.

## Instalação

### Chrome, Edge, Brave e Opera

1. Baixe `locktab-chrome-1.0.1.zip` em [Releases](https://github.com/el9a7rawi/LockTab/releases).
2. Extraia em uma pasta.
3. Abra `chrome://extensions` e ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação** e selecione a pasta extraída.

### Firefox 121+

1. Baixe `locktab-firefox-1.0.1.zip` em [Releases](https://github.com/el9a7rawi/LockTab/releases).
2. Extraia em uma pasta.
3. Abra `about:debugging#/runtime/this-firefox` e escolha **Carregar extensão temporária**.
4. Selecione `manifest.json` na pasta extraída.

## Uso

1. Clique no ícone do LockTab. Na primeira vez, crie um PIN (6 dígitos).
2. **Guarde o código de recuperação**: ele aparece uma única vez.
3. Abra a aba que deseja proteger, clique no ícone e escolha **Bloquear esta aba**.
4. Para ler novamente, digite o PIN na camada. O popup oferece **Desbloquear por um tempo** e
   **Remover bloqueio**; ambos pedem o PIN antes.
5. Opcionalmente, defina um PIN específico no cartão **PIN deste site**.

O popup também traz tema, idioma, duração do desbloqueio, contador no ícone, troca de PIN e reset completo.

## Modelo de segurança

| Decisão | Motivo |
| --- | --- |
| A verificação acontece apenas no background | Um content script roda em uma página que a web pode influenciar; ele nunca vê hash, salt ou contador. |
| Query e fragmento são ignorados | Um redirecionamento não pode remover o bloqueio ao acrescentar `?utm_source=…`. |
| A camada usa shadow root fechado | A página anfitriã não consegue ler nem estilizar a interface de bloqueio. |
| As tentativas são gravadas em série | Dois cliques simultâneos não garantem uma tentativa extra. |
| Desbloqueios temporários são limpos ao iniciar | Fechar o navegador conta como sair do posto. |

O LockTab esconde uma página de quem estiver no seu computador. Não é criptografia de disco e não
protege contra um navegador comprometido ou um administrador que remova a extensão.

A política de privacidade completa está em [privacy.html](privacy.html).

## Idiomas

English, Español, Français, Deutsch, Português (Brasil), Русский, العربية (RTL) e 简体中文. A interface
segue o idioma do navegador e pode ser alterada no popup.

## Compilar do código

```bash
python tools/build.py          # valida os idiomas e gera os dois zips
node --test tests/core.test.mjs
```

Sem bundler e sem dependências npm.

## Apoio

Se o LockTab evitou um momento constrangedor, você pode apoiar o projeto:

- PayPal: <https://paypal.me/27medYousry>
- InstaPay: <https://ipn.eg/S/el9a7rawi/instapay/30U5SS>

## Licença

Apache-2.0 © Ahmed Yousry

Feito com cuidado ❤️ Ahmed Yousry · [GitHub](https://github.com/el9a7rawi/LockTab)
