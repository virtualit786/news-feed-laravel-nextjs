<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPreference;
use App\Traits\LoadsRelatedPreferences;

class UserPreferenceController extends Controller
{
    use LoadsRelatedPreferences;

    // GET /api/preferences
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (!$user->preference) {
            $user->preference()->create([
                'source_ids'   => [],
                'category_ids' => [],
                'author_ids'   => [],
            ]);
        }

        $preference = $this->loadRelations($user->preference);

        return response()->json($preference);
    }

    // POST /api/preferences
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = $request->validate([
            'source_ids'   => 'required|array',
            'category_ids' => 'required|array',
            'author_ids'   => 'required|array',
        ]);

        $preference = UserPreference::updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        $preference = $this->loadRelations($preference);

        return response()->json($preference, 201);
    }

    // PUT /api/preferences
    public function update(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = $request->validate([
            'source_ids'   => 'sometimes|array',
            'category_ids' => 'sometimes|array',
            'author_ids'   => 'sometimes|array',
        ]);

        $preference = $user->preference;
        if (!$preference) {
            return response()->json(['message' => 'Preferences not found.'], 404);
        }

        $preference->update($data);
        $preference = $this->loadRelations($preference);

        return response()->json($preference);
    }

    // DELETE /api/preferences
    public function destroy(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->preference) {
            $user->preference->delete();
        }

        return response()->json(['message' => 'Preferences deleted.']);
    }
}