import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import RoleBadge from './components/RoleBadge';

const API_URL = 'http://localhost:3000';

export default function Profile({ user, onLoginSuccess, onLogout, onRefreshHome }) {
  const [authMode, setAuthMode] = useState(user ? 'profile-view' : 'login'); 
  const [userNumber, setUserNumber] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!userNumber || !password) {
      setErrorMessage("الرجاء إدخال رقم المستخدم وكلمة المرور");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      
      const response = await axios.post(`${API_URL}/users/login`, {
        number: userNumber, 
        password: password
      });

      onLoginSuccess(response.data); 
      setAuthMode('profile-view'); 
      
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.error || "فشل الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  if (authMode === 'register') return <Register onBackToLogin={() => setAuthMode('login')} />;

  if (authMode === 'profile-view' && user?.role === 'admin') {
    return <AdminDashboard user={user} />;
  }

  if (authMode === 'profile-view' && user?.role === 'moderator') {
    return <ModeratorView user={user} onLogout={onLogout} setAuthMode={setAuthMode} onRefreshHome={onRefreshHome} />;
  }

  if (authMode === 'profile-view' && user?.role === 'user') {
    return (
      <div className="profile-page">
        <header className="profile-header"><div className="help-section dark-help"><div className="help-icon yellow-help">?</div><span>المساعدة</span></div></header>
        <main className="profile-content">
          <div className="avatar-container"><i className="fa-solid fa-circle-user avatar-icon"></i></div>
          <RoleBadge role={user.role} />
          <div className="name-box"><span>رقم الحساب: {user.number}</span></div>
          <div className="logout-section" onClick={() => { onLogout(); setAuthMode('login'); }}>
            <i className="fa-solid fa-sign-out-alt logout-icon" style={{ fontSize: '30px', cursor: 'pointer' }}></i><span>تسجيل الخروج</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="login-page">
      <header className="login-header"><div className="help-section dark-help"><div className="help-icon yellow-help">?</div><span>المساعدة</span></div></header>
      <main className="login-content">
        <div className="app-logo-container">
          <svg className="app-logo-svg" viewBox="0 0 200 200" width="160" height="160">
            <defs>
              <linearGradient id="bgGradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0a0f0d" /><stop offset="50%" stopColor="#141a16" /><stop offset="100%" stopColor="#1b2e0b" /></linearGradient>
              <radialGradient id="greenGlow" cx="85%" cy="15%" r="75%"><stop offset="0%" stopColor="#5bb01b" stopOpacity="1" /><stop offset="50%" stopColor="#418512" stopOpacity="0.8" /><stop offset="100%" stopColor="#141a16" stopOpacity="0" /></radialGradient>
              <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#444444" /><stop offset="50%" stopColor="#2e2e2e" /><stop offset="100%" stopColor="#1c1c1c" /></linearGradient>
            </defs>
            <rect x="15" y="15" width="170" height="170" rx="45" fill="url(#bgGradient)" /><rect x="15" y="15" width="170" height="170" rx="45" fill="url(#greenGlow)" />
            <g><path d="M 52 0 L 52 42 L 87 42 L 87 90 L 127 90 L 127 135 L 160 135 L 160 200" fill="none" stroke="#3b6e14" strokeWidth="32" /><path d="M 54 0 L 54 40 L 89 40 L 89 88 L 129 88 L 129 133 L 162 133 L 162 200" fill="none" stroke="#79cc2b" strokeWidth="28" /><path d="M 48 0 L 48 44 L 83 44 L 83 92 L 123 92 L 123 137 L 154 137 L 154 200" fill="none" stroke="url(#roadGrad)" strokeWidth="24" /><path d="M 48 0 L 48 44 L 83 44 L 83 92 L 123 92 L 123 137 L 154 137 L 154 200" fill="none" stroke="#ffb703" strokeWidth="2" strokeDasharray="8,6" /></g>
          </svg>
        </div>
        <form className="login-form" onSubmit={handleSignIn}>
          {errorMessage && <p style={{ color: '#d90429', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>{errorMessage}</p>}
          <div className="input-field-group"><label>User Number (Phone)</label><input type="number" placeholder="Enter your number" value={userNumber} onChange={(e) => setUserNumber(e.target.value)} /></div>
          <div className="input-field-group"><label>Password</label><input type="password" placeholder="Value" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button type="submit" className="btn-login-green" disabled={loading}>Sign In</button>
          <div className="login-options-footer"><a href="#forgot" className="link-forgot-pass">Forgot password?</a><button type="button" className="btn-register-yellow" onClick={() => setAuthMode('register')}>Register</button></div>
        </form>
      </main>
    </div>
  );
}

function ModeratorView({ user, onLogout, setAuthMode, onRefreshHome }) {
  const [myStations, setMyStations] = useState([]);
  const [msg, setMsg] = useState('');

  const fetchMyStations = () => {
    axios.get(`${API_URL}/stations`)
      .then(res => {
        const filtered = res.data.filter(s => s.moderators && s.moderators.includes(user.number));
        setMyStations(filtered);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMyStations();
  }, []);

  const handleUpdateLiveStatus = async (stationId, newStatus) => {
    try {
      await axios.post(`${API_URL}/stations/update-status/${stationId}`, { status: newStatus });
      setMsg(`تم التغيير إلى [${newStatus}] بنجاح في قاعدة البيانات!`);
      fetchMyStations();
      onRefreshHome(); 
      setTimeout(() => setMsg(''), 3000);
    } catch (error) {
      alert("فشل تحديث حالة الازدحام بسبب تعارض نوع البيانات");
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header"><div className="help-section dark-help"><div className="help-icon yellow-help">?</div><span>المساعدة</span></div></header>
      <main className="profile-content" style={{ direction: 'rtl' }}>
        <div className="avatar-container"><i className="fa-solid fa-user-shield avatar-icon" style={{ color: '#469c14' }}></i></div>
        <RoleBadge role={user.role} />
        <div className="name-box" style={{ backgroundColor: '#469c14', color: '#fff' }}><span>المشرف المسؤول: {user.number}</span></div>
        {msg && <p style={{ color: '#469c14', fontWeight: 'bold', fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>{msg}</p>}
        <div style={{ width: '100%', maxWidth: '360px', padding: '15px', border: '1px solid #ccc', borderRadius: '12px', background: '#f9f9f9', marginBottom: '25px' }}>
          <h4 style={{ marginBottom: '15px', textAlign: 'center' }}>📊 تحديث حالة ازدحام محطاتك</h4>
          {myStations.length === 0 ? <p style={{ textAlign: 'center', color: '#888' }}>لا توجد محطات موكلة إليك حالياً.</p> : 
            myStations.map(st => (
              <div key={st.id} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                {/* ترجمة حالة الـ boolean وعرضها للمشرف بدقة */}
                <p style={{ fontWeight: 'bold', marginBottom: '8px', textAlign: 'right' }}>🏢 محطة: {st.name} (الحالية: {st.state === true ? '🟢 متاحة' : '🔴 مزدحمة / غير متاحة'})</p>
                
                {/* 🌟 الزرين المتوافقين مع حقل الـ boolean لحفظ البيانات بنجاح 🌟 */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => handleUpdateLiveStatus(st.id, 'مزدحمة')} style={{ background: '#d90429', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>🔴 مزدحمة</button>
                  <button onClick={() => handleUpdateLiveStatus(st.id, 'متاحة')} style={{ background: '#469c14', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>🟢 متاحة</button>
                </div>
              </div>
            ))
          }
        </div>
        <div className="logout-section" onClick={() => { onLogout(); setAuthMode('login'); }}><i className="fa-solid fa-sign-out-alt logout-icon" style={{ fontSize: '30px', cursor: 'pointer' }}></i><span>تسجيل الخروج</span></div>
      </main>
    </div>
  );
}
