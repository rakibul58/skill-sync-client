/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldValues } from "react-hook-form";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  changePassword,
  loginUser,
  registerLearner,
  registerTeacher,
  updateLearner,
  updateTeacher,
} from "@/services/AuthServices";
import { toast } from "sonner";

export const useUserLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_LOGIN"],
    mutationFn: async (userData) => await loginUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("User login successful.");
    },
    onError: (error) => {
      toast.error("Login Failed. Please Provide Valid Email and Password.");
    },
  });
};

export const useLearnerRegistration = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["Learner_REGISTRATION"],
    mutationFn: async (userData) => await registerLearner(userData),
    onSuccess: () => {
      toast.success("User Registration successful.");
    },
    onError: (error) => {
      toast.error("Registration Failed. Please Provide Valid Information.");
    },
  });
};

export const useTeacherRegistration = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["Teacher_REGISTRATION"],
    mutationFn: async (userData) => await registerTeacher(userData),
    onSuccess: () => {
      toast.success("User Registration successful.");
    },
    onError: (error) => {
      toast.error("Registration Failed. Please Provide Valid Information.");
    },
  });
};


export const useUserChangePassword = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_CHANGE_PASSWORD"],
    mutationFn: async (payload) => await changePassword(payload),
    onSuccess: () => {
      toast.success("Password changed successfully.");
    },
    onError: (error) => {
      toast.error("Provide correct password.");
    },
  });
};

export const useUpdateTeacher = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["UPDATE_TEACHER"],
    mutationFn: async (payload) => await updateTeacher(payload),
    onSuccess: () => {
      toast.success("Teacher Updated successfully.");
    },
    onError: (error) => {
      toast.error("Failed to Update Teacher.");
    },
  });
};


export const useUpdateLearner = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["UPDATE_LEARNER"],
    mutationFn: async (payload) => await updateLearner(payload),
    onSuccess: () => {
      toast.success("Learner Updated successfully.");
    },
    onError: (error) => {
      toast.error("Failed to Update Learner.");
    },
  });
};
