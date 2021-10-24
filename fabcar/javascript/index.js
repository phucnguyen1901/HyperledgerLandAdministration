

const express = require('express');
const homeController = require('./controller/homeController')
const path = require('path');

const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const userController = require('./controller/userController');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLayout);
app.set("layout signin", false);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");


app.use(express.static(__dirname + '/public'));

app.get('/detail/:key',homeController().detail)
app.get('/',homeController().index)
app.post('/handleSubmit',homeController().handleSubmit)
app.get('/demoSubmit',homeController().demoSubmit)

app.get('/login',userController().login)
app.get('/register',userController().register)
// app.get('/handleRegister',userController().handleRegister)
app.post('/handleRegister',userController().handleRegister)
app.post('/handleLogin',userController().handleLogin)

app.listen(3000,()=>console.log("Server started with port 3000"));











