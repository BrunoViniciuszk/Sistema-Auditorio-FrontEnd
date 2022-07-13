const buy = document.querySelector(".buy");
const payment = document.querySelector(".payment");
const close = document.querySelector(".close");

buy.addEventListener("click", () => {
    payment.style.display = "flex"
})

close.addEventListener("click", () => {
    payment.style.display = "none"
})