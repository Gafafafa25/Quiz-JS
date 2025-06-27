/*todo:
main: question table add column with question type!
1. to show only one question and button next
2. mix up questions
3. mix up  answers
4. save to db
5. ask student name and save to db
6. load questions from db
7. admin dashboard:
    1)CRUD(create, read, update, delete) question
    2)show results
    3)add permissions for students (login, password, limit)
*/

const data = {
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
            "options": ["", "push()", "pop()", "shift()"]
        },
        {
            "id": "9",
            "text": "Select Boolean data type",
            "type": "checkbox",
            "options": ["btype", "YES / NO", "TRUE / FALSE"]
        }
    ]
}


function createTest() {
    let newQuestion;
    for (const question of data.questions) {
        console.log(question)
        // div.q
        newQuestion = document.createElement("div");
        newQuestion.className = "q";

        //p
        const newP = document.createElement("p");
        newP.innerHTML = question.text;
        newQuestion.appendChild(newP);

        //input
        let newInput;
        if (question.type === "text") {
            newInput = document.createElement("input");
            newInput.type = "text";
        }
        else if (question.type === "radio") {
            newInput = document.createElement("input");
            newInput.type = "radio";
        }
        else if (question.type === "select") {
            newInput = document.createElement("select");
        }
        else if (question.type === "checkbox") {
            newInput = document.createElement("input");
            newInput.type = "checkbox";
        }
        newQuestion.appendChild(newInput);
    }
    // вставка вопроса в форму
    my_form = document.getElementById("form");
    my_form.appendChild(newQuestion);
}

createTest();