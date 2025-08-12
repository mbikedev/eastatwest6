-- Create comments table for blog posts
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  blog_post_id text not null,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  author_name text not null,
  author_email text not null,
  author_website text,
  content text not null,
  is_approved boolean default false,
  is_admin_reply boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for better query performance
create index comments_blog_post_id_idx on public.comments(blog_post_id);
create index comments_parent_comment_id_idx on public.comments(parent_comment_id);
create index comments_created_at_idx on public.comments(created_at);

-- Set up Row Level Security (RLS)
alter table public.comments enable row level security;

-- Policy: Anyone can read approved comments
create policy "Anyone can read approved comments" on public.comments
  for select using (is_approved = true);

-- Policy: Anyone can insert new comments (will be pending approval)
create policy "Anyone can insert comments" on public.comments
  for insert with check (true);

-- Policy: Only authenticated users can update comments (for admin replies)
create policy "Authenticated users can update comments" on public.comments
  for update using (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger comments_updated_at
  before update on public.comments
  for each row
  execute function public.handle_updated_at(); 