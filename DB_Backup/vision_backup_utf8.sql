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
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: VisionDB
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO "VisionDB";

--
-- Name: course_modules; Type: TABLE; Schema: public; Owner: VisionDB
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


ALTER TABLE public.course_modules OWNER TO "VisionDB";

--
-- Name: courses; Type: TABLE; Schema: public; Owner: VisionDB
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    thumbnail_url character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.courses OWNER TO "VisionDB";

--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: VisionDB
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250702100840-course_details.js
20250704105936-course_modules_table.js
20250708123636-update_course_module.js
20250822180915-add_column_in_module.js
\.


--
-- Data for Name: course_modules; Type: TABLE DATA; Schema: public; Owner: VisionDB
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
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: VisionDB
--

COPY public.courses (id, title, description, thumbnail_url, "createdAt", "updatedAt") FROM stdin;
77f7527d-a0e3-4a48-af3e-98f6b85f5fc7	Java Course	Java Course Before Java Launched	1755953261316 - javaCourse.jpeg	2025-08-23 12:47:41.552617+00	2025-08-23 12:47:41.552617+00
\.


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: VisionDB
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: course_modules course_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: VisionDB
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: VisionDB
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: course_modules course_modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: VisionDB
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- PostgreSQL database dump complete
--

