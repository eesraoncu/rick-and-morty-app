import React from 'react';  // React kütüphanesini içe aktarır (JSX ve bileşenler için gerekli)
import ReactDOM from 'react-dom/client';  // React DOM'un yeni kök API'sini içe aktarır (React 18+)
import App from './App';  // Ana uygulama bileşenini içe aktarır
import reportWebVitals from './reportWebVitals';  // Performans ölçüm aracı (isteğe bağlı)

/* 
  rootElement, HTML'deki 'root' id'li DOM öğesini seçer.
  React uygulaması bu DOM öğesi içine render edilir.
*/
const rootElement = document.getElementById('root');

/* Eğer root elementi bulunamazsa hata fırlatılır.*/
if (!rootElement) throw new Error('Failed to find the root element');

/* React 18 ile gelen yeni kök oluşturucu (root) API'si kullanılır.*/
const root = ReactDOM.createRoot(rootElement);

/* React bileşenleri root DOM öğesine render edilir.
   <React.StrictMode> içi, geliştirme aşamasında potansiyel sorunları tespit etmek için kullanılır.
   <App /> ise uygulamanın ana bileşenidir. */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/* Performans metriklerini ölçmek ve raporlamak için kullanılan fonksiyon.
   Örneğin, kullanıcı deneyimini iyileştirmek için veriler toplanabilir.*/
reportWebVitals();
