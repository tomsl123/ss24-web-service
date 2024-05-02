import createError from 'http-errors';
import express from 'express';
import bodyParser from 'body-parser';
import indexRouter from './routes/index.js';
import * as apiRouter from './routes/avatars.router.js';
import * as userRouter from './routes/users.router.js';
import jwt from 'jsonwebtoken'

const app = express();

// view engine setup
app.set('views', './src/views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./src/public'));

// ORDER MATTERS!!! Passport authentication is broken otherwise!
app.use('/', indexRouter);
app.use('/api', userRouter.router);
app.use('/api', apiRouter.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;