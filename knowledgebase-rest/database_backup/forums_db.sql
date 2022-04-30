--
-- PostgreSQL database dump
--

-- Dumped from database version 10.19 (Ubuntu 10.19-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.19 (Ubuntu 10.19-0ubuntu0.18.04.1)

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
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: attachinary_files; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.attachinary_files (
    id integer NOT NULL,
    attachinariable_id integer,
    attachinariable_type character varying,
    scope character varying,
    public_id character varying,
    version character varying,
    width integer,
    height integer,
    format character varying,
    resource_type character varying,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.attachinary_files OWNER TO knowledgebase;

--
-- Name: attachinary_files_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.attachinary_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attachinary_files_id_seq OWNER TO knowledgebase;

--
-- Name: attachinary_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.attachinary_files_id_seq OWNED BY public.attachinary_files.id;


--
-- Name: backups; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.backups (
    id integer NOT NULL,
    user_id integer,
    csv text,
    model character varying,
    csv_name character varying,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.backups OWNER TO knowledgebase;

--
-- Name: backups_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.backups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.backups_id_seq OWNER TO knowledgebase;

--
-- Name: backups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.backups_id_seq OWNED BY public.backups.id;


--
-- Name: flags; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.flags (
    id integer NOT NULL,
    post_id integer,
    generated_topic_id integer,
    reason text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.flags OWNER TO knowledgebase;

--
-- Name: flags_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.flags_id_seq OWNER TO knowledgebase;

--
-- Name: flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.flags_id_seq OWNED BY public.flags.id;


--
-- Name: forums; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.forums (
    id integer NOT NULL,
    name character varying,
    description text,
    topics_count integer DEFAULT 0 NOT NULL,
    last_post_date timestamp without time zone,
    last_post_id integer,
    private boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    allow_topic_voting boolean DEFAULT false,
    allow_post_voting boolean DEFAULT false,
    layout character varying DEFAULT 'table'::character varying
);


ALTER TABLE public.forums OWNER TO knowledgebase;

--
-- Name: forums_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.forums_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forums_id_seq OWNER TO knowledgebase;

--
-- Name: forums_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.forums_id_seq OWNED BY public.forums.id;


--
-- Name: imports; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.imports (
    id integer NOT NULL,
    status character varying,
    notes character varying,
    model character varying,
    started_at timestamp without time zone,
    completed_at timestamp without time zone,
    submitted_record_count integer,
    imported_ids text,
    error_log text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.imports OWNER TO knowledgebase;

--
-- Name: imports_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.imports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.imports_id_seq OWNER TO knowledgebase;

--
-- Name: imports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.imports_id_seq OWNED BY public.imports.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    topic_id integer,
    user_id integer,
    body text,
    kind character varying,
    active boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    points integer DEFAULT 0,
    attachements character varying,
    cc character varying,
    bcc character varying,
    raw_email text,
    email_to_address character varying
);


ALTER TABLE public.posts OWNER TO knowledgebase;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO knowledgebase;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying,
    taggings_count integer DEFAULT 0,
    show_on_helpcenter boolean DEFAULT false,
    show_on_admin boolean DEFAULT false,
    show_on_dashboard boolean DEFAULT false,
    description text,
    color character varying,
    active boolean DEFAULT true,
    email_address character varying,
    email_name character varying
);


ALTER TABLE public.tags OWNER TO knowledgebase;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO knowledgebase;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: topics; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    forum_id integer,
    user_id integer,
    subject character varying,
    points integer,
    message text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.topics OWNER TO knowledgebase;

--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topics_id_seq OWNER TO knowledgebase;

--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- Name: votes; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.votes (
    id integer NOT NULL,
    points integer DEFAULT 1,
    voteable_type character varying,
    voteable_id integer,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.votes OWNER TO knowledgebase;

--
-- Name: votes_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.votes_id_seq OWNER TO knowledgebase;

--
-- Name: votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.votes_id_seq OWNED BY public.votes.id;


--
-- Name: attachinary_files id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.attachinary_files ALTER COLUMN id SET DEFAULT nextval('public.attachinary_files_id_seq'::regclass);


--
-- Name: backups id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.backups ALTER COLUMN id SET DEFAULT nextval('public.backups_id_seq'::regclass);


--
-- Name: flags id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.flags ALTER COLUMN id SET DEFAULT nextval('public.flags_id_seq'::regclass);


--
-- Name: forums id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.forums ALTER COLUMN id SET DEFAULT nextval('public.forums_id_seq'::regclass);


--
-- Name: imports id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.imports ALTER COLUMN id SET DEFAULT nextval('public.imports_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- Name: votes id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.votes ALTER COLUMN id SET DEFAULT nextval('public.votes_id_seq'::regclass);


--
-- Data for Name: attachinary_files; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.attachinary_files (id, attachinariable_id, attachinariable_type, scope, public_id, version, width, height, format, resource_type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: backups; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.backups (id, user_id, csv, model, csv_name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: flags; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.flags (id, post_id, generated_topic_id, reason, created_at, updated_at) FROM stdin;
1	2	0	spam	2022-02-17 15:07:52	2022-02-17 15:07:52
\.


--
-- Data for Name: forums; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.forums (id, name, description, topics_count, last_post_date, last_post_id, private, created_at, updated_at, allow_topic_voting, allow_post_voting, layout) FROM stdin;
12	Bugs and Issues	Report Bugs here!	0	2022-03-03 15:06:46	\N	t	2022-03-03 15:06:46	2022-03-03 15:06:46	t	t	
14	Disputes	When things don't g as expected.	0	2022-03-03 15:07:08	\N	t	2022-03-03 15:07:08	2022-03-03 15:07:08	t	t	
15	Feature Requests	Suggest and vote on what features we should add next!	0	2022-03-03 15:07:47	\N	t	2022-03-03 15:07:47	2022-03-03 15:07:47	t	t	
16	Idea Board	Submit Ideas for HR to consider	0	2022-03-03 15:08:20	\N	t	2022-03-03 15:08:20	2022-03-03 15:08:20	t	t	
17	New Community 001	New Community 001 Description	0	2022-03-03 15:08:40	\N	t	2022-03-03 15:08:40	2022-03-03 15:08:40	t	t	
18	Test forum another	This is the description for the test forum another	3	2022-03-07 14:56:51	\N	f	2022-03-07 14:56:51	2022-03-07 14:56:51	f	f	
\.


--
-- Data for Name: imports; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.imports (id, status, notes, model, started_at, completed_at, submitted_record_count, imported_ids, error_log, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.posts (id, topic_id, user_id, body, kind, active, created_at, updated_at, points, attachements, cc, bcc, raw_email, email_to_address) FROM stdin;
1	0	0			t	2022-02-17 12:39:01	2022-02-17 12:39:01	0			false	0	
2	1	0	This is a test topic body		t	2022-02-17 12:40:44	2022-02-17 12:40:44	0			false	0	
3	0	0	some body		t	2022-02-17 15:01:42	2022-02-17 15:01:42	0			false	0	
4	8	0	What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.	note	t	2022-03-04 16:22:46	2022-03-04 16:22:46	0			false	0	
5	7	0	What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.	note	t	2022-03-04 16:28:05	2022-03-04 16:28:05	0			false	0	
6	8	0	Where can I get some?\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.	note	t	2022-03-04 16:41:00	2022-03-04 16:41:00	0			false	0	
7	8	0	Where can I get some?\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.	note	t	2022-03-04 16:41:39	2022-03-04 16:41:39	0			false	0	
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.tags (id, name, taggings_count, show_on_helpcenter, show_on_admin, show_on_dashboard, description, color, active, email_address, email_name) FROM stdin;
1	curiosity explorer	0	f	f	f	mars explorer	brown	t		
\.


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.topics (id, forum_id, user_id, subject, points, message, created_at, updated_at) FROM stdin;
1	1	\N	zatelkasten method	4		2022-02-17 15:59:08	2022-02-17 15:59:08
3	1	\N	Updated topic	1	How to submit a ticket	2022-03-02 16:28:47	2022-03-02 16:28:47
5	12	\N	Topic 002	2	<p>Topic 002</p>	2022-03-02 17:33:45	2022-03-02 17:33:45
4	12	\N	Topic 001	3	<p>Topic 001</p>	2022-03-02 17:25:01	2022-03-02 17:25:01
6	14	\N	Discussion001	27	<p>Discussion001</p>	2022-03-02 17:56:22	2022-03-02 17:56:22
7	12	\N	Topic 003	0	Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.	2022-03-04 14:57:01	2022-03-04 14:57:01
8	12	\N	Topic 003	0	Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.	2022-03-04 15:00:19	2022-03-04 15:00:19
9	15	\N	Feature REQUEST 001	0	Lorem Ipsum is simply a dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1500.	2022-03-04 15:01:57	2022-03-04 15:01:57
10	16	\N	Discussion 001	0	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s	2022-03-04 15:06:31	2022-03-04 15:06:31
11	16	\N	Discussion 002	0	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s	2022-03-04 15:08:48	2022-03-04 15:08:48
12	16	\N	Discussion 003	0	Message	2022-03-04 15:11:25	2022-03-04 15:11:25
13	15	\N	Feature REQUEST 002	0	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s	2022-03-04 15:14:06	2022-03-04 15:14:06
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.votes (id, points, voteable_type, voteable_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: attachinary_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.attachinary_files_id_seq', 1, false);


--
-- Name: backups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.backups_id_seq', 1, false);


--
-- Name: flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.flags_id_seq', 1, true);


--
-- Name: forums_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.forums_id_seq', 18, true);


--
-- Name: imports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.imports_id_seq', 1, false);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.posts_id_seq', 7, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, true);


--
-- Name: topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.topics_id_seq', 13, true);


--
-- Name: votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.votes_id_seq', 1, false);


--
-- Name: attachinary_files attachinary_files_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.attachinary_files
    ADD CONSTRAINT attachinary_files_pkey PRIMARY KEY (id);


--
-- Name: backups backups_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.backups
    ADD CONSTRAINT backups_pkey PRIMARY KEY (id);


--
-- Name: flags flags_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.flags
    ADD CONSTRAINT flags_pkey PRIMARY KEY (id);


--
-- Name: forums forums_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.forums
    ADD CONSTRAINT forums_pkey PRIMARY KEY (id);


--
-- Name: imports imports_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT imports_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

