--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.4

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
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: FridayDB
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO "FridayDB";

--
-- Name: course_progresses; Type: TABLE; Schema: public; Owner: FridayDB
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


ALTER TABLE public.course_progresses OWNER TO "FridayDB";

--
-- Name: user_enrollments; Type: TABLE; Schema: public; Owner: FridayDB
--

CREATE TABLE public.user_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_enrollments OWNER TO "FridayDB";

--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: FridayDB
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250707070808-enrollment_table.js
20250707071326-course_progress.js
\.


--
-- Data for Name: course_progresses; Type: TABLE DATA; Schema: public; Owner: FridayDB
--

COPY public.course_progresses (id, user_id, course_id, progress_percent, is_completed, "createdAt", "updatedAt") FROM stdin;
78a6ceb3-7bb6-4f5c-b9c0-0a19015ac128	cdd97fa7-4d8a-4f6d-8fa7-c3c4f132a217	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	20	f	2025-08-24 16:10:32.659505+00	2025-08-24 16:11:30.8361+00
\.


--
-- Data for Name: user_enrollments; Type: TABLE DATA; Schema: public; Owner: FridayDB
--

COPY public.user_enrollments (id, user_id, course_id, "createdAt", "updatedAt") FROM stdin;
81700d44-9ac9-4992-8f76-b3817422bb8b	cdd97fa7-4d8a-4f6d-8fa7-c3c4f132a217	77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	2025-08-24 16:10:32.648196+00	2025-08-24 16:10:32.648196+00
\.


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: FridayDB
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: course_progresses course_progresses_pkey; Type: CONSTRAINT; Schema: public; Owner: FridayDB
--

ALTER TABLE ONLY public.course_progresses
    ADD CONSTRAINT course_progresses_pkey PRIMARY KEY (id);


--
-- Name: user_enrollments user_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: FridayDB
--

ALTER TABLE ONLY public.user_enrollments
    ADD CONSTRAINT user_enrollments_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

