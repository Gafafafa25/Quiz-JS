require('dotenv').config();
const {Pool} = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const string_decoder = require("node:string_decoder");


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/questions', async function (req, res) {
    try {
        const result = await pool.query('SELECT * FROM Questions WHERE is_removed = false');
        const data2 = result.rows;
        for (let i = 0; i < data2.length; i++) {
            data2[i].options = data2[i].options.split(";")
            data2[i].right_answer = ""
        }
        res.json(data2);
        // res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Database error');
    }
    // res.json(data.questions);
})

app.post('/checkStudent', async function (req, res) {
    console.log(new Date())
    console.log(req.body, req.body.studentLogin)
    try {
        const result = await pool.query("SELECT student_id FROM students WHERE login = $1", [req.body.studentLogin]);
        const data = result.rows;
        console.log(data, " +")
        res.json({data: data});
    } catch (err) {
        res.status(500).send('Database error');
    }
})

app.post('/quiz', async (req, res) => {
    const answers = req.body;
    console.log(answers)

    let result;
    try {
        result = await pool.query('SELECT * FROM questions');
        console.log(result);
    } catch (err) {
        res.status(500).send('Database error');
    }

    //проверка ответов
    //answers.userLogin
    let score = 0
    const answers2 = {}
    for (const prop in answers) {
        if (isKeyQuestion(prop)) {
            // console.log("p", prop)
            // let qId = prop.slice(1)
            let f = prop.includes("v")
            let qId = f ? prop.slice(1, prop.indexOf("v")) : prop.slice(1)
            let qValue = answers[prop]
            if (!(qId in answers2)) {
                answers2[qId] = qValue
                if (f) {
                    answers2[qId] += ";"
                }
            } else {
                answers2[qId] += qValue + ";";
            }
        }
    }
    for (let prop in answers2) {
        if (answers2[prop].endsWith(";")) {
            answers2[prop] = answers2[prop].slice(0, -1);
        }
    }

    for (const qId in answers2) {
        for (const questionData of result.rows) {
            if (+qId === questionData.id) {
                if (questionData.type !== 'checkbox') {
                    score += answers2[qId] === questionData.right_answer ? 1 : 0
                } else { //checkbox
                    const userAnswer = answers2[qId].split(";")
                    const correctAnswer = questionData.right_answer.split(";")
                    console.log(userAnswer, correctAnswer)
                    if (userAnswer.length !== correctAnswer.length) {
                        break
                    } else {
                        userAnswer.sort()
                        correctAnswer.sort()
                        let isTheSame = true
                        for (let i = 0; i < userAnswer.length; i++) {
                            if (userAnswer[i] !== correctAnswer[i]) {
                                isTheSame = false
                                break
                            }
                        }
                        if (isTheSame) {
                            score++
                        }
                    }
                }
                break
            }
        }
    }
    console.log(score)
    console.log(answers2)

    try {
        const result = await pool.query("INSERT INTO attempts VALUES (DEFAULT, $1, $2)", [answers.studentId, score]);
        // res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Database error');
    }
    res.send('<link rel="stylesheet" href="styles.css">' + '<span class="total">Total:</span>' + score + '<br>' + '<a href="/" class="back">back</a>');
});

app.post('/addQuestion', async (req, res) => {
    const answers = req.body;
    //запрос в базу
    try {
        const result = await pool.query("INSERT INTO Questions VALUES ($1, 'text', '-', $2, DEFAULT)", [answers.questionText, answers.answerText]);
    } catch (err) {
        res.status(500).send('Database error');
    }
    res.send('ok' + '<a href="/add.html" class="back">back</a>')
})

app.post('/removeQuestion', async (req, res) => {
    const answers = req.body;
    console.log(req.body)
    //запрос в базу
    try {
        const result = await pool.query("UPDATE Questions SET is_removed = true WHERE id = $1", [req.body.questionId]);
        console.log(result)
    } catch (err) {
        res.status(500).send('Database error');
    }
    res.json({status: 'success'});
})

app.post('/addQuestionRadio', async (req, res) => {
    const d = req.body;
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
        res.status(500).send('Database error');
    }
    res.send('ok' + '<a href="/addRadio.html" class="back">back</a>')
})

app.post('/addQuestionCheckbox', async (req, res) => {
    const d = req.body;
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
        res.status(500).send('Database error');
    }
    res.send('ok' + '<a href="/addCheckbox.html" class="back">back</a>')
})

app.post('/addCheckbox2', async (req, res) => {
    const d = req.body;
    const options = `${d.answerText1};${d.answerText2};${d.answerText3};${d.answerText4}`;
    let rightOptions = []
    console.log(d)
    for (const x of d.rightAnswer) {
        rightOptions.push(d["answerText" + x]); //todo: hardcode
    }
    console.log(rightOptions);
    //запрос в базу
    try {
        const result = await pool.query("INSERT INTO Questions VALUES ($1, 'checkbox', $2, $3, DEFAULT)",
            [d.questionText, options, rightOptions.join(";")]);
    } catch (err) {
        res.status(500).send('Database error');
    }
    res.send('ok' + '<a href="/addCheckbox2.html" class="back">back</a>')
})


app.post('/addQuestionSelect', async (req, res) => {
    const d = req.body;
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
        res.status(500).send('Database error');
    }
    res.send('ok' + '<a href="/addSelect.html" class="back">back</a>')
})

app.post('/addStudent', async (req, res) => {
    const d = req.body;
    //запрос в базу
    try {
        const result = await pool.query("INSERT INTO Students VALUES (DEFAULT, $1, $2, $3)", [d.studentLogin, d.studentName, d.studentLastname]);
    } catch (err) {
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
    for (let i = 1; i < key.length; i++) {
        if (key[i] < '0' || (key[i] > '9' && key[i] !== 'v')) {
            return false;
        }
    }
    return true;
}