import { useState, useEffect, useCallback, useRef } from 'react';
import * as api from '../api';

// โหลดรายการอุปกรณ์จาก GET /api/equipment
// reload({ silent: true }) = โหลดซ้ำเงียบ ๆ ไม่โชว์ spinner (ใช้หลังเพิ่ม/แก้/ลบ)
export default function useEquipments() {
  const [state, setState] = useState({ items: [], loading: true, error: null });
  const reqId = useRef(0);

  const reload = useCallback(async (opts) => {
    const id = ++reqId.current;
    const silent = !!(opts && opts.silent === true);
    if (!silent) setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const items = await api.listEquipment();
      if (id === reqId.current) setState({ items, loading: false, error: null });
    } catch (e) {
      if (id === reqId.current) setState((s) => ({ items: silent ? s.items : [], loading: false, error: e.message }));
    }
  }, []);

  useEffect(() => {
    reload();
    return () => {
      reqId.current++; // ทิ้งผลลัพธ์ที่ตอบมาหลังหน้าถูกปิดไปแล้ว
    };
  }, [reload]);

  return { ...state, reload };
}
