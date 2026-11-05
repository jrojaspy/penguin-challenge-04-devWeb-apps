import { h, mount } from 'naufrago';
import { store } from './store.js';
import { App } from './components/App.jsx';
import './styles.css';

const app = mount(App, document.getElementById('root'), [store]);
document.querySelector('input.new')?.focus();
export default app;
