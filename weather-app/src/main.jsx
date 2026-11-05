import { h, mount } from 'naufrago';
import { store } from './store.js';
import { App } from './components/App.jsx';
import './styles.css';

mount(App, document.getElementById('root'), [store]);
