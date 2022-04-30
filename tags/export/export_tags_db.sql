--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
-- Dumped by pg_dump version 14.2 (Debian 14.2-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: tag_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag_items (
    id integer NOT NULL,
    name character varying NOT NULL,
    name_downcase character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.tag_items OWNER TO postgres;

--
-- Name: tag_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tag_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_items_id_seq OWNER TO postgres;

--
-- Name: tag_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tag_items_id_seq OWNED BY public.tag_items.id;


--
-- Name: tag_objects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag_objects (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.tag_objects OWNER TO postgres;

--
-- Name: tag_objects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tag_objects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_objects_id_seq OWNER TO postgres;

--
-- Name: tag_objects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tag_objects_id_seq OWNED BY public.tag_objects.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    tag_item_id integer NOT NULL,
    tag_object_id integer NOT NULL,
    o_id integer,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: tag_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_items ALTER COLUMN id SET DEFAULT nextval('public.tag_items_id_seq'::regclass);


--
-- Name: tag_objects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_objects ALTER COLUMN id SET DEFAULT nextval('public.tag_objects_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Data for Name: tag_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag_items (id, name, name_downcase, created_at, updated_at) FROM stdin;
2	npx 1	npx 1	2022-04-14 15:56:11	2022-04-14 15:56:11
3	npx 2	npx 2	2022-04-14 15:56:14	2022-04-14 15:56:14
4	npx 3	npx 3	2022-04-14 15:56:19	2022-04-14 15:56:19
\.


--
-- Data for Name: tag_objects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag_objects (id, name, created_at, updated_at) FROM stdin;
2	tag	2022-04-14 16:20:22	2022-04-14 16:20:22
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, tag_item_id, tag_object_id, o_id, created_by_id, created_at, updated_at) FROM stdin;
5	2	2	1	1	2022-04-14 16:20:22	2022-04-14 16:20:22
6	3	2	1	1	2022-04-14 16:20:26	2022-04-14 16:20:26
7	4	2	1	1	2022-04-14 16:20:30	2022-04-14 16:20:30
\.


--
-- Name: tag_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tag_items_id_seq', 5, true);


--
-- Name: tag_objects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tag_objects_id_seq', 2, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 8, true);


--
-- Name: tag_items tag_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_items
    ADD CONSTRAINT tag_items_pkey PRIMARY KEY (id);


--
-- Name: tag_objects tag_objects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_objects
    ADD CONSTRAINT tag_objects_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

