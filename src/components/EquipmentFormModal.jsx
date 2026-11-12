import React, { useState, useRef } from 'react';
import * as api from '../api';
import { EQUIPMENT_LIMITS as L } from '../constants';
import Modal from './Modal';
import SafeImage from './SafeImage';
import Notice from './Notice';
import { labelStyle, inputStyle, btnPrimary, btnGhost } from './formStyles';

// ฟอร์มเพิ่ม (equipment = null) / แก้ไข (ส่ง equipment) อุปกรณ์ ใช้กับ POST/PUT /api/admin/equipment
// กฎตรงกับ BE: ชื่อ 1-100 ตัวอักษร, รายละเอียด <= 2000, ลิงก์รูปต้องขึ้นต้น https://, จำนวน 0-100000
// ตอนแก้: จำนวนทั้งหมดต้องไม่น้อยกว่าจำนวนที่กำลังถูกยืม (total - available)
export default function EquipmentFormModal({ equipment, categories, onClose, onSaved }) {
  const isEdit = !!equipment;
  const borrowed = isEdit ? equipment.totalQty - equipment.availableQty : 0;

  const [name, setName] = useState(equipment?.name || '');
  const [category, setCategory] = useState(equipment?.category || categories[categories.length - 1] || 'อื่นๆ');
  const [totalQty, setTotalQty] = useState(String(equipment?.totalQty ?? 1));
  const [description, setDescription] = useState(equipment?.description || '');
  const [imageUrl, setImageUrl] = useState(equipment?.imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const busy = uploading || saving;

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // เลือกไฟล์เดิมซ้ำได้
    if (!file) return;
    setError('');
    if (!L.imageTypes.includes(file.type)) {
      setError('รองรับเฉพาะไฟล์ JPG, PNG, WEBP, GIF');
      return;
    }
    if (file.size > L.imageBytesMax) {
      setError('ไฟล์ใหญ่เกิน 50MB');
      return;
    }
    setUploading(true);
    try {
      const { url } = await api.adminUploadImage(file);
      setImageUrl(url);
    } catch (err) {
      // 503 UPLOAD_NOT_CONFIGURED = BE ยังไม่ตั้ง SUPABASE_URL/KEY -> ยังวางลิงก์รูปเองได้
      setError(err.code === 'UPLOAD_NOT_CONFIGURED' ? `${err.message} — ใช้การวางลิงก์รูปแทนได้` : err.message);
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const n = name.trim();
    if (!n) return 'กรุณากรอกชื่ออุปกรณ์';
    if ([...n].length > L.nameMax) return `ชื่ออุปกรณ์ต้องไม่เกิน ${L.nameMax} ตัวอักษร`;
    if ([...description].length > L.descriptionMax) return `รายละเอียดต้องไม่เกิน ${L.descriptionMax} ตัวอักษร`;
    const url = imageUrl.trim();
    if (url && (!url.startsWith('https://') || [...url].length > L.imageUrlMax)) {
      return `ลิงก์รูปต้องขึ้นต้นด้วย https:// และยาวไม่เกิน ${L.imageUrlMax} ตัวอักษร`;
    }
    const qty = Number(totalQty);
    if (totalQty.trim() === '' || !Number.isInteger(qty) || qty < 0 || qty > L.qtyMax) {
      return `จำนวนต้องเป็นเลขจำนวนเต็ม 0 - ${L.qtyMax}`;
    }
    if (isEdit && qty < borrowed) {
      return `จำนวนทั้งหมดต้องไม่น้อยกว่าจำนวนที่กำลังถูกยืมอยู่ (${borrowed} ชิ้น)`;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    setSaving(true);
    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      imageUrl: imageUrl.trim(),
      totalQty: Number(totalQty),
    };
    try {
      const saved = isEdit
        ? await api.adminUpdateEquipment(equipment.id, payload)
        : await api.adminCreateEquipment(payload);
      onSaved(saved, isEdit);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} busy={busy} maxWidth={560}>
      <h3 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '20px', fontWeight: '900' }}>
        {isEdit ? '✏️ แก้ไขอุปกรณ์' : '➕ เพิ่มอุปกรณ์ใหม่'}
      </h3>
      <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 20px 0' }}>
        {isEdit ? `รหัสอุปกรณ์ #${equipment.id}` : 'อุปกรณ์ใหม่จะพร้อมให้ยืมครบตามจำนวนที่ระบุทันที'}
      </p>

      <Notice>{error}</Notice>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="eq-name" style={labelStyle}>ชื่ออุปกรณ์ *</label>
          <input id="eq-name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)}
            placeholder="เช่น กล้อง DSLR Canon EOS 90D" autoFocus />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label htmlFor="eq-cat" style={labelStyle}>หมวดหมู่ *</label>
            <select id="eq-cat" style={{ ...inputStyle, cursor: 'pointer' }} value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="eq-qty" style={labelStyle}>จำนวนทั้งหมด (ชิ้น) *</label>
            <input id="eq-qty" type="number" inputMode="numeric" min={borrowed} max={L.qtyMax} style={inputStyle}
              value={totalQty} onChange={(e) => setTotalQty(e.target.value)} />
            {isEdit && (
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginTop: '4px' }}>
                ถูกยืมอยู่ {borrowed} ชิ้น · ว่าง {equipment.availableQty} ชิ้น (ปรับตามส่วนต่างอัตโนมัติ)
              </span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="eq-desc" style={labelStyle}>รายละเอียด</label>
          <textarea id="eq-desc" rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={description}
            onChange={(e) => setDescription(e.target.value)} placeholder="สเปก อุปกรณ์ที่แถมมา เงื่อนไขการใช้งาน..." />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <span style={labelStyle}>รูปภาพ</span>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: '96px', height: '96px', borderRadius: '14px', background: '#F1F5F9', border: '1px solid #E2E8F0',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0,
            }}>
              <SafeImage src={imageUrl.trim()} alt="ตัวอย่างรูป" iconSize={32} />
            </div>
            <div style={{ flex: '1 1 220px', minWidth: 0 }}>
              <input ref={fileRef} type="file" accept={L.imageTypes.join(',')} onChange={handleFile} style={{ display: 'none' }} />
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => fileRef.current && fileRef.current.click()} disabled={busy}
                  style={{ ...btnGhost, padding: '8px 14px', fontSize: '13px' }}>
                  {uploading ? '⏳ กำลังอัปโหลด...' : '📁 อัปโหลดรูป'}
                </button>
                {imageUrl && (
                  <button type="button" onClick={() => setImageUrl('')} disabled={busy}
                    style={{ ...btnGhost, padding: '8px 14px', fontSize: '13px', color: '#DC2626' }}>ลบรูป</button>
                )}
              </div>
              <input aria-label="ลิงก์รูปภาพ" style={{ ...inputStyle, padding: '9px 12px', fontSize: '13px' }} value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)} placeholder="หรือวางลิงก์รูป https://..." />
              <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginTop: '4px' }}>
                JPG / PNG / WEBP / GIF ไม่เกิน 50MB
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" onClick={onClose} disabled={busy} style={btnGhost}>ยกเลิก</button>
          <button type="submit" disabled={busy} style={{ ...btnPrimary, opacity: busy ? 0.6 : 1 }}>
            {saving ? 'กำลังบันทึก...' : isEdit ? '💾 บันทึกการแก้ไข' : '➕ เพิ่มอุปกรณ์'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
