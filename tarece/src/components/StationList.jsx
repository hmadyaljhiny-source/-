import React from 'react';

export default function StationList({ stations, userRole, onDeleteStation }) {
  
  // دالة ذكية تقرأ قيمة الـ boolean من قاعدة البيانات وتترجمها للمستخدم
  const showAlertStatus = (stationName, booleanState) => {
    // إذا كانت القيمة true تعني متاحة، وإذا كانت false تعني مزدحمة
    const statusText = booleanState === true ? '🟢 متاحة الآن' : '🔴 مزدحمة / غير متاحة حالياً';
    alert(`📍 محطة: ${stationName}\n📊 مستوى الازدحام الحالي: [ ${statusText} ]`);
  };

  return (
    <div>
      {stations.map(s => (
        <div key={s.id} className="station-card">
          <div className="station-info">
            <h3>{s.name}</h3>
            <p className="station-status" style={{ color: '#469c14', fontWeight: '500' }}>
              📞 المشرفون: {s.moderators || 'لا يوجد مشرف معين'}
            </p>
            <div className="station-actions">
              {userRole === 'admin' && (
                <button className="btn" style={{ background: '#d90429', color: '#fff' }} onClick={() => onDeleteStation(s.id)}>حذف</button>
              )}
              <button className="btn" onClick={() => showAlertStatus(s.name, s.state)}>
                <i className="fa-solid fa-star"></i> عرض مستوى الازدحام
              </button>
            </div>
          </div>
          <div className="station-image"><i className="fa-regular fa-image placeholder-icon"></i></div>
        </div>
      ))}
    </div>
  );
}
