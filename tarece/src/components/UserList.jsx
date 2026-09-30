function UserList({ users, onUpdate, onDelete }) {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => onUpdate(user.id, user.name + ' ✓')}>
            تعديل
          </button>
          <button onClick={() => onDelete(user.id)}>حذف</button>
        </div>
      ))}
    </div>
  );
}

export default UserList;