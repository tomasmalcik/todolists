# ToDo Lists
This project is written in *nodeJS* Using *express* and *ejs*
It uses MongoDB via mongoose as database. Each function has comment explaining its usage

## Content of project

### Security
In this project I tried to protect against multiple types of attacks. Every route that should be protected is secured by [middleware](https://github.com/tomasmalcik/todolists/blob/master/private/middlewares/users.js#L6). That ensures that user is logged in.
#### JWT
This project uses [Json Web Tokens](https://jwt.io/) as a form of user authentification. This token is passed from API to frontend and stored in httpOnly cookie. (Not correct solution)
#### XSS
#### Validation
### API
#### REST
### FrontEnd
#### JS 
#### JQuery
#### CSS + Bootstrap
#### Icons

## Quick guide