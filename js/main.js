const API_KEY = "a3fda9b9d1d0aaee95df37313c16684e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const campoPesquisa = document.getElementById("campoPesquisa");
const botaoPesquisa = document.getElementById("botaoPesquisa");
const filmesGrid = document.getElementById("filmesGrid");
const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo");

async function requisicaoURL(url) {
    try {
       filmesGrid.classList.add("fade-out");
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Erro na requisição");
        }
        const data = await response.json();
        setTimeout(() => {
            renderizarMidia(data.results);
           filmesGrid.classList.remove("fade-out");
            filmesGrid.classList.add("fade-in");
            setTimeout(() => {
                filmesGrid.classList.remove("fade-in");
            }, 300);
        }, 200);
    } catch (error) {
        console.error("Erro:", error);
        filmesGrid.innerHTML = "<p>Erro ao carregar filmes.</p>";
    }
}
/*Filtro por genero*/
async function carregarGeneros(tipo = "movie") {
    const response = await fetch(
        `${BASE_URL}/genre/${tipo}/list?api_key=${API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    const select = document.getElementById("filtroGenero");
    select.innerHTML = `<option value="">Todos</option>`;
    data.genres.forEach(genero => {
        const option = document.createElement("option");
        option.value = genero.id;
        option.textContent = genero.name;
        select.appendChild(option);
    });
}
function filtrarPorGenero() {
    const generoId = document.getElementById("filtroGenero").value;
    if (!generoId) { 
        carregarTendenciasGeral();
        return;
    }
    let endpoint = "movie";
    if (tipo === "serie") {
        endpoint = "tv";
    }
    const url = `${BASE_URL}/discover/${endpoint}?api_key=${API_KEY}&with_genres=${generoId}&language=pt-BR`;
    requisicaoURL(url);
}
/*Filtro por ano*/
function carregarAnos() {
    const selectAno = document.getElementById("filtroAno");
    const anoAtual = new Date().getFullYear();
    for (let ano = anoAtual; ano >= 1950; ano--) {
        const option = document.createElement("option");
        option.value = ano;
        option.textContent = ano;
        selectAno.appendChild(option);
    }
}
function filtrarPorAno() {
    const ano = document.getElementById("filtroAno").value;
    if (!ano) {
        carregarTendenciasGeral();
        return;
    }
    let endpoint = "movie";
    if (tipo === "serie") {
        endpoint = "tv";
    }
    const url = `${BASE_URL}/discover/${endpoint}?api_key=${API_KEY}&language=pt-BR&primary_release_year=${ano}`;
    requisicaoURL(url);
}
/*Filtro por nota*/
function filtrarPorNota() {
    const nota = document.getElementById("filtroNota").value;
    if (!nota) {
        carregarTendenciasGeral();
        return;
    }
    let endpoint = "movie";
    if (tipo === "serie") {
        endpoint = "tv";
    }
    const url = `${BASE_URL}/discover/${endpoint}?api_key=${API_KEY}&language=pt-BR&vote_average.gte=${nota}`;
    requisicaoURL(url);
}
/*Filtro por País */
function filtrarPorPais() {
    const pais = document.getElementById("filtroPais").value;
    if (!pais) {
        carregarTendenciasGeral();
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get("tipo");
    let endpoint = "movie";
    if (tipo === "serie") {
        endpoint = "tv";
    }
    const url = `${BASE_URL}/discover/${endpoint}?api_key=${API_KEY}&language=pt-BR&with_origin_country=${pais}`;
    requisicaoURL(url);
}
function renderizarMidia(filmes) {
    filmesGrid.innerHTML = "";
    if (!filmes || filmes.length === 0) {
        filmesGrid.innerHTML = "<p>Nenhum filme encontrado.</p>";
        return;
    }
    filmes.forEach(filme => {
        const card = document.createElement("div");
        card.classList.add("card");
        const imagem = filme.poster_path
            ? IMAGE_URL + filme.poster_path
            : "";
        let media_type = ""; 
        if(filme.title){
            card.innerHTML = `
            <img src="${imagem}" alt="${filme.title}">
            <h3>${filme.title}</h3>
            `;
            media_type = "movie";
        }else{
            card.innerHTML = `
            <img src="${imagem}" alt="${filme.name}">
            <h3>${filme.name}</h3>
            `;
            media_type = "tv";
        } 
        card.addEventListener("click", () => {
            window.location.href = `pages/detalhe.html?id=${filme.id}&type=${media_type}`;
        });
        filmesGrid.appendChild(card);
    });
}

function buscaFilme() {
    const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=pt-BR`;
    requisicaoURL(url);
}

function buscaSerie() {
    const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=pt-BR`;
    requisicaoURL(url);
}

function carregarTendenciasGeral() { 
    const url =`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=pt-BR`; 
    requisicaoURL(url); 
}

function pesquisaGeral() {
    const informacao = campoPesquisa.value.trim();
    if (informacao === "") {
        carregarTendenciasGeral();
        return;
    }
    console.log("Pesquisando por:", informacao);
    const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(informacao)}&language=pt-BR`;
    console.log(url);
    requisicaoURL(url);
    campoPesquisa.value = "";
}


botaoPesquisa.addEventListener("click", pesquisaGeral);
campoPesquisa.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        pesquisaGeral();
    }
});

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

document.addEventListener("DOMContentLoaded", () => {
    if (tipo === "filme") {
        buscaFilme();
    } else if (tipo === "serie") {
        buscaSerie();
    } else {
        carregarTendenciasGeral();
    } 
    carregarGeneros();
    document.getElementById("filtroGenero").addEventListener("change", filtrarPorGenero);
    carregarAnos();
    document.getElementById("filtroAno").addEventListener("change", filtrarPorAno);
    document.getElementById("filtroNota").addEventListener("change", filtrarPorNota);
    document.getElementById("filtroPais").addEventListener("change", filtrarPorPais)
});
/*    carregarGeneros();
    document.getElementById("filtroGenero").addEventListener("change", filtrarPorGenero);
    carregarAnos();
    document.getElementById("filtroAno").addEventListener("change", filtrarPorAno);
    document.getElementById("filtroNota").addEventListener("change", filtrarPorNota);
    document.getElementById("filtroPais").addEventListener("change", filtrarPorPais);*/