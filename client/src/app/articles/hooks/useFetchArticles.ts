import _ from 'lodash';
import { useEffect, useState } from 'react';
import { ArticleModel, ArticlesFilterModel } from '../types';
import { apiRequest } from '../../../shared/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
interface useFetchArticlesProps {
  userPreferencesLocal: ArticlesFilterModel;
  userPreferencesResponse: boolean;
  isInfiniteScrollEnabled: boolean;
  setIsInfiniteScrollEnabled: (isView: boolean) => void;
  handleUserPreferencesLocal: (preferences: ArticlesFilterModel) => void;
  apiActive: number;
  setApiActive: (api: number) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFetchArticles = ({ userPreferencesLocal, handleUserPreferencesLocal, userPreferencesResponse, isInfiniteScrollEnabled, setIsInfiniteScrollEnabled, apiActive, setApiActive, setLoading }: useFetchArticlesProps) => {
  const [articles, setArticles] = useState<ArticleModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();

  const handleArticlesState = (fetchedArticles: ArticleModel[], isScroll: boolean = false) => {
    setArticles((prev) => {
      let articles: ArticleModel[] = [];
      if (isScroll) {
        const uniqueArticles = _.uniqBy([...prev, ...fetchedArticles], "id");
        articles = [...uniqueArticles]
      } else {
        articles = [...fetchedArticles];
      }

      return articles;
    });
  };

  const fetchArticles = async (filter: ArticlesFilterModel, page: number = 1, isScroll: boolean = false) => {
    try {
      setApiActive(2);
      handleUserPreferencesLocal(filter);
      const token = localStorage?.getItem("token");
      if (!token) {
        toast.info("Your session has expired! Please log in again.");
        router?.push("/auth/login");
        return;
      }
      await apiRequest({ method: "GET", endpoint: "/api/articles", params: { ...filter, page }, headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
          if (response?.status === 200) {
            const { data, total, to } = response?.data;
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
    if (userPreferencesResponse && apiActive === 2) {
      fetchArticles(userPreferencesLocal, 1);
    }
  }, [userPreferencesLocal])

  useEffect(() => {
    if (isInfiniteScrollEnabled && hasMore && apiActive === 2) {
      setIsInfiniteScrollEnabled(false);
      setLoading(true);
      fetchArticles(userPreferencesLocal, currentPage + 1, true);
    }
  }, [isInfiniteScrollEnabled]);


  return {
    articles,
    handleArticlesState,
    fetchArticles,
  };
};