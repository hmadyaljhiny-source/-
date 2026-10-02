const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. جلب كافة المحطات مع أرقام هواتف المشرفين (JOIN) بدون حقل location
router.get('/', async (req, res) => {
    try {
        const queryText = `
            SELECT s.id, s.name, s.state, 
                   COALESCE(string_agg(u.namber::text, ', '), 'لا يوجد مشرف') as moderators
            FROM stations s
            LEFT JOIN user_station us ON s.id = us.station_id
            LEFT JOIN users u ON us.user_id = u.id
            GROUP BY s.id, s.name, s.state
            ORDER BY s.id ASC
        `;
        const result = await pool.query(queryText);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// 2. إضافة محطة جديدة وترقية المستخدم المختار إلى مشرف تلقائياً
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const { name, supervisor_id } = req.body; // نكتفي بـ name و supervisor_id فقط

        if (!supervisor_id) {
            return res.status(400).json({ error: "يجب اختيار مستخدم لترقيته وتعيينه كمشرف للمحطة!" });
        }

        // فحص صلاحية المستخدم المختار
        const userCheck = await pool.query('SELECT * FROM users WHERE id = \$1', [supervisor_id]);
        if (userCheck.rows.length === 0) {
            return res.status(400).json({ error: "المستخدم المختار غير موجود!" });
        }
        if (userCheck.rows[0].role === 'admin') {
            return res.status(400).json({ error: "لا يمكن ترقية أو تعيين حساب الأدمن كمشرف محطة!" });
        }

        await client.query('BEGIN');

        // أ. إدخال المحطة في جدول stations (الحقول المتاحة: name فقط، وحالة state تأخذ القيمة الافتراضية true)
        const stationResult = await client.query(
            'INSERT INTO stations (name) VALUES (\$1) RETURNING *',
            [name]
        );
        const newStation = stationResult.rows[0];

        // ب. ترقية رتبة المستخدم المختار إلى مشرف (moderator) في جدول users
        await client.query(
            "UPDATE users SET role = 'moderator' WHERE id = \$1",
            [supervisor_id]
        );

        // ج. ربط المحطة بالمشرف المترقي حديثاً في جدول العلاقة user_station
        await client.query(
            'INSERT INTO user_station (user_id, station_id) VALUES (\$1, \$2)',
            [supervisor_id, newStation.id]
        );

        await client.query('COMMIT');
        res.json(newStation);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// 3. تعديل المحطة (تغيير الاسم أو تغيير وتحديث المشرف المسؤول)
router.put('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { name, supervisor_id } = req.body;

        await client.query('BEGIN');

        // أ. تحديث اسم المحطة
        if (name) {
            await client.query('UPDATE stations SET name = \$1 WHERE id = \$2', [name, id]);
        }

        // ب. تغيير وتحديث المشرف إذا تم إرسال معرّف جديد
        if (supervisor_id) {
            // فحص صلاحية المشرف الجديد
            const userCheck = await client.query('SELECT * FROM users WHERE id = \$1', [supervisor_id]);
            if (userCheck.rows.length === 0 || userCheck.rows[0].role === 'admin') {
                return res.status(400).json({ error: "المشرف المختار غير صالح أو رتبته أدمن!" });
            }

            // مسح الارتباطات القديمة لهذه المحطة في جدول العلاقة
            await client.query('DELETE FROM user_station WHERE station_id = \$1', [id]);

            // ترقية المستخدم الجديد إلى مشرف
            await client.query("UPDATE users SET role = 'moderator' WHERE id = \$1", [supervisor_id]);

            // إنشاء الارتباط الجديد
            await client.query('INSERT INTO user_station (user_id, station_id) VALUES (\$1, \$2)', [supervisor_id, id]);
        }

        await client.query('COMMIT');
        res.json({ message: "تم تحديث بيانات المحطة والمشرف بنجاح" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// 4. حذف محطة
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM user_station WHERE station_id = \$1', [id]);
        await pool.query('DELETE FROM stations WHERE id = \$1', [id]);
        res.json({ message: 'تم الحذف بنجاح' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
