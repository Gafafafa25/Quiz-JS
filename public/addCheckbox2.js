let optionNumber = 0
document.querySelector("#plusAnswerBtn").addEventListener("click", () => {
    optionNumber++
    let optionContainer = document.createElement("div");
    let optionsContainer = document.getElementById("checkboxAnswers");

    let newLabel = document.createElement("label");
    const idAnswer = "answer" + optionNumber;
    newLabel.htmlFor = idAnswer;
    newLabel.innerText = idAnswer;
    optionContainer.appendChild(newLabel);

    let newInput = document.createElement("input");
    newInput.type = "checkbox";
    newInput.id = idAnswer;
    newInput.name = "rightAnswer";
    newInput.value = optionNumber.toString();
    optionContainer.appendChild(newInput);

    let newTextInput = document.createElement("input");
    newTextInput.type = "text";
    const idAnswerText = "answerText" + optionNumber;
    newTextInput.id = idAnswerText;
    newTextInput.name = idAnswerText;
    optionContainer.appendChild(newTextInput);

    optionsContainer.appendChild(optionContainer);
})