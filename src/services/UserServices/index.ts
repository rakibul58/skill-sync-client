/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import axiosInstance from "@/lib/AxiosInstance";

export const getAllUsers = async (options?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  try {
    const { data } = await axiosInstance.get("/users", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 5,
        searchTerm: options?.searchTerm,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
      },
    });
    // console.log(data);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const getAllTeachers = async (options?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minRating?: number;
  maxRating?: number;
  skill?: string;
  categoryId?: string;
}) => {
  try {
    const { data } = await axiosInstance.get("/users/teachers", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 5,
        searchTerm: options?.searchTerm,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
        minRating: options?.minRating,
        maxRating: options?.maxRating,
        skill: options?.skill,
        categoryId: options?.categoryId,
      },
    });
    // console.log(data);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch teachers"
    );
  }
};
