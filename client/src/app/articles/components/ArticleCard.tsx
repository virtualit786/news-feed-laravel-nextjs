import React, { FC } from 'react'
import { ArticleModel } from '../types';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import _ from 'lodash';
import { Button } from '../../../components/forms';
import { Divider } from 'primereact/divider';
import { Chip } from 'primereact/chip';
import { Avatar } from 'primereact/avatar';

interface ArticleCardProps {
  article: ArticleModel;
}

export const ArticleCard: FC<ArticleCardProps> = ({ article }) => {

  return (
    <div key={article?.id} className="p-col-12 md:p-col-6 lg:p-col-4 my-5">
      <Card className="shadow-2 border-round-lg p-3 hover:shadow-4 transition-all duration-300" title={article?.title} subTitle={`Published on: ${new Date(article?.published_at)?.toLocaleDateString()}`}>
        <div className="p-d-flex p-ai-center p-mb-2">
          {!_.isEmpty(article?.author?.name) && <Avatar label={article?.author?.name?.charAt(0)} size="large" shape="circle" className="mr-2" />}
          <span className="p-text-bold">{article?.author?.name}</span>
        </div>

        <Divider />

        <p className="line-clamp">{article?.description}</p>

        <div className="p-d-flex p-jc-between mt-2">
          {!_.isEmpty(article?.category?.name) && <Tag value={article?.category?.name} severity="info" className='mr-3' />}
          {!_.isEmpty(article?.source?.name) && <Chip label={article?.source?.name} className="p-mr-2 " />}
        </div>

        <Divider />

        <div className="p-d-flex p-jc-between p-ai-center">
          <Button icon="pi pi-eye" iconPos='left' label="Read More" className="p-button-outlined p-button-info" onClick={() => window?.open(article.url, "_blank")} />
        </div>
      </Card>
    </div>
  )
}