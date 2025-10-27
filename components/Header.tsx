import React from 'react';

// הגדרת קומפוננטת Header כפונקציה רכיב של React
const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      {/* קונטיינר מרכזי עם רוחב מקסימלי, מרוכז (mx-auto), ופדינג פנימי.
        הקלאס text-center ממקם את כל התוכן הפנימי במרכז.
      */}
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        
        {/*
          הלוגו:
          - src="/logo_int.png": נתיב קובץ (הנחה: הקובץ בתיקיית public).
          - mx-auto block: ממקם את התמונה במרכז כשאלמנט בלוק.
          - w-16: מקטין את הרוחב ל-64 פיקסלים.
          - mb-2: מוסיף מרווח קטן מתחת לתמונה (מעל הכותרת).
        */}
        <img 
          src="/logo_int.png" 
          alt="לוגו קורס-נט" 
          className="mx-auto block w-16 mb-2" 
        />
        
        {/* כותרת ראשית */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          קורס-נט - מערכת חכמה להצגת מידע ואינטגרציות בין קורסים
        </h1>
        
        {/* כותרת משנית/תיאור */}
        <h2 className="text-lg md:text-xl text-gray-700">
          מערכת להדגמה בלבד עם נתונים פיקטיביים
        </h2>
        
        {/* קישור למוסד האקדמי */}
        <p className="text-md md:text-lg text-gray-600 mt-2">
          <a 
            href="https://www.talpiot.ac.il/masters-degree-heterogeneous-teaching-education-in-society-ex/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline" 
          >
            שם המוסד האקדמי/החוג/המסלול יופיע כאן עם קישור
          </a>
        </p>
      </div>
    </header>
  );
};

export default Header;
