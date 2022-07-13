import { history } from './history'
import $ from "jquery"
import { erro, sucesso } from '../components/mensagem'
import { isAuthenticatedAdmin } from './auth'
import { ConfirmacaoDetalhes } from '../pages/Detalhes'
import { state } from '../components/grafico'
import { ConfirmacaoJust } from '../pages/Justificativa'
import { ConfirmacaoAlterar } from '../components/alteraReserva'
import { FecharConfirmacao } from '../pages/Certeza'

/* FAZ POST ---- Manda um objeto Json para que o back-end possa consumir*/
function fazPost(url, body) {

    let request = new XMLHttpRequest()
    request.open("POST", url, true)
    request.setRequestHeader("Content-type", "application/json")
    request.setRequestHeader("Authorization", sessionStorage.getItem("token"))
    request.send(JSON.stringify(body))

    if (url == "http://localhost:8080/api/reservation/save") {
        request.onload = function () {
            if (request.status == 200) {
                refresh("reserva")
            } else if (request.status == 406) {
                erro("Erro: Escolha uma data e horário válidos")
            } else if (request.status == 400) {
                erro("Erro: Data inválida.\n Verifique se não colocou uma data passada")
            } else {
                erro("Erro: Cadastro inválido.\nEste horário já está reservado")
            }
        }
    }

    if (url == "http://localhost:8080/api/user/cadastrar") {
        request.onload = function () {
            if (request.status == 200) {
                refresh("cadastro")
            } else if (request.status == 500) {
                erro("Erro: Já foi cadastrado um usuário com esse NIF ou Email")
            } else {
                erro("Erro: Cadastro inválido.\nVerifique os campos")
            }
        }
    }

    if (url == "http://localhost:8080/api/user/login") {
        request.onload = function () {
            if (request.status == 200) {
                let token = this.responseText

                token = token.replace('{"token":"', "")
                token = token.replace('"}', "")

                sessionStorage.setItem("token", token)
                let id = sendId()

                let usuario = fazGet("http://localhost:8080/api/user/" + id)
                usuario = JSON.parse(usuario)

                if (usuario.contLogin == 1) {
                    history.push("/Help")
                    refresh("login")
                } else {
                    history.push("/Principal")
                    refresh("login")
                }

            } else if (request.status == 401) {
                erro("Erro: Senha ou NIF incorretos")
            } else if (request.status == 404) {
                erro("Erro: Esse usuário não existe")
            }
        }
    }
    return request.responseText
}

/* FAZ GET --- Pega um objeto do back-end por meio de uma url e o retorna */
export function fazGet(url) {
    let request = new XMLHttpRequest()
    request.open("GET", url, false)
    request.setRequestHeader("Authorization", sessionStorage.getItem("token"))

    request.send()
    return request.responseText
}

window.onload = function () {
    var reloading = sessionStorage.getItem("reloading");
    if (reloading == "login") {
        sucesso("Usuário Logado com sucesso!!")
        sessionStorage.removeItem("reloading");
    } else if (reloading == "cadastro") {
        sucesso("Usuário Cadastrado com sucesso")
        sessionStorage.removeItem("reloading");
    } else if (reloading == "alteracao") {
        sucesso("Alteração realizada com sucesso!!")
        sessionStorage.removeItem("reloading")
    } else if (reloading == "reserva") {
        sucesso("Reserva Cadastrada com sucesso")
        sessionStorage.removeItem("reloading")
    } else if (reloading == "delete") {
        sucesso("Usuário deletado com sucesso")
        sessionStorage.removeItem("reloading")
    } else if (reloading == "delete") {
        sucesso("Exclusão feita com sucesso")
        sessionStorage.removeItem("reloading")
    }
}


export function fazPut(url, body) {
    let request = new XMLHttpRequest()
    request.open("PUT", url, true)

    request.setRequestHeader("Content-type", "application/json")
    request.setRequestHeader("Authorization", sessionStorage.getItem("token"))
    request.setRequestHeader("Access-Control-Allow-Methods", "PUT")
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.send(JSON.stringify(body))

    let id = sendId();

    if (url == "http://localhost:8080/api/user/" + id) {
        request.onload = function () {
            if (request.status === 200) {
                refresh("alteracao")
            } else {
                erro("Ocorreu um erro ao Alterar tente novamente")
            }
        }
    }

    let idReserva = document.getElementById("idAlterar").value

    if (url == "http://localhost:8080/api/reservation/" + idReserva) {
        request.onload = function () {
            if (request.status === 200) {
                refresh("alteracao")
            } else if (request.status == 406 || request.status == 400) {
                erro("Erro: Data ou horário inválido, verifique os campos ")
            } else {
                erro("Ocorreu um erro ao Alterar tente novamente")
            }
        }
    }
}

export function fazDelete(url) {
    let request = new XMLHttpRequest()
    request.open("DELETE", url, true)
    request.setRequestHeader("Content-type", "application/json")
    request.setRequestHeader("Authorization", sessionStorage.getItem("token"))
    request.setRequestHeader("Access-Control-Allow-Methods", "DELETE")
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.send()


    let id = sendId()
    if (url == "http://localhost:8080/api/user/" + id) {
        request.onload = function () {

            if (request.status === 200) {
                sucesso("Exclusão realizada com sucesso")
                sessionStorage.removeItem('token')
                history.push("/")
            }
            else {
                erro("Ocorreu um erro, este usuário possuí reservas cadastradas")
            }
        }
    }


}

/*  USUÁRIO */

//Cadastro de Usuário
export default function cadastraUsuario(event) {
    event.preventDefault()
    const url = "http://localhost:8080/api/user/cadastrar"

    let nif = document.getElementById("nif").value
    let nome = document.getElementById("nome").value
    let email = document.getElementById("email").value
    let senha = document.getElementById("senha").value
    let type = document.getElementById("type").value

    var body = {
        "nif": nif,
        "nome": nome,
        "email": email,
        "senha": senha,
        "type": type,
    }

    fazPost(url, body)
    sendingEmailCadastroUser(nif, email, senha)
}

//Login de Usuário
export function login(event) {
    event.preventDefault()
    if (sessionStorage.getItem("token") == null) {
        let url = ("http://localhost:8080/api/user/login");
        let nif = document.getElementById("loginNif").value
        let senha = document.getElementById("loginSenha").value
        var body = {
            "nif": nif,
            "senha": senha,
        }
        fazPost(url, body)
    } else {
        erro("Erro:Você já está Logado")
    }
}

//Logout de Usuário
export function logout() {
    let token = sessionStorage.getItem("token")
    if (token) {
        sessionStorage.removeItem("token")
        sucesso("Usuário Deslogado")
        history.push("/")
    } else {
        erro("Você não está logado")
    }
}

//Pega todos os Usuários do Banco de Dados sendo Admin ou Comum
export function pegaTodosUsuarios() {
    setTimeout(() => {
        let data = fazGet("http://localhost:8080/api/user/lista");
        let users = JSON.parse(data)
        let lista = document.getElementById("listaUsuarios")
        if (lista.childElementCount == 0) {
            for (let i = 0; i < users.length; i++) {
                let usuario = users[i];
                const linha = document.createElement("tr")
                let nome = document.createElement("td")
                let tipo = document.createElement("td")
                nome.innerHTML = usuario.nome
                tipo.innerHTML = usuario.type
                linha.appendChild(nome)
                linha.appendChild(tipo)
                lista.appendChild(linha)
            }
        }
    }, 1);
}

