# Testing
- URL to site: [https://todolist-malcik.herokuapp.com/](https://todolist-malcik.herokuapp.com/)
- URL to workspace JSON: [https://todolist-malcik.herokuapp.com/workspaces/61d81711273068264c3898c4/json](https://todolist-- malcik.herokuapp.com/workspaces/61d81711273068264c3898c4/json)
- URL to list JSON: [https://todolist-malcik.herokuapp.com/todolists/61d8171e273068264c3898c9/json](https://todolist-malcik.herokuapp.com/todolists/61d8171e273068264c3898c9/json)

## Login information
email: semestralWEA@semestralWEA.com
password: semestralWEA
# ToDo Lists
This project is written in **nodeJS** Using **express** and **ejs**
It uses MongoDB via mongoose as database. Each function has comment explaining its usage

## Technical description

### Security
In this project I tried to protect against multiple types of attacks. Every route that should be protected is secured by [middleware](https://github.com/tomasmalcik/todolists/blob/master/private/middlewares/users.js#L6). That ensures that user is logged in.
#### JWT
This project uses [Json Web Tokens](https://jwt.io/) as a form of user authentification. This token is passed from API to frontend and stored in httpOnly cookie. (Not correct solution, but it was the only solution that I could come up with).
#### XSS
Project has [this middleware](https://github.com/tomasmalcik/todolists/blob/master/server.js#L39), that removes scripts from the whole request body. Tested this with [xss-payload-list](https://github.com/payloadbox/xss-payload-list). I do not claim this project is XSS bulletproof, but it can defend agains most popular xss attacks.
#### Validation
Each request that has body in it, is validated before any code that could potentionaly be hazardous is ran. I used [joi](https://joi.dev/) for validation and custom error messages. [quick link to validations](https://github.com/tomasmalcik/todolists/blob/master/private/js/logic/validate.js)

### API
This project uses MVC model on backEnd. It is split to
- Model
    - Used for mongoose schemas
- View
    - Displaying frontend pages from routes
- Controller (routes)
    - Houses every route on website (frontEnd and backEnd).
#### REST
BackEnd uses REST architecture. Each API call is categorized to these actions:
- GET
    - Collect any data from API. Returning JSON objects. 
- POST
    - Add new document to database
- PUT
    - Update already created document
- DELETE
    - Delete document
### FrontEnd
Project uses [EJS](https://ejs.co/) as an framework for displaying frontend of application. Each page is controlled by javascript and styled with CSS using [bootstrap](https://getbootstrap.com/) as grid tool. These pages have mostly html in them. EJS scripting is used only to include links based on URL.
#### JS
Javascript files are located in the [js](https://github.com/tomasmalcik/todolists/tree/master/private/js) Folder. This folder houses components, handler for JWT and [logic](https://github.com/tomasmalcik/todolists/tree/master/private/js/logic) folder. This one is the most important one. Each file has set of functions that makes the whole page function. From visual functions to API calls.
#### JQuery
JQuery is used mostly for visual in this application. Sometimes it is used for locating elements and toggling classes in the DOM
#### CSS + Bootstrap
Styling is an important part of this project. The whole project is set up to be appealing to the eye of user. Not too many colors, but nonetheless good looking.
#### Icons
[Font Awesome](https://fontawesome.com/) was used for icons. Only the free version icons were implemented in the application

## Quick guide
Quick guide on how to use this project explained in a few steps. Application is build around being intuitive. Each icon represents what it really does. Also some tooltips are present.
### Registration and Login
After opening the [website](), a login form is shown. If you already have an account you can proceed to the next step. If not, you can [click this link]() to go straight to registration, or click on the "Sing Up" link in the bottom part of login form. After registrating or loggin in you get redirected to workspaces.
### Workspaces
#### Creating a workspace
This part is used for creating multiple projects(workspaces). If you don't have any workspace yet, you can click on the button in the middle of the page, or you can use the link in the sidebar on the left side. After clicking that a modal window pops up, where you can specify the name and description of project(workspace).
#### Export, Edit, Delete
After creating one, these three actions become available. They are represented by icons inside the workspace, on the bottom part of it.
- First one specifies **export** function - It generates a JSON file that you can copy or display in the raw form.
- Second one is for editing - after clicking it, the same modal as for adding pops up, there you can edit the name and description.
- Third one is for deleting the whole workspace. After clicking it, modal that asks you whether you really want to delete this or not.
#### Import
After you export a workspace. You can send it to someone, who can import it and start using it. Click the **Import workspace** and paste in copied JSON and click import.
### Workspace(Lists)
Each list shows you completion of tasks with the bar on the top of each list.
#### Add
Similar to workspaces, if there is no list present, you can click the button in the middle, or the one in the left sidebar. After that, modal pops up where you specify the name of list.
#### Edit, Export, Delete
These actions are also similar, but this time they are located on the top.
- First one is editing the name of list.
- Second one is exporting the list.
- Third one is deleting the list.
#### Import
You can also import just lists alone. If someone shared a list with you, just click **Import List** in the left sidebar and paste in the JSON you got.
#### Adding to list, editing items, deleting them
- You can add elements by clicking the **+** button at the bottom of list. After filling in the text, press **enter** to save.
- If you want to edit those items, click the **pen** Icon on the right side of item and after entering the correct text, press **enter** to save it.
- You can delete the item by pressing the **thrash can** icon on the right side of item. 
### List Filter
If you want to filter out lists that are completed or not started or ongoing, you can do so by clicking the **filter** icon on the top right.
After clicking it, you can choose from 4 filters. Current filter is always specified by the pink color of text.
### Profile
In here you can edit your avatar, name and change your security settings - email and password.
#### General settings
Displayed when loading profile. There are two blocks present.
- First one lets you choose a different avatar. You can upload it with the input on the right and then post it to application with the button underneath. Change is applied as soon as it gets response from the server.
- Second one lets you change your name and surname.
#### Security settings
You can get here by clicking the link in the left sidebar. This one also contains two blocks.
- First one is for changing password. You have to fill in your old one, then new one and match it one more time, just to be sure you entered the right password.
- Second one is for changing email. You have to again fill in your password, then specify your new email. Be careful, by changing this you change your login information, so remember it well.
