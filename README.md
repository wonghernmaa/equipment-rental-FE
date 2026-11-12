# equipment-rental-FE (khongunai)

FE ของระบบยืม-คืนอุปกรณ์ (React 18 + react-router 7, CRA) เชื่อมกับ BE (Go) ผ่าน REST + JWT

## เริ่มใช้งาน
```bash
cp .env.example .env        # แก้ REACT_APP_API_URL ให้ชี้ไป BE
npm install
npm start                   # http://localhost:3000
npm test
```
- ต้องเพิ่ม origin ของ FE ใน `ALLOWED_ORIGINS` ของ BE (เช่น `http://localhost:3000`) ไม่งั้นติด CORS
- Vercel: ตั้ง `REACT_APP_API_URL` เป็น URL ของ Render แล้ว deploy ใหม่ (ค่านี้ถูกฝังตอน build)
- แอดมินคนแรก: สมัครผ่านหน้าเว็บ แล้วรัน SQL ใน Supabase
  `UPDATE members SET role='admin' WHERE lower(email)='you@example.com';` แล้ว login ใหม่

## โครงสร้างส่วนที่เชื่อม BE
| ไฟล์ | หน้าที่ |
|---|---|
| `src/api/client.js` | ยิง HTTP ทุกคำขอ, แนบ Bearer token, แปลง error ของ BE เป็น `ApiError`, 401 → logout |
| `src/api/index.js` | ฟังก์ชันครบทุก endpoint ตาม README ของ BE |
| `src/auth/AuthContext.jsx` | login/register/logout จริง, เก็บ token, ออกจากระบบเมื่อตั๋วหมดอายุ (1 ชม.) |
| `src/hooks/useEquipments.js`, `useCategories.js` | โหลดอุปกรณ์/หมวดหมู่ |
| `src/pages/AdminEquipments.jsx` | **หน้าแอดมิน เพิ่ม/แก้ไข/ลบอุปกรณ์ + อัปโหลดรูป** (`/admin/equipments`) |
| `src/pages/AdminDashboard.jsx` | คำขอยืม: อนุมัติ / ปฏิเสธ / รับคืน (`/admin`) |

## สิทธิ์ผู้ใช้ (ตรงกับ BE)
- ยังไม่ login: ดูอุปกรณ์ได้
- `guest` (บัญชีที่สมัครเป็นผู้เยี่ยมชม): ดูอุปกรณ์ได้อย่างเดียว ยืม/Profile/ประวัติไม่ได้
- `member`: ยืม, ดูประวัติ, Profile, เปลี่ยนรหัสผ่าน
- `admin`: ทำได้เหมือน member + หน้าหลังบ้านทั้งหมด

## สิ่งที่ตัดออกเพราะ BE ไม่รองรับ
ช่อง "วัตถุประสงค์" ตอนยืม, เหตุผลการปฏิเสธ, ปุ่มยกเลิกคำขอ/คืนของเองฝั่งสมาชิก, ระบบรีวิว,
ปุ่มลบรายการคำขอ — ถ้าต้องการต้องเพิ่ม endpoint/คอลัมน์ฝั่ง BE ก่อน
