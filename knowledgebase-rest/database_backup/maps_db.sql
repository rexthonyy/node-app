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
-- Name: service_boundary_regions; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.service_boundary_regions (
    id integer NOT NULL,
    name character varying NOT NULL,
    code character varying NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.service_boundary_regions OWNER TO knowledgebase;

--
-- Name: service_boundary_regions_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.service_boundary_regions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_boundary_regions_id_seq OWNER TO knowledgebase;

--
-- Name: service_boundary_regions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.service_boundary_regions_id_seq OWNED BY public.service_boundary_regions.id;


--
-- Name: service_boundary_subregion_codes; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.service_boundary_subregion_codes (
    id integer NOT NULL,
    region_id integer NOT NULL,
    subregion_id integer NOT NULL,
    code character varying NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.service_boundary_subregion_codes OWNER TO knowledgebase;

--
-- Name: service_boundary_subregion_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.service_boundary_subregion_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_boundary_subregion_codes_id_seq OWNER TO knowledgebase;

--
-- Name: service_boundary_subregion_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.service_boundary_subregion_codes_id_seq OWNED BY public.service_boundary_subregion_codes.id;


--
-- Name: service_boundary_subregions; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.service_boundary_subregions (
    id integer NOT NULL,
    region_id integer NOT NULL,
    name character varying NOT NULL,
    image_url character varying,
    code character varying,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.service_boundary_subregions OWNER TO knowledgebase;

--
-- Name: service_boundary_subregions_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.service_boundary_subregions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_boundary_subregions_id_seq OWNER TO knowledgebase;

--
-- Name: service_boundary_subregions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.service_boundary_subregions_id_seq OWNED BY public.service_boundary_subregions.id;


--
-- Name: service_boundary_regions id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.service_boundary_regions ALTER COLUMN id SET DEFAULT nextval('public.service_boundary_regions_id_seq'::regclass);


--
-- Name: service_boundary_subregion_codes id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.service_boundary_subregion_codes ALTER COLUMN id SET DEFAULT nextval('public.service_boundary_subregion_codes_id_seq'::regclass);


--
-- Name: service_boundary_subregions id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.service_boundary_subregions ALTER COLUMN id SET DEFAULT nextval('public.service_boundary_subregions_id_seq'::regclass);


--
-- Data for Name: service_boundary_regions; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.service_boundary_regions (id, name, code, created_at) FROM stdin;
1	Scotland	SC	2022-03-05 13:44:33.111274
2	Northern Ireland	NI	2022-03-05 13:45:04.778138
3	North East	NE	2022-03-05 13:45:35.650781
4	North West	NW	2022-03-05 13:46:01.851084
5	East Midlands	EM	2022-03-05 13:46:29.051007
6	West Midlands	WM	2022-03-05 13:46:53.140145
7	Wales	W	2022-03-05 13:47:19.99057
8	South West	SW	2022-03-05 13:47:42.018055
9	South East	SE	2022-03-05 13:48:04.09198
10	Greater London	GL	2022-03-05 13:48:26.018594
\.


--
-- Data for Name: service_boundary_subregion_codes; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.service_boundary_subregion_codes (id, region_id, subregion_id, code, created_at) FROM stdin;
\.


--
-- Data for Name: service_boundary_subregions; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.service_boundary_subregions (id, region_id, name, image_url, code, created_at) FROM stdin;
1	1	Wick	http://77.68.102.60:9000/scotland/KW%20-%20Wick%20Postcode%20Map.svg	KW	2022-03-05 14:07:21.091096
2	1	Iverness	http://77.68.102.60:9000//scotland/IV%20-%20Inverness%20Postcode%20Map.svg	IV	2022-03-05 14:07:21.113397
3	1	Aberdeen	http://77.68.102.60:9000/scotland/AB%20-%20Aberdeen%20Postcode%20Map.svg	AB	2022-03-05 14:07:21.119836
4	1	Perth	http://77.68.102.60:9000/scotland/PH%20-%20Perth%20Postcode%20Map.svg	PH	2022-03-05 14:07:21.123574
5	1	Dundee	http://77.68.102.60:9000/scotland/DD%20-%20Dundee%20Postcode%20Map.svg	DD	2022-03-05 14:07:21.12639
6	1	Paisley	http://77.68.102.60:9000/scotland/PA%20-%20Paisley%20Postcode%20Map.svg	PA	2022-03-05 14:07:21.12984
7	1	Falkirk	http://77.68.102.60:9000/scotland/FK%20-%20Falkirk%20Postcode%20Map.svg	FK	2022-03-05 14:07:21.131599
8	1	Kirkaldy	http://77.68.102.60:9000/scotland/KY%20-%20Kircaldy%20Postcode%20Map.svg	KY	2022-03-05 14:07:21.134276
9	1	Glasgow	http://77.68.102.60:9000/scotland/G%20-%20Glasgow%20Postcode%20Map.svg	G	2022-03-05 14:07:21.136991
10	1	Kilmarnock	http://77.68.102.60:9000/scotland/KA%20-%20Kilmarnock%20Postcode%20Map.svg	KA	2022-03-05 14:07:21.13991
11	1	Motherwell	http://77.68.102.60:9000/scotland/ML%20-%20Motherwell%20Postcode%20District%20Map.svg	ML	2022-03-05 14:07:21.142787
12	1	Edinburgh	http://77.68.102.60:9000/scotland/EH%20-%20Edinburgh%204-Digit%20Postcode%20Area%20and%20District%20Map.svg	EH	2022-03-05 14:07:21.145361
13	1	Galashiels	http://77.68.102.60:9000/scotland/TD%20-%20Galashields%20Postcode%20Map.svg	TD	2022-03-05 14:07:21.147921
14	1	Dumfries	http://77.68.102.60:9000/scotland/DG%20-%20Dumfries%20Postcode%20Map.svg	DG	2022-03-05 14:07:21.150188
15	1	Harris	http://77.68.102.60:9000/scotland/HS%20-%20Isle%20of%20Harris%20Postcode%20Map.svg	HS	2022-03-05 14:07:21.152606
16	1	Shetland	http://77.68.102.60:9000/scotland/ZE%20-%20Shetland%20Postcode%20Map.svg	ZE	2022-03-05 14:07:21.157194
17	2	Belfast	http://77.68.102.60:9000/northern-ireland/belfast.svg	BT	2022-03-05 14:12:25.115403
18	3	Middlesbrough	http://77.68.102.60:9000/north-east/TS%20-%20Middlesborough%20Postcode%20Map.svg	TS	2022-03-05 14:14:18.292298
19	3	Leeds	http://77.68.102.60:9000/north-east/LS%20-%20Leeds%20Postcode%20Map.svg	LS	2022-03-05 14:14:18.299256
20	3	Harrogate	http://77.68.102.60:9000/north-east/HG%20-%20Harrogate%20Postcode%20Map.svg	HG	2022-03-05 14:14:18.30262
21	3	Hull	http://77.68.102.60:9000/north-east/HU%20-%20Hull%20Postcode%20Map.svg	HU	2022-03-05 14:14:18.305021
22	3	Newcastle	http://77.68.102.60:9000/north-east/NE%20-%20Newcastle%20Postcode%20Map.svg	NE	2022-03-05 14:14:18.307102
23	3	Sunderland	http://77.68.102.60:9000/north-east/SR%20-%20Sunderland%20Postcode%20Map.svg	SR	2022-03-05 14:14:18.310068
24	3	Durham	http://77.68.102.60:9000/north-east/DH%20-%20Durham%20Postcode%20Map.svg	DH	2022-03-05 14:14:18.313236
25	3	Darlington	http://77.68.102.60:9000/north-east/DL%20-%20Darlington%20Postcode%20Map.svg	DL	2022-03-05 14:14:18.315927
26	3	Wakefield	http://77.68.102.60:9000/north-east/WF%20-%20Wakefield%20Postcode%20Map.svg	WF	2022-03-05 14:14:18.326658
27	3	Yorkshire	http://77.68.102.60:9000/north-east/YO%20-%20York%20Postcode%20Map.svg	YO	2022-03-05 14:14:18.329493
28	4	Bradford	http://77.68.102.60:9000/north-west/BD%20-%20Bradford%20Postcode%20Map.svg	BD	2022-03-05 14:15:53.755847
29	4	Carlisle	http://77.68.102.60:9000/north-west/CA%20-%20Carlisle%20Postcode%20Map.svg	CA	2022-03-05 14:15:53.758284
30	4	Lancaster	http://77.68.102.60:9000/north-west/LA%20-%20Lancaster%20Postcode%20Map.svg	LA	2022-03-05 14:15:53.770857
31	4	Blackpool	http://77.68.102.60:9000/north-west/FY%20-%20Blackpool%20Postcode%20Map.svg	FY	2022-03-05 14:15:53.778239
32	4	Oldham	http://77.68.102.60:9000/north-west/OL%20-%20Oldham%20Postcode%20Map.svg	OL	2022-03-05 14:15:53.780455
33	4	Preston	http://77.68.102.60:9000/north-west/PR%20-%20Preston%20Postcode%20Map.svg	PR	2022-03-05 14:15:53.782079
34	4	Wigan	http://77.68.102.60:9000/north-west/WN%20-%20Wigan%20Postcode%20Map.svg	WN	2022-03-05 14:15:53.78733
35	4	Blackburn	http://77.68.102.60:9000/north-west/BB%20-%20Blackburn%20Postcode%20Map.svg	BB	2022-03-05 14:15:53.790187
36	4	Hudersfield	http://77.68.102.60:9000/north-west/HD%20-%20Huddersfield%20Postcode%20Map.svg	HD	2022-03-05 14:15:53.798102
37	4	Machester	http://77.68.102.60:9000/north-west/M%20-%20Manchester%20Postcode%20Map.svg	M	2022-03-05 14:15:53.799889
38	4	Liverpool	http://77.68.102.60:9000/north-west/L%20-%20Liverpool%20Postcode%20Map.svg	L	2022-03-05 14:15:53.80136
39	4	Chester	http://77.68.102.60:9000/north-west/CH%20-%20Chester%20Postcode%20Map.svg	CH	2022-03-05 14:15:53.802771
40	4	Bolton	http://77.68.102.60:9000/north-west/BL%20-%20Bolton%20Postcode%20Map.svg	BL	2022-03-05 14:15:53.804477
41	4	Warrington	http://77.68.102.60:9000/north-west/WA%20-%20Warrington%20Postcode%20Map.svg	WA	2022-03-05 14:15:53.807026
42	4	Crewe	http://77.68.102.60:9000/north-west/CW%20-%20Crewe%20Postcode%20Map.svg	CW	2022-03-05 14:15:53.810255
43	4	Halifax	http://77.68.102.60:9000/north-west/HX%20-%20Halifax%20Postcode%20Map.svg	HX	2022-03-05 14:15:53.811884
44	4	Stockport	http://77.68.102.60:9000/north-west/SK%20-%20Stockport%20Postcode%20Map.svg	SK	2022-03-05 14:15:53.826909
45	5	Colchester	http://77.68.102.60:9000/east-midlands/CO%20-%20Colchester%20Postcode%20Map.svg	CO	2022-03-05 14:17:35.731958
46	5	Ipswich	http://77.68.102.60:9000/east-midlands/IP%20-%20Ipswich%20Postcode%20Map.svg	IP	2022-03-05 14:17:35.735569
47	5	Doncaster	http://77.68.102.60:9000/east-midlands/DN%20-%20Doncaster%20Postcode%20Map.svg	DN	2022-03-05 14:17:35.738689
48	5	Nottingham	http://77.68.102.60:9000/east-midlands/NG%20-%20Nottingham%20Postcode%20Map.svg	NG	2022-03-05 14:17:35.740489
49	5	Derby	http://77.68.102.60:9000/east-midlands/DE%20-%20Derby%20Postcode%20Map.svg	DE	2022-03-05 14:17:35.741818
50	5	Leicester	http://77.68.102.60:9000/east-midlands/LE%20-%20Leicester%20Postcode%20Map.svg	LE	2022-03-05 14:17:35.743118
51	5	Peterborough	http://77.68.102.60:9000/east-midlands/PE%20-%20Peterborough%20Postcode%20Map.svg	PE	2022-03-05 14:17:35.744371
52	5	Lincoln	http://77.68.102.60:9000/east-midlands/LN%20-%20Lincoln%20Postcode%20Map.svg	LN	2022-03-05 14:17:35.750772
53	5	Cambridge	http://77.68.102.60:9000/east-midlands/CB%20-%20Cambridge%20Postcode%20Map.svg	CB	2022-03-05 14:17:35.753973
54	5	Norwich	http://77.68.102.60:9000/east-midlands/NR%20-%20Norwich%20Postcode%20Map.svg	NR	2022-03-05 14:17:35.755411
55	5	Sheffield	http://77.68.102.60:9000/east-midlands/S%20-%20Sheffield%20Postcode%20Map.svg	S	2022-03-05 14:17:35.787856
56	6	Birmingham	http://77.68.102.60:9000/west-midlands/B%20-%20Birmingham%20Postcode%20Map.svg	B	2022-03-05 14:19:44.456354
57	6	Stoke	http://77.68.102.60:9000/west-midlands/ST%20-%20Stoke%20on%20Trent%20Postcode%20Map.svg	ST	2022-03-05 14:19:44.47277
58	6	Worcester	http://77.68.102.60:9000/west-midlands/WR%20Worcester%20Postcode%20Map.svg	WR	2022-03-05 14:19:44.48769
59	6	Hereford	http://77.68.102.60:9000/west-midlands/HR%20-%20Hereford%20Postcode%20Map.svg	HR	2022-03-05 14:19:44.505893
60	6	Walsall	http://77.68.102.60:9000/west-midlands/WS%20-%20Walsall%20Postcode%20Map.svg	WS	2022-03-05 14:19:44.547324
61	6	Coventry	http://77.68.102.60:9000/west-midlands/CV%20-%20Coventry%20Postcode%20Map.svg	CV	2022-03-05 14:19:44.615334
62	6	Telford	http://77.68.102.60:9000/west-midlands/TF%20-%20Telford%20Postcode%20Map.svg	TF	2022-03-05 14:19:44.62509
63	6	Wolverhampton	http://77.68.102.60:9000/west-midlands/WV%20-%20Wolverhampton%20Postcode%20Map.svg	WV	2022-03-05 14:19:44.632101
64	6	Dudley	http://77.68.102.60:9000/west-midlands/DY%20-%20Dudley%20Postcode%20Map.svg	DY	2022-03-05 14:19:44.651108
65	6	Northampton	http://77.68.102.60:9000/west-midlands/NN%20-%20Northampton%20Postcode%20Map.svg	NN	2022-03-05 14:19:44.67263
66	7	Shrewsbury	http://77.68.102.60:9000/wales/SY%20-%20Shrewsbury%20Postcode%20Map.svg	SY	2022-03-05 14:21:01.835051
67	7	Landrindod	http://77.68.102.60:9000/wales/LD%20-%20Llandrindod%20Postcode%20Map.svg	LD	2022-03-05 14:21:01.848491
68	7	Wrexham	http://77.68.102.60:9000/wales/LL%20-%20Wrexham%20Postcode%20Map.svg	LL	2022-03-05 14:21:01.886314
69	7	Newport	http://77.68.102.60:9000/wales/NP%20-%20Newport%20Postcode%20Map.svg	NP	2022-03-05 14:21:01.889252
70	7	Swansea	http://77.68.102.60:9000/wales/SA%20-%20Swansea%20Postcode%20Map.svg	SA	2022-03-05 14:21:01.90743
71	7	Cardiff	http://77.68.102.60:9000/wales/CF%20-%20Cardiff%20Postcode%20Map.svg	CF	2022-03-05 14:21:01.911447
72	8	Bournemouth	http://77.68.102.60:9000/south-west/BH%20-%20Bournemouth%20Postcode%20Map.svg	BH	2022-03-05 14:21:56.450751
73	8	Exeter	http://77.68.102.60:9000/south-west/EX%20-%20Exeter%20Postcode%20Map.svg	EX	2022-03-05 14:21:56.463209
74	8	Bath	http://77.68.102.60:9000/south-west/BA%20-%20Bath%20Postcode%20Map.svg	BA	2022-03-05 14:21:56.470622
75	8	Torquay	http://77.68.102.60:9000/south-west/TQ%20-%20Torquay%20Postcode%20Map.svg	TQ	2022-03-05 14:21:56.47249
76	8	Gloucester	http://77.68.102.60:9000/south-west/Gloucester%20GL%20south%20west.svg	GL	2022-03-05 14:21:56.492847
77	8	Plymouth	http://77.68.102.60:9000/south-west/PL%20-%20Plymouth%20Postcode%20Map.svg	PL	2022-03-05 14:21:56.495626
78	8	Bristol	http://77.68.102.60:9000/south-west/BS%20-%20Bristol%20Postcode%20Map.svg	BS	2022-03-05 14:21:56.501091
79	8	Salisbury	http://77.68.102.60:9000/south-west/SP%20-%20Salisbury%20Postcode%20Map.svg	SP	2022-03-05 14:21:56.502536
80	8	Truro	http://77.68.102.60:9000/south-west/TR%20-%20Truro%20Postcode%20Map%20.svg	TR	2022-03-05 14:21:56.504324
81	8	Taunton	http://77.68.102.60:9000/south-west/TA%20-%20Taunton%20Postcode%20Map.svg	TA	2022-03-05 14:21:56.521658
82	9	Hemel	http://77.68.102.60:9000/south-east/HP%20-%20Hemel%20Hempstead%20%20Postcode%20Map.svg	HP	2022-03-05 14:24:03.032025
83	9	Chelmsford	http://77.68.102.60:9000/south-east/CM%20-%20Chelmsford%20Postcode%20Map.svg	CM	2022-03-05 14:24:03.035877
84	9	St Albans	http://77.68.102.60:9000/south-east/AL%20-%20St%20Albans%20Postcode%20Map.svg	AL	2022-03-05 14:24:03.037678
85	9	Luton	http://77.68.102.60:9000/south-east/LU%20-%20Luton%20Postcode%20Map.svg	LU	2022-03-05 14:24:03.051968
86	9	Guilford	http://77.68.102.60:9000/south-east/GU%20-%20Guilford%20Postcode%20Map.svg	GU	2022-03-05 14:24:03.05421
87	9	Southend	http://77.68.102.60:9000/south-east/SS%20-%20Southend%20on%20Sea%20Postcode%20Map.svg	SS	2022-03-05 14:24:03.062813
88	9	Portsmouth	http://77.68.102.60:9000/south-east/PO%20-%20Portsmouth%20Postcode%20Map.svg	PO	2022-03-05 14:24:03.066147
89	9	Slough	http://77.68.102.60:9000/south-east/SL%20-%20Slough%20Postcode%20Map.svg	SL	2022-03-05 14:24:03.073044
90	9	Redhill	http://77.68.102.60:9000/south-east/RH%20-%20Redhill%20Postcode%20Map.svg	RH	2022-03-05 14:24:03.078346
91	9	Reading	http://77.68.102.60:9000/south-east/RG%20-%20Reading%20Postcode%20Map.svg	RG	2022-03-05 14:24:03.079942
92	9	Stevenage	http://77.68.102.60:9000/south-east/SG%20-%20Stevenage%20Postcode%20Map.svg	SG	2022-03-05 14:24:03.081549
93	9	Southampton	http://77.68.102.60:9000/south-east/SO%20-%20Southampton%20Postcode%20Map.svg	SO	2022-03-05 14:24:03.08319
94	9	Brighton	http://77.68.102.60:9000/south-east/BN%20-%20Brighton%20Postcode%20Map.svg	BN	2022-03-05 14:24:03.084905
95	9	Tonbridge	http://77.68.102.60:9000/south-east/TN%20-%20Tonbridge%20Postcode%20Map.svg	TN	2022-03-05 14:24:03.08706
96	9	Oxford	http://77.68.102.60:9000/south-east/OX%20-%20Oxford%20Postcode%20Map.svg	OX	2022-03-05 14:24:03.089274
97	9	Maidstone	http://77.68.102.60:9000/south-east/ME%20-%20Maidstone%20Postcode%20Map.svg	ME	2022-03-05 14:24:03.093774
98	9	Milton Keynes	http://77.68.102.60:9000/south-east/MK%20-%20Milton%20Keynes%20Postcode%20Map.svg	MK	2022-03-05 14:24:03.112303
99	9	Canterbury	http://77.68.102.60:9000/south-east/CT%20-%20Canterbury%20Postcode%20Map.svg	CT	2022-03-05 14:24:03.118573
100	10	Dartford	http://77.68.102.60:9000/greater-london/DA%20-%20Dartford%20Postcode%20Map.svg	DA	2022-03-05 14:25:18.762642
101	10	South West London	http://77.68.102.60:9000/greater-london/SW%20-%20South%20West%20London%20Postcode%20Map.svg	SW	2022-03-05 14:25:18.780297
102	10	Twickenham	http://77.68.102.60:9000/greater-london/TW%20-%20Twickenham%20Postcode%20Map.svg	TW	2022-03-05 14:25:18.783225
103	10	Bromley	http://77.68.102.60:9000/greater-london/BR%20Bromsgrove%20Postcode%20Map.svg	BR	2022-03-05 14:25:18.785769
104	10	Southall	http://77.68.102.60:9000/greater-london/UB%20-%20Southall%20Postcode%20Map.svg	UB	2022-03-05 14:25:18.787046
105	10	Romford	http://77.68.102.60:9000/greater-london/RM%20-%20Romford%20Postcode%20Map.svg	RM	2022-03-05 14:25:18.788364
106	10	Harrow	http://77.68.102.60:9000/greater-london/HA%20-%20Harrow%20Postcode%20Map.svg	HA	2022-03-05 14:25:18.796589
107	10	Enfield	http://77.68.102.60:9000/greater-london/EN%20-%20Enfield%20Postcode%20Map.svg	EN	2022-03-05 14:25:18.799915
108	10	Watford	http://77.68.102.60:9000/greater-london/WD%20-%20Watford%20Postcode%20Map.svg	WD	2022-03-05 14:25:18.802063
109	10	Ilford	http://77.68.102.60:9000/greater-london/IG%20-%20Ilford%20Postcode%20Map.svg	IG	2022-03-05 14:25:18.803401
110	10	North West London	http://77.68.102.60:9000/greater-london/NW%20North%20West%20London%20Postcode%20Map.svg	NW	2022-03-05 14:25:18.81036
111	10	North London	http://77.68.102.60:9000/greater-london/N%20-%20North%20London%20Postcode%20Map.svg	N	2022-03-05 14:25:18.820304
112	10	South East London	http://77.68.102.60:9000/greater-london/SE%20South%20East%20London%20Postcode%20Map.svg	SE	2022-03-05 14:25:18.840291
113	10	West London	http://77.68.102.60:9000/greater-london/W%20-%20West%20London%20Postcode%20Map.svg	W	2022-03-05 14:25:18.855196
\.


--
-- Name: service_boundary_regions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.service_boundary_regions_id_seq', 10, true);


--
-- Name: service_boundary_subregion_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.service_boundary_subregion_codes_id_seq', 1, false);


--
-- Name: service_boundary_subregions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.service_boundary_subregions_id_seq', 113, true);


--
-- Name: service_boundary_regions service_boundary_regions_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.service_boundary_regions
    ADD CONSTRAINT service_boundary_regions_pkey PRIMARY KEY (id);


--
-- Name: service_boundary_subregion_codes service_boundary_subregion_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.service_boundary_subregion_codes
    ADD CONSTRAINT service_boundary_subregion_codes_pkey PRIMARY KEY (id);


--
-- Name: service_boundary_subregions service_boundary_subregions_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.service_boundary_subregions
    ADD CONSTRAINT service_boundary_subregions_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

