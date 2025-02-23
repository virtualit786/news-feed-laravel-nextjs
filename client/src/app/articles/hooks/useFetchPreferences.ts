import _ from 'lodash';
import { apiRequest } from '../../../shared/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArticlesFilterModel } from '../types';

export const useFetchPreferences = () => {
  const [userPreferences, setUserPreferences] = useState<ArticlesFilterModel>({} as ArticlesFilterModel);
  const [userPreferencesLocal, setUserPreferencesLocal] = useState<ArticlesFilterModel>({} as ArticlesFilterModel);
  const [userPreferencesResponse, setUserPreferencesResponse] = useState<boolean>(false);
  const router = useRouter();

  const handleUserPreferencesLocal = (preferences: ArticlesFilterModel) => {
    setUserPreferencesLocal(preferences)
  }

  const handleFilter = (filterInput: ArticlesFilterModel) => {
    setUserPreferences(filterInput);
    setUserPreferencesLocal(filterInput);
    setUserPreferencesResponse(true);
  }

  const fetchPreferences = async () => {
    try {
      const token = localStorage?.getItem("token");
      if (!token) {
        toast.info("Your session has expired! Please log in again.");
        router?.push("/auth/login");
        return;
      }
      await apiRequest({ method: "GET", endpoint: "/api/preferences", headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
          if (response?.status === 200) {
            const transformedArticles = { author: response?.data?.author_ids, category: response?.data?.category_ids, source: response?.data?.source_ids };
            handleFilter(transformedArticles);
          } else {
            toast.error("Failed to fetch preferences.");
            setUserPreferencesResponse(false);
          }
        })
        .catch(error => {
          console.log("Error fetching preferences:", error);
          toast.error("Error fetching preferences.");
          setUserPreferencesResponse(false);
        });
    } catch (error) {
      toast.error("Error fetching preferences.");
      console.log("Error fetching preferences: ", error);
      setUserPreferencesResponse(false);
    }
  };

  useEffect(() => {
    if (!userPreferencesResponse) {
      setUserPreferencesResponse(false);
      fetchPreferences();
    }
  }, [])

  return {
    userPreferences,
    handleFilter,
    userPreferencesResponse,
    userPreferencesLocal,
    handleUserPreferencesLocal
  };
};