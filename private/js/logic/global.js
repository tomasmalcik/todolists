function displayBanner(msg) {
    $(".banner").css("background-color","rgb(248, 215, 218)")
    $(".banner").css("border-right", "10px solid rgb(245, 198, 203)")
    $(".banner").css("color", "#721c24")
    $(".banner-text").html(msg)
    $(".banner").toggleClass("shown");
    setTimeout(() => {
        $(".banner").toggleClass("shown")
    },5000)
}

function displaySuccess(msg) {
    $(".banner").css("background-color","#d4edda")
    $(".banner").css("border-right", "10px solid #c3e6cb")
    $(".banner").css("color", "#155724")
    $(".banner-text").html(msg)
    $(".banner").toggleClass("shown");
    setTimeout(() => {
        $(".banner").toggleClass("shown")
    },5000)    
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function logout() {
    //Delete user_data and cookie
    setCookie("token", "", -1)
    localStorage.removeItem("user_data")
    window.location.href="/"
}