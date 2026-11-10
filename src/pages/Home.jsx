import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockEquipments } from '../data/mockEquipments';
import EquipmentCard from '../components/EquipmentCard';

export default function Home() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');

  // ฟังก์ชันค้นหาจาก Hero
  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/equipments?search=${encodeURIComponent(heroSearch)}`);
    } else {
      navigate('/equipments');
    }
  };

  // หมวดหมู่สำหรับกดเลือกด่วน
  const categoriesList = [
    { id: 'ทั้งหมด', name: '📦 ทั้งหมด', desc: 'อุปกรณ์ทุกประเภทในคลัง' },
    { id: 'อุปกรณ์ถ่ายภาพ', name: '📷 อุปกรณ์ถ่ายภาพ', desc: 'กล้อง เลนส์ และขาตั้ง' },
    { id: 'ไอที', name: '💻 ไอที & โน้ตบุ๊ก', desc: 'แล็ปท็อป และอุปกรณ์เสริม' },
    { id: 'กีฬา', name: '⚽ อุปกรณ์กีฬา', desc: 'ลูกบอล ไม้แบด และอุปกรณ์เล่น' }
  ];

  // กรองอุปกรณ์ตามหมวดหมู่ที่เลือกบนหน้า Home
  const displayedEquipments = mockEquipments.filter(item => {
    if (activeCategory === 'ทั้งหมด') return true;
    return item.category === activeCategory;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* 🔮 1. Hero Banner สุดอลังการ */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #0284C7 100%)',
        borderRadius: '28px',
        padding: '56px 48px',
        color: '#FFFFFF',
        marginBottom: '40px',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '700px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38BDF8',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '13px',
            fontWeight: '800',
            marginBottom: '20px'
          }}>
            📍 KHONGUNAI - ONLINE RENTAL SYSTEM
          </div>

          <h1 style={{ fontSize: '42px', lineHeight: '1.2', margin: '0 0 16px 0', fontWeight: '900', letterSpacing: '-0.5px' }}>
            "ของอยู่ไหน... หาอะไรอยู่หรือเปล่า?" <br />
            <span style={{ color: '#38BDF8', textShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}>
              เช็กสต็อกและยืมอุปกรณ์ได้ทันที
            </span>
          </h1>

          <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
            ศูนย์รวมอุปกรณ์สำหรับยืม-คืนออนไลน์ อนุมัติไวผ่านแอดมิน ตรวจสอบประวัติได้ตลอด 24 ชั่วโมง
          </p>

          {/* Interactive Search Input Bar */}
          <form onSubmit={handleHeroSearchSubmit} style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.12)',
            padding: '8px',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            maxWidth: '600px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}>
            <input 
              type="text"
              placeholder="🔍 พิมพ์ชื่ออุปกรณ์ที่ต้องการยืม (เช่น กล้อง, ไมค์, โน้ตบุ๊ก)..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                padding: '12px 16px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)'
              }}
            >
              ค้นหาเลย
            </button>
          </form>
        </div>

        {/* ตกแต่งกราฟิกพื้นหลัง */}
        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '240px', opacity: '0.08', pointerEvents: 'none', userSelect: 'none' }}>
          📦
        </div>
      </div>

      {/* 🗂️ 2. Interactive Category Cards (การ์ดเลือกหมวดหมู่แบบกดสลับได้ทันที) */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '22px', color: '#0F172A', margin: '0 0 6px 0', fontWeight: '800' }}>
            🏷️ เลือกดูอุปกรณ์ตามหมวดหมู่
          </h3>
          <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>คลิกเลือกหมวดหมู่ที่ต้องการเพื่อกรองอุปกรณ์ด้านล่างทันที</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
          {categoriesList.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <div 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#0F172A',
                  padding: '20px',
                  borderRadius: '18px',
                  border: isSelected ? '1px solid #38BDF8' : '1px solid #E2E8F0',
                  boxShadow: isSelected ? '0 10px 25px rgba(56, 189, 248, 0.25)' : '0 4px 12px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: '800', color: isSelected ? '#38BDF8' : '#0F172A' }}>
                  {cat.name}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: isSelected ? '#94A3B8' : '#64748B' }}>
                  {cat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔥 3. Section แสดงรายการอุปกรณ์ตามหมวดหมู่ที่กดเลือก */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '22px', color: '#0F172A', margin: '0 0 4px 0', fontWeight: '800' }}>
              🔥 รายการอุปกรณ์ ({activeCategory})
            </h3>
            <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>
              แสดงอุปกรณ์ทั้งหมด {displayedEquipments.length} รายการที่พร้อมให้ส่งคำขอยืม
            </p>
          </div>
          <button 
            onClick={() => navigate('/equipments')}
            style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}
          >
            ดูคลังทั้งหมด ➔
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {displayedEquipments.map((equipment) => (
            <div key={equipment.id} onClick={() => navigate(`/equipment/${equipment.id}`)} style={{ cursor: 'pointer' }}>
              <EquipmentCard equipment={equipment} onBorrow={() => navigate(`/equipment/${equipment.id}`)} />
            </div>
          ))}
        </div>
      </div>

      {/* 🛠️ 4. Interactive How It Works (ขั้นตอนการยืม 3 ขั้นตอนง่ายๆ) */}
      <div style={{ 
        background: '#FFFFFF', 
        padding: '40px', 
        borderRadius: '24px', 
        border: '1px solid #E2E8F0', 
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.03)',
        marginBottom: '40px' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ background: '#E0F2FE', color: '#0284C7', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
            EASY STEPS
          </span>
          <h3 style={{ fontSize: '26px', color: '#0F172A', margin: '10px 0 6px 0', fontWeight: '900' }}>
            ขั้นตอนการยืม-คืนอุปกรณ์กับ khongunai
          </h3>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>ทำรายการได้ง่ายๆ ภายใน 3 ขั้นตอน</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '18px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
            <span style={{ width: '48px', height: '48px', background: '#0284C7', color: '#FFF', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: '900', marginBottom: '16px' }}>1</span>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0F172A', fontWeight: '800' }}>เลือกอุปกรณ์ที่ต้องการ</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.6' }}>ค้นหาอุปกรณ์ในคลัง ตรวจสอบสต็อกคงเหลือ และรายละเอียดก่อนทำการยืม</p>
          </div>

          <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '18px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
            <span style={{ width: '48px', height: '48px', background: '#0284C7', color: '#FFF', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: '900', marginBottom: '16px' }}>2</span>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0F172A', fontWeight: '800' }}>ส่งคำขอยืมออนไลน์</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.6' }}>ระบุวันที่ยืม-คืน พร้อมวัตถุประสงค์ เพื่อรอการอนุมัติจากแอดมิน</p>
          </div>

          <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '18px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
            <span style={{ width: '48px', height: '48px', background: '#16A34A', color: '#FFF', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: '900', marginBottom: '16px' }}>3</span>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0F172A', fontWeight: '800' }}>คืนของ & เขียนรีวิว</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.6' }}>เมื่อใช้งานเสร็จ สามารถกดคืนอุปกรณ์ในระบบและให้คะแนนรีวิวการใช้งาน</p>
          </div>
        </div>
      </div>

    </div>
  );
}