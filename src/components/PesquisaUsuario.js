import { Component } from "react";

import styles from "../css/Lista_Pesquisa.module.css"

export class PesquisaUsuario extends Component {
    render() {
        return (
            <div className={styles.listaPesquisa} id="listaPesquisa">
                <table id="tabela" className={styles.tabelaPesquisa}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nif</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody id="listaPesquisaBody" className={styles.body}>

                    </tbody>
                </table>
            </div>
        )
    }
}
