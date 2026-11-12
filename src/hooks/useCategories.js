import { useState, useEffect } from 'react';
import * as api from '../api';
import { CATEGORIES } from '../constants';

// หมวดหมู่จาก GET /api/categories (ถ้าโหลดไม่ได้ใช้ค่าสำรองใน constants.js)
export default function useCategories() {
  const [categories, setCategories] = useState(CATEGORIES);
  useEffect(() => {
    let alive = true;
    api
      .listCategories()
      .then((items) => {
        if (alive && items && items.length) setCategories(items);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return categories;
}
