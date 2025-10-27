import React from 'react';
import { Course } from '../types';
import InformationCircleIcon from './icons/InformationCircleIcon';
import UserCircleIcon from './icons/UserCircleIcon';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  isSelected: boolean;
  onViewDetails: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, isSelected, onViewDetails }) => {
  const displayName = course.CourseFormat.includes('מקוון') ? `@ ${course.CourseName}` : course.CourseName;
  
  const semesterBgColor = {
    'א': 'bg-rose-100',
    'ב': 'bg-green-100',
    'קיץ': 'bg-amber-100',
    'שנתי': 'bg-violet-100'
  }[course.SemesterPrimary] || 'bg-white';

  const hasImages = course.LecturerImageURL && course.LecturerImageURL.length > 0;
  
  return (
    <div className={`${semesterBgColor} rounded-lg shadow-md p-4 md:p-6 flex flex-col justify-between border-2 transition-all ${isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'}`}>
      <div>
        <h3 className="text-lg md:text-xl font-bold text-gray-800 h-16 md:h-20">{displayName}</h3>
        
        <div className="flex items-center mt-2 space-x-2 rtl:space-x-reverse min-h-[40px] md:min-h-[50px]">
           <div className="flex -space-x-4 rtl:space-x-reverse overflow-hidden flex-shrink-0">
             {hasImages ? (
               course.LecturerImageURL?.map((url, index) => (
                 <img 
                   key={index} 
                   className="inline-block h-8 w-8 md:h-10 md:w-10 rounded-full ring-2 ring-white object-cover" 
                   src={url} 
                   alt={course.LecturerName[index] || 'Lecturer'} 
                   title={course.LecturerName[index] || 'Lecturer'}
                   referrerPolicy="no-referrer"
                 />
               ))
             ) : (
                <div className="inline-block h-8 w-8 md:h-10 md:w-10 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center" title={course.LecturerName.join(', ')}>
                    <UserCircleIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                </div>
             )}
           </div>
          <p className="text-sm md:text-base text-gray-600">{course.LecturerName.join(', ')}</p>
        </div>

        <div className="flex items-center text-sm text-gray-500 mt-2">
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
              course.SemesterPrimary === 'א' ? 'bg-rose-200 text-rose-800' :
              course.SemesterPrimary === 'ב' ? 'bg-green-200 text-green-800' :
              course.SemesterPrimary === 'קיץ' ? 'bg-amber-200 text-amber-800' :
              course.SemesterPrimary === 'שנתי' ? 'bg-violet-200 text-violet-800' :
              'bg-gray-200 text-gray-800'
            }`}>
              סמסטר {course.SemesterPrimary}
            </span>
            {course.SemesterSecondary && (
                <span className="px-2 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-800 mr-1">
                    , {course.SemesterSecondary}
                </span>
            )}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center space-x-2 rtl:space-x-reverse">
        <button
          onClick={() => onViewDetails(course)}
          className="flex items-center px-3 py-2 text-sm md:text-base font-medium text-gray-700 bg-white/60 rounded-md hover:bg-white"
        >
          <InformationCircleIcon className="w-4 h-4 ml-1" />
          פרטים
        </button>
        <button
          onClick={() => onSelect(course)}
          className={`px-3 py-2 text-sm md:text-base font-medium rounded-md w-full transition-colors ${isSelected ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {isSelected ? 'הסר מבחירה' : 'בחר לאינטגרציה'}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
