
function init(){

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
  
        fetch('http://localhost:8000/api/movies', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then( res => res.json() )
            .then( data => {
               
                const table = document.getElementById('tableData');
                
                if(data.msg){
                    console.log(data.msg);
                    return;
                }
    
                data.forEach( el => {
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.title}</td> <td>${el.releaseYear}</td> <td>${el.rating}</td> <td>${el.description}</td> <td>${el.movieLength}</td> <td>${el.genre.name}</td>
                    <td> <button id="${el.id}" type="button" class="btn btn-danger delMovie">Delete</button> 
                    <td> <button id="${el.id}" type="button" class="btn btn-primary updMovie">Update</button> <td></tr>`;
                });

                document.querySelectorAll(".delMovie").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/movies/' + item.id, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }
                                
                               })
                                .then( res => res.json() )
                                .then( el => {
                                    if (el.msg) {
                                        alert(el.msg);
                                    } else {
                                        location.reload();
                                    }
                                })
                              
                    })
                });
                document.querySelectorAll(".updMovie").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/movies/' + item.id, {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }
                                
                               })
                                .then( res => res.json() )
                                .then( el => {
                                    if (el.msg) {
                                        alert(el.msg);
                                    } else {
                                        document.getElementById("id").value = el.id;
                                        document.getElementById("title").value = el.title;
                                        document.getElementById("releaseYear").value = el.releaseYear;
                                        document.getElementById("description").value = el.description;
                                        document.getElementById("rating").value = el.rating;
                                        document.getElementById("movieLength").value = el.movieLength;
                                        document.getElementById("movieGenre").value = el.genre.id;
                                    }
                                })
                              
                    })
                })
            });

            fetch('http://localhost:8000/api/genres', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then( res => res.json() )
                .then( data => {
                   
                    const table = document.getElementById('genreData');
                    
                    if(data.msg){
                        console.log(data.msg);
                        return;
                    }
        
                    data.forEach( el => {
                        table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.name}</td> 
                        <td> <button id="${el.id}" type="button" class="btn btn-danger delGenre">Delete</button> 
                        <td> <button id="${el.id}" type="button" class="btn btn-primary selGenre">Select</button> <td></tr>`;
                    });
    
                    document.querySelectorAll(".delGenre").forEach(item =>{
                        item.addEventListener("click", e => {
                                e.preventDefault();
                                fetch('http://localhost:8000/api/genres/' + item.id, {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }
                                    
                                   })
                                    .then( res => res.json() )
                                    .then( el => {
                                        if (el.msg) {
                                            alert(el.msg);
                                        } else {
                                            location.reload();
                                        }
                                    })
                                  
                        })
                    });
                    document.querySelectorAll(".selGenre").forEach(item =>{
                        item.addEventListener("click", e => {
                                e.preventDefault();
                                fetch('http://localhost:8000/api/genres/' + item.id, {
                                    method: 'GET',
                                    headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }
                                    
                                   })
                                    .then( res => res.json() )
                                    .then( el => {
                                        if (el.msg) {
                                            alert(el.msg);
                                        } else {
                                            document.getElementById("movieGenre").value = el.id;
                                            
                                        }
                                    })
                                  
                        })
                    })
                });

        document.getElementById("addMovie").addEventListener("click", e => {
            e.preventDefault();
            let movie = {
                title: document.getElementById("title").value,
                releaseYear: document.getElementById("releaseYear").value,
                rating: document.getElementById("rating").value,
                description: document.getElementById("description").value,
                movieLength: document.getElementById("movieLength").value,
                genreId: document.getElementById("movieGenre").value
            }
            if(validateMovie(movie) || (movie.genreId == "")){
                return;
            }
            const formData = new FormData();
            for(const name in movie) {
                formData.append(name, movie[name]);
              }
            formData.append('files',document.getElementById('files').files[0]);
            fetch('http://localhost:8000/api/movies', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })
            .then( res => res.json() )
            .then( el => {
                if (el.msg) {
                    alert(el.msg);
                } else {
                    location.reload();
                }
            });

        });

        document.getElementById("updateMovie").addEventListener("click", e => {
            e.preventDefault();
            let id = document.getElementById("id").value;
           
            let movie = {
                title: document.getElementById("title").value,
                releaseYear: document.getElementById("releaseYear").value,
                rating: document.getElementById("rating").value,
                description: document.getElementById("description").value,
                movieLength: document.getElementById("movieLength").value,
                genreId: document.getElementById("movieGenre").value
            }
            if(validateMovie(movie)){
                return;
            }
            fetch('http://localhost:8000/api/movies/'+ id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(movie)
        })
            .then( res => res.json() )
            .then( el => {
                if (el.msg) {
                    alert(el.msg);
                } else {
                    location.reload();
                }
            });

        });

        document.getElementById("addGenre").addEventListener("click", e => {
            e.preventDefault();
            let genre = {
                name: document.getElementById("genreName").value
            }
            if(validateGenre(genre)){
                return;
            }
          
            fetch('http://localhost:8000/api/genres', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(genre)
        })
            .then( res => res.json() )
            .then( el => {
                if (el.msg) {
                    alert(el.msg);
                } else {
                    location.reload();
                }
            });

        });

        document.getElementById('logout').addEventListener('click', e => {
            document.cookie = `token=;SameSite=Lax`;
            window.location.href = '/admin/login';
        });

     

    
}

