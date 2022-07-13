import React, { Fragment } from "react";
import cadastraUsuario, { cadUser, fazGet, login, pegaTypes, pegaUsuario } from '../Js/API.js';
import styles from '../css/Style_Login.module.css';
import triangulo from '../IMG/trianguloEsquerda.png'
import projetor from '../IMG/projetor.gif'
import auditorio from '../IMG/video-auditorio.mp4'
import logo from '../IMG/logo.png'

function Login() {
    return (
        <div className={styles.principal}>

            <div className={styles.video_div}>
                <video src={auditorio} autoPlay loop className={styles.video} muted type="mp4" />
            </div>

            <div className={styles.div_form}>
                <img src={triangulo} className={styles.trianguloEsquerda} />

                <div className={styles.form_base}>

                    <div className={styles.title_form}>
                        <h1 className={styles.title1}>Bem vindo ao</h1>
                        <img className={styles.logo} src={logo} />
                    </div>

                    <form className={styles.form} onSubmit={login}>

                        <h1 className={styles.title2}>Faça seu login</h1>

                        <div className={styles.User}>
                            <input type="number" placeholder="NIF" name="nif" required id="loginNif" className={styles.input} /><br />
                            <i className="fa-solid fa-user-large" id={styles.user_ico}></i>
                        </div>

                        <div className={styles.User}>
                            <input type="password" placeholder="SENHA" name="senha" required id="loginSenha" className={styles.input} /><br />
                            <i className="fa-solid fa-lock" id={styles.lock_ico}></i>
                        </div>

                        <button className={styles.btn}> <i className="fa-solid fa-sign-in" id={styles.sign_ico}></i>Entrar</button>

                    </form>
                </div>
            </div>

            <div className={styles.div_direita}>

                <a href="/Principal" className={styles.home} title="Principal/Home">
                    <i className="fa-solid fa-home"></i>
                </a>

                <div className={styles.div_title}>
                    <a className="navigation-link navigation-link-1" href="#">
                        <span data-text="Login" className={styles.span}>Login</span>
                    </a>
                </div>

                <div className={styles.div_projetor}>
                    <img src={projetor} className={styles.projetor}></img>
                </div>
            </div>
        </div>
    );
}

export default Login;