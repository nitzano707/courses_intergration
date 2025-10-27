import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        
        <img src="/logo_int.png" alt="לוגו קורס-נט" className="mx-auto block" />
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
          קורס-נט - מערכת חכמה להצגת מידע ואינטגרציות בין קורסים
        </h1>
        
        <h2 className="text-lg md:text-xl text-gray-700">
          מערכת להדגמה בלבד עם נתונים פיקטיביים
        </h2>
        
        <p className="text-md md:text-lg text-gray-600 mt-2">
          {/* תיקון: נוספו מרכאות סביב _blank */}
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
