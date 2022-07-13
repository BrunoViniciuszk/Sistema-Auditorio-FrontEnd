import { Component, useState } from "react";
import imagemOK from "../IMG/OK.png"
import imagemErro from "../IMG/erro.png"


export default class Mensagem extends Component {
    render() {
        return (
            <div className="mensagem_div" id="mensagem" style={{zIndex: 20}}>
                <span style={{ fontWeight: "bold" }} id="texto"></span><img style={{ height: "50px" }} id="imagem"></img>
            </div>
        )
    }
}

let isShowing = false

export function erro(mensagem) {
    setTimeout(() => {
        let mensagemDiv = document.getElementById("mensagem")
        let texto = document.getElementById("texto")
        let img = document.getElementById("imagem")

        if (isShowing == false) {

            isShowing = true

            mensagemDiv.classList.add("show")
            mensagemDiv.classList.add("erro")
            texto.innerHTML = mensagem
            img.setAttribute("src", imagemErro)

            setTimeout(() => {
                mensagemDiv.classList.remove("show")
                setTimeout(() => {
                    mensagemDiv.classList.remove("erro")
                    isShowing = false
                }, 500);
            }, 4000);

        }
    }, 5);
}

export function sucesso(mensagem) {
    setTimeout(() => {
        let mensagemDiv = document.getElementById("mensagem")
        let texto = document.getElementById("texto")
        const img = document.getElementById("imagem")

        if (isShowing == false) {

            isShowing = true

            mensagemDiv.classList.add("show")
            mensagemDiv.classList.add("sucesso")

            texto.innerHTML = mensagem
            img.setAttribute("src", imagemOK)

            setTimeout(() => {
                mensagemDiv.classList.remove("show")
                setTimeout(() => {
                    mensagemDiv.classList.remove("sucesso")
                    isShowing = false
                }, 500);
            }, 4000);
        }
    }, 5);
}