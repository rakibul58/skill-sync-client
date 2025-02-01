"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import VForm from "@/components/form/VForm";
import { Button } from "@/components/ui/button";
import VInput from "@/components/form/VInput";
import { AuthValidations } from "@/schemas/auth.validations";
import { useEffect, useState } from "react";

type Role = "LEARNER" | "ADMIN" | "TEACHER";
import { useRouter } from "next/navigation";
import { useUserLogin } from "@/hooks/auth.hook";
import { useUser } from "@/context/user.provider";
import Loading from "@/components/modules/Shared/LoadingBlur";
import Image from "next/image";
import loginImg from "../../../../public/login.svg";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { mutate: handleUserLogin, isPending, isSuccess } = useUserLogin();
  const router = useRouter();
  const { user, setIsLoading: userLoading } = useUser();
  const [formKey, setFormKey] = useState(0);
  const [defaultValues, setDefaultValues] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const onSubmit = (data: LoginForm) => {
    handleUserLogin(data);
    userLoading(true);
  };

  const setPresetValues = (values: LoginForm) => {
    setDefaultValues(values);
    setFormKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isPending && isSuccess && user?.role) {
      const routes = {
        LEARNER: "/learner/profile",
        ADMIN: "/admin/profile",
        TEACHER: "/teacher/profile",
      };

      const route = routes[user.role as Role];
      if (route) {
        router.replace(route); // Use replace instead of push
      }
    }
  }, [isPending, isSuccess, user, router]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8">
      {isPending && <Loading />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 flex items-center justify-center p-6 bg-secondary/30 rounded-2xl"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-primary">SkillSync</h1>
          <p className="text-xl mb-8 text-gray-600">
            Learn, Teach, Grow Together
          </p>
          <div className="relative aspect-video w-full max-w-xl mx-auto rounded-xl overflow-hidden shadow-xl">
            <Image
              src={loginImg}
              alt="Learning illustration"
              className="object-cover w-full h-full"
              height={100}
              width={100}
            />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-bold text-primary">500+</h3>
              <p className="text-sm text-gray-600">Expert Teachers</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-bold text-primary">1000+</h3>
              <p className="text-sm text-gray-600">Active Learners</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-bold text-primary">50+</h3>
              <p className="text-sm text-gray-600">Skills Available</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="bg-secondary/20 p-6 rounded-lg mb-8">
            <h1 className="text-lg font-bold mb-4">Demo Accounts</h1>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPresetValues({
                    email: "learner@skillsync.com",
                    password: "12345",
                  })
                }
              >
                Learner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPresetValues({
                    email: "admin@skillsync.com",
                    password: "12345",
                  })
                }
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPresetValues({
                    email: "teacher@skillsync.com",
                    password: "12345",
                  })
                }
              >
                Teacher
              </Button>
            </div>
          </div>

          <VForm
            key={formKey}
            resolver={zodResolver(AuthValidations.loginValidationSchema)}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <VInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <VInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />
            </motion.div>

            <Button
              className="w-full py-6 text-lg font-semibold"
              size="lg"
              type="submit"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </VForm>

          <div className="text-center pt-6 border-t">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Join SkillSync
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
