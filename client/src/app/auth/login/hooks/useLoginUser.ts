'use client';

import { useRouter } from "next/navigation";
import { UserLoginModel } from "../types/UserLoginModel";
import { toast } from "sonner";
import { useAuth } from "@components/context/AuthContext";
import { apiRequest } from "../../../../shared/utils";

export const useLoginUser = () => {
  const router = useRouter();
  const { login } = useAuth();

  const loginUser = async (userCredential: UserLoginModel) => {
    try {
      const data = JSON.stringify(userCredential);
      await apiRequest({ method: "POST", endpoint: "/api/public/login", data })
        .then(response => {          
          if (response?.status === 200) {
            toast.success("User login successfully");
            login(response?.data?.access_token);
            router.push("/articles");
          } else {
            toast.error("Invalid credentials");
          }
        })
        .catch(error => {
          console.log("Login Error:", error);
          toast.error("Failed to login user");
        });
    } catch (error) {
      toast.error("Failed to login user");
      console.log("Failed to login user: ", error);
    }
  };

  return {
    loginUser
  };
};