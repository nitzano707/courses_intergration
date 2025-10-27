import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          קורס-נט - מערכת חכמה להצגת מידע ואינטגרציות בין קורסים
        </h1>
        <p className="text-md md:text-lg text-gray-600">
          <a 
            href="https://www.talpiot.ac.il/masters-degree-heterogeneous-teaching-education-in-society-ex/" 
            target="_blank"  // צריך מרכאות מסביב ל-_blank
            rel="noopener noreferrer"  // מומלץ להוסיף מטעמי אבטחה
            className="text-blue-600 hover:text-blue-800 underline"  // אופציונלי - לעיצוב הלינק
          >
            שם המוסד האקדמי/החוג/המסלול יופיע כאן עם קישור
          </a>
      </p>
      </div>
    </header>
  );
};

export default Header;
