import React, { useState, useEffect } from 'react';

// รูปอุปกรณ์: ไม่มีลิงก์ หรือโหลดไม่ขึ้น -> โชว์ 📦 แทน (กันช่องว่างเปล่า)
export default function SafeImage({ src, alt, iconSize = 32 }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div role="img" aria-label={alt} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: iconSize }}>
        📦
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
}
