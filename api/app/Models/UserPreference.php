<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = [
        'user_id',
        'source_ids',
        'category_ids',
        'author_ids',
    ];

    protected $casts = [
        'source_ids'   => 'array',
        'category_ids' => 'array',
        'author_ids'   => 'array',
    ];

    /**
     * A user preference belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}