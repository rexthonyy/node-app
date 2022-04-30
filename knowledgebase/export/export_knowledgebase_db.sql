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

--
-- Name: postgraphile_watch; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA postgraphile_watch;


ALTER SCHEMA postgraphile_watch OWNER TO postgres;

--
-- Name: test; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA test;


ALTER SCHEMA test OWNER TO postgres;

--
-- Name: notify_watchers_ddl(); Type: FUNCTION; Schema: postgraphile_watch; Owner: postgres
--

CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;


ALTER FUNCTION postgraphile_watch.notify_watchers_ddl() OWNER TO postgres;

--
-- Name: notify_watchers_drop(); Type: FUNCTION; Schema: postgraphile_watch; Owner: postgres
--

CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;


ALTER FUNCTION postgraphile_watch.notify_watchers_drop() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_streams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_streams (
    id integer NOT NULL,
    activity_name character varying,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    activity_type character varying
);


ALTER TABLE public.activity_streams OWNER TO postgres;

--
-- Name: knowledge_base_activity_streams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_base_activity_streams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_activity_streams_id_seq OWNER TO postgres;

--
-- Name: knowledge_base_activity_streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_base_activity_streams_id_seq OWNED BY public.activity_streams.id;


--
-- Name: knowledge_base_article_translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_base_article_translations (
    id integer NOT NULL,
    title character varying,
    kb_locale_id integer,
    created_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    body text,
    keywords character varying,
    title_tag character varying,
    meta_description character varying,
    article_id integer,
    active boolean,
    publish_now boolean DEFAULT true NOT NULL,
    update_metadata text,
    is_delete_scheduled boolean DEFAULT false,
    is_update_scheduled boolean DEFAULT false,
    knowledge_base_id integer,
    is_archived boolean DEFAULT false NOT NULL,
    category_id integer,
    ui_color character varying DEFAULT 'red'::character varying NOT NULL,
    list_name character varying,
    "position" integer DEFAULT 1,
    list_id integer
);


ALTER TABLE public.knowledge_base_article_translations OWNER TO postgres;

--
-- Name: knowledge_base_answer_translations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_base_answer_translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_answer_translations_id_seq OWNER TO postgres;

--
-- Name: knowledge_base_answer_translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_base_answer_translations_id_seq OWNED BY public.knowledge_base_article_translations.id;


--
-- Name: knowledge_base_articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_base_articles (
    id integer NOT NULL,
    category_id integer NOT NULL,
    "position" integer NOT NULL,
    updated_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    knowledge_base_id integer,
    is_archived boolean DEFAULT false NOT NULL
);


ALTER TABLE public.knowledge_base_articles OWNER TO postgres;

--
-- Name: knowledge_base_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_base_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_answers_id_seq OWNER TO postgres;

--
-- Name: knowledge_base_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_base_answers_id_seq OWNED BY public.knowledge_base_articles.id;


--
-- Name: knowledge_base_article_delayed_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_base_article_delayed_jobs (
    id integer NOT NULL,
    knowledge_base_id integer NOT NULL,
    knowledge_base_article_id integer NOT NULL,
    knowledge_base_article_translation_id integer NOT NULL,
    run_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    publish_update_delete character varying
);


ALTER TABLE public.knowledge_base_article_delayed_jobs OWNER TO postgres;

--
-- Name: knowledge_base_article_delayed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_base_article_delayed_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_article_delayed_jobs_id_seq OWNER TO postgres;

--
-- Name: knowledge_base_article_delayed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_base_article_delayed_jobs_id_seq OWNED BY public.knowledge_base_article_delayed_jobs.id;


--
-- Name: knowledge_base_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_base_categories (
    id integer NOT NULL,
    knowledge_base_id integer NOT NULL,
    parent_id integer,
    "position" integer NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    is_archived boolean DEFAULT false NOT NULL
);


ALTER TABLE public.knowledge_base_categories OWNER TO postgres;

--
-- Name: knowledge_base_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_base_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_categories_id_seq OWNER TO postgres;

--
-- Name: knowledge_base_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_base_categories_id_seq OWNED BY public.knowledge_base_categories.id;


--
-- Name: knowledge_base_category_delayed_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_base_category_delayed_jobs (
    id integer NOT NULL,
    knowledge_base_category_translation_id integer NOT NULL,
    run_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    knowledge_base_id integer,
    publish_update_delete character varying
);


ALTER TABLE public.knowledge_base_category_delayed_jobs OWNER TO postgres;

--
-- Name: knowledge_base_category_delayed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_base_category_delayed_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_category_delayed_jobs_id_seq OWNER TO postgres;

--
-- Name: knowledge_base_category_delayed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_base_category_delayed_jobs_id_seq OWNED BY public.knowledge_base_category_delayed_jobs.id;


--
-- Name: knowledge_base_category_translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_base_category_translations (
    id integer NOT NULL,
    name character varying NOT NULL,
    kb_locale_id integer NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    ui_color character varying,
    category_icon character varying,
    title_tag character varying,
    footer character varying,
    keywords character varying,
    meta_description character varying,
    publish_now boolean,
    active boolean,
    permission character varying,
    update_metadata text,
    is_delete_scheduled boolean DEFAULT false NOT NULL,
    is_update_scheduled boolean DEFAULT false NOT NULL,
    knowledge_base_id integer,
    is_archived boolean DEFAULT false NOT NULL,
    list_id integer
);


ALTER TABLE public.knowledge_base_category_translations OWNER TO postgres;

--
-- Name: knowledge_base_category_translations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_base_category_translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_category_translations_id_seq OWNER TO postgres;

--
-- Name: knowledge_base_category_translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_base_category_translations_id_seq OWNED BY public.knowledge_base_category_translations.id;


--
-- Name: knowledge_base_lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_base_lists (
    id integer NOT NULL,
    knowledge_base_id integer NOT NULL,
    list_type character varying NOT NULL,
    title character varying NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.knowledge_base_lists OWNER TO postgres;

--
-- Name: knowledge_base_lists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_base_lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_lists_id_seq OWNER TO postgres;

--
-- Name: knowledge_base_lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_base_lists_id_seq OWNED BY public.knowledge_base_lists.id;


--
-- Name: knowledge_base_translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_base_translations (
    id integer NOT NULL,
    knowledge_base_id integer NOT NULL,
    title character varying,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    footer_note character varying,
    kb_locale_id integer,
    active boolean DEFAULT false,
    "position" integer DEFAULT 1,
    ui_color character varying DEFAULT 'red'::character varying,
    is_archived boolean DEFAULT false NOT NULL
);


ALTER TABLE public.knowledge_base_translations OWNER TO postgres;

--
-- Name: knowledge_base_translations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_base_translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_translations_id_seq OWNER TO postgres;

--
-- Name: knowledge_base_translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_base_translations_id_seq OWNED BY public.knowledge_base_translations.id;


--
-- Name: knowledge_bases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_bases (
    id integer NOT NULL,
    name character varying NOT NULL,
    icon character varying,
    footer text,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()),
    homepage_layout character varying,
    category_layout character varying,
    active boolean DEFAULT true,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()),
    front_page character varying DEFAULT false,
    "position" integer DEFAULT '-1'::integer NOT NULL,
    ui_color character varying DEFAULT 'red'::character varying,
    is_archived boolean DEFAULT false NOT NULL
);


ALTER TABLE public.knowledge_bases OWNER TO postgres;

--
-- Name: knowledge_bases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_bases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_bases_id_seq OWNER TO postgres;

--
-- Name: knowledge_bases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_bases_id_seq OWNED BY public.knowledge_bases.id;


