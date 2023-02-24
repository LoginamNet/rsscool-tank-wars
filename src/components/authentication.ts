import { checkedID, checkedQuerySelector } from './utils';

export class Auth {
    static change() {
        const changeBtn = checkedID(document, 'change');
        changeBtn.textContent === 'Login' ? Auth.changeOnSignUp() : Auth.changeOnLogin();
    }

    private static changeOnSignUp() {
        const changeBtn = checkedID(document, 'change');
        const loginBtn = checkedQuerySelector(document, '.login');
        const signupBtn = checkedQuerySelector(document, '.signup');
        const title = checkedQuerySelector(document, '.auth__box_title');

        changeBtn.addEventListener('click', () => {
            loginBtn.classList.add('hide');
            signupBtn.classList.remove('hide');
            changeBtn.textContent = 'Login';
            title.textContent = 'Registration';
        });
    }

    private static changeOnLogin() {
        const changeBtn = checkedID(document, 'change');
        const loginBtn = checkedQuerySelector(document, '.login');
        const signupBtn = checkedQuerySelector(document, '.signup');
        const title = checkedQuerySelector(document, '.auth__box_title');

        changeBtn.addEventListener('click', () => {
            loginBtn.classList.remove('hide');
            signupBtn.classList.add('hide');
            changeBtn.textContent = 'Sign UP';
            title.textContent = 'Login';
        });
    }

    // static signUp() {
    //     const signupBtn = checkedQuerySelector(document, '.signup');
    //     const title = checkedQuerySelector(document, '.auth__box_title');
    //     const authBox = checkedQuerySelector(document, '.auth__box');


    //     signupBtn.addEventListener('click', () => {

    //     });
    // }

    // static logIn() {
    //     const loginBtn = checkedQuerySelector(document, '.login');

    //     loginBtn.addEventListener('click', () => {

    //     });
    // }

    // static logOut() {
    //     const logoutBtn = checkedQuerySelector(document, '.logout');

    //     logoutBtn.addEventListener('click',()=>{

    //     });
    // }
}
