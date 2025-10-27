import React from 'react';
import { Course } from '../types';
import CourseCard from './CourseCard';

interface CourseListProps {
  courses: Course[];
  onSelectForIntegration: (course: Course) => void;
  selectedForIntegration: Course[];
  onViewDetails: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onSelectForIntegration, selectedForIntegration, onViewDetails }) => {
  if (courses.length === 0) {
    return <div className="text-center text-gray-500 py-10">לא נמצאו קורסים התואמים את הסינון.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {courses.map(course => (
        <CourseCard
          key={course.CourseID}
          course={course}
          onSelect={onSelectForIntegration}
          isSelected={selectedForIntegration.some(c => c.CourseID === course.CourseID)}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default CourseList;