//Pega todos os Usuários do tipo Comum
export function listaUsuariosComuns() {
    setTimeout(() => {
        let data = fazGet("http://localhost:8080/api/user/verifica")
        let users = JSON.parse(data)
        let lista = document.getElementById("lista")


        if (lista.childElementCount == 0) {
            for (let i = 0; i < users.length; i++) {
                let usuario = users[i]
                const linha = document.createElement("tr")

                const tdId = document.createElement("td")
                tdId.innerHTML = usuario.id
                linha.appendChild(tdId)

                const tdNif = document.createElement("td")
                tdNif.innerHTML = usuario.nif
                linha.appendChild(tdNif)

                const tdNome = document.createElement("td")
                tdNome.innerHTML = usuario.nome
                linha.appendChild(tdNome)

                const tdEmail = document.createElement("td")
                tdEmail.innerHTML = usuario.email
                linha.appendChild(tdEmail)

                const tdExcluir = document.createElement("td")
                let btn_delete = document.createElement("button")
                btn_delete.innerHTML = "X"

                btn_delete.addEventListener('click', function () {
                    let id = usuario.id

                    let url = ("http://localhost:8080/api/user/" + id);
                    fazDelete(url)
                    refresh()
                })

                tdExcluir.appendChild(btn_delete)
                linha.append(tdExcluir)

                lista.appendChild(linha)
            }
        }
    }, 1);
}

export function excluirUsuario() {
    let id = document.getElementById("id").value
    let url = ("http://localhost:8080/api/user/" + id);
    fazDelete(url)
    FecharConfirmacao()
}

//pega o tipo do usuario logado
export function decodaToken() {
    let data = fazGet("http://localhost:8080/api/user/decodaToken")

    return data
}

export function sendId() {
    let data = fazGet("http://localhost:8080/api/user/sendId")

    return data
}

export function sendingEmail(dataInicio, dataTermino) {
    let idUser = sendId()
    let data = fazGet("http://localhost:8080/api/user/" + idUser)

    let user = JSON.parse(data)
    let nome = user.nome
    let url = ("http://localhost:8080/api/email/sending-email");
    var body = {
        "ownerRef": nome,
        "emailFrom": "auditorio_senai@yahoo.com",
        "emailTo": "andrerodrisantos15@gmail.com",
        "subject": "Reservar do Auditorio",
        "text": "Eu " + nome + " estou enviando esse email para solicitar uma reserva no auditorio, acesse esse link para o site http://localhost:3000/Principal, data inicio: " + dataInicio + " data termino: " + dataTermino
    }
    fazPost(url, body)

}

export function sendingEmailUser(justificativa, email) {
    let idUser = sendId()
    let data = fazGet("http://localhost:8080/api/user/" + idUser)

    let user = JSON.parse(data)
    let nome = user.nome
    let url = ("http://localhost:8080/api/email/sending-email");

    var body = {
        "ownerRef": nome,
        "emailFrom": "auditorio_senai@yahoo.com",
        "emailTo": email,
        "subject": "Reserva Recusada",
        "text": "Sua reserva foi recusada por " + nome + ", pois: " + justificativa
    }
    fazPost(url, body)
}

export function sendingEmailConfirmada(email) {
    let idUser = sendId()
    let data = fazGet("http://localhost:8080/api/user/" + idUser)

    let user = JSON.parse(data)
    let nome = user.nome
    let url = ("http://localhost:8080/api/email/sending-email");

    var body = {
        "ownerRef": nome,
        "emailFrom": "auditorio_senai@yahoo.com",
        "emailTo": email,
        "subject": "Reserva Confirmada",
        "text": "Sua Reserva Foi Confirmada por " + nome
    }
    fazPost(url, body)
}
export function sendingEmailAlterar(id) {
    let idUser = sendId()
    let data = fazGet("http://localhost:8080/api/user/" + idUser)

    let user = JSON.parse(data)
    let nome = user.nome
    let url = ("http://localhost:8080/api/email/sending-email");
    var body = {
        "ownerRef": nome,
        "emailFrom": "auditorio_senai@yahoo.com",
        "emailTo": "brunoviniciuslink7@gmail.com",
        "subject": "Alterar Reservar do Auditorio",
        "text": "Eu " + nome + " estou enviando esse email para alterar uma reserva de numero " + id + " no auditório , acesse esse link para o site http://localhost:3000/Principal, para confirmar a Reserva"
    }
    fazPost(url, body)

}

export function sendingEmailCadastroUser(nif, email, senha) {
    let idUser = sendId()

    let data = fazGet("http://localhost:8080/api/user/" + idUser)

    let user = JSON.parse(data)
    let nome = user.nome
    let url = ("http://localhost:8080/api/email/sending-email");
    var body = {
        "ownerRef": nome,
        "emailFrom": "auditorio_senai@yahoo.com",
        "emailTo": email,
        "subject": "Cadastro de Usuário",
        "text": "Seu cadastro foi realizado com sucesso, suas credenciais são. nif: " + nif + ", senha: " + senha
    }
    fazPost(url, body)
}

export function pegaUsuario() {
    setTimeout(() => {
        let id = sendId()
        let data = fazGet("http://localhost:8080/api/user/" + id)
        let usuario = JSON.parse(data)

        let inputId = document.getElementById("id")
        let inputType = document.getElementById("tipo")
        let inputNome = document.getElementById("nome")
        let inputEmail = document.getElementById("email")
        let inputNif = document.getElementById("nif")
        let inputCont = document.getElementById("contLogin")

        inputType.value = usuario.type
        inputCont.value = usuario.contLogin
        inputId.value = usuario.id
        inputNome.value = usuario.nome
        inputEmail.value = usuario.email
        inputNif.value = usuario.nif


        return usuario

    }, 5);
}

