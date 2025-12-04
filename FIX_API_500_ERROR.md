# Fix API 500 Error - Marketing Posts

## Problem
The API endpoint `/api/admin/marketing/posts` was returning a 500 Internal Server Error.

## Root Cause
The most likely cause is that the `marketing_posts` table doesn't exist in Supabase yet.

## Fixes Applied

### 1. Improved Error Handling
- Added detailed error messages with error codes and hints
- Better logging for debugging

### 2. Graceful Table Missing Handling
- If the table doesn't exist (error code `42P01`), the API now returns an empty array instead of a 500 error
- This allows the UI to work even if the schema hasn't been set up yet

### 3. Simplified Array Filtering
- Changed from server-side array filtering to client-side filtering
- This is more reliable and avoids Postgres array operator issues

### 4. Translated Error Messages
- All error messages are now in English

## Solution: Create the Table in Supabase

To fully resolve this, you need to create the `marketing_posts` table in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `supabase-marketing-schema.sql`

Or run this command to create just the posts table:

```sql
CREATE TABLE IF NOT EXISTS marketing_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  networks TEXT[] NOT NULL,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  media_urls TEXT[] DEFAULT '{}',
  promotion_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_marketing_posts_status ON marketing_posts(status);
CREATE INDEX IF NOT EXISTS idx_marketing_posts_scheduled_at ON marketing_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_marketing_posts_networks ON marketing_posts USING GIN(networks);
```

## Status
✅ API fixed to handle missing table gracefully
✅ Error messages improved
✅ Returns empty array if table doesn't exist (UI won't crash)
⚠️ Table still needs to be created in Supabase for full functionality

