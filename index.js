const express = require('express');
const radarRoutes = require('./routes/radarRouter');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/radar', radarRoutes);

app.use('*', (req, res, next) => {
    const err = new Error('undefined route');
    err.statusCode = 404;
    err.status = 'fail';
    next(err, req, res, next);
});

app.use(globalErrorHandler);

app.listen(8888, () => {
    console.log('Application is listening on port 8888');
});