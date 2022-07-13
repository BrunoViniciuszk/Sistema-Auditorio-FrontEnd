import React from 'react';
import '../css/Help.css';
import perguntaD from '../IMG/pergunta-D.png'
import perguntaE from '../IMG/pergunta-E.png'
import perguntaF from '../IMG/pergunta-final.png'
import PrimeiroPasso from '../IMG/Primeiro_Passo.mp4'
import SegundoPasso from '../IMG/Segundo_Passo.mp4'
import TerceiroPasso from '../IMG/Terceiro_Passo.mp4'
import QuartoPasso from '../IMG/Quarto_Passo.mp4'
import QuintoPasso from '../IMG/Quinto_Passo.mp4'
import PostAuditorio from '../IMG/Post_Auditorio.png'

export function Help() {
    return (

        <div className='principal' onScroll={scroll}  >

            <div className="div_title">
                <a className="navigation-link navigation-link-1" href="#">
                    <span data-text="Tutorial" className="span">Tutorial</span>
                </a>
            </div>

            <div className='base_list'>
                <ul className="base__help">
                    <li className="base__informacao">
                        <div className="informacao0" >
                            <div className='card_imagem'>
                                <img src={perguntaD} />
                            </div>
                            <div className='card'>

                                <div className='card_posicao'>
                                    <div className='card_numero'>
                                        <i className="fa-solid fa-1"></i>
                                    </div>
                                    <div className='text_numero'>
                                        <span className='text_posicao'>Primeiro Passo</span>
                                    </div>
                                </div>
                                <div className='card_title'>
                                    <span className='descricao'>
                                        Clique no botão para realizar
                                        uma reserva no auditorio.

                                    </span>
                                </div>
                            </div>

                        </div>
                        <div className="base__img0" >
                            <div className="img0" >
                                <video src={PrimeiroPasso} autoPlay loop className="video" muted type="mp4" />
                            </div>
                        </div>
                    </li>

                    <li className="base__informacao" >
                        <div className="informacao2" >
                            <div className='card_imagem'>
                                <img src={perguntaE} />
                            </div>
                            <div className='card'>

                                <div className='card_posicao'>
                                    <div className='card_numero'>
                                        <i className="fa-solid fa-2"></i>
                                    </div>
                                    <div className='text_numero'>
                                        <span className='text_posicao'>Segundo Passo</span>
                                    </div>
                                </div>
                                <div className='card_title'>
                                    <span className='descricao'>
                                        Preencha os dados que faltam no
                                        quadro a seguir.

                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="base__img2" >
                            <div className="img2" >
                                <video src={SegundoPasso} autoPlay loop className="video2" muted type="mp4" />
                            </div>
                        </div>
                    </li>

                    <li className="base__informacao">
                        <div className="informacao" >
                            <div className='card_imagem'>
                                <img src={perguntaD} />
                            </div>
                            <div className='card'>

                                <div className='card_posicao'>
                                    <div className='card_numero'>
                                        <i className="fa-solid fa-3"></i>
                                    </div>
                                    <div className='text_numero'>
                                        <span className='text_posicao'>Terceiro Passo</span>
                                    </div>
                                </div>
                                <div className='card_title'>
                                    <span className='descricao'>
                                        Aperte em Criar para realizar sua
                                        primeira Reserva.

                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="base__img" >
                            <div className="img" >
                                <video src={TerceiroPasso} autoPlay loop className="video1" muted type="mp4" />
                            </div>
                        </div>
                    </li>

                    <li className="base__informacao">
                        <div className="informacao2" >
                            <div className='card_imagem'>
                                <img src={perguntaE} />
                            </div>
                            <div className='card'>

                                <div className='card_posicao'>
                                    <div className='card_numero'>
                                        <i className="fa-solid fa-4"></i>
                                    </div>
                                    <div className='text_numero'>
                                        <span className='text_posicao'>Quarto Passo</span>
                                    </div>
                                </div>
                                <div className='card_title'>
                                    <span className='descricao'>
                                        Utilize a barra de pesquisa para
                                        realizar algumas buscas, sobre as
                                        Reservas.

                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="base__img2" >
                            <div className="img2" >
                                <video src={QuartoPasso} autoPlay loop className="video2" muted type="mp4" />
                            </div>
                        </div>
                    </li>

                    <li className="base__informacao">
                        <div className="informacao" >
                            <div className='card_imagem'>
                                <img src={perguntaD} />
                            </div>
                            <div className='card'>

                                <div className='card_posicao'>
                                    <div className='card_numero'>
                                        <i className="fa-solid fa-5"></i>
                                    </div>
                                    <div className='text_numero'>
                                        <span className='text_posicao'>Quinto Passo</span>
                                    </div>
                                </div>
                                <div className='card_title'>
                                    <span className='descricao'>
                                        Acesse a página dos Post com o
                                        botão Instagram.

                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="base__img" >
                            <div className="img" >
                                <video src={QuintoPasso} autoPlay loop className="video1" muted type="mp4" />
                            </div>
                        </div>
                    </li>

                    <li className="base__informacao">
                        <div className="informacao2" >
                            <div className='card_imagem'>
                                <img src={perguntaE} />
                            </div>
                            <div className='card'>

                                <div className='card_posicao'>
                                    <div className='card_numero'>
                                        <i className="fa-solid fa-6"></i>
                                    </div>
                                    <div className='text_numero'>
                                        <span className='text_posicao'>Sexto Passo</span>
                                    </div>
                                </div>
                                <div className='card_title'>
                                    <span className='descricao'>
                                        Utilize a HashTag do auditorio
                                        para realizar um post no instagram.
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="base__img2" >
                            <div className="img2" >
                                <video src={QuintoPasso} autoPlay loop className="video2" muted type="mp4" />
                            </div>
                        </div>
                    </li>
                    <li className="Tuturial_Final">
                        <div className="Circle_Final">
                            <div className="Circle">
                                <img className="Circle_Img" src={perguntaF} />
                            </div>
                        </div>
                        <div className="Title_Final">
                            <div className='Descricao_Final'>
                                <span className='descricao_end'>
                                    Agora você esta preparado
                                    para utilizar nosso sistema
                                    divirta-se.
                                </span>
                            </div>

                            <a href='/Principal' className="btn_final">
                                <i className="fa-solid fa-reply"></i>
                                <span className='votar_bnt'>Voltar</span>
                            </a>

                        </div>

                    </li>

                </ul>
            </div>

        </div>

    )
}

function scroll() {
    scrollEffect();
    scrollEffect2();
}

function scrollEffect() {
    var reveals = document.querySelectorAll(".informacao");
    var img = document.querySelectorAll(".video1");
    var baseimg = document.querySelectorAll(".base__img");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
            img[i].classList.add("active");
            baseimg[i].classList.add("active");


        } else {
            reveals[i].classList.remove("active");
            img[i].classList.remove("active");
            baseimg[i].classList.remove("active");

        }
    }
}
window.addEventListener("scroll", scrollEffect);


function scrollEffect2() {
    var reveals2 = document.querySelectorAll(".informacao2");
    var img2 = document.querySelectorAll(".video2");
    var baseimg2 = document.querySelectorAll(".base__img2");

    for (var i = 0; i < reveals2.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals2[i].getBoundingClientRect().top;
        var elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {

            reveals2[i].classList.add("active");
            img2[i].classList.add("active");
            baseimg2[i].classList.add("active");

        } else {
            reveals2[i].classList.remove("active");
            img2[i].classList.remove("active");
            baseimg2[i].classList.remove("active");

        }
    }
}
window.addEventListener("scroll", scrollEffect2);