document.addEventListener("DOMContentLoaded", function () {
    const inicio = document.getElementById("inicio");
    const filmes = document.getElementById("filmes");
    const series = document.getElementById("series");
    inicio.addEventListener("click", function (e) {
        window.location.href = "/index.html";
    });
    filmes.addEventListener("click", function (e) {
        window.location.href = "/index.html?tipo=filme";
    });
    series.addEventListener("click", function (e) {
        window.location.href = "/index.html?tipo=serie";
    });
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "claro") {
        document.body.classList.add("tema-claro");
    }
});
const botaoTema = document.getElementById("botaoTema");
botaoTema.addEventListener("click", () => {
    document.body.classList.toggle("tema-claro");
    const temaAtual = document.body.classList.contains("tema-claro")
            ? "claro"
            : "escuro";
        localStorage.setItem("tema", temaAtual);
        botaoTema.textContent = document.body.classList.contains("tema-claro") ? "🌙" : "☀️";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service Worker registrado com sucesso.");
    } catch (error) {
      console.error("Erro ao registrar o Service Worker:", error);
    }
  });
}