
function init(){

    document.getElementById("logout").addEventListener("click", e => {
        document.cookie = `token=;SameSite=Lax;path=/admin`;
        console.log("SET");
        window.location.href = '/admin/login';
    });
}