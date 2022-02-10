

function init() {

    document.getElementById('loginBtn').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        if(validateData(data)){
            return;
        }

        fetch('http://localhost:9000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( el => {
                if (el.msg) {
                    alert(el.msg);
                } else {
                     document.cookie = `token=${el.token};SameSite=Lax`;
                     window.location.href = '/admin';
                }
            });
    });
}

function validateData(data){
    let emailErrors = [];
    let passwordErrors = [];
    let email = data.email.trim();
    let password = data.password.trim();

    if(email == ""){
        emailErrors.push("Email cannot be empty.");
    }
    if(password == ""){
        passwordErrors.push("Password cannot be empty.");
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


    if(emailErrors.length > 0)
    document.getElementById("emailErr").innerText = emailErrors[0];
    else
    document.getElementById("emailErr").innerText = "";

    if(passwordErrors.length > 0)
    document.getElementById("passwordErr").innerText = passwordErrors[0];
    else
    document.getElementById("passwordErr").innerText = "";

    return (emailErrors.length > 0 || passwordErrors.length > 0);
}

