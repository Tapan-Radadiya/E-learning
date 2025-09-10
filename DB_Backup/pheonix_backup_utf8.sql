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
-- Name: user_xp_events; Type: TABLE; Schema: public; Owner: PheonixDB
--

CREATE TABLE public.user_xp_events (
    id text NOT NULL,
    xp_event text NOT NULL,
    xp_points bigint,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.user_xp_events OWNER TO "PheonixDB";

--
-- Name: user_xps; Type: TABLE; Schema: public; Owner: PheonixDB
--

CREATE TABLE public.user_xps (
    id text NOT NULL,
    xp_points bigint,
    userid text,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.user_xps OWNER TO "PheonixDB";

--
-- Data for Name: user_xp_events; Type: TABLE DATA; Schema: public; Owner: PheonixDB
--

COPY public.user_xp_events (id, xp_event, xp_points, createdat, updated_at) FROM stdin;
a109e26c-393a-4901-ac0a-635357f9cd38	NEW_REGISTER	100	2025-08-23 11:00:05.902055+00	2025-08-23 11:00:05.902055+00
83ce5819-38c0-47ce-be0a-4d16909648eb	COURSE_COMPLETE	300	2025-08-23 11:00:23.139186+00	2025-08-23 11:00:23.139186+00
d0e7c230-349b-486b-bf9b-cafc195a9195	QUIZ_PASSED	300	2025-08-23 12:34:01.43172+00	2025-08-23 12:34:01.43172+00
1a5ea255-4f31-497b-b65a-fe915bab18a9	FIRST_ENROLL	300	2025-08-23 12:38:23.539359+00	2025-08-23 12:38:23.539359+00
\.


--
-- Data for Name: user_xps; Type: TABLE DATA; Schema: public; Owner: PheonixDB
--

COPY public.user_xps (id, xp_points, userid, createdat, updated_at) FROM stdin;
205cffbf-1bde-4d92-b55e-2c83e3ce5968	400	cdd97fa7-4d8a-4f6d-8fa7-c3c4f132a217	2025-08-23 12:44:55.753724+00	2025-08-24 16:10:32.339163+00
2fc05697-7274-4744-9027-df9c66c5e5d1	100	4974664c-5b68-4965-b7a2-29be92835588	2025-09-06 20:11:25.806154+00	2025-09-06 20:11:25.816192+00
da2d957e-1040-4fcc-b4f7-bf3d2f196c19	100	d53beb7b-06ad-418f-8d3c-f2f7e95fcd57	2025-09-06 20:22:33.387463+00	2025-09-06 20:22:33.391391+00
\.


--
-- Name: user_xp_events uni_user_xp_events_xp_event; Type: CONSTRAINT; Schema: public; Owner: PheonixDB
--

ALTER TABLE ONLY public.user_xp_events
    ADD CONSTRAINT uni_user_xp_events_xp_event UNIQUE (xp_event);


--
-- Name: user_xp_events user_xp_events_pkey; Type: CONSTRAINT; Schema: public; Owner: PheonixDB
--

ALTER TABLE ONLY public.user_xp_events
    ADD CONSTRAINT user_xp_events_pkey PRIMARY KEY (id);


--
-- Name: user_xps user_xps_pkey; Type: CONSTRAINT; Schema: public; Owner: PheonixDB
--

ALTER TABLE ONLY public.user_xps
    ADD CONSTRAINT user_xps_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

