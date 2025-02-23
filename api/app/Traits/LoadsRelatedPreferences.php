<?php

namespace App\Traits;

use App\Models\Source;
use App\Models\Category;
use App\Models\Author;

trait LoadsRelatedPreferences
{
    protected function loadRelations($preference)
    {
        $preference->sources = Source::whereIn('id', $preference->source_ids ?? [])->get();
        $preference->categories = Category::whereIn('id', $preference->category_ids ?? [])->get();
        $preference->authors = Author::whereIn('id', $preference->author_ids ?? [])->get();

        return $preference;
    }
}
