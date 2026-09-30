import { useState } from 'react';

function UserForm({ onAddUser }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddUser({ name });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اسم المستخدم الجديد"
      />
      <button type="submit">إضافة مستخدم</button>
    </form>
  );
}

export default UserForm;