import { decodaToken } from "./API"

export const isAuthenticatedAdmin = function () {
    const token = sessionStorage.getItem("token")
    let admin = "ADMINISTRADOR"
    if (token) {
        let data = decodaToken().replaceAll('"', "")
        if (data == admin) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

export const isAuthenticated = function () {
    const token = sessionStorage.getItem("token")
    if (token) {
        return true
    } else {
        return false
    }
}