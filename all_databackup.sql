--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE friday;
ALTER ROLE friday WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:Oi3Yud2kwrSdKD21aGXQKg==$XuolkDwcJp3RiNS8kyKm30aSR8pYxRHj9Lay14Q/2uc=:i0FUFGuHY0imUcPQbhHyh1s9hm+F/85ciwIzyTV7O8c=';
CREATE ROLE jarvis;
ALTER ROLE jarvis WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:+INA9LhcXbuiEyyMD8e3Jw==$SKTuFhDQD/rBhihjkHIcmjnUiaXuWONAaoSBn4HN5No=:7HpQWtQMGZ165DlFdo4IBoxBqYT2rjcoIM9WtXQXgpI=';
CREATE ROLE pheonix;
ALTER ROLE pheonix WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:i+gxk0OvWIXoEOe2bHvfgw==$NjvUPGa6blTuf8UeNSlFfcgLoFzbsUiykhVPI75BRkY=:rCEUuG+CtZQae5l+fbA14RW9OalaBGLRtxwEa+5tG/8=';
CREATE ROLE quicksilver;
ALTER ROLE quicksilver WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:TgWTbsxmZuM+UfLZU5ZWmA==$H/p8iby+sYc4zeYv7mkVDMTWJCx65le8slrvPPsigR0=:5++fJINrDKE1SxbPe8QFgB5fPcx04n4D01t88emhIqA=';
CREATE ROLE tapan;
ALTER ROLE tapan WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:O1zn+ENKOnxJydRS5AkUng==$PKiJPF4UuA81c56EhzmnAIOFZJmTd+8vYqhooT2eoq4=:VoBAGV9jsg+SusujCnp3LT9S3cWOX8Dn2TAz2Ccjkx4=';
CREATE ROLE vision;
ALTER ROLE vision WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:zAa+ysZKV++34qXw4BhUig==$mIPc/ALl4NCxBDyEb/WFArEQ386AvAA0T4Yaj+fZGfk=:PQuX/Z5xI7DGgMDxd2JeXe3GVWRKl4Gks0r0o3/whm8=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "friday_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: friday_db; Type: DATABASE; Schema: -; Owner: tapan
--

CREATE DATABASE friday_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE friday_db OWNER TO tapan;

\connect friday_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO tapan;

--
-- Name: course_progresses; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.course_progresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    progress_percent integer DEFAULT 0 NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.course_progresses OWNER TO tapan;

--
-- Name: user_enrollments; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.user_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_enrollments OWNER TO tapan;

--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250707070808-enrollment_table.js
20250707071326-course_progress.js
\.


--
-- Data for Name: course_progresses; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.course_progresses (id, user_id, course_id, progress_percent, is_completed, "createdAt", "updatedAt") FROM stdin;
78a6ceb3-7bb6-4f5c-b9c0-0a19015ac128	cdd97fa7-4d8a-4f6d-8fa7-c3c4f132a217	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	20	f	2025-08-24 16:10:32.659505+00	2025-08-24 16:11:30.8361+00
\.


--
-- Data for Name: user_enrollments; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.user_enrollments (id, user_id, course_id, "createdAt", "updatedAt") FROM stdin;
57d3926e-8129-4f9c-a694-a45f41556a85	57d3926e-8129-4f9c-a694-a45f41556a85	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	2025-08-24 16:10:32.648196+00	2025-08-24 16:10:32.648196+00
\.


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: course_progresses course_progresses_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.course_progresses
    ADD CONSTRAINT course_progresses_pkey PRIMARY KEY (id);


--
-- Name: user_enrollments user_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.user_enrollments
    ADD CONSTRAINT user_enrollments_pkey PRIMARY KEY (id);


--
-- Name: DATABASE friday_db; Type: ACL; Schema: -; Owner: tapan
--

GRANT ALL ON DATABASE friday_db TO friday;


--
-- PostgreSQL database dump complete
--

--
-- Database "jarvis_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: jarvis_db; Type: DATABASE; Schema: -; Owner: tapan
--

