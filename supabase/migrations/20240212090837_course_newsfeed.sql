create table "public"."course_newsfeed" (
    "created_at" timestamp with time zone not null default now(),
    "author_id" uuid,
    "content" text,
    "id" uuid not null default gen_random_uuid(),
    "course_id" uuid,
    "reaction" jsonb,
    "is_pinned" boolean not null default false
);


create table "public"."course_newsfeed_comment" (
    "created_at" timestamp with time zone not null default now(),
    "author_id" uuid,
    "content" text,
    "id" bigint generated by default as identity not null,
    "course_newsfeed_id" uuid
);


CREATE UNIQUE INDEX course_newsfeed_comment_id_key ON public.course_newsfeed_comment USING btree (id);

CREATE UNIQUE INDEX course_newsfeed_comment_pkey ON public.course_newsfeed_comment USING btree (id);

CREATE UNIQUE INDEX course_newsfeed_pkey ON public.course_newsfeed USING btree (id);

alter table "public"."course_newsfeed" add constraint "course_newsfeed_pkey" PRIMARY KEY using index "course_newsfeed_pkey";

alter table "public"."course_newsfeed_comment" add constraint "course_newsfeed_comment_pkey" PRIMARY KEY using index 
"course_newsfeed_comment_pkey";

alter table "public"."course_newsfeed" add constraint "course_newsfeed_author_id_fkey" FOREIGN KEY (author_id) REFERENCES groupmember(id) not valid;

alter table "public"."course_newsfeed" validate constraint "course_newsfeed_author_id_fkey";

alter table "public"."course_newsfeed" add constraint "course_newsfeed_course_id_fkey" FOREIGN KEY (course_id) REFERENCES course(id) not valid;

alter table "public"."course_newsfeed" validate constraint "course_newsfeed_course_id_fkey";

alter table "public"."course_newsfeed_comment" add constraint "course_newsfeed_comment_id_key" UNIQUE using index "course_newsfeed_comment_id_key";

alter table "public"."course_newsfeed_comment" add constraint "course_newsfeed_comment_author_id_fkey" FOREIGN KEY (author_id) REFERENCES groupmember(id) not valid;

alter table "public"."course_newsfeed_comment" validate constraint "course_newsfeed_comment_author_id_fkey";

alter table "public"."course_newsfeed_comment" add constraint "course_newsfeed_comment_course_newsfeed_id_fkey" FOREIGN KEY (course_newsfeed_id) REFERENCES course_newsfeed(id) not valid;

alter table "public"."course_newsfeed_comment" validate constraint "course_newsfeed_comment_course_newsfeed_id_fkey";