import { checkedQuerySelector, appendEl, createEl } from './utils';
import { Controls } from './controls';
import { Auth } from './authentication';

export class RenderAuthPopup {
    static showPopup() {
        const body = checkedQuerySelector(document, 'body');
        const popupWrapper = createEl('popup__wrapper', 'div');
        const authBox = createEl('auth__box', 'div');
        const title = createEl('auth__box_title', 'h1');
        const inputEmail = <HTMLInputElement>createEl('email input-el', 'input');
        inputEmail.id = 'email';
        const inputPassword = <HTMLInputElement>createEl('password input-el', 'input');
        inputPassword.id = 'password';
        const authBoxButtons = <HTMLButtonElement>createEl('auth__box_buttons', 'button');
        const loginBtn = <HTMLButtonElement>createEl('login button', 'button');
        loginBtn.id = 'login';
        const signupBtn = <HTMLButtonElement>createEl('signup button hide', 'button');
        signupBtn.id = 'signup';
        const logoutBtn = <HTMLButtonElement>createEl('logout button hide', 'button');
        logoutBtn.id = 'logout';
        const changeBtn = createEl('text', 'span');
        changeBtn.id = 'change';

        appendEl(body, popupWrapper);
        appendEl(popupWrapper, authBox);
        appendEl(authBox, title);
        appendEl(authBox, inputEmail);
        appendEl(authBox, inputPassword);
        appendEl(authBox, authBoxButtons);
        appendEl(authBoxButtons, loginBtn);
        appendEl(authBoxButtons, signupBtn);
        appendEl(authBoxButtons, logoutBtn);
        appendEl(authBoxButtons, changeBtn);

        title.textContent = 'Login';
        inputEmail.type = 'email';
        inputEmail.placeholder = 'E-mail';
        inputPassword.type = 'password';
        inputPassword.placeholder = 'Password';
        loginBtn.textContent = 'login';
        signupBtn.textContent = 'sign up';
        logoutBtn.textContent = 'logout';
        changeBtn.textContent = 'Sign UP';

        document.addEventListener('click', (e) => {
            const targetDocument = <HTMLDivElement>e.target;
            const its_details = targetDocument == authBox || authBox.contains(targetDocument);
            const details_is_active = authBox.classList.contains('auth__box');
            if (!its_details && details_is_active) {
                popupWrapper.remove();
                authBox.classList.add('close');
                authBox.remove();
                Controls.setControls();
            }
        });

        loginBtn.addEventListener('click', () => {
            Auth.logIn();
        });

        signupBtn.addEventListener('click', () => {
            Auth.signUp();
        });

        logoutBtn.addEventListener('click', () => {
            Auth.logOut();
        });

        changeBtn.addEventListener('click', () => {
            Auth.change();
        });
    }
}
