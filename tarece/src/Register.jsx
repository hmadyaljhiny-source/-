import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

export default function Register({ onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [number, setNumber] = useState(''); 
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!username || !number || !password) {
      setMessage("الرجاء تعبئة كافة الحقول");
      return;
    }

    try {
      setMessage("جاري إرسال البيانات...");
      
      // إرسال البيانات للباك إند لحفظها في قاعدة البيانات
      await axios.post('http://localhost:3000/users', {
        number: number, 
        role: 'user',  // 🌟 تم التعديل هنا إلى 'user' ليصبح حساباً عادياً فور التسجيل
        password: password
      });

      alert("تم إنشاء الحساب بنجاح كـ (مستخدم عادي) في قاعدة البيانات!");
      onBackToLogin(); 
    } catch (error) {
      console.error(error);
      const serverError = error.response?.data?.error || "فشل إنشاء الحساب";
      setMessage(serverError);
    }
  };

  return (
    <div className="register-page">
      <header className="register-header"><div className="help-section dark-help"><div className="help-icon yellow-help">?</div><span>المساعدة</span></div></header>
      <main className="register-content">
        <div className="register-title-box">
          <h2>إنشاء حساب جديد</h2>
          {message && <p style={{ color: '#d90429', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>{message}</p>}
        </div>
        <form className="register-form" onSubmit={handleRegisterSubmit}>
          <div className="input-field-group">
            <label>User Name</label>
            <input type="text" placeholder="Value" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          
          <div className="input-field-group">
            <label>User Number (Phone)</label>
            <input 
              type="number" 
              placeholder="Enter digits only" 
              value={number} 
              onChange={(e) => setNumber(e.target.value)} 
            />
          </div>
          
          <div className="input-field-group">
            <label>Password</label>
            <input type="password" placeholder="Value" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="btn-register-submit">Register</button>
          <div className="back-to-login-box"><span onClick={onBackToLogin} className="link-back-login">لديك حساب بالفعل؟ تسجيل الدخول</span></div>
        </form>
      </main>
    </div>
  );
}
