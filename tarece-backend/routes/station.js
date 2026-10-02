const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. جلب كافة المحطات مع أرقام هواتف المشرفين (JOIN)
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

// 2. إضافة محطة جديدة وترقية مستخدم عادي تلقائياً إلى مشرف
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const { name, supervisor_id } = req.body;

        if (!supervisor_id) {
            return res.status(400).json({ error: "يجب اختيار مستخدم لترقيته كمشرف!" });
        }

        await client.query('BEGIN');

        // إدخال المحطة بالحالة الافتراضية true (أي متاحة) لتتوافق مع حقل boolean
        const stationResult = await client.query(
            "INSERT INTO stations (name, state) VALUES (\$1, true) RETURNING *",
            [name]
        );
        const newStation = stationResult.rows[0];

        // ترقية رتبة المستخدم إلى مشرف (moderator)
        await client.query("UPDATE users SET role = 'moderator' WHERE id = \$1", [supervisor_id]);

        // ربط المحطة بالمشرف في جدول العلاقة
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

// 🌟 3. المسار الذكي لتحديث حالة الازدحام وتحويل النصوص إلى Boolean لتتوافق مع جدولك 🌟
router.post('/update-status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // نلتقط النص: 'مزدحمة' أو 'متاحة' أو 'مغلقة'

        // تحويل النص الذكي القادم من الفرونت إند إلى قيمة boolean لتقبلها قاعدة البيانات فوراً
        let booleanState;
        if (status === 'متاحة') {
            booleanState = true;   // 🟢 true تعني متاحة
        } else {
            booleanState = false;  // 🔴 false تعني مزدحمة أو مغلقة
        }

        // الاستعلام يتوافق الآن 100% مع نوع الـ boolean في جدولك ويحفظ بنجاح
        const result = await pool.query(
            'UPDATE stations SET state = \$1 WHERE id = \$2 RETURNING *',
            [booleanState, id]
        );

        res.json({ message: "تم تحديث حالة الازدحام بنجاح", station: result.rows[0] });
    } catch (error) {
        console.error("❌ خطأ أثناء التحديث بالسيرفر:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 4. تعديل بيانات المحطة العام للأدمن
router.put('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { name, supervisor_id } = req.body;

        await client.query('BEGIN');
        if (name) {
            await client.query('UPDATE stations SET name = \$1 WHERE id = \$2', [name, id]);
        }
        if (supervisor_id) {
            await client.query('DELETE FROM user_station WHERE station_id = \$1', [id]);
            await client.query("UPDATE users SET role = 'moderator' WHERE id = \$1", [supervisor_id]);
            await client.query('INSERT INTO user_station (user_id, station_id) VALUES (\$1, \$2)', [supervisor_id, id]);
        }
        await client.query('COMMIT');
        res.json({ message: "تم تحديث بيانات المحطة والمشرف بنجاح" });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// 5. حذف محطة
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
