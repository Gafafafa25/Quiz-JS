let data = {
    "questions": []
}


document.addEventListener('DOMContentLoaded', async function () {
//запрос вопросов с сервера
    console.log("DOM")
    let response = await fetch("/questions")
    data.questions = await response.json();
    createTest();
    questionNumber = 0;
    divQuestions = document.querySelectorAll(".qAdmin");
    console.log(data.questions)

    const arrayRemoveBtn = document.querySelectorAll(".qBtn")
    for (const item of arrayRemoveBtn) {
        item.addEventListener("click", async () => {
            // проверка логина в бд
            console.log(item.id)
            let response = await fetch("/removeQuestion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "questionId": item.id
                })
            })
            console.log(response)
        });
    }
})

function createTest() {
    let newQuestion;
    // let k = 6
    my_form = document.getElementById("qList");

    const randomOrder = data.questions;

    let questionNumber = 1
    for (let i = 0; i < data.questions.length; i++) {
        let question = data.questions[i];
        // div.q
        newQuestion = document.createElement("div");
        newQuestion.className = "qAdmin";

        //p
        const newP = document.createElement("p");
        newP.innerHTML = question.id + ". " + question.question;
        newQuestion.appendChild(newP);
        questionNumber++

        // button
        const newBtn = document.createElement("button");
        newBtn.type = "button";
        newBtn.className = "qBtn m-5 bg-red-700 hover:bg-red-900 text-white py-0.5 px-5 rounded transition opacityTest";
        newBtn.id = question.id
        newBtn.innerHTML = "x";
        newQuestion.appendChild(newBtn);

        // вставка вопроса в форму
        my_form.appendChild(newQuestion);

        // if (--k === 0) {
        //     break
        // }
    }
}





