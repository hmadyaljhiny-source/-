import React from 'react';

export default function RoleBadge({ role }) {
  const getDetails = () => {
    if (role === 'admin') return { text: 'مدير النظام (Admin)', color: '#ffb703' };
    if (role === 'moderator') return { text: 'مشرف محطة', color: '#469c14' };
    return { text: 'مستخدم عادي', color: '#888' };
  };
  const d = getDetails();
  return (
    <span style={{ 
      backgroundColor: d.color, 
      color: '#fff', 
      padding: '5px 12px', 
      borderRadius: '20px', 
      fontSize: '12px', 
      fontWeight: 'bold', 
      marginBottom: '15px',
      display: 'inline-block'
    }}>
      {d.text}
    </span>
  );
}