CREATE DATABASE jarvis_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE jarvis_db OWNER TO tapan;

\connect jarvis_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: enum_users_user_role; Type: TYPE; Schema: public; Owner: tapan
--

CREATE TYPE public.enum_users_user_role AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public.enum_users_user_role OWNER TO tapan;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO tapan;

--
-- Name: user_refresh_tokens; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.user_refresh_tokens (
    user_id uuid NOT NULL,
    refresh_token character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_refresh_tokens OWNER TO tapan;

--
-- Name: users; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    display_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    user_role public.enum_users_user_role DEFAULT 'USER'::public.enum_users_user_role NOT NULL,
    speakeasy_key character varying(255) NOT NULL,
    is_mfa_enabled boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO tapan;

--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250630115404-create-users.js
20250630133427-update-user.js
20250630135213-update-id.js
20250701094836-refresh_token.js
20250701102648-update_refressh_token.js
20250701110907-update_refresh_token_user_id_primary_key.js
20250702085810-add_role_in_user_table.js
20250815142946-delete_constraint.js
20250815170841-add_with_constraint_cascading.js
20250906194959-new_speakeasy_key.js
20250906200907-mfa_enabled_key.js
\.


--
-- Data for Name: user_refresh_tokens; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.user_refresh_tokens (user_id, refresh_token, "createdAt", "updatedAt") FROM stdin;
53b0bdc6-42cc-45c5-bbe3-5f54f8e0f3a0	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYW1wYWtnYWRhMTYzQGdtYWlsLmNvbSIsImlhdCI6MTc1Nzg1NjI0NywiZXhwIjoxNzU3OTQyNjQ3fQ.tk_tqHs1NeWti8mYI5iijQYqkTuzeGkwB3qmaplPPlw	2025-09-14 12:51:33.985+00	2025-09-14 13:24:07.618+00
57d3926e-8129-4f9c-a694-a45f41556a85	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhcGFucmFkYWRpeWEzMUBnbWFpbC5jb20iLCJpYXQiOjE3NTgzMDk2OTcsImV4cCI6MTc1ODM5NjA5N30.lqJWt6P3cxSmINhALZWjmzmg-40NAZy-ArGi6MX-KXI	2025-09-10 19:36:54.629+00	2025-09-19 19:21:37.912+00
962407d1-8a85-4aab-ac5b-ad4422e15f3b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhZGFkaXlhdGFwYW45MEBnbWFpbC5jb20iLCJpYXQiOjE3NTgzNzc4OTQsImV4cCI6MTc1ODQ2NDI5NH0.EJtr1xv6cXgg2lPuRxaVykSKYyYIHPLhX9jrxUmsTsI	2025-09-12 19:29:20.513+00	2025-09-20 14:18:15.002+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.users (id, display_name, email, password, "createdAt", "updatedAt", user_role, speakeasy_key, is_mfa_enabled) FROM stdin;
57d3926e-8129-4f9c-a694-a45f41556a85	Taps	tapanradadiya31@gmail.com	99dfdd2ae879d4db6b117c2dcf89fe79943bedea0d2b977a6d26b11f05eec9a13c627229a9acf667a321b43c1b37c4d71ad7f457e44a972db6491c8c43ad70db	2025-09-06 21:06:06.015+00	2025-09-06 21:06:50.753+00	ADMIN	NMTCC4DZKE2TU43UPVXUKWZ2KRGUY6ZP	t
962407d1-8a85-4aab-ac5b-ad4422e15f3b	Taps	radadiyatapan90@gmail.com	99dfdd2ae879d4db6b117c2dcf89fe79943bedea0d2b977a6d26b11f05eec9a13c627229a9acf667a321b43c1b37c4d71ad7f457e44a972db6491c8c43ad70db	2025-09-12 19:28:21.377+00	2025-09-12 19:29:09.081+00	ADMIN	MEVFESLYOVIS6RDQNFLSKJKCFISEWUJE	t
53b0bdc6-42cc-45c5-bbe3-5f54f8e0f3a0	Champak	champakgada163@gmail.com	627d14d3b7377a54eacac5ef09b603861f1634721a584bf1ea489d7de317115a3d9ddb9e20839066289198ef6ebae7746ed7bbb06594033c8f776e004d487b95	2025-09-14 12:34:25.782+00	2025-09-14 12:50:23.522+00	USER	IYSHEVCDNBLGENBQFR2GQ3KLHY5DKN2U	t
\.


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: user_refresh_tokens user_refresh_token_PK_user_id; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT "user_refresh_token_PK_user_id" PRIMARY KEY (user_id);


--
-- Name: user_refresh_tokens user_refresh_tokens_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT user_refresh_tokens_user_id_unique UNIQUE (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_refresh_tokens user_refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT user_refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_refresh_tokens user_refresh_tokens_user_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT user_refresh_tokens_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_refresh_tokens user_refresh_tokens_user_id_foreign_key; Type: FK CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT user_refresh_tokens_user_id_foreign_key FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DATABASE jarvis_db; Type: ACL; Schema: -; Owner: tapan
--

GRANT ALL ON DATABASE jarvis_db TO jarvis;


--
-- PostgreSQL database dump complete
--

--
-- Database "pheonix_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pheonix_db; Type: DATABASE; Schema: -; Owner: tapan
--

CREATE DATABASE pheonix_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE pheonix_db OWNER TO tapan;

\connect pheonix_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: user_xp_events; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.user_xp_events (
    id text NOT NULL,
    xp_event text NOT NULL,
    xp_points bigint,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.user_xp_events OWNER TO tapan;

--
-- Name: user_xps; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.user_xps (
    id text NOT NULL,
    xp_points bigint,
    userid text,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.user_xps OWNER TO tapan;

--
-- Data for Name: user_xp_events; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.user_xp_events (id, xp_event, xp_points, createdat, updated_at) FROM stdin;
a109e26c-393a-4901-ac0a-635357f9cd38	NEW_REGISTER	100	2025-08-23 11:00:05.902055+00	2025-08-23 11:00:05.902055+00
83ce5819-38c0-47ce-be0a-4d16909648eb	COURSE_COMPLETE	300	2025-08-23 11:00:23.139186+00	2025-08-23 11:00:23.139186+00
d0e7c230-349b-486b-bf9b-cafc195a9195	QUIZ_PASSED	300	2025-08-23 12:34:01.43172+00	2025-08-23 12:34:01.43172+00
1a5ea255-4f31-497b-b65a-fe915bab18a9	FIRST_ENROLL	300	2025-08-23 12:38:23.539359+00	2025-08-23 12:38:23.539359+00
\.


--
-- Data for Name: user_xps; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.user_xps (id, xp_points, userid, createdat, updated_at) FROM stdin;
205cffbf-1bde-4d92-b55e-2c83e3ce5968	400	cdd97fa7-4d8a-4f6d-8fa7-c3c4f132a217	2025-08-23 12:44:55.753724+00	2025-08-24 16:10:32.339163+00
2fc05697-7274-4744-9027-df9c66c5e5d1	100	4974664c-5b68-4965-b7a2-29be92835588	2025-09-06 20:11:25.806154+00	2025-09-06 20:11:25.816192+00
da2d957e-1040-4fcc-b4f7-bf3d2f196c19	100	d53beb7b-06ad-418f-8d3c-f2f7e95fcd57	2025-09-06 20:22:33.387463+00	2025-09-06 20:22:33.391391+00
48937040-3834-446c-b189-b4a6e5a665fe	500	962407d1-8a85-4aab-ac5b-ad4422e15f3b	\N	2025-09-14 12:02:16.336697+00
c714c2e8-f2dd-4446-b505-534ec7d257a3	100	53b0bdc6-42cc-45c5-bbe3-5f54f8e0f3a0	2025-09-14 12:34:25.884561+00	2025-09-14 12:34:25.887393+00
4130fd28-e679-4ada-9012-be20ca1db34b	700	00000000-0000-0000-0000-000000000000	2025-09-14 12:13:19.815228+00	2025-09-14 13:29:24.651829+00
\.


--
-- Name: user_xp_events uni_user_xp_events_xp_event; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.user_xp_events
    ADD CONSTRAINT uni_user_xp_events_xp_event UNIQUE (xp_event);


--
-- Name: user_xp_events user_xp_events_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.user_xp_events
    ADD CONSTRAINT user_xp_events_pkey PRIMARY KEY (id);


--
-- Name: user_xps user_xps_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.user_xps
    ADD CONSTRAINT user_xps_pkey PRIMARY KEY (id);


--
-- Name: DATABASE pheonix_db; Type: ACL; Schema: -; Owner: tapan
--

GRANT ALL ON DATABASE pheonix_db TO pheonix;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "quick_silver_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: quick_silver_db; Type: DATABASE; Schema: -; Owner: tapan
--

CREATE DATABASE quick_silver_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE quick_silver_db OWNER TO tapan;

\connect quick_silver_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: mcq_options; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.mcq_options (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    option_text text,
    mcq_id uuid,
    is_correct boolean,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.mcq_options OWNER TO tapan;

--
-- Name: mcqs; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.mcqs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    course_id uuid,
    question text,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.mcqs OWNER TO tapan;

--
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.quiz_attempts (
    id uuid NOT NULL,
    userid uuid,
    quizid uuid,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.quiz_attempts OWNER TO tapan;

--
-- Name: quiz_scores; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.quiz_scores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    is_passed boolean,
    score bigint,
    quiz_attempt_id uuid,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.quiz_scores OWNER TO tapan;

--
-- Name: quizes; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.quizes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title text,
    description text,
    course_id uuid,
    totalquestions bigint,
    passingmarks bigint,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.quizes OWNER TO tapan;

--
-- Data for Name: mcq_options; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.mcq_options (id, option_text, mcq_id, is_correct, createdat, updated_at) FROM stdin;
cc24e9ec-dfb2-45cd-8903-5ac348aa309a	Method overloading occurs when two methods have the same name but different parameter lists in the same class.	d0202947-ce67-448f-8ac9-a9ae3c307141	f	2025-09-14 08:40:31.308962+00	2025-09-14 08:40:31.308962+00
23940e42-cea7-47f2-9c23-03d327eed687	Method overriding requires methods to have different return types.	d0202947-ce67-448f-8ac9-a9ae3c307141	f	2025-09-14 08:40:31.308962+00	2025-09-14 08:40:31.308962+00
00802146-a4e5-4593-9409-d167ce9cdfac	Overloaded methods must be in different classes.	d0202947-ce67-448f-8ac9-a9ae3c307141	f	2025-09-14 08:40:31.308962+00	2025-09-14 08:40:31.308962+00
36e88fa2-0672-47a1-96d9-f5f0723ed699	Overridden methods cannot call the superclass version of the method.	d0202947-ce67-448f-8ac9-a9ae3c307141	f	2025-09-14 08:40:31.308962+00	2025-09-14 08:40:31.308962+00
\.


--
-- Data for Name: mcqs; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.mcqs (id, course_id, question, createdat, updated_at) FROM stdin;
d0202947-ce67-448f-8ac9-a9ae3c307141	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	Which statement about method overloading and overriding is true?	2025-09-14 08:40:31.305196+00	2025-09-14 08:40:31.305196+00
\.


--
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.quiz_attempts (id, userid, quizid, createdat, updated_at) FROM stdin;
\.


--
-- Data for Name: quiz_scores; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.quiz_scores (id, is_passed, score, quiz_attempt_id, createdat, updated_at) FROM stdin;
\.


--
-- Data for Name: quizes; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.quizes (id, title, description, course_id, totalquestions, passingmarks, createdat, updated_at) FROM stdin;
0cc63234-0010-4c23-81b9-c37d77fd444b	Java Quiz	Java Quiz Java QuizJava QuizJava QuizJava QuizJava QuizJava QuizJava Quiz	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	1	20	2025-09-14 08:40:33.146092+00	2025-09-14 08:40:33.146092+00
\.


--
-- Name: mcq_options mcq_options_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.mcq_options
    ADD CONSTRAINT mcq_options_pkey PRIMARY KEY (id);


--
-- Name: mcqs mcqs_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.mcqs
    ADD CONSTRAINT mcqs_pkey PRIMARY KEY (id);


--
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- Name: quiz_scores quiz_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.quiz_scores
    ADD CONSTRAINT quiz_scores_pkey PRIMARY KEY (id);


--
-- Name: quizes quizes_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.quizes
    ADD CONSTRAINT quizes_pkey PRIMARY KEY (id);


--
-- Name: mcq_options fk_mcqs_options; Type: FK CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.mcq_options
    ADD CONSTRAINT fk_mcqs_options FOREIGN KEY (mcq_id) REFERENCES public.mcqs(id) ON DELETE CASCADE;


--
-- Name: quiz_attempts fk_quiz_attempts_quiz; Type: FK CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT fk_quiz_attempts_quiz FOREIGN KEY (quizid) REFERENCES public.quizes(id);


--
-- Name: quiz_scores fk_quiz_scores_quiz_attempts; Type: FK CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.quiz_scores
    ADD CONSTRAINT fk_quiz_scores_quiz_attempts FOREIGN KEY (quiz_attempt_id) REFERENCES public.quiz_attempts(id);


--
-- Name: DATABASE quick_silver_db; Type: ACL; Schema: -; Owner: tapan
--

GRANT ALL ON DATABASE quick_silver_db TO quicksilver;


--
-- PostgreSQL database dump complete
--

--
-- Database "tapan" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tapan; Type: DATABASE; Schema: -; Owner: tapan
--

CREATE DATABASE tapan WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE tapan OWNER TO tapan;

\connect tapan

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "vision_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: vision_db; Type: DATABASE; Schema: -; Owner: tapan
--

CREATE DATABASE vision_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE vision_db OWNER TO tapan;

\connect vision_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO tapan;

--
-- Name: course_modules; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.course_modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    video_url character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    completion_percentage integer DEFAULT 10 NOT NULL,
    is_module_live boolean DEFAULT true
);


ALTER TABLE public.course_modules OWNER TO tapan;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: tapan
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    thumbnail_url character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.courses OWNER TO tapan;

--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250702100840-course_details.js
20250704105936-course_modules_table.js
20250708123636-update_course_module.js
20250822180915-add_column_in_module.js
\.


--
-- Data for Name: course_modules; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.course_modules (id, course_id, video_url, title, description, "createdAt", "updatedAt", completion_percentage, is_module_live) FROM stdin;
baad674b-34d7-4431-ab0f-d36e0135fd83	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/baad674b-34d7-4431-ab0f-d36e0135fd83.mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 20:22:43.904+00	2025-09-05 20:22:53.226+00	30	t
4316c2ac-42c8-43f8-bfd9-c611114e75b3	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757161074168 - KailshKher.mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 12:17:53.167+00	2025-09-06 12:21:00.502+00	30	f
fc2bbfa9-c4ea-42fb-8500-c6e9f7a5a1d7	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757100285406 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 19:24:44.335+00	2025-09-05 19:34:49.327+00	30	f
89193c17-01d0-4d09-a8c2-11337eb2ecc7	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757100548047 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 19:29:06.534+00	2025-09-05 19:39:07.015+00	30	f
558dcefd-5c85-47cd-9611-bac22da272cc	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757100629108 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 19:30:28.073+00	2025-09-05 19:40:29.213+00	30	f
22094243-70fc-460b-a004-55873aee7427	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/22094243-70fc-460b-a004-55873aee7427.mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 19:42:30.611+00	2025-09-05 19:42:39.95+00	30	t
cc4217ac-dc7b-473e-b211-0ef44bf3a4b7	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757101183748 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 19:39:42.736+00	2025-09-05 19:49:46.774+00	30	f
1637e05e-9a10-4850-8d69-8613c0612545	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/1637e05e-9a10-4850-8d69-8613c0612545.mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 18:54:35.179+00	2025-09-05 18:54:44.55+00	30	t
bb832fc0-72d3-4b18-86e1-8901ecca6f0d	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757099484381 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 19:11:23.129+00	2025-09-05 19:21:27.56+00	30	f
c4bfcb6a-a0b8-4167-ada5-0dd64ec247d2	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757104142948 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 20:29:01.925+00	2025-09-05 20:39:06.169+00	30	f
cafedd74-ae81-4574-9b6f-3eb27fd5109f	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757101981166 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 19:53:00.21+00	2025-09-05 20:03:04.157+00	30	f
42b2e56b-30c6-4a43-8df7-25d9abb8ea41	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757184358730 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 18:45:57.726+00	2025-09-06 18:56:00.79+00	30	f
689a295b-e194-4977-bffb-15cc7ce88328	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757102248891 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 19:57:27.787+00	2025-09-05 20:07:32.15+00	30	f
57b95147-f0fc-4afa-a5b1-6ee1508aa29b	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757102433413 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 20:00:32.429+00	2025-09-05 20:10:34.4+00	30	f
784201c3-0991-49c2-ac7c-b9b50b0c4128	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/784201c3-0991-49c2-ac7c-b9b50b0c4128.mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 20:11:49.349+00	2025-09-05 20:11:59.047+00	30	t
7e468a56-5b84-4ffd-8822-91938c33e6b1	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757102600468 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 20:03:19.367+00	2025-09-05 20:13:19.164+00	30	f
fe7ecddd-d78f-498b-b259-ad92230741fb	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/fe7ecddd-d78f-498b-b259-ad92230741fb.mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 20:18:19.085+00	2025-09-05 20:18:28.37+00	30	t
4db8f1f1-a23a-4e89-9cd5-2297c119ef39	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757104350838 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 20:32:29.597+00	2025-09-05 20:42:34.133+00	30	f
1ac3a811-b040-43d0-9ca1-7fc6ed9fa79e	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/1ac3a811-b040-43d0-9ca1-7fc6ed9fa79e.mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 20:44:00.174+00	2025-09-05 20:44:09.148+00	30	t
9922069d-600b-43a8-b9ed-e3f751750dc5	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/9922069d-600b-43a8-b9ed-e3f751750dc5.mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 20:46:29.96+00	2025-09-05 20:46:39.932+00	30	t
e43e6cfc-954a-47ab-b933-8a7d350e5567	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757104914502 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-05 20:41:53.025+00	2025-09-05 20:51:55.305+00	30	f
5fe46fa2-3629-4a09-9180-be4e694f5452	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757160337850 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 12:05:36.04+00	2025-09-06 12:15:39.639+00	30	f
a86ae6fd-cdbe-4e2b-8df4-873568961cd1	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757183268189 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 18:27:46.753+00	2025-09-06 18:37:52.244+00	30	f
65f2a4eb-d881-4835-9a77-19113dde85f4	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757169272455 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 14:34:30.487+00	2025-09-06 14:44:36.141+00	30	f
4c0b2cea-24e2-4821-95d5-b9477a912ea1	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757169475551 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 14:37:53.71+00	2025-09-06 14:47:59.622+00	30	f
60285185-86c8-420e-b039-244c08534f48	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/60285185-86c8-420e-b039-244c08534f48.mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 15:00:13.032+00	2025-09-06 15:00:22.339+00	30	t
297d1db3-a087-477e-a5eb-e53b08a7bb89	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/297d1db3-a087-477e-a5eb-e53b08a7bb89.mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 18:22:50.926+00	2025-09-06 18:23:02.083+00	30	t
9f955215-751e-493d-9112-8d99ac202f4a	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/9f955215-751e-493d-9112-8d99ac202f4a.mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 18:39:01.333+00	2025-09-06 18:39:13.046+00	30	t
41ab8d5c-04a0-474e-b7e9-8224987d6e36	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/41ab8d5c-04a0-474e-b7e9-8224987d6e36.mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 18:42:51.116+00	2025-09-06 18:43:00.367+00	30	t
666528db-e9c5-487a-b7f8-b519ff323463	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\uploads/666528db-e9c5-487a-b7f8-b519ff323463.mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 21:04:40.081+00	2025-09-06 21:04:52.36+00	30	t
6474bda2-a05a-4c5a-9a0c-f72b4d08ae19	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	D:\\Projects_Pending\\Elearning\\Course_Service\\src\\temp_uploads\\xau3fqrmu1fd57phoqmi1aeow.mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 21:06:56.196+00	2025-09-06 21:06:56.196+00	30	t
e841126b-b76d-42dd-ac80-019fbf10ecfe	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757184256512 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 18:44:15.409+00	2025-09-06 18:54:18.419+00	30	f
489442de-2d45-44c4-9e8c-834f0eed2d1e	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757184577896 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-06 18:49:36.151+00	2025-09-06 18:59:40.551+00	30	f
8d6cc922-6855-4183-b1f6-f7beea587073	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757619126489 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-11 19:32:05.401+00	2025-09-11 19:42:07.263+00	30	f
524aae31-3ee4-4ac8-b5c6-19157874fc1b	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757618958150 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-11 19:29:16.466+00	2025-09-11 19:39:20.483+00	30	f
2ad383ce-c7d3-4e36-8f61-43e479ea491f	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757703488654 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-12 18:58:07.678+00	2025-09-12 19:08:11.881+00	30	f
9129d2a9-4cfd-4f46-bf85-424d61f24a6a	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757705437885 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-12 19:30:35.864+00	2025-09-12 19:40:38.837+00	30	f
06e698f2-266d-4340-97da-4b03964d5c78	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757706237940 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-12 19:43:55.39+00	2025-09-12 19:54:01.045+00	30	f
cbd50be6-d69e-488a-9aa9-46c72f06e0ee	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757706915162 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-12 19:55:13.279+00	2025-09-12 20:05:16.581+00	30	f
ea72a9a0-3141-42da-bd7a-3af83ecbc2df	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757707098340 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-12 19:58:16.731+00	2025-09-12 20:08:21.399+00	30	f
e27e1d08-a905-4937-9688-a6391cfc0dcd	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757707239830 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-12 20:00:37.987+00	2025-09-12 20:10:40.758+00	30	f
a955e5d4-102e-4faf-801b-a60e72eff948	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757707958659 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-12 20:12:37.694+00	2025-09-12 20:22:42.434+00	30	f
43de4a9d-28a0-43ac-ae33-0190766a5de5	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757708052549 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-12 20:14:11.471+00	2025-09-12 20:24:15.182+00	30	f
d70dfcf1-bacb-435f-80ae-1c92f390607f	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757708484529 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-12 20:21:23.441+00	2025-09-12 20:31:27.756+00	30	f
7e55bdaf-43f0-4626-99f2-6f4aa76b0649	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	moduleVideo/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7/1757708585129 - YtTestVideo(compressed).mp4	Python Module 2	This Is Also Python Module 2	2025-09-12 20:23:03.921+00	2025-09-12 20:33:04.213+00	30	f
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: tapan
--

COPY public.courses (id, title, description, thumbnail_url, "createdAt", "updatedAt") FROM stdin;
77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	Java Course	Java Course Before Java Launched	1755953261316 - javaCourse.jpeg	2025-08-23 12:47:41.552617+00	2025-08-23 12:47:41.552617+00
0f33e6f1-ae79-48ac-8208-3d93116d8284	Java Course2	Java Course2 Before Java Launched	1758309239533 - javaCourse.jpeg	2025-09-19 19:13:59.037479+00	2025-09-19 19:13:59.037479+00
\.


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: course_modules course_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: course_modules course_modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tapan
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: DATABASE vision_db; Type: ACL; Schema: -; Owner: tapan
--

GRANT ALL ON DATABASE vision_db TO vision;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

