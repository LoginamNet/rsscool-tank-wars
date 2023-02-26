import { State } from './state';
import { EN, RU } from '../common/languages';
import { checkedID, checkedQuerySelector } from './utils';
import { DEFAULT_NAME } from '../common/constants';

export class Translate {
    static setLang() {
        return State.settings.language === 'EN' ? EN : RU;
    }

    private static setBtnsLang() {
        const pauseBtn = checkedQuerySelector(document, '.options_text_pause');
        const settingsBtn = checkedQuerySelector(document, '.options_text_settings');
        const fireBtn = checkedQuerySelector(document, '.launch__button');

        pauseBtn.textContent = this.setLang().pauseBtn;
        settingsBtn.textContent = this.setLang().settingsBtn;
        fireBtn.textContent = this.setLang().fireBtn;
    }

    private static setBtnsPopUp() {
        const title = checkedQuerySelector(document, '.auth__box_title');
        const inputName = <HTMLInputElement>checkedQuerySelector(document, '.username');
        const inputEmail = <HTMLInputElement>checkedQuerySelector(document, '.email');
        const inputPassword = <HTMLInputElement>checkedQuerySelector(document, '.password');
        const loginBtn = checkedQuerySelector(document, '.login');
        const signupBtn = checkedQuerySelector(document, '.signup');
        const changeBtn = checkedQuerySelector(document, '.change');

        title.textContent =
            State.settings.username === DEFAULT_NAME
                ? Translate.setLang().titleLogin
                : Translate.setLang().titleRegistr;
        inputName.placeholder = this.setLang().inputName;
        inputEmail.placeholder = this.setLang().inputEmail;
        inputPassword.placeholder = this.setLang().inputPassword;
        loginBtn.textContent = this.setLang().loginBtn;
        signupBtn.textContent = this.setLang().signupBtn;
        changeBtn.textContent =
            State.settings.username === DEFAULT_NAME ? this.setLang().signupBtn : this.setLang().loginBtn;
    }

    private static setMainMenuLang() {
        const subTitle = checkedID(document, 'subTitle');
        const menuMode = checkedID(document, 'mode');
        const menuPlayers = checkedID(document, 'players_num');
        const menuSound = checkedID(document, 'sound');
        const menuSoundON = checkedID(document, 'ON');
        const menuSoundOFF = checkedID(document, 'OFF');
        const menuLang = checkedID(document, 'lang');
        const menuAuthBtn = checkedID(document, 'btn_auth');
        const menuInstrBtn = checkedID(document, 'btn_instructions');
        const menuStartBtn = checkedID(document, 'btn_start');

        subTitle.textContent = this.setLang().subTitle + ' ' + State.settings.username;
        menuMode.innerHTML = this.setLang().mode;
        menuPlayers.innerHTML = this.setLang().playersNum;
        menuSound.innerHTML = this.setLang().sound;
        menuSoundON.innerHTML = this.setLang().soundON;
        menuSoundOFF.innerHTML = this.setLang().soundOFF;
        menuLang.innerHTML = this.setLang().lang;
        menuAuthBtn.innerHTML = State.settings.username === DEFAULT_NAME ? this.setLang().auth : this.setLang().authOut;
        menuInstrBtn.innerHTML = this.setLang().inst;
        menuStartBtn.innerHTML = this.setLang().start;
    }

    private static setGameMenuLang() {
        const menuSound = checkedID(document, 'sound');
        const menuSoundON = checkedID(document, 'ON');
        const menuSoundOFF = checkedID(document, 'OFF');
        const menuLang = checkedID(document, 'lang');
        const menuInstrBtn = checkedID(document, 'btn_instructions');
        const menuBackToGameBtn = checkedID(document, 'btn_back');
        const menuBackToMenuBtn = checkedID(document, 'btn_menu');

        menuSound.innerHTML = this.setLang().sound;
        menuSoundON.innerHTML = this.setLang().soundON;
        menuSoundOFF.innerHTML = this.setLang().soundOFF;
        menuLang.innerHTML = this.setLang().lang;
        menuInstrBtn.innerHTML = this.setLang().inst;
        menuBackToGameBtn.innerHTML = this.setLang().back;
        menuBackToMenuBtn.innerHTML = this.setLang().menu;

        if (document.querySelector('.pause__text') !== null) {
            const pause = checkedQuerySelector(document, '.pause__text');

            pause.innerHTML = this.setLang().gamePaused;
        }
    }

    static setMenuLang() {
        State.settings.screen === 'HOME' ? this.setMainMenuLang() : this.setGameMenuLang();
        this.setBtnsLang();
        // this.setBtnsPopUp();
    }
}
