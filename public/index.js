/*todo:
main: question table add column with question type!
1. to show only one question and button next +
2. mix up questions +
3. mix up  answers hw +
4. save to db +
5. ask student name and save to db
6. load questions from db +
7. admin dashboard:
    1)CRUD(create, read, update, delete) question
    2)show results
    3)add permissions for students (login, password, limit)
8. add right answers to json, but dont send it to the client+
9. check test results with db
*/

let data = {
    "questions": []
}

//запрос вопросов с сервера
fetch("/questions").then((response) => {
    return response.json();
}).then((questions) => {
    // console.log(data)
    data.questions = questions;
    createTest();
    let questionNumber = 0;
    const divQuestions = document.querySelectorAll(".q");
console.log(divQuestions);

    divQuestions[questionNumber].style.display = "block";

    const nextBtn = document.querySelector("#nextBtn")

    nextBtn.addEventListener("click", ()=> {
        divQuestions[questionNumber].style.display = "none";
        questionNumber++;
        if (questionNumber === data.questions.length -1) {
            document.querySelector("#submitBtn").style.display = "block";
            nextBtn.style.display = "none";
        }
        divQuestions[questionNumber].style.display = "block";
    }) ;

})

function getMixedArray(n) {
    const res = []
    for (let i = 0; i < n; i++) {
        res.push(i);
    }
    for (let i = 0; i < n * n; i++) {
        let i1 = Math.floor(Math.random() * n);
        let i2 = Math.floor(Math.random() * n);
        [res[i1], res[i2]] = [res[i2], res[i1]];
    }
    return res;
}



function createTest() {
    console.log(data)
    let newQuestion;
    // let k = 6
    my_form = document.getElementById("qBlock");

    const randomOrder = getMixedArray(data.questions.length);

    let questionNumber = 1
    for (let i = 0; i < data.questions.length; i++) {
        let question = data.questions[randomOrder[i]];
        // div.q
        newQuestion = document.createElement("div");
        newQuestion.className = "q";

        //p
        const newP = document.createElement("p");
        newP.innerHTML = questionNumber + ". " + question.question;
        newQuestion.appendChild(newP);
        questionNumber++
        //input
        let newInput, newLabel, newSelect, newOption;
        if (question.type === "text") {
            newLabel = document.createElement("label");
            newLabel.htmlFor = "q" + question.id;
            newLabel.innerText = "Answer";
            newInput = document.createElement("input");
            newInput.id = "q" + question.id
            newInput.name = "q" + question.id;
            newInput.type = "text";
            newQuestion.appendChild(newLabel);
            newQuestion.appendChild(newInput);
        } else if (question.type === "radio") {
            const randomOrderRadio = getMixedArray(question.options.length);
            for (let i = 0; i < question.options.length; i++) {
                newInput = document.createElement("input");
                newInput.type = "radio";
                const idText = "q" + question.id + "v" + (i + 1);
                newInput.id = idText;
                newInput.value = question.options[randomOrderRadio[i]];
                newInput.name = "q" + question.id;
                newQuestion.appendChild(newInput);


                newLabel = document.createElement("label");
                newLabel.innerText = question.options[randomOrderRadio[i]];
                newLabel.htmlFor = idText;
                newQuestion.appendChild(newLabel);

            }

        } else if (question.type === "select") {
            newSelect = document.createElement("select");
            newSelect.type = "select";
            newSelect.id = "q" + question.id;
            newSelect.name = "q" + question.id;
            newQuestion.appendChild(newSelect);
            const randomOrderSelect = getMixedArray(question.options.length);
            newOption = document.createElement("option");
            newOption.innerText = "-";
            newSelect.appendChild(newOption);
            for (let i = 0; i < question.options.length; i++) {
                newOption = document.createElement("option");
                newOption.innerText = question.options[randomOrderSelect[i]];
                newSelect.appendChild(newOption);
            }
        } else if (question.type === "checkbox") {
            const randomOrderCheckbox = getMixedArray(question.options.length);
            for (let i = 0; i < question.options.length; i++) {
                newLabel = document.createElement("label");
                const idText = "q" + question.id + "v" + (i + 1);
                newLabel.htmlFor = idText;
                newLabel.innerText = question.options[randomOrderCheckbox[i]];
                newQuestion.appendChild(newLabel);

                newInput = document.createElement("input");
                newInput.type = "checkbox";
                newInput.id = idText;
                newInput.name = idText;
                newInput.value = question.options[randomOrderCheckbox[i]];
                newQuestion.appendChild(newInput);
            }
        }
        // newQuestion.appendChild(newLabel);
        // newQuestion.appendChild(newInput);

        // вставка вопроса в форму
        my_form.appendChild(newQuestion);

        // if (--k === 0) {
        //     break
        // }
    }
}