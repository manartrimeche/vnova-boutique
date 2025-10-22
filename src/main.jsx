import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ProductsProvider } from './contexts/ProductsContext';
import './index.css'

// Bloquer les raccourcis clavier indésirables
document.addEventListener('keydown', function (e) {
  // Bloquer Ctrl+A (sélectionner tout)
  if (e.ctrlKey && e.key === 'a') {
    e.preventDefault();
    return false;
  }

  // Bloquer Ctrl+C (copier)
  if (e.ctrlKey && e.key === 'c') {
    e.preventDefault();
    return false;
  }

  // Bloquer Ctrl+V (coller)
  if (e.ctrlKey && e.key === 'v') {
    e.preventDefault();
    return false;
  }

  // Bloquer Ctrl+X (couper)
  if (e.ctrlKey && e.key === 'x') {
    e.preventDefault();
    return false;
  }

  // Bloquer Ctrl+S (sauvegarder)
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    return false;
  }

  // Bloquer Ctrl+P (imprimer)
  if (e.ctrlKey && e.key === 'p') {
    e.preventDefault();
    return false;
  }

  // Bloquer F12 (outils développeur)
  if (e.key === 'F12') {
    e.preventDefault();
    return false;
  }

  // Bloquer Ctrl+Shift+I (outils développeur)
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
    e.preventDefault();
    return false;
  }

  // Bloquer Ctrl+Shift+C (inspecteur)
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    return false;
  }

  // Bloquer Ctrl+U (code source)
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    return false;
  }

  // Bloquer Ctrl+Shift+J (console)
  if (e.ctrlKey && e.shiftKey && e.key === 'J') {
    e.preventDefault();
    return false;
  }
});

// Bloquer le clic droit
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  return false;
});

// Bloquer le drag and drop
document.addEventListener('dragover', function (e) {
  e.preventDefault();
  return false;
});

document.addEventListener('drop', function (e) {
  e.preventDefault();
  return false;
});

// Bloquer la sélection de texte
document.addEventListener('selectstart', function (e) {
  e.preventDefault();
  return false;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductsProvider>
      <App />
    </ProductsProvider>
  </React.StrictMode>,
)
