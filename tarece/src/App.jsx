import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import StationForm from './components/StationForm';
import StationList from './components/StationList';
import Profile from './Profile';
import About from './About';

const API_URL = 'http://localhost:3000'; 

function App() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [stations, setStations] = useState([]);
  const [moderators, setModerators] = useState([]);

  // 1️⃣ جلب البيانات تلقائياً فور تشغيل التطبيق
  useEffect(() => {
    axios.get(`${API_URL}/stations`)
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setStations(response.data);
        }
      })
      .catch(err => {
        console.error("الباك إند مغلق، تم تحميل بيانات محطات احتياطية مؤقتة:", err);
        setStations([
          { id: 1, name: 'محطة العروبة (محلية)', state: true, moderators: 'لا يوجد مشرف حالياً' },
          { id: 2, name: 'محطة الاستقلال (محلية)', state: true, moderators: 'لا يوجد مشرف حالياً' }
        ]);
      });

    axios.get(`${API_URL}/users`)
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          const modsOnly = response.data.filter(u => u.role === 'moderator');
          setModerators(modsOnly);
        }
      })
      .catch(err => console.error("الباك إند مغلق، فشل جلب الحسابات:", err));
  }, []);

  // 2️⃣ دالة إضافة محطة جديدة مع ترقية مستخدم عادي تلقائياً إلى مشرف
  const handleAddStation = async (name, supervisorId) => {
    try {
      const response = await axios.post(`${API_URL}/stations`, { 
        name: name,
        supervisor_id: supervisorId 
      });

      if (response.data) {
        const refreshRes = await axios.get(`${API_URL}/stations`);
        setStations(refreshRes.data);
      }
    } catch (error) {
      console.error("❌ خطأ أثناء إضافة المحطة في الفرونت إند:", error);
      alert(error.response?.data?.error || "حدث خطأ أثناء إضافة المحطة");
    }
  };

  // 3️⃣ دالة حذف المحطة من قاعدة البيانات
  const handleDeleteStation = async (id) => {
    try {
      await axios.delete(`${API_URL}/stations/${id}`);
      setStations(stations.filter(s => s.id !== id)); 
    } catch (error) {
      console.error("❌ خطأ أثناء حذف المحطة in الفرونت إند:", error);
    }
  };

  return (
    <div className="app-container">
        
        {/* 🏠 [التبويب الأول]: صفحة المحطات الرئيسية */}
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
                    <p>معلومات أكثر حول مستويات الازدحام</p>
                    {currentUser && (
                      <p style={{ color: '#469c14', fontWeight: 'bold', marginTop: '5px' }}>
                        👤 الحساب الحالي: {currentUser.number} ({currentUser.role})
                      </p>
                    )}
                </div>

                {currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                  <StationForm onAddStation={(name) => handleAddStation(name, null)} />
                )}

                <StationList 
                  stations={stations} 
                  userRole={currentUser ? currentUser.role : 'guest'} 
                  onDeleteStation={handleDeleteStation} 
                />
            </main>
          </>
        )}

        {/* 👤 [التبويب الثاني]: صفحة الحساب */}
        {activeTab === 'profile' && (
          <Profile 
            user={currentUser}
            onLoginSuccess={(userData) => setCurrentUser(userData)} 
            onLogout={() => setCurrentUser(null)} 
            moderators={moderators}
            // 🌟 تم إزالة الدوال المحذوفة من هنا تماماً لحل مشكلة الشاشة البيضاء بشكل قطعي
          />
        )}

        {/* ℹ️ [التبويب الثالث]: صفحة حول */}
        {activeTab === 'about' && <About />}

        {/* 📱 شريط التنقل السفلي الاحترافي */}
        <nav className="bottom-nav">
            <div className={`nav-item ${activeTab === 'about' ? 'active-dynamic' : ''}`} onClick={() => setActiveTab('about')}>
                <div className="nav-circle"><i className="fa-solid fa-circle-info"></i></div>
                <span className="nav-text-label">حول</span>
            </div>
            <div className={`nav-item ${activeTab === 'home' ? 'active-dynamic' : ''}`} onClick={() => setActiveTab('home')}>
                <div className="nav-circle"><i className="fa-solid fa-house"></i></div>
                <span className="nav-text-label">المنزل</span>
            </div>
            <div className={`nav-item ${activeTab === 'profile' ? 'active-dynamic' : ''}`} onClick={() => setActiveTab('profile')}>
                <div className="nav-circle"><i className="fa-solid fa-circle-user"></i></div>
                <span className="nav-text-label">الحساب</span>
            </div>
        </nav>
    </div>
  );
}

export default App;
