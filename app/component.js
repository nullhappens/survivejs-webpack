import styles from './scss/main.scss';

export default (text = 'Hello World') => {
  const element = document.createElement('div');
  element.innerHTML = text;
  element.className = styles.redButton;

  element.onclick = () => {
    import('./lazy').then((lazy) => {
      element.textContent = lazy.default;
    }).catch((err) => {
      console.error(err);
    });
  };

  return element;
};
