import styles from "../css/Certeza.module.css"
import { excluirUsuario, reserva } from "../Js/API";

export default function Certeza() {
    return (
        <div className={styles.principal} id="principalCert">
            <div className={styles.payment} id="paymentCert">
                <div className={styles.div_title}>
                    <span>Tem Certeza?</span>
                </div>
                <div className={styles.div_just}>
                    <span>Após a confirmação sua conta será completamente excluida dos registros, caso você não possua nenhuma reserva cadastrada</span>
                </div>
                <div className={styles.botoes}>
                    <button id="cancelar" onClick={FecharConfirmacao}>Cancelar</button>
                    <button onClick={excluirUsuario}>Confirmar</button>
                </div>
            </div>
        </div>
    )
}

export function confirmacaoCert(event) {
    event.preventDefault();
    const payment = document.getElementById("paymentCert");
    const principal = document.getElementById("principalCert");
    payment.style.display = "flex"
    principal.style.display = "flex"
}

export function FecharConfirmacao() {
    const payment = document.getElementById("paymentCert");
    const principal = document.getElementById("principalCert");
    payment.style.display = "none"
    principal.style.display = "none"
}