function validateMovie(data){
    let titleErrors = [];
    let releaseYearErrors = [];
    let descriptionErrors = [];
    let ratingErrors = [];
    let movieLengthErrors = [];


    let title = data.title.trim();
    let releaseYear = data.releaseYear.trim();
    let description = data.description.trim();
    let rating = data.rating.trim();
    let movieLength = data.movieLength.trim();


    if(title == ""){
        titleErrors.push("Title cannot be empty.");
    }
    if(releaseYear == ""){
        releaseYearErrors.push("Release year cannot be empty.");
    }
    if(description == ""){
        descriptionErrors.push("Description cannot be empty.");
    }
    if(rating == ""){
        ratingErrors.push("Rating cannot be empty.");
    }
    if(movieLength == ""){
        movieLengthErrors.push("Movie length cannot be empty.");
    }

    if(title.length < 2 || title.length > 30){
        titleErrors.push("Title must have more than 1 and less than 30 characters.");
    }

    if(data.releaseYear.length != 4){
        releaseYearErrors.push("Invalid release year format.");
    }

    if(!(/^\d+$/.test(releaseYear))){
        releaseYearErrors.push("It must be a number.");
    }
    
    try{
        let parsed = parseFloat(rating);
        parsed = Number(parsed.toFixed(2));
        if(parsed != rating){
            ratingErrors.push("Rating must have only two decimals.");
        }
        if(parsed < 0 || parsed > 10){
            ratingErrors.push("Rating must be decimal number between 0 and 10.");
        }
    }catch(e){
        ratingErrors.push("Rating must be decimal number betwen 0 and 10.");
    }
  


    if(description.length < 5 || description.length > 255){
        descriptionErrors.push("Description must have atleast 5 characters.");
    }
    
    try{
        let parsed = parseInt(movieLength);
        if(parsed < 30 || parsed > 300){
            ratingErrors.push("Movie length must be between 30 and 300.");
        }
    }catch(e){
        ratingErrors.push("Movie length must be a number.");
    }
    

    if(titleErrors.length > 0)
    document.getElementById("titleErr").innerText = titleErrors[0];
    else
    document.getElementById("titleErr").innerText = "";

    if(releaseYearErrors.length > 0)
    document.getElementById("releaseYearErr").innerText = releaseYearErrors[0];
    else
    document.getElementById("releaseYearErr").innerText = "";

    if(ratingErrors.length > 0)
    document.getElementById("ratingErr").innerText = ratingErrors[0];
    else
    document.getElementById("ratingErr").innerText = "";

    if(descriptionErrors.length > 0)
    document.getElementById("descriptionErr").innerText = descriptionErrors[0];
    else
    document.getElementById("descriptionErr").innerText = "";

    if(movieLengthErrors.length > 0)
    document.getElementById("movieLengthErr").innerText = movieLengthErrors[0];
    else
    document.getElementById("movieLengthErr").innerText = "";



    return (titleErrors.length > 0 || releaseYearErrors.length > 0 || ratingErrors.length > 0 || descriptionErrors.length > 0 || movieLengthErrors.length > 0);
}

function validateGenre(data){
    let nameErrors = [];

    let name = data.name.trim();

    if(name == ""){
        nameErrors.push("Genre cannot be empty.");
    }

    if(name.length < 2 || name.length > 20){
        nameErrors.push("Genre must have more than 2 and less than 20 characters.");
    }

    if(nameErrors.length > 0)
    document.getElementById("genreNameErr").innerText = nameErrors[0];
    else
    document.getElementById("genreNameErr").innerText = "";

    return (nameErrors.length > 0);
}

