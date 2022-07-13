import { Route, Switch, Redirect, Router } from 'react-router-dom'
import Login from './pages/Login'
import Principal from './pages/Principal'
import Cadastro from './pages/Cadastro';
import { isAuthenticated, isAuthenticatedAdmin } from './Js/auth';
import { history } from './Js/history'
import Verifica from './pages/Verifica';
import { PostAuditorio } from './pages/PostAuditorio';
import { erro } from './components/mensagem';
import Alterar from './pages/Alterar';
import { Help } from './pages/Help';

const PrivateRouteAdmin = (props) => {
    if (isAuthenticatedAdmin() === true) {
        return <Route {...props} />
    } else {
        erro("Precisa estar logado como um\nAdministrador para acessar essa página")
        return <Redirect to="/Principal" push></Redirect>
    }
}

const PrivateRoute = (props) => {
    if (isAuthenticated() === true) {
        return <Route {...props} />
    } else {
        erro("Precisa estar logado para acessar aquela página")
        return <Redirect to="/" push></Redirect>
    }
}

export default function Routes() {
    return (
        <Router history={history}>
            <Switch>
                <Route path='/' exact component={Login}></Route>
                <Route path='/Login' component={Login}></Route>
                <Route path='/Cadastro' component={Cadastro} />
                <Route path='/Principal' component={Principal} />
                <Route path='/PostAuditorio' component={PostAuditorio} />
                <Route path='/Help' component={Help} />
                <PrivateRouteAdmin path='/Verifica' component={Verifica} />
                <PrivateRoute path='/Alterar' component={Alterar} />
                <Route path='*' exact component={Login}></Route>
            </Switch>
        </Router>
    )
}