export function pesquisaReserva(event) {
    event.preventDefault();
    const p = document.getElementById("pesquisa").value

    setTimeout(() => {
        let reservas = fazGet("http://localhost:8080/api/reservation/findbyall/" + p)
        reservas = JSON.parse(reservas)

        const lista = document.getElementById("listaPesquisaBody")

        if (reservas.length > 0) {

            const linhas = document.querySelectorAll("#listaPesquisaBody > *")

            if (linhas.length > 0) {
                for (let l = 0; l < linhas.length; l++) {
                    linhas[l].remove()
                }
            }

            const divLista = document.getElementById("listaPesquisa")
            divLista.style.display = "flex"

            const divListaPesquisa = document.getElementById("lista")
            divListaPesquisa.style.display = "none"

            const x = document.getElementById("fecharPesquisa")
            x.style.visibility = "visible"

            for (let i = 0; i < reservas.length; i++) {
                const reserva = reservas[i]
                const linha = document.createElement("tr")

                const id = document.createElement("td")
                id.innerHTML = reserva.id
                linha.appendChild(id)

                const titulo = document.createElement("td")
                titulo.innerHTML = reserva.titulo
                linha.appendChild(titulo)

                const tdData = document.createElement("td")
                tdData.style.color = "gray"

                let dataInicio = (JSON.stringify(reserva.dataInicio))
                let horaInicio = dataInicio.substring(12, 17)
                dataInicio = dataInicio.substring(1, 11)

                /* CHAMANDO O METODO DE FORMATAR JÁ ATRIBUINDO A VARIAVEL*/
                dataInicio = dataFormatada(dataInicio)
                horaInicio = formataHora(horaInicio)

                let dataTermino = (JSON.stringify(reserva.dataTermino))
                let horaTermino = dataTermino.substring(12, 17)
                dataTermino = dataTermino.substring(1, 11)

                /* CHAMANDO O METODO DE FORMATAR JÁ ATRIBUINDO A VARIAVEL*/
                dataTermino = dataFormatada(dataTermino)
                horaTermino = formataHora(horaTermino)

                tdData.innerHTML = dataInicio + "  -  " + dataTermino
                tdData.style.textAlign = "center"
                linha.appendChild(tdData)

                const user = document.createElement("td")
                user.innerHTML = reserva.usuario.nome
                linha.appendChild(user)

                //status da reserva
                const status = document.createElement("td")
                status.innerHTML = reserva.status
                status.style.fontWeight = "bold"
                status.style.textAlign = "center"

                if (reserva.status === "CONFIRMADO") {
                    status.style.color = "#56AF5A"
                    status.title = "Confirmado"
                } else if (reserva.status === "FINALIZADO") {
                    status.style.color = "tomato"
                    status.title = "Finalizado"
                } else {
                    status.style.color = "#fccd32"
                    status.title = "Em análise"
                }

                linha.appendChild(status)

                const tdBtn = document.createElement("td")
                tdBtn.classList.add("dropdown")
                const dropBtn = document.createElement("button")
                dropBtn.classList.add("dropbtn")
                const divDrop = document.createElement("div")
                divDrop.classList.add("dropdown_content")
                dropBtn.innerHTML = "..."

                const usuario = reserva.usuario


                //Se for Admin
                if (isAuthenticatedAdmin() == true) {
                    if (status.textContent == "ANALISE") {
                        let id = sendId()

                        const confirmar = document.createElement("a")
                        confirmar.innerHTML = "Confirmar"

                        const recusar = document.createElement("a")
                        recusar.innerHTML = "Recusar"

                        const detalhes = document.createElement("a")
                        detalhes.innerHTML = "Detalhes"

                        divDrop.appendChild(confirmar)

                        if (usuario.id == id) {
                            const alterar = document.createElement("a")
                            alterar.innerHTML = "Alterar"
                            divDrop.appendChild(alterar)

                            alterar.addEventListener('click', function () {
                                let id = reserva.id

                                let dataInicio = reserva.dataInicio
                                let horaInicio = dataInicio.substring(11, 17)
                                dataInicio = dataInicio.substring(0, 11)
                                horaInicio = formataHora(horaInicio)
                                dataInicio = dataInicio + horaInicio

                                let dataTermino = reserva.dataTermino
                                let horaTermino = dataTermino.substring(11, 17)
                                dataTermino = dataTermino.substring(0, 11)
                                horaTermino = formataHora(horaTermino)
                                dataTermino = dataTermino + horaTermino

                                const usuario = reserva.usuario
                                document.getElementById("idAlterar").value = id
                                document.getElementById("dataInicioAlterar").value = dataInicio
                                document.getElementById("dataTerminoAlterar").value = dataTermino
                                document.getElementById("participantesAlterar").innerHTML = reserva.participantes
                                document.getElementById("myRangeAlterar").value = reserva.participantes
                                document.getElementById("tituloAlterar").value = reserva.titulo
                                document.getElementById("usuarioAlterar").value = usuario.id
                                document.getElementById("descricaoAlterar").value = reserva.descricao

                                

                                ConfirmacaoAlterar()
                                sendingEmailAlterar(id)
                            })
                        }

                        divDrop.appendChild(recusar)
                        divDrop.appendChild(detalhes)

                        confirmar.addEventListener('click', function () {
                            let id = reserva.id
                            
                            confirmarReserva(id)
                            sendingEmailConfirmada(usuario.email)
                            refresh()
                        })

                        recusar.addEventListener('click', function () {
                            let id = reserva.id
                            ConfirmacaoJust()
                            const enviar = document.getElementById("enviar")
                            document.getElementById("justificativa").focus();

                            enviar.addEventListener('click', function () {
                                
                                let url = ("http://localhost:8080/api/reservation/deleta/" + id)
                                const just = document.getElementById("justificativa").value
                                const email = usuario.email
                                sendingEmailUser(just, email)
                                fazDelete(url)
                                refresh()
                            })
                        })

                        detalhes.addEventListener('click', function () {
                            ConfirmacaoDetalhes()
                            
                            document.getElementById("id").innerHTML = reserva.id
                            document.getElementById("titulo_reserva").innerHTML = reserva.titulo
                            document.getElementById("data").innerHTML = dataInicio + " - " + dataTermino
                            document.getElementById("hora").innerHTML = horaInicio + " - " + horaTermino
                            document.getElementById("descricao_reserva").innerHTML = reserva.descricao
                            document.getElementById("nome").innerHTML = usuario.nome
                            document.getElementById("email").innerHTML = usuario.email
                            let status = document.getElementById("status")
                            status.style.cursor = "pointer"

                            if (reserva.status === "CONFIRMADO") {
                                status.style.backgroundColor = "#56AF5A"
                                status.title = "Confirmado"
                            } else if (reserva.status === "FINALIZADO") {
                                status.style.backgroundColor = "tomato"
                                status.title = "Finalizado"
                            } else {
                                status.style.backgroundColor = "#fccd32"
                                status.title = "Em análise"
                            }
                            let disponivel = 118 - parseInt(reserva.participantes)
                            state.datasets[0].data[0] = disponivel;
                            state.datasets[0].data[1] = parseInt(reserva.participantes);
                        })

                    } else if (status.textContent == "CONFIRMADO") {
                        let id = sendId()
                        const recusar = document.createElement("a")
                        recusar.innerHTML = "Cancelar"

                        const detalhes = document.createElement("a")
                        detalhes.innerHTML = "Detalhes"

                        divDrop.appendChild(recusar)

                        if (usuario.id == id) {
                            const alterar = document.createElement("a")
                            alterar.innerHTML = "Alterar"
                            divDrop.appendChild(alterar)

                            alterar.addEventListener('click', function () {
                                let id = reserva.id

                                let dataInicio = reserva.dataInicio
                                let horaInicio = dataInicio.substring(11, 17)
                                dataInicio = dataInicio.substring(0, 11)
                                horaInicio = formataHora(horaInicio)
                                dataInicio = dataInicio + horaInicio

                                let dataTermino = reserva.dataTermino
                                let horaTermino = dataTermino.substring(11, 17)
                                dataTermino = dataTermino.substring(0, 11)
                                horaTermino = formataHora(horaTermino)
                                dataTermino = dataTermino + horaTermino

                                const usuario = reserva.usuario

                                document.getElementById("idAlterar").value = id
                                document.getElementById("dataInicioAlterar").value = dataInicio
                                document.getElementById("dataTerminoAlterar").value = dataTermino
                                document.getElementById("participantesAlterar").innerHTML = reserva.participantes
                                document.getElementById("myRangeAlterar").value = reserva.participantes
                                document.getElementById("tituloAlterar").value = reserva.titulo
                                document.getElementById("usuarioAlterar").value = usuario.id
                                document.getElementById("descricaoAlterar").value = reserva.descricao

                                ConfirmacaoAlterar()
                                sendingEmailAlterar(id)
                            })
                        }

                        divDrop.appendChild(detalhes)

                        recusar.addEventListener('click', function () {
                            let id = reserva.id
                            ConfirmacaoJust()
                            const enviar = document.getElementById("enviar")
                            document.getElementById("justificativa").focus();

                            enviar.addEventListener('click', function () {
                                
                                let url = ("http://localhost:8080/api/reservation/deleta/" + id)
                                const just = document.getElementById("justificativa").value
                                const email = usuario.email
                                sendingEmailUser(just, email)
                                fazDelete(url)
                                refresh()
                            })
                        })

                        detalhes.addEventListener('click', function () {
                            ConfirmacaoDetalhes()
                            
                            document.getElementById("id").innerHTML = reserva.id
                            document.getElementById("titulo_reserva").innerHTML = reserva.titulo
                            document.getElementById("data").innerHTML = dataInicio + " - " + dataTermino
                            document.getElementById("hora").innerHTML = horaInicio + " - " + horaTermino
                            document.getElementById("descricao_reserva").innerHTML = reserva.descricao
                            document.getElementById("nome").innerHTML = usuario.nome
                            document.getElementById("email").innerHTML = usuario.email
                            let status = document.getElementById("status")
                            status.style.cursor = "pointer"

                            if (reserva.status === "CONFIRMADO") {
                                status.style.backgroundColor = "#56AF5A"
                                status.title = "Confirmado"
                            } else if (reserva.status === "FINALIZADO") {
                                status.style.backgroundColor = "tomato"
                                status.title = "Finalizado"
                            } else {
                                status.style.backgroundColor = "#fccd32"
                                status.title = "Em análise"
                            }
                            let disponivel = 118 - parseInt(reserva.participantes)
                            state.datasets[0].data[0] = disponivel;
                            state.datasets[0].data[1] = parseInt(reserva.participantes);
                        })

                    } else {
                        const detalhes = document.createElement("a")
                        detalhes.innerHTML = "Detalhes"
                        divDrop.appendChild(detalhes)

                        detalhes.addEventListener('click', function () {
                            ConfirmacaoDetalhes()
                            
                            document.getElementById("id").innerHTML = reserva.id
                            document.getElementById("titulo_reserva").innerHTML = reserva.titulo
                            document.getElementById("data").innerHTML = dataInicio + " - " + dataTermino
                            document.getElementById("hora").innerHTML = horaInicio + " - " + horaTermino
                            document.getElementById("descricao_reserva").innerHTML = reserva.descricao
                            document.getElementById("nome").innerHTML = usuario.nome
                            document.getElementById("email").innerHTML = usuario.email
                            let status = document.getElementById("status")
                            status.style.cursor = "pointer"

                            if (reserva.status === "CONFIRMADO") {
                                status.style.backgroundColor = "#56AF5A"
                                status.title = "Confirmado"
                            } else if (reserva.status === "FINALIZADO") {
                                status.style.backgroundColor = "tomato"
                                status.title = "Finalizado"
                            } else {
                                status.style.backgroundColor = "#fccd32"
                                status.title = "Em análise"
                            }
                            let disponivel = 118 - parseInt(reserva.participantes)
                            state.datasets[0].data[0] = disponivel;
                            state.datasets[0].data[1] = parseInt(reserva.participantes);
                        })
                    }
                }//Se não, é comum ou usuario não logado
                else {
                    let id = sendId()
                    if (usuario.id == id) {
                        const recusar = document.createElement("a")
                        recusar.innerHTML = "Cancelar"

                        const alterar = document.createElement("a")
                        alterar.innerHTML = "Alterar"

                        const detalhes = document.createElement("a")
                        detalhes.innerHTML = "Detalhes"

                        divDrop.appendChild(recusar)
                        divDrop.appendChild(alterar)
                        divDrop.appendChild(detalhes)

                        recusar.addEventListener('click', function () {
                            let id = reserva.id
                            let url = ("http://localhost:8080/api/reservation/deleta/" + id)
                            let idIgual = reserva.usuario.id
                            let userId = sendId()
                            if (userId == idIgual) {
                                fazDelete(url)
                                refresh()
                            } else {
                                erro("Voce não pode excluir essa reserva");
                            }
                        })

                        alterar.addEventListener('click', function () {
                            let id = reserva.id

                            let dataInicio = reserva.dataInicio
                            let horaInicio = dataInicio.substring(11, 17)
                            dataInicio = dataInicio.substring(0, 11)
                            horaInicio = formataHora(horaInicio)
                            dataInicio = dataInicio + horaInicio

                            let dataTermino = reserva.dataTermino
                            let horaTermino = dataTermino.substring(11, 17)
                            dataTermino = dataTermino.substring(0, 11)
                            horaTermino = formataHora(horaTermino)
                            dataTermino = dataTermino + horaTermino

                            const usuario = reserva.usuario

                            document.getElementById("idAlterar").value = id
                            document.getElementById("dataInicioAlterar").value = dataInicio
                            document.getElementById("dataTerminoAlterar").value = dataTermino
                            document.getElementById("participantesAlterar").innerHTML = reserva.participantes
                            document.getElementById("myRangeAlterar").value = reserva.participantes
                            document.getElementById("tituloAlterar").value = reserva.titulo
                            document.getElementById("usuarioAlterar").value = usuario.id
                            document.getElementById("descricaoAlterar").value = reserva.descricao

                            ConfirmacaoAlterar()
                            sendingEmailAlterar(id)
                        })

                        detalhes.addEventListener('click', function () {
                            ConfirmacaoDetalhes()
                            
                            document.getElementById("id").innerHTML = reserva.id
                            document.getElementById("titulo_reserva").innerHTML = reserva.titulo
                            document.getElementById("data").innerHTML = dataInicio + " - " + dataTermino
                            document.getElementById("hora").innerHTML = horaInicio + " - " + horaTermino
                            document.getElementById("descricao_reserva").innerHTML = reserva.descricao
                            document.getElementById("nome").innerHTML = usuario.nome
                            document.getElementById("email").innerHTML = usuario.email
                            let status = document.getElementById("status")
                            status.style.cursor = "pointer"

                            if (reserva.status === "CONFIRMADO") {
                                status.style.backgroundColor = "#56AF5A"
                                status.title = "Confirmado"
                            } else if (reserva.status === "FINALIZADO") {
                                status.style.backgroundColor = "tomato"
                                status.title = "Finalizado"
                            } else {
                                status.style.backgroundColor = "#fccd32"
                                status.title = "Em análise"
                            }
                            let disponivel = 118 - parseInt(reserva.participantes)
                            state.datasets[0].data[0] = disponivel;
                            state.datasets[0].data[1] = parseInt(reserva.participantes);
                        })

                    } else {
                        const detalhes = document.createElement("a")
                        detalhes.innerHTML = "Detalhes"

                        divDrop.appendChild(detalhes)

                        detalhes.addEventListener('click', function () {
                            ConfirmacaoDetalhes()
                            
                            document.getElementById("id").innerHTML = reserva.id
                            document.getElementById("titulo_reserva").innerHTML = reserva.titulo
                            document.getElementById("data").innerHTML = dataInicio + " - " + dataTermino
                            document.getElementById("hora").innerHTML = horaInicio + " - " + horaTermino
                            document.getElementById("descricao_reserva").innerHTML = reserva.descricao
                            document.getElementById("nome").innerHTML = usuario.nome
                            document.getElementById("email").innerHTML = usuario.email
                            let status = document.getElementById("status")
                            status.style.cursor = "pointer"

                            if (reserva.status === "CONFIRMADO") {
                                status.style.backgroundColor = "#56AF5A"
                                status.title = "Confirmado"
                            } else if (reserva.status === "FINALIZADO") {
                                status.style.backgroundColor = "tomato"
                                status.title = "Finalizado"
                            } else {
                                status.style.backgroundColor = "#fccd32"
                                status.title = "Em análise"
                            }
                            let disponivel = 118 - parseInt(reserva.participantes)
                            state.datasets[0].data[0] = disponivel;
                            state.datasets[0].data[1] = parseInt(reserva.participantes);
                        })
                    }
                }

                tdBtn.appendChild(dropBtn)
                tdBtn.appendChild(divDrop)
                tdBtn.appendChild(dropBtn)
                linha.appendChild(tdBtn)

                lista.appendChild(linha)
            }
        } else {
            erro("Não existem resultados para está pesquisa")
        }
    }, 5);
}

