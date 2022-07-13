import ReactDOM from 'react-dom/client';
import Mensagem from './components/mensagem';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter >
  <Mensagem></Mensagem>
  <App/>
  </BrowserRouter>
);

