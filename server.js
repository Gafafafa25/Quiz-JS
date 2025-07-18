const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const string_decoder = require("node:string_decoder");


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

const {Pool} = require('pg');

const pool = new Pool({
    host: "localhost",
    user: "myuser",
    password: "mypassword",
    database: "quiz"
});


//json from db
const _data = {
    "questions": [
        {
            "id": "1",
            "text": "2+2=?",
            "type": "text", //radio, text, checkbox, select
            "options": []
        },
        {
            "id": "3",
            "text": "What command print to the console?",
            "type": "radio",
            "options": ["console.log", "console.print", "alert"]
        },
        {
            "id": "4",
            "text": "What command will return the value rounded up to the nearest integer?",
            "type": "text",
            "options": []
        },
        {
            "id": "5",
            "text": "Select method for the string only",
            "type": "radio",
            "options": ["slice()", "replace()", "toLowerCase()"]
        },
        {
            "id": "6",
            "text": "Select method to add a new element in an array",
            "type": "select",
            "options": ["push()", "pop()", "shift()"]
        },
        {
            "id": "9",
            "text": "Select Boolean data type",
            "type": "checkbox",
            "options": ["btype", "YES / NO", "TRUE / FALSE"]
        }
    ]
}

app.get('/questions', async function (req, res) {
    try {
        const result = await pool.query('SELECT * FROM Questions');
        console.log(result)
        const data2 = result.rows;
        for (let i = 0; i < data2.length; i++) {
            data2[i].options = data2[i].options.split(";")
            data2[i].right_answer = ""
        }
        console.log(data2);
        res.json(data2);
        // res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
    // res.json(data.questions);
})

app.post('/quiz', async (req, res) => {
    const answers = req.body;
    let score = 0
    console.log(answers);

    try {
        // const result = await pool.query('SELECT * FROM questions');
        // for (let i = 0; i < data2.length; i++) {
        //     data2[i].options = data2[i].options.split(";")
        //     data2[i].right_answer = ""
        // }
        // for()
        // console.log();
        // res.json(data2);
        // res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }

    // if (answers.q9v1 === undefined && answers.q9v2 === "q9v2" && answers.q9v3 === "q9v3") {
    //     score++
    // }
    // if (answers.q1 === "4") {
    //     score++
    // }
    // if (answers.q3 === "console.log") {
    //     score++
    // }
    // if (answers.q4 === "Math.ceil()") {
    //     score++
    // }
    // if (answers.q5 === "toLowerCase()") {
    //     score++
    // }
    // if (answers.q6 === "push()") {
    //     score++
    // }
    res.send('<link rel="stylesheet" href="styles.css">' + '<span class="total">Total:</span>' + score + '<br>' + '<a href="/" class="back">back</a>');
});

app.post('/addQuestion', async (req, res) => {
    const answers = req.body;
    console.log(answers);
    //запрос в базу
    try {
        const result = await pool.query("INSERT INTO Questions VALUES ($1, 'text', '-', $2, DEFAULT)", [answers.questionText, answers.answerText]);
        // res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
    res.send('ok' + '<a href="/add.html" class="back">back</a>')
})


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});