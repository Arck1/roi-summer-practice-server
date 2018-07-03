const path = require('path');
const fs = require("fs");
const express = require('express');
const _ = require('underscore');
const app = express();

const PORT = 80;

app.use(express.static(path.join(__dirname, "public")));

var rooms = JSON.parse(fs.readFileSync("rooms_data.json"));
var projects = JSON.parse(fs.readFileSync("projects_data.json"));
var users = [];




app.get('/api/rooms', function (req, res) {
    let answer = [];
    if (req.query.name) {
        rooms.Rooms.forEach((el) => {
            if (!req.query.name || !el.Name || el.Name.toLocaleLowerCase().includes(req.query.name.toLocaleLowerCase())) {
                answer.push(el);
            }
        });
    }
    else {
        answer = rooms.Rooms;
    }
    res.send({"Rooms": answer});
});

app.get('/api/projects', function (req, res) {
    let answer;
    if (Object.keys(req.query).length > 0) {
        answer = [];
        projects.Projects.forEach((el) => {

            if ((!req.query.id || !el.Id || req.query.id === el.Id)
                && (!req.query.name || !el.Name || el.Name.toLocaleLowerCase().includes(req.query.name.toLocaleLowerCase()))) {
                answer.push(el);
            }
        });
        answer.sort((a, b) => {
            return a.Id - b.Id;
        });

    }
    else {
        answer = projects.Projects;
        answer.sort((a, b) => {
            return a.Id - b.Id;
        });
    }
    res.send({"Projects": answer});
});

app.get('/api/users', function (req, res) {
    let answer = [];
    rooms.Rooms.forEach((el) => {
        if (el.Users) {
            users = _.union(users, el.Users);
        }
    });
    users.sort((a, b) => {
        return a.Id - b.Id;
    });

    if (Object.keys(req.query).length > 0) {
        users.forEach((el) => {

            if ((!req.query.id || parseInt(req.query.id) === el.Id)
                && (!req.query.name || !el.Name || el.Name.toLocaleLowerCase().includes(req.query.name.toLocaleLowerCase()))
                && (!req.query.email || !el.Email || el.Email.toLocaleLowerCase().includes(req.query.email.toLocaleLowerCase()))
                && (!req.query.skype || !el.Skype || el.Skype.toLocaleLowerCase().includes(req.query.skype.toLocaleLowerCase()))
                && (!req.query.grade || !el.Grade || el.Grade.toLocaleLowerCase().includes(req.query.grade.toLocaleLowerCase()))) {
                answer.push(el);
            }
        });

        answer.sort((a, b) => {
            return a.Id - b.Id;
        });
    } else {
        answer = users;
    }
    res.send({"Users": answer});
});

app.get('/docs', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/docs.html'));
});

app.get('/images', function (req, res) {
    let files = fs.readdirSync(path.join(__dirname + '/public/images/'));
    let baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let answer = [];

    answer = files.map((x) => ({"name": x.substr(0, x.lastIndexOf(".")),
                                "type": x.substr(x.lastIndexOf(".")+1),
                                "url": baseUrl + x}));

    res.send(answer);
});

app.use(function(req, res, next){
    res.status(404);
    res.send({ error: 'Not found' });
});

app.listen(PORT);