export function pesquisaUsuario(event) {
    event.preventDefault();
    const p = document.getElementById("pesquisa").value

    setTimeout(() => {
        let usuarios = fazGet("http://localhost:8080/api/user/findusuario/" + p)
        usuarios = JSON.parse(usuarios)

        const lista = document.getElementById("listaPesquisaBody")

        if (usuarios.length > 0) {

            const linhas = document.querySelectorAll("#listaPesquisaBody > *")

            if (linhas.length > 0) {
                for (let l = 0; l < linhas.length; l++) {
                    linhas[l].remove()
                }
            }

            const divLista = document.getElementById("listaPesquisa")
            divLista.style.display = "flex"

            const divListaPesquisa = document.getElementById("lista")
            divListaPesquisa.style.display = "none"

            const x = document.getElementById("fecharPesquisa")
            x.style.visibility = "visible"

            for (let i = 0; i < usuarios.length; i++) {
                const usuario = usuarios[i]
                const linha = document.createElement("tr")

                const tdId = document.createElement("td")
                tdId.innerHTML = usuario.id
                linha.appendChild(tdId)

                const tdNif = document.createElement("td")
                tdNif.innerHTML = usuario.nif
                linha.appendChild(tdNif)

                const tdNome = document.createElement("td")
                tdNome.innerHTML = usuario.nome
                linha.appendChild(tdNome)

                const tdEmail = document.createElement("td")
                tdEmail.innerHTML = usuario.email
                linha.appendChild(tdEmail)

                const tdExcluir = document.createElement("td")
                let btn_delete = document.createElement("button")
                btn_delete.innerHTML = "X"

                btn_delete.addEventListener('click', function () {
                    let id = usuario.id
                    
                    let url = ("http://localhost:8080/api/user/" + id);
                    fazDelete(url)
                    refresh()
                })

                tdExcluir.appendChild(btn_delete)
                linha.append(tdExcluir)

                lista.appendChild(linha)
            }
        } else {
            erro("Não existem resultados para está pesquisa")
        }

    }, 5);
}

