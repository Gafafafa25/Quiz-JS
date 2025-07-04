const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/quiz', async (req, res) => {
    const answers = req.body;
    let score = 0
    console.log(answers);
    if (answers.q6v1 === undefined && answers.q6v2 === "q6v2" && answers.q6v3 === "q6v3") {
        score++
    }
    if (answers.q1 === "1") {
        score++
    }
    if (answers.q2 === "console.log") {
        score++
    }
    if (answers.q3 === "Math.ceil()") {
        score++
    }
    if (answers.q4 === "toLowerCase()") {
        score++
    }
    if (answers.q5 === "push()") {
        score++
    }
    res.send(score + '<a href="/">back</a>');
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});