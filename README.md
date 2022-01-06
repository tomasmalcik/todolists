# ToDo Lists
This project is written in **nodeJS** Using **express** and **ejs**
It uses MongoDB via mongoose as database. Each function has comment explaining its usage

## description of project

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
### FrontEnd
#### JS 
#### JQuery
#### CSS + Bootstrap
#### Icons

## Quick guide