export function alteraUsuario(event) {
    event.preventDefault()
    let id = sendId()
    let url = ("http://localhost:8080/api/user/" + id)

    let nome = document.getElementById("nome").value
    let email = document.getElementById("email").value
    let senha = document.getElementById("senha").value
    let nif = document.getElementById("nif").value
    let tipo = document.getElementById("tipo").value
    let contLogin = document.getElementById("contLogin").value

    var body = {
        "id": id,
        "nif": nif,
        "nome": nome,
        "email": email,
        "contLogin": contLogin,
        "senha": senha,
        "type": tipo
    }

    
    fazPut(url, body)
}


/* RESERVAS */

//Salva uma Reserva
export function reserva(event) {
    event.preventDefault();
    let url = ("http://localhost:8080/api/reservation/save");
    let titulo = document.getElementById("titulo").value
    let descricao = document.getElementById("descricao").value
    let dataInicio = document.getElementById("dataInicio").value
    let dataTermino = document.getElementById("dataTermino").value
    let participantes = document.getElementById("participantes").textContent

    var body = {
        "titulo": titulo,
        "descricao": descricao,
        "dataInicio": dataInicio,
        "dataTermino": dataTermino,
        "participantes": participantes
    }

    dataInicio = dataInicio.substring(0, 10)
    dataTermino = dataTermino.substring(0, 10)

    dataInicio = dataFormatada(dataInicio)
    dataTermino = dataFormatada(dataTermino)

    fazPost(url, body)
    sendingEmail(dataInicio, dataTermino)
}

let listaCriada = false

export function refresh(r) {
    sessionStorage.setItem("reloading", r);
    window.location.reload()
}

export function formataHora(h) {

    let hora = h.substring(0, 2) + ""
    let minuto = h.substring(3, 6)
    if (hora == "00") {
        hora = "21"
    } else if (hora == "01") {
        hora = "22"
    } else {
        hora = hora - 3 + ""
    }

    if (hora.length == 1) {
        hora = "0" + hora
    }

    let horaFormatada = hora + ":" + minuto
    return horaFormatada
}

