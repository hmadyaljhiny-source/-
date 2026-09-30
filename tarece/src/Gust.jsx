import React, { useState } from 'react';
import './App.css';
import Profile from './Profile'; 
import About from './About'; // 👈 استيراد صفحة حول الجديدة

function App() {
  // القيمة الابتدائية تبدأ من المحطات 'home'
  const [activeTab, setActiveTab] = useState('home'); 

  return (
    <div className="app-container">
        
        {/* 1️⃣ صفحة المحطات (المنزل) */}
        {activeTab === 'home' && (
          <>
            <header className="app-header">
                <div className="search-bar">
                    <i className="fa-solid fa-bars menu-icon"></i>
                    <input type="text" placeholder="Hinted search text" />
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                </div>
                <div className="help-section">
                    <div className="help-icon">؟</div>
                    <span>المساعدة</span>
                </div>
            </header>

            <main className="main-content">
                <div className="content-title">
                    <h2>المحطات</h2>
                    <p>معلومات أكثر حول المحطات</p>
                </div>

                <div className="station-card">
                    <div className="station-info">
                        <h3>الاسم</h3>
                        <p className="station-status">حالة المحطة</p>
                        <div className="station-actions">
                            <button className="btn">عرض الموقع</button>
                            <button className="btn">
                               <i className="fa-solid fa-star"></i> مستوى الازدحام
                            </button>
                        </div>
                    </div>
                    <div className="station-image">
                        <i className="fa-regular fa-image placeholder-icon"></i>
                    </div>
                </div>
            </main>
          </>
        )}

        {/* 2️⃣ عرض صفحة الحساب الخارجية */}
        {activeTab === 'profile' && <Profile />}

        {/* 3️⃣ عرض صفحة حول الخارجية الجديدة 👇 */}
        {activeTab === 'about' && <About />}

        {/* القائمة السفلية المشتركة للتنقل التفاعلي الثلاثي */}
        <nav className="bottom-nav">
            
            {/* زر حول: يكبر ويرتفع الآن ديناميكياً إذا كانت الحالة 'about' */}
            <div 
              className={`nav-item ${activeTab === 'about' ? 'active-dynamic' : ''}`}
              onClick={() => setActiveTab('about')} // 👈 نقل الحالة إلى 'about'
            >
                <div className="nav-circle">
                    <i className="fa-solid fa-circle-info"></i>
                </div>
                <span className="nav-text-label">حول</span>
            </div>
            
            {/* زر المنزل */}
            <div 
              className={`nav-item ${activeTab === 'home' ? 'active-dynamic' : ''}`}
              onClick={() => setActiveTab('home')}
            >
                <div className="nav-circle">
                    <i className="fa-solid fa-house"></i>
                </div>
                <span className="nav-text-label">المنزل</span>
            </div>

            {/* زر الحساب */}
            <div 
              className={`nav-item ${activeTab === 'profile' ? 'active-dynamic' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
                <div className="nav-circle">
                    <i className="fa-solid fa-circle-user"></i>
                </div>
                <span className="nav-text-label">الحساب</span>
            </div>
        </nav>

    </div>
  );
}

export default App;
