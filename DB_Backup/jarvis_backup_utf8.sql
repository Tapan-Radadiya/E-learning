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


--
-- Name: enum_users_user_role; Type: TYPE; Schema: public; Owner: JarvisDB
--

CREATE TYPE public.enum_users_user_role AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public.enum_users_user_role OWNER TO "JarvisDB";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: JarvisDB
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO "JarvisDB";

--
-- Name: user_refresh_tokens; Type: TABLE; Schema: public; Owner: JarvisDB
--

CREATE TABLE public.user_refresh_tokens (
    user_id uuid NOT NULL,
    refresh_token character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_refresh_tokens OWNER TO "JarvisDB";

--
-- Name: users; Type: TABLE; Schema: public; Owner: JarvisDB
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


ALTER TABLE public.users OWNER TO "JarvisDB";

--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: JarvisDB
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
-- Data for Name: user_refresh_tokens; Type: TABLE DATA; Schema: public; Owner: JarvisDB
--

COPY public.user_refresh_tokens (user_id, refresh_token, "createdAt", "updatedAt") FROM stdin;
57d3926e-8129-4f9c-a694-a45f41556a85	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhcGFucmFkYWRpeWEzMUBnbWFpbC5jb20iLCJpYXQiOjE3NTczNTMyNjQsImV4cCI6MTc1NzQzOTY2NH0.2WhBZpVeOMu6MA5Y_Vk5iX78bjV_xS6jgI3ae-Ssdak	2025-09-06 21:08:24.044+00	2025-09-08 17:41:04.33+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: JarvisDB
--

COPY public.users (id, display_name, email, password, "createdAt", "updatedAt", user_role, speakeasy_key, is_mfa_enabled) FROM stdin;
57d3926e-8129-4f9c-a694-a45f41556a85	Taps	tapanradadiya31@gmail.com	99dfdd2ae879d4db6b117c2dcf89fe79943bedea0d2b977a6d26b11f05eec9a13c627229a9acf667a321b43c1b37c4d71ad7f457e44a972db6491c8c43ad70db	2025-09-06 21:06:06.015+00	2025-09-06 21:06:50.753+00	USER	NMTCC4DZKE2TU43UPVXUKWZ2KRGUY6ZP	t
\.


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: JarvisDB
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: user_refresh_tokens user_refresh_token_PK_user_id; Type: CONSTRAINT; Schema: public; Owner: JarvisDB
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT "user_refresh_token_PK_user_id" PRIMARY KEY (user_id);


--
-- Name: user_refresh_tokens user_refresh_tokens_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: JarvisDB
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT user_refresh_tokens_user_id_unique UNIQUE (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: JarvisDB
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: JarvisDB
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_refresh_tokens user_refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: JarvisDB
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT user_refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_refresh_tokens user_refresh_tokens_user_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: JarvisDB
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT user_refresh_tokens_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_refresh_tokens user_refresh_tokens_user_id_foreign_key; Type: FK CONSTRAINT; Schema: public; Owner: JarvisDB
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT user_refresh_tokens_user_id_foreign_key FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

