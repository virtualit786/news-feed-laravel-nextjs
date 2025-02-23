import _ from "lodash";
import { PreferencesUserModel } from "../types/PreferencesUserModel";
import { apiRequest } from "../../../shared/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useToUpdatePreferences = () => {
const router = useRouter();
  const updatePreferences = async (preferences: PreferencesUserModel) => {
    try {
      const token = localStorage?.getItem("token");
      if (!token) {
        toast.info("Your session has expired! Please log in again.");
        router?.push("/auth/login");
        return;
      }
      const data = JSON.stringify(preferences);
      await apiRequest({ method: "PUT", endpoint: "/api/preferences", data, headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
          if (response?.status === 200) {
            toast.success("Update Preferences successfully");
          } else {
            toast.error("Failed to update preferences");
          }
        })
        .catch(error => {
          console.log("Update Preferences Error:", error);
          toast.error("Failed to update preferences");
        });
    } catch (error) {
      toast.error("Failed to update preferences");
      console.log("Failed to update preferences: ", error);
    }
  };

  return {
    updatePreferences
  };
};