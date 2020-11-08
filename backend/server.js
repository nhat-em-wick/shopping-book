require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "public/uploads" });
const path = require("path");
const session = require("express-session");
const MongoDbStore = require("connect-mongo")(session);
const cors = require("cors");
const limiter = require('./middleware/rateLimitRequest')
const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const flash = require('express-flash')
const urlDB =  process.env.DB_CONNECTION
mongoose.connect(urlDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Connection failed...");
  });

const routeUser = require("./routes/user.route");
const productRoute = require("./routes/product.route");
const routeCart = require("./routes/cart.route");
const routeOrder = require("./routes/order.route");
const limitRequest = require('./middleware/rateLimitRequest');
const sessionLocals = require('./middleware/sessionLocals');
const setHeader = require('./middleware/setHeader');
const app = express();
const Emitter = require('events')

app.use(express.static(path.join(`${__dirname},/../public`)));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.set("views","./frontend")
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(cookieParser());
app.use(methodOverride("_method"));

//event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter)
// Session store
let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    store:mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
  })
);
app.use(sessionLocals);
app.use(setHeader);

app.use(limitRequest.limiterServer);
app.use(flash())

app.get('/', (req, res) => {

  res.render('index');
});

app.use('/', routeUser);
app.use('/', productRoute);
app.use('/', routeCart);
app.use('/', routeOrder);

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Server start on ${port}`);
});
// socket.io
const io = require('socket.io')(server)
io.on('connection', (socket)=>{
  
  socket.on('join', (orderId)=>{
    socket.join(orderId)
  })
})

eventEmitter.on('orderUpdated', (data)=>{
  io.to(`order_${data.id}`).emit('orderUpdated', data);
})