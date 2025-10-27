import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      {/*
        הוספת relative כדי שהתמונה עם absolute תמוקם ביחס אליו,
        והסרת text-center כדי שהכותרות לא יתנגשו.
      */}
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 relative">
        
        {/*
          השינויים לתמונה:
          1. src="/logo_int.png" (תיקון נתיב)
          2. absolute (מיקום מוחלט)
          3. top-4 right-4 (מיקום בפינה ימין למעלה, 1rem שוליים מכל צד)
          4. w-20 (קובע רוחב קטן - 80px)
        */}
        <img 
          src="/logo_int.png" 
          alt="לוגו קורס-נט" 
          className="absolute top-4 right-4 w-20" 
        />
        
        {/*
          הכותרות הראשיות עדיין מיושרות למרכז/לימין, תלוי במיקומן בפועל,
          אך הסרנו את text-center מהאלמנט האב כדי שהן לא יתנגשו עם מיקום הלוגו.
          אפשר להוסיף text-center לכל אחת מהן בנפרד אם זה רצוי.
        */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mt-4">
          קורס-נט - מערכת חכמה להצגת מידע ואינטגרציות בין קורסים
        </h1>
        
        <h2 className="text-lg md:text-xl text-gray-700 text-center">
          מערכת להדגמה בלבד עם נתונים פיקטיביים
        </h2>
        
        <p className="text-md md:text-lg text-gray-600 text-center mt-2">
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
