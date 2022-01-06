//Initialize profile - load user,..
function init_profile() {
    user = JSON.parse(window.localStorage.getItem("user_data"))
    setUserOptions(user)
    showOptions("general-options")
}

//Show settings
function showOptions(current) {
    $(".breadcrumb").html("Profile > " + current.split("-")[0] +" settings")
    $(".items-content .optionGroup").hide()
    $("."+current).fadeIn()

}

//Set users data - avatar, name,...
function setUserOptions(user) {
    const user_panel = document.querySelector(".usr")
    const user_avatar = document.querySelector(".optionAvatar")
    const user_name = document.querySelector("#username")
    const user_surname = document.querySelector("#usersurname")

    const name = document.querySelector(".usr-dropdown h6")
    user_panel.style.backgroundImage = "url("+user.avatar+")"
    user_avatar.setAttribute("src", `${user.avatar}`)
    user_name.value = user.username
    user_surname.value = user.usersurname
    name.textContent = user.username + " " + user.usersurname
}

//Update users avatar
function updateAvatar(ev) {
    ev.preventDefault()
    const user = JSON.parse(localStorage.getItem("user_data")) //Get user data from localStorage
    var filesSelected = document.getElementById("avatarInput").files; //Get avatar file
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader(); //Load fileReader
        

        fileReader.onload = async function(fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // Get base64 data
            const result = await fetch(`/users/${user._id}/generalData`, { //Update request
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: user.username,
                    surname: user.usersurname,
                    email: user.email,
                    avatar: srcData
                })
            }).then(result => result.json())

            if(result.status == "error") {
                displayBanner(result.error)
                return
            }

            //Update localStorage
            localStorage.setItem("user_data", JSON.stringify(result.data))
            //Show updates on page
            setUserOptions(JSON.parse(localStorage.getItem("user_data")))
            displaySuccess("Avatar successfully updated")
        }
      fileReader.readAsDataURL(fileToLoad); //Call filereader
    }else {
        displayBanner("Ran into error while updating avatar..")
        return
    }
}

//Update users credentials
async function updateCredentials(ev) {
    ev.preventDefault()

    //Get new values
    const username = document.querySelector("#username")
    const usersurname = document.querySelector("#usersurname")

    const usr = JSON.parse(localStorage.getItem("user_data")) //Load user data from localStorage

    const res = await fetch(`/users/${usr._id}/generalData`, { //API call
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: username.value,
            surname: usersurname.value,
            email: usr.email,
            avatar: usr.avatar
        })
    }).then(res => res.json())

    if(res.status == "error") {
        displayBanner(res.error)
        return
    }

    //Successfully updated
    localStorage.setItem("user_data", JSON.stringify(res.data))
    //Show updates on page
    setUserOptions(JSON.parse(localStorage.getItem("user_data")))
    displaySuccess("Successfully updated credentials")

}

//Change users password
async function changePassword(ev) {
    ev.preventDefault()

    const user = JSON.parse(localStorage.getItem("user_data")) //Load users data from localStorage

    //New and old password
    const curr_pwd = document.querySelector("#curr_password")
    const new_pwd = document.querySelector("#new_password")
    const new_pwd2 = document.querySelector("#new_password2")

    const res = await fetch(`/users/${user._id}/password`, { //API call
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentPassword: curr_pwd.value,
            newPassword: new_pwd.value,
            newPassword2: new_pwd2.value
        })
    }).then(res => res.json())

    if(res.status == "error") {
        displayBanner(res.error)
        return
    }

    //Updated successfully - clear inputs
    curr_pwd.value = ""
    new_pwd.value = ""
    new_pwd2.value = ""

    displaySuccess(res.data)
}

//Change users email
async function changeEmail(ev) {
    ev.preventDefault()

    const user = JSON.parse(localStorage.getItem("user_data")) //load users data from localStorage

    //new email & current password
    const current_pwd = document.querySelector("#curr_password_email")
    const new_email = document.querySelector("#email")

    const res = await fetch(`/users/${user._id}/email`, { //API call
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentPassword: current_pwd.value,
            newEmail: new_email.value
        })
    }).then(res => res.json())

    if(res.status == "error") {
        displayBanner(res.error)
        return
    }

    //Updated successfully - clear values
    new_email.value = ""
    current_pwd.value = ""

    //Update localStorage
    localStorage.setItem("user_data", JSON.stringify(res.data))
    //Show updates on page
    setUserOptions(JSON.parse(localStorage.getItem("user_data")))
    displaySuccess("Successfully updated email")
}

//Call function when loaded to page
init_profile()
