const apikey="c59c22d5";
const rechbtn=document.getElementById('rech-btn');
const rechinput=document.getElementById('rech-input');
const result=document.getElementById('result');
const favoritesList=document.getElementById("favoritesList");

rechbtn.addEventListener("click",fetchfilms);
rechinput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") fetchMovies();
});

async function fetchfilms(){
    const rechValue=rechinput.value.trim();
    if(!rechValue){
        alert("donnez un titre de film");
        return;
    }
        console.log(rechValue);
        console.log(apikey);
        const url=`http://www.omdbapi.com/?apikey=${apikey}&s=${encodeURIComponent(rechValue)}`;
        console.log("url : ",url  );
    try{
        
        const response=await fetch(url);
        //const response=await fetch('https://www.omdbapi.com/?apikey=c59c22d5&s=Titanic');
    data =await response.json();
    
        if(data.Response === "True"){
            
            

                displayFilms(data.Search);
        }else{
            console.error("Erreur:", data.Error);
            result.innerHTML=`<p class="erreur">Acun resultat pour ${rechValue}</p>`
        }

    }catch(error){
        console.error("Erreur fetch:", error);
        result.innerHTML=`<p class=erreur>erreur de connexion a l'api</p>`
    }

}

function displayFilms(films){
    console.log(data);
            result.innerHTML="";
            films.forEach(film => {
                const filmcard=document.createElement("div");
                filmcard.className="film-card"
                filmcard.innerHTML=`
                <img src="${
            film.Poster !=="N/A"? film.Poster :"http://img.omdbapi.com/?apikey=${apikey}&text=Poster+Indisponible"
        }" alt="${film.Title}">
                <div class="film-info">
                    <h3>${film.Title}</h3>
                    <p>Anee: ${film.Year}</p>
                    <p>Type: ${film.Type}</p>
                    <button class="fav-btn" data-id="${film.id}">⭐</button>
                </div>
                `;

                result.appendChild(filmcard);
            });
    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click",()=>addToFavorites(btn.dataset.id));
        // Dans votre gestionnaire d'événements:
        //btn.addEventListener('click', () => addToFavorites('tt0120338'));
    });
}

function addToFavorites(id){
    let favorites=[];
    try{
        favorites=JSON.parse(localStorage.getItem("favorites")) || [];
        if(!Array.isArray(favorites)){
            console.warn("format du favorites n'est pas un tableau ");
            //favorites=[];
        }
    }catch(erreur){
        console.error("erreur de lecture des favoris : " ,erreur);
        //favorites=[];
    }
    
    if(!favorites.includes(id)){
        favorites.push(id);
        try{
            localStorage.setItem("favorites",JSON.stringify(favorites));
            alert("film ajoute aux favoris !" );
            displayFavorites();
        }catch(erreur){
            console.error('Erreur de sauvegarde:', error);
            alert('Impossible de sauvegarder les favoris');
        }
        
    }
    else{console.log("favoooooo list:",favorites);
        alert("somethings worng car ce film deja existe");
    }
    
    console.log("favoooooo list:",favorites);
}


async function displayFavorites(){
    favoritesList.innerHTML=``;
    let favorites=[];
    try{
        const storedFavorites=localStorage.getItem("favorites");
        if(storedFavorites){
            favorites=JSON.parse(storedFavorites);
        }else{
            favorites=[];
        }
        if (!Array.isArray(favorites)) {
            console.error("Les favoris ne sont pas un tableau:", favorites);
            favoritesList.innerHTML = "<p>Erreur de chargement des favoris</p>";
            return;
        }
    }catch(erreur){
        console.error("erreur de lecture des favoris: ",erreur);
        localStorage.removeItem("favorites");
        favoritesList.innerHTML=`<p>erreur de chargement</p>`;
        return;
    }
    //const favorites=JSON.parse(localStorage.getItem("favorites")) || [];
    if(favorites.length===0){
        favoritesList.innerHTML=`<p>Aucun film trouve dans les favori</p>`;
        return;
    }

    try{
        for(const id of favorites){
            const response=await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apikey}`);
            const film=await response.json();
            if (film.Response === "True") {
                const favItem=document.createElement("div");
                favItem.className="fav-item";
                favItem.innerHTML=`
                <img src="${film.Poster !=="N/A" ?film.Poster:'no-poster.jpg'}" alt="${film.Title}">
                <h4>${film.Title}.(${film.Year})</h4>
                `;
                favoritesList.appendChild(favItem);
            }

        }
    }catch(erreur){
        console.error("erreur: ",erreur);
        favoritesList.innerHTML=`<p>erreur de chargement la lliste  </p>`;
    }
}


document.addEventListener("DOMContentLoaded", displayFavorites);


//la displayFavorites n'est pas correct