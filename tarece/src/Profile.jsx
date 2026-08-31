import React from 'react';
import './Profile.css';

function Profile() {
  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="help-section dark-help">
          <div className="help-icon yellow-help">?</div>
          <span>المساعدة</span>
        </div>
      </header>

      <main className="profile-content">
        {/* أيقونة المستخدم الخضراء الكبيرة */}
        <div className="avatar-container">
          <i className="fa-solid fa-circle-user avatar-icon"></i>
        </div>

        {/* حقل الاسم الأخضر */}
        <div className="name-box">
          <span>name</span>
        </div>

        {/* قسم تسجيل الخروج برمز نصي مباشر ➜ يظهر دائماً */}
        <div className="logout-section">
<i className="fa-solid fa-right-from-bracket logout-icon"></i>
          <span>Logout</span>
        </div>
      </main>
    </div>
  );
}

export default Profile;
