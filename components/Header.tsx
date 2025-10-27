import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      {/*
        השינויים ב-div:
        1. הוספת pr-24 (Padding Right - 24) כברירת מחדל, המפנה מקום ללוגו.
        2. הוספת sm:pr-4 כדי לבטל את השוליים הגדולים pr-24 במסכי sm ומעלה,
           שבהם המיקום המוחלט לא אמור להפריע.
      */}
      <div className="max-w-7xl mx-auto py-4 px-4 relative pr-24 sm:pr-4">
        
        {/*
          התמונה נשארה עם המיקום המוחלט absolute top-4 right-4 w-20
        */}
        <img 
          src="/logo_int.png" 
          alt="לוגו קורס-נט" 
          className="absolute top-4 right-4 w-20" 
        />
        
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
