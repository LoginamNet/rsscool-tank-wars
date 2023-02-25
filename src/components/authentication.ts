import { checkedID, checkedQuerySelector } from './utils';
import { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, update } from 'firebase/database';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from 'firebase/auth';

export class Auth {
    static firebaseConfig = {
        apiKey: 'AIzaSyAmH9oGo2UXL2uzRtZ50VHUBdKSmkG9vew',
        authDomain: 'tank-wars-e409a.firebaseapp.com',
        databaseURL: 'https://tank-wars-e409a-default-rtdb.firebaseio.com',
        projectId: 'tank-wars-e409a',
        storageBucket: 'tank-wars-e409a.appspot.com',
        messagingSenderId: '1048364796625',
        appId: '1:1048364796625:web:016660a2fb67ca40a893f0',
    };
    static app = initializeApp(Auth.firebaseConfig);
    static database = getDatabase(Auth.app);
    static auth = getAuth();

    static change() {
        const changeBtn = checkedID(document, 'change');
        changeBtn.textContent === 'Sign UP' ? Auth.changeOnSignUp() : Auth.changeOnLogin();
    }

    static changeOnSignUp() {
        const changeBtn = checkedID(document, 'change');
        const loginBtn = checkedQuerySelector(document, '.login');
        const signupBtn = checkedQuerySelector(document, '.signup');
        const title = checkedQuerySelector(document, '.auth__box_title');

        loginBtn.classList.add('hide');
        signupBtn.classList.remove('hide');
        changeBtn.textContent = 'Login';
        title.textContent = 'Registration';
    }

    static changeOnLogin() {
        const changeBtn = checkedID(document, 'change');
        const loginBtn = checkedQuerySelector(document, '.login');
        const signupBtn = checkedQuerySelector(document, '.signup');
        const title = checkedQuerySelector(document, '.auth__box_title');

        loginBtn.classList.remove('hide');
        signupBtn.classList.add('hide');
        changeBtn.textContent = 'Sign UP';
        title.textContent = 'Login';
    }

    static signUp() {
        const email = <HTMLInputElement>checkedQuerySelector(document, '.email');
        const password = <HTMLInputElement>checkedQuerySelector(document, '.password');
        const signupBtn = checkedQuerySelector(document, '.signup');
        const loginBtn = <HTMLButtonElement>checkedQuerySelector(document, '.login');
        const logoutBtn = <HTMLButtonElement>checkedQuerySelector(document, '.logout');
        const changeBtn = checkedID(document, 'change');
        const title = checkedQuerySelector(document, '.auth__box_title');

        createUserWithEmailAndPassword(Auth.auth, email.value, password.value)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                set(ref(Auth.database, 'users/' + user.uid), {
                    email: user.email,
                });
                alert(`${user.email} created`);
                email.value = '';
                password.value = '';
                title.textContent = 'Logout';
                email.classList.add('hide');
                password.classList.add('hide');
                signupBtn.classList.add('hide');
                loginBtn.classList.add('hide');
                changeBtn.classList.add('hide');
                logoutBtn.classList.remove('hide');

                const dt = new Date();
                update(ref(Auth.database, 'users/' + user.uid), {
                    last_login: dt,
                });
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    static logIn() {
        const email = <HTMLInputElement>checkedQuerySelector(document, '.email');
        const password = <HTMLInputElement>checkedQuerySelector(document, '.password');
        const loginBtn = <HTMLButtonElement>checkedQuerySelector(document, '.login');
        const logoutBtn = <HTMLButtonElement>checkedQuerySelector(document, '.logout');
        const changeBtn = checkedID(document, 'change');
        const title = checkedQuerySelector(document, '.auth__box_title');

        signInWithEmailAndPassword(Auth.auth, email.value, password.value)
            .then((userCredential) => {
                // Log in
                const user = userCredential.user;
                const dt = new Date();
                update(ref(Auth.database, 'users/' + user.uid), {
                    last_login: dt,
                });
                alert(`${user.email} loged in!`);
                email.value = '';
                password.value = '';
                title.textContent = 'Logout';
                email.classList.add('hide');
                password.classList.add('hide');
                loginBtn.classList.add('hide');
                changeBtn.classList.add('hide');
                logoutBtn.classList.remove('hide');
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    static logOut() {
        const logoutBtn = <HTMLButtonElement>checkedQuerySelector(document, '.logout');
        const changeBtn = checkedID(document, 'change');
        const email = <HTMLInputElement>checkedQuerySelector(document, '.email');
        const password = <HTMLInputElement>checkedQuerySelector(document, '.password');

        signOut(Auth.auth)
            .then(() => {
                // Sign-out successful
                alert(`loged out`);
                Auth.changeOnLogin();
                logoutBtn.classList.add('hide');
                changeBtn.classList.remove('hide');
                email.classList.remove('hide');
                password.classList.remove('hide');
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    static listenerUser() {
        onAuthStateChanged(Auth.auth, (user) => {
            if (user) {
                // const uid = user.uid;
                const email = user.email;
                console.log('email->', email);
            }
        });
    }
}
