const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const email2 = document.getElementById("email2").value.trim().toLowerCase();

  if (email !== email2) {
    alert("Os emails inseridos não coincidem!");
    return;
  }
  sessionStorage.setItem("bb_email", email);

  window.location.href = "cadastroCel.html";
});
