const API_KEY = "a3fda9b9d1d0aaee95df37313c16684e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const detalhesContainer = document.getElementById("detalhesContainer");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

async function carregarDetalhes() {
    if (!id || !type) {
        detalhesContainer.innerHTML = "<p>Conteúdo inválido.</p>";
        return;
    }
    try {
        const response = await fetch(
            `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=pt-BR`
        );
        if (!response.ok) {
            throw new Error("Erro na API");
        }
        const data = await response.json();
        renderizarDetalhes(data);
    } catch (error) {
        detalhesContainer.innerHTML = "<p>Erro ao carregar detalhes.</p>";
        console.error(error);
    }
}
/////
async function buscarTrailer() {
    try {
        const response = await fetch(
            `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=pt-BR`
        );
        const data = await response.json();
        const trailer = data.results.find(video =>
            video.type === "Trailer" && video.site === "YouTube"
        );
        if (!trailer) return null;
        return `https://www.youtube.com/watch?v=${trailer.key}`;
    } catch (error) {
        console.error("Erro ao buscar trailer:", error);
        return null;
    }
}
////
 async function renderizarDetalhes(item) {
    ////
    const trailerURL = await buscarTrailer();
    const imagem = item.poster_path
        ? IMAGE_URL + item.poster_path
        : "";
    const imagemHTML = trailerURL
    ? `
        <a href="${trailerURL}" target="_blank">
            <img src="${imagem}" alt="${item.title}">
        </a>
      `
    : `
        <img src="${imagem}" alt="${item.title}">
      `;

    const titulo = item.title || item.name;
    const dataLancamento = item.release_date || item.first_air_date;
    /////
    const generos = item.genres.map(genero => genero.name).join(", ");
    //////
    document.title = titulo;
    detalhesContainer.innerHTML = `
        <div class="detalhes-card">
            ${imagemHTML}
            <div class="detalhes-info">
                <h2>${titulo}</h2>
                <p>Data: ${dataLancamento || "Não disponível"}<br>
                <label>Nota:</label> ${item.vote_average}<br>
                ${item.tagline}<br>
                ${item.overview}</p><br>
                Gêneros: ${generos}<br>
            </div>
        </div>
    `;
    ///
}
document.addEventListener("DOMContentLoaded", carregarDetalhes);
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.transition = "opacity 0.5s ease";
    loader.style.opacity = "0";
    setTimeout(() => {
        loader.style.display = "none";
    }, 500);
  }
});