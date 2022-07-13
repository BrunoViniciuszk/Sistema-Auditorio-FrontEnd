import cadastraUsuario, { pegaTypes } from "../Js/API";
import styles from '../css/Style_Cadastro.module.css';
import triangulo from '../IMG/trianguloDireita.png'
import projetor from '../IMG/projetor.gif'
import auditorio from '../IMG/video-auditorio.mp4'
import user from '../IMG/UserImg.png'

export default function Cadastro() {
    return (
        <div className={styles.principal}>

            <div className={styles.video_div}>
                <video src={auditorio} autoPlay loop className={styles.video} muted type="mp4" />
            </div>

            <div className={styles.div_direita}>
                <a href="/Principal" className={styles.home} title="Principal/Home">
                    <i className="fa-solid fa-home"></i>
                </a>
                <div className={styles.div_title}>
                    <a className="navigation-link navigation-link-1" href="#">
                        <span data-text="Cadastro" className={styles.span}>Cadastro</span>
                    </a>
                </div>

                <div className={styles.div_projetor}>
                    <img src={projetor} className={styles.projetor}></img>
                </div>
            </div>

            <div className={styles.div_form}>

                <div className={styles.form_base}>

                    <form className={styles.form} onSubmit={cadastraUsuario}>

                        <input type="hidden" name="id"></input>

                        <div className={styles.user_div}>
                            <div className={styles.personal_image}>
                                <label className={styles.label}>
                                    <input type="file" id="fileImage" onChange={fileChange} accept="image/*" />
                                    <figure className={styles.personal_figure}>
                                        <img src={user} className={styles.personal_avatar} id="imgPhoto" alt="avatar" />
                                        <figcaption className={styles.personal_figcaption}>
                                            <img src="https://raw.githubusercontent.com/ThiagoLuizNunes/angular-boilerplate/master/src/assets/imgs/camera-white.png" />
                                        </figcaption>
                                    </figure>
                                </label>
                            </div>
                        </div>

                        <div className={styles.User}>
                            <input type="number" placeholder="NIF" name="nif" required id="nif" className={styles.input} /><br />
                            <i className="fa-solid fa-user-large" id={styles.user_ico}></i>
                        </div>

                        <div className={styles.User}>
                            <input type="text" placeholder="NOME" name="nome" required id="nome" className={styles.input} /><br />
                            <i className="fa-solid fa-address-card" id={styles.lock_ico}></i>
                        </div>

                        <div className={styles.User}>
                            <input type="email" placeholder="EMAIL" name="email" required id="email" className={styles.input} /><br />
                            <i className="fa-solid fa-envelope" id={styles.lock_ico}></i>
                        </div>

                        <div className={styles.User}>
                            <input type="password" placeholder="SENHA" name="senha" required id="senha" className={styles.input} /><br />
                            <i className="fa-solid fa-lock" id={styles.lock_ico}></i>
                        </div>

                        <div className={styles.User}>
                            <select className={styles.select} placeholder="TIPO DE USUARIO" name="type" id="type" required onLoad={pegaTypes()}></select><br />
                            <i className="fa-solid fa-users" id={styles.lock_ico}></i>
                        </div>

                        <button className={styles.btn} type="submit" > <i className="fa-solid fa-user-plus" id={styles.sign_ico}></i>Cadastrar</button>

                    </form>
                </div>
                <img src={triangulo} className={styles.trianguloEsquerda} />
            </div>

        </div>
    )
}

function fileChange() {
    let photo = document.getElementById('imgPhoto');
    let file = document.getElementById('fileImage');

    if (file.files.length <= 0) {
        return;
    }

    let reader = new FileReader();

    reader.onload = () => {
        photo.src = reader.result;
    }

    reader.readAsDataURL(file.files[0]);
}

