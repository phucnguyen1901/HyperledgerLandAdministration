

const express = require('express');
const homeController = require('./controller/homeController')
const path = require('path');

const expressLayout = require('express-ejs-layouts');
const userController = require('./controller/userController');
const session = require('express-session')
const flash = require('express-flash')

const authMiddleware = require('./middlewares/auth.middleware')

const app = express();

app.use(
  session({
    secret: "OK",
    resave: false,
    // store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLayout);



app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.noty = req.session.noty;
  next();
});

app.set("layout signin", false);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");


app.use(express.static(__dirname + '/public'));

app.get('/detail/:key',authMiddleware.requireAuth,homeController().detail)
app.get('/',authMiddleware.requireAuth,homeController().index)
app.post('/handleAddAsset',homeController().handleAddAsset)
app.get('/addAsset',authMiddleware.requireAuth,homeController().addAsset)

app.get('/login',userController().login)
app.get('/register',userController().register)
app.post('/handleRegister',userController().handleRegister)
app.post('/handleLogin',userController().handleLogin)


app.get('/transferLand/:key',authMiddleware.requireAuth,homeController().transferLand)
app.post('/handleTransferLand',authMiddleware.requireAuth,homeController().handleTransferLand)

app.post('/logout',homeController().logoutUser)


app.get('/fast',userController().fast)


app.post('/processTransfer',authMiddleware.requireAuth,homeController().processTransfer)


app.get('/receiveLand',authMiddleware.requireAuth,homeController().receiveLand);
app.get('/transferLandOwner',authMiddleware.requireAuth,homeController().transferLandOwner);

app.get('/requestAllTransferLand',authMiddleware.requireAuth,homeController().transferAdmin)
app.get('/handleConfirmFromReceiver/:key',authMiddleware.requireAuth,homeController().handleConfirmFromReceiver);

app.get('/detailReceive/:userIdTransfer/:key',authMiddleware.requireAuth,homeController().detailReceive)

app.post('/updateStatusLandAdmin',authMiddleware.requireAuth,homeController().updateStatusLandAdmin)


app.post('/confirmTransferAdmin',authMiddleware.requireAuth,homeController().confirmTransferAdmin)

app.listen(3000,()=>console.log("Server started with port 3000"));











