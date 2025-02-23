import _ from 'lodash';
import { ArticleModel, ArticlesFilterModel } from '../types';
import { apiRequest } from '../../../shared/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface useFetchArticlesByFiltersProps {
  handleArticlesState: (articles: ArticleModel[], isScroll: boolean) => void;
  userPreferencesLocal: ArticlesFilterModel;
  isInfiniteScrollEnabled: boolean;
  setIsInfiniteScrollEnabled: (isView: boolean) => void;
  handleUserPreferencesLocal: (preferences: ArticlesFilterModel) => void;
  apiActive: number;
  setApiActive: (api: number) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFetchArticlesByFilters = ({ userPreferencesLocal, handleUserPreferencesLocal, handleArticlesState, isInfiniteScrollEnabled, setIsInfiniteScrollEnabled, apiActive, setApiActive, setLoading }: useFetchArticlesByFiltersProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();

  const fetchArticlesByFilters = async (filterInput: ArticlesFilterModel, page: number = 1, isScroll: boolean = false) => {
    try {
      setApiActive(1);
      handleUserPreferencesLocal(filterInput);
      const token = localStorage?.getItem("token");
      if (!token) {
        toast.info("Your session has expired! Please log in again.");
        router?.push("/auth/login");
        return;
      }

      await apiRequest({ method: "GET", endpoint: "/api/articles/search", params: { ...filterInput, page }, headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
          if (response?.status === 200) {
            const { data, total, to } = response?.data?.articles;
            handleArticlesState(data, isScroll);

            if (total - to > 0) {
              setHasMore(true);
              setCurrentPage(page);
            } else {
              setHasMore(false);
            }

          } else {
            toast.error("Error fetching articles");
            setHasMore(false);
          }
        })
        .catch(error => {
          console.log("Error fetching articles:", error);
          toast.error("Error fetching articles");
          setHasMore(false);
        });
    } catch (error) {
      toast.error("Error fetching articles");
      console.log("Error fetching articles: ", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInfiniteScrollEnabled && hasMore && apiActive === 1) {
      setIsInfiniteScrollEnabled(false);
      setLoading(true);
      fetchArticlesByFilters(userPreferencesLocal, currentPage + 1, true);
    }
  }, [isInfiniteScrollEnabled]);

  return {
    fetchArticlesByFilters,
  };
};