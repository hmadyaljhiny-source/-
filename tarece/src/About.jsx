import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <header className="about-header">
        <div className="help-section dark-help">
          <div className="help-icon yellow-help">?</div>
          <span>المساعدة</span>
        </div>
      </header>

      <main className="about-content">
        {/* شعار التطبيق أو أيقونة معلومات */}
        <div className="info-icon-container">
          <i className="fa-solid fa-circle-info info-large-icon"></i>
        </div>

        <div className="about-card">
          <h3>حول التطبيق</h3>
          <p>
            هذا التطبيق مصمم لمساعدتك في العثور على المحطات القريبة، ومعرفة حالة الازدحام والموقع الجغرافي بكل سهولة وسرعة.
          </p>
        </div>

        <div className="version-box">
          <span>الإصدار 1.0.0</span>
        </div>
      </main>
    </div>
  );
}
