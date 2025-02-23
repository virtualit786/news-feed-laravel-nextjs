import _ from "lodash";
import { useRouter } from "next/navigation";
import { UserSignUpModel } from "../types";
import { apiRequest } from "../../../../shared/utils";
import { toast } from "sonner";

export const useSignUpUser = () => {
  const router = useRouter();
  

  const signUpUser = async (userCredential: UserSignUpModel) => {
    try {
      const data = JSON.stringify(userCredential);
      await apiRequest({ method: "POST", endpoint: "/api/public/register", data })
        .then(response => {
          if (response?.status === 200) {
            toast.success("User created successfully");
            router.push("/auth/login");
          } else {
            toast.error("Invalid credentials");
          }
        })
        .catch(error => {
          toast.error("Failed to create user");
          console?.log("Sign up Error:", error);
        });
    } catch (error) {
      console.log("Failed to create user: ", JSON.stringify(error));
      toast.error("Failed to create user");
    }
  };

  return {
    signUpUser,
  };
};