const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');




const app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
    origin: 'http://localhost:63342'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/quiz', async (req, res) => {
    const answers  = req.body;
    let score = 0
    console.log(answers);
    if (answers.q6v1 === undefined && answers.q6v2 === "q6v2" && answers.q6v3 === "q6v3")  {
        score++
    }
    else if(answers.q1 === 1) {
        score++
    }
    else if(answers.q2v1 === undefined && answers.q2v2 === "q2v2" && answers.q2v3 === undefined)  {
        score++
    }
    else if(answers.q3 === "Math.ceil()") {
        score++
    }
    else if(answers.q4v1 === undefined && answers.q4v2 === "q4v2" && answers.q4v3 === undefined)  {
        score++
    }
    res.send(score + '<a href="/">back</a>');
});



app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});