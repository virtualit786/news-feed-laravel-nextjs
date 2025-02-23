<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'source',
        'title',
        'description',
        'url',
        'published_at',
        'content',
        'category',
        'data_source',
        'source_id',
        'category_id',
        'author_id',
    ];

    protected $dates = ['published_at'];

    public function source()
    {
        return $this->belongsTo(Source::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function author()
    {
        return $this->belongsTo(Author::class);
    }
}
