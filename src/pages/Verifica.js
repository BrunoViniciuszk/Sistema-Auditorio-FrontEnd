
import React, { Fragment } from "react";
import { listaUsuariosComuns, pesquisaReserva, pesquisaUsuario, refresh } from "../Js/API";
import styles from "../css/Style_Verifica.module.css"
import { PesquisaUsuario } from "../components/PesquisaUsuario";

function Verifica() {
    return (
        <div className={styles.principal}>

            <div className={styles.base_voltar}>
                <a className={styles.btn_voltar} href='../Principal'>
                    <i className="fa-solid fa-reply"></i>
                </a>
            </div>

            <div className={styles.reservas}>
                <div className={styles.base_lista}>
                    <div className={styles.postion_text_reserva}>
                        <h5 className={styles.title_reserva}>Usuários</h5>
                    </div>

                    <form onSubmit={pesquisaUsuario} className={styles.div_pesquisa}>

                        <div className={styles.base_pes}>
                            <button type="submit" className={styles.lupa}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                            <input type="search" placeholder="Busca Pelo Usuario" className={styles.pesquisa_reservas} id="pesquisa" required/>
                        </div>
                        <span className={styles.fecharPesquisa} id="fecharPesquisa" onClick={refresh}>X</span>
                    </form>

                    <div className={styles.div_lista}>
                        <PesquisaUsuario />
                        <ul className={styles.lista}>
                            <table id="tabela" className={styles.tabela_mes} onLoad={listaUsuariosComuns()}>
                                <thead>
                                    <tr className={styles.header_list}>
                                        <td className={styles.mes}>ID</td>
                                        <td className={styles.mes}>NIF</td>
                                        <td className={styles.mes}>Nome</td>
                                        <td className={styles.mes}>Email</td>
                                        <td className={styles.mes}>Excluir</td>
                                    </tr>
                                </thead>
                                <tbody id="lista" className={styles.body}>

                                </tbody>
                            </table>
                        </ul>
                    </div>
                </div>

            </div>

        </div>

    );
}
export default Verifica
