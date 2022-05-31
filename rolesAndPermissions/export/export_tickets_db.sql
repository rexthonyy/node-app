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
-- Name: ticket_article_flags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_article_flags (
    id integer NOT NULL,
    ticket_article_id integer NOT NULL,
    key character varying NOT NULL,
    value character varying,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ticket_article_flags OWNER TO postgres;

--
-- Name: ticket_article_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_article_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_article_flags_id_seq OWNER TO postgres;

--
-- Name: ticket_article_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_article_flags_id_seq OWNED BY public.ticket_article_flags.id;


--
-- Name: ticket_article_senders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_article_senders (
    id integer NOT NULL,
    name character varying NOT NULL,
    note character varying,
    updated_by_id integer NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ticket_article_senders OWNER TO postgres;

--
-- Name: ticket_article_senders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_article_senders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_article_senders_id_seq OWNER TO postgres;

--
-- Name: ticket_article_senders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_article_senders_id_seq OWNED BY public.ticket_article_senders.id;


--
-- Name: ticket_article_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_article_types (
    id integer NOT NULL,
    name character varying NOT NULL,
    note character varying,
    communication boolean NOT NULL,
    active boolean DEFAULT true NOT NULL,
    updated_by_id integer NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ticket_article_types OWNER TO postgres;

--
-- Name: ticket_article_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_article_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_article_types_id_seq OWNER TO postgres;

--
-- Name: ticket_article_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_article_types_id_seq OWNED BY public.ticket_article_types.id;


--
-- Name: ticket_articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_articles (
    id integer NOT NULL,
    ticket_id integer NOT NULL,
    type_id integer NOT NULL,
    sender_id integer NOT NULL,
    from_ character varying,
    to_ character varying,
    cc character varying,
    subject character varying,
    reply_to character varying,
    message_id character varying,
    message_id_md5 character varying,
    in_reply_to character varying,
    content_type character varying DEFAULT 'text/plain'::character varying NOT NULL,
    references_ character varying,
    body text NOT NULL,
    internal boolean DEFAULT false NOT NULL,
    preferences text,
    updated_by_id integer NOT NULL,
    created_by_id integer NOT NULL,
    origin_by_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ticket_articles OWNER TO postgres;

--
-- Name: ticket_articles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_articles_id_seq OWNER TO postgres;

--
-- Name: ticket_articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_articles_id_seq OWNED BY public.ticket_articles.id;


--
-- Name: ticket_counters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_counters (
    id integer NOT NULL,
    content character varying NOT NULL,
    generator character varying NOT NULL
);


ALTER TABLE public.ticket_counters OWNER TO postgres;

--
-- Name: ticket_counters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_counters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_counters_id_seq OWNER TO postgres;

--
-- Name: ticket_counters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_counters_id_seq OWNED BY public.ticket_counters.id;


--
-- Name: ticket_flags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_flags (
    id integer NOT NULL,
    ticket_id integer NOT NULL,
    key character varying NOT NULL,
    value character varying,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ticket_flags OWNER TO postgres;

--
-- Name: ticket_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_flags_id_seq OWNER TO postgres;

--
-- Name: ticket_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_flags_id_seq OWNED BY public.ticket_flags.id;


--
-- Name: ticket_priorities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_priorities (
    id integer NOT NULL,
    name character varying NOT NULL,
    default_create boolean DEFAULT false NOT NULL,
    ui_icon character varying,
    ui_color character varying,
    note character varying,
    active boolean DEFAULT true NOT NULL,
    updated_by_id integer NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ticket_priorities OWNER TO postgres;

--
-- Name: ticket_priorities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_priorities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_priorities_id_seq OWNER TO postgres;

--
-- Name: ticket_priorities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_priorities_id_seq OWNED BY public.ticket_priorities.id;


--
-- Name: ticket_state_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_state_types (
    id integer NOT NULL,
    name character varying NOT NULL,
    note character varying,
    updated_by_id integer NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ticket_state_types OWNER TO postgres;

--
-- Name: ticket_state_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_state_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_state_types_id_seq OWNER TO postgres;

--
-- Name: ticket_state_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_state_types_id_seq OWNED BY public.ticket_state_types.id;


--
-- Name: ticket_states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_states (
    id integer NOT NULL,
    state_type_id integer NOT NULL,
    name character varying NOT NULL,
    next_state_id integer,
    ignore_escalation boolean DEFAULT false NOT NULL,
    default_create boolean DEFAULT false NOT NULL,
    default_follow_up boolean DEFAULT false NOT NULL,
    note character varying,
    active boolean NOT NULL,
    updated_by_id integer NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ticket_states OWNER TO postgres;

--
-- Name: ticket_states_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_states_id_seq OWNER TO postgres;

--
-- Name: ticket_states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_states_id_seq OWNED BY public.ticket_states.id;


--
-- Name: ticket_time_accountings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_time_accountings (
    id integer NOT NULL,
    ticket_id integer NOT NULL,
    ticket_article_id integer,
    time_unit numeric(6,2) NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ticket_time_accountings OWNER TO postgres;

--
-- Name: ticket_time_accountings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_time_accountings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_time_accountings_id_seq OWNER TO postgres;

--
-- Name: ticket_time_accountings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_time_accountings_id_seq OWNED BY public.ticket_time_accountings.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tickets (
    id integer NOT NULL,
    group_id integer NOT NULL,
    priority_id integer NOT NULL,
    state_id integer NOT NULL,
    organization_id integer,
    number character varying NOT NULL,
    title character varying NOT NULL,
    owner_id integer NOT NULL,
    customer_id integer NOT NULL,
    note character varying,
    first_response_at timestamp without time zone,
    first_response_escalation_at timestamp without time zone,
    first_response_in_min integer,
    first_response_diff_in_min integer,
    close_at timestamp without time zone,
    close_escalation_at timestamp without time zone,
    close_in_min integer,
    close_diff_in_min integer,
    update_escalation_at timestamp without time zone,
    update_in_min integer,
    update_diff_in_min integer,
    last_contact_at timestamp without time zone,
    last_contact_agent_at timestamp without time zone,
    last_contact_customer_at timestamp without time zone,
    last_owner_update_at timestamp without time zone,
    create_article_article_type_id integer,
    create_article_sender_id integer,
    article_count integer,
    escalation_at timestamp without time zone,
    pending_time timestamp without time zone,
    type character varying,
    time_unit numeric(6,2),
    preferences text,
    updated_by_id integer NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.tickets OWNER TO postgres;

--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tickets_id_seq OWNER TO postgres;

--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- Name: ticket_article_flags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_article_flags ALTER COLUMN id SET DEFAULT nextval('public.ticket_article_flags_id_seq'::regclass);


--
-- Name: ticket_article_senders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_article_senders ALTER COLUMN id SET DEFAULT nextval('public.ticket_article_senders_id_seq'::regclass);


--
-- Name: ticket_article_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_article_types ALTER COLUMN id SET DEFAULT nextval('public.ticket_article_types_id_seq'::regclass);


--
-- Name: ticket_articles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_articles ALTER COLUMN id SET DEFAULT nextval('public.ticket_articles_id_seq'::regclass);


--
-- Name: ticket_counters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_counters ALTER COLUMN id SET DEFAULT nextval('public.ticket_counters_id_seq'::regclass);


--
-- Name: ticket_flags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_flags ALTER COLUMN id SET DEFAULT nextval('public.ticket_flags_id_seq'::regclass);


--
-- Name: ticket_priorities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_priorities ALTER COLUMN id SET DEFAULT nextval('public.ticket_priorities_id_seq'::regclass);


--
-- Name: ticket_state_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_state_types ALTER COLUMN id SET DEFAULT nextval('public.ticket_state_types_id_seq'::regclass);


--
-- Name: ticket_states id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_states ALTER COLUMN id SET DEFAULT nextval('public.ticket_states_id_seq'::regclass);


--
-- Name: ticket_time_accountings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_time_accountings ALTER COLUMN id SET DEFAULT nextval('public.ticket_time_accountings_id_seq'::regclass);


--
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- Data for Name: ticket_article_flags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_article_flags (id, ticket_article_id, key, value, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ticket_article_senders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_article_senders (id, name, note, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ticket_article_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_article_types (id, name, note, communication, active, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
1	email		t	t	1	1	2022-04-13 14:51:02.385961	2022-04-13 14:51:02.385961
2	sms		t	t	1	1	2022-04-13 14:51:02.385961	2022-04-13 14:51:02.385961
3	chat		t	t	1	1	2022-04-13 14:51:29.58108	2022-04-13 14:51:29.58108
4	fax		t	t	1	1	2022-04-13 14:51:29.58108	2022-04-13 14:51:29.58108
5	phone		t	t	1	1	2022-04-13 14:51:50.516416	2022-04-13 14:51:50.516416
6	twitter status		t	t	1	1	2022-04-13 14:51:50.516416	2022-04-13 14:51:50.516416
7	twitter direct-message		t	t	1	1	2022-04-13 14:52:29.777025	2022-04-13 14:52:29.777025
8	facebook feed post		t	t	1	1	2022-04-13 14:52:29.777025	2022-04-13 14:52:29.777025
9	facebook feed comment		t	t	1	1	2022-04-13 14:53:06.976029	2022-04-13 14:53:06.976029
10	note		f	t	1	1	2022-04-13 14:53:06.976029	2022-04-13 14:53:06.976029
11	web		t	t	1	1	2022-04-13 14:53:35.566981	2022-04-13 14:53:35.566981
12	telegram personal-message		f	t	1	1	2022-04-13 14:53:35.566981	2022-04-13 14:53:35.566981
13	facebook direct-message		t	t	1	1	2022-04-13 14:53:58.255116	2022-04-13 14:53:58.255116
\.


--
-- Data for Name: ticket_articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_articles (id, ticket_id, type_id, sender_id, from_, to_, cc, subject, reply_to, message_id, message_id_md5, in_reply_to, content_type, references_, body, internal, preferences, updated_by_id, created_by_id, origin_by_id, created_at, updated_at) FROM stdin;
1	-1	-1	-1				My subject							I am a message!	f		-1	-1	-1	2022-02-22 14:40:08	2022-02-22 14:40:08
2	-1	-1	-1				My subject							I am a message!	f		-1	-1	-1	2022-02-22 14:44:51	2022-02-22 14:44:51
4	5	-1	-1				Call note					text/html		Called the customer and discussed their issues.<br/>Turns out these were caused by invalid configurations - solved.	f		-1	-1	-1	2022-02-22 16:05:54	2022-02-22 16:05:54
5	6	10	-1	test user			come		\N	\N	\N	text/plain	\N	body 1	t		-1	-1	-1	2022-04-13 17:21:46	2022-04-14 12:37:26
\.


--
-- Data for Name: ticket_counters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_counters (id, content, generator) FROM stdin;
\.


--
-- Data for Name: ticket_flags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_flags (id, ticket_id, key, value, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ticket_priorities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_priorities (id, name, default_create, ui_icon, ui_color, note, active, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
2	low	f	low-priority	low-priority		t	1	1	2022-04-13 14:37:25.956357	2022-04-13 14:37:25.956357
3	normal	t				t	1	1	2022-04-13 14:37:25.956357	2022-04-13 14:37:25.956357
4	high	f	important	high-priority		t	1	1	2022-04-13 14:37:25.956357	2022-04-13 14:37:25.956357
\.


--
-- Data for Name: ticket_state_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_state_types (id, name, note, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
1	new		1	1	2022-04-13 15:01:12.876818	2022-04-13 15:01:12.876818
2	open		1	1	2022-04-13 15:01:21.196022	2022-04-13 15:01:21.196022
3	pending reminder		1	1	2022-04-13 15:01:30.316421	2022-04-13 15:01:30.316421
4	pending action		1	1	2022-04-13 15:01:41.293102	2022-04-13 15:01:41.293102
5	closed		1	1	2022-04-13 15:01:48.396333	2022-04-13 15:01:48.396333
6	merged		1	1	2022-04-13 15:01:55.255935	2022-04-13 15:01:55.255935
7	removed		1	1	2022-04-13 15:02:02.061055	2022-04-13 15:02:02.061055
\.


--
-- Data for Name: ticket_states; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_states (id, state_type_id, name, next_state_id, ignore_escalation, default_create, default_follow_up, note, active, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
1	-1	small test	1	f	t	t		t	-1	-1	2022-02-21 15:38:21	2022-02-21 15:38:21
2	-1	ticket state name	1	f	t	t		t	-1	-1	2022-02-21 15:42:50	2022-02-21 15:42:50
3	2	in progress	1	t	t	t		t	-1	-1	2022-02-22 17:38:46	2022-02-22 17:38:46
4	1	new	\N	f	t	f	\N	t	1	1	2022-04-13 14:40:53.237323	2022-04-13 14:40:53.237323
5	2	open	\N	f	f	t	\N	t	1	1	2022-04-13 14:42:18.189426	2022-04-13 14:42:18.189426
6	3	pending reminder	\N	t	f	f	\N	t	1	1	2022-04-13 14:42:18.189426	2022-04-13 14:42:18.189426
7	5	closed	\N	t	f	f	\N	t	1	1	2022-04-13 14:43:34.72416	2022-04-13 14:43:34.72416
8	3	merged	\N	t	f	f	\N	t	1	1	2022-04-13 14:43:34.72416	2022-04-13 14:43:34.72416
9	7	removed	\N	t	f	f	\N	t	1	1	2022-04-13 14:44:45.036067	2022-04-13 14:44:45.036067
10	4	pending close	4	t	f	f	\N	t	1	1	2022-04-13 14:44:45.036067	2022-04-13 14:44:45.036067
\.


--
-- Data for Name: ticket_time_accountings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_time_accountings (id, ticket_id, ticket_article_id, time_unit, created_by_id, created_at, updated_at) FROM stdin;
1	1	2	3.00	-1	2022-02-21 15:30:28	2022-02-21 15:30:28
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tickets (id, group_id, priority_id, state_id, organization_id, number, title, owner_id, customer_id, note, first_response_at, first_response_escalation_at, first_response_in_min, first_response_diff_in_min, close_at, close_escalation_at, close_in_min, close_diff_in_min, update_escalation_at, update_in_min, update_diff_in_min, last_contact_at, last_contact_agent_at, last_contact_customer_at, last_owner_update_at, create_article_article_type_id, create_article_sender_id, article_count, escalation_at, pending_time, type, time_unit, preferences, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
1	-1	-1	-1	-1	-1	Test ticket	-1	-1		2022-02-21 15:14:16	2022-02-21 15:14:16	-1	-1	2022-02-21 15:14:16	2022-02-21 15:14:16	-1	-1	2022-02-21 15:14:16	-1	-1	2022-02-21 15:14:16	2022-02-21 15:14:16	2022-02-21 15:14:16	2022-02-21 15:14:16	-1	-1	-1	2022-02-21 15:14:16	2022-02-21 15:14:16		3.00	3	-1	-1	2022-02-21 15:14:16	2022-02-21 15:14:16
6	-1	3	4	-1	1	new sample ticket	1	1		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	-1	-1	2022-04-13 17:21:46	2022-04-14 12:37:26
\.


--
-- Name: ticket_article_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_article_flags_id_seq', 1, false);


--
-- Name: ticket_article_senders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_article_senders_id_seq', 1, false);


--
-- Name: ticket_article_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_article_types_id_seq', 13, true);


--
-- Name: ticket_articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_articles_id_seq', 5, true);


--
-- Name: ticket_counters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_counters_id_seq', 1, false);


--
-- Name: ticket_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_flags_id_seq', 1, false);


--
-- Name: ticket_priorities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_priorities_id_seq', 4, true);


--
-- Name: ticket_state_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_state_types_id_seq', 7, true);


--
-- Name: ticket_states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_states_id_seq', 10, true);


--
-- Name: ticket_time_accountings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_time_accountings_id_seq', 2, true);


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tickets_id_seq', 6, true);


--
-- Name: ticket_article_flags ticket_article_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_article_flags
    ADD CONSTRAINT ticket_article_flags_pkey PRIMARY KEY (id);


--
-- Name: ticket_article_senders ticket_article_senders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_article_senders
    ADD CONSTRAINT ticket_article_senders_pkey PRIMARY KEY (id);


--
-- Name: ticket_article_types ticket_article_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_article_types
    ADD CONSTRAINT ticket_article_types_pkey PRIMARY KEY (id);


--
-- Name: ticket_articles ticket_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_articles
    ADD CONSTRAINT ticket_articles_pkey PRIMARY KEY (id);


--
-- Name: ticket_counters ticket_counters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_counters
    ADD CONSTRAINT ticket_counters_pkey PRIMARY KEY (id);


--
-- Name: ticket_flags ticket_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_flags
    ADD CONSTRAINT ticket_flags_pkey PRIMARY KEY (id);


--
-- Name: ticket_priorities ticket_priorities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_priorities
    ADD CONSTRAINT ticket_priorities_pkey PRIMARY KEY (id);


--
-- Name: ticket_state_types ticket_state_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_state_types
    ADD CONSTRAINT ticket_state_types_pkey PRIMARY KEY (id);


--
-- Name: ticket_states ticket_states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_states
    ADD CONSTRAINT ticket_states_pkey PRIMARY KEY (id);


--
-- Name: ticket_time_accountings ticket_time_accountings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_time_accountings
    ADD CONSTRAINT ticket_time_accountings_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

