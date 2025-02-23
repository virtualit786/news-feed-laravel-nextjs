'use client';

import React, { useState } from 'react'
import { ArticlesFilterModel } from '../types';
import { ArticlesFilter } from './ArticlesFilter';
import { useFetchArticles, useFetchArticlesByFilters, useFetchPreferences } from '../hooks';
import './articles.scss';
import { useFetchFiltersOptions } from '../hooks/useFetchFiltersOptions';
import ArticleList from './ArticleList';
import { InfiniteScroll } from '../../../components/scroll';
import { ProgressSpinner } from 'primereact/progressspinner';

export const ArticlesContainer = () => {
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState<boolean>(false);
  const [apiActive, setApiActive] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const { userPreferences, userPreferencesResponse, handleUserPreferencesLocal, userPreferencesLocal } = useFetchPreferences();
  const { articles, handleArticlesState, fetchArticles } = useFetchArticles({ userPreferencesLocal, handleUserPreferencesLocal, userPreferencesResponse, isInfiniteScrollEnabled, setIsInfiniteScrollEnabled, apiActive, setApiActive, setLoading });
  const { fetchArticlesByFilters } = useFetchArticlesByFilters({ handleArticlesState, userPreferencesLocal, handleUserPreferencesLocal, isInfiniteScrollEnabled, setIsInfiniteScrollEnabled, apiActive, setApiActive, setLoading });
  const { authors, categories, sources } = useFetchFiltersOptions();

  const onChangeFilter = (filter: ArticlesFilterModel) => {
    fetchArticlesByFilters(filter);
  };

  return (
    <div className="articles-container custom-container">
      <h2>Articles</h2>
      <ArticlesFilter filter={userPreferences} authors={authors} categories={categories} sources={sources} onChangeFilter={onChangeFilter} fetchArticles={fetchArticles} />
      <div className="articles-list mt-5">
        <ArticleList articles={articles} />
      </div>
      {loading && <div className='w-full flex justify-content-center align-items-center mb-5 h-15rem'><ProgressSpinner /></div>}
      <InfiniteScroll isInView={isInfiniteScrollEnabled} isInViewPort={setIsInfiniteScrollEnabled} />
    </div>
  )
}