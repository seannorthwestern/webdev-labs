var text_size = 1.4

const makeBigger = () => {
   text_size += 0.3
   setFont()
};

const makeSmaller = () => {
   text_size -= 0.3
   setFont()
};

const setFont = () => {
   document.querySelector(".content").style.fontSize = `${text_size}em`;
   document.querySelector("h1").style.fontSize = `${text_size + 0.6}em`;
}

document.querySelector("#a1").addEventListener('click', makeBigger);
document.querySelector("#a2").addEventListener('click', makeSmaller);
