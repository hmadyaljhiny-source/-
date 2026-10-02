import React from 'react';

export default function ModeratorRow({ moderator, onDelete }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '6px', marginBottom: '6px' }}>
      <button style={{ background: '#d90429', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} onClick={() => onDelete(moderator.id)}>حذف</button>
      <span style={{ fontSize: '13px', fontWeight: '500' }}>{moderator.name}</span>
    </div>
  );
}