//Constrói a lista de Reservas
export function listaReservas() {
    setTimeout(() => {
        let data = fazGet("http://localhost:8080/api/reservation")
        let reservas = JSON.parse(data)

        //Pegando todas as Tabelas de cada mês
        let jan = document.getElementById("Janeiro")
        let fev = document.getElementById("Fevereiro")
        let mar = document.getElementById("Marco")
        let abr = document.getElementById("Abril")
        let mai = document.getElementById("Maio")
        let jun = document.getElementById("Junho")
        let jul = document.getElementById("Julho")
        let ago = document.getElementById("Agosto")
        let set = document.getElementById("Setembro")
        let out = document.getElementById("Outubro")
        let nov = document.getElementById("Novembro")
        let dez = document.getElementById("Dezembro")

        //Verifica se a lista já foi feita
        if (listaCriada == false) {

            //faz um for para percorrer cada reserva e criar uma linha para cada delas
            for (let i = 0; i < reservas.length; i++) {
                let reserva = reservas[i]
                const linha = document.createElement("tr")

                //Id da Reserva
                const tdId = document.createElement("td")
                tdId.innerHTML = reserva.id
                linha.appendChild(tdId)

                //Título da Reserva
                const tdTitulo = document.createElement("td")
                tdTitulo.innerHTML = reserva.titulo
                tdTitulo.style.textAlign = "center"
                linha.appendChild(tdTitulo)

                //Data da Reserva formatada e separada do horário
                const tdData = document.createElement("td")
                tdData.style.color = "gray"

                let dataInicio = (JSON.stringify(reserva.dataInicio))
                let horaInicio = dataInicio.substring(12, 17)
                dataInicio = dataInicio.substring(1, 11)

                /* CHAMANDO O METODO DE FORMATAR JÁ ATRIBUINDO A VARIAVEL*/
                dataInicio = dataFormatada(dataInicio)
                horaInicio = formataHora(horaInicio)

                let dataTermino = (JSON.stringify(reserva.dataTermino))
                let horaTermino = dataTermino.substring(12, 17)
                dataTermino = dataTermino.substring(1, 11)

                /* CHAMANDO O METODO DE FORMATAR JÁ ATRIBUINDO A VARIAVEL*/
                dataTermino = dataFormatada(dataTermino)
                horaTermino = formataHora(horaTermino)

                tdData.innerHTML = dataInicio + "  -  " + dataTermino + "<br/>" + horaInicio + "  -  " + horaTermino
                tdData.style.textAlign = "center"
                linha.appendChild(tdData)

                //status da reserva
                const status = document.createElement("td")
                status.innerHTML = reserva.status
                status.style.fontWeight = "bold"
                status.style.textAlign = "center"
                linha.appendChild(status)

                //Usuario nome
                let usuario = reserva.usuario
                const tdUsuario = document.createElement("td")
                tdUsuario.style.textAlign = "center"
                tdUsuario.innerHTML = "Feito por: " + usuario.nome
                linha.appendChild(tdUsuario)

                const tdBtn = document.createElement("td")
                tdBtn.classList.add("dropdown")
                const dropBtn = document.createElement("button")
                dropBtn.classList.add("dropbtn")
                const divDrop = document.createElement("div")
                divDrop.classList.add("dropdown_content")
                dropBtn.innerHTML = "..."

                //Se for Admin
                if (isAuthenticatedAdmin() == true) {
                    if (status.textContent == "ANALISE") {
                        let id = sendId()

                        const confirmar = document.createElement("a")
                        confirmar.innerHTML = "Confirmar"

                        const recusar = document.createElement("a")
                        recusar.innerHTML = "Recusar"

                        const detalhes = document.createElement("a")
                        detalhes.innerHTML = "Detalhes"

                        divDrop.appendChild(confirmar)

                        if (usuario.id == id) {
                            const alterar = document.createElement("a")
                            alterar.innerHTML = "Alterar"
                            divDrop.appendChild(alterar)

                            alterar.addEventListener('click', function () {
                                let id = reserva.id

                                let dataInicio = reserva.dataInicio
                                let horaInicio = dataInicio.substring(11, 17)
                                dataInicio = dataInicio.substring(0, 11)
                                horaInicio = formataHora(horaInicio)
                                dataInicio = dataInicio + horaInicio

                                let dataTermino = reserva.dataTermino
                                let horaTermino = dataTermino.substring(11, 17)
                                dataTermino = dataTermino.substring(0, 11)
                                horaTermino = formataHora(horaTermino)
                                dataTermino = dataTermino + horaTermino

                                const usuario = reserva.usuario
                                document.getElementById("idAlterar").value = id
                                document.getElementById("dataInicioAlterar").value = dataInicio
                                document.getElementById("dataTerminoAlterar").value = dataTermino
                                document.getElementById("participantesAlterar").innerHTML = reserva.participantes
                                document.getElementById("myRangeAlterar").value = reserva.participantes
                                document.getElementById("tituloAlterar").value = reserva.titulo
                                document.getElementById("usuarioAlterar").value = usuario.id
                                document.getElementById("descricaoAlterar").value = reserva.descricao

                                

                                ConfirmacaoAlterar()
                                sendingEmailAlterar(id)
                            })
                        }

                        divDrop.appendChild(recusar)
                        divDrop.appendChild(detalhes)

                        confirmar.addEventListener('click', function () {
                            let id = reserva.id
                            
                            confirmarReserva(id)
                            sendingEmailConfirmada(usuario.email)
                            refresh()
                        })

                        recusar.addEventListener('click', function () {
                            let id = reserva.id
                            ConfirmacaoJust()
                            const enviar = document.getElementById("enviar")
                            document.getElementById("justificativa").focus();

                            enviar.addEventListener('click', function () {
                                
                                let url = ("http://localhost:8080/api/reservation/deleta/" + id)
                                const just = document.getElementById("justificativa").value
                                const email = usuario.email
                                sendingEmailUser(just, email)
                                fazDelete(url)
                                refresh()
                            })
                        })

                        detalhes.addEventListener('click', function () {
                            ConfirmacaoDetalhes()
                            
                            document.getElementById("id").innerHTML = reserva.id
                            document.getElementById("titulo_reserva").innerHTML = reserva.titulo
                            document.getElementById("data").innerHTML = dataInicio + " - " + dataTermino
                            document.getElementById("hora").innerHTML = horaInicio + " - " + horaTermino
                            document.getElementById("descricao_reserva").innerHTML = reserva.descricao
                            document.getElementById("nome").innerHTML = usuario.nome
                            document.getElementById("email").innerHTML = usuario.email
                            let status = document.getElementById("status")
                            status.style.cursor = "pointer"

                            if (reserva.status === "CONFIRMADO") {
                                status.style.backgroundColor = "#56AF5A"
                                status.title = "Confirmado"
                            } else if (reserva.status === "FINALIZADO") {
                                status.style.backgroundColor = "tomato"
                                status.title = "Finalizado"
                            } else {
                                status.style.backgroundColor = "#fccd32"
                                status.title = "Em análise"
                            }
                            let disponivel = 118 - parseInt(reserva.participantes)
                            state.datasets[0].data[0] = disponivel;
                            state.datasets[0].data[1] = parseInt(reserva.participantes);
                        })

                    } else if (status.textContent == "CONFIRMADO") {
                        let id = sendId()
                        const recusar = document.createElement("a")
                        recusar.innerHTML = "Cancelar"

                        const detalhes = document.createElement("a")
                        detalhes.innerHTML = "Detalhes"

                        divDrop.appendChild(recusar)

                        if (usuario.id == id) {
                            const alterar = document.createElement("a")
                            alterar.innerHTML = "Alterar"
                            divDrop.appendChild(alterar)

                            alterar.addEventListener('click', function () {
                                let id = reserva.id

                                let dataInicio = reserva.dataInicio
                                let horaInicio = dataInicio.substring(11, 17)
                                dataInicio = dataInicio.substring(0, 11)
                                horaInicio = formataHora(horaInicio)
                                dataInicio = dataInicio + horaInicio

                                let dataTermino = reserva.dataTermino
                                let horaTermino = dataTermino.substring(11, 17)
                                dataTermino = dataTermino.substring(0, 11)
                                horaTermino = formataHora(horaTermino)
                                dataTermino = dataTermino + horaTermino

                                const usuario = reserva.usuario

                                document.getElementById("idAlterar").value = id
                                document.getElementById("dataInicioAlterar").value = dataInicio
                                document.getElementById("dataTerminoAlterar").value = dataTermino
                                document.getElementById("participantesAlterar").innerHTML = reserva.participantes
                                document.getElementById("myRangeAlterar").value = reserva.participantes
                                document.getElementById("tituloAlterar").value = reserva.titulo
                                document.getElementById("usuarioAlterar").value = usuario.id
                                document.getElementById("descricaoAlterar").value = reserva.descricao

                                ConfirmacaoAlterar()
                                sendingEmailAlterar(id)
                            })
                        }

                        divDrop.appendChild(detalhes)

                        recusar.addEventListener('click', function () {
                            let id = reserva.id
                            ConfirmacaoJust()
                            const enviar = document.getElementById("enviar")
                            document.getElementById("justificativa").focus();

                            enviar.addEventListener('click', function () {
                                
                                let url = ("http://localhost:8080/api/reservation/deleta/" + id)
                                const just = document.getElementById("justificativa").value
                                const email = usuario.email
                                sendingEmailUser(just, email)
                                fazDelete(url)
                                refresh()
                            })
                        })

                        detalhes.addEventListener('click', function () {
                            ConfirmacaoDetalhes()
                            
                            document.getElementById("id").innerHTML = reserva.id
                            document.getElementById("titulo_reserva").innerHTML = reserva.titulo
                            document.getElementById("data").innerHTML = dataInicio + " - " + dataTermino
                            document.getElementById("hora").innerHTML = horaInicio + " - " + horaTermino
                            document.getElementById("descricao_reserva").innerHTML = reserva.descricao
                            document.getElementById("nome").innerHTML = usuario.nome
                            document.getElementById("email").innerHTML = usuario.email
                            let status = document.getElementById("status")
                            status.style.cursor = "pointer"

                            if (reserva.status === "CONFIRMADO") {
                                status.style.backgroundColor = "#56AF5A"
                                status.title = "Confirmado"
                            } else if (reserva.status === "FINALIZADO") {
                                status.style.backgroundColor = "tomato"
                                status.title = "Finalizado"
                            } else {
                                status.style.backgroundColor = "#fccd32"
                                status.title = "Em análise"
                            }
                            let disponivel = 118 - parseInt(reserva.participantes)
                            state.datasets[0].data[0] = disponivel;
                            state.datasets[0].data[1] = parseInt(reserva.participantes);
                        })

                    } else {
                        const detalhes = document.createElement("a")
                        detalhes.innerHTML = "Detalhes"
                        divDrop.appendChild(detalhes)

                        detalhes.addEventListener('click', function () {
                            ConfirmacaoDetalhes()
                            
                            document.getElementById("id").innerHTML = reserva.id
                            document.getElementById("titulo_reserva").innerHTML = reserva.titulo
                            document.getElementById("data").innerHTML = dataInicio + " - " + dataTermino
                            document.getElementById("hora").innerHTML = horaInicio + " - " + horaTermino
                            document.getElementById("descricao_reserva").innerHTML = reserva.descricao
                            document.getElementById("nome").innerHTML = usuario.nome
                            document.getElementById("email").innerHTML = usuario.email
                            let status = document.getElementById("status")
                            status.style.cursor = "pointer"

                            if (reserva.status === "CONFIRMADO") {
                                status.style.backgroundColor = "#56AF5A"
                                status.title = "Confirmado"
                            } else if (reserva.status === "FINALIZADO") {
                                status.style.backgroundColor = "tomato"
                                status.title = "Finalizado"
                            } else {
                                status.style.backgroundColor = "#fccd32"
                                status.title = "Em análise"
                            }
                            let disponivel = 118 - parseInt(reserva.participantes)
                            state.datasets[0].data[0] = disponivel;
                            state.datasets[0].data[1] = parseInt(reserva.participantes);
                        })
                    }
                }//Se não, é comum ou usuario não logado
                else {
                    let id = sendId()
                    if (usuario.id == id) {
                        const recusar = document.createElement("a")
                        recusar.innerHTML = "Cancelar"

                        const alterar = document.createElement("a")
                        alterar.innerHTML = "Alterar"

                        const detalhes = document.createElement("a")
                        detalhes.innerHTML = "Detalhes"

                        divDrop.appendChild(recusar)
                        divDrop.appendChild(alterar)
                        divDrop.appendChild(detalhes)

                        recusar.addEventListener('click', function () {
                            let id = reserva.id
                            let url = ("http://localhost:8080/api/reservation/deleta/" + id)
                            let idIgual = reserva.usuario.id
                            let userId = sendId()
                            if (userId == idIgual) {
                                fazDelete(url)
                                refresh()
                            } else {
                                erro("Voce não pode excluir essa reserva");
                            }
                        })

                        alterar.addEventListener('click', function () {
                            let id = reserva.id

                            let dataInicio = reserva.dataInicio
                            let horaInicio = dataInicio.substring(11, 17)
                            dataInicio = dataInicio.substring(0, 11)
                            horaInicio = formataHora(horaInicio)
                            dataInicio = dataInicio + horaInicio

                            let dataTermino = reserva.dataTermino
                            let horaTermino = dataTermino.substring(11, 17)
                            dataTermino = dataTermino.substring(0, 11)
                            horaTermino = formataHora(horaTermino)
                            dataTermino = dataTermino + horaTermino

                            const usuario = reserva.usuario

                            document.getElementById("idAlterar").value = id
                            document.getElementById("dataInicioAlterar").value = dataInicio
                            document.getElementById("dataTerminoAlterar").value = dataTermino
                            document.getElementById("participantesAlterar").innerHTML = reserva.participantes
                            document.getElementById("myRangeAlterar").value = reserva.participantes
                            document.getElementById("tituloAlterar").value = reserva.titulo
                            document.getElementById("usuarioAlterar").value = usuario.id
                            document.getElementById("descricaoAlterar").value = reserva.descricao

                            ConfirmacaoAlterar()
                            sendingEmailAlterar(id)
                        })

                        detalhes.addEventListener('click', function () {
                            ConfirmacaoDetalhes()
                            
                            document.getElementById("id").innerHTML = reserva.id
                            document.getElementById("titulo_reserva").innerHTML = reserva.titulo
                            document.getElementById("data").innerHTML = dataInicio + " - " + dataTermino
                            document.getElementById("hora").innerHTML = horaInicio + " - " + horaTermino
                            document.getElementById("descricao_reserva").innerHTML = reserva.descricao
                            document.getElementById("nome").innerHTML = usuario.nome
                            document.getElementById("email").innerHTML = usuario.email
                            let status = document.getElementById("status")
                            status.style.cursor = "pointer"

                            if (reserva.status === "CONFIRMADO") {
                                status.style.backgroundColor = "#56AF5A"
                                status.title = "Confirmado"
                            } else if (reserva.status === "FINALIZADO") {
                                status.style.backgroundColor = "tomato"
                                status.title = "Finalizado"
                            } else {
                                status.style.backgroundColor = "#fccd32"
                                status.title = "Em análise"
                            }
                            let disponivel = 118 - parseInt(reserva.participantes)
                            state.datasets[0].data[0] = disponivel;
                            state.datasets[0].data[1] = parseInt(reserva.participantes);
                        })

                    } else {
                        const detalhes = document.createElement("a")
                        detalhes.innerHTML = "Detalhes"

                        divDrop.appendChild(detalhes)

                        detalhes.addEventListener('click', function () {
                            ConfirmacaoDetalhes()
                            
                            document.getElementById("id").innerHTML = reserva.id
                            document.getElementById("titulo_reserva").innerHTML = reserva.titulo
                            document.getElementById("data").innerHTML = dataInicio + " - " + dataTermino
                            document.getElementById("hora").innerHTML = horaInicio + " - " + horaTermino
                            document.getElementById("descricao_reserva").innerHTML = reserva.descricao
                            document.getElementById("nome").innerHTML = usuario.nome
                            document.getElementById("email").innerHTML = usuario.email
                            let status = document.getElementById("status")
                            status.style.cursor = "pointer"

                            if (reserva.status === "CONFIRMADO") {
                                status.style.backgroundColor = "#56AF5A"
                                status.title = "Confirmado"
                            } else if (reserva.status === "FINALIZADO") {
                                status.style.backgroundColor = "tomato"
                                status.title = "Finalizado"
                            } else {
                                status.style.backgroundColor = "#fccd32"
                                status.title = "Em análise"
                            }
                            let disponivel = 118 - parseInt(reserva.participantes)
                            state.datasets[0].data[0] = disponivel;
                            state.datasets[0].data[1] = parseInt(reserva.participantes);
                        })
                    }
                }

                tdBtn.appendChild(dropBtn)
                tdBtn.appendChild(divDrop)
                tdBtn.appendChild(dropBtn)
                linha.appendChild(tdBtn)

                if (status.textContent == "CONFIRMADO") {
                    status.style.color = "green"
                } else if (status.textContent == "FINALIZADO") {
                    status.style.color = "red"
                } else {
                    status.style.color = "#fccd32"
                }

                //extrai o mês da reserva
                let mes = tdData.textContent
                mes = mes.substring(3, 5)

                //faz um switch para comparar em qual tabela de mês se encaixa a reserva
                switch (mes) {
                    case "01":
                        jan.appendChild(linha)
                        break;
                    case "02":
                        fev.appendChild(linha)
                        break;
                    case "03":
                        mar.appendChild(linha)
                        break;
                    case "04":
                        abr.appendChild(linha)
                        break;
                    case "05":
                        mai.appendChild(linha)
                        break;
                    case "06":
                        jun.appendChild(linha)
                        break;
                    case "07":
                        jul.appendChild(linha)
                        break;
                    case "08":
                        ago.appendChild(linha)
                        break;
                    case "09":
                        set.appendChild(linha)
                        break;
                    case "10":
                        out.appendChild(linha)
                        break;
                    case "11":
                        nov.appendChild(linha)
                        break;
                    case "12":
                        dez.appendChild(linha)
                        break;
                    default:
                        break;
                }
            }
            listaCriada = true
        }
    }, 1);
}

