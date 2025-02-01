/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/AxiosInstance";
import { FieldValues } from "react-hook-form";

export const createSkill = async (skillData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/skills", skillData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create skill");
  }
};

export const getAllSkills = async (options?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  categoryId?: string;
}) => {
  try {
    const { data } = await axiosInstance.get("/skills", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 5,
        searchTerm: options?.searchTerm,
        sortBy: options?.sortBy,
        categoryId: options?.categoryId || null,
        sortOrder: options?.sortOrder,
      },
    });
    // console.log(data);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch skills");
  }
};

export const updateSkill = async (id: string, skillData: FieldValues) => {
  try {
    const { data } = await axiosInstance.put(`/skills/${id}`, skillData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update skills");
  }
};

export const deleteSkill = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/skills/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete skill");
  }
};
