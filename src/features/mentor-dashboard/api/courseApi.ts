import { ENDPOINTS, mainClient } from "@/shared/api"

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
export type CourseStatus = "DRAFT" | "PUBLISHED"

export interface CourseLesson {
  lessonId?: string
  title: string
  content?: string
  resourceUrl?: string
  orderIndex?: number
}

export interface Course {
  courseId: string
  title: string
  description?: string
  level: CourseLevel
  status: CourseStatus
  mentorId?: string
  mentorName?: string
  careerId?: string
  careerName?: string
  lessonCount: number
  enrolledCount: number
  createdAt?: string
  lessons?: CourseLesson[]
  enrolled?: boolean
  progress?: number | null
}

export interface CoursePayload {
  title: string
  description?: string
  level: CourseLevel
  careerId: string
  lessons: CourseLesson[]
}

const courseApi = {
  // ---- Mentor ----
  listMine: () => mainClient.get<Course[]>(ENDPOINTS.MENTOR_COURSES.LIST),
  create: (data: CoursePayload) => mainClient.post<Course>(ENDPOINTS.MENTOR_COURSES.CREATE, data),
  update: (id: string, data: CoursePayload) => mainClient.put<Course>(ENDPOINTS.MENTOR_COURSES.UPDATE(id), data),
  remove: (id: string) => mainClient.delete(ENDPOINTS.MENTOR_COURSES.DELETE(id)),
  setPublished: (id: string, published: boolean) =>
    mainClient.patch<Course>(`${ENDPOINTS.MENTOR_COURSES.PUBLISH(id)}?published=${published}`),

  // ---- Student ----
  browse: (careerId?: string) =>
    mainClient.get<Course[]>(careerId ? `${ENDPOINTS.COURSES.BROWSE}?careerId=${careerId}` : ENDPOINTS.COURSES.BROWSE),
  detail: (id: string) => mainClient.get<Course>(ENDPOINTS.COURSES.DETAIL(id)),
  enroll: (id: string) => mainClient.post<Course>(ENDPOINTS.COURSES.ENROLL(id)),
  unenroll: (id: string) => mainClient.delete(ENDPOINTS.COURSES.ENROLL(id)),
  setProgress: (id: string, value: number) =>
    mainClient.patch<Course>(`${ENDPOINTS.COURSES.PROGRESS(id)}?value=${value}`),
  myEnrollments: () => mainClient.get<Course[]>(ENDPOINTS.COURSES.MY_ENROLLMENTS),
}

export default courseApi
