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
-- Name: groups_macros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups_macros (
    macro_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.groups_macros OWNER TO postgres;

--
-- Name: macro_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.macro_actions (
    id integer NOT NULL,
    name character varying NOT NULL,
    fields jsonb NOT NULL,
    created_by_id integer,
    updated_by_id integer,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.macro_actions OWNER TO postgres;

--
-- Name: macro_action_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.macro_action_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.macro_action_id_seq OWNER TO postgres;

--
-- Name: macro_action_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.macro_action_id_seq OWNED BY public.macro_actions.id;


--
-- Name: macros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.macros (
    id integer NOT NULL,
    name character varying,
    perform text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    ux_flow_next_up character varying DEFAULT 'none'::character varying NOT NULL,
    note character varying,
    updated_by_id integer NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.macros OWNER TO postgres;

--
-- Name: macros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.macros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.macros_id_seq OWNER TO postgres;

--
-- Name: macros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.macros_id_seq OWNED BY public.macros.id;


--
-- Name: macro_actions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.macro_actions ALTER COLUMN id SET DEFAULT nextval('public.macro_action_id_seq'::regclass);


--
-- Name: macros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.macros ALTER COLUMN id SET DEFAULT nextval('public.macros_id_seq'::regclass);


--
-- Data for Name: groups_macros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups_macros (macro_id, group_id) FROM stdin;
2	3
2	4
\.


--
-- Data for Name: macro_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.macro_actions (id, name, fields, created_by_id, updated_by_id, created_at, updated_at) FROM stdin;
1	title	{}	\N	\N	2022-04-15 14:46:36.797699	2022-04-15 14:46:36.797699
\.


--
-- Data for Name: macros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.macros (id, name, perform, active, ux_flow_next_up, note, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
2	Macro 2	{ticket.tag}	f	none	lorem ipsum	2	1	2022-07-03 00:00:00	2022-08-03 00:00:00
\.


--
-- Name: macro_action_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.macro_action_id_seq', 1, true);


--
-- Name: macros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.macros_id_seq', 2, true);


--
-- Name: macro_actions macro_action_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.macro_actions
    ADD CONSTRAINT macro_action_pkey PRIMARY KEY (id);


--
-- Name: macros macros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.macros
    ADD CONSTRAINT macros_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

