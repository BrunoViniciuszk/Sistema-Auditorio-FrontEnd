import React from "react";
import { reserva } from "../Js/API";
import styles from "../css/Style_Reserva.module.css"
import { erro } from "../components/mensagem";
import { confirmacaoCert } from "./Certeza";

export function Reserva() {
    return (
        <div className={styles.principal} id="principal">

            <div className={styles.payment} id="payment">
             
                <div className={styles.form}>
                    <div className={styles.title_form}>

                        <span className={styles.novaRS}>
                            Nova Reserva
                        </span>

                        <span className={styles.close} onClick={Fechar} >X</span>

                    </div>

                    <div className="formAdmin">
                        <form onSubmit={reserva}>
                            <input type="hidden" name="id" ></input>

                            <div className={styles.datas}>

                                <h5 className={styles.title_I}>Início</h5>
                                <div className={styles.inicio}>
                                    <input type="datetime-local" id="dataInicio" name="dataInicio" required className={styles.Data_Inicio} />
                                </div>

                                <h5 className={styles.title_F}>Final</h5>
                                <div className={styles.final}>
                                    <input type="datetime-local" name="dataTermino" id="dataTermino" required className={styles.Data_Final} />
                                </div>

                            </div>

                            <h5 className={styles.title}>Titulo</h5>
                            <div className={styles.input}>
                                <input type="text" name="titulo" id="titulo" required className={styles.Nome_Reserva} />
                                <br />
                            </div>

                            <h5 className={styles.title}>Descricao</h5>
                            <div className={styles.input}>
                                <textarea name="descricao" rows="4" cols="50" style={{resize:"none"}} id="descricao" className={styles.Descricao} >
                                </textarea>
                            </div>


                            <h5 className={styles.title}>Número de Participantes</h5>

                            <div className={styles.slidecontainer}>
                                <input type="range" min="1" max="118" id="myRange" onChange={numero} className={styles.slider} />
                                <p className={styles.value}><span id="participantes"></span></p>
                            </div>

                            <button type="submit" className={styles.btn}>Criar</button>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );
}

export function Confirmacao() {
    const token = sessionStorage.getItem("token")
    if(token){
        const payment = document.getElementById("payment");
        const principal = document.getElementById("principal");
        payment.style.display = "flex"
        principal.style.display = "flex"
    }else{
        erro("Precisa estar logado para criar uma Reserva")
    }
}

function Fechar() {
    const payment = document.getElementById("payment");
    const principal = document.getElementById("principal");
    document.getElementById("dataInicio").value = ""
    document.getElementById("dataTermino").value = ""
    document.getElementById("titulo").value = ""
    document.getElementById("descricao").value = ""
    document.getElementById("participantes").innerHTML = ""
    payment.style.display = "none"
    principal.style.display = "none"
} 

function numero() {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("participantes");
    output.innerHTML = slider.value;

    slider.oninput = function () {
        output.innerHTML = this.value;
    }
} 


export default Reserva;