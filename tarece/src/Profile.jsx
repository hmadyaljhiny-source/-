import React, { useState } from 'react'; import './Profile.css';
export default function Profile() { const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
return ( <div className="login-page"> <header className="login-header"> <div className="help-section dark-help"> <div className="help-icon yellow-help">?</div> <span>المساعدة</span> </div> </header>
  <main className="login-content">
    
    {/* 🌟 الشعار الاحترافي المطور بدقة SVG مطابقة تماماً للصورة */}
    <div className="app-logo-container">
      <svg className="app-logo-svg" viewBox="0 0 200 200" width="160" height="160">
        <defs>
          {/* التدرج اللوني للخلفية (أخضر إلى أسود داكن) */}
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f3d02" />
            <stop offset="40%" stopColor="#111111" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
          {/* الإضاءة الإشعاعية الخضراء في الزاوية العلوية */}
          <radialGradient id="greenGlow" cx="80%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#62b322" stopOpacity="1" />
            <stop offset="100%" stopColor="#62b322" stopOpacity="0" />
          </radialGradient>
          {/* التدرج الرمادي لجسم الطريق */}
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#222222" />
          </linearGradient>
        </defs>

        {/* المربع الرئيسي ذو الحواف المنحنية الفاخرة */}
        <rect x="10" y="10" width="180" height="180" rx="42" fill="url(#bgGradient)" />
        <rect x="10" y="10" width="180" height="180" rx="42" fill="url(#greenGlow)" />

        {/* مجسم الظل الأخضر ثلاثي الأبعاد أسفل الطريق المتعرج */}
        <path 
          d="M 50 10 L 50 45 L 85 45 L 85 85 L 125 85 L 125 125 L 155 125 L 155 190" 
          fill="none" 
          stroke="#3a6d13" 
          strokeWidth="32" 
          strokeLinecap="square" 
          strokeLinejoin="miter"
          transform="translate(-2, 4)"
        />

        {/* جسم الطريق الرمادي المتعرج الأساسي */}
        <path 
          id="mainRoadPath"
          d="M 50 10 L 50 45 L 85 45 L 85 85 L 125 85 L 125 125 L 155 125 L 155 190" 
          fill="none" 
          stroke="url(#roadGrad)" 
          strokeWidth="26" 
          strokeLinecap="square" 
          strokeLinejoin="miter"
        />

        {/* الخطوط المتقطعة الصفراء في منتصف الطريق بدقة */}
        <path 
          d="M 50 10 L 50 45 L 85 45 L 85 85 L 125 85 L 125 125 L 155 125 L 155 190" 
          fill="none" 
          stroke="#ffb703" 
          strokeWidth="2" 
          strokeDasharray="6,6" 
          strokeLinejoin="miter"
        />
      </svg>
    </div>

    {/* نموذج الاستمارة */}
    <div className="login-form">
      <div className="input-field-group">
        <label>Email</label>
        <input 
          type="email" 
          placeholder="Value" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="input-field-group">
        <label>Password</label>
        <input 
          type="password" 
          placeholder="Value" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="btn-login-green">Sign In</button>

      <div className="login-options-footer">
        <a href="#forgot" className="link-forgot-pass">Forgot password?</a>
        <button className="btn-register-yellow">Register</button>
      </div>
    </div>
  </main>
</div>
); }