--
-- Name: locales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locales (
    id integer NOT NULL,
    locale character varying NOT NULL,
    alias character varying,
    name character varying NOT NULL,
    dir character varying DEFAULT 'ltr'::character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.locales OWNER TO postgres;

--
-- Name: locales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.locales_id_seq OWNER TO postgres;

--
-- Name: locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locales_id_seq OWNED BY public.locales.id;


--
-- Name: user; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test."user" (
    name character varying
);


ALTER TABLE test."user" OWNER TO postgres;

--
-- Name: activity_streams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_streams ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_activity_streams_id_seq'::regclass);


--
-- Name: knowledge_base_article_delayed_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_article_delayed_jobs ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_article_delayed_jobs_id_seq'::regclass);


--
-- Name: knowledge_base_article_translations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_article_translations ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_answer_translations_id_seq'::regclass);


--
-- Name: knowledge_base_articles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_articles ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_answers_id_seq'::regclass);


--
-- Name: knowledge_base_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_categories ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_categories_id_seq'::regclass);


--
-- Name: knowledge_base_category_delayed_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_category_delayed_jobs ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_category_delayed_jobs_id_seq'::regclass);


--
-- Name: knowledge_base_category_translations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_category_translations ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_category_translations_id_seq'::regclass);


--
-- Name: knowledge_base_lists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_lists ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_lists_id_seq'::regclass);


--
-- Name: knowledge_base_translations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_translations ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_translations_id_seq'::regclass);


--
-- Name: knowledge_bases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_bases ALTER COLUMN id SET DEFAULT nextval('public.knowledge_bases_id_seq'::regclass);


--
-- Name: locales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locales ALTER COLUMN id SET DEFAULT nextval('public.locales_id_seq'::regclass);


--
-- Data for Name: activity_streams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_streams (id, activity_name, metadata, created_at, activity_type) FROM stdin;
70	create-knowledgebasearticle	{"title": "Article 01", "kb_locale_id": "5", "knowledge_base_id": 85}	2022-03-30 15:48:10.842409	knowledgebase
71	create-knowledgebasearticle	{"title": "Article 01", "kb_locale_id": "5", "knowledge_base_id": 85}	2022-03-30 15:48:10.844653	knowledgebase
72	create-knowledgebase	{"name": "Knowledgebase 123", "knowledge_base_id": 86}	2022-04-02 14:43:57.497535	knowledgebase
73	update-knowledgebase	{"name": "test", "knowledge_base_id": "47"}	2022-04-02 15:51:29.943743	knowledgebase
74	update-knowledgebase	{"name": "test", "knowledge_base_id": "47"}	2022-04-02 15:52:37.224149	knowledgebase
75	update-knowledgebase	{"name": "test", "knowledge_base_id": "47"}	2022-04-02 15:57:12.060626	knowledgebase
76	update-knowledgebase	{"name": "test", "knowledge_base_id": "47"}	2022-04-02 15:59:32.330526	knowledgebase
77	create-knowledgebase	{"name": "My KB", "knowledge_base_id": 87}	2022-04-05 14:21:53.313457	knowledgebase
78	create-knowledgebasecategory	{"kb_locale_id": "1", "knowledge_base_id": "78"}	2022-04-05 16:58:46.801076	knowledgebase
79	remove-schedule-update-knowledgebasecategory	{"knowledge_base_category_translation_id": "12"}	2022-04-06 13:54:49.134825	knowledgebase
80	create-knowledgebasearticle	{"title": "New article", "kb_locale_id": 1, "knowledge_base_id": "87"}	2022-04-06 15:50:31.949392	knowledgebase
81	create-knowledgebasearticle	{"title": "Test article", "kb_locale_id": 1, "knowledge_base_id": "87"}	2022-04-06 15:51:56.976552	knowledgebase
82	update-knowledgebasearticle	{"article_id": "58", "kb_locale_id": "1"}	2022-04-06 16:11:45.850461	knowledgebase
83	schedule-update-knowledgebasearticle	{"run_at": "2022-12-01", "article_id": "3", "update_metadata": "{\\"knowledge_base_id\\":\\"3\\",\\"category_id\\":\\"22\\",\\"article_id\\":\\"3\\",\\"kb_locale_id\\":\\"1\\"}", "knowledge_base_id": "3", "knowledge_base_article_translation_id": "3"}	2022-04-07 11:24:04.713218	knowledgebase
84	schedule-delete-knowledgebasearticle	{"run_at": "2022-12-01", "article_id": "3", "knowledge_base_id": "3", "knowledge_base_article_translation_id": "3"}	2022-04-07 11:29:59.257699	knowledgebase
85	remove-schedule-delete-knowledgebasearticle	{"knowledge_base_article_translation_id": "11"}	2022-04-07 12:08:52.110338	knowledgebase
86	test	{"check": "yes"}	2022-04-20 10:15:45.948951	some
\.


--
-- Data for Name: knowledge_base_article_delayed_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_base_article_delayed_jobs (id, knowledge_base_id, knowledge_base_article_id, knowledge_base_article_translation_id, run_at, created_at, publish_update_delete) FROM stdin;
2	71	25	28	2022-02-26 00:00:00	2022-03-17 16:36:30.52349	update
4	71	25	28	2022-02-26 00:00:00	2022-03-18 15:08:11.734273	update
14	72	27	30	2022-01-28 23:44:00	2022-03-23 16:43:50.689778	update
15	72	27	30	2022-03-28 21:45:00	2022-03-23 16:44:16.43448	update
16	72	27	30	2022-03-31 22:52:00	2022-03-23 16:45:18.72075	update
17	72	31	34	2022-03-31 19:46:00	2022-03-23 16:46:33.873614	publish
18	76	33	36	2022-03-31 14:38:00	2022-03-24 12:38:50.783548	delete
20	78	34	38	2022-03-17 00:00:00	2022-03-24 15:34:21.211677	publish
21	78	37	40	2022-03-17 00:00:00	2022-03-26 12:49:40.099526	publish
22	78	37	41	2022-03-17 00:00:00	2022-03-26 12:49:40.104077	publish
23	78	40	47	2022-03-29 00:00:00	2022-03-28 13:57:28.009637	publish
24	78	40	48	2022-03-29 00:00:00	2022-03-28 13:57:28.0172	publish
25	78	40	49	2022-03-29 00:00:00	2022-03-28 14:03:39.182559	publish
26	78	49	62	2022-03-30 00:00:00	2022-03-29 13:50:34.224812	publish
27	78	49	63	2022-03-30 00:00:00	2022-03-29 13:50:34.229651	publish
28	3	3	3	2022-12-01 00:00:00	2022-04-07 11:24:04.70907	update
29	3	3	3	2022-12-01 00:00:00	2022-04-07 11:29:59.252275	delete
\.


--
-- Data for Name: knowledge_base_article_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_base_article_translations (id, title, kb_locale_id, created_at, updated_at, body, keywords, title_tag, meta_description, article_id, active, publish_now, update_metadata, is_delete_scheduled, is_update_scheduled, knowledge_base_id, is_archived, category_id, ui_color, list_name, "position", list_id) FROM stdin;
1	English (United Kingdom)	-1	2022-02-14 16:43:09.023087	2022-02-14 16:43:09.023087	\N	\N	\N	\N	\N	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
2	English (Asia)	-1	2022-02-14 16:43:34.024913	2022-02-14 16:43:34.024913	\N	\N	\N	\N	\N	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
4	This an article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the article	keywords	title tag	an article	3	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
6	This a new article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the article	keywords	title tag	an article	5	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
7	Article 001	2	2022-03-01 15:06:59	2022-03-01 15:06:59	<p>BODYBODYBODYBODY</p>	Keywords	Title Tag	Meta	6	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
8	Article 001 (Dansk)	4	2022-03-01 15:11:03	2022-03-01 15:11:03	<p>Article 001 (Dansk)</p>	KK	TT	MD	7	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
9	Article 002 (DENSK)	4	2022-03-01 15:29:52	2022-03-01 15:29:52	<p>BODY\t</p>	KEYWORDS	TITLE TAH	META DESC	8	\N	t	\N	f	f	\N	f	\N	red	\N	1	\N
10	This a new article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the article	keywords	title tag	an article	9	\N	t	\N	f	f	\N	f	\N	red	\N	1	\N
12	Article 001 (Densk)	4	2022-03-01 16:11:59	2022-03-01 16:11:59	<p>Article 001 (Densk)</p>	KEYWORDS	TT	META DESC	11	\N	t	\N	f	f	\N	f	\N	red	\N	1	\N
5	Modified article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the new body of the article	keywords	title tag	an article	-1	\N	t	\N	f	f	\N	f	\N	red	\N	1	\N
13	New modified article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the new body of the article	keywords	title tag	an article	4	\N	t	\N	f	f	\N	f	\N	red	\N	1	\N
14	My article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my article	keywords	title tag	an article	13	\N	t	\N	f	f	\N	f	\N	red	\N	1	\N
15	Mongrove Savanna	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my article	keywords	title tag	an article	14	\N	t	\N	f	f	\N	f	\N	red	\N	1	\N
17	Modified Mongroove	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the new body of the article	keywords	title tag	an article	16	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
20	Article 001 English (United States)	1	2022-03-01 17:22:27	2022-03-01 17:22:27	<p>Article 001 English (United States)</p>	Keywords	Title tag	Meta Description	18	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
21	Article 001 (English (Great Britain))	8	2022-03-01 17:25:09	2022-03-01 17:25:09	<p>Article 001 English (Great Britain)</p>	Keywords	Title tag	Meta Description	18	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
22	Service Article 001	8	2022-03-10 13:37:14	2022-03-10 13:37:14	<p><strong>Content</strong></p><p><span class="ql-cursor">﻿</span>Service Article 001</p>	K	TT	MD	19	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
23	p-SERVICES Article 01	8	2022-03-10 14:08:58	2022-03-10 14:08:58	<p>p-SERVICES Article 01</p>	p-SERVICES Article 01	p-SERVICES Article 01	p-SERVICES Article 01	20	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
25	Decorator Article 02	1	2022-03-17 14:10:57	2022-03-17 14:10:57	<p>Decorator Article 02</p>	Decorator Article 02	Decorator Article 02	Decorator Article 02	22	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
26	Decorator Article 03	1	2022-03-17 14:11:38	2022-03-17 14:11:38	<p>Decorator Article 03</p>				23	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
27	Decorator Article 04	1	2022-03-17 14:12:28	2022-03-17 14:12:28	<p>Decorator Article 04</p>				24	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
28	Some test article	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the new body of the article	keywords	title tag	an article	25	t	t	{"knowledge_base_id":71,"category_id":806,"position":10,"updated_at":"2022-02-26","created_at":"2022-02-26","article_id":25,"title":"new test article","kb_locale_id":1,"body":"This is the new body of the article","keywords":"keywords","title_tag":"title tag","meta_description":"an article","active":true,"publish_now":true,"schedule_at":null}	f	t	\N	f	\N	red	\N	1	\N
34	ARTICLE 01	2	2022-03-23 16:46:33	2022-03-23 16:46:33	<p>ARTICLE 01</p>	K	TT	MD	31	t	f	\N	f	f	\N	f	\N	red	\N	1	\N
35	How to treat my royalty partner 	8	2022-03-23 20:19:02	2022-03-23 20:19:02	<p>With all the love care and respect in the world.</p>				32	f	t	\N	f	f	\N	f	\N	red	\N	1	\N
36	Article 01	8	2022-03-24 12:22:01	2022-03-24 12:22:01	<p>Article 01</p>	Article 01	Article 01		33	t	t	\N	t	f	\N	f	\N	red	\N	1	\N
29	Article 001	21	2022-03-22 17:28:47	2022-03-22 17:28:47	<p>Content</p>	Keywords	Title tag	Meta	26	t	t		f	f	\N	f	\N	red	\N	1	\N
24	Decorator Cat Article 01	1	2022-03-22 18:28:39	2022-03-22 18:28:39	<p>Decorator Cat Article lkjk;lkjklkjlkl</p>	Decorator Cat Article	Decorator Cat Article	Decorator Cat Article	21	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
31	jhjk	7	2022-03-22 18:50:45	2022-03-22 18:50:45	<p>lkjnhbnjkjhnjkjnhbnjk ikjhbnjkjnhbnjkkjnhbnj lkjnhnjkkjnhbnjkkjhjnhbnjmkmjnh</p>		kjhjkjhjk		28	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
32	,kjnhjmk,lkj	7	2022-03-22 18:51:07	2022-03-22 18:51:07	<p>l,kmjnhbnjmk,lkmijnhujimk,mjinmk</p>				29	f	t	\N	f	f	\N	f	\N	red	\N	1	\N
33	Article 01	8	2022-03-23 15:01:41	2022-03-23 15:01:41	<p>Article 01</p>	K	TT	MD	30	t	t	\N	f	f	\N	f	\N	red	\N	1	\N
30	m,njb	2	2022-03-22 17:31:28	2022-03-22 17:31:28	<p>lkjhvgbjnkm</p>				27	f	t	{"id":30,"article_id":27,"category_id":819,"knowledge_base_id":72,"kb_locale_id":2,"position":null,"title":"m,njb","body":"<p>lkjhvgbjnkm</p>","keywords":"","title_tag":"","active":false,"meta_description":"","schedule_at":"2022-03-31T22:52:00+05:00","publish_now":false}	f	t	\N	f	\N	red	\N	1	\N
43	lkhg	4	2022-03-26 20:30:07	2022-03-26 20:30:07	<p>;lkhgkl;'lkhl;k</p>				38	t	t	\N	f	f	81	f	882	green		1	\N
44	p	6	2022-03-27 18:50:00	2022-03-27 18:50:00	<p>pp</p>				39	f	t	\N	f	f	82	f	885	orange		1	\N
45	p	16	2022-03-27 18:50:00	2022-03-27 18:50:00	<p>pp</p>				39	f	t	\N	f	f	82	f	885	red		1	\N
46	p	5	2022-03-27 18:50:00	2022-03-27 18:50:00	<p>pp</p>				39	f	t	\N	f	f	82	f	885	red		1	\N
47	Article 1	8	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	40	t	f	\N	f	f	78	f	-1	red	friendlygig	1	\N
48	Article 1	7	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	40	t	f	\N	f	f	78	f	-1	red	friendlygig	1	\N
49	Article 1	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	40	t	f	\N	f	f	78	f	-1	green	friendlygig	1	\N
50	Article 001	1	2022-03-28 14:03:39	2022-03-28 14:03:39	<p>Article 001</p>	KK	TT	META DESCRIPTION	25	t	t	\N	f	f	39	f	212	green		1	\N
51	Article 001	7	2022-03-28 14:03:39	2022-03-28 14:03:39	<p>Article 001</p>	KK	TT	META DESCRIPTION	25	t	t	\N	f	f	39	f	212	red		1	\N
53	Article 001	7	2022-03-28 14:07:59	2022-03-28 14:07:59	<p>Content</p>	KEYWOPRDS	TT		42	t	t	\N	f	f	39	f	212	red		1	\N
52	Article Have Text anmd  001	1	2022-03-28 14:45:21	2022-03-28 14:45:21	<p>Content</p>	KEYWOPRDS	TT		42	t	t	\N	f	f	39	f	212	green		1	\N
54	Article 001	1	2022-03-28 15:54:52	2022-03-28 15:54:52	<p>Content</p>	KK	TT		43	t	t	\N	f	f	39	f	-1	green		1	\N
55	Article 001	7	2022-03-28 15:54:52	2022-03-28 15:54:52	<p>Content</p>	KK	TT		43	t	t	\N	f	f	39	f	-1	red		1	\N
38	test article	7	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	34	t	f	\N	f	f	\N	f	864	red	\N	1	\N
39	test article	8	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	34	t	f	\N	f	f	\N	f	864	red	\N	1	\N
37	New test article	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the new body of the article	keywords	title tag	an article	34	t	t	\N	f	f	\N	f	864	red	friendlygig	1	\N
40	another test article 2	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	37	t	f	\N	f	f	78	f	864	green	friendlygig	1	\N
41	another test article 2	8	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	37	t	f	\N	f	f	78	f	864	green	friendlygig	1	\N
42	another test article 2	7	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	37	t	f	\N	f	f	78	f	864	green	friendlygig	1	\N
56	Level 1 Article 04	1	2022-03-29 13:20:17	2022-03-29 13:20:17	<p>Level 1 Article 04</p>		T		44	t	t	\N	f	f	39	f	-1	green		1	\N
57	Level 1 Article 04	7	2022-03-29 13:20:17	2022-03-29 13:20:17	<p>Level 1 Article 04</p>		T		44	t	t	\N	f	f	39	f	-1	red		1	\N
58	Level 1 Article 05	1	2022-03-29 13:23:46	2022-03-29 13:23:46	<p>Level 1 Article 05</p>	KW	TT	MD	46	t	t	\N	f	f	39	f	-1	green		1	\N
59	Level 1 Article 05	7	2022-03-29 13:23:46	2022-03-29 13:23:46	<p>Level 1 Article 05</p>	KW	TT	MD	46	t	t	\N	f	f	39	f	-1	red		1	\N
60	Level 1 Article 006	1	2022-03-29 13:31:23	2022-03-29 13:31:23	<p>Level 1 Article 006</p>	Level 1 Article 006	Level 1 Article 006	Level 1 Article 006	48	t	t	\N	f	f	39	f	-1	green		1	\N
61	Level 1 Article 006	7	2022-03-29 13:31:23	2022-03-29 13:31:23	<p>Level 1 Article 006</p>	Level 1 Article 006	Level 1 Article 006	Level 1 Article 006	48	t	t	\N	f	f	39	f	-1	red		1	\N
62	Article 1	8	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	49	t	f	\N	f	f	78	f	-1	red	friendlygig	1	\N
63	Article 1	7	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	49	t	f	\N	f	f	78	f	-1	red	friendlygig	1	\N
64	Article 1	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	49	t	f	\N	f	f	78	f	-1	green	friendlygig	1	\N
65	Article 1	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	50	t	t	\N	f	f	78	f	888	green	friendlygig	1	\N
66	Article 1	7	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	50	t	t	\N	f	f	78	f	888	red	friendlygig	1	\N
67	Article 1	8	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	50	t	t	\N	f	f	78	f	888	red	friendlygig	1	\N
68	Article 1	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	62	t	t	\N	f	f	78	f	878	green	friendlygig	1	\N
69	Article 1	7	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	62	t	t	\N	f	f	78	f	878	red	friendlygig	1	\N
70	Article 1	8	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	62	t	t	\N	f	f	78	f	878	red	friendlygig	1	\N
71	Article 1	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	52	t	t	\N	f	f	78	f	-1	green	friendlygig	1	\N
72	Article 1	7	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	52	t	t	\N	f	f	78	f	-1	red	friendlygig	1	\N
73	Article 1	8	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	52	t	t	\N	f	f	78	f	-1	red	friendlygig	1	\N
74	Article 2	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	53	t	t	\N	f	f	78	f	879	green	friendlygig	1	\N
75	Article 2	7	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	53	t	t	\N	f	f	78	f	879	red	friendlygig	1	\N
76	Article 2	8	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my test article	keywords	title tag	an article	53	t	t	\N	f	f	78	f	879	red	friendlygig	1	\N
77	Article 01	5	2022-03-30 15:48:10	2022-03-30 15:48:10	<p>Article 01</p>				54	t	t	\N	f	f	85	f	-1	green		1	\N
78	Article 01	18	2022-03-30 15:48:10	2022-03-30 15:48:10	<p>Article 01</p>				54	t	t	\N	f	f	85	f	-1	red		1	\N
79	Article 01	1	2022-03-30 15:48:10	2022-03-30 15:48:10	<p>Article 01</p>				54	t	t	\N	f	f	85	f	-1	red		1	\N
81	Test article	1	2022-04-06 15:51:56	2022-04-06 15:51:56	Article body	a,b	sample	desc	59	t	t	\N	f	f	87	f	87	red	\N	1	\N
80	Test article (updated)	1	2022-04-06 16:11:45	2022-04-06 16:11:45	Article body (updated)	a,b	sample	desc	58	t	t	\N	f	f	87	f	87	red	\N	1	\N
11	Article 003 (Dansk)	4	2022-03-01 15:47:02	2022-03-01 15:47:02	<p>Article 003 (Dansk) DESC\t</p>	Keywords	Title Tag	Meta Description	10	\N	t	\N	f	f	\N	f	\N	red	\N	1	\N
\.


--
-- Data for Name: knowledge_base_articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_base_articles (id, category_id, "position", updated_at, created_at, knowledge_base_id, is_archived) FROM stdin;
6	0	-1	2022-03-01 15:06:59	2022-03-01 15:06:59	32	f
7	0	-1	2022-03-01 15:11:03	2022-03-01 15:11:03	32	f
8	0	-1	2022-03-01 15:29:52	2022-03-01 15:29:52	32	f
9	200	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32	f
10	0	-1	2022-03-01 15:47:02	2022-03-01 15:47:02	32	f
11	44	-1	2022-03-01 16:11:59	2022-03-01 16:11:59	32	f
26	851	-1	2022-03-22 17:28:47	2022-03-22 17:28:47	73	f
12	200	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32	f
13	200	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32	f
14	200	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32	f
15	44	-1	2022-03-01 16:46:40	2022-03-01 16:46:40	32	f
16	200	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32	f
17	44	-1	2022-03-01 16:53:03	2022-03-01 16:53:03	32	f
19	778	-1	2022-03-10 13:37:14	2022-03-10 13:37:14	38	f
20	782	-1	2022-03-10 14:08:58	2022-03-10 14:08:58	38	f
3	46	2	2022-02-26 00:00:00	2022-02-26 00:00:00	32	f
5	46	3	2022-02-26 00:00:00	2022-02-26 00:00:00	32	f
27	819	-1	2022-03-22 17:31:28	2022-03-22 17:31:28	72	f
21	210	-1	2022-03-22 18:28:39	2022-03-22 18:28:39	39	f
29	855	1	2022-03-22 18:51:07	2022-03-22 18:51:07	74	f
28	855	2	2022-03-22 18:50:45	2022-03-22 18:50:45	74	f
30	822	-1	2022-03-23 15:01:41	2022-03-23 15:01:41	70	f
31	819	-1	2022-03-23 16:46:33	2022-03-23 16:46:33	72	f
32	856	-1	2022-03-23 20:19:02	2022-03-23 20:19:02	75	f
33	861	-1	2022-03-24 12:22:01	2022-03-24 12:22:01	76	f
25	806	10	2022-02-26 00:00:00	2022-02-26 00:00:00	71	f
24	210	1	2022-03-17 14:12:28	2022-03-17 14:12:28	39	f
23	210	2	2022-03-17 14:11:38	2022-03-17 14:11:38	39	f
22	210	3	2022-03-17 14:10:57	2022-03-17 14:10:57	39	f
38	882	-1	2022-03-26 20:30:07	2022-03-26 20:30:07	81	f
39	885	-1	2022-03-27 18:50:00	2022-03-27 18:50:00	82	f
40	-1	1	2022-02-26 00:00:00	2022-02-26 00:00:00	78	f
41	212	-1	2022-03-28 14:03:39	2022-03-28 14:03:39	39	f
42	212	1	2022-03-28 14:45:21	2022-03-28 14:45:21	39	f
43	-1	-1	2022-03-28 15:54:52	2022-03-28 15:54:52	39	f
34	864	10	2022-02-26 00:00:00	2022-02-26 00:00:00	78	f
35	864	1	2022-02-26 00:00:00	2022-02-26 00:00:00	78	f
36	864	1	2022-02-26 00:00:00	2022-02-26 00:00:00	78	f
37	864	1	2022-02-26 00:00:00	2022-02-26 00:00:00	78	f
44	-1	-1	2022-03-29 13:20:17	2022-03-29 13:20:17	39	f
45	-1	-1	2022-03-29 13:21:15	2022-03-29 13:21:15	39	f
46	-1	-1	2022-03-29 13:23:46	2022-03-29 13:23:46	39	f
47	-1	-1	2022-03-29 13:26:57	2022-03-29 13:26:57	39	f
48	-1	-1	2022-03-29 13:31:23	2022-03-29 13:31:23	39	f
49	-1	1	2022-02-26 00:00:00	2022-02-26 00:00:00	78	f
50	888	1	2022-02-26 00:00:00	2022-02-26 00:00:00	78	f
51	878	1	2022-02-26 00:00:00	2022-02-26 00:00:00	78	f
52	-1	1	2022-02-26 00:00:00	2022-02-26 00:00:00	78	f
53	879	1	2022-02-26 00:00:00	2022-02-26 00:00:00	78	f
54	-1	-1	2022-03-30 15:48:10	2022-03-30 15:48:10	85	f
18	47	-1	2022-03-01 17:25:09	2022-03-01 17:25:09	37	t
1	1	1	\N	2022-02-14 16:02:32.361821	\N	f
4	36	3	2022-02-26 00:00:00	2022-02-26 00:00:00	32	f
55	87	1	2022-04-06 15:31:52	2022-04-06 15:31:52	21	f
56	87	1	2022-04-06 15:42:45	2022-04-06 15:42:45	21	f
57	87	1	2022-04-06 15:47:11	2022-04-06 15:47:11	87	f
59	87	1	2022-04-06 15:51:56	2022-04-06 15:51:56	87	f
58	87	2	2022-04-06 16:11:45	2022-04-06 16:11:45	87	f
\.


--
-- Data for Name: knowledge_base_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_base_categories (id, knowledge_base_id, parent_id, "position", created_at, updated_at, is_archived) FROM stdin;
6	21	-1	-1	2022-02-21 16:18:48	2022-02-21 16:18:48	f
7	21	-1	-1	2022-02-21 16:19:48	2022-02-21 16:19:48	f
8	1	7	2	2022-02-21 00:00:00	2022-02-21 00:00:00	f
1	1	2	3	2022-02-21 17:51:44	2022-02-21 17:51:44	f
11	1	7	2	2022-02-21 00:00:00	2022-02-21 00:00:00	f
12	1	2	3	2022-02-21 18:21:10	2022-02-21 18:21:10	f
10	21	6	-1	2022-02-21 19:02:21	2022-02-21 19:02:21	f
29	29	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
41	32	-1	-1	2022-02-25 16:22:02	2022-02-25 16:22:02	f
42	32	-1	-1	2022-02-25 16:26:10	2022-02-25 16:26:10	f
13	1	3	3	2022-02-22 11:55:31	2022-02-22 11:55:31	f
17	20	-1	-1	2022-02-22 15:28:37	2022-02-22 15:28:37	f
44	32	-1	-1	2022-02-26 11:48:50	2022-02-26 11:48:50	f
18	23	-1	-1	2022-02-22 18:03:57	2022-02-22 18:03:57	f
19	26	7	2	2022-02-21 00:00:00	2022-02-21 00:00:00	f
20	27	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
21	30	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
22	30	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
23	30	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
24	30	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
25	29	-1	-1	2022-02-24 15:27:54	2022-02-24 15:27:54	f
26	31	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
27	31	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
28	31	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
30	32	-1	-1	2022-02-25 13:36:56	2022-02-25 13:36:56	f
31	29	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
46	32	37	-1	2022-02-26 12:26:29	2022-02-26 12:26:29	f
45	35	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00	f
43	37	-1	-1	2022-03-01 17:20:15	2022-03-01 17:20:15	f
48	39	-1	7	2022-02-02 22:07:34	2022-02-08 11:59:57	f
49	39	-1	12	2022-02-02 22:13:40	2022-02-08 12:00:02	f
50	39	-1	14	2022-02-02 22:21:39	2022-02-08 12:00:07	f
51	39	-1	15	2022-02-02 22:21:53	2022-02-08 12:00:09	f
52	39	-1	16	2022-02-02 22:23:33	2022-02-08 12:00:12	f
53	39	-1	17	2022-02-02 22:24:52	2022-02-08 12:00:15	f
54	39	-1	18	2022-02-02 22:25:14	2022-02-08 12:00:19	f
55	39	-1	19	2022-02-02 22:27:37	2022-02-08 12:00:16	f
56	39	-1	20	2022-02-02 22:27:53	2022-02-08 12:00:18	f
57	39	-1	21	2022-02-02 22:30:32	2022-02-08 12:00:23	f
58	39	-1	22	2022-02-02 22:30:56	2022-02-08 12:00:24	f
59	39	-1	24	2022-02-02 22:38:29	2022-02-08 12:00:24	f
60	39	-1	25	2022-02-02 22:38:50	2022-02-08 12:00:25	f
61	39	-1	26	2022-02-02 22:39:24	2022-02-08 12:00:25	f
62	39	-1	27	2022-02-02 22:39:40	2022-02-08 12:00:28	f
63	39	-1	28	2022-02-02 22:41:12	2022-02-08 12:00:29	f
64	39	-1	29	2022-02-02 22:42:40	2022-02-08 12:00:30	f
65	39	-1	30	2022-02-02 22:49:04	2022-02-08 12:00:32	f
66	39	-1	31	2022-02-02 22:50:45	2022-02-08 12:00:32	f
67	39	-1	32	2022-02-02 22:51:21	2022-02-08 12:00:32	f
68	39	-1	33	2022-02-02 22:51:33	2022-02-08 12:00:33	f
69	39	-1	34	2022-02-02 22:52:54	2022-02-08 12:00:34	f
70	39	-1	35	2022-02-02 22:55:55	2022-02-08 12:00:34	f
71	39	-1	36	2022-02-02 23:00:36	2022-02-08 12:00:35	f
72	39	-1	37	2022-02-02 23:04:13	2022-02-08 12:00:36	f
73	39	-1	38	2022-02-02 23:04:44	2022-02-08 12:00:37	f
74	39	-1	39	2022-02-02 23:09:13	2022-02-08 12:00:37	f
75	39	-1	40	2022-02-02 23:22:42	2022-02-08 12:00:07	f
76	39	-1	42	2022-02-02 23:24:35	2022-02-08 12:00:08	f
77	39	-1	43	2022-02-02 23:28:54	2022-02-08 12:00:07	f
78	39	-1	44	2022-02-02 23:29:29	2022-02-08 12:00:08	f
79	39	-1	45	2022-02-02 23:29:45	2022-02-08 12:00:07	f
80	39	-1	46	2022-02-02 23:30:34	2022-02-08 12:00:07	f
81	39	-1	49	2022-02-02 23:31:59	2022-02-08 12:00:10	f
82	39	-1	50	2022-02-02 23:32:17	2022-02-08 12:00:08	f
83	39	-1	51	2022-02-02 23:32:41	2022-02-08 12:00:08	f
84	39	-1	52	2022-02-02 23:33:01	2022-02-08 12:00:08	f
85	39	-1	53	2022-02-02 23:34:31	2022-02-08 12:00:16	f
86	39	-1	54	2022-02-02 23:34:47	2022-02-08 12:00:15	f
87	39	-1	55	2022-02-02 23:35:02	2022-02-08 12:00:16	f
88	39	-1	56	2022-02-02 23:35:17	2022-02-08 12:00:16	f
89	39	-1	57	2022-02-02 23:35:33	2022-02-08 12:00:15	f
90	39	-1	58	2022-02-02 23:35:56	2022-02-08 12:00:15	f
91	39	-1	59	2022-02-02 23:36:10	2022-02-08 12:00:16	f
92	39	-1	60	2022-02-02 23:36:27	2022-02-08 12:00:16	f
93	39	-1	61	2022-02-02 23:36:39	2022-02-08 12:00:16	f
94	39	-1	62	2022-02-02 23:36:53	2022-02-08 12:00:16	f
95	39	-1	63	2022-02-02 23:37:05	2022-02-08 12:00:16	f
96	39	-1	64	2022-02-02 23:38:53	2022-02-08 12:00:03	f
97	39	-1	65	2022-02-02 23:39:09	2022-02-08 12:00:05	f
98	39	-1	66	2022-02-02 23:39:36	2022-02-08 12:00:03	f
99	39	-1	67	2022-02-02 23:41:25	2022-02-08 12:00:02	f
100	39	-1	68	2022-02-02 23:41:40	2022-02-08 12:00:04	f
101	39	-1	69	2022-02-02 23:41:55	2022-02-08 12:00:03	f
102	39	-1	70	2022-02-02 23:42:07	2022-02-08 12:00:05	f
103	39	-1	71	2022-02-02 23:42:22	2022-02-08 12:00:03	f
104	39	-1	72	2022-02-02 23:42:35	2022-02-08 12:00:05	f
105	39	-1	73	2022-02-02 23:42:56	2022-02-08 12:00:04	f
106	39	-1	74	2022-02-02 23:43:20	2022-02-08 12:00:06	f
107	39	-1	75	2022-02-02 23:43:32	2022-02-08 12:00:06	f
108	39	-1	76	2022-02-02 23:43:43	2022-02-08 12:00:03	f
109	39	-1	77	2022-02-02 23:44:01	2022-02-08 12:00:04	f
110	39	-1	78	2022-02-02 23:44:19	2022-02-08 12:00:05	f
111	39	-1	79	2022-02-02 23:44:29	2022-02-08 12:00:37	f
112	39	-1	80	2022-02-02 23:44:31	2022-02-08 12:00:03	f
113	39	-1	81	2022-02-02 23:44:41	2022-02-08 12:00:05	f
114	39	-1	82	2022-02-02 23:44:55	2022-02-08 12:00:03	f
115	39	-1	83	2022-02-02 23:45:12	2022-02-08 12:00:05	f
116	39	-1	84	2022-02-02 23:45:47	2022-02-08 12:00:04	f
117	39	-1	85	2022-02-02 23:45:59	2022-02-08 12:00:04	f
118	39	-1	86	2022-02-02 23:46:21	2022-02-08 12:00:05	f
119	39	-1	87	2022-02-02 23:46:35	2022-02-08 12:00:03	f
120	39	-1	88	2022-02-02 23:46:48	2022-02-08 12:00:07	f
121	39	-1	89	2022-02-02 23:47:32	2022-02-08 12:00:13	f
122	39	-1	90	2022-02-02 23:47:53	2022-02-08 12:00:12	f
123	39	-1	91	2022-02-02 23:48:08	2022-02-08 12:00:14	f
124	39	-1	92	2022-02-02 23:48:21	2022-02-08 12:00:15	f
125	39	-1	93	2022-02-02 23:48:33	2022-02-08 12:00:13	f
126	39	-1	94	2022-02-02 23:48:44	2022-02-08 12:00:13	f
127	39	-1	95	2022-02-02 23:48:54	2022-02-08 12:00:13	f
128	39	-1	96	2022-02-02 23:49:03	2022-02-08 12:00:14	f
129	39	-1	97	2022-02-02 23:49:44	2022-02-08 12:00:14	f
130	39	-1	98	2022-02-02 23:50:23	2022-02-08 12:00:13	f
131	39	-1	99	2022-02-02 23:50:45	2022-02-08 12:00:14	f
132	39	-1	100	2022-02-02 23:51:03	2022-02-08 12:00:14	f
133	39	-1	101	2022-02-02 23:51:44	2022-02-08 12:00:14	f
3	1	1	3	2022-02-15 00:00:00	2022-02-15 00:00:00	f
47	37	-1	-1	2022-03-01 17:21:37	2022-03-01 17:21:37	t
9	1	7	2	2022-02-21 00:00:00	2022-02-21 00:00:00	f
134	39	-1	102	2022-02-02 23:52:04	2022-02-08 12:00:13	f
135	39	-1	103	2022-02-02 23:52:30	2022-02-08 12:00:13	f
136	39	-1	104	2022-02-02 23:53:01	2022-02-08 12:00:13	f
137	39	-1	105	2022-02-02 23:53:17	2022-02-08 12:00:15	f
138	39	-1	106	2022-02-02 23:53:31	2022-02-08 12:00:15	f
139	39	-1	107	2022-02-02 23:53:43	2022-02-08 12:00:13	f
140	39	-1	108	2022-02-02 23:54:00	2022-02-08 12:00:15	f
141	39	-1	109	2022-02-02 23:54:16	2022-02-08 12:00:14	f
142	39	-1	110	2022-02-02 23:54:41	2022-02-08 12:00:14	f
143	39	-1	111	2022-02-02 23:54:56	2022-02-08 12:00:15	f
144	39	-1	112	2022-02-02 23:55:43	2022-02-08 12:00:10	f
145	39	-1	113	2022-02-02 23:55:53	2022-02-08 12:00:09	f
146	39	-1	114	2022-02-02 23:56:06	2022-02-08 12:00:12	f
147	39	-1	115	2022-02-02 23:56:17	2022-02-08 12:00:10	f
148	39	-1	116	2022-02-02 23:56:29	2022-02-08 12:00:11	f
149	39	-1	119	2022-02-02 23:57:26	2022-02-08 12:00:12	f
150	39	-1	120	2022-02-02 23:57:43	2022-02-08 12:00:11	f
151	39	-1	121	2022-02-02 23:57:57	2022-02-08 12:00:12	f
152	39	-1	122	2022-02-02 23:58:18	2022-02-08 12:00:11	f
153	39	-1	123	2022-02-02 23:58:42	2022-02-08 12:00:11	f
154	39	-1	124	2022-02-02 23:59:36	2022-02-08 12:00:11	f
155	39	-1	125	2022-02-03 00:00:03	2022-02-08 12:00:12	f
156	39	-1	127	2022-02-03 00:00:34	2022-02-08 12:00:11	f
157	39	-1	128	2022-02-03 00:00:47	2022-02-08 12:00:12	f
158	39	-1	130	2022-02-03 00:01:08	2022-02-08 12:00:11	f
159	39	-1	132	2022-02-03 00:03:16	2022-02-08 12:00:38	f
160	39	-1	133	2022-02-03 00:03:52	2022-02-08 11:59:57	f
161	39	-1	134	2022-02-03 00:04:23	2022-02-08 11:59:59	f
162	39	-1	135	2022-02-03 00:04:36	2022-02-08 11:59:59	f
163	39	-1	136	2022-02-03 00:04:47	2022-02-08 11:59:59	f
164	39	-1	137	2022-02-03 00:04:57	2022-02-08 11:59:59	f
165	39	-1	138	2022-02-03 00:05:47	2022-02-08 12:00:38	f
166	39	-1	139	2022-02-03 00:06:02	2022-02-08 12:00:38	f
167	39	-1	140	2022-02-03 00:06:36	2022-02-08 12:00:39	f
168	39	-1	141	2022-02-03 00:06:50	2022-02-08 12:00:38	f
169	39	-1	142	2022-02-03 00:07:10	2022-02-08 12:00:38	f
170	39	-1	143	2022-02-03 00:07:28	2022-02-08 12:00:38	f
171	39	-1	144	2022-02-03 00:07:42	2022-02-08 12:00:38	f
172	39	-1	145	2022-02-03 00:07:54	2022-02-08 12:00:38	f
173	39	-1	146	2022-02-03 00:08:15	2022-02-08 11:59:59	f
174	39	-1	147	2022-02-03 00:08:30	2022-02-08 11:59:59	f
175	39	-1	149	2022-02-03 00:09:45	2022-02-08 12:00:16	f
176	39	-1	150	2022-02-03 00:10:01	2022-02-08 12:00:17	f
177	39	-1	152	2022-02-03 00:10:24	2022-02-08 12:00:18	f
178	39	-1	153	2022-02-03 00:10:41	2022-02-08 12:00:17	f
179	39	-1	154	2022-02-03 00:11:00	2022-02-08 12:00:17	f
180	39	-1	155	2022-02-03 00:11:12	2022-02-08 12:00:17	f
181	39	-1	157	2022-02-03 00:12:10	2022-02-08 12:00:18	f
182	39	-1	158	2022-02-03 00:12:23	2022-02-08 12:00:17	f
183	39	-1	159	2022-02-03 00:12:34	2022-02-08 12:00:17	f
184	39	-1	160	2022-02-03 00:12:45	2022-02-08 12:00:18	f
185	39	-1	161	2022-02-03 00:12:56	2022-02-08 12:00:17	f
186	39	-1	162	2022-02-03 00:13:09	2022-02-08 12:00:17	f
187	39	-1	163	2022-02-03 00:13:21	2022-02-08 12:00:17	f
188	39	-1	164	2022-02-03 00:13:32	2022-02-08 12:00:18	f
189	39	-1	171	2022-02-03 11:37:06	2022-02-07 14:50:27	f
190	39	-1	172	2022-02-03 11:37:52	2022-02-07 14:50:27	f
191	39	-1	174	2022-02-03 12:14:57	2022-02-07 14:50:27	f
192	39	-1	175	2022-02-03 12:23:05	2022-02-07 14:50:27	f
193	39	-1	176	2022-02-03 12:29:18	2022-02-07 14:44:18	f
194	39	-1	178	2022-02-03 22:00:39	2022-02-08 12:00:39	f
195	39	-1	179	2022-02-03 22:01:15	2022-02-08 12:00:32	f
196	39	-1	180	2022-02-03 22:01:39	2022-02-08 12:00:32	f
197	39	-1	181	2022-02-03 22:02:05	2022-02-08 12:00:33	f
198	39	-1	182	2022-02-03 22:02:19	2022-02-08 12:00:32	f
199	39	-1	183	2022-02-03 22:02:34	2022-02-08 12:00:32	f
200	39	-1	184	2022-02-03 22:02:51	2022-02-08 12:00:33	f
201	39	-1	185	2022-02-03 22:03:10	2022-02-08 12:00:33	f
202	39	-1	186	2022-02-03 22:03:27	2022-02-08 12:00:33	f
203	39	-1	187	2022-02-03 22:04:16	2022-02-08 12:00:33	f
204	39	-1	188	2022-02-03 22:04:33	2022-02-08 12:00:33	f
205	39	-1	189	2022-02-03 22:05:49	2022-02-08 12:00:33	f
206	39	-1	190	2022-02-03 22:06:08	2022-02-08 12:00:33	f
207	39	-1	191	2022-02-03 22:06:55	2022-02-08 12:00:33	f
208	39	-1	192	2022-02-03 22:11:40	2022-02-08 12:00:32	f
209	39	-1	193	2022-02-03 22:11:59	2022-02-08 12:00:32	f
237	39	210	7	2022-03-04 12:18:08	2022-03-04 12:18:08	f
299	39	230	104	2022-03-04 12:18:08	2022-03-04 12:18:08	f
293	39	214	98	2022-03-04 12:18:08	2022-03-04 12:18:08	f
295	39	214	100	2022-03-04 12:18:08	2022-03-04 12:18:08	f
296	39	214	101	2022-03-04 12:18:08	2022-03-04 12:18:08	f
302	39	214	107	2022-03-04 12:18:08	2022-03-04 12:18:08	f
250	39	215	55	2022-03-04 12:18:08	2022-03-04 12:18:08	f
257	39	215	62	2022-03-04 12:18:08	2022-03-04 12:18:08	f
272	39	469	77	2022-03-04 12:18:08	2022-03-04 12:18:08	f
259	39	212	64	2022-03-04 12:18:08	2022-03-04 12:18:08	f
260	39	212	65	2022-03-04 12:18:08	2022-03-04 12:18:08	f
261	39	212	66	2022-03-04 12:18:08	2022-03-04 12:18:08	f
262	39	212	67	2022-03-04 12:18:08	2022-03-04 12:18:08	f
263	39	212	68	2022-03-04 12:18:08	2022-03-04 12:18:08	f
265	39	212	70	2022-03-04 12:18:08	2022-03-04 12:18:08	f
266	39	212	71	2022-03-04 12:18:08	2022-03-04 12:18:08	f
267	39	212	72	2022-03-04 12:18:08	2022-03-04 12:18:08	f
269	39	212	74	2022-03-04 12:18:08	2022-03-04 12:18:08	f
270	39	212	75	2022-03-04 12:18:08	2022-03-04 12:18:08	f
275	39	214	80	2022-03-04 12:18:08	2022-03-04 12:18:08	f
241	39	234	44	2022-03-04 12:18:08	2022-03-04 12:18:08	f
283	39	214	88	2022-03-04 12:18:08	2022-03-04 12:18:08	f
277	39	212	82	2022-03-04 12:18:08	2022-03-04 12:18:08	f
276	39	212	81	2022-03-04 12:18:08	2022-03-04 12:18:08	f
290	39	230	95	2022-03-04 12:18:08	2022-03-04 12:18:08	f
279	39	212	84	2022-03-04 12:18:08	2022-03-04 12:18:08	f
280	39	212	85	2022-03-04 12:18:08	2022-03-04 12:18:08	f
281	39	212	86	2022-03-04 12:18:08	2022-03-04 12:18:08	f
282	39	212	87	2022-03-04 12:18:08	2022-03-04 12:18:08	f
284	39	214	89	2022-03-04 12:18:08	2022-03-04 12:18:08	f
217	39	234	19	2022-03-04 12:18:08	2022-03-04 12:18:08	f
306	39	214	111	2022-03-04 12:18:08	2022-03-04 12:18:08	f
287	39	214	92	2022-03-04 12:18:08	2022-03-04 12:18:08	f
242	39	234	45	2022-03-04 12:18:08	2022-03-04 12:18:08	f
307	39	213	112	2022-03-04 12:18:08	2022-03-04 12:18:08	f
244	39	213	49	2022-03-04 12:18:08	2022-03-04 12:18:08	f
309	39	213	114	2022-03-04 12:18:08	2022-03-04 12:18:08	f
308	39	213	113	2022-03-04 12:18:08	2022-03-04 12:18:08	f
318	39	234	125	2022-03-04 12:18:08	2022-03-04 12:18:08	f
314	39	213	121	2022-03-04 12:18:08	2022-03-04 12:18:08	f
313	39	213	120	2022-03-04 12:18:08	2022-03-04 12:18:08	f
315	39	213	122	2022-03-04 12:18:08	2022-03-04 12:18:08	f
316	39	213	123	2022-03-04 12:18:08	2022-03-04 12:18:08	f
317	39	213	124	2022-03-04 12:18:08	2022-03-04 12:18:08	f
288	39	322	93	2022-03-04 12:18:08	2022-03-04 12:18:08	f
319	39	213	127	2022-03-04 12:18:08	2022-03-04 12:18:08	f
320	39	213	128	2022-03-04 12:18:08	2022-03-04 12:18:08	f
286	39	214	91	2022-03-04 12:18:08	2022-03-04 12:18:08	f
285	39	214	90	2022-03-04 12:18:08	2022-03-04 12:18:08	f
311	39	322	116	2022-03-04 12:18:08	2022-03-04 12:18:08	f
289	39	214	94	2022-03-04 12:18:08	2022-03-04 12:18:08	f
291	39	214	96	2022-03-04 12:18:08	2022-03-04 12:18:08	f
292	39	214	97	2022-03-04 12:18:08	2022-03-04 12:18:08	f
294	39	214	99	2022-03-04 12:18:08	2022-03-04 12:18:08	f
297	39	214	102	2022-03-04 12:18:08	2022-03-04 12:18:08	f
298	39	214	103	2022-03-04 12:18:08	2022-03-04 12:18:08	f
303	39	214	108	2022-03-04 12:18:08	2022-03-04 12:18:08	f
304	39	214	109	2022-03-04 12:18:08	2022-03-04 12:18:08	f
249	39	234	54	2022-03-04 12:18:08	2022-03-04 12:18:08	f
251	39	215	56	2022-03-04 12:18:08	2022-03-04 12:18:08	f
252	39	215	57	2022-03-04 12:18:08	2022-03-04 12:18:08	f
253	39	215	58	2022-03-04 12:18:08	2022-03-04 12:18:08	f
254	39	215	59	2022-03-04 12:18:08	2022-03-04 12:18:08	f
255	39	215	60	2022-03-04 12:18:08	2022-03-04 12:18:08	f
236	39	216	39	2022-03-04 12:18:08	2022-03-04 12:18:08	f
273	39	216	78	2022-03-04 12:18:08	2022-03-04 12:18:08	f
278	39	229	83	2022-03-04 12:18:08	2022-03-04 12:18:08	f
248	39	234	53	2022-03-04 12:18:08	2022-03-04 12:18:08	f
312	39	322	119	2022-03-04 12:18:08	2022-03-04 12:18:08	f
258	39	469	63	2022-03-04 12:18:08	2022-03-04 12:18:08	f
247	39	210	2	2022-03-04 12:18:08	2022-03-04 12:18:08	f
324	39	210	4	2022-03-04 12:18:08	2022-03-04 12:18:08	f
363	39	229	184	2022-03-04 12:18:08	2022-03-04 12:18:08	f
432	39	218	1	2022-03-04 12:18:08	2022-03-04 12:18:08	f
338	39	217	149	2022-03-04 12:18:08	2022-03-04 12:18:08	f
327	39	210	6	2022-03-04 12:18:08	2022-03-04 12:18:08	f
325	39	212	135	2022-03-04 12:18:08	2022-03-04 12:18:08	f
369	39	229	190	2022-03-04 12:18:08	2022-03-04 12:18:08	f
339	39	234	150	2022-03-04 12:18:08	2022-03-04 12:18:08	f
334	39	322	144	2022-03-04 12:18:08	2022-03-04 12:18:08	f
336	39	214	146	2022-03-04 12:18:08	2022-03-04 12:18:08	f
343	39	234	155	2022-03-04 12:18:08	2022-03-04 12:18:08	f
345	39	234	158	2022-03-04 12:18:08	2022-03-04 12:18:08	f
341	39	217	153	2022-03-04 12:18:08	2022-03-04 12:18:08	f
342	39	217	154	2022-03-04 12:18:08	2022-03-04 12:18:08	f
344	39	217	157	2022-03-04 12:18:08	2022-03-04 12:18:08	f
350	39	234	163	2022-03-04 12:18:08	2022-03-04 12:18:08	f
346	39	217	159	2022-03-04 12:18:08	2022-03-04 12:18:08	f
347	39	217	160	2022-03-04 12:18:08	2022-03-04 12:18:08	f
349	39	217	162	2022-03-04 12:18:08	2022-03-04 12:18:08	f
351	39	234	164	2022-03-04 12:18:08	2022-03-04 12:18:08	f
210	39	-1	5	2022-03-04 12:18:08	2022-03-04 12:18:08	f
218	39	-1	6	2022-03-04 12:18:08	2022-03-04 12:18:08	f
219	39	-1	7	2022-03-04 12:18:08	2022-03-04 12:18:08	f
216	39	-1	10	2022-03-04 12:18:08	2022-03-04 12:18:08	f
220	39	-1	11	2022-03-04 12:18:08	2022-03-04 12:18:08	f
221	39	-1	12	2022-03-04 12:18:08	2022-03-04 12:18:08	f
224	39	-1	15	2022-03-04 12:18:08	2022-03-04 12:18:08	f
225	39	-1	16	2022-03-04 12:18:08	2022-03-04 12:18:08	f
226	39	-1	17	2022-03-04 12:18:08	2022-03-04 12:18:08	f
227	39	-1	18	2022-03-04 12:18:08	2022-03-04 12:18:08	f
228	39	-1	19	2022-03-04 12:18:08	2022-03-04 12:18:08	f
229	39	-1	20	2022-03-04 12:18:08	2022-03-04 12:18:08	f
230	39	-1	21	2022-03-04 12:18:08	2022-03-04 12:18:08	f
231	39	-1	22	2022-03-04 12:18:08	2022-03-04 12:18:08	f
232	39	-1	23	2022-03-04 12:18:08	2022-03-04 12:18:08	f
215	39	-1	4	2022-03-04 12:18:08	2022-03-04 12:18:08	f
233	39	-1	24	2022-03-04 12:18:08	2022-03-04 12:18:08	f
234	39	-1	25	2022-03-04 12:18:08	2022-03-04 12:18:08	f
235	39	-1	26	2022-03-04 12:18:08	2022-03-04 12:18:08	f
239	39	-1	27	2022-03-04 12:18:08	2022-03-04 12:18:08	f
240	39	-1	28	2022-03-04 12:18:08	2022-03-04 12:18:08	f
243	39	-1	29	2022-03-04 12:18:08	2022-03-04 12:18:08	f
245	39	-1	30	2022-03-04 12:18:08	2022-03-04 12:18:08	f
274	39	-1	32	2022-03-04 12:18:08	2022-03-04 12:18:08	f
300	39	-1	33	2022-03-04 12:18:08	2022-03-04 12:18:08	f
310	39	-1	35	2022-03-04 12:18:08	2022-03-04 12:18:08	f
321	39	-1	36	2022-03-04 12:18:08	2022-03-04 12:18:08	f
322	39	-1	37	2022-03-04 12:18:08	2022-03-04 12:18:08	f
238	39	-1	55	2022-03-04 12:18:08	2022-03-04 12:18:08	f
213	39	-1	2	2022-03-04 12:18:08	2022-03-04 12:18:08	f
214	39	-1	3	2022-03-04 12:18:08	2022-03-04 12:18:08	f
374	39	234	195	2022-03-04 12:18:08	2022-03-04 12:18:08	f
439	39	218	5	2022-03-04 12:18:08	2022-03-04 12:18:08	f
437	39	218	4	2022-03-04 12:18:08	2022-03-04 12:18:08	f
440	39	218	6	2022-03-04 12:18:08	2022-03-04 12:18:08	f
441	39	218	7	2022-03-04 12:18:08	2022-03-04 12:18:08	f
435	39	218	10	2022-03-04 12:18:08	2022-03-04 12:18:08	f
438	39	218	8	2022-03-04 12:18:08	2022-03-04 12:18:08	f
436	39	218	9	2022-03-04 12:18:08	2022-03-04 12:18:08	f
434	39	218	2	2022-03-04 12:18:08	2022-03-04 12:18:08	f
433	39	218	3	2022-03-04 12:18:08	2022-03-04 12:18:08	f
354	39	216	174	2022-03-04 12:18:08	2022-03-04 12:18:08	f
390	39	216	211	2022-03-04 12:18:08	2022-03-04 12:18:08	f
391	39	216	213	2022-03-04 12:18:08	2022-03-04 12:18:08	f
393	39	216	215	2022-03-04 12:18:08	2022-03-04 12:18:08	f
394	39	216	216	2022-03-04 12:18:08	2022-03-04 12:18:08	f
395	39	216	217	2022-03-04 12:18:08	2022-03-04 12:18:08	f
396	39	216	218	2022-03-04 12:18:08	2022-03-04 12:18:08	f
397	39	216	219	2022-03-04 12:18:08	2022-03-04 12:18:08	f
398	39	216	220	2022-03-04 12:18:08	2022-03-04 12:18:08	f
399	39	216	221	2022-03-04 12:18:08	2022-03-04 12:18:08	f
400	39	216	222	2022-03-04 12:18:08	2022-03-04 12:18:08	f
419	39	219	241	2022-03-04 12:18:08	2022-03-04 12:18:08	f
402	39	216	224	2022-03-04 12:18:08	2022-03-04 12:18:08	f
403	39	216	225	2022-03-04 12:18:08	2022-03-04 12:18:08	f
404	39	216	226	2022-03-04 12:18:08	2022-03-04 12:18:08	f
405	39	216	227	2022-03-04 12:18:08	2022-03-04 12:18:08	f
406	39	216	228	2022-03-04 12:18:08	2022-03-04 12:18:08	f
407	39	216	229	2022-03-04 12:18:08	2022-03-04 12:18:08	f
408	39	216	230	2022-03-04 12:18:08	2022-03-04 12:18:08	f
410	39	216	232	2022-03-04 12:18:08	2022-03-04 12:18:08	f
411	39	216	233	2022-03-04 12:18:08	2022-03-04 12:18:08	f
412	39	216	234	2022-03-04 12:18:08	2022-03-04 12:18:08	f
413	39	216	235	2022-03-04 12:18:08	2022-03-04 12:18:08	f
414	39	216	236	2022-03-04 12:18:08	2022-03-04 12:18:08	f
415	39	216	237	2022-03-04 12:18:08	2022-03-04 12:18:08	f
416	39	216	238	2022-03-04 12:18:08	2022-03-04 12:18:08	f
417	39	216	239	2022-03-04 12:18:08	2022-03-04 12:18:08	f
418	39	216	240	2022-03-04 12:18:08	2022-03-04 12:18:08	f
424	39	219	246	2022-03-04 12:18:08	2022-03-04 12:18:08	f
328	39	322	138	2022-03-04 12:18:08	2022-03-04 12:18:08	f
421	39	216	243	2022-03-04 12:18:08	2022-03-04 12:18:08	f
427	39	219	249	2022-03-04 12:18:08	2022-03-04 12:18:08	f
423	39	216	245	2022-03-04 12:18:08	2022-03-04 12:18:08	f
401	39	219	223	2022-03-04 12:18:08	2022-03-04 12:18:08	f
425	39	219	247	2022-03-04 12:18:08	2022-03-04 12:18:08	f
428	39	219	250	2022-03-04 12:18:08	2022-03-04 12:18:08	f
429	39	219	251	2022-03-04 12:18:08	2022-03-04 12:18:08	f
430	39	219	252	2022-03-04 12:18:08	2022-03-04 12:18:08	f
431	39	219	253	2022-03-04 12:18:08	2022-03-04 12:18:08	f
371	39	227	192	2022-03-04 12:18:08	2022-03-04 12:18:08	f
372	39	227	193	2022-03-04 12:18:08	2022-03-04 12:18:08	f
358	39	229	179	2022-03-04 12:18:08	2022-03-04 12:18:08	f
360	39	229	181	2022-03-04 12:18:08	2022-03-04 12:18:08	f
359	39	229	180	2022-03-04 12:18:08	2022-03-04 12:18:08	f
364	39	229	185	2022-03-04 12:18:08	2022-03-04 12:18:08	f
365	39	229	186	2022-03-04 12:18:08	2022-03-04 12:18:08	f
366	39	229	187	2022-03-04 12:18:08	2022-03-04 12:18:08	f
367	39	229	188	2022-03-04 12:18:08	2022-03-04 12:18:08	f
368	39	229	189	2022-03-04 12:18:08	2022-03-04 12:18:08	f
370	39	229	191	2022-03-04 12:18:08	2022-03-04 12:18:08	f
331	39	322	141	2022-03-04 12:18:08	2022-03-04 12:18:08	f
340	39	234	152	2022-03-04 12:18:08	2022-03-04 12:18:08	f
375	39	234	196	2022-03-04 12:18:08	2022-03-04 12:18:08	f
376	39	234	197	2022-03-04 12:18:08	2022-03-04 12:18:08	f
377	39	234	198	2022-03-04 12:18:08	2022-03-04 12:18:08	f
378	39	234	199	2022-03-04 12:18:08	2022-03-04 12:18:08	f
379	39	234	200	2022-03-04 12:18:08	2022-03-04 12:18:08	f
380	39	234	201	2022-03-04 12:18:08	2022-03-04 12:18:08	f
381	39	234	202	2022-03-04 12:18:08	2022-03-04 12:18:08	f
382	39	234	203	2022-03-04 12:18:08	2022-03-04 12:18:08	f
383	39	234	204	2022-03-04 12:18:08	2022-03-04 12:18:08	f
384	39	234	205	2022-03-04 12:18:08	2022-03-04 12:18:08	f
385	39	234	206	2022-03-04 12:18:08	2022-03-04 12:18:08	f
386	39	234	207	2022-03-04 12:18:08	2022-03-04 12:18:08	f
387	39	234	208	2022-03-04 12:18:08	2022-03-04 12:18:08	f
388	39	234	209	2022-03-04 12:18:08	2022-03-04 12:18:08	f
389	39	234	210	2022-03-04 12:18:08	2022-03-04 12:18:08	f
329	39	322	139	2022-03-04 12:18:08	2022-03-04 12:18:08	f
330	39	322	140	2022-03-04 12:18:08	2022-03-04 12:18:08	f
332	39	322	142	2022-03-04 12:18:08	2022-03-04 12:18:08	f
335	39	322	145	2022-03-04 12:18:08	2022-03-04 12:18:08	f
337	39	210	1	2022-03-04 12:18:08	2022-03-04 12:18:08	f
562	39	214	394	2022-03-04 12:18:08	2022-03-04 12:18:08	f
538	39	210	13	2022-03-04 12:18:08	2022-03-04 12:18:08	f
539	39	210	14	2022-03-04 12:18:08	2022-03-04 12:18:08	f
545	39	234	375	2022-03-04 12:18:08	2022-03-04 12:18:08	f
540	39	210	15	2022-03-04 12:18:08	2022-03-04 12:18:08	f
541	39	210	16	2022-03-04 12:18:08	2022-03-04 12:18:08	f
555	39	210	17	2022-03-04 12:18:08	2022-03-04 12:18:08	f
559	39	210	18	2022-03-04 12:18:08	2022-03-04 12:18:08	f
561	39	210	19	2022-03-04 12:18:08	2022-03-04 12:18:08	f
532	39	210	8	2022-03-04 12:18:08	2022-03-04 12:18:08	f
535	39	210	10	2022-03-04 12:18:08	2022-03-04 12:18:08	f
536	39	210	11	2022-03-04 12:18:08	2022-03-04 12:18:08	f
453	39	230	276	2022-03-04 12:18:08	2022-03-04 12:18:08	f
458	39	230	281	2022-03-04 12:18:08	2022-03-04 12:18:08	f
356	39	-1	41	2022-03-04 12:18:08	2022-03-04 12:18:08	f
357	39	-1	42	2022-03-04 12:18:08	2022-03-04 12:18:08	f
361	39	-1	43	2022-03-04 12:18:08	2022-03-04 12:18:08	f
362	39	-1	44	2022-03-04 12:18:08	2022-03-04 12:18:08	f
373	39	-1	45	2022-03-04 12:18:08	2022-03-04 12:18:08	f
422	39	-1	46	2022-03-04 12:18:08	2022-03-04 12:18:08	f
442	39	-1	47	2022-03-04 12:18:08	2022-03-04 12:18:08	f
353	39	-1	39	2022-03-04 12:18:08	2022-03-04 12:18:08	f
355	39	-1	40	2022-03-04 12:18:08	2022-03-04 12:18:08	f
473	39	469	296	2022-03-04 12:18:08	2022-03-04 12:18:08	f
478	39	212	301	2022-03-04 12:18:08	2022-03-04 12:18:08	f
528	39	231	356	2022-03-04 12:18:08	2022-03-04 12:18:08	f
482	39	212	307	2022-03-04 12:18:08	2022-03-04 12:18:08	f
481	39	212	306	2022-03-04 12:18:08	2022-03-04 12:18:08	f
486	39	213	311	2022-03-04 12:18:08	2022-03-04 12:18:08	f
483	39	212	308	2022-03-04 12:18:08	2022-03-04 12:18:08	f
484	39	213	309	2022-03-04 12:18:08	2022-03-04 12:18:08	f
487	39	213	313	2022-03-04 12:18:08	2022-03-04 12:18:08	f
488	39	213	314	2022-03-04 12:18:08	2022-03-04 12:18:08	f
489	39	213	315	2022-03-04 12:18:08	2022-03-04 12:18:08	f
554	39	213	385	2022-03-04 12:18:08	2022-03-04 12:18:08	f
560	39	213	392	2022-03-04 12:18:08	2022-03-04 12:18:08	f
457	39	230	280	2022-03-04 12:18:08	2022-03-04 12:18:08	f
477	39	469	300	2022-03-04 12:18:08	2022-03-04 12:18:08	f
452	39	230	275	2022-03-04 12:18:08	2022-03-04 12:18:08	f
446	39	220	269	2022-03-04 12:18:08	2022-03-04 12:18:08	f
447	39	220	270	2022-03-04 12:18:08	2022-03-04 12:18:08	f
449	39	220	272	2022-03-04 12:18:08	2022-03-04 12:18:08	f
450	39	220	273	2022-03-04 12:18:08	2022-03-04 12:18:08	f
524	39	221	352	2022-03-04 12:18:08	2022-03-04 12:18:08	f
525	39	221	353	2022-03-04 12:18:08	2022-03-04 12:18:08	f
526	39	221	354	2022-03-04 12:18:08	2022-03-04 12:18:08	f
529	39	231	357	2022-03-04 12:18:08	2022-03-04 12:18:08	f
527	39	221	355	2022-03-04 12:18:08	2022-03-04 12:18:08	f
496	39	223	322	2022-03-04 12:18:08	2022-03-04 12:18:08	f
497	39	223	323	2022-03-04 12:18:08	2022-03-04 12:18:08	f
498	39	223	324	2022-03-04 12:18:08	2022-03-04 12:18:08	f
499	39	223	325	2022-03-04 12:18:08	2022-03-04 12:18:08	f
500	39	223	326	2022-03-04 12:18:08	2022-03-04 12:18:08	f
501	39	223	327	2022-03-04 12:18:08	2022-03-04 12:18:08	f
502	39	223	328	2022-03-04 12:18:08	2022-03-04 12:18:08	f
505	39	223	331	2022-03-04 12:18:08	2022-03-04 12:18:08	f
506	39	223	332	2022-03-04 12:18:08	2022-03-04 12:18:08	f
507	39	223	333	2022-03-04 12:18:08	2022-03-04 12:18:08	f
508	39	223	335	2022-03-04 12:18:08	2022-03-04 12:18:08	f
509	39	223	336	2022-03-04 12:18:08	2022-03-04 12:18:08	f
510	39	223	337	2022-03-04 12:18:08	2022-03-04 12:18:08	f
511	39	223	338	2022-03-04 12:18:08	2022-03-04 12:18:08	f
514	39	223	341	2022-03-04 12:18:08	2022-03-04 12:18:08	f
512	39	223	339	2022-03-04 12:18:08	2022-03-04 12:18:08	f
513	39	223	340	2022-03-04 12:18:08	2022-03-04 12:18:08	f
515	39	223	342	2022-03-04 12:18:08	2022-03-04 12:18:08	f
516	39	223	343	2022-03-04 12:18:08	2022-03-04 12:18:08	f
517	39	223	345	2022-03-04 12:18:08	2022-03-04 12:18:08	f
518	39	223	346	2022-03-04 12:18:08	2022-03-04 12:18:08	f
519	39	223	347	2022-03-04 12:18:08	2022-03-04 12:18:08	f
520	39	223	348	2022-03-04 12:18:08	2022-03-04 12:18:08	f
521	39	223	349	2022-03-04 12:18:08	2022-03-04 12:18:08	f
522	39	223	350	2022-03-04 12:18:08	2022-03-04 12:18:08	f
490	39	224	316	2022-03-04 12:18:08	2022-03-04 12:18:08	f
491	39	224	317	2022-03-04 12:18:08	2022-03-04 12:18:08	f
492	39	224	318	2022-03-04 12:18:08	2022-03-04 12:18:08	f
493	39	224	319	2022-03-04 12:18:08	2022-03-04 12:18:08	f
494	39	224	320	2022-03-04 12:18:08	2022-03-04 12:18:08	f
495	39	224	321	2022-03-04 12:18:08	2022-03-04 12:18:08	f
451	39	230	274	2022-03-04 12:18:08	2022-03-04 12:18:08	f
454	39	230	277	2022-03-04 12:18:08	2022-03-04 12:18:08	f
455	39	230	278	2022-03-04 12:18:08	2022-03-04 12:18:08	f
456	39	230	279	2022-03-04 12:18:08	2022-03-04 12:18:08	f
460	39	230	283	2022-03-04 12:18:08	2022-03-04 12:18:08	f
461	39	230	284	2022-03-04 12:18:08	2022-03-04 12:18:08	f
463	39	230	286	2022-03-04 12:18:08	2022-03-04 12:18:08	f
462	39	230	285	2022-03-04 12:18:08	2022-03-04 12:18:08	f
465	39	230	288	2022-03-04 12:18:08	2022-03-04 12:18:08	f
470	39	469	293	2022-03-04 12:18:08	2022-03-04 12:18:08	f
468	39	230	291	2022-03-04 12:18:08	2022-03-04 12:18:08	f
480	39	230	305	2022-03-04 12:18:08	2022-03-04 12:18:08	f
471	39	469	294	2022-03-04 12:18:08	2022-03-04 12:18:08	f
534	39	234	363	2022-03-04 12:18:08	2022-03-04 12:18:08	f
547	39	234	377	2022-03-04 12:18:08	2022-03-04 12:18:08	f
549	39	234	379	2022-03-04 12:18:08	2022-03-04 12:18:08	f
466	39	469	289	2022-03-04 12:18:08	2022-03-04 12:18:08	f
472	39	469	295	2022-03-04 12:18:08	2022-03-04 12:18:08	f
474	39	469	297	2022-03-04 12:18:08	2022-03-04 12:18:08	f
475	39	469	298	2022-03-04 12:18:08	2022-03-04 12:18:08	f
476	39	469	299	2022-03-04 12:18:08	2022-03-04 12:18:08	f
537	39	210	12	2022-03-04 12:18:08	2022-03-04 12:18:08	f
569	39	214	401	2022-03-04 12:18:08	2022-03-04 12:18:08	f
572	39	210	26	2022-03-04 12:18:08	2022-03-04 12:18:08	f
578	39	210	27	2022-03-04 12:18:08	2022-03-04 12:18:08	f
574	39	230	406	2022-03-04 12:18:08	2022-03-04 12:18:08	f
579	39	210	28	2022-03-04 12:18:08	2022-03-04 12:18:08	f
573	39	230	405	2022-03-04 12:18:08	2022-03-04 12:18:08	f
580	39	210	29	2022-03-04 12:18:08	2022-03-04 12:18:08	f
582	39	210	30	2022-03-04 12:18:08	2022-03-04 12:18:08	f
622	39	443	458	2022-03-04 12:18:08	2022-03-04 12:18:08	f
565	39	210	21	2022-03-04 12:18:08	2022-03-04 12:18:08	f
469	39	-1	52	2022-03-04 12:18:08	2022-03-04 12:18:08	f
485	39	-1	53	2022-03-04 12:18:08	2022-03-04 12:18:08	f
530	39	-1	56	2022-03-04 12:18:08	2022-03-04 12:18:08	f
531	39	-1	57	2022-03-04 12:18:08	2022-03-04 12:18:08	f
542	39	-1	58	2022-03-04 12:18:08	2022-03-04 12:18:08	f
543	39	-1	59	2022-03-04 12:18:08	2022-03-04 12:18:08	f
544	39	-1	60	2022-03-04 12:18:08	2022-03-04 12:18:08	f
548	39	-1	62	2022-03-04 12:18:08	2022-03-04 12:18:08	f
550	39	-1	63	2022-03-04 12:18:08	2022-03-04 12:18:08	f
551	39	-1	64	2022-03-04 12:18:08	2022-03-04 12:18:08	f
552	39	-1	65	2022-03-04 12:18:08	2022-03-04 12:18:08	f
553	39	-1	66	2022-03-04 12:18:08	2022-03-04 12:18:08	f
556	39	-1	67	2022-03-04 12:18:08	2022-03-04 12:18:08	f
557	39	-1	68	2022-03-04 12:18:08	2022-03-04 12:18:08	f
558	39	-1	69	2022-03-04 12:18:08	2022-03-04 12:18:08	f
445	39	-1	50	2022-03-04 12:18:08	2022-03-04 12:18:08	f
459	39	-1	51	2022-03-04 12:18:08	2022-03-04 12:18:08	f
567	39	210	23	2022-03-04 12:18:08	2022-03-04 12:18:08	f
667	39	234	506	2022-03-04 12:18:08	2022-03-04 12:18:08	f
583	39	210	416	2022-03-04 12:18:08	2022-03-04 12:18:08	f
568	39	210	24	2022-03-04 12:18:08	2022-03-04 12:18:08	f
584	39	210	417	2022-03-04 12:18:08	2022-03-04 12:18:08	f
676	39	232	515	2022-03-04 12:18:08	2022-03-04 12:18:08	f
575	39	212	407	2022-03-04 12:18:08	2022-03-04 12:18:08	f
577	39	212	409	2022-03-04 12:18:08	2022-03-04 12:18:08	f
564	39	214	396	2022-03-04 12:18:08	2022-03-04 12:18:08	f
624	39	443	460	2022-03-04 12:18:08	2022-03-04 12:18:08	f
678	39	232	517	2022-03-04 12:18:08	2022-03-04 12:18:08	f
633	39	445	469	2022-03-04 12:18:08	2022-03-04 12:18:08	f
619	39	443	455	2022-03-04 12:18:08	2022-03-04 12:18:08	f
654	39	222	493	2022-03-04 12:18:08	2022-03-04 12:18:08	f
655	39	222	494	2022-03-04 12:18:08	2022-03-04 12:18:08	f
657	39	222	496	2022-03-04 12:18:08	2022-03-04 12:18:08	f
673	39	542	512	2022-03-04 12:18:08	2022-03-04 12:18:08	f
658	39	225	497	2022-03-04 12:18:08	2022-03-04 12:18:08	f
659	39	225	498	2022-03-04 12:18:08	2022-03-04 12:18:08	f
660	39	225	499	2022-03-04 12:18:08	2022-03-04 12:18:08	f
661	39	225	500	2022-03-04 12:18:08	2022-03-04 12:18:08	f
662	39	225	501	2022-03-04 12:18:08	2022-03-04 12:18:08	f
663	39	225	502	2022-03-04 12:18:08	2022-03-04 12:18:08	f
641	39	226	478	2022-03-04 12:18:08	2022-03-04 12:18:08	f
642	39	226	479	2022-03-04 12:18:08	2022-03-04 12:18:08	f
643	39	226	480	2022-03-04 12:18:08	2022-03-04 12:18:08	f
644	39	226	481	2022-03-04 12:18:08	2022-03-04 12:18:08	f
645	39	226	482	2022-03-04 12:18:08	2022-03-04 12:18:08	f
646	39	226	483	2022-03-04 12:18:08	2022-03-04 12:18:08	f
647	39	226	484	2022-03-04 12:18:08	2022-03-04 12:18:08	f
648	39	226	485	2022-03-04 12:18:08	2022-03-04 12:18:08	f
649	39	226	486	2022-03-04 12:18:08	2022-03-04 12:18:08	f
650	39	226	487	2022-03-04 12:18:08	2022-03-04 12:18:08	f
651	39	226	488	2022-03-04 12:18:08	2022-03-04 12:18:08	f
652	39	226	489	2022-03-04 12:18:08	2022-03-04 12:18:08	f
665	39	228	504	2022-03-04 12:18:08	2022-03-04 12:18:08	f
666	39	228	505	2022-03-04 12:18:08	2022-03-04 12:18:08	f
605	39	274	441	2022-03-04 12:18:08	2022-03-04 12:18:08	f
668	39	228	507	2022-03-04 12:18:08	2022-03-04 12:18:08	f
670	39	228	509	2022-03-04 12:18:08	2022-03-04 12:18:08	f
570	39	230	402	2022-03-04 12:18:08	2022-03-04 12:18:08	f
677	39	232	516	2022-03-04 12:18:08	2022-03-04 12:18:08	f
679	39	232	518	2022-03-04 12:18:08	2022-03-04 12:18:08	f
680	39	232	519	2022-03-04 12:18:08	2022-03-04 12:18:08	f
681	39	232	520	2022-03-04 12:18:08	2022-03-04 12:18:08	f
581	39	234	414	2022-03-04 12:18:08	2022-03-04 12:18:08	f
606	39	274	442	2022-03-04 12:18:08	2022-03-04 12:18:08	f
607	39	274	443	2022-03-04 12:18:08	2022-03-04 12:18:08	f
608	39	274	444	2022-03-04 12:18:08	2022-03-04 12:18:08	f
609	39	274	445	2022-03-04 12:18:08	2022-03-04 12:18:08	f
610	39	274	446	2022-03-04 12:18:08	2022-03-04 12:18:08	f
611	39	274	447	2022-03-04 12:18:08	2022-03-04 12:18:08	f
612	39	274	448	2022-03-04 12:18:08	2022-03-04 12:18:08	f
613	39	274	449	2022-03-04 12:18:08	2022-03-04 12:18:08	f
614	39	274	450	2022-03-04 12:18:08	2022-03-04 12:18:08	f
595	39	357	431	2022-03-04 12:18:08	2022-03-04 12:18:08	f
596	39	357	432	2022-03-04 12:18:08	2022-03-04 12:18:08	f
597	39	357	433	2022-03-04 12:18:08	2022-03-04 12:18:08	f
598	39	357	434	2022-03-04 12:18:08	2022-03-04 12:18:08	f
599	39	357	435	2022-03-04 12:18:08	2022-03-04 12:18:08	f
600	39	357	436	2022-03-04 12:18:08	2022-03-04 12:18:08	f
601	39	357	437	2022-03-04 12:18:08	2022-03-04 12:18:08	f
602	39	357	438	2022-03-04 12:18:08	2022-03-04 12:18:08	f
603	39	357	439	2022-03-04 12:18:08	2022-03-04 12:18:08	f
604	39	357	440	2022-03-04 12:18:08	2022-03-04 12:18:08	f
585	39	422	418	2022-03-04 12:18:08	2022-03-04 12:18:08	f
586	39	422	419	2022-03-04 12:18:08	2022-03-04 12:18:08	f
587	39	422	421	2022-03-04 12:18:08	2022-03-04 12:18:08	f
588	39	422	423	2022-03-04 12:18:08	2022-03-04 12:18:08	f
591	39	422	427	2022-03-04 12:18:08	2022-03-04 12:18:08	f
589	39	422	424	2022-03-04 12:18:08	2022-03-04 12:18:08	f
592	39	422	428	2022-03-04 12:18:08	2022-03-04 12:18:08	f
593	39	422	429	2022-03-04 12:18:08	2022-03-04 12:18:08	f
638	39	445	2	2022-03-04 12:18:08	2022-03-04 12:18:08	f
618	39	444	454	2022-03-04 12:18:08	2022-03-04 12:18:08	f
617	39	443	453	2022-03-04 12:18:08	2022-03-04 12:18:08	f
620	39	443	456	2022-03-04 12:18:08	2022-03-04 12:18:08	f
621	39	443	457	2022-03-04 12:18:08	2022-03-04 12:18:08	f
623	39	443	459	2022-03-04 12:18:08	2022-03-04 12:18:08	f
616	39	444	452	2022-03-04 12:18:08	2022-03-04 12:18:08	f
634	39	445	470	2022-03-04 12:18:08	2022-03-04 12:18:08	f
635	39	445	471	2022-03-04 12:18:08	2022-03-04 12:18:08	f
637	39	445	474	2022-03-04 12:18:08	2022-03-04 12:18:08	f
636	39	445	1	2022-03-04 12:18:08	2022-03-04 12:18:08	f
640	39	445	477	2022-03-04 12:18:08	2022-03-04 12:18:08	f
626	39	530	462	2022-03-04 12:18:08	2022-03-04 12:18:08	f
628	39	530	464	2022-03-04 12:18:08	2022-03-04 12:18:08	f
629	66	-1	1	2022-02-23 00:00:00	2022-03-07 00:00:00	f
630	39	530	466	2022-03-04 12:18:08	2022-03-04 12:18:08	f
631	39	530	467	2022-03-04 12:18:08	2022-03-04 12:18:08	f
625	39	530	461	2022-03-04 12:18:08	2022-03-04 12:18:08	f
682	39	531	521	2022-03-04 12:18:08	2022-03-04 12:18:08	f
653	39	531	492	2022-03-04 12:18:08	2022-03-04 12:18:08	f
674	39	542	513	2022-03-04 12:18:08	2022-03-04 12:18:08	f
675	39	542	514	2022-03-04 12:18:08	2022-03-04 12:18:08	f
639	39	445	3	2022-03-04 12:18:08	2022-03-04 12:18:08	f
571	39	210	25	2022-03-04 12:18:08	2022-03-04 12:18:08	f
211	1	-1	-1	2022-03-04 12:18:08	2022-03-04 12:18:08	f
323	39	210	3	2022-03-04 12:18:08	2022-03-04 12:18:08	f
326	39	210	5	2022-03-04 12:18:08	2022-03-04 12:18:08	f
264	39	212	69	2022-03-04 12:18:08	2022-03-04 12:18:08	f
268	39	212	73	2022-03-04 12:18:08	2022-03-04 12:18:08	f
671	39	-1	73	2022-03-04 12:18:08	2022-03-04 12:18:08	f
672	39	-1	74	2022-03-04 12:18:08	2022-03-04 12:18:08	f
632	39	-1	71	2022-03-04 12:18:08	2022-03-04 12:18:08	f
656	39	-1	72	2022-03-04 12:18:08	2022-03-04 12:18:08	f
576	39	212	408	2022-03-04 12:18:08	2022-03-04 12:18:08	f
773	1	-1	-1	2022-03-07 13:00:42	2022-03-07 13:00:42	f
271	39	214	76	2022-03-04 12:18:08	2022-03-04 12:18:08	f
305	39	214	110	2022-03-04 12:18:08	2022-03-04 12:18:08	f
775	38	609	-1	2022-03-07 13:09:09	2022-03-07 13:09:09	f
256	39	215	61	2022-03-04 12:18:08	2022-03-04 12:18:08	f
699	39	235	538	2022-03-04 12:18:08	2022-03-04 12:18:08	f
348	39	217	161	2022-03-04 12:18:08	2022-03-04 12:18:08	f
392	39	216	214	2022-03-04 12:18:08	2022-03-04 12:18:08	f
409	39	216	231	2022-03-04 12:18:08	2022-03-04 12:18:08	f
697	39	531	536	2022-03-04 12:18:08	2022-03-04 12:18:08	f
725	39	422	564	2022-03-04 12:18:08	2022-03-04 12:18:08	f
728	39	422	567	2022-03-04 12:18:08	2022-03-04 12:18:08	f
729	39	422	568	2022-03-04 12:18:08	2022-03-04 12:18:08	f
731	39	422	570	2022-03-04 12:18:08	2022-03-04 12:18:08	f
733	39	422	572	2022-03-04 12:18:08	2022-03-04 12:18:08	f
734	39	422	573	2022-03-04 12:18:08	2022-03-04 12:18:08	f
739	39	444	578	2022-03-04 12:18:08	2022-03-04 12:18:08	f
742	39	444	581	2022-03-04 12:18:08	2022-03-04 12:18:08	f
448	39	220	271	2022-03-04 12:18:08	2022-03-04 12:18:08	f
762	39	776	602	2022-03-04 12:18:08	2022-03-04 12:18:08	f
767	39	776	607	2022-03-04 12:18:08	2022-03-04 12:18:08	f
769	39	776	610	2022-03-04 12:18:08	2022-03-04 12:18:08	f
770	39	776	612	2022-03-04 12:18:08	2022-03-04 12:18:08	f
771	39	776	614	2022-03-04 12:18:08	2022-03-04 12:18:08	f
772	39	776	615	2022-03-04 12:18:08	2022-03-04 12:18:08	f
723	39	422	562	2022-03-04 12:18:08	2022-03-04 12:18:08	f
708	39	233	547	2022-03-04 12:18:08	2022-03-04 12:18:08	f
756	39	444	596	2022-03-04 12:18:08	2022-03-04 12:18:08	f
503	39	223	329	2022-03-04 12:18:08	2022-03-04 12:18:08	f
523	39	223	351	2022-03-04 12:18:08	2022-03-04 12:18:08	f
664	39	225	503	2022-03-04 12:18:08	2022-03-04 12:18:08	f
669	39	228	508	2022-03-04 12:18:08	2022-03-04 12:18:08	f
464	39	230	287	2022-03-04 12:18:08	2022-03-04 12:18:08	f
467	39	230	290	2022-03-04 12:18:08	2022-03-04 12:18:08	f
707	39	233	546	2022-03-04 12:18:08	2022-03-04 12:18:08	f
709	39	233	548	2022-03-04 12:18:08	2022-03-04 12:18:08	f
710	39	233	549	2022-03-04 12:18:08	2022-03-04 12:18:08	f
711	39	233	550	2022-03-04 12:18:08	2022-03-04 12:18:08	f
712	39	233	551	2022-03-04 12:18:08	2022-03-04 12:18:08	f
713	39	233	552	2022-03-04 12:18:08	2022-03-04 12:18:08	f
715	39	233	554	2022-03-04 12:18:08	2022-03-04 12:18:08	f
714	39	233	553	2022-03-04 12:18:08	2022-03-04 12:18:08	f
716	39	233	555	2022-03-04 12:18:08	2022-03-04 12:18:08	f
717	39	233	556	2022-03-04 12:18:08	2022-03-04 12:18:08	f
719	39	233	558	2022-03-04 12:18:08	2022-03-04 12:18:08	f
720	39	233	559	2022-03-04 12:18:08	2022-03-04 12:18:08	f
721	39	233	560	2022-03-04 12:18:08	2022-03-04 12:18:08	f
479	39	234	304	2022-03-04 12:18:08	2022-03-04 12:18:08	f
700	39	235	539	2022-03-04 12:18:08	2022-03-04 12:18:08	f
701	39	235	540	2022-03-04 12:18:08	2022-03-04 12:18:08	f
702	39	235	541	2022-03-04 12:18:08	2022-03-04 12:18:08	f
703	39	235	542	2022-03-04 12:18:08	2022-03-04 12:18:08	f
704	39	235	543	2022-03-04 12:18:08	2022-03-04 12:18:08	f
705	39	235	544	2022-03-04 12:18:08	2022-03-04 12:18:08	f
706	39	235	545	2022-03-04 12:18:08	2022-03-04 12:18:08	f
759	39	776	599	2022-03-04 12:18:08	2022-03-04 12:18:08	f
755	39	776	595	2022-03-04 12:18:08	2022-03-04 12:18:08	f
757	39	776	597	2022-03-04 12:18:08	2022-03-04 12:18:08	f
758	39	776	598	2022-03-04 12:18:08	2022-03-04 12:18:08	f
760	39	776	600	2022-03-04 12:18:08	2022-03-04 12:18:08	f
764	39	776	604	2022-03-04 12:18:08	2022-03-04 12:18:08	f
763	39	776	603	2022-03-04 12:18:08	2022-03-04 12:18:08	f
765	39	776	605	2022-03-04 12:18:08	2022-03-04 12:18:08	f
766	39	776	606	2022-03-04 12:18:08	2022-03-04 12:18:08	f
768	39	776	608	2022-03-04 12:18:08	2022-03-04 12:18:08	f
724	39	422	563	2022-03-04 12:18:08	2022-03-04 12:18:08	f
727	39	422	566	2022-03-04 12:18:08	2022-03-04 12:18:08	f
730	39	422	569	2022-03-04 12:18:08	2022-03-04 12:18:08	f
732	39	422	571	2022-03-04 12:18:08	2022-03-04 12:18:08	f
735	39	422	574	2022-03-04 12:18:08	2022-03-04 12:18:08	f
426	39	443	248	2022-03-04 12:18:08	2022-03-04 12:18:08	f
737	39	444	576	2022-03-04 12:18:08	2022-03-04 12:18:08	f
736	39	444	575	2022-03-04 12:18:08	2022-03-04 12:18:08	f
738	39	444	577	2022-03-04 12:18:08	2022-03-04 12:18:08	f
740	39	444	579	2022-03-04 12:18:08	2022-03-04 12:18:08	f
743	39	444	582	2022-03-04 12:18:08	2022-03-04 12:18:08	f
744	39	444	583	2022-03-04 12:18:08	2022-03-04 12:18:08	f
745	39	444	584	2022-03-04 12:18:08	2022-03-04 12:18:08	f
746	39	444	585	2022-03-04 12:18:08	2022-03-04 12:18:08	f
747	39	444	586	2022-03-04 12:18:08	2022-03-04 12:18:08	f
748	39	444	587	2022-03-04 12:18:08	2022-03-04 12:18:08	f
749	39	444	588	2022-03-04 12:18:08	2022-03-04 12:18:08	f
750	39	444	589	2022-03-04 12:18:08	2022-03-04 12:18:08	f
751	39	444	590	2022-03-04 12:18:08	2022-03-04 12:18:08	f
752	39	444	591	2022-03-04 12:18:08	2022-03-04 12:18:08	f
753	39	444	593	2022-03-04 12:18:08	2022-03-04 12:18:08	f
754	39	444	594	2022-03-04 12:18:08	2022-03-04 12:18:08	f
683	39	531	522	2022-03-04 12:18:08	2022-03-04 12:18:08	f
684	39	531	523	2022-03-04 12:18:08	2022-03-04 12:18:08	f
685	39	531	524	2022-03-04 12:18:08	2022-03-04 12:18:08	f
686	39	531	525	2022-03-04 12:18:08	2022-03-04 12:18:08	f
687	39	531	526	2022-03-04 12:18:08	2022-03-04 12:18:08	f
689	39	531	528	2022-03-04 12:18:08	2022-03-04 12:18:08	f
690	39	531	529	2022-03-04 12:18:08	2022-03-04 12:18:08	f
691	39	531	530	2022-03-04 12:18:08	2022-03-04 12:18:08	f
693	39	531	532	2022-03-04 12:18:08	2022-03-04 12:18:08	f
694	39	531	533	2022-03-04 12:18:08	2022-03-04 12:18:08	f
695	39	531	534	2022-03-04 12:18:08	2022-03-04 12:18:08	f
696	39	531	535	2022-03-04 12:18:08	2022-03-04 12:18:08	f
698	39	531	537	2022-03-04 12:18:08	2022-03-04 12:18:08	f
692	39	531	531	2022-03-04 12:18:08	2022-03-04 12:18:08	f
774	1	-1	1	2022-02-23 00:00:00	2022-03-07 00:00:00	f
563	39	210	20	2022-03-04 12:18:08	2022-03-04 12:18:08	f
566	39	210	22	2022-03-04 12:18:08	2022-03-04 12:18:08	f
726	39	-1	76	2022-03-04 12:18:08	2022-03-04 12:18:08	f
533	39	210	9	2022-03-04 12:18:08	2022-03-04 12:18:08	f
718	39	233	557	2022-03-04 12:18:08	2022-03-04 12:18:08	f
761	39	776	601	2022-03-04 12:18:08	2022-03-04 12:18:08	f
420	39	274	242	2022-03-04 12:18:08	2022-03-04 12:18:08	f
333	39	322	143	2022-03-04 12:18:08	2022-03-04 12:18:08	f
594	39	357	430	2022-03-04 12:18:08	2022-03-04 12:18:08	f
590	39	422	425	2022-03-04 12:18:08	2022-03-04 12:18:08	f
741	39	444	580	2022-03-04 12:18:08	2022-03-04 12:18:08	f
627	39	530	463	2022-03-04 12:18:08	2022-03-04 12:18:08	f
688	39	531	527	2022-03-04 12:18:08	2022-03-04 12:18:08	f
777	1	-1	-1	2022-03-07 15:25:22	2022-03-07 15:25:22	f
779	38	613	-1	2022-03-10 13:23:26	2022-03-10 13:23:26	f
780	38	613	-1	2022-03-10 13:25:09	2022-03-10 13:25:09	f
781	38	613	-1	2022-03-10 13:28:31	2022-03-10 13:28:31	f
778	1	-1	-1	2022-03-10 13:20:36	2022-03-10 13:20:36	f
783	38	617	-1	2022-03-10 14:09:39	2022-03-10 14:09:39	f
784	52	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
785	52	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
786	52	785	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
787	39	48	-1	2022-03-10 14:23:22	2022-03-10 14:23:22	f
788	38	782	-1	2022-03-10 14:28:52	2022-03-10 14:28:52	f
782	1	-1	-1	2022-03-10 14:07:56	2022-03-10 14:07:56	f
789	65	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
790	65	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
791	65	790	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
792	66	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
794	66	793	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
795	67	-1	-1	2022-03-14 16:11:29	2022-03-14 16:11:29	f
797	68	-1	-1	2022-03-15 15:41:52	2022-03-15 15:41:52	f
798	68	-1	-1	2022-03-15 17:15:06	2022-03-15 17:15:06	f
799	68	-1	-1	2022-03-15 17:18:45	2022-03-15 17:18:45	f
800	69	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
802	70	-1	-1	2022-03-16 13:53:32	2022-03-16 13:53:32	f
805	70	-1	0	2022-03-16 14:23:01	2022-03-16 14:23:01	f
819	72	-1	-1	2022-03-19 11:47:51	2022-03-19 11:47:51	f
820	72	819	-1	2022-03-19 11:50:14	2022-03-19 11:50:14	f
827	70	826	-1	2022-03-19 13:36:32	2022-03-19 13:36:32	f
823	1	-1	-1	2022-03-19 13:11:23	2022-03-19 13:11:23	f
825	1	-1	-1	2022-03-19 13:32:26	2022-03-19 13:32:26	f
828	1	-1	-1	2022-03-19 15:19:40	2022-03-19 15:19:40	f
856	75	-1	-1	2022-03-23 20:17:21	2022-03-23 20:17:21	f
857	75	856	-1	2022-03-23 20:20:33	2022-03-23 20:20:33	f
829	1	-1	-1	2022-03-19 15:24:58	2022-03-19 15:24:58	f
841	70	835	2	2022-02-23 00:00:00	2022-03-10 00:00:00	f
830	1	658	-1	2022-03-19 15:47:39	2022-03-19 15:47:39	f
831	70	822	-1	2022-03-19 16:05:25	2022-03-19 16:05:25	f
832	67	795	-1	2022-03-19 16:06:41	2022-03-19 16:06:41	f
793	66	-1	1	2022-02-23 00:00:00	2022-03-07 00:00:00	f
846	70	660	-1	2022-03-21 13:06:17	2022-03-21 13:06:17	f
833	67	795	-1	2022-03-19 16:13:46	2022-03-19 16:13:46	f
834	1	658	-1	2022-03-19 16:14:35	2022-03-19 16:14:35	f
806	71	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
808	71	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00	f
807	72	-1	-1	2022-03-17 18:00:45	2022-03-17 18:00:45	f
811	70	-1	-1	2022-03-17 18:23:30	2022-03-17 18:23:30	f
813	70	812	-1	2022-03-17 18:39:59	2022-03-17 18:39:59	f
812	70	-1	-1	2022-03-17 18:42:23	2022-03-17 18:42:23	f
814	71	-1	-1	2022-03-18 11:34:40	2022-03-18 11:34:40	f
849	70	824	-1	2022-03-21 13:18:31	2022-03-21 13:18:31	f
858	75	-1	-1	2022-03-23 20:26:03	2022-03-23 20:26:03	f
844	70	822	-1	2022-03-21 12:17:12	2022-03-21 12:17:12	f
815	71	-1	-1	2022-03-18 12:22:44	2022-03-18 12:22:44	f
816	71	-1	-1	2022-03-18 12:28:16	2022-03-18 12:28:16	f
817	71	-1	-1	2022-03-18 13:38:21	2022-03-18 13:38:21	f
818	71	-1	-1	2022-03-18 14:53:07	2022-03-18 14:53:07	f
836	70	658	-1	2022-03-21 11:17:28	2022-03-21 11:17:28	f
821	1	-1	-1	2022-03-19 12:26:27	2022-03-19 12:26:27	f
837	70	658	-1	2022-03-21 11:25:43	2022-03-21 11:25:43	f
838	70	812	-1	2022-03-21 11:28:32	2022-03-21 11:28:32	f
839	70	812	-1	2022-03-21 11:28:49	2022-03-21 11:28:49	f
840	70	812	-1	2022-03-21 11:29:01	2022-03-21 11:29:01	f
842	70	658	-1	2022-03-21 12:10:47	2022-03-21 12:10:47	f
843	70	658	-1	2022-03-21 12:16:58	2022-03-21 12:16:58	f
845	70	660	-1	2022-03-21 12:34:35	2022-03-21 12:34:35	f
850	70	822	-1	2022-03-21 15:21:07	2022-03-21 15:21:07	f
851	73	-1	-1	2022-03-21 18:10:01	2022-03-21 18:10:01	f
853	70	852	-1	2022-03-22 14:45:25	2022-03-22 14:45:25	f
854	70	852	-1	2022-03-22 14:45:46	2022-03-22 14:45:46	f
855	74	-1	-1	2022-03-22 18:52:20	2022-03-22 18:52:20	f
826	70	-1	1	2022-03-19 13:36:07	2022-03-19 13:36:07	f
822	70	-1	2	2022-03-19 13:08:07	2022-03-19 13:08:07	f
835	70	-1	3	2022-02-23 00:00:00	2022-03-10 00:00:00	f
862	76	861	-1	2022-03-23 20:31:59	2022-03-23 20:31:59	f
863	76	861	-1	2022-03-23 21:11:51	2022-03-23 21:11:51	f
223	39	-1	14	2022-03-04 12:18:08	2022-03-04 12:18:08	f
246	39	-1	31	2022-03-04 12:18:08	2022-03-04 12:18:08	f
847	70	660	2	2022-02-23 00:00:00	2022-03-10 00:00:00	f
804	70	-1	5	2022-03-16 14:20:52	2022-03-16 14:20:52	f
866	77	-1	-1	2022-03-24 21:41:52	2022-03-24 21:41:52	f
867	77	866	-1	2022-03-24 21:42:13	2022-03-24 21:42:13	f
504	39	-1	54	2022-03-04 12:18:08	2022-03-04 12:18:08	f
796	39	-1	8	2022-03-15 15:32:40	2022-03-15 15:32:40	f
222	39	-1	13	2022-03-04 12:18:08	2022-03-04 12:18:08	f
860	76	-1	1	2022-03-23 20:30:36	2022-03-23 20:30:36	f
861	76	-1	2	2022-03-24 12:34:29	2022-03-24 12:34:29	f
859	76	-1	3	2022-03-23 20:30:15	2022-03-23 20:30:15	f
809	70	-1	4	2022-03-17 18:16:34	2022-03-17 18:16:34	f
803	70	-1	6	2022-03-16 14:20:01	2022-03-16 14:20:01	f
810	70	-1	7	2022-03-17 18:17:48	2022-03-17 18:17:48	f
865	78	864	2	2022-02-23 00:00:00	2022-03-10 00:00:00	f
824	70	-1	1	2022-03-19 13:29:33	2022-03-19 13:29:33	f
848	70	-1	2	2022-03-21 13:18:07	2022-03-21 13:18:07	f
801	70	-1	3	2022-03-16 13:49:06	2022-03-16 13:49:06	f
852	70	-1	8	2022-03-22 14:45:06	2022-03-22 14:45:06	f
868	70	847	1	2022-03-24 00:00:00	2022-03-24 00:00:00	f
871	79	869	1	2022-03-26 11:37:17	2022-03-26 11:37:17	f
872	79	869	2	2022-03-26 11:37:38	2022-03-26 11:37:38	f
873	79	869	3	2022-03-26 11:38:04	2022-03-26 11:38:04	f
776	39	-1	9	2022-03-03 00:00:00	2022-03-03 00:00:00	f
301	39	-1	34	2022-03-04 12:18:08	2022-03-04 12:18:08	f
352	39	-1	38	2022-03-04 12:18:08	2022-03-04 12:18:08	f
443	39	-1	48	2022-03-04 12:18:08	2022-03-04 12:18:08	f
444	39	-1	49	2022-03-04 12:18:08	2022-03-04 12:18:08	f
546	39	-1	61	2022-03-04 12:18:08	2022-03-04 12:18:08	f
615	39	-1	70	2022-03-04 12:18:08	2022-03-04 12:18:08	f
722	39	-1	75	2022-03-04 12:18:08	2022-03-04 12:18:08	f
869	79	-1	-1	2022-03-26 11:35:34	2022-03-26 11:35:34	f
870	79	869	4	2022-03-26 11:36:52	2022-03-26 11:36:52	f
875	79	869	5	2022-03-26 11:44:51	2022-03-26 11:44:51	f
874	79	869	6	2022-03-26 11:38:29	2022-03-26 11:38:29	f
876	79	869	7	2022-03-26 11:47:00	2022-03-26 11:47:00	f
880	80	-1	-1	2022-03-26 19:37:40	2022-03-26 19:37:40	f
881	80	880	-1	2022-03-26 19:38:31	2022-03-26 19:38:31	f
882	81	-1	-1	2022-03-26 20:28:56	2022-03-26 20:28:56	f
883	81	882	-1	2022-03-26 20:29:46	2022-03-26 20:29:46	f
884	81	-1	-1	2022-03-26 20:38:45	2022-03-26 20:38:45	f
885	82	-1	-1	2022-03-27 18:49:24	2022-03-27 18:49:24	f
886	82	885	-1	2022-03-27 18:49:38	2022-03-27 18:49:38	f
212	39	-1	1	2022-03-28 13:25:52	2022-03-28 13:25:52	f
887	85	-1	-1	2022-03-28 19:03:11	2022-03-28 19:03:11	f
877	78	865	1	2022-03-24 00:00:00	2022-03-24 00:00:00	f
878	78	877	1	2022-03-24 00:00:00	2022-03-24 00:00:00	f
879	78	878	2	2022-02-23 00:00:00	2022-03-10 00:00:00	f
888	78	878	1	2022-03-24 00:00:00	2022-03-24 00:00:00	f
5	1	1	1	2022-02-21 00:00:00	2022-02-21 00:00:00	f
4	1	1	2	2022-02-15 00:00:00	2022-02-15 00:00:00	f
864	78	-1	1	2022-04-06 11:38:52	2022-04-06 11:38:52	f
\.


--
-- Data for Name: knowledge_base_category_delayed_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_base_category_delayed_jobs (id, knowledge_base_category_translation_id, run_at, created_at, knowledge_base_id, publish_update_delete) FROM stdin;
2	12	2022-02-26 00:00:00	2022-02-21 18:21:10.365243	\N	publish
4	10	2022-02-23 00:00:00	2022-02-21 19:02:21.320115	\N	publish
10	15	2022-02-23 00:00:00	2022-02-22 17:52:13.368653	\N	publish
11	18	2022-03-03 00:00:00	2022-02-22 18:03:57.354481	\N	publish
15	629	2022-03-18 00:00:00	2022-03-17 16:13:47.688691	66	update
16	629	2022-03-18 00:00:00	2022-03-17 16:56:59.153926	66	delete
23	650	2022-04-01 11:11:00	2022-03-18 12:22:44.991685	71	publish
24	651	2022-03-23 11:11:00	2022-03-18 12:28:16.735845	71	publish
29	651	2022-03-30 00:00:00	2022-03-18 13:50:43.463951	71	delete
30	652	2022-03-31 04:11:00	2022-03-18 13:57:48.722824	71	update
31	652	2022-03-31 04:11:00	2022-03-18 13:58:04.223218	71	update
32	652	2022-03-25 11:11:00	2022-03-18 14:21:20.787605	71	update
33	652	2022-03-22 11:11:00	2022-03-18 14:22:16.549696	71	update
34	652	2022-03-23 11:11:00	2022-03-18 14:25:31.420211	71	update
35	652	2022-03-23 11:11:00	2022-03-18 14:28:25.511356	71	update
37	653	2222-11-11 12:12:00	2022-03-18 14:53:57.5685	71	update
38	28	2022-03-18 00:00:00	2022-03-18 15:06:03.895336	66	update
39	629	2022-03-18 00:00:00	2022-03-18 15:11:04.7755	66	update
44	653	2022-03-24 11:11:00	2022-03-18 15:35:37.022922	71	update
45	655	2022-03-29 11:11:00	2022-03-19 11:48:14.879648	72	update
47	655	2022-03-29 09:13:00	2022-03-23 16:12:12.414849	72	update
48	655	2022-03-29 02:11:00	2022-03-23 16:12:54.011081	72	update
49	655	2022-03-29 20:06:00	2022-03-23 16:13:59.462899	72	update
50	655	2022-03-24 10:06:00	2022-03-23 16:23:18.447957	72	update
51	655	2022-03-24 20:06:00	2022-03-23 16:26:09.484277	72	update
52	655	2022-03-25 20:06:00	2022-03-23 16:27:11.493888	72	update
53	655	2022-03-26 06:04:00	2022-03-23 16:27:35.471817	72	update
54	655	2022-03-31 23:37:00	2022-03-23 16:37:55.219866	72	update
55	655	2022-03-31 11:37:00	2022-03-23 16:39:38.701251	72	update
56	655	2022-03-01 11:37:00	2022-03-23 16:42:53.449513	72	update
57	655	2022-03-01 23:40:00	2022-03-23 16:43:12.162347	72	update
58	662	2022-03-31 22:26:00	2022-03-23 17:27:03.976395	70	update
59	662	2022-03-31 22:26:00	2022-03-23 17:27:04.025302	70	update
60	691	2022-03-24 10:01:00	2022-03-23 20:17:21.244213	75	publish
61	698	2022-03-31 23:35:00	2022-03-24 12:35:26.70454	76	delete
62	698	2022-01-24 17:25:00	2022-03-24 12:36:02.162755	76	delete
63	698	2022-01-24 22:25:00	2022-03-24 12:38:17.352524	76	update
64	698	2022-01-24 22:25:00	2022-03-24 12:38:23.927088	76	update
65	704	2022-03-24 16:53:55	2022-03-24 16:53:55.264117	78	publish
66	682	2022-03-25 16:40:37	2022-03-25 16:40:37.121714	70	publish
67	729	2022-03-26 16:44:24	2022-03-26 16:44:24.172671	78	publish
68	734	2022-03-18 22:35:00	2022-03-26 20:33:21.339188	81	update
69	734	2022-03-18 22:35:00	2022-03-26 20:33:24.514193	81	update
70	78	2022-06-12 00:00:00	2022-04-06 12:13:45.710082	78	update
71	78	2022-06-12 00:00:00	2022-04-06 14:05:42.116363	78	delete
\.


--
-- Data for Name: knowledge_base_category_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_base_category_translations (id, name, kb_locale_id, category_id, created_at, updated_at, ui_color, category_icon, title_tag, footer, keywords, meta_description, publish_now, active, permission, update_metadata, is_delete_scheduled, is_update_scheduled, knowledge_base_id, is_archived, list_id) FROM stdin;
26	Category 001 (Dansk) 	4	35	2022-02-25 14:49:45	2022-02-25 14:49:45	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	FFFF	KW	MD	t	t	Public	\N	f	f	\N	f	\N
1		1	14	2022-02-22 13:49:51	2022-02-22 13:49:51	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
48	Electrician 	1	213	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg			-1		t	t		\N	f	f	\N	f	\N
2		1	15	2022-02-22 13:52:57	2022-02-22 13:52:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
3		2	15	2022-02-22 13:52:57	2022-02-22 13:52:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
4		3	15	2022-02-22 13:52:57	2022-02-22 13:52:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
5		4	15	2022-02-22 13:52:57	2022-02-22 13:52:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
6	English (United States)	1	16	2022-02-22 14:12:52	2022-02-22 14:12:52	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
7	Czech (Česky)	3	16	2022-02-22 14:12:52	2022-02-22 14:12:52	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
8	Bulgarian (Български)	2	16	2022-02-22 14:12:52	2022-02-22 14:12:52	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
9	Dansk	4	16	2022-02-22 14:12:52	2022-02-22 14:12:52	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
10	Español (Colombia)	10	17	2022-02-22 15:28:37	2022-02-22 15:28:37	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
11	English (Canada)	7	17	2022-02-22 15:28:37	2022-02-22 15:28:37	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
13	English (Canada)	7	18	2022-02-22 18:03:57	2022-02-22 18:03:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
14	Nederlands	22	18	2022-02-22 18:03:57	2022-02-22 18:03:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
15	Français	13	18	2022-02-22 18:03:57	2022-02-22 18:03:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	\N
16	category 1 for kb_id 31 locale 1	2	26	2022-02-23 00:00:00	2022-02-23 00:00:00	red	category_icon_123	test tag	footer info	key, word	meta description for knowledgebase category	t	t	public	\N	f	f	\N	f	\N
17	category 2 for kb_id 31 locale 1	1	27	2022-02-23 00:00:00	2022-02-23 00:00:00	red	category_icon_123	test tag	footer info	key, word	meta description for knowledgebase category	t	t	public	\N	f	f	\N	f	\N
18	category 2 for kb_id 31 locale 1	1	28	2022-02-23 00:00:00	2022-02-23 00:00:00	red	category_icon_123	test tag	footer info	key, word	meta description for knowledgebase category	t	t	public	\N	f	f	\N	f	\N
19	category 2 for kb_id 29 locale 17	17	29	2022-02-23 00:00:00	2022-02-23 00:00:00	red	category_icon_123	test tag	footer info	key, word	meta description for knowledgebase category	f	t	public	\N	f	f	\N	f	\N
20	category 3 for kb_id 29 locale 25	25	29	2022-02-23 00:00:00	2022-02-23 00:00:00	red	category_icon_123	test tag	footer info	key, word	meta	t	t	public	\N	f	f	\N	f	\N
24	ENGLISH UNITED STATES	1	33	2022-02-25 13:47:57	2022-02-25 13:47:57	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TTTAG	Footer	Keywords	Meta Description	t	t	Public	\N	f	f	\N	f	\N
25	English (Great Britian)	8	34	2022-02-25 14:16:05	2022-02-25 14:16:05	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	Title Tag	Footer	Keywords	Meta Description	t	t	Public	\N	f	f	\N	f	\N
27	Category 002 (Dansk)	4	36	2022-02-25 14:51:45	2022-02-25 14:51:45	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	Footer	Keywords	Meta Description	t	t	Public	\N	f	f	\N	f	\N
29	Category 002 (Bulgarian (Български))	2	38	2022-02-25 14:54:41	2022-02-25 14:54:41	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	Footer	Keywords	Meta Description	t	t	Public	\N	f	f	\N	f	\N
30	Category 002 (Bulgarian (Български))	2	39	2022-02-25 14:56:57	2022-02-25 14:56:57	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	Footer	Keywords	Meta Description	t	f	Public	\N	f	f	\N	f	\N
31	Category 002 (Bulgarian (Български))	2	40	2022-02-25 14:57:11	2022-02-25 14:57:11	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	Footer	Keywords	Meta Description	t	t	Public	\N	f	f	\N	f	\N
21	updated name	1	29	2022-02-23 00:00:00	2022-02-23 00:00:00	red	updated icon	test tag	footer info	key, word	meta	t	t	internal	\N	f	f	\N	f	\N
38	updated category english translation	1	45	2022-02-23 00:00:00	2022-02-23 00:00:00	blue	new category icon	test tag	footer info	key, word	meta	t	t	public	\N	f	f	\N	f	\N
45	Decorator	1	210	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg					t	t		\N	f	f	\N	f	\N
49	Carpenter 	1	214	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/writing-translation.32ebe2e.svg			-1		t	t		\N	f	f	\N	f	\N
50	Roofer	1	215	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/music-audio.320af20.svg			-1		t	t		\N	f	f	\N	f	\N
51	Law Practitioner 	1	216	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
52	Auto Body Repairer 	1	217	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/programming.9362366.svg			-1		t	t		\N	f	f	\N	f	\N
121	Built-In Furniture	1	286	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
46	Builder	1	211	2022-03-04 12:18:08	2022-03-04 12:18:08	red					[{"title":"Title","description":"Description","type":"checkbox","required":"","placeholder":"Placeholder","defaultvalue":"12","inputs":[{"value":"12"}]}]	t	t		\N	f	f	\N	f	\N
54	Photographer 	1	219	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/lifestyle.745b575.svg			-1		t	t		\N	f	f	\N	f	\N
55	Chef 	1	220	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
56	Hair Stylist	1	221	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
57	Personal Stylist	1	222	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
58	Beautician	1	223	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
59	Massage Therapist	1	224	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
60	Home Stylist 	1	225	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
61	Mover	1	226	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
62	Pest Controller 	1	227	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
63	Locksmith 	1	228	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
64	Cleaner 	1	229	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
65	Gardener / Landscape Gardener	1	230	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
66	Barber	1	231	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
67	Accountant 	1	232	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
68	Therapist 	1	233	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
69	Tailor 	1	234	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
70	Welder 	1	235	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
12	English (United States)	1	18	2022-02-22 18:03:57	2022-02-22 18:03:57	green	\N	\N	\N	\N	\N	\N	\N	\N		f	f	\N	f	\N
71	Artist 	1	236	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
72	Bathroom Installation 	1	237	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
73	"Bathroom	1	238	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Kitchen and WC Plumbing"	Plumber				t	t		\N	f	f	\N	f	\N
74	Emergency / 24 Hour Plumber	1	239	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
75	Guttering and Rainwater Pipe	1	240	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
76	Hot Tub Installation / Repair	1	241	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
77	Plumbing Repair & Maintenance	1	242	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
79	Solar Panel Installation	1	244	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
80	Sprinkler System	1	245	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
81	Water Tanks and Immersion Heater	1	246	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
82	Water Underfloor Heating 	1	247	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
83	Chimney Building / Repair	1	248	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
84	Flat Roof – Installation / Repair	1	249	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
85	Guttering and Rainwater Pipe Leadwork 	1	250	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
86	Roof Cleaning 	1	251	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
87	Roof Insulation 	1	252	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
88	Slate & Tiled Roof 	1	253	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
89	Thatched Roof 	1	254	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
90	UPVC Fascias / Soffits / Cladding 	1	255	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
91	Velux / Skylight Window 	1	256	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
92	Wooden Cladding / Fascias / Soffits	1	257	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
93	Zinc / Metal Roof	1	258	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N	f	f	\N	f	\N
94	Cavity Wall Insulation	1	259	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
95	Cellar & Basement Conversion	1	260	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
96	Cladding	1	261	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
97	Conservatory	1	262	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
98	Disability Access Installation	1	263	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
99	Mould / Damp Control	1	264	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
100	Garage Conversion	1	265	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
101	Garden Office / Studio Construction	1	266	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
102	Groundwork / Foundations	1	267	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
103	Home Improvements 	1	268	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
104	House Extension 	1	269	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
105	Loft Conversion 	1	270	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
106	Log Cabins / Timber Framed Building	1	271	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
107	Metal Staircases	1	272	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
108	Partition Wall	1	273	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
109	Writer	1	274	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
110	Period / Listed Building Works	1	275	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
111	Pizza Oven	1	276	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
112	Porch / Canopy	1	277	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
113	Post Construction Cleaning	1	278	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
114	Steel Fabrication / Structural Steelwork	1	279	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
115	Suspended Ceiling	1	280	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
116	Underfloor Insulation 	1	281	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
117	Underpinning / Piling / Foundations	1	282	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
118	Wooden Staircases	1	283	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
119	Bespoke Furniture	1	284	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
120	Bespoke Kitchens	1	285	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
123	Flat Pack Furniture Assembly	1	288	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
124	Floor Sanding & Finishing	1	289	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
125	Garden Shed / Playhouse	1	290	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
126	General Fitted Furniture	1	291	2022-03-04 12:18:08	2022-03-04 12:18:08	red				16		t	t		\N	f	f	\N	f	\N
127	Laminate Flooring	1	292	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
128	Radiator Covers	1	293	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
129	Skirting Board Installation 	1	294	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
130	Solid Wood Flooring 	1	295	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
131	Wood Floor Sanding / Staining	1	296	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
132	Wooden Casement Window	1	297	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
133	Wooden Cladding /Fascias /Soffits	1	298	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
134	Wooden Decking	1	299	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
135	Wooden Doors – External 	1	300	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
136	Wooden Doors – Internal	1	301	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
137	Wooden Sash Window	1	302	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
138	Wooden Shutter	1	303	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
139	Wooden Staircases 	1	304	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
140	Period / Listed Building Works 	1	305	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
141	Log Cabins / Timber Framed Building 	1	306	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
142	Access Control / Door Entry	1	307	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
143	Aerial & Satellite Dish Installation 	1	308	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
144	Air Conditioning / Refrigeration	1	309	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
145	Carbon Monoxide Alarms – Installation	1	310	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
146	Domestic Appliance Repair	1	311	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
147	Electric Oven / Hob – Installation	1	312	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
148	Electric Underfloor Heating	1	313	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
149	Electrical Inspection Condition Report	1	314	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
150	Electrical Installation / Testing	1	315	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
151	Emergency Electrician	1	316	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
152	External Lighting 	1	317	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
153	Hot Tub Installation / Repair 	1	318	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
154	Internal Lighting 	1	319	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
155	Landlord Reports / Safety Checks	1	320	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
156	Smoke Alarm – Installation 	1	321	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N	f	f	\N	f	\N
157	Handyman 	1	322	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N	f	f	\N	f	\N
158	Door / Window Painting 	1	323	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator 		t	t		\N	f	f	\N	f	\N
159	External Wall Painting 	1	324	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
160	Mould / Damp Control 	1	325	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
161	Internal Painting & Decorating	1	326	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
162	Wall Murals / Paint Effects	1	327	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
163	Blind / Curtain / Shutter – Installation 	1	328	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N	f	f	\N	f	\N
164	Cat Flap – Installation 	1	329	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N	f	f	\N	f	\N
165	Domestic Appliance Repair 	1	330	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N	f	f	\N	f	\N
166	Electric Oven / Hob – Installation 	1	331	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N	f	f	\N	f	\N
167	Flat Pack Furniture Assembly 	1	332	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N	f	f	\N	f	\N
168	Home Maintenance / Repair	1	333	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N	f	f	\N	f	\N
169	Jet / Power Washing	1	334	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N	f	f	\N	f	\N
170	Perspex / Protective Screens	1	335	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N	f	f	\N	f	\N
171	Skirting Board Installation	1	336	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
172	Tiling	1	337	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
173	Paintwork Scratches	1	338	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
174	Interior Repairs – Leather & Plastic Trims	1	339	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
175	Sprayless Scratch Repairs 	1	340	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
176	Minor Dents	1	341	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
177	Minor Dents 	1	342	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
178	Minor Crash Repairs	1	343	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
179	Panel Damage	1	344	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
180	Alloy Wheel Repair	1	345	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
181	Alloy Wheel Colour Changes	1	346	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
182	Alloy Wheel Scuffs 	1	347	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
183	Bumper Scuffs	1	348	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
184	Supagard	1	349	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
185	Keyed Car Repairs	1	350	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
186	End of Lease Repairs	1	351	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N	f	f	\N	f	\N
187	Guides 	1	352	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Group3		t	t		\N	f	f	\N	f	\N
188	Data Guides	1	353	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Guides		t	t		\N	f	f	\N	f	\N
189	Business guides	1	354	2022-03-04 12:18:08	2022-03-04 12:18:08	red				guides		t	t		\N	f	f	\N	f	\N
191	Careers 	1	356	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Group2	Writing & Copywriting Guides	t	t		\N	f	f	\N	f	\N
192	Translator	1	357	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
193	Carpet Cleaning	1	358	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
194	Commercial Window Cleaning	1	359	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
195	Conservatory Cleaning / Maintenance	1	360	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
196	Deep Cleaning – Commercial	1	361	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
197	Deep Cleaning – Domestic	1	362	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
198	Domestic House Cleaning: One Off	1	363	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
199	Domestic House Cleaning: Regular	1	364	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
200	End of Tenancy Cleaning	1	365	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
201	Office / Commercial Cleaning 	1	366	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
202	Oven Cleaning	1	367	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
203	Post Construction Cleaning 	1	368	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
204	Repeat Wheelie Bin Clean	1	369	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
205	Window Cleaning	1	370	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N	f	f	\N	f	\N
206	Commercial Pest Control	1	371	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pest Controller 		t	t		\N	f	f	\N	f	\N
207	Residential Pest Control	1	372	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pest Controller 		t	t		\N	f	f	\N	f	\N
208	"Pattern Cutting	1	373	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Grading"	Tailor				t	t		\N	f	f	\N	f	\N
209	Toiling and Fitting	1	374	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
210	Sample Production 	1	375	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
211	Small-Run Clothing Production	1	376	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
212	Shorten	1	377	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
213	Lengthen	1	378	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
214	Take In	1	379	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
215	Let Out	1	380	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
216	Alter	1	381	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
217	Repair	1	382	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
218	Adjust	1	383	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
219	Hem	1	384	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
220	Patch	1	385	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
221	Press	1	386	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
222	Mend	1	387	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
223	Embroider	1	388	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
224	Iron	1	389	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N	f	f	\N	f	\N
225	Business 	1	390	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
226	Administrative & Public Law	1	391	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
227	Art 	1	392	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
228	Clinical Negligence	1	393	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
229	Contractual Disputes	1	394	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
230	Court of Protection	1	395	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
231	Criminal Defence	1	396	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
232	Defamation & Privacy 	1	397	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
233	Discrimination	1	398	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
234	Education Law	1	399	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
235	Employment; Employee	1	400	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
236	Family & Relationships	1	401	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
237	Healthcare 	1	402	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
238	Immigration 	1	403	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
239	Inquests	1	404	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
240	Insolvency 	1	405	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
241	Legal Costs	1	406	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
242	Mediation 	1	407	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
243	Military Law	1	408	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
244	Motoring	1	409	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
245	Organisational Disputes	1	410	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
246	Pensions	1	411	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
247	Personal Disputes	1	412	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
248	Personal Injury	1	413	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
249	Planning (Residential)	1	414	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
250	Private Prosecution	1	415	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
251	Probate	1	416	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
252	Professional Discipline 	1	417	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
253	Professional Negligence 	1	418	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
254	Property & Housing	1	419	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
255	Small Claims	1	420	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
256	Social Security	1	421	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
257	Pet Specialist 	1	422	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
594	Printmaker	1	759	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
259	Weddings	1	424	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N	f	f	\N	f	\N
260	Party	1	425	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N	f	f	\N	f	\N
261	Engagement	1	426	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N	f	f	\N	f	\N
262	Family	1	427	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N	f	f	\N	f	\N
263	Baby	1	428	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N	f	f	\N	f	\N
264	360 VR	1	429	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N	f	f	\N	f	\N
265	Property	1	430	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N	f	f	\N	f	\N
266	Travel	1	431	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N	f	f	\N	f	\N
267	Mobile Fitting Services	1	432	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
268	Car Checks	1	433	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
269	Batteries	1	434	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
270	Brakes	1	435	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
271	Windscreen Treatment	1	436	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
272	DPF & Exhaust System	1	437	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
273	Tyre Services	1	438	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
274	Steering & Suspension	1	439	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
275	Engine Services	1	440	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
276	Diagnostic Check	1	441	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
277	Musicians and Bands 	1	442	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
278	Magician 	1	443	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
279	Lookalike	1	444	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
280	Celebrity 	1	445	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
281	Mediterranean	1	446	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Chef		t	t		\N	f	f	\N	f	\N
282	Italian	1	447	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Chef		t	t		\N	f	f	\N	f	\N
283	French	1	448	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Chef		t	t		\N	f	f	\N	f	\N
284	Asian	1	449	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Chef		t	t		\N	f	f	\N	f	\N
285	Latin American	1	450	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Chef		t	t		\N	f	f	\N	f	\N
286	Artificial Grass / Astro Turf 	1	451	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
287	Brick / Block Paving	1	452	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
288	Garden Clearance	1	453	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
289	Garden Design\t	1	454	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
290	Garden Maintenance 	1	455	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
291	Garden Shed / Playhouse 	1	456	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
292	Garden Wall	1	457	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
293	Landscaping	1	458	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
294	Lawn Care Services – Grass Cutting / Turfing / Seeding	1	459	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
295	Planting	1	460	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
296	Pond & Water Feature	1	461	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
297	Repeat Garden Maintenance	1	462	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
298	Soil Irrigation / Drainage	1	463	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
299	Stone / Concrete Paving	1	464	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
300	Tree Surgery / Consultancy	1	465	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
301	Wooden / Metal / Wire Fences	1	466	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
302	Wooden / Metal Gates	1	467	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
303	Wooden Decking 	1	468	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N	f	f	\N	f	\N
304	Blacksmith / Metal Worker	1	469	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
305	Decorative Ironmongery and Metalwork	1	470	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N	f	f	\N	f	\N
306	Metal Kitchen Worktops	1	471	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N	f	f	\N	f	\N
307	Metal Staircases 	1	472	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N	f	f	\N	f	\N
308	Security Fencing	1	473	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N	f	f	\N	f	\N
309	Security Gates and Bollard	1	474	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N	f	f	\N	f	\N
310	Security Grill	1	475	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N	f	f	\N	f	\N
311	Wooden / Metal / Wire Fences 	1	476	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N	f	f	\N	f	\N
312	Zinc / Metal Roof 	1	477	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N	f	f	\N	f	\N
313	Bricklayer	1	478	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
314	Chimney Building / Repair 	1	479	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
315	Garden Wall 	1	480	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
316	Pizza Oven 	1	481	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Bricklayer		t	t		\N	f	f	\N	f	\N
317	Pointing / Repointing	1	482	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Bricklayer		t	t		\N	f	f	\N	f	\N
318	Stonework / Stone Cladding	1	483	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
319	Aerial & Satellite Dish Installation	1	484	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Electrician 		t	t		\N	f	f	\N	f	\N
320	"Burglar	1	485	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Security & Intruder Alarm Installation"	Electrician 				t	t		\N	f	f	\N	f	\N
321	CCTV Installation	1	486	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Electrician 		t	t		\N	f	f	\N	f	\N
322	Digital Home Network	1	487	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Electrician 		t	t		\N	f	f	\N	f	\N
323	Sound & Audio Visual Installation	1	488	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Electrician 		t	t		\N	f	f	\N	f	\N
325	Deep Tissue Massage	1	490	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N	f	f	\N	f	\N
326	Swedish Massage	1	491	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N	f	f	\N	f	\N
327	Therapeutic Massage	1	492	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N	f	f	\N	f	\N
328	Thai Massage	1	493	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N	f	f	\N	f	\N
329	Aromatherapy Massage	1	494	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N	f	f	\N	f	\N
330	Hot Stone Massage	1	495	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N	f	f	\N	f	\N
331	Face	1	496	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
332	Body	1	497	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
333	Nails	1	498	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
334	Manicure	1	499	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
335	Pedicure 	1	500	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
336	Nail or Gel Polish Removal	1	501	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
337	Gel Nails Manicure	1	502	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
338	Gel Nails Pedicure	1	503	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
339	"Acrylic	1	504	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Hard Gel & Nail Extensions"	Beautician				t	t		\N	f	f	\N	f	\N
340	Classic Facials	1	505	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
341	Eyelash Extensions	1	506	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
342	Eyebrow and Eyelash Tinting	1	507	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
343	Eyebrow Threading 	1	508	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
344	Eyebrow Waxing	1	509	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
345	Definition Brows	1	510	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
346	Spray Tanning and Sunless Tanning	1	511	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
347	Body Exfoliation Treatments	1	512	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
348	Body Wraps	1	513	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
349	Colonic Hydrotherapy	1	514	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
350	Cryolipolysis	1	515	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
351	Cellulite Treatments	1	516	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
352	Hair Removal	1	517	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
353	Ladies’ Waxing	1	518	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
354	Hollywood Waxing	1	519	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
355	Brazilian Waxing	1	520	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
356	Mens’ Waxing	1	521	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
357	Facial Threading	1	522	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
358	Laser Hair Removal 	1	523	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N	f	f	\N	f	\N
359	Haircut	1	524	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Hair Stylist		t	t		\N	f	f	\N	f	\N
360	Colouring	1	525	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Hair Stylist		t	t		\N	f	f	\N	f	\N
361	Blow Dry	1	526	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Hair Stylist		t	t		\N	f	f	\N	f	\N
362	Brazilian Blow Dry	1	527	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Hair Stylist		t	t		\N	f	f	\N	f	\N
363	Men’s Haircut	1	528	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Barber		t	t		\N	f	f	\N	f	\N
364	Beard Trims and Shaves	1	529	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Barber		t	t		\N	f	f	\N	f	\N
365	Errand Runner	1	530	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
366	Fashion and Textile Designer 	1	531	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
367	Decorative Cornicing / Plasterwork	1	532	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator 		t	t		\N	f	f	\N	f	\N
368	Dry Lining & Plasterboard – Installation 	1	533	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
369	Dry Lining & Plasterboard – Repair	1	534	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
370	External Wall Insulation 	1	535	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator 		t	t		\N	f	f	\N	f	\N
371	Internal Rendering	1	536	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator 		t	t		\N	f	f	\N	f	\N
372	Pebble Dashing	1	537	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
373	Plaster Skimming	1	538	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator 		t	t		\N	f	f	\N	f	\N
374	Polished / Other Plaster Finish	1	539	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
375	Screeding	1	540	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
376	Standing Coving	1	541	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
377	Plane and Pilot	1	542	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
378	Gas / Heating Engineer	1	543	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
379	Electric Boiler – Installation 	1	544	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
380	Electric Boiler – Service / Repair	1	545	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
381	Gas Boiler – Installation 	1	546	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
382	Gas Boiler – Service / Repair 	1	547	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
383	Gas Cooker / Hob – Installation 	1	548	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
384	Gas Cooker / Hob – Repair	1	549	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
385	Gas Fire 	1	550	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
386	Heat Pump (Air Source / Ground Source)	1	551	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
387	Hot Water Tank / Appliance Tank Thermostats	1	552	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
388	Oil-Fired Boiler	1	553	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
389	Solar Panel Installation  	1	554	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
390	Water Underfloor Heating	1	555	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N	f	f	\N	f	\N
391	Drainage Specialist 	1	556	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
393	Septic Tanks – Installation / Emptying / Cleaning	1	558	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
394	Carpet Fitters	1	559	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
395	Electric Underfloor Heating 	1	560	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
396	External Tiling	1	561	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
397	Floor Sanding & Finishing 	1	562	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
398	Floor Tiling	1	563	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
399	Laminate Flooring 	1	564	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
400	Linoleum Flooring	1	565	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
401	Plastic / Rubber Flooring	1	566	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
402	Polished Concrete	1	567	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
403	Screeding 	1	568	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
404	Solid Wood Flooring	1	569	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
405	Stone / Concrete Paving 	1	570	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
406	Vinyl Flooring	1	571	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
407	Water Underfloor Heating  	1	572	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
408	Wooden Decking  	1	573	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
409	Brick / Block Paving 	1	574	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
410	Concrete Driveway	1	575	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
411	Resin Driveway	1	576	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
412	Tarmac Driveway	1	577	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N	f	f	\N	f	\N
413	Bath Resurfacing	1	578	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
414	Bathroom Design	1	579	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
415	Bathroom Installation	1	580	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
416	Bathroom Repair	1	581	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
417	Bathroom Tiling	1	582	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
418	Complete Bathroom Refurbishment	1	583	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
419	Wet Room Installation	1	584	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N	f	f	\N	f	\N
420	Dog Trainer 	1	585	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N	f	f	\N	f	\N
421	Dog Walking (in your neighbourhood)	1	586	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N	f	f	\N	f	\N
422	Dog Boarding (in the sitter's home)	1	587	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N	f	f	\N	f	\N
423	Dog House Sitting (in your home)	1	588	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N	f	f	\N	f	\N
424	Dog Drop-In Visits (visits in your home)	1	589	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N	f	f	\N	f	\N
425	Doggy Day Care (in the sitter's home)	1	590	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N	f	f	\N	f	\N
426	Cat Boarding (in the sitter's home) 	1	591	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N	f	f	\N	f	\N
427	Cat House Sitting (in your home) 	1	592	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N	f	f	\N	f	\N
428	Drop-In Visits (visits in your home) 	1	593	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N	f	f	\N	f	\N
429	Braille Translation	1	594	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
430	Certified Translations	1	595	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
431	Contract Translation	1	596	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
432	Financial Translation	1	597	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
433	Legal Translation	1	598	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
434	Medical Translation	1	599	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
435	Patent Translation	1	600	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
436	Pharmaceutical Translation	1	601	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
437	Technical Translation	1	602	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
438	Website Translation	1	603	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
439	Subtitling Services	1	604	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N	f	f	\N	f	\N
440	Chatbot Scripts	1	605	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N	f	f	\N	f	\N
441	Marketing Materials	1	606	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N	f	f	\N	f	\N
442	Claims	1	607	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N	f	f	\N	f	\N
443	Crisis Communications	1	608	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N	f	f	\N	f	\N
444	Pack Copy and Product	1	609	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N	f	f	\N	f	\N
445	Social Media Content	1	610	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N	f	f	\N	f	\N
446	Speeches and Presentations	1	611	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N	f	f	\N	f	\N
447	UX Writing	1	612	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N	f	f	\N	f	\N
448	Video Scripts	1	613	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N	f	f	\N	f	\N
449	Web Copy	1	614	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N	f	f	\N	f	\N
450	"Whitepapers	1	615	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Articles			 Blogs"	Writer	t	t		\N	f	f	\N	f	\N
451	Anniversary	1	616	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N	f	f	\N	f	\N
452	Baby Shower	1	617	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N	f	f	\N	f	\N
453	Birthday Party	1	618	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N	f	f	\N	f	\N
454	Bridal Shower	1	619	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N	f	f	\N	f	\N
455	Celebration	1	620	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N	f	f	\N	f	\N
456	Christmas Party	1	621	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N	f	f	\N	f	\N
457	Corporate Function	1	622	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N	f	f	\N	f	\N
458	Engagement 	1	623	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N	f	f	\N	f	\N
459	Father's Day	1	624	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N	f	f	\N	f	\N
461	Contactless Prescription Pick-up & Delivery	1	626	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N	f	f	\N	f	\N
462	Drop Off Donations	1	627	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N	f	f	\N	f	\N
463	Run Errands	1	628	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N	f	f	\N	f	\N
465	 Delivery Service	1	630	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N	f	f	\N	f	\N
466	Disinfecting Services	1	631	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N	f	f	\N	f	\N
467	"Celebrity Speakers	1	632	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Hosts & Facilitators"	Celebrity				t	t		\N	f	f	\N	f	\N
468	Celebrity Chefs and Bakers	1	633	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N	f	f	\N	f	\N
469	TV Presenters	1	634	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N	f	f	\N	f	\N
470	TV Personalities	1	635	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N	f	f	\N	f	\N
471	Celebrity Comedians 	1	636	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N	f	f	\N	f	\N
472	Famous Music Acts	1	637	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N	f	f	\N	f	\N
473	Famous DJs	1	638	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N	f	f	\N	f	\N
474	Famous Stage Acts	1	639	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N	f	f	\N	f	\N
475	TV Talent Show Acts	1	640	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N	f	f	\N	f	\N
476	House Removals	1	641	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
477	Man with a Van	1	642	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
478	Furniture Removal	1	643	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
479	Sofa Removal	1	644	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
480	Packing and Moving Services	1	645	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
481	Unpacking Services	1	646	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
482	Heavy Lifting	1	647	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
483	Move Furniture Up/Downstairs	1	648	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
484	Deliver Big Piece of Furniture	1	649	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
485	Removal Services	1	650	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
486	Rubbish Removal	1	651	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
487	Pool Table Mover	1	652	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N	f	f	\N	f	\N
489	Personal Shopping	1	654	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Personal Stylist		t	t		\N	f	f	\N	f	\N
490	Wardrobe Editing	1	655	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Personal Stylist		t	t		\N	f	f	\N	f	\N
491	"Style	1	656	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Shape and Colour Consultation"	Personal Stylist				t	t		\N	f	f	\N	f	\N
492	Occasion Dressing	1	657	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Personal Stylist		t	t		\N	f	f	\N	f	\N
493	Home Styling	1	658	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N	f	f	\N	f	\N
494	Outdoor Styling	1	659	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N	f	f	\N	f	\N
495	Decluttering & Storage	1	660	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N	f	f	\N	f	\N
496	Space Planning & Moodboards	1	661	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N	f	f	\N	f	\N
497	Virtual Styling	1	662	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N	f	f	\N	f	\N
498	Staging	1	663	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N	f	f	\N	f	\N
499	Custom Designs	1	664	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N	f	f	\N	f	\N
500	Emergency 24h Locksmith	1	665	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N	f	f	\N	f	\N
501	New Lock Installation	1	666	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N	f	f	\N	f	\N
502	Lock Repairs	1	667	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N	f	f	\N	f	\N
503	Key Cutting	1	668	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N	f	f	\N	f	\N
504	Car Locksmith	1	669	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N	f	f	\N	f	\N
505	Security and Protection	1	670	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N	f	f	\N	f	\N
506	Knowledge Base 2	1	671	2022-03-04 12:18:08	2022-03-04 12:18:08	red				2		t	t		\N	f	f	\N	f	\N
507	Knowledge Base 3	1	672	2022-03-04 12:18:08	2022-03-04 12:18:08	red				3		t	t		\N	f	f	\N	f	\N
508	Private Jet Pilot	1	673	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plane and Pilot		t	t		\N	f	f	\N	f	\N
509	Single Engine Helicopter Pilot	1	674	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plane and Pilot		t	t		\N	f	f	\N	f	\N
510	Twin Engine Helicopter Pilot	1	675	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plane and Pilot		t	t		\N	f	f	\N	f	\N
511	Bookkeeping	1	676	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N	f	f	\N	f	\N
512	Chartered Accounting	1	677	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N	f	f	\N	f	\N
513	Tax Accounting	1	678	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N	f	f	\N	f	\N
514	Financial Controller Services	1	679	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N	f	f	\N	f	\N
515	Accounting Audit	1	680	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N	f	f	\N	f	\N
516	Forensic Accounting	1	681	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N	f	f	\N	f	\N
517	Textile and Fabric Consultancy	1	682	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
518	Fashion Design Consultancy	1	683	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
519	Apparel Designing	1	684	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
520	Trend / Mood Boards	1	685	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
521	Trim / Finding / Hangtag / Label design	1	686	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
522	Tech sketches	1	687	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
523	Pattern Drafting	1	688	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
524	Sourcing Services	1	689	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
525	Textile Repeats / Specs	1	690	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
526	Full collection design	1	691	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
528	Merchandising	1	693	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
529	Catalog Layout	1	694	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
530	Spec / Grading	1	695	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
531	Photo Shoot Art Direction / Management	1	696	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
532	Branding	1	697	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
533	Seasonal and Line Planning	1	698	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
534	Cutting Services	1	699	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N	f	f	\N	f	\N
535	Plate bending and other services	1	700	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N	f	f	\N	f	\N
536	Polishing and brushing services	1	701	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N	f	f	\N	f	\N
537	Shielded Metal Arc Welding	1	702	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N	f	f	\N	f	\N
538	Gas Metal Arc Welding	1	703	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N	f	f	\N	f	\N
539	Gas Tungsten Arc Welding	1	704	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N	f	f	\N	f	\N
540	Flux Cored Arc Welding	1	705	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N	f	f	\N	f	\N
541	Submerged Arc Welding	1	706	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N	f	f	\N	f	\N
542	Marriage and Family Counsellor	1	707	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
543	Addiction therapist	1	708	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
544	Behavioural Therapist	1	709	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
545	Divorce Therapist	1	710	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
546	Child Therapist	1	711	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
547	Clinical Therapist	1	712	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
548	Cognitive Therapist	1	713	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
549	Cognitive-Behavioural Therapist	1	714	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
550	Eating Disorder Therapist	1	715	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
551	Exercise Therapist	1	716	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
552	Youth Therapist	1	717	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
553	Trauma Therapist	1	718	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
554	Nutritional Therapist	1	719	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
555	Psychodynamic Therapist	1	720	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
556	Dialectical Behaviour Therapist	1	721	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N	f	f	\N	f	\N
557	Knowledge Base 4	1	722	2022-03-04 12:18:08	2022-03-04 12:18:08	red				4		t	t		\N	f	f	\N	f	\N
558	Beatboxer	1	723	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
559	Country Music Artist	1	724	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
560	Indie & Electronic Artists	1	725	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
561	"Jazz	1	726	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Swing & Blues Artists"	Musicians and Bands				t	t		\N	f	f	\N	f	\N
562	Opera Singers & Classical Musicians	1	727	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
563	Pop Artists	1	728	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
564	Rappers	1	729	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
565	Rock Artists	1	730	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
566	Singers	1	731	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
567	Soul & Disco Artists	1	732	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
568	Urban & Hip Hop Artists	1	733	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
569	DJs	1	734	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
570	Pop Groups & Bands	1	735	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N	f	f	\N	f	\N
571	Anniversary 	1	736	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
572	Birthday	1	737	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
573	Bar Mitzvah / Bat Mitzvah	1	738	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
574	Civil Partnership	1	739	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
575	Charity Event	1	740	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
576	Civil Partnership 	1	741	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
577	Corporate Event	1	742	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
578	Exhibition / Trade Fair	1	743	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
579	Hotel / Restaurant Event	1	744	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
580	Exhibition / Trade Fair 	1	745	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
581	Hotel / Restaurant Event 	1	746	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
582	Festival / Outdoor Event 	1	747	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
583	Funeral	1	748	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
584	Holiday Camp / Cruise Ship	1	749	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
585	HM Forces / Army / Navy / RAF Event	1	750	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
586	Regatta / Sporting Event	1	751	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
587	University Event	1	752	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
588	Venue / Pub / Club Event 	1	753	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
589	Private Party	1	754	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
590	Painter	1	755	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
591	Other Event Type	1	756	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N	f	f	\N	f	\N
592	Sculptor	1	757	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
593	Jeweller	1	758	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
53	Mechanic 	1	218	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/business.bbdf319.svg			-1		t	t		\N	f	f	\N	f	\N
122	Fitted Bedrooms / Wardrobes	1	287	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N	f	f	\N	f	\N
190	Writing & Copywriting Guides	1	355	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Business guides		t	t		\N	f	f	\N	f	\N
258	Wills and Trusts	1	423	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N	f	f	\N	f	\N
324	Aerial Installation 	1	489	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Electrician 		t	t		\N	f	f	\N	f	\N
392	Drains – Installation / Unblocking / Cleaning 	1	557	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N	f	f	\N	f	\N
460	Contactless Pick-up & Delivery	1	625	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N	f	f	\N	f	\N
488	Personal Branding	1	653	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Personal Stylist		t	t		\N	f	f	\N	f	\N
527	Color Direction	1	692	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N	f	f	\N	f	\N
595	Grafitti Artist	1	760	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
596	Drawer	1	761	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
597	Ceramicist	1	762	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
598	Drawer 	1	763	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
599	Illustrator	1	764	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
600	Poet	1	765	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
601	Auditory Artist	1	766	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
602	Musical Composer	1	767	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
603	Performing Artist	1	768	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
604	Collage Artist	1	769	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
605	Fine Art Photographer 	1	770	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
606	Video Artist 	1	771	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
607	Installation Artist	1	772	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N	f	f	\N	f	\N
608	Graphic Designer	1	773	2022-03-07 13:00:42	2022-03-07 13:00:42	red	http://77.68.102.60:1000/download?filename=logo1.JPG	Title	Footer	meta,graphic,designer	[{"title":"STYLE","description":"Select your logo style","type":"checkbox","required":"","placeholder":"","defaultvalue":"","inputs":[{"value":"3D"},{"value":"Vintage"},{"value":"Hand-drawn"},{"value":"Cartoon"},{"value":"Watercolor"},{"value":"Signature"},{"value":"Lettering"}]}]	t	t	Public	\N	f	f	\N	f	\N
610	LOGO DESIGN	1	775	2022-03-07 13:09:09	2022-03-07 13:09:09	red	http://77.68.102.60:1000/download?filename=preview.png	LOGO DESIGN TAG	LOGO DESIGN FOOTER	LOGO DESIGN KEYWORDS	LOGO DESIGN DESCRIPTION	t	t	Public	\N	f	f	\N	f	\N
611	Artist	1	776	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N	f	f	\N	f	\N
609	Graphic Designer	1	774	2022-02-23 00:00:00	2022-03-07 00:00:00	blue	http://77.68.102.60:1000/download?filename=preview.png	Title Graphic Design	Graphic Design Footer	Graphic Design Keywords	[{"title":"STYLE","description":"desc","type":"checkbox","required":"","placeholder":"","defaultvalue":"","inputs":[{"value":"3D"},{"value":"Logo"}]}]	t	t	Public	\N	f	f	\N	f	\N
612	SERVICE CATEGORY 001	7	777	2022-03-07 15:25:22	2022-03-07 15:25:22	red		SERVICE CATEGORY 001	SERVICE CATEGORY 001	SERVICE CATEGORY 001	[{"title":"asd","description":"desc","type":"checkbox","required":"","placeholder":"","defaultvalue":"","inputs":[{"value":"AS"}]}]	t	t	Public	\N	f	f	\N	f	\N
614	C-SERVICES CAT-01	8	779	2022-03-10 13:23:26	2022-03-10 13:23:26	red		T	F	K		t	t	Public	\N	f	f	\N	f	\N
615	C-SERVICES CAT-01	8	780	2022-03-10 13:25:09	2022-03-10 13:25:09	red		C-SERVICES CAT-01	C-SERVICES CAT-01	C-SERVICES CAT-01		t	t	Public	\N	f	f	\N	f	\N
616	C-01-CATGEORY SERVICES 01	8	781	2022-03-10 13:28:31	2022-03-10 13:28:31	red		T	F	K		t	t	Public	\N	f	f	\N	f	\N
613	P-SERVICES CAT 01	8	778	2022-03-10 13:20:36	2022-03-10 13:20:36	red	http://77.68.102.60:1000/download?filename=logo1.JPG	P-SERVICES CAT 01	P-SERVICES CAT 01	P-SERVICES CAT 01	[{"title":"Graphic Design","description":"Choose Your Graphic Designer Tool","type":"checkbox","required":"","placeholder":"","defaultvalue":"","inputs":[{"value":"Photoshop"},{"value":"Illustrator"},{"value":"Adobe"}]}]	t	t	Public	\N	f	f	\N	f	\N
618	C-SERVICES  CAT 01	8	783	2022-03-10 14:09:39	2022-03-10 14:09:39	red		TT	F	KK		t	t	Public	\N	f	f	\N	f	\N
619	Artist	1	784	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N	f	f	\N	f	\N
620	cat 2	1	785	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N	f	f	\N	f	\N
621	sub of cat 2	1	786	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N	f	f	\N	f	\N
622	UPS install	1	787	2022-03-10 14:23:22	2022-03-10 14:23:22	red		TT	F	K		t	t	Public	\N	f	f	\N	f	\N
623	C-services-kb 001	8	788	2022-03-10 14:28:52	2022-03-10 14:28:52	red		TT	F			t	t	Public	\N	f	f	\N	f	\N
617	P-SERVICES KB 01	8	782	2022-03-10 14:07:56	2022-03-10 14:07:56	red		TT	F	K	[{"title":"Grsphic categories","description":"Select Graphic designing tool","type":"checkbox","required":"","placeholder":"","defaultvalue":"","inputs":[{"value":"Adobe photoshop"},{"value":"Adobe Xd"}]}]	t	t	Public	\N	f	f	\N	f	\N
624	Artist	1	789	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N	f	f	\N	f	\N
625	sub of cat 2	1	791	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N	f	f	\N	f	\N
626	cat 2	1	790	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N	f	f	\N	f	\N
627	Artist	1	792	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N	f	f	\N	f	\N
628	sub of cat 2	1	794	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N	f	f	\N	f	\N
630	Front Page	1	795	2022-03-14 16:11:29	2022-03-14 16:11:29	red		Title Front Page	Footer	Front Page		t	t	Public	\N	f	f	\N	f	\N
631	Front Page KB 01	1	796	2022-03-15 15:32:40	2022-03-15 15:32:40	red						t	t	Public	\N	f	f	\N	f	\N
632	Front Page Category 01	1	797	2022-03-15 15:41:52	2022-03-15 15:41:52	red						t	t	Public	\N	f	f	\N	f	\N
633	Front Page Category 01	1	798	2022-03-15 17:15:06	2022-03-15 17:15:06	red						t	t	Public	\N	f	f	\N	f	\N
634	Front Page Category 001	1	799	2022-03-15 17:18:45	2022-03-15 17:18:45	red						t	t	Public	\N	f	f	\N	f	\N
635	front page kb	1	800	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	t		\N	f	f	\N	f	\N
636	Front Page KB	1	801	2022-03-16 13:49:06	2022-03-16 13:49:06	red						t	t	Public	\N	f	f	\N	f	\N
638	Front Page KB 03	1	803	2022-03-16 14:20:01	2022-03-16 14:20:01	red						t	f	Public	\N	f	f	\N	f	\N
639	Front Page KB 04	1	804	2022-03-16 14:20:52	2022-03-16 14:20:52	red						t	f	Public	\N	f	f	\N	f	\N
644	Front Page KB 01	1	809	2022-03-17 18:16:34	2022-03-17 18:16:34	red						t	t	Public	\N	f	f	\N	f	\N
645	Front Page KB	1	810	2022-03-17 18:17:48	2022-03-17 18:17:48	red						t	t	Public	\N	f	f	\N	f	\N
656	Child od Category 001	2	820	2022-03-19 11:50:14	2022-03-19 11:50:14	red		Child od Category 001	Child od Category 001	Child od Category 001		t	t	Public	\N	f	f	\N	f	\N
28	Category 002 (Bulgarian (Български))	2	37	2022-02-25 14:54:34	2022-02-25 14:54:34	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	Footer	Keywords	Meta Description	t	t	Public	{"knowledge_base_id":66,"parent_id":null,"category_id":null,"category_icon":"","position":1,"created_at":"2022-03-03","updated_at":"2022-03-03","schedule_at":null,"publish_now":true,"name":"test category","title_tag":"","footer":"","keywords":"","meta_description":"","permission":"","active":true,"group_id":1,"kb_locale_id":1}	f	t	\N	f	\N
657	Services Group Categroy 001	8	821	2022-03-19 12:26:27	2022-03-19 12:26:27	red					[{"title":"Title","description":"Desc","type":"checkbox","required":"","placeholder":"Placeholder","defaultvalue":"12","inputs":[{"value":"Value 01"},{"value":"Value 02"}]}]	t	t	Public	\N	f	f	\N	f	\N
658	Front Page	8	822	2022-03-19 13:08:07	2022-03-19 13:08:07	red	http://77.68.102.60:1000/download?filename=friendlygig-02.png					t	t	Public	\N	f	f	\N	f	\N
653	Schedule Cat 00001	1	818	2022-03-18 14:53:07	2022-03-18 14:53:07	red		TT	FF	KEY WORDS		t	t	Public	{"id":653,"category_id":818,"knowledge_base_id":"71","name":"Schedule Cat 00001","parent_id":-1,"title_tag":"TT","footer":"FF","keywords":"KEY WORDS","schedule_at":"2022-03-24T11:11:00+05:00","meta_description":"","permission":"Public","category_icon":"","position":-1,"active":true,"publish_now":false,"kb_locale_id":1,"group_name":"Group 001"}	f	t	\N	f	\N
654	Schedule Czeh (CesKy) 001	3	818	2022-03-18 14:56:02	2022-03-18 14:56:02	red	http://77.68.102.60:1000/download?filename=friendlygig-02.png	TT	FF	KK		t	t	Public		f	f	\N	f	\N
659	Section 01	8	823	2022-03-19 13:11:23	2022-03-19 13:11:23	red	http://77.68.102.60:1000/download?filename=friendlygig-02.png					t	t	Public	\N	f	f	\N	f	\N
660	Front Page	1	824	2022-03-19 13:29:33	2022-03-19 13:29:33	red						t	t	Public	\N	f	f	\N	f	\N
661	Section 2	8	825	2022-03-19 13:32:26	2022-03-19 13:32:26	red						t	t	Public	\N	f	f	\N	f	\N
663	Section 01	8	827	2022-03-19 13:36:32	2022-03-19 13:36:32	red						t	t	Public	\N	f	f	\N	f	\N
664	Section 01	8	828	2022-03-19 15:19:40	2022-03-19 15:19:40	red						t	t	Public	\N	f	f	\N	f	\N
665	Section 01	8	829	2022-03-19 15:24:58	2022-03-19 15:24:58	red						t	t	Public	\N	f	f	\N	f	\N
666	Section 01	8	830	2022-03-19 15:47:39	2022-03-19 15:47:39	red					{"title":"A whole world of freelance talent at your fingertips","description":"Find high-quality services at every price point. No hourly rates, just project-based pricing.","image":"http://77.68.102.60:1000/download?filename=friendlygig-02.png","listData":[{"title":"The best for every budget","description":"Find high-quality services at every price point. No hourly rates, just project-based pricing.","image":"http://77.68.102.60:1000/download?filename=e37ae023-3d69-411b-99d9-b70150e861d0.jpeg"}]}	t	t	Public	\N	f	f	\N	f	\N
464	Graphic Designer	1	793	2022-02-23 00:00:00	2022-03-07 00:00:00	blue	http://77.68.102.60:1000/download?filename=preview.png	Title Graphic Design	Graphic Design Footer	Graphic Design Keywords		t	t	Public	\N	f	f	\N	f	\N
655	Categroy 01	2	819	2022-03-19 11:47:51	2022-03-19 11:47:51	red		Categroy 01	Categroy 01	Categroy 01		t	t	Public	{"id":655,"category_id":819,"knowledge_base_id":"72","name":"Categroy 01","parent_id":-1,"title_tag":"Categroy 01","footer":"Categroy 01","keywords":"Categroy 01","schedule_at":"2022-03-01T23:40:00+05:00","meta_description":"","permission":"Public","category_icon":"","position":-1,"active":true,"publish_now":false,"kb_locale_id":2,"group_name":"Group No 01"}	f	t	\N	f	\N
662	Contact Page	8	826	2022-03-19 13:36:07	2022-03-19 13:36:07	red						t	t	Public	{"id":662,"category_id":826,"knowledge_base_id":"70","name":"Contact Page","parent_id":-1,"title_tag":"","footer":"","keywords":"","schedule_at":"2022-03-31T22:26:00+05:00","meta_description":"","permission":"Public","category_icon":"","position":-1,"active":true,"publish_now":false,"kb_locale_id":8,"group_name":"Website"}	f	t	\N	f	\N
714	new sub category	8	868	2022-03-24 00:00:00	2022-03-24 00:00:00	red						t	t		\N	f	f	70	f	\N
715	TEST CATEGORY 001	1	869	2022-03-26 11:35:34	2022-03-26 11:35:34	green	http://77.68.102.60:1000/download?filename=img.jpg	TT	Footer	KEYWORDS		t	t	Public	\N	f	f	79	f	\N
629	Graphic Designer	1	793	2022-02-23 00:00:00	2022-03-07 00:00:00	blue	http://77.68.102.60:1000/download?filename=preview.png	Title Graphic Design	Graphic Design Footer	Graphic Design Keywords		t	t	Public	{"knowledge_base_id":66,"parent_id":null,"category_id":null,"category_icon":"","position":1,"created_at":"2022-03-03","updated_at":"2022-03-03","schedule_at":null,"publish_now":true,"name":"test category","title_tag":"","footer":"","keywords":"","meta_description":"","permission":"","active":true,"group_id":1,"kb_locale_id":1}	f	t	\N	f	\N
667	test category	1	793	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	t		\N	f	f	\N	f	\N
679	Section 002	8	844	2022-03-21 12:17:12	2022-03-21 12:17:12	red					{"title":"Title","description":"Description","image":"http://77.68.102.60:1000/download?filename=logo1.JPG","listData":[{"title":"List title","description":"Description","image":"http://77.68.102.60:1000/download?filename=e37ae023-3d69-411b-99d9-b70150e861d0.jpeg"}]}	t	t	Public	\N	f	f	\N	f	\N
668	Section 000001	1	833	2022-03-19 16:13:46	2022-03-19 16:13:46	red	http://77.68.102.60:1000/download?filename=e37ae023-3d69-411b-99d9-b70150e861d0.jpeg					t	t	Public	\N	f	f	\N	f	\N
669	Section 0001	8	834	2022-03-19 16:14:35	2022-03-19 16:14:35	red					{"title":"TITLE","description":"DESC","image":"","listData":[{"title":"TITLE","description":"DESC","image":""}]}	t	t	Public	\N	f	f	\N	f	\N
685	Section 03	8	850	2022-03-21 15:21:07	2022-03-21 15:21:07	red					{"title":"Explore the marketplace","description":"","image":"","listData":[{"title":"Kay Kim, Co-Founder","description":"\\"It's extremely exciting that Friendly Squad has freelancers from all over the world — it broadens the talent pool. One of the best things about Friendly Squad is that while we're sleeping, someone's working.\\"","image":"http://77.68.102.60:1000/download?filename=d3d5ef00-0bdf-446e-80e2-024c7f417093.jpeg"},{"title":" Tim and Dan Joo, Co-Founders ","description":"\\"When you want to create a business bigger than yourself, you need a lot of help. That's what Friendly Squad does.\\"","image":"http://77.68.102.60:1000/download?filename=IMG_1592.JPG"}]}	t	t	Public	\N	f	f	\N	f	\N
686	Study soooo hard	21	851	2022-03-21 18:10:02	2022-03-21 18:10:02	red			Will get thre with full strenth 			t	f	Public	\N	f	f	\N	f	\N
687	Decorator	1	852	2022-03-22 14:45:06	2022-03-22 14:45:06	red						t	t	Public	\N	f	f	\N	f	\N
688	Tiling	1	853	2022-03-22 14:45:25	2022-03-22 14:45:25	red						t	t	Public	\N	f	f	\N	f	\N
689	Water under Floor Heating	1	854	2022-03-22 14:45:46	2022-03-22 14:45:46	red						t	t	Public	\N	f	f	\N	f	\N
671	Section 01	8	836	2022-03-21 11:17:28	2022-03-21 11:17:28	red					{"title":"Title","description":"Description","image":"","listData":[{"title":"List","description":"Desc","image":""}]}	t	t	Public	\N	f	f	\N	f	\N
672	Section 01	8	837	2022-03-21 11:25:43	2022-03-21 11:25:43	red					{"title":"Title","description":"Description","image":"","listData":[{"title":"List title","description":"Description","image":""}]}	t	t	Public	\N	f	f	\N	f	\N
673	Sub Category 01	8	838	2022-03-21 11:28:32	2022-03-21 11:28:32	red						t	t	Public	\N	f	f	\N	f	\N
674	Sub Category 02	8	839	2022-03-21 11:28:49	2022-03-21 11:28:49	red						t	t	Public	\N	f	f	\N	f	\N
675	Sub Category 03	8	840	2022-03-21 11:29:01	2022-03-21 11:29:01	red						t	t	Public	\N	f	f	\N	f	\N
677	Section 01	8	842	2022-03-21 12:10:47	2022-03-21 12:10:47	red					{"title":"A whole world of freelance talent at your fingertips","description":"","image":"http://77.68.102.60:1000/download?filename=3e5a638d-7e67-4b3b-9738-a6e0b64d6293.jpeg","listData":[{"title":"The best for every budget","description":"Find high-quality services at every price point. No hourly rates, just project-based pricing.","image":"http://77.68.102.60:1000/download?filename=e37ae023-3d69-411b-99d9-b70150e861d0.jpeg"},{"title":"Quality work done quickly","description":"Find the right freelancer to begin working on your project within minutes.","image":""}]}	t	t	Public	\N	f	f	\N	f	\N
678	Section 001	8	843	2022-03-21 12:16:58	2022-03-21 12:16:58	red					{"title":"Title","description":"Desc","image":"","listData":[{"title":"List Data","description":"Desc","image":""}]}	t	t	Public	\N	f	f	\N	f	\N
670	Test category	8	835	2022-02-23 00:00:00	2022-03-10 00:00:00	red	http://77.68.102.60:1000/download?filename=preview.png					t	t		\N	f	f	\N	f	\N
680	Section 001	1	845	2022-03-21 12:34:35	2022-03-21 12:34:35	red					{"title":"Title","description":"Desc","image":"","listData":[{"title":"List title","description":"Desc","image":""}]}	t	t	Public	\N	f	f	\N	f	\N
676	Test category	8	841	2022-02-23 00:00:00	2022-03-10 00:00:00	red	http://77.68.102.60:1000/download?filename=preview.png					t	t		\N	f	f	\N	f	\N
681	Section 001	1	846	2022-03-21 13:06:17	2022-03-21 13:06:17	red					{"title":"Title","description":"Description","image":"","listData":[{"title":"List title","description":"Description","image":""}]}	t	t	Public	\N	f	f	\N	f	\N
683	Section 01	1	848	2022-03-21 13:18:07	2022-03-21 13:18:07	red						t	t	Public	\N	f	f	\N	f	\N
684	Section 001	1	849	2022-03-21 13:18:31	2022-03-21 13:18:31	red						t	t	Public	\N	f	f	\N	f	\N
699	Bathroom fitter 	8	862	2022-03-23 20:31:59	2022-03-23 20:31:59	red						t	f	Public	\N	f	f	\N	f	\N
700	dec	8	863	2022-03-23 21:11:51	2022-03-23 21:11:51	red						t	f	Public	\N	f	f	\N	f	\N
698	Decorator	8	861	2022-03-24 12:34:29	2022-03-24 12:34:29	red						t	f	Public	{"id":698,"category_id":861,"knowledge_base_id":"76","name":"Decorator","parent_id":-1,"title_tag":"","footer":"","keywords":"","schedule_at":"2022-01-24T22:25:00+05:00","meta_description":"","permission":"Public","category_icon":"http://77.68.102.60:1000/download?filename=testimonial-video-still-rooted.png","position":1,"active":true,"publish_now":false,"kb_locale_id":8,"group_name":""}	t	t	\N	f	\N
690	babe	7	855	2022-03-22 18:52:20	2022-03-22 18:52:20	red		p				t	t	Public	\N	f	f	\N	f	\N
691	C is the best	8	856	2022-03-23 20:17:21	2022-03-23 20:17:21	red						f	t	Public	\N	f	f	\N	f	\N
692	2	8	857	2022-03-23 20:20:33	2022-03-23 20:20:33	red						t	f	Public	\N	f	f	\N	f	\N
693	2	21	857	2022-03-23 20:21:31	2022-03-23 20:21:31	red						t	f	Public	\N	f	f	\N	f	\N
694	2	21	856	2022-03-23 20:22:26	2022-03-23 20:22:26	red						t	t	Public	\N	f	f	\N	f	\N
695	3	8	858	2022-03-23 20:26:03	2022-03-23 20:26:03	red						t	f	Public	\N	f	f	\N	f	\N
696	Builder	8	859	2022-03-23 20:30:15	2022-03-23 20:30:15	red						t	f	Public	\N	f	f	\N	f	\N
697	Magician	8	860	2022-03-23 20:30:36	2022-03-23 20:30:36	red						t	f	Public	\N	f	f	\N	f	\N
682	Section 007 - Bond	1	847	2022-02-23 00:00:00	2022-03-10 00:00:00	green						f	t		\N	f	f	70	f	\N
701	test category	7	864	2022-03-24 00:00:00	2022-03-24 00:00:00	red						t	t		\N	f	f	\N	f	\N
702	test category	8	864	2022-03-24 00:00:00	2022-03-24 00:00:00	red						t	t		\N	f	f	\N	f	\N
707	plo	2	866	2022-03-24 21:41:52	2022-03-24 21:41:52	red						t	f	Public	\N	f	f	77	f	\N
708	plo	3	866	2022-03-24 21:41:52	2022-03-24 21:41:52	orange						t	f	Public	\N	f	f	77	f	\N
709	plo	1	866	2022-03-24 21:41:52	2022-03-24 21:41:52	red						t	f	Public	\N	f	f	77	f	\N
710	ko	2	867	2022-03-24 21:42:13	2022-03-24 21:42:13	red						t	f	Public	\N	f	f	77	f	\N
711	ko	1	867	2022-03-24 21:42:13	2022-03-24 21:42:13	red						t	f	Public	\N	f	f	77	f	\N
712	ko	3	867	2022-03-24 21:42:13	2022-03-24 21:42:13	orange						t	f	Public	\N	f	f	77	f	\N
713	new sub category	1	868	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	70	f	\N
716	Sub Category 01	1	870	2022-03-26 11:36:52	2022-03-26 11:36:52	green		TT	Footer	Keywords		t	t	Public	\N	f	f	79	f	\N
717	Sub Category 02	1	871	2022-03-26 11:37:17	2022-03-26 11:37:17	green		TT	Footer	Keywords		t	t	Public	\N	f	f	79	f	\N
718	Sub Category 03	1	872	2022-03-26 11:37:38	2022-03-26 11:37:38	green						t	t	Public	\N	f	f	79	f	\N
719	Sub Category 04	1	873	2022-03-26 11:38:04	2022-03-26 11:38:04	green		TT	F	Keywords		t	t	Public	\N	f	f	79	f	\N
720	Sub Category 05	1	874	2022-03-26 11:38:29	2022-03-26 11:38:29	green	http://77.68.102.60:1000/download?filename=img.jpg	TT	Footer			t	t	Public	\N	f	f	79	f	\N
721	Sub Category 06	1	875	2022-03-26 11:44:51	2022-03-26 11:44:51	green	http://77.68.102.60:1000/download?filename=img.jpg	TT	Footer	Keywords		t	t	Public	\N	f	f	79	f	\N
722	Sub Category 07	1	876	2022-03-26 11:47:00	2022-03-26 11:47:00	green		TT	FF	K		t	t	Public	\N	f	f	79	f	\N
732	Category 001	1	880	2022-03-26 19:37:40	2022-03-26 19:37:40	green						t	t	Public	\N	f	f	80	f	\N
733	Sub Category 001	1	881	2022-03-26 19:38:31	2022-03-26 19:38:31	green						t	t	Public	\N	f	f	80	f	\N
735	poiuyt	4	883	2022-03-26 20:29:46	2022-03-26 20:29:46	green						t	t	Public	\N	f	f	81	f	\N
734	oiuyhgtfd	4	882	2022-03-26 20:28:56	2022-03-26 20:28:56	white						t	t	Public	{"id":734,"category_id":882,"knowledge_base_id":"81","name":"oiuyhgtfdlk","parent_id":-1,"title_tag":"","footer":"","keywords":"","schedule_at":"2022-03-18T22:35:00+01:00","meta_description":"","permission":"Public","category_icon":"","position":-1,"active":true,"publish_now":false,"kb_locale_id":4,"group_name":""}	f	t	81	f	\N
736	.;lknbh	4	884	2022-03-26 20:38:45	2022-03-26 20:38:45	red						t	f	Public	\N	f	f	81	f	\N
737	.;lknbh	4	884	2022-03-26 20:38:45	2022-03-26 20:38:45	red						t	f	Public	\N	f	f	81	f	\N
738	.;lknbh	16	884	2022-03-26 20:38:45	2022-03-26 20:38:45	orange						t	f	Public	\N	f	f	81	f	\N
739	.;lknbh	16	884	2022-03-26 20:38:45	2022-03-26 20:38:45	orange						t	f	Public	\N	f	f	81	f	\N
740	p	6	885	2022-03-27 18:49:24	2022-03-27 18:49:24	orange						t	f	Public	\N	f	f	82	f	\N
741	p	5	885	2022-03-27 18:49:24	2022-03-27 18:49:24	red						t	f	Public	\N	f	f	82	f	\N
742	p	16	885	2022-03-27 18:49:24	2022-03-27 18:49:24	red						t	f	Public	\N	f	f	82	f	\N
743	p	6	886	2022-03-27 18:49:38	2022-03-27 18:49:38	orange						t	f	Public	\N	f	f	82	f	\N
744	p	16	886	2022-03-27 18:49:38	2022-03-27 18:49:38	red						t	f	Public	\N	f	f	82	f	\N
745	p	5	886	2022-03-27 18:49:38	2022-03-27 18:49:38	red						t	f	Public	\N	f	f	82	f	\N
47	Plumber 	1	212	2022-03-28 13:25:52	2022-03-28 13:25:52	green	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/graphics-design.d32a2f8.svg		Footer Goes			t	t	Public	\N	f	f	39	f	\N
704	updated Category	1	865	2022-02-23 00:00:00	2022-03-10 00:00:00	green						f	t		\N	f	f	78	f	\N
730	subcategory 4	8	879	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
731	subcategory 4	7	879	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
746	1	5	887	2022-03-28 19:03:11	2022-03-28 19:03:11	red						t	t	Public	\N	f	f	85	f	\N
729	subcategory 4.	1	879	2022-02-23 00:00:00	2022-03-10 00:00:00	green						f	t		\N	f	f	78	f	\N
723	subcategory 2	1	877	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
724	subcategory 2	8	877	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
725	subcategory 2	7	877	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
749	subcategory 4 friend	8	888	2022-03-24 00:00:00	2022-03-24 00:00:00	red						t	t		\N	f	f	78	f	\N
750	subcategory 4 friend	7	888	2022-03-24 00:00:00	2022-03-24 00:00:00	red						t	t		\N	f	f	78	f	\N
751	subcategory 4 friend	1	888	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
747	1	1	887	2022-03-28 19:03:11	2022-03-28 19:03:11	green						t	t	Public	\N	f	f	85	f	\N
748	1	18	887	2022-03-28 19:03:11	2022-03-28 19:03:11	red						t	t	Public	\N	f	f	85	f	\N
726	subcategory 3	1	878	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
727	subcategory 3	7	878	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
728	subcategory 3	8	878	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
705	new sub category	7	865	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
706	new sub category	8	865	2022-03-24 00:00:00	2022-03-24 00:00:00	green						t	t		\N	f	f	78	f	\N
753	test category	7	864	2022-04-05 16:50:56	2022-04-05 16:50:56	red	icon	tag	foot	a,x	{ type: GraphQLString}	t	t	public	\N	f	f	78	f	\N
754	test category	8	864	2022-04-05 16:50:56	2022-04-05 16:50:56	red	icon	tag	foot	a,x	{ type: GraphQLString}	t	t	public	\N	f	f	78	f	\N
756	test category	7	864	2022-04-05 16:58:46	2022-04-05 16:58:46	red	icon	tag	foot	a,x	{ type: GraphQLString}	t	t	public	\N	f	f	78	f	\N
757	test category	8	864	2022-04-05 16:58:46	2022-04-05 16:58:46	red	icon	tag	foot	a,x	{ type: GraphQLString}	t	t	public	\N	f	f	78	f	\N
703	test category	1	864	2022-04-06 11:38:52	2022-04-06 11:38:52	green	icon	tag	foot	a,x	{ type: GraphQLString}	t	t	public	\N	f	f	78	f	\N
752	test category	1	864	2022-04-06 11:38:52	2022-04-06 11:38:52	green	icon	tag	foot	a,x	{ type: GraphQLString}	t	t	public	\N	f	f	78	f	\N
755	test category	1	864	2022-04-06 11:38:52	2022-04-06 11:38:52	green	icon	tag	foot	a,x	{ type: GraphQLString}	t	t	public	\N	f	f	78	f	\N
43	Category 001 English (United States)	1	47	2022-03-01 17:21:20	2022-03-01 17:21:20	gray	http://77.68.102.60:1000/download?filename=preview.png	Title Tag	Footer	Keywords	Meta Description	t	t	Public	\N	f	f	\N	t	\N
44	Categroy 001 (English (Great Britain))	8	47	2022-03-01 17:21:37	2022-03-01 17:21:37	gray	http://77.68.102.60:1000/download?filename=preview.png	Title tag	Footer	Keywords	Meta Description	t	t	Public	\N	f	f	\N	t	\N
78	Power Showers and Pump	1	243	2022-03-04 12:18:08	2022-03-04 12:18:08	yellow				Plumber		t	t		{"knowledge_base_id":"78","parent_id":"-1","category_id":"200","kb_locale_id":"1","category_icon":"","position":1,"created_at":null,"updated_at":null,"schedule_at":null,"publish_now":true,"name":"sample","title_tag":"title","footer":"footer","keywords":"a,b","meta_description":"desc","permission":"public","active":true,"list_id":null}	t	t	\N	f	\N
\.


--
-- Data for Name: knowledge_base_lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_base_lists (id, knowledge_base_id, list_type, title, "position", created_at) FROM stdin;
\.


--
-- Data for Name: knowledge_base_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_base_translations (id, knowledge_base_id, title, created_at, updated_at, footer_note, kb_locale_id, active, "position", ui_color, is_archived) FROM stdin;
281	69	English (United States)	2022-03-16 11:20:53.682897	2022-03-16 11:20:53.682897		1	t	1	red	f
291	71	English (United States)	2022-03-18 14:47:52.223652	2022-03-18 14:47:52.223652		1	t	1	red	f
292	71	Czech (Česky)	2022-03-18 14:47:52.224811	2022-03-18 14:47:52.224811		3	f	1	red	f
230	35	English (United States)	2022-03-03 16:31:53.045053	2022-03-03 16:31:53.045053		1	t	1	red	f
295	72	English (United States)	2022-03-19 11:42:50.505827	2022-03-19 11:42:50.505827		1	t	1	red	f
296	72	Bulgarian (Български)	2022-03-19 11:42:50.513645	2022-03-19 11:42:50.513645		2	f	1	red	f
298	73	Norsk bokmål	2022-03-21 18:18:10.704877	2022-03-21 18:18:10.704877		21	f	1	red	f
299	73	English (United States)	2022-03-21 18:18:10.70965	2022-03-21 18:18:10.70965		1	t	1	red	f
1	1	English (Great Britain)	2022-02-14 14:11:58.666772	2022-02-14 14:30:00		2	f	1	red	f
3	1	English (Canada)	2022-02-14 14:36:52.948796	2022-02-14 14:36:52.948796		1	f	1	red	f
4	8		2022-02-18 13:52:07.240286	2022-02-18 13:52:07.240286		1	f	1	red	f
5	8		2022-02-18 13:52:07.254196	2022-02-18 13:52:07.254196		2	f	1	red	f
6	8		2022-02-18 13:52:07.255772	2022-02-18 13:52:07.255772		3	f	1	red	f
10	12		2022-02-18 16:10:19.68883	2022-02-18 16:10:19.68883		1	f	1	red	f
11	12		2022-02-18 16:10:19.691744	2022-02-18 16:10:19.691744		2	f	1	red	f
12	12		2022-02-18 16:10:19.693625	2022-02-18 16:10:19.693625		3	f	1	red	f
312	76	English (Great Britain)	2022-03-23 20:29:55.720937	2022-03-23 20:29:55.720937		8	t	1	red	f
263	66	English (United States)	2022-03-10 15:44:40.333634	2022-03-10 15:44:40.333634		1	t	1	red	f
265	67	English (United States)	2022-03-14 16:10:41.577253	2022-03-14 16:10:41.577253		1	t	1	red	f
325	39	English (United States)	2022-03-24 15:22:15.028098	2022-03-24 15:22:15.028098		1	t	1	red	f
326	39	English (Canada)	2022-03-24 15:22:15.030951	2022-03-24 15:22:15.030951		7	f	2	red	f
315	77	Bulgarian (Български)	2022-03-24 11:19:02.599912	2022-03-24 11:19:02.599912		2	f	1	red	f
313	77	English (United States)	2022-03-24 11:19:02.589642	2022-03-24 11:19:02.589642		1	f	3	red	f
314	77	Czech (Česky)	2022-03-24 11:19:02.593539	2022-03-24 11:19:02.593539		3	t	2	red	f
332	80	Bulgarian (Български)	2022-03-26 19:42:19.668192	2022-03-26 19:42:19.668192		2	f	2	red	f
331	80	English (United States)	2022-03-26 19:42:19.667039	2022-03-26 19:42:19.667039		1	t	1	red	f
328	70	English (Great Britain)	2022-03-25 19:10:50.877657	2022-03-25 19:10:50.877657		8	f	2	red	f
327	70	English (United States)	2022-03-25 19:10:50.872744	2022-03-25 19:10:50.872744		1	t	1	red	f
347	85	Greek (Ελληνικά)	2022-03-28 19:02:07.497644	2022-03-28 19:02:07.497644		5	f	2	red	f
346	85	Japanese (日本語)	2022-03-28 19:02:07.488388	2022-03-28 19:02:07.488388		18	\N	3	red	f
329	79	English (United States)	2022-03-26 11:34:25.085654	2022-03-26 11:34:25.085654		1	t	1	red	f
348	85	English (United States)	2022-03-28 19:02:07.50128	2022-03-28 19:02:07.50128		1	t	1	red	f
334	81	Dansk	2022-03-26 20:38:17.014968	2022-03-26 20:38:17.014968		4	t	1	red	f
335	81	Dansk	2022-03-26 20:38:17.016627	2022-03-26 20:38:17.016627		4	f	2	red	f
336	81	Magyar	2022-03-26 20:38:17.017468	2022-03-26 20:38:17.017468		16	\N	4	orange	f
337	81	Magyar	2022-03-26 20:38:17.018425	2022-03-26 20:38:17.018425		16	\N	3	orange	f
338	82	Eesti	2022-03-27 18:48:30.083251	2022-03-27 18:48:30.083251		6	t	1	orange	f
340	82	Magyar	2022-03-27 18:48:30.088767	2022-03-27 18:48:30.088767		16	\N	3	red	f
339	82	Greek (Ελληνικά)	2022-03-27 18:48:30.085401	2022-03-27 18:48:30.085401		5	\N	2	red	f
341	84	English (United States)	2022-03-28 16:16:18.441762	2022-03-28 16:16:18.441762		1	f	1	red	f
342	84	Czech (Česky)	2022-03-28 16:16:18.456504	2022-03-28 16:16:18.456504		3	t	3	red	f
343	84	Bulgarian (Български)	2022-03-28 16:16:18.4584	2022-03-28 16:16:18.4584		2	f	2	red	f
345	83	English (United States)	2022-03-28 16:18:58.405635	2022-03-28 16:18:58.405635		1	t	1	red	f
349	86	English (United States)	2022-04-02 14:43:57.492717	2022-04-02 14:43:57.492717		1	f	1	red	f
350	86	Bulgarian (Български)	2022-04-02 14:43:57.495439	2022-04-02 14:43:57.495439		2	t	2	red	f
356	47	English (United States)	2022-04-02 15:59:32.300616	2022-04-02 15:59:32.300616		1	t	1	red	f
322	78	English (United States)	2022-03-24 14:15:22.413648	2022-03-24 14:15:22.413648		1	t	3	red	f
324	78	English (Great Britain)	2022-03-24 14:15:22.423437	2022-03-24 14:15:22.423437		8	f	2	red	f
323	78	English (Canada)	2022-03-24 14:15:22.421661	2022-03-24 14:15:22.421661		7	f	1	red	f
357	87	English (United States)	2022-04-05 14:21:53.308754	2022-04-05 14:21:53.308754		1	t	1	red	f
\.


--
-- Data for Name: knowledge_bases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_bases (id, name, icon, footer, created_at, homepage_layout, category_layout, active, updated_at, front_page, "position", ui_color, is_archived) FROM stdin;
87	My KB	icon	test foote	2022-04-05 14:21:53.230256	page	test category layout	t	2022-04-05 14:21:53.230256	front	1	red	f
86	Knowledgebase 123	white	test	2022-04-02 14:43:57.378477	home	category	t	2022-04-02 14:43:57.378477	front	2	red	f
72	Add Group	http://77.68.102.60:1000/download?filename=friendlygig-02.png	Add group	2022-03-17 16:10:52.343226	No		t	2022-03-19 11:42:50	Group No 01,Group No 02,Group No 03	3	red	f
83	Check language list		Footer	2022-03-28 16:12:01.126156	No		f	2022-03-28 16:18:58		4	red	f
85	Check language list		Footer	2022-03-28 16:17:23.937624	No		f	2022-03-28 19:02:07		5	red	f
84	Knowledge Base Z			2022-03-28 16:16:18.424435			t	2022-03-28 16:16:18.424435		6	red	f
78	Knowledge base X			2022-03-24 12:32:13.232479			t	2022-03-24 14:15:22		7	red	f
81	iuytgf			2022-03-26 20:28:13.956314	No		f	2022-03-26 20:38:17		8	red	f
80	TITLE		FOOTER	2022-03-26 19:36:05.979182	No		f	2022-03-26 19:42:19		9	red	f
82	p			2022-03-27 18:48:30.063786	No		f	2022-03-27 18:48:30.063786		10	red	f
70	Service	http://77.68.102.60:1000/download?filename=preview.png	Footer 	2022-03-16 13:12:19.70229	No		t	2022-03-25 19:10:50	Front Page KB,Service,Forms	11	red	f
79	TEST KB 01	http://77.68.102.60:1000/download?filename=img.jpg	TEST KB FOOTER	2022-03-26 11:34:25.071601	No		t	2022-03-26 11:34:25.071601	GROUP 01,Group 02,Group 03	12	red	f
39	Professions	http://77.68.102.60:1000/download?filename=friendlygig-02.png	Footeras	2022-03-04 11:43:33.258726	Yes		t	2022-03-24 15:22:15	Front Page KB,Website,Service,Forms	13	red	f
73	Ms		With Love	2022-03-21 18:08:41.63144	No		t	2022-03-21 18:18:10		14	red	f
66	Import test			2022-03-10 15:44:40.331667			t	2022-03-10 15:44:40.331667	true	15	red	f
40	KB 004			2022-03-04 17:59:07.358926	Yes		t	2022-03-04 17:59:07.358926	false	16	red	f
71	test db			2022-03-17 14:56:59.721886	No		t	2022-03-18 14:47:52	Group 001	17	red	f
43	KB 007			2022-03-04 17:59:47.324954	No		f	2022-03-04 17:59:47.324954	false	18	red	f
76	Website seller categories			2022-03-23 20:29:55.709479	No		f	2022-03-23 20:29:55.709479		19	red	f
44	KB 009			2022-03-04 17:59:58.289394	No		f	2022-03-04 17:59:58.289394	false	20	red	f
48	KB 0012			2022-03-04 18:00:58.814214	No		f	2022-03-04 18:00:58.814214	false	21	red	f
45	KB 0010			2022-03-04 18:00:11.085409	No		f	2022-03-04 18:00:11.085409	false	22	red	f
46	KB 0011			2022-03-04 18:00:22.771173	No		t	2022-03-04 18:00:22.771173	false	23	red	f
77	my test db			2022-03-24 11:19:02.572159			t	2022-03-24 11:19:02.572159		24	red	f
41	KB 005			2022-03-04 17:59:23.463178	No		f	2022-03-04 17:59:23.463178	false	25	red	f
47	test	white	test	2022-03-04 18:00:45.500583	home	category	t	2022-04-02 15:59:32	front	26	red	f
67	Website		Website	2022-03-14 16:10:41.539514	No		t	2022-03-14 16:10:41.539514	false	27	red	f
50	FRONT PAGE			2022-03-05 14:30:08.683739	Yes		t	2022-03-05 14:30:08.683739	true	28	red	f
69	kb_name			2022-03-16 11:20:53.657218			t	2022-03-16 11:20:53.657218	front page kb, services, others	29	red	f
49	KB 0013			2022-03-04 18:01:12.139619	No		f	2022-03-04 18:01:12.139619	false	30	red	f
42	KB 006			2022-03-04 17:59:35.813657	No		f	2022-03-04 17:59:35.813657	false	31	red	f
\.


--
-- Data for Name: locales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locales (id, locale, alias, name, dir, active, created_at, updated_at) FROM stdin;
1	en-us	en	English (United States)	ltr	t	2022-02-15 11:44:38.257292	2022-02-15 11:44:38.257292
2	bg		Bulgarian (Български)	ltr	t	2022-02-15 11:44:38.257292	2022-02-15 11:44:38.257292
3	cs		Czech (Česky)	ltr	t	2022-02-15 12:24:44.968958	2022-02-15 12:24:44.968958
4	da		Dansk	ltr	t	2022-02-15 12:25:04.284412	2022-02-15 12:25:04.284412
5	el		Greek (Ελληνικά)	ltr	t	2022-02-15 12:25:26.199941	2022-02-15 12:25:26.199941
6	et		Eesti	ltr	t	2022-02-15 12:25:43.885589	2022-02-15 12:25:43.885589
7	en-ca		English (Canada)	ltr	t	2022-02-15 12:26:07.26591	2022-02-15 12:26:07.26591
8	en-gb		English (Great Britain)	ltr	t	2022-02-15 12:26:19.817961	2022-02-15 12:26:19.817961
9	en-es	es	Español	ltr	t	2022-02-15 12:26:39.447434	2022-02-15 12:26:39.447434
10	en-co		Español (Colombia)	ltr	t	2022-02-15 12:26:57.5767	2022-02-15 12:26:57.5767
11	es-mx		Español (México)	ltr	t	2022-02-15 12:27:29.320062	2022-02-15 12:27:29.320062
12	fi		Suomi	ltr	t	2022-02-15 12:27:43.825783	2022-02-15 12:27:43.825783
13	fr-fr		Français	ltr	t	2022-02-15 12:27:59.775969	2022-02-15 12:27:59.775969
14	fr-ca		Français (Canada)	ltr	t	2022-02-15 12:28:10.685748	2022-02-15 12:28:10.685748
15	hr		Hrvatski	ltr	t	2022-02-15 12:28:25.776869	2022-02-15 12:28:25.776869
16	hu		Magyar	ltr	t	2022-02-15 12:28:39.520004	2022-02-15 12:28:39.520004
17	it-it		Italiano	ltr	t	2022-02-15 12:28:52.576119	2022-02-15 12:28:52.576119
18	ja		Japanese (日本語)	ltr	t	2022-02-15 12:29:13.094514	2022-02-15 12:29:13.094514
19	lt		 Lietuvių kalba	ltr	t	2022-02-15 12:29:42.677972	2022-02-15 12:29:42.677972
20	lv		Latvijas	ltr	t	2022-02-15 12:30:42.265068	2022-02-15 12:30:42.265068
21	no-no	nb	Norsk bokmål	ltr	t	2022-02-15 12:31:04.437304	2022-02-15 12:31:04.437304
22	nl-nl	nl	Nederlands	ltr	t	2022-02-15 12:31:22.804236	2022-02-15 12:31:22.804236
23	pl		Polski	ltr	t	2022-02-15 12:31:36.497171	2022-02-15 12:31:36.497171
24	pt-pt	pt	Português	ltr	t	2022-02-15 12:31:51.438377	2022-02-15 12:31:51.438377
25	pt-bt	pt	Português Brasileiro	ltr	t	2022-02-15 12:32:10.244503	2022-02-15 12:32:10.244503
26	ru		Russian (Русский)	ltr	t	2022-02-15 12:32:27.716393	2022-02-15 12:32:27.716393
27	sk		Slovak (Slovenčina)	ltr	t	2022-02-15 12:32:42.3983	2022-02-15 12:32:42.3983
28	sl		Slovenian (Slovenčina)	ltr	t	2022-02-15 12:33:00.044686	2022-02-15 12:33:00.044686
29	sv-se	sv	Svenska	ltr	t	2022-02-15 12:33:14.296609	2022-02-15 12:33:14.296609
30	tr		Türkçe	ltr	t	2022-02-15 12:33:26.235999	2022-02-15 12:33:26.235999
31	uk		Ukrainian (Українська)	ltr	t	2022-02-15 12:33:37.525416	2022-02-15 12:33:37.525416
32	vi		Vietnam (ViɆt Nam)	ltr	t	2022-02-15 12:33:51.536644	2022-02-15 12:33:51.536644
33	zh-cn		Chinese (Sim.) (简体中文)	ltr	t	2022-02-15 12:34:07.104963	2022-02-15 12:34:07.104963
34	hi-in	hi	Hindi (हिंदी)	ltr	t	2022-02-15 12:34:25.606234	2022-02-15 12:34:25.606234
35	de-de	de	Deutsch	ltr	t	2022-02-15 12:35:42.540308	2022-02-15 12:35:42.540308
36	he-il		Hebrew (עִבְרִית)	ltr	t	2022-02-15 12:36:05.71939	2022-02-15 12:36:05.71939
37	fa-ir	fa	Persian (فارسى)	ltr	t	2022-02-15 12:36:31.226267	2022-02-15 12:36:31.226267
38	ms-my	ms	Malay (Bahasa Malaysia)	ltr	t	2022-02-15 12:36:51.766312	2022-02-15 12:36:51.766312
39	ro-ro	ro	Romanian (Românesc)	ltr	t	2022-02-15 12:37:08.185943	2022-02-15 12:37:08.185943
40	ar	ar	Arabic	ltr	t	2022-02-15 12:37:26.311686	2022-02-15 12:37:26.311686
41	sr-latn-rs	sr	Serbian (srpski)	ltr	t	2022-02-15 12:37:49.752652	2022-02-15 12:37:49.752652
42	is		Icelandic (Íslenska)	ltr	t	2022-02-15 12:39:36.078741	2022-02-15 12:39:36.078741
43	rw		Ikinyarwanda	ltr	t	2022-02-15 12:39:48.559996	2022-02-15 12:39:48.559996
44	ko-kr	ko	Korean (한국어)	ltr	t	2022-02-15 12:40:05.329681	2022-02-15 12:40:05.329681
45	es-ca	ko	Català	ltr	t	2022-02-15 12:40:20.320007	2022-02-15 12:40:20.320007
46	zh-tw		Chinese (Trad.) (繁體中文)	ltr	t	2022-02-15 12:40:37.373927	2022-02-15 12:40:37.373927
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test."user" (name) FROM stdin;
\.


--
-- Name: knowledge_base_activity_streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_base_activity_streams_id_seq', 86, true);


--
-- Name: knowledge_base_answer_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_base_answer_translations_id_seq', 81, true);


--
-- Name: knowledge_base_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_base_answers_id_seq', 59, true);


--
-- Name: knowledge_base_article_delayed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_base_article_delayed_jobs_id_seq', 29, true);


--
-- Name: knowledge_base_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_base_categories_id_seq', 888, true);


--
-- Name: knowledge_base_category_delayed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_base_category_delayed_jobs_id_seq', 71, true);


--
-- Name: knowledge_base_category_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_base_category_translations_id_seq', 757, true);


--
-- Name: knowledge_base_lists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_base_lists_id_seq', 1, false);


--
-- Name: knowledge_base_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_base_translations_id_seq', 357, true);


--
-- Name: knowledge_bases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_bases_id_seq', 87, true);


--
-- Name: locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locales_id_seq', 46, true);


--
-- Name: activity_streams knowledge_base_activity_streams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_streams
    ADD CONSTRAINT knowledge_base_activity_streams_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_article_translations knowledge_base_answer_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_article_translations
    ADD CONSTRAINT knowledge_base_answer_translations_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_articles knowledge_base_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_articles
    ADD CONSTRAINT knowledge_base_answers_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_article_delayed_jobs knowledge_base_article_delayed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_article_delayed_jobs
    ADD CONSTRAINT knowledge_base_article_delayed_jobs_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_categories knowledge_base_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_categories
    ADD CONSTRAINT knowledge_base_categories_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_category_delayed_jobs knowledge_base_category_delayed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_category_delayed_jobs
    ADD CONSTRAINT knowledge_base_category_delayed_jobs_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_category_translations knowledge_base_category_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_category_translations
    ADD CONSTRAINT knowledge_base_category_translations_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_lists knowledge_base_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_lists
    ADD CONSTRAINT knowledge_base_lists_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_translations knowledge_base_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_translations
    ADD CONSTRAINT knowledge_base_translations_pkey PRIMARY KEY (id);


--
-- Name: knowledge_bases knowledge_bases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_bases
    ADD CONSTRAINT knowledge_bases_pkey PRIMARY KEY (id);


--
-- Name: locales locales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locales
    ADD CONSTRAINT locales_pkey PRIMARY KEY (id);


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_ddl();


ALTER EVENT TRIGGER postgraphile_watch_ddl OWNER TO postgres;

--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_drop();


ALTER EVENT TRIGGER postgraphile_watch_drop OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

