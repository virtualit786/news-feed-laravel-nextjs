
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { AuthorModel, CategoryModel, SourceModel } from '../types';
import { apiRequest } from '../../../shared/utils';
import { toast } from 'sonner';
import { ValueLabelModel } from '../../../shared/types';
import { useRouter } from 'next/navigation';

export const useFetchFiltersOptions = () => {
  const [categories, setCategories] = useState<ValueLabelModel[]>([]);
  const [authors, setAuthors] = useState<ValueLabelModel[]>([]);
  const [sources, setSources] = useState<ValueLabelModel[]>([]);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const token = localStorage?.getItem("token");
      if (!token) {
        toast.info("Your session has expired! Please log in again.");
        router?.push("/auth/login");
        return;
      }
      await apiRequest({ method: "GET", endpoint: "/api/public/categories", headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
          if (response?.status === 200) {
            const transformedCategories = response?.data?.map((item: CategoryModel) => ({ label: item?.name, value: item?.id?.toString(), }))
            setCategories(transformedCategories);
          } else {
            console.error("Failed to fetch categories. Please try again.");
          }
        })
        .catch(error => {
          console.error("Error while fetching categories:", error);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const token = localStorage?.getItem("token");
      if (!token) {
        router?.push("/auth/login");
        return;
      }
      await apiRequest({ method: "GET", endpoint: "/api/public/authors", headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
          if (response?.status === 200) {
            const transformedAuthors = response?.data?.map((item: AuthorModel) => ({ label: item?.name, value: item?.id?.toString(), }))
            setAuthors(transformedAuthors);
          } else {
            console.error("Failed to fetch authors. Please try again.");
          }
        })
        .catch(error => {
          console.error("Error while fetching authors:", error);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const fetchSource = async () => {
    try {
      const token = localStorage?.getItem("token");
      if (!token) {
        router?.push("/auth/login");
        return;
      }
      await apiRequest({ method: "GET", endpoint: "/api/public/sources", headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
          if (response?.status === 200) {
            const transformedSources = response?.data?.map((item: SourceModel) => ({ label: item?.name, value: item?.id?.toString(), }))
            setSources(transformedSources);
          } else {
            toast.error("Failed to fetch sources. Please try again.");
          }
        })
        .catch(error => {
          console.error("Error while fetching sources:", error);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAuthors();
    fetchSource();
  }, []);

  return {
    categories,
    authors,
    sources
  };
};