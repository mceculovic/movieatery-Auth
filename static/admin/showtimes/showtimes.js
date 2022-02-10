
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
                const select = document.getElementById('movieId');
                
                if(data.msg){
                    console.log(data.msg);
                    return;
                }
    
                data.forEach( el => {
                    let directors = "";
                    let actors = "";
                    el.Directors.forEach(a => {
                        directors += a.firstName + ' ' + a.lastName + ', ';
                    })
                    el.Actors.forEach(a => {
                        actors += a.firstName + ' ' + a.lastName + ', ';
                    })
                    directors = directors.slice(0,directors.length-2);
                    actors = actors.slice(0,actors.length-2);

                    
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.title}</td><td>${directors}</td><td>${actors}</td><td>${el.movieLength}</td></tr>`;

                    select.innerHTML += `<option value='${el.id}'>${el.title}</option>`;
                });
            });

            fetch('http://localhost:8000/api/theatres', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then( res => res.json() )
                .then( data => {
                   
                    const table = document.getElementById('tableData2');
                    const select = document.getElementById("theatreId");
                    
                    if(data.msg){
                        console.log(data.msg);
                        return;
                    }
              
                data.forEach( el => {
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.name}</td><td>${el.street}</td><td>${el.city}</td><td>${el.phone}</td></tr>`;
                    select.innerHTML += `<option value='${el.id}'>${el.name}</option>`;
                });
           
            });

            fetch('http://localhost:8000/api/showtimes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then( res => res.json() )
                .then( data => {
                   
                    const table = document.getElementById('tableData3');
                    
                    if(data.msg){
                        console.log(data.msg);
                        return;
                    }
              
                data.forEach( el => {
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.Theatre.name}</td><td>${el.Movie.title}</td><td>${el.startDate}</td><td>${el.time}</td><td>${el.ticketPrice} </td>
                    <td> <button id="${el.id}" type="button" class="btn btn-danger">Delete</button> 
                    <td> <button id="${el.id}" type="button" class="btn btn-primary">Update</button> <td></tr>`;
                });

                document.querySelectorAll(".btn-danger").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/showtimes/' + item.id, {
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
                document.querySelectorAll(".btn-primary").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/showtimes/' + item.id, {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }
                                
                               })
                                .then( res => res.json() )
                                .then( el => {
                                    if (el.msg) {
                                        alert(el.msg);
                                    } else {
                                        document.getElementById("id").value = el.id;
                                        document.getElementById("theatreId").value = el.theatreId;
                                        document.getElementById("movieId").value = el.movieId;
                                        document.getElementById("startDate").value = el.startDate;
                                        document.getElementById("timeId").value = el.time;
                                        document.getElementById("ticketPriceId").value = el.ticketPrice;
                                    }
                                })
                              
                    })
                })
           
            });

        
        document.getElementById('addShowtime').addEventListener('click', e => {
            e.preventDefault();
            const object = {
                movieId: document.getElementById('movieId').value,
                theatreId: document.getElementById('theatreId').value,
                startDate: document.getElementById('startDate').value,
                time: document.getElementById('timeId').value,
                ticketPrice: document.getElementById('ticketPriceId').value
            };

            if(validateData(object)){
                return;
            }

            fetch('http://localhost:8000/api/showtimes' , {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(object)
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

    document.getElementById('updateShowtime').addEventListener('click', e => {
        e.preventDefault();

        const id = document.getElementById("id").value;

        const object = {
            movieId: document.getElementById('movieId').value,
            theatreId: document.getElementById('theatreId').value,
            startDate: document.getElementById('startDate').value,
            time: document.getElementById('timeId').value,
            ticketPrice: document.getElementById('ticketPriceId').value
        };

        if(validateData(object))
            return;
        
        
        fetch('http://localhost:8000/api/showtimes/' + id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(object)
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

function validateData(data){
    let timeErrors = [];
    let ticketPriceErrors = [];
    let startDateErrors = []

    let time = data.time.trim();
    let startDate = data.startDate;
    
    if(time == ""){
        timeErrors.push("Time cannot be empty.");
    }

    if(startDate == ""){
        startDateErrors.push("Start date cannot be empty.");
    }

    if(startDate.length != 10){
        startDateErrors.push("Invalid start date format.")
    }

    if(data.ticketPrice == ""){
        ticketPriceErrors.push("Ticket price cannot be empty.");
    }
    if(data.ticketPrice.trim().length > 255){
        ticketPriceErrors.push("Invalid ticket price.");
    }

    try{
        let parse = Number.parseInt(data.ticketPrice);
        if(parse < 0 || parse > 1000000){
            ticketPriceErrors.push("Invalid ticket price.");
        }
        if(isNaN(parse)){
            ticketPriceErrors.push("Ticket price must be a number.")
        }
        console.log(parse);
    }catch(e){
        ticketPriceErrors.push("Ticket price must be a number.");
    }
   
    if(!(/^([0-9]{2})\:([0-9]{2})$/.test(time))){
        timeErrors.push("Invalid time format (ex: hh:mm)");
    }
    if(!(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
    .test(startDate)){
        startDateErrors.push("Invalid start date format.");
    }

    if(timeErrors.length > 0)
    document.getElementById("timeErr").innerText = timeErrors[0];
    else
    document.getElementById("timeErr").innerText = "";

    if(ticketPriceErrors.length > 0)
    document.getElementById("ticketPriceErr").innerText = ticketPriceErrors[0];
    else
    document.getElementById("ticketPriceErr").innerText = "";

    if(startDateErrors.length > 0)
    document.getElementById("startDateErr").innerText = startDateErrors[0];
    else
    document.getElementById("startDateErr").innerText = "";

    return (timeErrors.length > 0 || ticketPriceErrors.length > 0 || startDateErrors.length > 0);
}

