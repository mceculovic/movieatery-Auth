
function init(){

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
  
        fetch('http://localhost:8000/api/actors', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then( res => res.json() )
            .then( data => {
               
                const table = document.getElementById('tableData');
                const select = document.getElementById('actorId');
                
                if(data.msg){
                    console.log(data.msg);
                    return;
                }
    
                data.forEach( el => {
                    let date = new Date(el.birth);
                    
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.firstName}</td> <td>${el.lastName}</td> <td>${date.toLocaleDateString('en-US')}</td> <td>${el.birthPlace}</td> <td>${el.gender}</td> 
                    <td> <button id="${el.id}" type="button" class="btn btn-danger">Delete</button> 
                    <td> <button id="${el.id}" type="button" class="btn btn-primary">Update</button> <td></tr>`;

                    select.innerHTML += `<option value='${el.id}'>${el.firstName} ${el.lastName}</option>`;
                });

                document.querySelectorAll(".btn-danger").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/actors/' + item.id, {
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
                            fetch('http://localhost:8000/api/actors/' + item.id, {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }
                                
                               })
                                .then( res => res.json() )
                                .then( el => {
                                    if (el.msg) {
                                        alert(el.msg);
                                    } else {
                                        document.getElementById("id").value = el.id;
                                        document.getElementById("firstName").value = el.firstName;
                                        document.getElementById("lastName").value = el.lastName;
                                        document.getElementById("birth").value = new Date(el.birth).toISOString().split('T')[0];
                                        document.getElementById("birthPlace").value = el.birthPlace;
                                        el.gender === 'm'? document.getElementById("maleRadioBtn").checked = true : document.getElementById("femaleRadioBtn").checked = true;
                                    }
                                })
                              
                    })
                })
            });

            fetch('http://localhost:8000/api/movies', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then( res => res.json() )
                .then( data => {
                   
                    const table = document.getElementById('tableData2');
                    const select = document.getElementById("movieId");
                    
                    if(data.msg){
                        console.log(data.msg);
                        return;
                    }
              
                data.forEach( el => {
                    let actors = "";
                    el.Actors.forEach(a => {
                        actors += a.firstName + ' ' + a.lastName + ', ';
                    })
                    actors = actors.slice(0,actors.length-2);
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.title}</td> <td>${actors}</td> </tr>`;
                    select.innerHTML += `<option value='${el.id}'>${el.title}</option>`;
                });
           
            });

        document.getElementById("addActor").addEventListener("click", e => {
            e.preventDefault();
            let actor = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                birth: document.getElementById("birth").value,
                birthPlace: document.getElementById("birthPlace").value,
                gender: document.getElementById("maleRadioBtn").checked? 'm' : 'f',
            }
            if(validateActor(actor)){
                return;
            }
            fetch('http://localhost:8000/api/actors', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(actor)
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

        document.getElementById("updateActor").addEventListener("click", e => {
            e.preventDefault();
            let id = document.getElementById("id").value;
           
            let actor = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                birth: document.getElementById("birth").value,
                birthPlace: document.getElementById("birthPlace").value,
                gender: document.getElementById("maleRadioBtn").checked? 'm' : 'f',
            }
            if(validateActor(actor)){
                return;
            }
            fetch('http://localhost:8000/api/actors/'+ id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(actor)
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

        document.getElementById('addToMovie').addEventListener('click', e => {
                e.preventDefault();
                const object = {
                    movieId: document.getElementById('movieId').value,
                    actorId: document.getElementById('actorId').value,
                }

                fetch('http://localhost:8000/api/cast', {
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

        document.getElementById('removeFromMovie').addEventListener('click', e => {
            e.preventDefault();
            
            let url = document.getElementById('movieId').value + '/' + document.getElementById('actorId').value;

            fetch('http://localhost:8000/api/cast/' + url, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
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

function validateActor(data){
    let firstNameErrors = [];
    let lastNameErrors = [];
    let birthErrors = [];
    let birthPlaceErrors = [];


    let firstName = data.firstName.trim();
    let lastName = data.lastName.trim();
    let birth = data.birth.trim();
    let birthPlace = data.birthPlace.trim();


    if(firstName == ""){
        firstNameErrors.push("First name cannot be empty.");
    }
    if(lastName == ""){
        lastNameErrors.push("Last name cannot be empty.");
    }
    if(birth == "" || birth == "dd-mm-yyyy"){
        birthErrors.push("Date of birth cannot be empty.");
    }
    if(birthPlace == ""){
        birthPlaceErrors.push("Birth place cannot be empty.");
    }
   

    if(firstName.length < 3 || firstName.length > 30){
        firstNameErrors.push("First name must have more than 2 and less than 30 characters.");
    }

    if(lastName.length < 3 || lastName.length > 30){
        lastNameErrors.push("Last name must have more than 2 and less than 30 characters.");
    }

    if(birthPlace.length < 5 || birthPlace.length > 30){
        birthPlaceErrors.push("Birth place must have more than 4 and less than 30 characters.");
    }
  
    let startDate = new Date('1/1/1900');
    let endDate = Date.now();
    let birthDate = new Date(birth);

    if(birthDate.getTime() < startDate.getTime()){
        birthErrors.push("Date birth is too old.");
    }

    if(birthDate.getTime() > endDate){
        birthErrors.push("Invalid birth date.");
    }

    

    if(firstNameErrors.length > 0)
    document.getElementById("firstNameErr").innerText = firstNameErrors[0];
    else
    document.getElementById("firstNameErr").innerText = "";

    if(lastNameErrors.length > 0)
    document.getElementById("lastNameErr").innerText = lastNameErrors[0];
    else
    document.getElementById("lastNameErr").innerText = "";

    if(birthErrors.length > 0)
    document.getElementById("birthErr").innerText = birthErrors[0];
    else
    document.getElementById("birthErr").innerText = "";

    if(birthPlaceErrors.length > 0)
    document.getElementById("birthPlaceErr").innerText = birthPlaceErrors[0];
    else
    document.getElementById("birthPlaceErr").innerText = "";


    return (firstNameErrors.length > 0 || lastNameErrors.length > 0 || birthErrors.length > 0 || birthPlaceErrors.length > 0);
}

