import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = 'http://localhost:3000';

// 🌟 تم تأمين السطر الأول بالكامل ليتوافق مع الـ Props القادمة من صفحة البروفايل
export default function AdminDashboard({ user, moderators, onAddModerator, onDeleteModerator }) {
  const [stations, setStations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // حالات إضافة محطة
  const [stationName, setStationName] = useState('');
  const [selectedUserForMod, setSelectedUserForMod] = useState('');

  // حالات تعديل محطة
  const [editingStationId, setEditingStationId] = useState(null);
  const [editStationName, setEditStationName] = useState('');
  const [editSelectedUser, setEditSelectedUser] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resStations = await axios.get(`${API_URL}/stations`);
      const resUsers = await axios.get(`${API_URL}/users`);
      
      if (resStations.data && Array.isArray(resStations.data)) {
        setStations(resStations.data);
      }
      if (resUsers.data && Array.isArray(resUsers.data)) {
        // استثناء الأدمن من الترشيح للإشراف لحماية النظام
        const nonAdminUsers = resUsers.data.filter(u => u.role !== 'admin');
        setAllUsers(nonAdminUsers);
      }
    } catch (error) {
      console.error(error);
      setMessage("فشل في تحميل البيانات من الخادم");
    } finally {
      setLoading(false);
    }
  };

  // أ. دالة إضافة محطة جديدة وترقية مستخدم عادي تلقائياً
  const handleAddStation = async (e) => {
    e.preventDefault();
    if (!stationName.trim() || !selectedUserForMod) {
      setMessage("⚠️ يجب كتابة اسم المحطة واختيار مستخدم لترقيته كمشرف!");
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      await axios.post(`${API_URL}/stations`, {
        name: stationName,
        supervisor_id: selectedUserForMod
      });
      setMessage("🚀 تم إنشاء المحطة وترقية المستخدم إلى مشرف بنجاح!");
      setStationName('');
      setSelectedUserForMod('');
      fetchData(); // تحديث الجدول حياً
    } catch (error) {
      setMessage(error.response?.data?.error || "فشل إضافة المحطة");
    } finally {
      setLoading(false);
    }
  };

  // ب. دالة تعديل وتحديث مشرف المحطة
  const handleUpdateStation = async (e) => {
    e.preventDefault();
    if (!editStationName.trim() || !editSelectedUser) {
      setMessage("⚠️ يجب كتابة اسم المحطة واختيار المشرف البديل!");
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      await axios.put(`${API_URL}/stations/${editingStationId}`, {
        name: editStationName,
        supervisor_id: editSelectedUser
      });
      setMessage("📝 تم تحديث بيانات المحطة والمشرف بنجاح!");
      setEditingStationId(null);
      setEditStationName('');
      setEditSelectedUser('');
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.error || "فشل تحديث المحطة");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (station) => {
    setEditingStationId(station.id);
    setEditStationName(station.name);
    setEditSelectedUser('');
  };

  const handleDeleteStation = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه المحطة؟")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/stations/${id}`);
      setMessage("تم حذف المحطة بنجاح");
      fetchData();
    } catch (error) {
      setMessage("فشل حذف المحطة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page" style={{ width: '100%' }}>
      <main className="admin-content" style={{ direction: 'rtl', width: '100%' }}>
        <div className="admin-title-box">
          <h2>لوحة الإدارة المحدثة</h2>
          <p>مرحبًا الأدمن: {user?.number || user?.namber}</p>
        </div>

        {message && <p className="alert-message" style={{ color: '#469c14', textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>{message}</p>}
        {loading && <p className="loading-text" style={{ textAlign: 'center', color: '#888' }}>جاري المزامنة مع قاعدة البيانات...</p>}

        {/* 🏬 1. نموذج إضافة محطة وترقية مستخدم */}
        {!editingStationId && (
          <div className="admin-card-box">
            <h3>➕ إضافة محطة جديدة وترقية مستخدم لإشرافها</h3>
            <form onSubmit={handleAddStation} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="اسم المحطة الجديد..." value={stationName} onChange={e => setStationName(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', textAlign: 'right' }} />
              
              <select value={selectedUserForMod} onChange={e => setSelectedUserForMod(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', direction: 'rtl' }}>
                <option value="">-- اختر مستخدم عادي لترقيته كمشرف --</option>
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>رقم: {u.namber || u.number} ({u.role})</option>
                ))}
              </select>
              <button type="submit" className="btn-admin-submit" style={{ background: '#469c14', color: '#fff', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>أنشئ المحطة ورفّع المشرف</button>
            </form>
          </div>
        )}

        {/* 📝 2. نموذج التعديل */}
        {editingStationId && (
          <div className="admin-card-box" style={{ border: '2px solid #ffb703' }}>
            <h3>📝 تعديل المحطة وتعيين مشرف جديد لها</h3>
            <form onSubmit={handleUpdateStation} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="تعديل اسم المحطة..." value={editStationName} onChange={e => setEditStationName(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', textAlign: 'right' }} />
              
              <select value={editSelectedUser} onChange={e => setEditSelectedUser(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', direction: 'rtl' }}>
                <option value="">-- اختر مستخدم بديل لترقيته وإسناد الإشراف إليه --</option>
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>رقم: {u.namber || u.number} ({u.role})</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-admin-submit" style={{ flex: 1, background: '#ffb703', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ التعديلات</button>
                <button type="button" onClick={() => setEditingStationId(null)} style={{ padding: '10px', borderRadius: '8px', background: '#888', color: '#fff', border: 'none', cursor: 'pointer' }}>إلغاء</button>
              </div>
            </form>
          </div>
        )}

        {/* 📋 3. الجدول العام للمحطات والمشرفين */}
        <div className="admin-card-box" style={{ maxWidth: '100%', overflowX: 'auto' }}>
          <h3>📋 دليل المحطات الحالي والمشرفين</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', textAlign: 'center' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ccc' }}>
                <th style={{ padding: '8px' }}>المحطة</th>
                <th style={{ padding: '8px' }}>المشرفين المعينين (رقم الهاتف)</th>
                <th style={{ padding: '8px' }}>التحكم</th>
              </tr>
            </thead>
            <tbody>
              {stations.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.name}</td>
                  <td style={{ padding: '10px', color: '#469c14', fontWeight: '500' }}>{s.moderators}</td>
                  <td style={{ padding: '10px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button onClick={() => startEdit(s)} style={{ background: '#ffb703', color: '#1a1a1a', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>تعديل</button>
                    <button onClick={() => handleDeleteStation(s.id)} style={{ background: '#d90429', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
