export interface Course {
  CourseID: string;
  CourseName: string;
  LecturerName: string[];
  LecturerImageURL?: string[];
  SemesterPrimary: string;
  SemesterSecondary: string;
  CourseFormat: 'מקוון' | 'פרונטלי' | string;
  RationaleAbstract: string;
  CourseGoals: string;
  AssessmentMethods: string;
  LearningOutcomes: string;
  AIIntegration: string;
  CourseConnections: string;
}

export enum View {
  Catalog = 'CATALOG',
  Integrations = 'INTEGRATIONS'
}