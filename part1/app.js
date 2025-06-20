var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mysql = require('mysql12');
const db = mysql.createDb({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
});

const promiseDb = db.promise();
module.exports.promiseDb = promiseDb;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

//Question6
app.get('/api/walkrequests/open', async (req, res) => {
    try {
        const query = 'SELECT d.name as dag_name. d.size, u.username as owner_usernsme FROM Dogs d JOIN Users u ON d.owner_id = u.user_id ORDER BY d.name';
        const [rows] = await promiseDb.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching open walk requests:', error);
        res.status(500).json({ error: 'Failed to fetch open walk requests' });
    }
});

//Question7
app.get('/api/walkrequests/open', async (req, res) => {
    try {
        const query = 'SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location, u.username AS owner_username FROM WalkRequests wr JOIN Dogs d ON wr.dog_id = d.dog_id JOIN Users u ON d.owner_id = u.user_id WHERE wr.status = "open" ORDER BY wr.requested_time';
        const [results] = await promiseDb.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching open work requests', error);
        res.status(500).json({ error: 'Failed to fetch open walk requests'});
    }
});

//Question8
app.get('/api/walkers/summary', async (req, res) => {
    try {
        const query = 'SELECT u.user_id walker_username, COUNT (r.reating) AS total_ratings, AVG(r.rating) AS average_rating,COUNT (CASE WHEN wr.status = "accepted" AND wr.status = "completed" THEN 1 END) AS completed_walks FROM Users u LEFT JOIN WalkApplicatios wa ON u.user_id = wa.walker_id AND wa.status = "accpected" LEFT JOIN WalkRequests wr ON wa.request_id = wr.request_id LEFT JOIN Walk';
    } catch (error) {
        console.error("database error", error);
        res.status(500).json({ error: 'Failed to fetch walker summary' });
    }
});