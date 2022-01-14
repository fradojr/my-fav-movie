require('dotenv').config();

global.CustomError = require('./app/functions/CustomError');

const helmet = require('helmet');
const express = require('express');
const compression = require('compression');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { cors } = require('./app/middlewares/cors');
const { errorHandler } = require('./app/functions/errorHandler');
const cookieSession = require('cookie-session')
const session = require('express-session')
const cookieParser = require('cookie-parser')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(cors);
app.use(cookieParser())

app.use(cookieSession({
  name: 'session',
  keys: 'bukitvista',
  maxAge: 24 * 60 * 60 * 1000
}))

const routes = require('./app/routes/index');

routes.map((x) => app.use(x.basePath, x.router));

app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'bukitvista',
    resave: true,
    saveUninitialized: true,
  })
)

app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  console.log('sesi: ', res.locals.currentUser)
  next();
});

app.use(express.static('public'));

app.use((err, req, res, next) => { errorHandler(err, req, res, next); });

app.use((req, res) => {
  res.status(404)
    .json({
      code: 404,
      message: 'Not found',
      success: false,
      data: [],
    });
});

const server = app.listen(process.env.PORT || 3000, () => {
  const host = server.address().address;
  const { port } = server.address();

  console.log(`App listening at ${host}:${port}`);
});
