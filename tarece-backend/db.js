const { Pool } = require('pg'); // تأكد أن P كابيتال هنا

const pool = new Pool({
  user: 'postgres',          // اسم المستخدم
  host: 'localhost',         // عنوان السيرفر
  database: 'tarece', // اسم قاعدة البيانات (مهم جداً)
  password: 'postgres', // كلمة المرور التي اخترتها عند التثبيت
  port: 5432,                // المنفذ الافتراضي
});
module.exports = pool;