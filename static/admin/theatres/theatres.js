
function init(){

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
  
        fetch('http://127.0.0.1:8000/api/theatres', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then( res => res.json() )
            .then( data => {
               
                const table = document.getElementById('tableData');
                const select = document.getElementById('theatreId');
                
                if(data.msg){
                    console.log(data.msg);
                    return;
                }
    
                data.forEach( el => {
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.name}</td> <td>${el.street}</td> <td>${el.city}</td> <td>${el.phone}</td> <td>${el.capacity}</td> 
                    <td><button id="${el.id}" type="button" class="btn btn-danger theatreDelete">Delete</button> 
                    <td><button id="${el.id}" type="button" class="btn btn-primary theatreUpdate">Update</button><td></tr>`;
                    select.innerHTML += `<option value='${el.id}'>${el.name}</option>`;

                });

                document.querySelectorAll(".theatreDelete").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/theatres/' + item.id, {
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
                document.querySelectorAll(".theatreUpdate").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/theatres/' + item.id, {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }
                                
                               })
                                .then( res => res.json() )
                                .then( el => {
                                    if (el.msg) {
                                        alert(el.msg);
                                    } else {
                                        document.getElementById("id").value = el.id;
                                        document.getElementById("name").value = el.name;
                                        document.getElementById("street").value = el.street;
                                        document.getElementById("city").value = el.city;
                                        document.getElementById("phone").value = el.phone;
                                        document.getElementById("capacity").value = el.capacity;
                                    }
                                })
                              
                    })
                });
            });

            fetch('http://127.0.0.1:8000/api/seatslayout', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then( res => res.json() )
            .then( data => {
               
                const table = document.getElementById('tableData2');

                if(data.msg){
                    console.log(data.msg);
                    return;
                }
    
                data.forEach( el => {
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.rows}</td> <td>${el.numbers}</td> <td>${el.theatre.name}</td>
                    <td><button id="${el.id}" type="button" class="btn btn-danger seatDelete">Delete</button> 
                    <td><button id="${el.id}" type="button" class="btn btn-primary seatUpdate">Update</button><td></tr>`;
                });

                document.querySelectorAll(".seatDelete").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/seatslayout/' + item.id, {
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
                document.querySelectorAll(".seatUpdate").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/seatslayout/' + item.id, {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }
                                
                               })
                                .then( res => res.json() )
                                .then( el => {
                                    if (el.msg) {
                                        alert(el.msg);
                                    } else {
                                        document.getElementById("theatreId").value = el.theatreId;
                                        document.getElementById("rowId").value = el.rows;
                                        document.getElementById("numberId").value = el.numbers;
                                        document.getElementById("seatId").value = el.id;
                                      
                                    }
                                })
                              
                    })
                });
            });

        

        document.getElementById("addTheatre").addEventListener("click", e => {
            e.preventDefault();
            let theatre = {
                name: document.getElementById("name").value,
                street: document.getElementById("street").value,
                city: document.getElementById("city").value,
                phone: document.getElementById("phone").value,
                capacity: document.getElementById("capacity").value,
            }
            if(validateTheatre(theatre)){
                return;
            }
            const formData = new FormData();
            for(const name in theatre) {
                formData.append(name, theatre[name]);
              }
            formData.append('files',document.getElementById('files').files[0]);
            fetch('http://localhost:8000/api/theatres', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`
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

        document.getElementById("updateTheatre").addEventListener("click", e => {
            e.preventDefault();
            let id = document.getElementById("id").value;
           
            let theatre = {
                name: document.getElementById("name").value,
                street: document.getElementById("street").value,
                city: document.getElementById("city").value,
                phone: document.getElementById("phone").value,
                capacity: document.getElementById("capacity").value,
            }
            if(validateTheatre(theatre)){
                return;
            }
            fetch('http://localhost:8000/api/theatres/'+ id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(theatre)
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

        document.getElementById("addSeat").addEventListener("click", e => {
            e.preventDefault();
            let seatLayout = {
                rows: document.getElementById("rowId").value,
                numbers: document.getElementById("numberId").value,
                theatreId: document.getElementById("theatreId").value,
           
            }
            if(validateSeat(seatLayout)){
                return;
            }
            fetch('http://localhost:8000/api/seatslayout', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(seatLayout)
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

        document.getElementById("updateSeat").addEventListener("click", e => {
            e.preventDefault();
            let id = document.getElementById("seatId").value;
           
            let seatLayout = {
                rows: document.getElementById("rowId").value,
                numbers: document.getElementById("numberId").value,
                theatreId: document.getElementById("theatreId").value,
           
            }
            if(validateSeat(seatLayout)){
                return;
            }
            fetch('http://localhost:8000/api/seatslayout/'+ id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(seatLayout)
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

function validateTheatre(data){
    let nameErrors = [];
    let streetErrors = [];
    let cityErrors = [];
    let phoneErrors = [];
    let capacityErrors = [];


    let name = data.name.trim();
    let street = data.street.trim();
    let city = data.city.trim();
    let phone = data.phone.trim();
    let capacity = data.capacity.trim();


    if(name == ""){
        nameErrors.push("Name cannot be empty.");
    }
    if(street == ""){
        streetErrors.push("Street cannot be empty.");
    }
    if(city == ""){
        cityErrors.push("City cannot be empty.");
    }
    if(phone == ""){
        phoneErrors.push("Phone cannot be empty.");
    }
    if(capacity == ""){
        capacityErrors.push("Capacity cannot be empty.");
    }

    if(name.length < 2 || name.length > 30){
        nameErrors.push("Name must have more than 1 and less than 30 characters.");
    }
    if(street.length < 3 || street.length > 50){
        streetErrors.push("Street must have more than 2 and less than 50 characters.");
    }
    if(city.length < 3 || city.length > 20){
        cityErrors.push("City must have more than 2 and less than 50 characters.");
    }
    if(phone.length < 5 || phone.length > 30){
        phoneErrors.push("Phone must have more than 4 and less than 30 characters.");
    }
    
    if(!(/^[0-9]+$/.test(phone))){
        phoneErrors.push("Invalid phone format.");
    }

    try{
        let parse = Number.parseInt(capacity);
        if(parse < 10){
            capacityErrors.push("Too little capacity.");
        }
        if(parse > 230){
            capacityErrors.push("Too much capacity.");
        }
    }catch(e){
        capacityErrors.push("Capacity must be number.");
    }
    

    if(nameErrors.length > 0)
    document.getElementById("nameErr").innerText = nameErrors[0];
    else
    document.getElementById("nameErr").innerText = "";

    if(streetErrors.length > 0)
    document.getElementById("streetErr").innerText = streetErrors[0];
    else
    document.getElementById("streetErr").innerText = "";

    if(cityErrors.length > 0)
    document.getElementById("cityErr").innerText = cityErrors[0];
    else
    document.getElementById("cityErr").innerText = "";

    if(phoneErrors.length > 0)
    document.getElementById("phoneErr").innerText = phoneErrors[0];
    else
    document.getElementById("phoneErr").innerText = "";

    if(capacityErrors.length > 0)
    document.getElementById("capacityErr").innerText = capacityErrors[0];
    else
    document.getElementById("capacityErr").innerText = "";



    return (nameErrors.length > 0 || streetErrors.length > 0 || cityErrors.length > 0 || phoneErrors.length > 0 || capacityErrors.length > 0);
}

function validateSeat(data){
    let rowErrors = [];
    let numberErrors = [];



    if(data.rows == ""){
        rowErrors.push("Row cannot be empty.");
    }
    if(data.numbers == ""){
        numberErrors.push("Number of seat cannot be empty.");
    }


  

    try{
        let rowParse = Number.parseInt(data.rows);
        if(rowParse < 1 || rowParse > 30){
            rowErrors.push("Row number can be between 1 and 30.");
        }
    }catch(e){
        rowErrors.push("Row must be number.");
    }

    try{
        let numberParse = Number.parseInt(data.numbers);
        if(numberParse < 1 || numberParse > 30){
            numberErrors.push("Number of can be between 1 and 30.");
        }
    }catch(e){
        numberErrors.push("Number of seat must be number.");
    }
    

    if(rowErrors.length > 0)
    document.getElementById("rowErr").innerText = rowErrors[0];
    else
    document.getElementById("rowErr").innerText = "";

    if(numberErrors.length > 0)
    document.getElementById("numberErr").innerText = numberErrors[0];
    else
    document.getElementById("numberErr").innerText = "";


    return (rowErrors.length > 0 || numberErrors.length > 0 );
}

