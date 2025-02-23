import React from "react";
import { ArticleCard } from "./ArticleCard";
import { ArticleModel } from "../types";
import _ from "lodash";

interface ArticleListProps {
    articles: ArticleModel[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
    return (
        <div className="p-grid">
            {_.size(articles) > 0 ? articles?.map((article) => (
                <ArticleCard key={article?.id} article={article} />
            )) : <div className="text-color-secondary">No Result found!</div>}
        </div>
    );
};

export default ArticleList;