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
-- Name: currency; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.currency (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    is_active boolean NOT NULL,
    currency_code character varying NOT NULL
);


ALTER TABLE public.currency OWNER TO knowledgebase;

--
-- Name: channel_channel_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.channel_channel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_channel_id_seq OWNER TO knowledgebase;

--
-- Name: channel_channel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.channel_channel_id_seq OWNED BY public.currency.id;


--
-- Name: discount_sale; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_sale (
    id integer NOT NULL,
    name character varying NOT NULL,
    type character varying NOT NULL,
    end_date timestamp with time zone,
    start_date timestamp with time zone NOT NULL,
    metadata jsonb,
    private_metadata jsonb,
    created timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.discount_sale OWNER TO knowledgebase;

--
-- Name: discount_sale_categories; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_sale_categories (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.discount_sale_categories OWNER TO knowledgebase;

--
-- Name: discount_sale_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_sale_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_sale_categories_id_seq OWNER TO knowledgebase;

--
-- Name: discount_sale_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_sale_categories_id_seq OWNED BY public.discount_sale_categories.id;


--
-- Name: discount_sale_collections; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_sale_collections (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    collection_id integer NOT NULL
);


ALTER TABLE public.discount_sale_collections OWNER TO knowledgebase;

--
-- Name: discount_sale_collections_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_sale_collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_sale_collections_id_seq OWNER TO knowledgebase;

--
-- Name: discount_sale_collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_sale_collections_id_seq OWNED BY public.discount_sale_collections.id;


--
-- Name: discount_sale_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_sale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_sale_id_seq OWNER TO knowledgebase;

--
-- Name: discount_sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_sale_id_seq OWNED BY public.discount_sale.id;


--
-- Name: discount_sale_products; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_sale_products (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    product_id integer NOT NULL
);


ALTER TABLE public.discount_sale_products OWNER TO knowledgebase;

--
-- Name: discount_sale_products_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_sale_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_sale_products_id_seq OWNER TO knowledgebase;

--
-- Name: discount_sale_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_sale_products_id_seq OWNED BY public.discount_sale_products.id;


--
-- Name: discount_sale_variants; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_sale_variants (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    productvariant_id integer NOT NULL
);


ALTER TABLE public.discount_sale_variants OWNER TO knowledgebase;

--
-- Name: discount_sale_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_sale_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_sale_variants_id_seq OWNER TO knowledgebase;

--
-- Name: discount_sale_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_sale_variants_id_seq OWNED BY public.discount_sale_variants.id;


--
-- Name: discount_salecurrencylisting; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_salecurrencylisting (
    id integer NOT NULL,
    discount_value numeric(12,3) NOT NULL,
    currency character varying NOT NULL,
    currency_id integer NOT NULL,
    sale_id integer NOT NULL
);


ALTER TABLE public.discount_salecurrencylisting OWNER TO knowledgebase;

--
-- Name: discount_salecurrencylisting_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_salecurrencylisting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_salecurrencylisting_id_seq OWNER TO knowledgebase;

--
-- Name: discount_salecurrencylisting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_salecurrencylisting_id_seq OWNED BY public.discount_salecurrencylisting.id;


--
-- Name: discount_voucher; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_voucher (
    id integer NOT NULL,
    type character varying NOT NULL,
    name character varying,
    code character varying NOT NULL,
    usage_limit integer,
    used integer NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone,
    discount_value_type character varying NOT NULL,
    apply_once_per_order boolean NOT NULL,
    countries character varying NOT NULL,
    min_checkout_items_quantity integer,
    apply_once_per_customer boolean NOT NULL,
    only_for_staff boolean NOT NULL,
    metadata jsonb,
    private_metadata jsonb
);


ALTER TABLE public.discount_voucher OWNER TO knowledgebase;

--
-- Name: discount_voucher_categories; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_voucher_categories (
    id integer NOT NULL,
    voucher_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.discount_voucher_categories OWNER TO knowledgebase;

--
-- Name: discount_voucher_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_voucher_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_voucher_categories_id_seq OWNER TO knowledgebase;

--
-- Name: discount_voucher_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_voucher_categories_id_seq OWNED BY public.discount_voucher_categories.id;


--
-- Name: discount_voucher_collections; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_voucher_collections (
    id integer NOT NULL,
    voucher_id integer NOT NULL,
    collection_id integer NOT NULL
);


ALTER TABLE public.discount_voucher_collections OWNER TO knowledgebase;

--
-- Name: discount_voucher_collections_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_voucher_collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_voucher_collections_id_seq OWNER TO knowledgebase;

--
-- Name: discount_voucher_collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_voucher_collections_id_seq OWNED BY public.discount_voucher_collections.id;


--
-- Name: discount_voucher_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_voucher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_voucher_id_seq OWNER TO knowledgebase;

--
-- Name: discount_voucher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_voucher_id_seq OWNED BY public.discount_voucher.id;


--
-- Name: discount_voucher_products; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_voucher_products (
    id integer NOT NULL,
    voucher_id integer NOT NULL,
    product_id integer NOT NULL
);


ALTER TABLE public.discount_voucher_products OWNER TO knowledgebase;

--
-- Name: discount_voucher_products_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_voucher_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_voucher_products_id_seq OWNER TO knowledgebase;

--
-- Name: discount_voucher_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_voucher_products_id_seq OWNED BY public.discount_voucher_products.id;


--
-- Name: discount_vouchercurrencylisting; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.discount_vouchercurrencylisting (
    id integer NOT NULL,
    discount_value numeric(12,3) NOT NULL,
    currency character varying NOT NULL,
    min_spent_amount numeric(12,3),
    currency_id integer NOT NULL,
    voucher_id integer NOT NULL,
    percent_price_cap numeric(12,3)
);


ALTER TABLE public.discount_vouchercurrencylisting OWNER TO knowledgebase;

--
-- Name: discount_vouchercurrencylisting_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.discount_vouchercurrencylisting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_vouchercurrencylisting_id_seq OWNER TO knowledgebase;

--
-- Name: discount_vouchercurrencylisting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.discount_vouchercurrencylisting_id_seq OWNED BY public.discount_vouchercurrencylisting.id;


--
-- Name: currency id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.currency ALTER COLUMN id SET DEFAULT nextval('public.channel_channel_id_seq'::regclass);


--
-- Name: discount_sale id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_sale ALTER COLUMN id SET DEFAULT nextval('public.discount_sale_id_seq'::regclass);


--
-- Name: discount_sale_categories id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_sale_categories ALTER COLUMN id SET DEFAULT nextval('public.discount_sale_categories_id_seq'::regclass);


--
-- Name: discount_sale_collections id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_sale_collections ALTER COLUMN id SET DEFAULT nextval('public.discount_sale_collections_id_seq'::regclass);


--
-- Name: discount_sale_products id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_sale_products ALTER COLUMN id SET DEFAULT nextval('public.discount_sale_products_id_seq'::regclass);


--
-- Name: discount_sale_variants id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_sale_variants ALTER COLUMN id SET DEFAULT nextval('public.discount_sale_variants_id_seq'::regclass);


--
-- Name: discount_salecurrencylisting id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_salecurrencylisting ALTER COLUMN id SET DEFAULT nextval('public.discount_salecurrencylisting_id_seq'::regclass);


--
-- Name: discount_voucher id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_voucher ALTER COLUMN id SET DEFAULT nextval('public.discount_voucher_id_seq'::regclass);


--
-- Name: discount_voucher_categories id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_voucher_categories ALTER COLUMN id SET DEFAULT nextval('public.discount_voucher_categories_id_seq'::regclass);


--
-- Name: discount_voucher_collections id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_voucher_collections ALTER COLUMN id SET DEFAULT nextval('public.discount_voucher_collections_id_seq'::regclass);


--
-- Name: discount_voucher_products id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_voucher_products ALTER COLUMN id SET DEFAULT nextval('public.discount_voucher_products_id_seq'::regclass);


--
-- Name: discount_vouchercurrencylisting id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_vouchercurrencylisting ALTER COLUMN id SET DEFAULT nextval('public.discount_vouchercurrencylisting_id_seq'::regclass);


--
-- Data for Name: currency; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.currency (id, name, slug, is_active, currency_code) FROM stdin;
1	Channel-PLN	channel-pln	t	PLN
3	US Dollar	us-dollar	t	USD
\.


--
-- Data for Name: discount_sale; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_sale (id, name, type, end_date, start_date, metadata, private_metadata, created, updated_at) FROM stdin;
\.


--
-- Data for Name: discount_sale_categories; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_sale_categories (id, sale_id, category_id) FROM stdin;
\.


--
-- Data for Name: discount_sale_collections; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_sale_collections (id, sale_id, collection_id) FROM stdin;
\.


--
-- Data for Name: discount_sale_products; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_sale_products (id, sale_id, product_id) FROM stdin;
\.


--
-- Data for Name: discount_sale_variants; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_sale_variants (id, sale_id, productvariant_id) FROM stdin;
\.


--
-- Data for Name: discount_salecurrencylisting; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_salecurrencylisting (id, discount_value, currency, currency_id, sale_id) FROM stdin;
\.


--
-- Data for Name: discount_voucher; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_voucher (id, type, name, code, usage_limit, used, start_date, end_date, discount_value_type, apply_once_per_order, countries, min_checkout_items_quantity, apply_once_per_customer, only_for_staff, metadata, private_metadata) FROM stdin;
\.


--
-- Data for Name: discount_voucher_categories; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_voucher_categories (id, voucher_id, category_id) FROM stdin;
\.


--
-- Data for Name: discount_voucher_collections; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_voucher_collections (id, voucher_id, collection_id) FROM stdin;
\.


--
-- Data for Name: discount_voucher_products; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_voucher_products (id, voucher_id, product_id) FROM stdin;
\.


--
-- Data for Name: discount_vouchercurrencylisting; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.discount_vouchercurrencylisting (id, discount_value, currency, min_spent_amount, currency_id, voucher_id, percent_price_cap) FROM stdin;
\.


--
-- Name: channel_channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.channel_channel_id_seq', 3, true);


--
-- Name: discount_sale_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_sale_categories_id_seq', 7, true);


--
-- Name: discount_sale_collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_sale_collections_id_seq', 9, true);


--
-- Name: discount_sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_sale_id_seq', 2, true);


--
-- Name: discount_sale_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_sale_products_id_seq', 9, true);


--
-- Name: discount_sale_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_sale_variants_id_seq', 9, true);


--
-- Name: discount_salecurrencylisting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_salecurrencylisting_id_seq', 10, true);


--
-- Name: discount_voucher_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_voucher_categories_id_seq', 2, true);


--
-- Name: discount_voucher_collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_voucher_collections_id_seq', 3, true);


--
-- Name: discount_voucher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_voucher_id_seq', 1, true);


--
-- Name: discount_voucher_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_voucher_products_id_seq', 3, true);


--
-- Name: discount_vouchercurrencylisting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.discount_vouchercurrencylisting_id_seq', 6, true);


--
-- Name: currency channel_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT channel_channel_pkey PRIMARY KEY (id);


--
-- Name: discount_sale_categories discount_sale_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_sale_categories
    ADD CONSTRAINT discount_sale_categories_pkey PRIMARY KEY (id);


--
-- Name: discount_sale_collections discount_sale_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_sale_collections
    ADD CONSTRAINT discount_sale_collections_pkey PRIMARY KEY (id);


--
-- Name: discount_sale discount_sale_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_sale
    ADD CONSTRAINT discount_sale_pkey PRIMARY KEY (id);


--
-- Name: discount_sale_products discount_sale_products_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_sale_products
    ADD CONSTRAINT discount_sale_products_pkey PRIMARY KEY (id);


--
-- Name: discount_sale_variants discount_sale_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_sale_variants
    ADD CONSTRAINT discount_sale_variants_pkey PRIMARY KEY (id);


--
-- Name: discount_salecurrencylisting discount_salecurrencylisting_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_salecurrencylisting
    ADD CONSTRAINT discount_salecurrencylisting_pkey PRIMARY KEY (id);


--
-- Name: discount_voucher_categories discount_voucher_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_voucher_categories
    ADD CONSTRAINT discount_voucher_categories_pkey PRIMARY KEY (id);


--
-- Name: discount_voucher_collections discount_voucher_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_voucher_collections
    ADD CONSTRAINT discount_voucher_collections_pkey PRIMARY KEY (id);


--
-- Name: discount_voucher discount_voucher_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_voucher
    ADD CONSTRAINT discount_voucher_pkey PRIMARY KEY (id);


--
-- Name: discount_voucher_products discount_voucher_products_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_voucher_products
    ADD CONSTRAINT discount_voucher_products_pkey PRIMARY KEY (id);


--
-- Name: discount_vouchercurrencylisting discount_vouchercurrencylisting_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.discount_vouchercurrencylisting
    ADD CONSTRAINT discount_vouchercurrencylisting_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

