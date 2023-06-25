document.querySelectorAll('.contact')
    .forEach(element => element.addEventListener('change', () =>
        document.getElementById('submitDelete').disabled = true));