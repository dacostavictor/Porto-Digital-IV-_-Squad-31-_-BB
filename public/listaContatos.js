const CHAVE_CONTATOS = "bb_contatos";

const lista = document.getElementById("lista");
const vazio = document.getElementById("vazio");
const aviso = document.getElementById("aviso");

// Aviso exibido uma única vez, logo após concluir o cadastro
if (sessionStorage.getItem("bb_novo")) {
  aviso.hidden = false;
  sessionStorage.removeItem("bb_novo");
}

// ---------- Dados ----------
function lerContatos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CONTATOS)) || [];
  } catch {
    return [];
  }
}

// DEMO: não há back-end para aprovar o cadastro, então ele passa de
// "Em análise" para "Aprovado" quando chega o horário `aprovacaoEm`.
// Com um servidor, o status viria pronto da API.
function statusDe(contato) {
  return Date.now() >= contato.aprovacaoEm ? "aprovado" : "analise";
}

const STATUS = {
  analise: { texto: "Em análise", progresso: 50 },
  aprovado: { texto: "Aprovado", progresso: 100 },
};

// ---------- Ícones ----------
const ICONES = {
  email:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  celular:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
};

const ROTULOS = { email: "Email", celular: "Celular" };

// ---------- Renderização ----------
function criarElemento(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto; // textContent evita injeção de HTML
  return el;
}

function criarCard(contato) {
  const status = STATUS[statusDe(contato)];
  const chave = statusDe(contato);

  const card = criarElemento("li", "card");

  const topo = criarElemento("div", "card__topo");

  const icone = criarElemento("span", "card__icone");
  icone.innerHTML = ICONES[contato.tipo]; // SVG fixo definido neste arquivo

  const info = criarElemento("div", "card__info");
  info.append(
    criarElemento("span", "card__tipo", ROTULOS[contato.tipo]),
    criarElemento("strong", "card__valor", contato.valor),
  );

  const selo = criarElemento("span", `selo selo--${chave}`, status.texto);

  topo.append(icone, info, selo);

  const barra = criarElemento("div", "barra");
  barra.setAttribute("role", "progressbar");
  barra.setAttribute("aria-label", `Status: ${status.texto}`);
  barra.setAttribute("aria-valuemin", "0");
  barra.setAttribute("aria-valuemax", "100");
  barra.setAttribute("aria-valuenow", String(status.progresso));

  const preenchimento = criarElemento(
    "div",
    `barra__preenchimento barra__preenchimento--${chave}`,
  );
  barra.append(preenchimento);
  // define a largura no próximo quadro para a barra animar até o valor
  requestAnimationFrame(() => {
    preenchimento.style.width = `${status.progresso}%`;
  });

  const data = criarElemento(
    "span",
    "card__data",
    `Cadastrado em ${new Date(contato.criadoEm).toLocaleDateString("pt-BR")}`,
  );

  card.append(topo, barra, data);
  return card;
}

let assinaturaAnterior = null;

function renderizar() {
  const contatos = lerContatos().sort((a, b) => b.criadoEm - a.criadoEm);

  // só redesenha se algo mudou (evita reiniciar a animação da barra)
  const assinatura = contatos.map((c) => c.id + statusDe(c)).join("|");
  if (assinatura === assinaturaAnterior) return;
  assinaturaAnterior = assinatura;

  lista.replaceChildren(...contatos.map(criarCard));
  vazio.hidden = contatos.length > 0;
}

renderizar();

// Atualiza os status automaticamente enquanto houver contato em análise
const atualizador = setInterval(() => {
  renderizar();
  if (lerContatos().every((c) => statusDe(c) === "aprovado")) {
    clearInterval(atualizador);
  }
}, 1000);
