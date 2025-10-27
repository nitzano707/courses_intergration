import React from 'react';
import { Course } from '../types';
import XCircleIcon from './icons/XCircleIcon';
import UserCircleIcon from './icons/UserCircleIcon';

interface CourseDetailsModalProps {
  course: Course;
  onClose: () => void;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ course, onClose }) => {
  const displayName = course.CourseFormat.includes('מקוון') ? `@ ${course.CourseName}` : course.CourseName;

  const formatNumberedLists = (text: string) => {
    if (!text) return '';
    // Add a newline before any number followed by a period or parenthesis.
    return text.replace(/(\s*)(\d+[.)])/g, '\n$2');
  };

  const renderDetail = (label: string, value: string | string[] | undefined) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    let displayValue = Array.isArray(value) ? value.join(', ') : value;
    displayValue = formatNumberedLists(displayValue);
    
    return (
      <div className="mb-4 md:mb-6">
        <h3 className="font-bold text-lg text-gray-800">{label}</h3>
        <p className="text-gray-700 md:text-lg whitespace-pre-wrap">{displayValue}</p>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-50 rounded-lg shadow-xl w-full md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XCircleIcon className="h-8 w-8" />
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">{displayName}</h2>
        
        <div className="mb-4 md:mb-6">
          <h3 className="font-bold text-lg text-gray-800">מרצים</h3>
          {course.LecturerName.map((name, index) => (
            <div key={index} className="flex items-center mt-3">
              {course.LecturerImageURL?.[index] ? (
                <img 
                  className="h-16 w-16 md:h-20 md:w-20 rounded-full mr-4 object-cover bg-gray-200" 
                  src={course.LecturerImageURL[index]}
                  alt={name}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full mr-4 bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <UserCircleIcon className="h-12 w-12 md:h-16 md:w-16 text-gray-400" />
                </div>
              )}
              <span className="text-gray-700 text-lg md:text-xl">{name}</span>
            </div>
          ))}
        </div>

        {renderDetail('סמסטר', [course.SemesterPrimary, course.SemesterSecondary].filter(Boolean).join(', '))}
        {renderDetail('מתכונת הקורס', course.CourseFormat)}
        {renderDetail('רציונל ותקציר', course.RationaleAbstract)}
        {renderDetail('מטרות הקורס', course.CourseGoals)}
        {renderDetail('דרישות הקורס ומרכיבי הציון', course.AssessmentMethods)}
        {renderDetail('תוצרי למידה', course.LearningOutcomes)}
        {renderDetail('שילוב בינה מלאכותית', course.AIIntegration)}
        {renderDetail('חיבור לקורסים אחרים', course.CourseConnections)}

      </div>
    </div>
  );
};

export default CourseDetailsModal;
