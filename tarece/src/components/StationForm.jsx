import React, { useState } from 'react';

export default function StationForm({ onAddStation }) {
  const [val, setVal] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (val.trim()) { onAddStation(val); setVal(''); }
  };
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <input type="text" placeholder="اكتب اسم المحطة للإضافة..." value={val} onChange={e => setVal(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc', textAlign: 'right' }} />
      <button type="submit" className="btn" style={{ background: '#469c14', color: '#fff' }}>إضافة</button>
    </form>
  );
}
