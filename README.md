# ChatYuk
This is an chat app build with socket, express and vue(frontend), and github auth, for layouting using bulma css

## Demo
Screenshot
![Login](https://raw.githubusercontent.com/dicka88/chatyuk/master/assets/preview_login.png)
![Home](https://raw.githubusercontent.com/dicka88/chatyuk/master/assets/preview_home.png)

[DEMO](https://chatyukkuy.herokuapp.com)

## Installation
1. Install all dependencies
	```bash
	npm i
	```
2. Setup the .env variable
	```markdown
	# postgresql setup
	DB_HOST=localhost
	DB_PORT=5432
	DB_USER=yourdbuser
	DB_PASS=yourdbpass
	DB_DATABASE=yourdbname
	# Github 0Auth setup
	GITHUB_CLIENT_ID=yourgithubclientid
	GITHUB_CLIENT_SECRET=yourgithubclientsecret
	# app setup
	PORT=3000
	```
3. Start using nodemon
	```bash
	npm run nodemon
	```
4. or not using nodemon(basic)
	```bash
	npm run start
	```
5. open your browser localhost:3000 and lets chatting

## NPM Package
```js
{
	"axios": "^0.19.2",
	"body-parser": "^1.19.0",
	"cookie-parser": "~1.4.4",
	"debug": "~2.6.9",
	"dotenv": "^8.2.0",
	"ejs": "~2.6.1",
	"express": "~4.16.1",
	"express-session": "^1.17.0",
	"http-errors": "~1.6.3",
	"morgan": "~1.9.1",
	"path": "^0.12.7",
	"pg": "^7.18.1",
	"sequelize": "^5.21.4",
	"socket.io": "^2.3.0"
}
```
## Deploy
	Deploy to heroku app
	1. first make an postgresql adds
	2. create schema 'chatyuk'
	3. deploy the app using github
	4. done, migration will auto generate when app start

## Thanks
	For read this readme

