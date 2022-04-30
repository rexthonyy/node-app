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
-- Name: flags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flags (
    id integer NOT NULL,
    post_id integer,
    generated_topic_id integer,
    reason text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.flags OWNER TO postgres;

--
-- Name: flags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.flags_id_seq OWNER TO postgres;

--
-- Name: flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flags_id_seq OWNED BY public.flags.id;


--
-- Name: forums; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.forums OWNER TO postgres;

--
-- Name: forums_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forums_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forums_id_seq OWNER TO postgres;

--
-- Name: forums_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forums_id_seq OWNED BY public.forums.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
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
    email_to_address character varying,
    is_update_scheduled boolean DEFAULT false,
    is_delete_scheduled boolean DEFAULT false
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_delayed_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts_delayed_jobs (
    id integer NOT NULL,
    post_id integer NOT NULL,
    publish_update_delete character varying,
    metadata text,
    run_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.posts_delayed_jobs OWNER TO postgres;

--
-- Name: posts_delayed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_delayed_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_delayed_jobs_id_seq OWNER TO postgres;

--
-- Name: posts_delayed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_delayed_jobs_id_seq OWNED BY public.posts_delayed_jobs.id;


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
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
-- Name: topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    forum_id integer,
    user_id integer,
    subject character varying,
    points integer,
    message text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_delete_scheduled boolean DEFAULT false,
    is_update_scheduled boolean DEFAULT false
);


ALTER TABLE public.topics OWNER TO postgres;

--
-- Name: topics_delayed_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topics_delayed_jobs (
    id integer NOT NULL,
    topic_id integer,
    publish_update_delete character varying,
    metadata text,
    run_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.topics_delayed_jobs OWNER TO postgres;

--
-- Name: topics_delayed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.topics_delayed_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topics_delayed_jobs_id_seq OWNER TO postgres;

--
-- Name: topics_delayed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.topics_delayed_jobs_id_seq OWNED BY public.topics_delayed_jobs.id;


--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topics_id_seq OWNER TO postgres;

--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- Name: votes; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.votes OWNER TO postgres;

--
-- Name: votes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.votes_id_seq OWNER TO postgres;

--
-- Name: votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.votes_id_seq OWNED BY public.votes.id;


--
-- Name: flags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flags ALTER COLUMN id SET DEFAULT nextval('public.flags_id_seq'::regclass);


--
-- Name: forums id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forums ALTER COLUMN id SET DEFAULT nextval('public.forums_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: posts_delayed_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts_delayed_jobs ALTER COLUMN id SET DEFAULT nextval('public.posts_delayed_jobs_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- Name: topics_delayed_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics_delayed_jobs ALTER COLUMN id SET DEFAULT nextval('public.topics_delayed_jobs_id_seq'::regclass);


--
-- Name: votes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes ALTER COLUMN id SET DEFAULT nextval('public.votes_id_seq'::regclass);


--
-- Data for Name: flags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flags (id, post_id, generated_topic_id, reason, created_at, updated_at) FROM stdin;
1	2	0	spam	2022-02-17 15:07:52	2022-02-17 15:07:52
\.


--
-- Data for Name: forums; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, topic_id, user_id, body, kind, active, created_at, updated_at, points, attachements, cc, bcc, raw_email, email_to_address, is_update_scheduled, is_delete_scheduled) FROM stdin;
2	1	0	This is a test topic body		t	2022-02-17 12:40:44	2022-02-17 12:40:44	0			false	0		f	f
3	0	0	some body		t	2022-02-17 15:01:42	2022-02-17 15:01:42	0			false	0		f	f
4	8	0	What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.	note	t	2022-03-04 16:22:46	2022-03-04 16:22:46	0			false	0		f	f
5	7	0	What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.	note	t	2022-03-04 16:28:05	2022-03-04 16:28:05	0			false	0		f	f
6	8	0	Where can I get some?\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.	note	t	2022-03-04 16:41:00	2022-03-04 16:41:00	0			false	0		f	f
7	8	0	Where can I get some?\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.	note	t	2022-03-04 16:41:39	2022-03-04 16:41:39	0			false	0		f	f
1	0	0			t	2022-02-17 12:39:01	2022-02-17 12:39:01	0			false	0		t	t
\.


--
-- Data for Name: posts_delayed_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts_delayed_jobs (id, post_id, publish_update_delete, metadata, run_at, created_at) FROM stdin;
1	-1	publish	{"topic_id":"22","user_id":"12"}	2022-05-12 00:00:00	2022-04-13 11:14:16.16142
2	1	update	{"topic_id":"22","user_id":"12"}	2022-05-12 00:00:00	2022-04-13 11:16:15.244579
3	1	delete		2022-05-12 00:00:00	2022-04-13 11:16:57.655285
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, name, taggings_count, show_on_helpcenter, show_on_admin, show_on_dashboard, description, color, active, email_address, email_name) FROM stdin;
1	curiosity explorer	0	f	f	f	mars explorer	brown	t		
\.


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.topics (id, forum_id, user_id, subject, points, message, created_at, updated_at, is_delete_scheduled, is_update_scheduled) FROM stdin;
1	1	\N	zatelkasten method	4		2022-02-17 15:59:08	2022-02-17 15:59:08	f	f
5	12	\N	Topic 002	2	<p>Topic 002</p>	2022-03-02 17:33:45	2022-03-02 17:33:45	f	f
4	12	\N	Topic 001	3	<p>Topic 001</p>	2022-03-02 17:25:01	2022-03-02 17:25:01	f	f
6	14	\N	Discussion001	27	<p>Discussion001</p>	2022-03-02 17:56:22	2022-03-02 17:56:22	f	f
7	12	\N	Topic 003	0	Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.	2022-03-04 14:57:01	2022-03-04 14:57:01	f	f
8	12	\N	Topic 003	0	Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.	2022-03-04 15:00:19	2022-03-04 15:00:19	f	f
9	15	\N	Feature REQUEST 001	0	Lorem Ipsum is simply a dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1500.	2022-03-04 15:01:57	2022-03-04 15:01:57	f	f
10	16	\N	Discussion 001	0	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s	2022-03-04 15:06:31	2022-03-04 15:06:31	f	f
11	16	\N	Discussion 002	0	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s	2022-03-04 15:08:48	2022-03-04 15:08:48	f	f
13	15	\N	Feature REQUEST 002	0	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s	2022-03-04 15:14:06	2022-03-04 15:14:06	f	f
12	16	\N	Discussion 003	2	Message	2022-03-04 15:11:25	2022-03-04 15:11:25	f	f
3	1	\N	Updated topic	1	How to submit a ticket	2022-03-02 16:28:47	2022-03-02 16:28:47	f	t
\.


--
-- Data for Name: topics_delayed_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.topics_delayed_jobs (id, topic_id, publish_update_delete, metadata, run_at, created_at) FROM stdin;
1	3	update	{"topic_id":"1","user_id":"1","body":"body","kind":"kind","active":true}	2022-04-13 00:00:00	2022-04-12 17:15:00.97363
2	-1	publish	{"topic_id":"1","body":"body"}	2022-05-12 00:00:00	2022-04-13 11:18:10.873792
3	33	update	{"topic_id":"1","body":"body"}	2022-05-12 00:00:00	2022-04-13 11:18:58.393035
4	33	delete		2022-09-12 00:00:00	2022-04-13 11:19:40.123359
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.votes (id, points, voteable_type, voteable_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flags_id_seq', 1, true);


--
-- Name: forums_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.forums_id_seq', 18, true);


--
-- Name: posts_delayed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_delayed_jobs_id_seq', 3, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 7, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, true);


--
-- Name: topics_delayed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.topics_delayed_jobs_id_seq', 4, true);


--
-- Name: topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.topics_id_seq', 13, true);


--
-- Name: votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.votes_id_seq', 1, false);


--
-- Name: flags flags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flags
    ADD CONSTRAINT flags_pkey PRIMARY KEY (id);


--
-- Name: forums forums_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forums
    ADD CONSTRAINT forums_pkey PRIMARY KEY (id);


--
-- Name: posts_delayed_jobs posts_delayed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts_delayed_jobs
    ADD CONSTRAINT posts_delayed_jobs_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: topics_delayed_jobs topics_delayed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics_delayed_jobs
    ADD CONSTRAINT topics_delayed_jobs_pkey PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

