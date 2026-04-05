import React, { useState, useEffect } from 'react';

function App() {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [adSoyad, setAdSoyad] = useState('');
  const [meslek, setMeslek] = useState('');

  // Sayfa açıldığında veya yeni veri eklendiğinde API'den verileri çeken fonksiyon (GET)
  const kullanicilariGetir = () => {
    fetch('http://63.181.1.113:5000/api/kullanicilar')
      .then(res => res.json())
      .then(data => setKullanicilar(data))
      .catch(err => console.error("Veri çekme hatası:", err));
  };

  useEffect(() => {
    kullanicilariGetir(); // Bileşen yüklendiğinde ilk verileri çek
  }, []);

  // Silme Fonksiyonu (DELETE)
  const deleteKullanici = (id) => {
    fetch(`http://63.181.1.113:5000/api/delete/${id}`, {
      method: 'DELETE',
    })
    .then(res => {
      if (res.ok) {
        alert("✅ Veri buluttan silindi!");
        kullanicilariGetir(); // Listeyi yenilemek için tekrar çek
      }
    })
    .catch(err => console.error("Silme hatası:", err));
  };  

  // Form gönderildiğinde API'ye veri yollayan fonksiyon (POST)
  const kullaniciEkle = (e) => {
    e.preventDefault(); 

    fetch('http://63.181.1.113:5000/api/kullanicilar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ad_soyad: adSoyad, meslek: meslek })
    })
    .then(res => res.json())
    .then(data => {
      alert("✅ " + data.mesaj);
      setAdSoyad('');
      setMeslek('');
      kullanicilariGetir(); 
    })
    .catch(err => console.error("Ekleme hatası:", err));
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>☁️ Bulut Bilişim Projesi ☁️</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>React (Frontend) + Node.js (API) + AWS RDS (MySQL)</p>

      {/* Veri Ekleme Formu */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: '0' }}>Yeni Kayıt Ekle</h3>
        <form onSubmit={kullaniciEkle}>
          <input
            type="text"
            placeholder="Ad Soyad giriniz..."
            value={adSoyad}
            onChange={(e) => setAdSoyad(e.target.value)}
            required
            style={{ display: 'block', width: '95%', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Meslek giriniz..."
            value={meslek}
            onChange={(e) => setMeslek(e.target.value)}
            required
            style={{ display: 'block', width: '95%', marginBottom: '15px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            AWS Veritabanına Kaydet 🚀
          </button>
        </form>
      </div>

      {/* Verileri Listeleme Alanı */}
      <h3>Kayıtlı Kullanıcılar</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {kullanicilar.length === 0 ? <p style={{ color: 'red' }}>Henüz veritabanında kayıt yok.</p> : null}
        
        {kullanicilar.map((kisi, index) => (
          <li key={index} style={{ 
            background: '#e9ecef', 
            margin: '8px 0', 
            padding: '12px', 
            borderRadius: '5px', 
            borderLeft: '5px solid #007bff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span><strong>{kisi.ad_soyad}</strong> - {kisi.meslek}</span>
            <button 
              onClick={() => deleteKullanici(kisi.id)} // Buradaki kisi.id veritabanındaki id kolonuyla aynı olmalı
              style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
            >
              Sil 🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;