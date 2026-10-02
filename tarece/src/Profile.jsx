import React, { useState } from 'react';
import axios from 'axios';
import './Profile.css';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import RoleBadge from './components/RoleBadge';

const API_URL = 'http://localhost:3000';

// 🌟 تم تصحيح السطر الأول هنا لكي يستقبل كافة الـ Props الممررة من App.jsx بنجاح لمنع الشاشة البيضاء
export default function Profile({ user, onLoginSuccess, onLogout, moderators, onAddModerator, onDeleteModerator }) {
  const [authMode, setAuthMode] = useState(user ? 'profile-view' : 'login'); 
  const [userNumber, setUserNumber] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const [loading, setLoading] = useState(false);

  // دالة تسجيل الدخول والتحقق الحقيقي عبر السيرفر
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

      // رفع البيانات للـ App.jsx لكي يعتمد الصلاحيات في كل الموقع
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

  // 1️⃣ [واجهة الأدمن 👑]: يوجه للوحة التحكم الكبيرة الفاخرة
  if (authMode === 'profile-view' && user?.role === 'admin') {
    return (
      <AdminDashboard 
        user={user} 
        moderators={moderators} 
        onAddModerator={onAddModerator} 
        onDeleteModerator={onDeleteModerator} 
      />
    );
  }

  // 2️⃣ [واجهة المشرف 🛠️]: يوجه لصفحة المشرف المخصصة له
  if (authMode === 'profile-view' && user?.role === 'moderator') {
    return (
      <div className="profile-page">
        <header className="profile-header"><div className="help-section dark-help"><div className="help-icon yellow-help">?</div><span>المساعدة</span></div></header>
        <main className="profile-content">
          <div className="avatar-container"><i className="fa-solid fa-user-shield avatar-icon" style={{ color: '#469c14' }}></i></div>
          <RoleBadge role={user.role} />
          <div className="name-box" style={{ backgroundColor: '#469c14', color: '#fff' }}>
            <span>مرحباً بالمشرف: {user.number}</span>
          </div>
          <div className="moderator-options" style={{ width: '100%', maxWidth: '340px', textAlign: 'center', marginBottom: '20px' }}>
            <button className="btn" style={{ width: '100%', background: '#469c14', color: '#fff', padding: '12px', marginBottom: '10px' }}>📊 تقارير حالة الازدحام</button>
            <button className="btn" style={{ width: '100%', background: '#1a1a1a', color: '#fff', padding: '12px' }}>📍 إدارة المحطات الموكلة إلي</button>
          </div>
          <div className="logout-section" onClick={() => { onLogout(); setAuthMode('login'); }}>
            <i className="fa-solid fa-sign-out-alt logout-icon" style={{ fontSize: '30px', cursor: 'pointer' }}></i><span>تسجيل الخروج</span>
          </div>
        </main>
      </div>
    );
  }

  // 3️⃣ [واجهة المستخدم العادي 👤]: يوجه لصفحة البروفايل البسيطة
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

  // شاشة تسجيل الدخول الافتراضية إذا لم يكن هناك مستخدم مسجل
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
