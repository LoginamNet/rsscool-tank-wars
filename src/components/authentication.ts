import { checkedID, checkedQuerySelector } from './utils';
import { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, update, onValue, get, child } from 'firebase/database';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from 'firebase/auth';
import { State } from './state';
import { Page } from './pages';
import { DEFAULT_NAME } from '../common/constants';
import { Storage } from './storage';

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
        const username = <HTMLInputElement>checkedQuerySelector(document, '.username');

        loginBtn.classList.add('hide');
        username.classList.remove('hide');
        signupBtn.classList.remove('hide');
        changeBtn.textContent = 'Login';
        title.textContent = 'Registration';
    }

    static changeOnLogin() {
        const changeBtn = checkedID(document, 'change');
        const loginBtn = checkedQuerySelector(document, '.login');
        const signupBtn = checkedQuerySelector(document, '.signup');
        const title = checkedQuerySelector(document, '.auth__box_title');
        const username = <HTMLInputElement>checkedQuerySelector(document, '.username');

        loginBtn.classList.remove('hide');
        username.classList.add('hide');
        signupBtn.classList.add('hide');
        changeBtn.textContent = 'Sign UP';
        title.textContent = 'Login';
    }

    static signUp() {
        const username = <HTMLInputElement>checkedQuerySelector(document, '.username');
        const email = <HTMLInputElement>checkedQuerySelector(document, '.email');
        const password = <HTMLInputElement>checkedQuerySelector(document, '.password');
        const popupWrapper = checkedQuerySelector(document, '.popup__wrapper');
        const authBox = checkedQuerySelector(document, '.auth__box');

        createUserWithEmailAndPassword(Auth.auth, email.value, password.value)
            .then((userCredential) => {
                // Signed up
                const dt = new Date();
                const user = userCredential.user;
                set(ref(Auth.database, 'users/' + user.uid), {
                    username: username.value,
                    email: user.email,
                });
                update(ref(Auth.database, 'users/'), {
                    first_login: dt,
                });
                State.settings.username = username.value;
                State.settings.statusAuth = 'LOGOUT';
                username.value = '';
                email.value = '';
                password.value = '';
                popupWrapper.remove();
                authBox.classList.add('close');
                Page.renderHome();
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    static logIn() {
        const email = <HTMLInputElement>checkedQuerySelector(document, '.email');
        const password = <HTMLInputElement>checkedQuerySelector(document, '.password');
        const popupWrapper = checkedQuerySelector(document, '.popup__wrapper');
        const authBox = checkedQuerySelector(document, '.auth__box');

        signInWithEmailAndPassword(Auth.auth, email.value, password.value)
            .then((userCredential) => {
                // Log in
                const user = userCredential.user;
                const dt = new Date();
                const dbRef = ref(getDatabase());
                update(ref(Auth.database, 'users/' + user.uid), {
                    last_login: dt,
                });
                get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        State.settings.username = data.username;
                        Page.renderHome();
                        Storage.setStorage('settings');
                    } else {
                        console.log('No data available');
                    }
                });
                console.log(`${user.email} loged in!`);
                State.settings.statusAuth = 'LOGOUT';
                email.value = '';
                password.value = '';
                popupWrapper.remove();
                authBox.classList.add('close');
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    static logOut() {
        signOut(Auth.auth)
            .then(() => {
                // Sign-out successful
                console.log(`loged out`);
                State.settings.statusAuth = 'LOGIN/SIGNUP';
                State.settings.username = DEFAULT_NAME;
                Storage.setStorage('settings');
                Page.renderHome();
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