//pega todos os tipos de usuários disponíves
export function pegaTypes() {
    setTimeout(() => {
        let data = fazGet("http://localhost:8080/api/types/findAll");
        let types = JSON.parse(data)
        let select = document.getElementById("type")
        if (select.childElementCount == 0) {
            for (let i = 0; i < types.length; i++) {
                const option = document.createElement("option")
                option.innerHTML = types[i]
                select.appendChild(option)
            }
        }
    }, 1);
}

export function alterarReserva(event) {
    event.preventDefault()
    let id = document.getElementById("idAlterar").value

    let url = ("http://localhost:8080/api/reservation/" + id)
    let reserva = pegaReserva(id)

    let dataInicio = document.getElementById("dataInicioAlterar").value

    let dataTermino = document.getElementById("dataTerminoAlterar").value

    let titulo = document.getElementById("tituloAlterar").value
    let descricao = document.getElementById("descricaoAlterar").value
    let usuario = document.getElementById("usuarioAlterar").value
    let status = reserva.status
    let numParticipantes = document.getElementById("participantesAlterar").textContent

    usuario = fazGet("http://localhost:8080/api/user/" + usuario)
    usuario = JSON.parse(usuario)

    let body = {
        "usuario": usuario,
        "status": status,
        "participantes": numParticipantes,
        "id": id,
        "dataInicio": dataInicio,
        "dataTermino": dataTermino,
        "titulo": titulo,
        "descricao": descricao
    }

    fazPut(url, body)
}

