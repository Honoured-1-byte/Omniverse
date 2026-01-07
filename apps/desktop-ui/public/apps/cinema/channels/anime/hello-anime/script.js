async function recommendAnime(mood) {
    const apiUrl = `https://api.jikan.moe/v4/anime?q=${mood}&limit=5`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        displayAnime(data.data);
    } catch (error) {
        console.error("Error fetching anime data:", error);
    }
}

function displayAnime(animeList) {
    const animeContainer = document.getElementById("anime-list");
    animeContainer.innerHTML = "";
    
    animeList.forEach(anime => {
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" width="200">
            <h3>${anime.title}</h3>
            <p>${anime.synopsis ? anime.synopsis.substring(0, 100) + '...' : 'No synopsis available.'}</p>
            <a href="${anime.url}" target="_blank">More Info</a>
        `;
        animeContainer.appendChild(animeCard);
    });
}