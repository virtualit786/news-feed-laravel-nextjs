import { AuthorModel, CategoryModel,  SourceModel } from "./ArticlesFilterModel";

export interface ArticleModel {
  id: number;
  source: SourceModel;
  title: string;
  description: string;
  url: string;
  published_at: string;
  content: string;
  data_source: string;
  created_at: string;
  updated_at: string;
  source_id: number;
  category_id: number;
  author_id: number;
  category: CategoryModel;
  author: AuthorModel;
}