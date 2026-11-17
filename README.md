# Porto-Digital-IV-_-Squad-31-_-BB

Fluxo de cadastro de contatos de confiança (estilo app Banco do Brasil).

## Fluxo das telas (`public/`)

1. `cadastroEmail.html` – email de confiança (+ confirmação e senha)
2. `cadastroCel.html` – celular de confiança (+ confirmação e senha)
3. `confirmarCodigo.html` – código de 6 dígitos "enviado por email"
4. `listaContatos.html` – lista de emails/celulares de confiança com barra de status (Em análise / Aprovado)

Abra `public/cadastroEmail.html` no navegador para começar.

> **Modo demonstração:** não há back-end, então o código é gerado no navegador e
> exibido na própria tela. Em `confirmarCodigo.js`, altere `MODO_DEMO` para
> `false` quando existir um servidor que envie o email de verdade.
>
> Os contatos ficam salvos no `localStorage` do navegador e o status muda de
> "Em análise" para "Aprovado" sozinho após `SEGUNDOS_APROVACAO_DEMO` (20s).
> Com back-end, o status viria da API.
