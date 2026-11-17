const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  // impede o envio padrão do formulário (recarregar a página)
  event.preventDefault();

  // os valores precisam ser lidos DENTRO do evento, no momento do envio
  const email = document.getElementById("email").value.trim().toLowerCase();
  const email2 = document.getElementById("email2").value.trim().toLowerCase();

  if (email !== email2) {
    alert("Os emails inseridos não coincidem!");
    return;
  }

  // guarda o email para as próximas telas (a senha NÃO é armazenada)
  sessionStorage.setItem("bb_email", email);

  window.location.href = "cadastroCel.html";
});
