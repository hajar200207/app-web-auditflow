// Récupération des éléments HTML avec typage
const form = document.getElementById('login-form') as HTMLFormElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const loginTypeSelect = document.getElementById('login-type') as HTMLSelectElement;
const errorMessage = document.getElementById('error-message') as HTMLDivElement;
const forgotPasswordLink = document.getElementById('forgot-password') as HTMLAnchorElement;
const togglePasswordCheckbox = document.getElementById('toggle-password') as HTMLInputElement;

// Gestion de la soumission du formulaire
form.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const username: string = usernameInput.value;
    const password: string = passwordInput.value;
    const loginType: string = loginTypeSelect.value;

    if (username === 'admin' && password === 'password' && loginType === 'smg_system') {
        alert('SMG System login successful!');
    } else if (username === 'user' && password === 'password' && loginType === 'qa_technic') {
        alert('QA Technic login successful!');
    } else if (username === 'global' && password === 'password' && loginType === 'global_certification') {
        alert('Global Certification login successful!');
    } else {
        errorMessage.textContent = 'Invalid username or password.';
    }
});

// Gestion du lien "Mot de passe oublié"
forgotPasswordLink.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    alert('A password reset link has been sent to your email address.');
});

// Gestion de l'affichage du mot de passe
togglePasswordCheckbox.addEventListener('change', () => {
    passwordInput.type = togglePasswordCheckbox.checked ? 'text' : 'password';
});
