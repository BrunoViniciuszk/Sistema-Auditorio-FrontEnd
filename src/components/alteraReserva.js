import React from "react";
import styles from "../css/Style_Reserva.module.css"
import { erro } from "../components/mensagem";
import { alterarReserva } from "../Js/API";

export function AlteraReserva() {
    return (
        <div className={styles.principal} id="principalAlterar">

            <div className={styles.paymentAlterar} id="paymentAlterar">
             
                <div className={styles.form}>
                    <div className={styles.title_form}>

                        <span className={styles.novaRS}>
                            Alteração de Reserva
                        </span>

                        <span className={styles.close} onClick={FecharAlterar} >X</span>

                    </div>

                    <div className="formAdmin">
                        <form id="alterarReserva" onSubmit={alterarReserva}>
                            <input type="hidden" id="idAlterar" name="id" ></input>
                            <input type="hidden" id="descricaoAlterar" name="descricao" ></input>
                            <input type="hidden" id="tituloAlterar" name="titulo"></input>
                            <input type="hidden" id="usuarioAlterar" name="usuario"></input>


                            <div className={styles.datas}>

                                <h5 className={styles.title_I}>Início</h5>
                                <div className={styles.inicio}>
                                    <input type="datetime-local" id="dataInicioAlterar" name="dataInicio" required className={styles.Data_Inicio} />
                                </div>

                                <h5 className={styles.title_F}>Final</h5>
                                <div className={styles.final}>
                                    <input type="datetime-local" name="dataTermino" id="dataTerminoAlterar" required className={styles.Data_Final} />
                                </div>

                            </div>

                            <h5 className={styles.title}>Número de Participantes</h5>

                            <div className={styles.slidecontainer}>
                                <input type="range" min="1" max="118" id="myRangeAlterar" onChange={numero} className={styles.slider} />
                                <p className={styles.value}><span id="participantesAlterar"></span></p>
                            </div>

                            <button type="submit" className={styles.btn}>Alterar</button>

                        </form>
                    </div>

                </div>

            </div>

        </div>

    );
}

export function ConfirmacaoAlterar() {
    const token = sessionStorage.getItem("token")
    if(token){
        const payment = document.getElementById("paymentAlterar");
        const principal = document.getElementById("principalAlterar");
        payment.style.display = "flex"
        principal.style.display = "flex"
    }else{
        erro("Precisa estar logado para criar uma Reserva")
    }
}

function FecharAlterar() {
    const payment = document.getElementById("paymentAlterar");
    const principal = document.getElementById("principalAlterar");
    document.getElementById("dataInicioAlterar").value = ""
    document.getElementById("dataTerminoAlterar").value = ""
    document.getElementById("participantesAlterar").innerHTML = ""
    payment.style.display = "none"
    principal.style.display = "none"
} 

function numero() {
    var slider = document.getElementById("myRangeAlterar");
    var output = document.getElementById("participantesAlterar");
    output.innerHTML = slider.value;

    slider.oninput = function () {
        output.innerHTML = this.value;
    }
} 


export default AlteraReserva;