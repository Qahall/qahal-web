import { axiosInstance } from "@/lib/axios";

export interface CourseBase {
  nombre: string;
}

export interface CourseCreate extends CourseBase { }

export interface CourseResponse extends CourseBase {
  id: number;
}

const baseEndpoint = "cursos"
export async function getCourses(): Promise<CourseResponse[]> {
  const res = await axiosInstance.get<CourseResponse[]>(baseEndpoint);
  return res.data;
}

export async function createCourse(
  data: CourseCreate
): Promise<CourseResponse> {
  const res = await axiosInstance.post<CourseResponse>(baseEndpoint, data);
  return res.data;
}

export async function updateCourse({
  data,
  id,
}: {
  data: CourseCreate;
  id: number;
}): Promise<CourseResponse> {
  const res = await axiosInstance.put<CourseResponse>(
    `${baseEndpoint}/${id}`,
    data
  );
  return res.data;
}

export async function deleteCourse(id: number): Promise<void> {
  await axiosInstance.delete(`${baseEndpoint}/${id}`);
}

// import { coursesHttp } from "./configuration.http";
// import { coursesMock } from "./configuration.mock";

// const IS_DEMO = import.meta.env.VITE_DEMO === "true";

// export const coursesService = IS_DEMO ? coursesMock : coursesHttp;

// export const { getCourses, createCourse, updateCourse } = coursesService;