function pegaReserva(id) {
    let reserva = fazGet("http://localhost:8080/api/reservation/pega/" + id)
    return JSON.parse(reserva)
}

export function confirmarReserva(id) {
    let url = ("http://localhost:8080/api/reservation/confirmada/" + id)
    let reserva = pegaReserva(id)

    let dataInicio = reserva.dataInicio
    let horaInicio = dataInicio.substring(11, 17)
    dataInicio = dataInicio.substring(0, 11)
    horaInicio = formataHora(horaInicio)
    dataInicio = dataInicio + horaInicio

    let dataTermino = reserva.dataTermino
    let horaTermino = dataTermino.substring(11, 17)
    dataTermino = dataTermino.substring(0, 11)
    horaTermino = formataHora(horaTermino)
    dataTermino = dataTermino + horaTermino

    let idUser = reserva.id
    let titulo = reserva.titulo
    let descricao = reserva.descricao
    let usuario = reserva.usuario
    let status = reserva.status
    let numParticipantes = reserva.participantes

    let body = {
        "id": idUser,
        "dataInicio": dataInicio,
        "dataTermino": dataTermino,
        "titulo": titulo,
        "descricao": descricao,
        "usuario": usuario,
        "status": status,
        "participantes": numParticipantes
    }


    fazPut(url, body)
}

//metodo de formatar uma data para formado br
export function dataFormatada(date) {
    var data = new Date(date),
        dia = data.getDate(),
        dia = (dia + 1).toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(),
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}

//consome a api do instagram atribuindo as fotos retornadas a uma div
export function img() {
    setTimeout(() => {

        const token = 'EAAcMsX26zZA0BAKQYMKQDIJIe9PeNPZBmjLXi9lSl8ycZAjdeDDGDAjw10AZALXTEumsS3NzGk3F59OKMm8xfMLv9kqjSeiEmY53zqv92eUpovxevoKZBQTRtTHgjIMTq8ZAFZCX8ZBfU2Tr6YvrcPZCOVLxxEE8jMHIU2mrRytKBLtB2ZAujL0mVv'
        const url = 'https://graph.facebook.com/17903255252601782/recent_media?user_id=17841453104072947&fields=id,media_type,comments_count,like_count,permalink,media_url&access_token=' + token

        $.get(url).then(function (response) {
            const dados = response.data
            let conteudo = '<div>'

            for (let i = 0; i < dados.length; i++) {
                let feed = dados[i]
        
                let tipo = feed.media_type;
                conteudo += '<img src="' + feed.media_url + '" onclick="window.open(\'' + feed.permalink + '\');">';
            }
            conteudo += '</div>'
            $('#insta').html(conteudo)
        })
    }, 1);
}

export function contador() {
    setTimeout(() => {
        if (isAuthenticatedAdmin() == true) {
            let usuarios = fazGet("http://localhost:8080/api/user/verifica")
            usuarios = JSON.parse(usuarios)
            let reservas = fazGet("http://localhost:8080/api/reservation")
            reservas = JSON.parse(reservas)
            let admins = fazGet("http://localhost:8080/api/user/verificaAdmin")
            admins = JSON.parse(admins)

            let usuarioSpan = document.getElementById("contUsers")
            let adminSpan = document.getElementById("contAdmin")
            let reservaSpan = document.getElementById("contReservas")

            let contadorUser = 0
            let contadorAdmin = 0
            let contadorReserva = 0

            if (usuarioSpan.textContent == 0) {
                for (let i = 0; i < usuarios.length; i++) {
                    contadorUser++
                }
                for (let i = 0; i < admins.length; i++) {
                    contadorAdmin++
                }

                for (let i = 0; i < reservas.length; i++) {
                    contadorReserva++
                }
                usuarioSpan.innerHTML = contadorUser
                adminSpan.innerHTML = contadorAdmin
                reservaSpan.innerHTML = contadorReserva
            }
        }
    }, 5);
}


