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
-- Name: mcq_options; Type: TABLE; Schema: public; Owner: QuickSilverDB
--

CREATE TABLE public.mcq_options (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    option_text text,
    mcq_id uuid,
    is_correct boolean,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.mcq_options OWNER TO "QuickSilverDB";

--
-- Name: mcqs; Type: TABLE; Schema: public; Owner: QuickSilverDB
--

CREATE TABLE public.mcqs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    course_id uuid,
    question text,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.mcqs OWNER TO "QuickSilverDB";

--
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: QuickSilverDB
--

CREATE TABLE public.quiz_attempts (
    id uuid NOT NULL,
    userid uuid,
    quizid uuid,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.quiz_attempts OWNER TO "QuickSilverDB";

--
-- Name: quiz_scores; Type: TABLE; Schema: public; Owner: QuickSilverDB
--

CREATE TABLE public.quiz_scores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    is_passed boolean,
    score bigint,
    quiz_attempt_id uuid,
    createdat timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.quiz_scores OWNER TO "QuickSilverDB";

--
-- Name: quizes; Type: TABLE; Schema: public; Owner: QuickSilverDB
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


ALTER TABLE public.quizes OWNER TO "QuickSilverDB";

--
-- Data for Name: mcq_options; Type: TABLE DATA; Schema: public; Owner: QuickSilverDB
--

COPY public.mcq_options (id, option_text, mcq_id, is_correct, createdat, updated_at) FROM stdin;
\.


--
-- Data for Name: mcqs; Type: TABLE DATA; Schema: public; Owner: QuickSilverDB
--

COPY public.mcqs (id, course_id, question, createdat, updated_at) FROM stdin;
\.


--
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: QuickSilverDB
--

COPY public.quiz_attempts (id, userid, quizid, createdat, updated_at) FROM stdin;
\.


--
-- Data for Name: quiz_scores; Type: TABLE DATA; Schema: public; Owner: QuickSilverDB
--

COPY public.quiz_scores (id, is_passed, score, quiz_attempt_id, createdat, updated_at) FROM stdin;
\.


--
-- Data for Name: quizes; Type: TABLE DATA; Schema: public; Owner: QuickSilverDB
--

COPY public.quizes (id, title, description, course_id, totalquestions, passingmarks, createdat, updated_at) FROM stdin;
\.


--
-- Name: mcq_options mcq_options_pkey; Type: CONSTRAINT; Schema: public; Owner: QuickSilverDB
--

ALTER TABLE ONLY public.mcq_options
    ADD CONSTRAINT mcq_options_pkey PRIMARY KEY (id);


--
-- Name: mcqs mcqs_pkey; Type: CONSTRAINT; Schema: public; Owner: QuickSilverDB
--

ALTER TABLE ONLY public.mcqs
    ADD CONSTRAINT mcqs_pkey PRIMARY KEY (id);


--
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: QuickSilverDB
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- Name: quiz_scores quiz_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: QuickSilverDB
--

ALTER TABLE ONLY public.quiz_scores
    ADD CONSTRAINT quiz_scores_pkey PRIMARY KEY (id);


--
-- Name: quizes quizes_pkey; Type: CONSTRAINT; Schema: public; Owner: QuickSilverDB
--

ALTER TABLE ONLY public.quizes
    ADD CONSTRAINT quizes_pkey PRIMARY KEY (id);


--
-- Name: mcq_options fk_mcqs_options; Type: FK CONSTRAINT; Schema: public; Owner: QuickSilverDB
--

ALTER TABLE ONLY public.mcq_options
    ADD CONSTRAINT fk_mcqs_options FOREIGN KEY (mcq_id) REFERENCES public.mcqs(id);


--
-- Name: quiz_attempts fk_quiz_attempts_quiz; Type: FK CONSTRAINT; Schema: public; Owner: QuickSilverDB
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT fk_quiz_attempts_quiz FOREIGN KEY (quizid) REFERENCES public.quizes(id);


--
-- Name: quiz_scores fk_quiz_scores_quiz_attempts; Type: FK CONSTRAINT; Schema: public; Owner: QuickSilverDB
--

ALTER TABLE ONLY public.quiz_scores
    ADD CONSTRAINT fk_quiz_scores_quiz_attempts FOREIGN KEY (quiz_attempt_id) REFERENCES public.quiz_attempts(id);


--
-- PostgreSQL database dump complete
--

