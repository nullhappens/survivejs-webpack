import component from './component';
import 'react';
import './scss/main.scss';
import { bake } from './shake';

bake();
document.body.appendChild(component('Hello'));
