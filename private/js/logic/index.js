//Register form
const loginForm = document.querySelector(".login-form form")
const registerForm = document.querySelector(".register-form form")

const logForm = $(".login-form")
const regForm = $(".register-form")

function init_index() {
    const queryString = window.location.search
    if(queryString == '?register') {
        showRegister()
    }
}

function showLogin() {
    regForm.fadeOut();
    logForm.css("display", "flex").hide().fadeIn();
}
function showRegister() {
    logForm.fadeOut();
    regForm.css("display", "flex").hide().fadeIn();
}

loginForm.addEventListener("submit", async (ev) => {
    ev.preventDefault()

    const email = document.querySelector("#log_email").value
    const password = document.querySelector("#log_password").value

    const res = await fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            log_email: email,
            log_password: password
        })
    }).then(res => res.json())

    if(res.status == 'error') { //Login was not successfull, print error
        displayBanner(res.error)
    }else {
        //create cookie, try accessing /profile
        //Set cookie
        setCookie('token', res.data.token, 1);
        window.localStorage.setItem("user_data", JSON.stringify(res.data.user_data))
        window.location.href = "/workspaces"
    }
})

registerForm.addEventListener("submit", async (ev) => {
    ev.preventDefault()

    //get fields
    const name = document.querySelector("#reg_name").value,
            surname = document.querySelector("#reg_surname").value,
            email = document.querySelector("#reg_email").value,
            password = document.querySelector("#reg_password").value,
            password2 = document.querySelector("#reg_password2").value

    const res = await fetch('/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reg_name: name,
            reg_surname: surname,
            reg_email: email,
            reg_password: password,
            reg_password2: password2
        })
    }).then((res) => res.json())

    if(res.status == 'error') {
        displayBanner(res.error)
    }else {
        //Set cookie
        setCookie('token', res.data.token, 1);  
        window.localStorage.setItem("user_data", JSON.stringify(res.data.user_data))
        window.location.href = '/workspaces'
    }
})

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//Logout
function logout() {
    //Delete user_data and cookie
    setCookie("token", "", -1)
    localStorage.removeItem("user_data")
    window.location.href="/"
}

init_index()