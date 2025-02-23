import { PreferencesUserModel } from "@components/preferences/types";

export interface ArticlesFilterModel {
    q?: string;
    source: string[];
    category: string[];
    author: string[];
}

export interface SourceModel {
    id: number;
    name: string;
    slug: string;
    created_at: string | null;
    updated_at: string | null;
}
export interface CategoryModel {
    id: number;
    name: string;
    slug: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface AuthorModel {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
}