document.querySelector("#show-login").addEventListener("click", ()=>{
    document.querySelector('.popup').classList.add('active');
} );
document.querySelector('.popup .close-btn').addEventListener("click", ()=>{
    document.querySelector('.popup').classList.remove('active');
} );