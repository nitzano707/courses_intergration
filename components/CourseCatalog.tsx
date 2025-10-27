import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import FilterPanel from './FilterPanel';
import CourseList from './CourseList';

interface CourseCatalogProps {
  courses: Course[];
  onSelectForIntegration: (course: Course) => void;
  selectedForIntegration: Course[];
  onViewDetails: (course: Course) => void;
  onClearIntegrations: () => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ courses, onSelectForIntegration, selectedForIntegration, onViewDetails, onClearIntegrations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedLecturers, setSelectedLecturers] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);

  const lecturers = useMemo(() => {
    const lecturerSet = new Set<string>();
    courses.forEach(course => {
      course.LecturerName.forEach(name => lecturerSet.add(name));
    });
    return Array.from(lecturerSet).sort();
  }, [courses]);
  
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const searchMatch = searchTerm.trim() === '' ||
        course.CourseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.LecturerName.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        course.RationaleAbstract.toLowerCase().includes(searchTerm.toLowerCase());

      const semesterMatch = selectedSemester === 'all' ||
        course.SemesterPrimary === selectedSemester ||
        course.SemesterSecondary === selectedSemester;

      const lecturerMatch = selectedLecturers.length === 0 ||
        selectedLecturers.some(selected => course.LecturerName.includes(selected));
        
      const formatMatch = selectedFormat.length === 0 || selectedFormat.some(format => course.CourseFormat.includes(format));

      return searchMatch && semesterMatch && lecturerMatch && formatMatch;
    });
  }, [courses, searchTerm, selectedSemester, selectedLecturers, selectedFormat]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSemester('all');
    setSelectedLecturers([]);
    setSelectedFormat([]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <FilterPanel
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          allLecturers={lecturers}
          selectedLecturers={selectedLecturers}
          onLecturersChange={setSelectedLecturers}
          selectedFormats={selectedFormat}
          onFormatChange={setSelectedFormat}
          onClearFilters={handleClearFilters}
          onClearIntegrations={onClearIntegrations}
        />
      </aside>
      <section className="w-full md:w-3/4 lg:w-4/5">
        <CourseList 
          courses={filteredCourses}
          onSelectForIntegration={onSelectForIntegration}
          selectedForIntegration={selectedForIntegration}
          onViewDetails={onViewDetails}
        />
      </section>
    </div>
  );
};

export default CourseCatalog;
