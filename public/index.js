/*todo:
main: question table add column with question type!
1. to show only one question and button next +
2. mix up questions +
3. mix up  answers hw +
4. save to db +
6. load questions from db +
7. admin dashboard:
    1)CRUD(create, read, update, delete) question
    2)show results
    3)add permissions for students (login, password, limit)
8. add right answers to json, but dont send it to the client+
*/

let data = {
    "questions": []
}


let questionNumber = 0;
let divQuestions, nextBtn;


document.addEventListener('DOMContentLoaded', async function () {
//запрос вопросов с сервера
    console.log("DOM")
    let response = await fetch("/questions")
    data.questions = await response.json();
    createTest();
    questionNumber = 0;
    divQuestions = document.querySelectorAll(".q");

    divQuestions[questionNumber].style.display = "block";

    nextBtn = document.querySelector("#nextBtn")

    nextBtn.addEventListener("click", nextQuestionHandler)
})

// function showCustomError(message) {
//     const overlay = document.getElementById("errorPopupOverlay");
//     const errorMessageElement = document.getElementById("errorMessage");
//
//     errorMessageElement.textContent = message; // Устанавливаем текст ошибки
//     overlay.style.display = "block"; // Делаем окно видимым
// }
//
// function hideCustomError() {
//     const overlay = document.getElementById("error-popup-overlay");
//     overlay.style.display = "none"; // Скрываем окно
// }


const nextQuestionHandler = () => {
    divQuestions[questionNumber].style.display = "none";
    questionNumber++;
    if (questionNumber === data.questions.length - 1) {
        document.querySelector("#submitBtn").style.display = "block";
        nextBtn.style.display = "none";
    }
    divQuestions[questionNumber].style.display = "block";

    startTimer()
}

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
            newLabel.className = "appearance-none mr-2 w-3 h-3";
            newInput = document.createElement("input");
            newInput.id = "q" + question.id
            newInput.name = "q" + question.id;
            newInput.type = "text";
            newInput.className = "appearance-none mr-1 px-0.5 border border-gray-400 bg-white";
            newQuestion.appendChild(newLabel);
            newQuestion.appendChild(newInput);
        } else if (question.type === "radio") {
            const randomOrderRadio = getMixedArray(question.options.length);
            for (let i = 0; i < question.options.length; i++) {
                newInput = document.createElement("input");
                newInput.type = "radio";
                newInput.className = "appearance-none mr-1 w-3 h-3 border border-gray-400 rounded-full bg-white checked:bg-green-500 checked:border-green-500";
                const idText = "q" + question.id + "v" + (i + 1);
                newInput.id = idText;
                newInput.value = question.options[randomOrderRadio[i]];
                newInput.name = "q" + question.id;
                newQuestion.appendChild(newInput);


                newLabel = document.createElement("label");
                newLabel.innerText = question.options[randomOrderRadio[i]];
                newLabel.htmlFor = idText;
                newLabel.className = "appearance-none mr-4 w-3 h-3";

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
                newOption.className = "mr-4 w-3 h-3";
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
                newLabel.className = "appearance-none mr-1 w-3 h-3";
                newQuestion.appendChild(newLabel);

                newInput = document.createElement("input");
                newInput.type = "checkbox";
                newInput.className = "appearance-none mr-4 w-3 h-3 border border-gray-400 rounded-sm bg-white checked:bg-green-500 checked:border-green-500";
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


document.querySelector("#logInBtn").addEventListener("click", async () => {
    //проверка логина в бд
    const studentLogin = document.getElementById("userLogin").value
    let response = await fetch("/checkStudent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            studentLogin: studentLogin
        })
    })
    console.log(response)
    let res = await response.json();
    if (res.data.length === 0) {
        alert("error")
        return
    }
    else {
        document.querySelector("#studentId").value = res.data[0].student_id;
    }
    console.log(res)


    document.querySelector("#userInfo").style.display = "none";
    document.querySelector("#qBlock").style.display = "block";
    document.querySelector("#nextBtn").style.display = "block";
    document.querySelector("#userName").style.display = "block";
    document.querySelector("#timer").style.display = "block";
    document.querySelector("#mainTimer").style.display = "block";

    startTimer()
    startMainTimer()

    // const studentLogin = document.getElementById("userLogin").value
    document.getElementById("userName").innerHTML = `user: ${studentLogin}`;
});


let intervalId;
const startTimer = () => {
    clearInterval(intervalId);
    let count = 10;
    intervalId = setInterval(() => {
        count--;
        document.getElementById("timer").textContent = "Time left: " + count + " sec";
        if (count === 0) {
            clearInterval(intervalId);
            if (questionNumber === data.questions.length - 1) {
                document.querySelector("#submitBtn").click()
            } else {
                nextQuestionHandler()
            }
        }
    }, 1000); // Выполнять каждую секунду
}

let totalIntervalId;
const startMainTimer = () => {
    clearInterval(totalIntervalId);
    let seconds = 0;
    let countMin = 0
    totalIntervalId = setInterval(() => {
        seconds++;
        let screenMinutes = Math.floor(seconds / 60);
        let screenSeconds = seconds % 60
        document.getElementById("mainTimer").textContent = `Total time: ${screenMinutes = screenMinutes > 9 ? screenMinutes : "0" + screenMinutes}:${screenSeconds = screenSeconds > 9 ? screenSeconds : "0" + screenSeconds}`;
    }, 100);

}



//todo: fix submit
const actionsBeforeSubmit = () => {
    // document.querySelector("#qBlock").style.display = "block";
    return true
}