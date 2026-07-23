export interface AddStudentForm {
  email: string
  fullName: string
  admissionDate: string
  major: string
  curriculum: string
}

export interface AddedStudent {
  id: string
  email: string
  fullName: string
  admissionDate: string
  major: string
  curriculum: string
  addedAt: string
}

export interface FormErrors {
  username?: string
  email?: string
  fullName?: string
  admissionDate?: string
  major?: string
  curriculum?: string
  general?: string
}
