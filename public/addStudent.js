const firstNum = Math.floor(Math.random() * 10)
const secondNum = Math.floor(Math.random() * 10)
let sign = Math.floor(Math.random() * 2)
let res;
if (sign === 1) {
    sign = "+"
    res = firstNum + secondNum
} else {
    sign = "-"
    res = firstNum - secondNum
}
document.getElementById("generateCaptcha").innerHTML = `${firstNum} ${sign} ${secondNum}  =`;


const validateCaptcha = () => {
    const captcha = document.getElementById("captchaResult").value
    if (+captcha === res) {
        return true;
    }
    alert("captchaError")
    return false;
}