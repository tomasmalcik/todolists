workspaces = []

const fetchData = async () => {
  res = await fetch('/api/workspaces', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => res.json())
  console.log(res)
  workspaces = res.data
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

async function init_workspaces() {
  //Fetch workspaces - has to be async, takes some time
  await fetchData()
  
  //check if any workspaces were found
  if (workspaces.length != 0) {
    //Handle loading

    //hide no_work
    $(".no-work").hide()

    displayWorkspaces()
  }

  //Load user
  user = JSON.parse(window.localStorage.getItem("user_data"))
  setUserOptions(user)


  //set listener for adding workspace
  const addWorkspaceForm = document.querySelector("#addWorkspace")

  addWorkspaceForm.addEventListener("submit", async (ev) => {
    ev.preventDefault()

    //get name of workspace
    let wName = document.querySelector("#workspace_name")
    let wDescription = document.querySelector("#workspace_description")

    //Try to submit
    let res = await fetch('/api/workspaces', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: wName.value,
        author: user._id,
        description: wDescription.value
      })
    }).then(res => res.json())

    if(res.status == 'error') {
      displayBanner(res.error)
      return
    }else if(res.status == 'success') {
      await fetchData()
      hidePopup()
      wName.value = ""
      wDescription.value = "" 
      displayWorkspaces()
      displaySuccess(res.data)
    }

  })
}

function displayWorkspaces() {
  $(".no-work").hide()
  let innerHTML = ""
    workspaces.forEach(element => {
      innerHTML += Workspace(element.title, element.description, element._id)
    });
    $("#workspaces").html(innerHTML)
}

function setUserOptions(user) {
  const user_panel = document.querySelector(".usr")
  const name = document.querySelector(".usr-dropdown h6")
  user_panel.style.backgroundImage = "url("+user.avatar+")"
  name.textContent = user.username + " " + user.usersurname
}

function addWorkspace() {
  //set visibility of all children to none, display only .addWorkspace using jQuery
  $(".popup").children().hide()
  $(".addWorkspace").show()
  
  //show popup
  displayPopup()
}

function gotoWorkspace(ev, id) {
  if (ev.target.classList[0] != "actions" || ev.target.classList[0] != "fas") {
    window.location.href = `/workspaces/${id}`
  }
}

function showModal(e, id) {
  e.stopPropagation();
  $(".popup").children().hide()
  $(".modal-window").show()

  //addEventListener to "yes"
  document.getElementById("deleteWorkspace").setAttribute("onClick","deleteWorkspace('"+id+"')")
  //show popup
  displayPopup()
}

async function deleteWorkspace(id) {
  const res = await fetch(`/api/workspaces/${id}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }      
  }).then(res => res.json())

  if(res.status == "error") {
    displayBanner(res.error)
  }else if(res.status == "success") { //Successfully deleted
    await fetchData()
    hidePopup()
    if(workspaces.length == 0) {
      $(".no-work").css("display","flex")
      $("#workspaces").html("")
    }else {
      displayWorkspaces()
    }
    displaySuccess(res.data)
  }
}

async function exportWorkspace(e, id) {
  e.stopPropagation();
  const res = await fetch(`/workspaces/${id}/json`, {
    method: "GET"
  }).then(res => res.json())

  if(res.status == "error") {
    displayBanner(res.error)
    return
  }


  $(".popup").children().hide()
  //add to textarea
  $("#jsonExport").html(JSON.stringify(res, undefined, 4))
  $(".raw").attr("onclick",`window.open("/workspaces/${id}/json", "_blank")`)
  $(".export-window").show()
  
  displayPopup()
}

function copyToClipboard() {
  var copyText = document.getElementById("jsonExport");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  document.getElementById("hintText").innerHTML = "Copied!"
}

function outFunc() {
  document.getElementById("hintText").innerHTML = "Copy to clipboard"
}

function openImport() {
    $(".popup").children().hide()
    $(".import-window").show()
    displayPopup()
}

async function handleImport(ev) {
    ev.preventDefault()

    const importJSON = document.querySelector("#jsonImport")
    const parsedJSON = JSON.parse(importJSON.value, undefined, 4)

    const res = await fetch("/api/workspaces/import", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedJSON)
    }).then(res => res.json())

    if(res.status == 'error') {
        displayBanner(res.error)
    }

    //Successfully imported
    await fetchData().then(() => {
        displayWorkspaces()
        importJSON.value = ""
        hidePopup()
        displaySuccess(res.data)
    })
    


    
}

function openEdit(e, id) {
    e.stopPropagation();
    //Find element by id
    let curr_workspace = workspaces.find(x => x._id == id)
    document.querySelector("#e_workspace_name").value = curr_workspace.title
    document.querySelector("#e_workspace_description").value = curr_workspace.description
    document.querySelector("#editWorkspace").addEventListener("submit", (ev) => {
        handleEdit(ev, id)
    })
    $(".popup").children().hide()
    $(".edit-workspace").show()
    displayPopup()
}

async function handleEdit(ev, id) {
    ev.preventDefault()
    const title = document.querySelector("#e_workspace_name")
    const description = document.querySelector("#e_workspace_description")
    const res = await fetch(`/api/workspaces/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title.value,
            description: description.value
        })
    }).then(res => res.json())

    if(res.status == "error") {
        displayBanner(res.error)
        return
    }

    //Successfully updated
    await fetchData().then(() => {
        displayWorkspaces()
        hidePopup()
        displaySuccess(res.data)
    })


}

init_workspaces()