
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
               
                const table = document.getElementById('tableData');
                
                if(data.msg){
                    console.log(data.msg);
                    return;
                }
    
                data.forEach( el => {
                    table.innerHTML += `<tr> <td>${el.id}</td> <td>${el.firstName}</td> <td>${el.lastName}</td> <td>${el.email}</td> <td>${el.isModerator}</td> <td> <button id="${el.id}" type="button" class="btn btn-danger">Delete</button> 
                    <td> <button id="${el.id}" type="button" class="btn btn-primary">Update</button> <td></tr>`;
                });

                document.querySelectorAll(".btn-danger").forEach(item =>{
                    item.addEventListener("click", e => {
                            e.preventDefault();
                            fetch('http://localhost:8000/api/users/' + item.id, {
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
                            fetch('http://localhost:8000/api/users/' + item.id, {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }
                                
                               })
                                .then( res => res.json() )
                                .then( el => {
                                    if (el.msg) {
                                        alert(el.msg);
                                    } else {
                                        document.getElementById("id").value = el.id;
                                        document.getElementById("firstName2").value = el.firstName;
                                        document.getElementById("lastName2").value = el.lastName;
                                        document.getElementById("email2").value = el.email;
                                        document.getElementById("isModerator2").checked = el.isModerator;
                                    }
                                })
                              
                    })
                })
            });

        document.getElementById("addUser").addEventListener("click", e => {
            e.preventDefault();
            let user = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                isModerator: document.getElementById("isModerator").checked,
            }
            if(validateAddUser(user)){
                return;
            }
            fetch('http://localhost:8000/api/users', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
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

        document.getElementById("updateUser").addEventListener("click", e => {
            e.preventDefault();
            let id = document.getElementById("id").value;
           
            let user = {
                firstName: document.getElementById("firstName2").value,
                lastName: document.getElementById("lastName2").value,
                email: document.getElementById("email2").value,
                isModerator: document.getElementById("isModerator2").checked,
            }
            if(validateUpdateUser(user)){
                return;
            }
            fetch('http://localhost:8000/api/users/'+ id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
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

function validateAddUser(data){
    let firstNameErrors = [];
    let lastNameErrors = [];
    let emailErrors = [];
    let passwordErrors = [];
    let firstName = data.firstName.trim();
    let lastName = data.lastName.trim();
    let email = data.email.trim();
    let password = data.password.trim();

    if(firstName == ""){
        firstNameErrors.push("First name cannot be empty.");
    }
    if(lastName == ""){
        lastNameErrors.push("Last name cannot be empty.");
    }
    if(email == ""){
        emailErrors.push("Email cannot be empty.");
    }
    if(password == ""){
        passwordErrors.push("Password cannot be empty.");
    }

    if(firstName.length < 3 || firstName.length > 30){
        firstNameErrors.push("First name must have more than 3 and less than 30 characters.");
    }

    if(lastName.length < 3 || lastName.length > 30){
        lastNameErrors.push("Last name must have more than 3 and less than 30 characters.");
    }


    if(email.length < 5 || email.length > 50){
        emailErrors.push("Email must have more than 5 and less than 50 characters.");
    }
    if(password.length < 3 || password.length > 30){
        passwordErrors.push("Password must have more than 3 and less than 30 characters.");
    }
    
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        emailErrors.push("Invalid email.");
    }

    if(firstNameErrors.length > 0)
    document.getElementById("firstNameErr").innerText = firstNameErrors[0];
    else
    document.getElementById("firstNameErr").innerText = "";

    if(lastNameErrors.length > 0)
    document.getElementById("lastNameErr").innerText = lastNameErrors[0];
    else
    document.getElementById("lastNameErr").innerText = "";

    if(emailErrors.length > 0)
    document.getElementById("emailErr").innerText = emailErrors[0];
    else
    document.getElementById("emailErr").innerText = "";

    if(passwordErrors.length > 0)
    document.getElementById("passwordErr").innerText = passwordErrors[0];
    else
    document.getElementById("passwordErr").innerText = "";


    return (firstNameErrors.length > 0 || lastNameErrors.length > 0 || emailErrors.length > 0 || passwordErrors.length > 0);
}

function validateUpdateUser(data){
    let firstNameErrors = [];
    let lastNameErrors = [];
    let emailErrors = [];
    let firstName = data.firstName.trim();
    let lastName = data.lastName.trim();
    let email = data.email.trim();

    if(firstName == ""){
        firstNameErrors.push("First name cannot be empty.");
    }
    if(lastName == ""){
        lastNameErrors.push("Last name cannot be empty.");
    }
    if(email == ""){
        emailErrors.push("Email cannot be empty.");
    }

    if(firstName.length < 3 || firstName.length > 30){
        firstNameErrors.push("First name must have more than 3 and less than 30 characters.");
    }

    if(lastName.length < 3 || lastName.length > 30){
        lastNameErrors.push("Last name must have more than 3 and less than 30 characters.");
    }


    if(email.length < 5 || email.length > 50){
        emailErrors.push("Email must have more than 5 and less than 50 characters.");
    }
    
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        emailErrors.push("Invalid email.");
    }

    if(firstNameErrors.length > 0)
    document.getElementById("firstName2Err").innerText = firstNameErrors[0];
    else
    document.getElementById("firstName2Err").innerText = "";

    if(lastNameErrors.length > 0)
    document.getElementById("lastName2Err").innerText = lastNameErrors[0];
    else
    document.getElementById("lastName2Err").innerText = "";

    if(emailErrors.length > 0)
    document.getElementById("email2Err").innerText = emailErrors[0];
    else
    document.getElementById("email2Err").innerText = "";


    return (firstNameErrors.length > 0 || lastNameErrors.length > 0 || emailErrors.length > 0);
}