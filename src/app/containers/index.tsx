/** Exporting Containers for Easier Imports */
import Loadable from 'react-loadable';

export { Html } from './Html';
export { App } from './App';

const loading = () => null;

const Home = Loadable({
  loader: () => import(/* webpackChunkName: "home" */ './Home').then((mod) => mod.Home),
  loading,
  delay: 300,
});

const About = Loadable({
  loader: () => import(/* webpackChunkName: "about" */ './About').then((mod) => mod.About),
  loading,
  delay: 300,
});

export { Home, About };