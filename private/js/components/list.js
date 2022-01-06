function List(title, items, completion, id) {
    state = ""
    innerHTML = `
    <div class="list col-lg-6 ${ (completion > 0) ? ((completion == 100) ? "finished" : "ongoing") : "notStarted"  } ">
    <div class="innerContent">
        <div class="progressbar">
            <div class="currentProgress" style="width: ${completion}%"></div>
        </div>
    
        <h3><span>${title}</span>
        <form style="display: none" onsubmit="changeTitle(event, this, '${id}')">
            <input class="form-control" type="text" name="update" value="${title}" />
            <input type="submit" style="display: none;" />
        </form>
        <div class="list-actions">
                <i onclick="openChangeName(this)" class="fas fa-pen"></i>
                <i onclick="exportList('${id}')" class="fas fa-file-export"></i>
                <i onclick="removeList('${id}')" class="fas fa-trash-alt"></i>
            </div>
        </h3>
        <div class="items">
            ${createItems(items, id)}
            <div onclick="openAddItem(this)" class="add-item"> + </div>
            <form style="display: none" onsubmit="addItem(event, this, '${id}')">
            <input class="form-control" type="text" name="update" value="" />
            <input type="submit" style="display: none;" />
        </form>
        </div>
    </div>
    </div>
    `
    return innerHTML
}

function createItems(items, id) {
    let innerHTML = ""
    let counter = 0 //Index for orientation in JSON
    items.forEach(element => {
        checked = (element.checked) ? "checked='true'" : ""
        innerHTML += `
        <div class="item">
            <label class="input-container">
                <input onclick="changeChecked(this, '${id}', ${counter})" type="checkbox" ${checked} />
                <span class="checkmark"></span>
            </label>
            <span>${element.text}</span>
            <form style="display: none" onsubmit="handleEdit(event, this, '${id}', ${counter})">
                <input class="form-control" type="text" name="update" value="${element.text}" />
                <input type="submit" style="display: none;" />
            </form>
            <div class="item-actions">
                <i onclick="editItem(this)" class="fas fa-pen"></i>
                <i onclick="deleteItem('${id}', ${counter})" class="fas fa-trash-alt"></i>
            </div>
        </div>`
        counter += 1
    });
    return innerHTML
}

