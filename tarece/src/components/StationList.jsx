import React from 'react';

export default function StationList({ stations, userRole, onDeleteStation }) {
  return (
    <div>
      {stations.map(s => (
        <div key={s.id} className="station-card">
          <div className="station-info">
            <h3>{s.name}</h3>
            {/* 🌟 عرض أرقام الهواتف للمشرفين المسؤولين عن المحطة مباشرة */}
            <p className="station-status" style={{ color: '#469c14', fontWeight: '500' }}>
              📞 المشرفون: {s.moderators || 'لا يوجد مشرف معين'}
            </p>
            <div className="station-actions">
              {(userRole === 'admin' || userRole === 'moderator') && (
                <button 
                  className="btn" 
                  style={{ background: '#d90429', color: '#fff' }} 
                  onClick={() => onDeleteStation(s.id)}
                >
                  حذف
                </button>
              )}
              <button className="btn"><i className="fa-solid fa-star"></i> مستوى الازدحام</button>
            </div>
          </div>
          <div className="station-image"><i className="fa-regular fa-image placeholder-icon"></i></div>
        </div>
      ))}
    </div>
  );
}
