import React, { useState } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface FilterPanelProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedSemester: string;
  onSemesterChange: (semester: string) => void;
  allLecturers: string[];
  selectedLecturers: string[];
  onLecturersChange: (lecturers: string[]) => void;
  selectedFormats: string[];
  onFormatChange: (formats: string[]) => void;
  onClearFilters: () => void;
  onClearIntegrations: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  onSearchTermChange,
  selectedSemester,
  onSemesterChange,
  allLecturers,
  selectedLecturers,
  onLecturersChange,
  selectedFormats,
  onFormatChange,
  onClearFilters,
  onClearIntegrations,
}) => {
  const [isSemesterOpen, setIsSemesterOpen] = useState(false);
  const [isLecturerOpen, setIsLecturerOpen] = useState(false);
  const [isFormatOpen, setIsFormatOpen] = useState(false);

  const handleLecturerChange = (lecturer: string) => {
    const newSelection = selectedLecturers.includes(lecturer)
      ? selectedLecturers.filter(l => l !== lecturer)
      : [...selectedLecturers, lecturer];
    onLecturersChange(newSelection);
  };

  const handleFormatChange = (format: string) => {
    const newSelection = selectedFormats.includes(format)
      ? selectedFormats.filter(f => f !== format)
      : [...selectedFormats, format];
    onFormatChange(newSelection);
  };

  const courseFormats = ['פרונטלי', 'מקוון'];
  const semesters = {
    'all': 'הכל',
    'א': 'סמסטר א׳',
    'ב': 'סמסטר ב׳',
    'קיץ': 'סמסטר קיץ',
    'שנתי': 'שנתי'
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow sticky top-24">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">סינון קורסים</h3>
      
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 sr-only">חיפוש</label>
        <input
          type="text"
          id="search"
          placeholder="חיפוש לפי שם קורס, מרצה..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 md:text-base"
        />
      </div>

      <div className="border-t border-gray-200 py-4">
        <button onClick={() => setIsSemesterOpen(!isSemesterOpen)} className="w-full flex justify-between items-center text-base font-medium text-gray-700">
          <span>סמסטר</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isSemesterOpen ? 'rotate-180' : ''}`} />
        </button>
        {isSemesterOpen && (
          <div className="mt-3 space-y-2">
            {Object.entries(semesters).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  id={`semester-${key}`}
                  name="semester"
                  type="radio"
                  checked={selectedSemester === key}
                  onChange={() => onSemesterChange(key)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`semester-${key}`} className="ml-2 rtl:mr-2 block text-base text-gray-900">{value}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 py-4">
        <button onClick={() => setIsFormatOpen(!isFormatOpen)} className="w-full flex justify-between items-center text-base font-medium text-gray-700">
          <span>מתכונת הקורס</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isFormatOpen ? 'rotate-180' : ''}`} />
        </button>
        {isFormatOpen && (
          <div className="mt-3 space-y-2">
            {courseFormats.map(format => (
              <div key={format} className="flex items-center">
                <input
                  id={`format-${format}`}
                  type="checkbox"
                  checked={selectedFormats.includes(format)}
                  onChange={() => handleFormatChange(format)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`format-${format}`} className="ml-2 rtl:mr-2 block text-base text-gray-900">{format}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 py-4">
        <button onClick={() => setIsLecturerOpen(!isLecturerOpen)} className="w-full flex justify-between items-center text-base font-medium text-gray-700">
          <span>מרצה</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isLecturerOpen ? 'rotate-180' : ''}`} />
        </button>
        {isLecturerOpen && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {allLecturers.map(lecturer => (
              <div key={lecturer} className="flex items-center">
                <input
                  id={`lecturer-${lecturer}`}
                  type="checkbox"
                  checked={selectedLecturers.includes(lecturer)}
                  onChange={() => handleLecturerChange(lecturer)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`lecturer-${lecturer}`} className="ml-2 rtl:mr-2 block text-base text-gray-900">{lecturer}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
         <button
          onClick={onClearFilters}
          className="w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          נקה סינונים
        </button>
         <button
          onClick={onClearIntegrations}
          className="w-full text-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
        >
          נקה בחירה לאינטגרציה
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
