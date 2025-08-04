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
    console.log(answers);

    let result;
    try {
        result = await pool.query('SELECT * FROM questions');

        console.log(result)
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }

    //проверка ответов
    //answers.userLogin
    let score = 0
    for (const prop in answers) {
        if (isKeyQuestion(prop)) {
            let qId = +prop.slice(1)
            for (const q of result.rows) {
                if (q.id === qId) {
                    if (q.right_answer === answers[prop]) {
                        score++
                    }
                }
            }
        }
    }

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

app.post('/addQuestionRadio', async (req, res) => {
    const d = req.body;
    console.log(d);
    const options = `${d.fieldOfOption1};${d.fieldOfOption2};${d.fieldOfOption3};${d.fieldOfOption4}`;
    let rightOption = ""
    if (d.rightOption === "v1") {
        rightOption = d.fieldOfOption1
    } else if (d.rightOption === "v2") {
        rightOption = d.fieldOfOption2
    } else if (d.rightOption === "v3") {
        rightOption = d.fieldOfOption3
    } else if (d.rightOption === "v4") {
        rightOption = d.fieldOfOption4
    }
    //запрос в базу
    try {
        const result = await pool.query("INSERT INTO Questions VALUES ($1, 'radio', $2, $3, DEFAULT)",
            [d.questionText, options, rightOption]);
        // res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
    res.send('ok' + '<a href="/addRadio.html" class="back">back</a>')
})

app.post('/addQuestionCheckbox', async (req, res) => {
    const d = req.body;
    console.log(d);
    const options = `${d.fieldOfOption1};${d.fieldOfOption2};${d.fieldOfOption3};${d.fieldOfOption4}`;
    let rightOption = ""
    for (const x of d.rightOption) {
        if (x === "v1") {
            rightOption += d.fieldOfOption1 + ";"
        } else if (x === "v2") {
            rightOption += d.fieldOfOption2 + ";"
        } else if (x === "v3") {
            rightOption += d.fieldOfOption3 + ";"
        } else if (x === "v4") {
            rightOption += d.fieldOfOption4 + ";"
        }
    }
    rightOption = rightOption.slice(0, rightOption.length - 1);
    //запрос в базу
    try {
        const result = await pool.query("INSERT INTO Questions VALUES ($1, 'checkbox', $2, $3, DEFAULT)",
            [d.questionText, options, rightOption]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
    res.send('ok' + '<a href="/addCheckbox.html" class="back">back</a>')
})

app.post('/addQuestionSelect', async (req, res) => {
    const d = req.body;
    console.log(d);
    const options = `${d.fieldOfOption1};${d.fieldOfOption2};${d.fieldOfOption3};${d.fieldOfOption4}`;
    let rightOption = ""
    if (d.rightOption === "v1") {
        rightOption = d.fieldOfOption1
    } else if (d.rightOption === "v2") {
        rightOption = d.fieldOfOption2
    } else if (d.rightOption === "v3") {
        rightOption = d.fieldOfOption3
    } else if (d.rightOption === "v4") {
        rightOption = d.fieldOfOption4
    }
    //запрос в базу
    try {
        const result = await pool.query("INSERT INTO Questions VALUES ($1, 'select', $2, $3, DEFAULT)",
            [d.questionText, options, rightOption]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
    res.send('ok' + '<a href="/addSelect.html" class="back">back</a>')
})

app.post('/addStudent', async (req, res) => {
    const d = req.body;
    console.log(d)
    //запрос в базу
    try {
        const result = await pool.query("INSERT INTO Students VALUES (DEFAULT, $1, $2, $3)", [d.studentLogin, d.studentName, d.studentLastname]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
    res.send('ok' + '<a href="/addStudent.html" class="back">back</a>')
})


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});


//functions
const isKeyQuestion = (key) => {
    if (key.length === 0 || key[0] !== "q") {
        return false;
    }
    ;
    for (let i = 1; i < key.length; i++) {
        if (key[i] < '0' || key[i] >= '9') {
            return false;
        }
    }
    return true;
}