const form = document.querySelector("form");
const celular = document.getElementById("celular");
const celular2 = document.getElementById("celular2");

function formatarCelular(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

[celular, celular2].forEach((campo) => {
  campo.addEventListener("input", () => {
    campo.value = formatarCelular(campo.value);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const numero = celular.value.replace(/\D/g, "");
  const numero2 = celular2.value.replace(/\D/g, "");

  if (numero.length !== 11 || numero[2] !== "9") {
    alert("Digite um celular válido com DDD. Ex.: (61) 91234-5678");
    return;
  }

  if (numero !== numero2) {
    alert("Os celulares inseridos não coincidem!");
    return;
  }

  sessionStorage.setItem("bb_celular", formatarCelular(numero));

  sessionStorage.removeItem("bb_codigo");

  window.location.href = "confirmarCodigo.html";
});
