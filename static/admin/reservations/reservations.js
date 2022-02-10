
function init(){

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
  
        fetch('http://localhost:8000/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then( res => res.json() )
            .then( data => {
               
                const table = document.getElementById('userData');
                const select = document.getElementById('userId');
                
                if(data.msg){
                    console.log(data.msg);
                    return;
                }
    
                data.forEach( el => {
                    
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.email}</td><td>${el.firstName}</td><td>${el.lastName}</td></tr>`;

                    select.innerHTML += `<option value='${el.id}'>${el.email}</option>`;
                });
            });

            fetch('http://localhost:8000/api/showtimes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then( res => res.json() )
                .then( data => {
                   
                    const table = document.getElementById('showtimesData');

                    if(data.msg){
                        console.log(data.msg);
                        return;
                    }

              
                data.forEach( el => {
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.Theatre.name}</td><td>${el.Movie.title}</td><td>${el.day}</td><td>${el.time}</td><td>${el.ticketPrice}</td>
                    <td> <button id="${el.id}" type="button" class="btn btn-primary viewSeats">View seats</button> <td> </tr>`;
                });

                document.querySelectorAll(".viewSeats").forEach(item =>{
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

                                        
                                        fetch('http://localhost:8000/api/seatreservations', {
                                            headers: {
                                                'Authorization': `Bearer ${token}`
                                            }
                                        })
                                            .then( res => res.json() )
                                            .then( data => { 
                                                let seats = el.Theatre.seats;
                                                let reservedSeats = [];

                                                const select = document.getElementById('seatsId');
                                                const showtime = document.getElementById('showtimesId');
                                    

                                                data.forEach(rs => {
                                                    reservedSeats.push(rs.seatId);
                                                })
                                            
                                                seats = seats.filter((s) =>
                                                    !reservedSeats.includes(s.id)
                                                );

        
                                                
                                                select.innerHTML = "";
                                                showtime.value = el.Theatre.id;
        
                                              seats.forEach(s => {
                                                  select.innerHTML += `<option value='${s.id}'>row: ${s.row}, number: ${s.number} </option>`
                                              });
                                            });
                                        
                        
                                        

                                    }
                                });
                              
                    })
                });
           
            });

           

            fetch('http://localhost:8000/api/reservations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then( res => res.json() )
                .then( data => {
                   
                    const table = document.getElementById('reservationsData');
                    
                    if(data.msg){
                        console.log(data.msg);
                        return;
                    }
              
                data.forEach( el => {
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.user.email}</td><td>${el.showtime.Movie.title}</td><td>${el.showtime.Theatre.name}</td><td>${el.showtime.day}</td>
                    <td>${el.showtime.time} </td><td>${el.showtime.ticketPrice}</td> <td>${el.paid}</td>
                    <td> <button id="${el.id}" type="button" class="btn btn-danger">Delete</button></tr>`;
                });

                document.querySelectorAll(".btn-danger").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/reservations/' + item.id, {
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
        
           
            });

        
        document.getElementById('addReservation').addEventListener('click', e => {
            e.preventDefault();

            const selectedValues = [...document.getElementById('seatsId').options]
            .filter(x => x.selected)
            .map(x => x.value);

            if(selectedValues.length < 0){
                alert('You must select seats!');
                return;
            }

            const object = {
                userId: document.getElementById('userId').value,
                showtimesId: document.getElementById('showtimesId').value,
                paid: document.getElementById('paidTrueId').checked ? true : false,
                seats: selectedValues
            };
            


            fetch('http://localhost:8000/api/reservations' , {
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

        document.getElementById('logout').addEventListener('click', e => {
            document.cookie = `token=;SameSite=Lax`;
            window.location.href = '/admin/login';
        });

     

    
}



