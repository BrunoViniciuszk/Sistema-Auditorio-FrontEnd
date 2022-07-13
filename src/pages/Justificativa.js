import styles from "../css/Justificativa.module.css"

export default function Justificativa() {
    return (
        <div className={styles.principal} id="principalJust">
            <div className={styles.payment} id="paymentJust">
                <div className={styles.div_just}>
                    <span>Justificativa:</span>
                    <textarea id="justificativa"  style={{resize:"none"}} rows={8}  required>
                    </textarea>
                </div>
                <div className={styles.botoes}>
                    <button id="cancelar" onClick={Fechar}>Cancelar</button>
                    <button id="enviar">Enviar</button>
                </div>
            </div>
        </div>
    )
}

export function ConfirmacaoJust() {
    const token = sessionStorage.getItem("token")
    
    const payment = document.getElementById("paymentJust");
    const principal = document.getElementById("principalJust");
    payment.style.display = "flex"
    principal.style.display = "flex"
    
}

function Fechar() {
    const payment = document.getElementById("paymentJust");
    const principal = document.getElementById("principalJust");
    document.getElementById("justificativa").innerHTML = ""
    payment.style.display = "none"
    principal.style.display = "none"
} 