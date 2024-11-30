export interface ContractType {
  id?: number;
  title?: string;
  createdAt?: string;
  attachment?: AttachmentType;
  course?: CourseType;
}

export interface AttachmentType {
  origName?: string;
  size?: number;
  url?: string;
  name?: string;
}
export interface CourseType {
  id?: number;
  name?: string;
  createdAt?: string;
}

export interface CustomContract {
  id?: number;
  title?: string;
  fileName?: string;
  downloadUrl: AttachmentType
}

export interface SelectTypes {
  value: string;
  label: string;
}

export interface CoursesOfficialType {
  createdAt?: string;
  disciplineId?: number;
  disciplineName?: string;
  hasCurriculum?: boolean;
  hasStudyMonths?: boolean;
  id?: number;
  imageIllustration?: string;
  name?: string;
}

export interface FileType {
  type: string;
  name: string;
  size: number;
}

export interface TableTypes {
  data: CustomContract[];
  fetchData: () => {};
}

export interface SelectTypes {
  value: string;
  label: string;
}

export interface CoursesOfficialType {
  createdAt?: string;
  disciplineId?: number;
  disciplineName?: string;
  hasCurriculum?: boolean;
  hasStudyMonths?: boolean;
  id?: number;
  imageIllustration?: string;
  name?: string;
}
