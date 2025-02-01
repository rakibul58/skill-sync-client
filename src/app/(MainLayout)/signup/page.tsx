"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FieldValues, SubmitHandler } from "react-hook-form";
import VForm from "@/components/form/VForm";
import { Button } from "@/components/ui/button";
import VInput from "@/components/form/VInput";
import VTextArea from "@/components/form/VTextArea";
import { School, GraduationCap } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { useUser } from "@/context/user.provider";
import { AuthValidations } from "@/schemas/auth.validations";
import { useLearnerRegistration, useTeacherRegistration } from "@/hooks/auth.hook";

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState<"teacher" | "learner" | null>(null);
  const router = useRouter();
  const {
    mutate: handleTeacherRegistration,
    isPending: teacherIsPending,
    isSuccess: teacherIsSuccess,
  } = useTeacherRegistration();
  const {
    mutate: handleLearnerRegistration,
    isPending: learnerIsPending,
    isSuccess: learnerIsSuccess,
  } = useLearnerRegistration();
  const { setIsLoading: userLoading } = useUser();

  const handleCreateTeacher: SubmitHandler<FieldValues> = (data) => {
    console.log("Clicked");
    const registrationData = {
      password: data.password,
      teacher: {
        email: data.email,
        name: data.name,
        bio: data.bio,
        expertise: data.expertise,
      },
    };
    handleTeacherRegistration(registrationData);
    userLoading(true);
  };

  const handleCreateLearner: SubmitHandler<FieldValues> = (data) => {
    console.log("Clicked");
    const registrationData = {
      password: data.password,
      learner: {
        email: data.email,
        name: data.name,
        bio: data.bio,
        interests: data.interests,
      },
    };
    handleLearnerRegistration(registrationData);
    userLoading(true);
  };

  useEffect(() => {
    if (!teacherIsPending && teacherIsSuccess) {
      router.push("/teacher/profile");
    }
  }, [teacherIsPending, teacherIsSuccess, router]);

  useEffect(() => {
    if (!learnerIsPending && learnerIsSuccess) {
      router.push("/learner/profile");
    }
  }, [learnerIsPending, learnerIsSuccess, router]);

  const renderForm = () => {
    if (!selectedRole) return null;

    if (selectedRole === "learner") {
      return (
        <VForm
          resolver={zodResolver(AuthValidations.createLearnerValidationSchema)}
          onSubmit={handleCreateLearner}
        >
          <div className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <VInput
                label="Full Name"
                name="name"
                type="text"
                placeholder="Enter your full name"
              />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <VInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <VInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
              />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <VTextArea
                label="Bio"
                name="bio"
                placeholder="Tell us about yourself"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                className="w-full py-6 text-lg font-semibold"
                size="lg"
                type="submit"
              >
                Create Learner Account
              </Button>
            </motion.div>
          </div>
        </VForm>
      );
    }

    return (
      <VForm
        resolver={zodResolver(AuthValidations.createTeacherValidationSchema)}
        onSubmit={handleCreateTeacher}
      >
        <div className="space-y-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <VInput
              label="Full Name"
              name="name"
              type="text"
              placeholder="Enter your full name"
            />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <VInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <VInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
            />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <VTextArea
              label="Bio"
              name="bio"
              placeholder="Tell us about your teaching experience"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <VInput
              label="Expertise"
              name="expertise"
              type="text"
              placeholder="Your main area of expertise"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              className="w-full py-6 text-lg font-semibold"
              size="lg"
              type="submit"
            >
              Create Teacher Account
            </Button>
          </motion.div>
        </div>
      </VForm>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 my-10">
      {(teacherIsPending || learnerIsPending) && <Loading />}

      {/* Left side - Branding/Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 flex items-center justify-center p-6 bg-accent/5 rounded-2xl"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-accent">
            Join SkillSync Community
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Connect, Learn, and Share Knowledge
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-accent">500+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Expert Teachers
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-accent">50+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Skills
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-accent">1000+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Learners
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right side - Registration Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Create Account
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Choose Your Role
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <button
              type="button"
              onClick={() => setSelectedRole("learner")}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-md 
                transition-all duration-300
                ${
                  selectedRole === "learner"
                    ? "bg-accent hover:bg-accent/60 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-400"
                }
              `}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Learner</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("teacher")}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-md 
                transition-all duration-300
                ${
                  selectedRole === "teacher"
                    ? "bg-accent hover:bg-accent/60 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-400"
                }
              `}
            >
              <School className="w-5 h-5" />
              <span>Teacher</span>
            </button>
          </div>

          {renderForm()}

          <div className="text-center pt-6 border-t">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent hover:text-accent/80 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}