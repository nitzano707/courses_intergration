import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Course, View } from './types';
import { fetchCourses } from './services/googleSheetService';
import Header from './components/Header';
import CourseCatalog from './components/CourseCatalog';
import IntegrationsEngine from './components/IntegrationsEngine';
import CourseDetailsModal from './components/CourseDetailsModal';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Catalog);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCoursesForIntegration, setSelectedCoursesForIntegration] = useState<Course[]>([]);
  const [courseForDetails, setCourseForDetails] = useState<Course | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const courses = await fetchCourses();
        setAllCourses(courses);
      } catch (err) {
        setError('נכשל בטעינת נתוני הקורסים. אנא ודא שהגיליון הציבורי של Google Sheets מוגדר כהלכה ושהעמודות תואמות למבנה הנדרש.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleSelectCourseForIntegration = useCallback((course: Course) => {
    setSelectedCoursesForIntegration(prev => {
      if (prev.find(c => c.CourseID === course.CourseID)) {
        return prev.filter(c => c.CourseID !== course.CourseID);
      }
      if (prev.length < 4) {
        return [...prev, course];
      }
      return prev;
    });
  }, []);
  
  const handleRemoveCourseFromIntegration = useCallback((courseId: string) => {
    setSelectedCoursesForIntegration(prev => prev.filter(c => c.CourseID !== courseId));
  }, []);

  const handleClearIntegrationsSelection = useCallback(() => {
    setSelectedCoursesForIntegration([]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <nav className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <button
                    onClick={() => setView(View.Catalog)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${view === View.Catalog ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    קטלוג קורסים
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setView(View.Integrations)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${view === View.Integrations ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      מנוע אינטגרציות
                    </button>
                     {selectedCoursesForIntegration.length > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs font-medium text-white">
                        {selectedCoursesForIntegration.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {isLoading && <div className="text-center p-8">טוען קורסים...</div>}
          {error && <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>}
          {!isLoading && !error && (
            <>
              {view === View.Catalog && (
                <CourseCatalog 
                  courses={allCourses} 
                  onSelectForIntegration={handleSelectCourseForIntegration}
                  selectedForIntegration={selectedCoursesForIntegration}
                  onViewDetails={setCourseForDetails}
                  onClearIntegrations={handleClearIntegrationsSelection}
                />
              )}
              {view === View.Integrations && (
                <IntegrationsEngine 
                  selectedCourses={selectedCoursesForIntegration}
                  onRemoveCourse={handleRemoveCourseFromIntegration}
                />
              )}
            </>
          )}
        </div>
      </main>


      {/* Footer - הוסף את זה כאן */}
      <footer className="mt-auto bg-gray-800 text-white text-center py-4">
        <div className="container mx-auto">
          <p className="font-semibold">ד"ר ניצן אליקים</p>
          <p className="text-sm text-gray-300 mt-1">
            מערכת חכמה לזיהוי אינטגרציות בין קורסים | Powered by Gemini AI
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © 2025 כל הזכויות שמורות
          </p>
        </div>
      </footer>

      
      
      {courseForDetails && (
        <CourseDetailsModal 
          course={courseForDetails} 
          onClose={() => setCourseForDetails(null)} 
        />
      )}
    </div>
  );
};

export default App;
