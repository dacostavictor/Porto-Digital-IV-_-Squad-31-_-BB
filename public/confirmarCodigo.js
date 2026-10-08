const MODO_DEMO = true;
const SEGUNDOS_REENVIO = 30;

const email = sessionStorage.getItem("bb_email");
const celular = sessionStorage.getItem("bb_celular");

if (!email || !celular) {
  window.location.replace("cadastroEmail.html");
}

const form = document.querySelector("form");
const campos = Array.from(document.querySelectorAll("#codigo input"));
const erro = document.getElementById("erro");
const demo = document.getElementById("demo");
const reenviar = document.getElementById("reenviar");

function mascararEmail(valor) {
  const [usuario, dominio] = valor.split("@");
  return `${usuario.slice(0, 2)}***@${dominio}`;
}

document.getElementById("emailMascarado").textContent = mascararEmail(
  email || "@",
);

function enviarCodigo() {
  const numero = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  const codigo = String(numero).padStart(6, "0");
  sessionStorage.setItem("bb_codigo", codigo);

  if (MODO_DEMO) {
    console.log(`[DEMO] Código enviado para ${email}: ${codigo}`);
    demo.textContent = `Modo demonstração: seu código é ${codigo}`;
    demo.hidden = false;
  }
}

if (!sessionStorage.getItem("bb_codigo")) {
  enviarCodigo();
} else if (MODO_DEMO) {
  demo.textContent = `Modo demonstração: seu código é ${sessionStorage.getItem("bb_codigo")}`;
  demo.hidden = false;
}

let temporizador;

function iniciarContagem() {
  let restante = SEGUNDOS_REENVIO;
  reenviar.disabled = true;
  reenviar.textContent = `Reenviar código (${restante}s)`;

  clearInterval(temporizador);
  temporizador = setInterval(() => {
    restante -= 1;
    if (restante <= 0) {
      clearInterval(temporizador);
      reenviar.disabled = false;
      reenviar.textContent = "Reenviar código";
    } else {
      reenviar.textContent = `Reenviar código (${restante}s)`;
    }
  }, 1000);
}

reenviar.addEventListener("click", () => {
  enviarCodigo();
  limparCampos();
  mostrarErro("");
  iniciarContagem();
});

iniciarContagem();

function limparCampos() {
  campos.forEach((c) => (c.value = ""));
  campos[0].focus();
}

function mostrarErro(mensagem) {
  erro.textContent = mensagem;
  erro.hidden = !mensagem;
}

campos.forEach((campo, i) => {
  campo.addEventListener("input", () => {
    campo.value = campo.value.replace(/\D/g, "").slice(-1);
    if (campo.value && i < campos.length - 1) campos[i + 1].focus();
  });

  campo.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" && !campo.value && i > 0) {
      campos[i - 1].value = "";
      campos[i - 1].focus();
    } else if (event.key === "ArrowLeft" && i > 0) {
      campos[i - 1].focus();
    } else if (event.key === "ArrowRight" && i < campos.length - 1) {
      campos[i + 1].focus();
    }
  });

  campo.addEventListener("focus", () => campo.select());

  campo.addEventListener("paste", (event) => {
    event.preventDefault();
    const digitos = (event.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, campos.length);
    digitos.split("").forEach((d, j) => (campos[j].value = d));
    campos[Math.min(digitos.length, campos.length - 1)].focus();
  });
});

campos[0].focus();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const digitado = campos.map((c) => c.value).join("");

  if (digitado.length < campos.length) {
    mostrarErro("Digite os 6 dígitos do código.");
    return;
  }

  if (digitado !== sessionStorage.getItem("bb_codigo")) {
    mostrarErro("Código incorreto. Verifique o email e tente novamente.");
    limparCampos();
    return;
  }

  clearInterval(temporizador);
  sessionStorage.clear();
  document.getElementById("verificacao").hidden = true;
  document.getElementById("sucesso").hidden = false;
});
