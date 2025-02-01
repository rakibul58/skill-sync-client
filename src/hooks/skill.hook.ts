"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";
import {
  createSkill,
  deleteSkill,
  getAllSkills,
  updateSkill,
} from "@/services/SkillServices";

// Hook for fetching skills
export const useSkillList = (options?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["skills", options],
    queryFn: () => getAllSkills(options),
  });
};

// Hook for creating a skill
export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSkill,
    onSuccess: (data) => {
      // Invalidate and refetch skills list
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("skill created successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create skill");
    },
  });
};

// Hook for updating a skill
export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FieldValues }) =>
      updateSkill(id, data),
    onSuccess: (data) => {
      // Invalidate specific skill and skills list
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skill", data.data.id] });
      toast.success("skill updated successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update skill");
    },
  });
};

// Hook for deleting a skill
export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteSkill(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("skill deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete skill");
    },
  });
};
