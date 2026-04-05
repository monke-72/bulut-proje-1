require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Veritabanı Bağlantı Ayarları 
const db = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASS,
    port: 3306 
});

// Veritabanı ve Tablo Kurulumu
db.connect((err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
        console.log('AWS RDS sunucusuna güvenli şekilde bağlandık! 🚀');
        
        db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`, (err) => {
            if (err) console.error("Veritabanı oluşturma hatası:", err);
            
            db.query(`USE ${process.env.DB_NAME};`, (err) => {
                if (err) console.error("Veritabanı seçme hatası:", err);
                
                const tabloOlustur = `
                    CREATE TABLE IF NOT EXISTS kullanicilar (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        ad_soyad VARCHAR(100) NOT NULL,
                        meslek VARCHAR(100) NOT NULL
                    )
                `;
                db.query(tabloOlustur, (err) => {
                    if (err) console.error('Tablo oluşturma hatası:', err);
                    else console.log('Kullanıcılar tablosu tamamen hazır!');
                });
            });
        });
    }
});

// 1. Veri Çekme Ucu (GET)
app.get('/api/kullanicilar', (req, res) => {
    db.query("SELECT * FROM kullanicilar", (err, results) => {
        if (err) return res.status(500).json({ hata: err.message });
        res.json(results);
    });
});

// 2. Veri Ekleme Ucu (POST)
app.post('/api/kullanicilar', (req, res) => {
    const { ad_soyad, meslek } = req.body;
    db.query("INSERT INTO kullanicilar (ad_soyad, meslek) VALUES (?, ?)", [ad_soyad, meslek], (err, result) => {
        if (err) return res.status(500).json({ hata: err.message });
        res.json({ mesaj: "Kullanıcı başarıyla eklendi!", id: result.insertId });
    });
});

// 3. Veri Silme (DELETE)
app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;
  const sqlDelete = "DELETE FROM kullanicilar WHERE id = ?"; 

  db.query(sqlDelete, id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend ${PORT} portunda yayında!`));