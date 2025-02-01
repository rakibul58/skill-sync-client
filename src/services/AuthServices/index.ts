/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/AxiosInstance";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";

export const loginUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    if (data.success) {
      const cookieStore = cookies();
      (await cookieStore).set("accessToken", data?.data?.accessToken);
      (await cookieStore).set("refreshToken", data?.data?.refreshToken);
    }

    // console.log({LoginData: data});

    return data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const registerLearner = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post(
      "/auth/register/learner",
      userData
    );

    if (data.success) {
      const cookieStore = cookies();
      (await cookieStore).set("accessToken", data?.data?.accessToken);
      (await cookieStore).set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const registerTeacher = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post(
      "/auth/register/teacher",
      userData
    );

    if (data.success) {
      const cookieStore = cookies();
      (await cookieStore).set("accessToken", data?.data?.accessToken);
      (await cookieStore).set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getNewAccessToken = async () => {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    const res = await axiosInstance({
      url: "/auth/refresh-token",
      method: "POST",
      withCredentials: true,
      headers: {
        cookie: `refreshToken=${refreshToken}`,
      },
    });

    return res.data;
  } catch (error: any) {
    throw new Error("Failed to get new access token", error);
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;

  let decodedToken = null;

  if (accessToken) {
    decodedToken = await jwtDecode(accessToken);

    const { data } = await axiosInstance.get("/users/me");

    return {
      email: decodedToken.email,
      role: decodedToken.role,
      userId: decodedToken.userId,
      user: data.data,
    };
  }

  return decodedToken;
};

export const changePassword = async (payload: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/change-password", payload);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateTeacher = async (payload: FieldValues) => {
  try {
    const { data } = await axiosInstance.put("/users/teacher/profile", payload);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateLearner = async (payload: FieldValues) => {
  try {
    const { data } = await axiosInstance.put("/users/learner/profile", payload);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};


export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};
