workspace = {}
let workspace_id = document.URL.split("/workspaces/")[1].split("#")[0]

const fetchData = async (id) => {
    res = await fetch(`/api/workspaces/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    workspace = res.data
}

function displayLists() {
    console.log("called")
    //$(".no-work").hide()
    let innerHTML = ""
    workspace.lists.forEach(element => {
      innerHTML += List(element.title, element.items, (element.completion.checked / element.completion.total)*100, element._id)
    });
    $(".lists").html(innerHTML)
}

function setUserOptions(user) {
    const user_panel = document.querySelector(".usr")
    const name = document.querySelector(".usr-dropdown h6")
    user_panel.style.backgroundImage = "url("+user.avatar+")"
    name.textContent = user.username + " " + user.usersurname
}

function openFilter() {
    $(".filter div").toggleClass("shown")
}

function showLists(obj, condition) {
    $(".lists").children().hide()
    $(".lists").children(".list"+condition).show()
    $(obj).siblings().css("color","#333")
    $(obj).css("color", "#e31b6d")
}

function openChangeName(obj) {
    $(obj).parent().siblings("span").hide()
    $(obj).parent().siblings("form").show()
    $(obj).parent().siblings("form").children().focus()
}

function showSorts(obj) {
    $(obj).siblings(".sorts").toggle()
}

function openAddItem(obj) {
    $(obj).hide()
    $(obj).siblings("form").show()
    $(obj).siblings("form").children(".form-control").focus()
}

function editItem(obj) {
    $(obj).parent().siblings("span").hide()
    $(obj).parent().siblings("label").hide()
    $(obj).parent().siblings("form").show()
    $(obj).parent().siblings("form").children(".form-control").focus()
}

function addList() {
    console.log("called")
    $(".popup").children().hide()
    $(".addList").show()
    displayPopup()
}

function openListImport() {
    $(".popup").children().hide()
    $(".import-window").show()
    displayPopup()
}

function copyToClipboard() {
    var copyText = document.getElementById("jsonExport");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
  
    document.getElementById("hintText").innerHTML = "Copied!"
}

async function init_workspace() {
    //fetch lists
    await fetchData(workspace_id)
    displayLists()
    user = JSON.parse(window.localStorage.getItem("user_data"))
    setUserOptions(user)

    //Set current workspace
    document.querySelector(".curr_workspace_bread").innerHTML = workspace.title
}

async function exportList(id) {
    const res = await fetch(`/todolists/${id}/json`, {
        method: "GET"
    }).then(res => res.json())

    if(res.status == "error") {
        displayBanner(res.error)
        return
    }

    $(".popup").children().hide()
    //add to textarea
    $("#jsonExport").html(JSON.stringify(res.data, undefined, 4))
    $(".raw").attr("onclick",`window.location.href="/todolists/${id}/json"`)
    $(".export-window").show()

    displayPopup()
}

async function handleImport(ev) {
    ev.preventDefault()

    const importJSON = document.querySelector("#jsonImport")
    const parsedJSON = JSON.parse(importJSON.value, undefined, 4)
    parsedJSON.workspace_id = workspace_id
    console.log(JSON.stringify(parsedJSON))
    const res = await fetch("/api/todolists/import", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedJSON)
    }).then(res => res.json())

    if(res.status == 'error') {
        displayBanner(res.error)
        return
    }

    //Successfully imported
    await fetchData(workspace_id).then(() => {
        displayLists()
        importJSON.value = ""
        hidePopup()
        displaySuccess(res.data)
    })    
}

async function handleEdit(ev, obj, id, index) {
    ev.preventDefault()
    const value = $(obj).children(".form-control").val()
    const list = workspace.lists.find(el => el._id == id)
    let tempItems = JSON.parse(JSON.stringify(list.items)) //Copy items
    tempItems[index].text = value //Assign updated
    await updateList(list, tempItems)

}

async function changeChecked(obj, id, index) {
    const bool = $(obj).prop("checked")
    const list = workspace.lists.find(el => el._id == id)
    let tempItems = JSON.parse(JSON.stringify(list.items)) //Copy items
    tempItems[index].checked = ""+bool
    await updateList(list, tempItems)
}

async function addItem(ev, obj, id) {
    ev.preventDefault()
    const list = workspace.lists.find(el => el._id == id)
    console.log(list)
    const value = $(obj).children(".form-control").val()
    let tempItems = JSON.parse(JSON.stringify(list.items))

    tempItems.push({
        text: value,
        checked: "false"
    })

    await updateList(list, tempItems)
}

async function changeTitle(ev, obj, id) {
    ev.preventDefault()
    const value = $(obj).children(".form-control").val()
    const list = workspace.lists.find(el => el._id == id)

    await updateList(list, undefined, title = value)
}

async function deleteItem(id, index) {
    const list = workspace.lists.find(el => el._id == id)
    let tempItems = JSON.parse(JSON.stringify(list.items))
    tempItems.splice(index,1)

    await updateList(list, tempItems, undefined)
}

async function addListToWorkspace(ev, obj) {
    console.log(workspace_id)
    ev.preventDefault()
    const listTitle = document.querySelector("#list_name")

    const res = await fetch(`/api/workspaces/${workspace_id}/addList`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: listTitle.value
        })
    }).then(res => res.json())

    if(res.status == "error") {
        displayBanner(res.error)
        return
    }

    await fetchData(workspace_id)
    displayLists()
    displaySuccess("Successfully added list")
    hidePopup()
    listTitle.value = ""
}

async function updateList(list, items = list.items, title = list.title) {

    console.log(title)

    items.forEach(el => {
        el.checked = ""+el.checked
    })

    const res = await fetch(`/api/todolists/${list._id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items: items,
            title: title
        })
    }).then(res => res.json())

    if(res.status == "error") {
        displayBanner(res.error)
    }

    list.items = res.data.items
    list.completion = res.data.completion
    list.title = res.data.title
    displayLists()
}

async function removeList(id) {
    const res = await fetch(`/api/todolists/${id}`, {
        method: "DELETE"
    }).then(res => res.json())

    if(res.status == "error") {
        displayBanner(res.error)
    }

    await fetchData(workspace_id)
    displayLists()
    displaySuccess(res.data)
}


init_workspace()