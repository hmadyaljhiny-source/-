const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. مسار تسجيل الدخول والتحقق الحقيقي من الحساب
router.post('/login', async (req, res) => {
    try {
        const { number, password } = req.body; 

        // استعلام متوافق مع اسم الحقل namber في جدولك
        const result = await pool.query(
            'SELECT * FROM users WHERE namber = \$1',
            [number]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'المستخدم غير موجود في النظام' });
        }

        const user = result.rows[0]; 

        // التحقق من تطابق الباسورد
        if (user.password !== password) {
            return res.status(400).json({ error: 'كلمة المرور غير صحيحة' });
        }

        // إرجاع البيانات للفرونت إند مع الدور المكتوب (admin / moderator / user)
        res.json({
            id: user.id,
            number: user.namber, 
            role: user.role
        });

    } catch (error) {
        console.error("❌ خطأ تسجيل دخول بالخادم:", error.message);
        res.status(500).json({ error: 'حدث خطأ في الخادم أثناء تسجيل الدخول' });
    }
});

// 2. إنشاء حساب جديد (التسجيل من الفرونت إند كـ مستخدم عادي)
router.post('/', async (req, res) => {
    try {
        const { number, role, password } = req.body;

        console.log("=== طلب تسجيل جديد مستلم ===");
        console.log("الرقم المرسل للتخزين في namber:", number);

        const result = await pool.query(
            'INSERT INTO users (namber, role, password) VALUES (\$1, \$2, \$3) RETURNING *',
            [
                number, 
                role || 'user', 
                password
            ]
        );

        console.log("🚀 تم الحفظ في قاعدة البيانات بنجاح!");
        res.json(result.rows);
    } catch (error) {
        console.error("❌ خطأ صادر من قاعدة البيانات (PostgreSQL):", error.message);
        res.status(400).json({ error: `فشل في قاعدة البيانات: ${error.message}` });
    }
});

// 3. جلب قائمة كافة المستخدمين
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. تعديل بيانات حساب
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { number, role, password } = req.body;
        const result = await pool.query(
            'UPDATE users SET namber = \$1, role = \$2, password = \$3 WHERE id = \$4 RETURNING *',
            [number, role, password, id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. حذف الحساب
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE id = \$1', [id]);
        res.json({ message: 'تم الحذف بنجاح' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
