window.addEventListener('DOMContentLoaded', (event) => {
  hljs.highlightAll();

  if (localStorage.getItem('theme') === 'light') {
    document.getElementsByTagName('body').id = 'light-theme';
    updateButtonText();
  }
});

function toggleTheme() {
  const element = document.getElementsByTagName('body')[0];
  if (element.id === 'light-theme') {
    element.id = null;
    localStorage.setItem('theme', 'dark');
    updateButtonText();
  } else {
    element.id = 'light-theme';
    localStorage.setItem('theme', 'light');
    updateButtonText();
  }
};

function updateButtonText() {
  const btn = document.getElementById('toggle-theme');

  if (localStorage.getItem('theme') === 'light') {
    btn.innerText = 'Dark Theme';
  } else {
    btn.innerText = 'Light Theme';
  }
}