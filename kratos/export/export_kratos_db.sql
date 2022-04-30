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
-- Name: continuity_containers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.continuity_containers (
    id uuid NOT NULL,
    identity_id uuid,
    name character varying(255) NOT NULL,
    payload jsonb,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    nid uuid
);


ALTER TABLE public.continuity_containers OWNER TO postgres;

--
-- Name: courier_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courier_messages (
    id uuid NOT NULL,
    type integer NOT NULL,
    status integer NOT NULL,
    body text NOT NULL,
    subject character varying(255) NOT NULL,
    recipient character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    template_type character varying(255) DEFAULT ''::character varying NOT NULL,
    template_data bytea,
    nid uuid
);


ALTER TABLE public.courier_messages OWNER TO postgres;

--
-- Name: identities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identities (
    id uuid NOT NULL,
    schema_id character varying(2048) NOT NULL,
    traits jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    nid uuid,
    state character varying(255) DEFAULT 'active'::character varying NOT NULL,
    state_changed_at timestamp without time zone
);


ALTER TABLE public.identities OWNER TO postgres;

--
-- Name: identity_credential_identifiers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_credential_identifiers (
    id uuid NOT NULL,
    identifier character varying(255) NOT NULL,
    identity_credential_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    nid uuid,
    identity_credential_type_id uuid NOT NULL
);


ALTER TABLE public.identity_credential_identifiers OWNER TO postgres;

--
-- Name: identity_credential_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_credential_types (
    id uuid NOT NULL,
    name character varying(32) NOT NULL
);


ALTER TABLE public.identity_credential_types OWNER TO postgres;

--
-- Name: identity_credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_credentials (
    id uuid NOT NULL,
    config jsonb NOT NULL,
    identity_credential_type_id uuid NOT NULL,
    identity_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    nid uuid
);


ALTER TABLE public.identity_credentials OWNER TO postgres;

--
-- Name: identity_recovery_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_recovery_addresses (
    id uuid NOT NULL,
    via character varying(16) NOT NULL,
    value character varying(400) NOT NULL,
    identity_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    nid uuid
);


ALTER TABLE public.identity_recovery_addresses OWNER TO postgres;

--
-- Name: identity_recovery_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_recovery_tokens (
    id uuid NOT NULL,
    token character varying(64) NOT NULL,
    used boolean DEFAULT false NOT NULL,
    used_at timestamp without time zone,
    identity_recovery_address_id uuid NOT NULL,
    selfservice_recovery_flow_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    expires_at timestamp without time zone DEFAULT '2000-01-01 00:00:00'::timestamp without time zone NOT NULL,
    issued_at timestamp without time zone DEFAULT '2000-01-01 00:00:00'::timestamp without time zone NOT NULL,
    nid uuid
);


ALTER TABLE public.identity_recovery_tokens OWNER TO postgres;

--
-- Name: identity_verifiable_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_verifiable_addresses (
    id uuid NOT NULL,
    status character varying(16) NOT NULL,
    via character varying(16) NOT NULL,
    verified boolean NOT NULL,
    value character varying(400) NOT NULL,
    verified_at timestamp without time zone,
    identity_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    nid uuid
);


ALTER TABLE public.identity_verifiable_addresses OWNER TO postgres;

--
-- Name: identity_verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_verification_tokens (
    id uuid NOT NULL,
    token character varying(64) NOT NULL,
    used boolean DEFAULT false NOT NULL,
    used_at timestamp without time zone,
    expires_at timestamp without time zone NOT NULL,
    issued_at timestamp without time zone NOT NULL,
    identity_verifiable_address_id uuid NOT NULL,
    selfservice_verification_flow_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    nid uuid
);


ALTER TABLE public.identity_verification_tokens OWNER TO postgres;

--
-- Name: networks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.networks (
    id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.networks OWNER TO postgres;

--
-- Name: schema_migration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schema_migration (
    version character varying(48) NOT NULL,
    version_self integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.schema_migration OWNER TO postgres;

--
-- Name: selfservice_errors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.selfservice_errors (
    id uuid NOT NULL,
    errors jsonb NOT NULL,
    seen_at timestamp without time zone,
    was_seen boolean NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    csrf_token character varying(255) DEFAULT ''::character varying NOT NULL,
    nid uuid
);


ALTER TABLE public.selfservice_errors OWNER TO postgres;

--
-- Name: selfservice_login_flows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.selfservice_login_flows (
    id uuid NOT NULL,
    request_url character varying(2048) NOT NULL,
    issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    active_method character varying(32) NOT NULL,
    csrf_token character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    forced boolean DEFAULT false NOT NULL,
    type character varying(16) DEFAULT 'browser'::character varying NOT NULL,
    ui jsonb,
    nid uuid,
    requested_aal character varying(4) DEFAULT 'aal1'::character varying NOT NULL,
    internal_context jsonb NOT NULL
);


ALTER TABLE public.selfservice_login_flows OWNER TO postgres;

--
-- Name: selfservice_recovery_flows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.selfservice_recovery_flows (
    id uuid NOT NULL,
    request_url character varying(2048) NOT NULL,
    issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    active_method character varying(32),
    csrf_token character varying(255) NOT NULL,
    state character varying(32) NOT NULL,
    recovered_identity_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    type character varying(16) DEFAULT 'browser'::character varying NOT NULL,
    ui jsonb,
    nid uuid
);


ALTER TABLE public.selfservice_recovery_flows OWNER TO postgres;

--
-- Name: selfservice_registration_flows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.selfservice_registration_flows (
    id uuid NOT NULL,
    request_url character varying(2048) NOT NULL,
    issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    active_method character varying(32) NOT NULL,
    csrf_token character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    type character varying(16) DEFAULT 'browser'::character varying NOT NULL,
    ui jsonb,
    nid uuid,
    internal_context jsonb NOT NULL
);


ALTER TABLE public.selfservice_registration_flows OWNER TO postgres;

--
-- Name: selfservice_settings_flows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.selfservice_settings_flows (
    id uuid NOT NULL,
    request_url character varying(2048) NOT NULL,
    issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    identity_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    active_method character varying(32),
    state character varying(255) DEFAULT 'show_form'::character varying NOT NULL,
    type character varying(16) DEFAULT 'browser'::character varying NOT NULL,
    ui jsonb,
    nid uuid,
    internal_context jsonb NOT NULL
);


ALTER TABLE public.selfservice_settings_flows OWNER TO postgres;

--
-- Name: selfservice_verification_flows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.selfservice_verification_flows (
    id uuid NOT NULL,
    request_url character varying(2048) NOT NULL,
    issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    csrf_token character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    type character varying(16) DEFAULT 'browser'::character varying NOT NULL,
    state character varying(255) DEFAULT 'show_form'::character varying NOT NULL,
    active_method character varying(32),
    ui jsonb,
    nid uuid
);


ALTER TABLE public.selfservice_verification_flows OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid NOT NULL,
    issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    authenticated_at timestamp without time zone NOT NULL,
    identity_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    token character varying(32),
    active boolean DEFAULT false,
    nid uuid,
    logout_token character varying(32),
    aal character varying(4) DEFAULT 'aal1'::character varying NOT NULL,
    authentication_methods jsonb NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Data for Name: continuity_containers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.continuity_containers (id, identity_id, name, payload, expires_at, created_at, updated_at, nid) FROM stdin;
\.


--
-- Data for Name: courier_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courier_messages (id, type, status, body, subject, recipient, created_at, updated_at, template_type, template_data, nid) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identities (id, schema_id, traits, created_at, updated_at, nid, state, state_changed_at) FROM stdin;
9f900efa-a5ea-4dfd-8311-a8c7448ffeec	123	{}	2022-04-28 16:41:22.520771	2022-04-28 16:41:22.520771	9f900efa-a5ea-4dfd-8311-a8c7448ffeec	browser	2022-04-28 16:41:22.520771
9f900efa-a5ea-4dfd-8311-a8c7448ffeed	9f900efa-a5ea-4dfd-8311-a8c7448ffeec	{}	2022-04-29 13:19:22.284875	2022-04-29 13:19:22.284875	9f900efa-a5ea-4dfd-8311-a8c7448ffeec	active	2022-04-29 13:19:22.284875
\.


--
-- Data for Name: identity_credential_identifiers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_credential_identifiers (id, identifier, identity_credential_id, created_at, updated_at, nid, identity_credential_type_id) FROM stdin;
\.


--
-- Data for Name: identity_credential_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_credential_types (id, name) FROM stdin;
78c1b41d-8341-4507-aa60-aff1d4369670	password
6fa5e2e0-bfce-4631-b62b-cf2b0252b289	oidc
5e29b036-aa47-457f-9fe6-aa8b854a752b	totp
567a0730-7f48-4dd7-a13d-df87a51c245f	lookup_secret
6b213fa0-e6ad-46cb-8878-b088d2ce2e3c	webauthn
\.


--
-- Data for Name: identity_credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_credentials (id, config, identity_credential_type_id, identity_id, created_at, updated_at, nid) FROM stdin;
\.


--
-- Data for Name: identity_recovery_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_recovery_addresses (id, via, value, identity_id, created_at, updated_at, nid) FROM stdin;
9f900efa-a5ea-4dfd-8311-a8c7448ffeee	browser	/root	9f900efa-a5ea-4dfd-8311-a8c7448ffeed	2022-04-29 13:32:46.54954	2022-04-29 13:32:46.54954	9f900efa-a5ea-4dfd-8311-a8c7448ffeec
\.


--
-- Data for Name: identity_recovery_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_recovery_tokens (id, token, used, used_at, identity_recovery_address_id, selfservice_recovery_flow_id, created_at, updated_at, expires_at, issued_at, nid) FROM stdin;
\.


--
-- Data for Name: identity_verifiable_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_verifiable_addresses (id, status, via, verified, value, verified_at, identity_id, created_at, updated_at, nid) FROM stdin;
9f900efa-a5ea-4dfd-8311-a8c7448ffeef	active	browser	f	/root	2022-04-29 13:33:31.873795	9f900efa-a5ea-4dfd-8311-a8c7448ffeed	2022-04-29 13:33:31.873795	2022-04-29 13:33:31.873795	9f900efa-a5ea-4dfd-8311-a8c7448ffeec
\.


--
-- Data for Name: identity_verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_verification_tokens (id, token, used, used_at, expires_at, issued_at, identity_verifiable_address_id, selfservice_verification_flow_id, created_at, updated_at, nid) FROM stdin;
\.


--
-- Data for Name: networks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.networks (id, created_at, updated_at) FROM stdin;
9f900efa-a5ea-4dfd-8311-a8c7448ffeec	2022-04-28 16:41:18.883348	2022-04-28 16:41:18.883348
\.


--
-- Data for Name: schema_migration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schema_migration (version, version_self) FROM stdin;
20150100000001000000	0
20191100000001000000	0
20191100000001000001	0
20191100000001000002	0
20191100000001000003	0
20191100000001000004	0
20191100000001000005	0
20191100000002000000	0
20191100000002000001	0
20191100000002000002	0
20191100000002000003	0
20191100000002000004	0
20191100000003000000	0
20191100000004000000	0
20191100000006000000	0
20191100000007000000	0
20191100000008000000	0
20191100000008000001	0
20191100000008000002	0
20191100000008000003	0
20191100000008000004	0
20191100000008000005	0
20191100000010000000	0
20191100000010000001	0
20191100000011000000	0
20191100000012000000	0
20200317160354000000	0
20200317160354000001	0
20200317160354000002	0
20200317160354000003	0
20200317160354000004	0
20200401183443000000	0
20200402142539000000	0
20200402142539000001	0
20200402142539000002	0
20200519101057000000	0
20200519101057000001	0
20200519101057000002	0
20200519101057000003	0
20200519101057000004	0
20200519101057000005	0
20200519101057000006	0
20200519101057000007	0
20200601101000000000	0
20200605111551000000	0
20200605111551000001	0
20200605111551000002	0
20200607165100000000	0
20200607165100000001	0
20200705105359000000	0
20200810141652000000	0
20200810141652000001	0
20200810141652000002	0
20200810141652000003	0
20200810141652000004	0
20200810161022000000	0
20200810161022000001	0
20200810161022000002	0
20200810161022000003	0
20200810161022000004	0
20200810161022000005	0
20200810161022000006	0
20200810161022000007	0
20200810161022000008	0
20200810162450000000	0
20200810162450000001	0
20200810162450000002	0
20200810162450000003	0
20200812124254000000	0
20200812124254000001	0
20200812124254000002	0
20200812124254000003	0
20200812124254000004	0
20200812160551000000	0
20200830121710000000	0
20200830130642000000	0
20200830130642000001	0
20200830130642000002	0
20200830130642000003	0
20200830130642000004	0
20200830130642000005	0
20200830130642000006	0
20200830130642000007	0
20200830130643000000	0
20200830130644000000	0
20200830130644000001	0
20200830130645000000	0
20200830130646000000	0
20200830130646000001	0
20200830130646000002	0
20200830154602000000	0
20200830154602000001	0
20200830154602000002	0
20200830154602000003	0
20200830154602000004	0
20200830172221000000	0
20200830172221000001	0
20200830172221000002	0
20200830172221000003	0
20200831110752000000	0
20200831110752000001	0
20200831110752000002	0
20200831110752000003	0
20200831110752000004	0
20200831110752000005	0
20200831110752000006	0
20200831110752000007	0
20201201161451000000	0
20201201161451000001	0
20210307130558000000	0
20210307130559000000	0
20210307130559000001	0
20210311102338000000	0
20210311102338000001	0
20210311102338000002	0
20210311102338000003	0
20210311102338000004	0
20210311102338000005	0
20210311102338000006	0
20210311102338000007	0
20210311102338000008	0
20210311102338000009	0
20210311102338000010	0
20210311102338000011	0
20210311102338000012	0
20210311102338000013	0
20210311102338000014	0
20210311102338000015	0
20210311102338000016	0
20210311102338000017	0
20210311102338000018	0
20210311102338000019	0
20210311102338000020	0
20210311102338000021	0
20210311102338000022	0
20210311102338000023	0
20210311102338000024	0
20210410175418000000	0
20210410175418000001	0
20210410175418000002	0
20210410175418000003	0
20210410175418000004	0
20210410175418000005	0
20210410175418000006	0
20210410175418000007	0
20210410175418000008	0
20210410175418000009	0
20210410175418000010	0
20210410175418000011	0
20210410175418000012	0
20210410175418000013	0
20210410175418000014	0
20210410175418000015	0
20210410175418000016	0
20210410175418000017	0
20210410175418000018	0
20210410175418000019	0
20210410175418000020	0
20210410175418000021	0
20210410175418000022	0
20210410175418000023	0
20210410175418000024	0
20210410175418000025	0
20210410175418000026	0
20210410175418000027	0
20210410175418000028	0
20210410175418000029	0
20210410175418000030	0
20210410175418000031	0
20210410175418000032	0
20210410175418000033	0
20210410175418000034	0
20210410175418000035	0
20210410175418000036	0
20210410175418000037	0
20210410175418000038	0
20210410175418000039	0
20210410175418000040	0
20210410175418000041	0
20210410175418000042	0
20210410175418000043	0
20210410175418000044	0
20210410175418000045	0
20210410175418000046	0
20210410175418000047	0
20210410175418000048	0
20210410175418000049	0
20210410175418000050	0
20210410175418000051	0
20210410175418000052	0
20210410175418000053	0
20210410175418000054	0
20210410175418000055	0
20210410175418000056	0
20210410175418000057	0
20210410175418000058	0
20210410175418000059	0
20210410175418000060	0
20210410175418000061	0
20210410175418000062	0
20210410175418000063	0
20210410175418000064	0
20210410175418000065	0
20210410175418000066	0
20210410175418000067	0
20210410175418000068	0
20210410175418000069	0
20210410175418000070	0
20210410175418000071	0
20210410175418000072	0
20210410175418000073	0
20210410175418000074	0
20210410175418000075	0
20210410175418000076	0
20210410175418000077	0
20210410175418000078	0
20210410175418000079	0
20210410175418000080	0
20210410175418000081	0
20210410175418000082	0
20210410175418000083	0
20210410175418000084	0
20210410175418000085	0
20210410175418000086	0
20210410175418000087	0
20210410175418000088	0
20210410175418000089	0
20210504121624000000	0
20210504121624000001	0
20210618103120000000	0
20210618103120000001	0
20210618103120000002	0
20210618103120000003	0
20210618103120000004	0
20210805112414000000	0
20210805112414000001	0
20210805112414000002	0
20210805122535000000	0
20210810153530000000	0
20210810153530000001	0
20210810153530000002	0
20210810153530000003	0
20210810153530000004	0
20210813150152000000	0
20210816113956000000	0
20210816142650000000	0
20210816142650000001	0
20210816142650000002	0
20210816142650000003	0
20210816142650000004	0
20210816142650000005	0
20210817181232000000	0
20210817181232000001	0
20210817181232000002	0
20210817181232000003	0
20210817181232000004	0
20210817181232000005	0
20210829131458000000	0
\.


--
-- Data for Name: selfservice_errors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.selfservice_errors (id, errors, seen_at, was_seen, created_at, updated_at, csrf_token, nid) FROM stdin;
9f900efa-a5ea-4dfd-8311-a8c7448ffeec	{"code": 500, "reason": "This is a stub error.", "status": "Internal Server Error", "message": "An internal server error occurred, please contact the system administrator"}	2022-04-28 13:34:43.458779	t	2022-04-28 13:34:43.458779	2022-04-28 13:34:43.458779		\N
\.


--
-- Data for Name: selfservice_login_flows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.selfservice_login_flows (id, request_url, issued_at, expires_at, active_method, csrf_token, created_at, updated_at, forced, type, ui, nid, requested_aal, internal_context) FROM stdin;
9f900efa-a5ea-4dfd-8311-a8c7448ffeec	/root	2022-04-28 15:16:34.104419	2022-04-28 15:16:34.104419	true	132	2022-04-28 15:16:34.104419	2022-04-28 15:16:34.104419	t	browser	{"nodes": {"type": "api", "group": "one", "messages": {"id": 2, "text": "update", "type": "container", "context": "api"}, "attributes": {"type": "attr"}}, "action": "active", "method": "post", "messages": [{"id": 1, "text": "update", "type": "container", "context": "api"}]}	\N	aal1	{}
\.


--
-- Data for Name: selfservice_recovery_flows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.selfservice_recovery_flows (id, request_url, issued_at, expires_at, active_method, csrf_token, state, recovered_identity_id, created_at, updated_at, type, ui, nid) FROM stdin;
9f900efa-a5ea-4dfd-8311-a8c7448ffeec	/root	2022-04-28 16:41:28.495977	2022-04-28 16:41:28.495977	true	132	test	9f900efa-a5ea-4dfd-8311-a8c7448ffeec	2022-04-28 16:41:28.495977	2022-04-28 16:41:28.495977	browser	{"nodes": {"type": "api", "group": "one", "messages": {"id": 2, "text": "update", "type": "container", "context": "api"}, "attributes": {"type": "attr"}}, "action": "active", "method": "post", "messages": [{"id": 1, "text": "update", "type": "container", "context": "api"}]}	\N
\.


--
-- Data for Name: selfservice_registration_flows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.selfservice_registration_flows (id, request_url, issued_at, expires_at, active_method, csrf_token, created_at, updated_at, type, ui, nid, internal_context) FROM stdin;
9f900efa-a5ea-4dfd-8311-a8c7448ffeec	/root	2022-04-28 16:56:01.685034	2022-04-28 16:56:01.685034	true	132	2022-04-28 16:56:01.685034	2022-04-28 16:56:01.685034	browser	{"nodes": {"type": "api", "group": "one", "messages": {"id": 2, "text": "update", "type": "container", "context": "api"}, "attributes": {"type": "attr"}}, "action": "active", "method": "post", "messages": [{"id": 1, "text": "update", "type": "container", "context": "api"}]}	9f900efa-a5ea-4dfd-8311-a8c7448ffeec	{}
\.


--
-- Data for Name: selfservice_settings_flows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.selfservice_settings_flows (id, request_url, issued_at, expires_at, identity_id, created_at, updated_at, active_method, state, type, ui, nid, internal_context) FROM stdin;
\.


--
-- Data for Name: selfservice_verification_flows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.selfservice_verification_flows (id, request_url, issued_at, expires_at, csrf_token, created_at, updated_at, type, state, active_method, ui, nid) FROM stdin;
9f900efa-a5ea-4dfd-8311-a8c7448ffeec	/root	2022-04-29 11:53:53.355803	2022-04-29 11:53:53.355803	true	2022-04-29 11:53:53.355803	2022-04-29 11:53:53.355803	browser	show_form	true	{"nodes": {"type": "api", "group": "one", "messages": {"id": 2, "text": "update", "type": "container", "context": "api"}, "attributes": {"type": "attr"}}, "action": "active", "method": "post", "messages": [{"id": 1, "text": "update", "type": "container", "context": "api"}]}	9f900efa-a5ea-4dfd-8311-a8c7448ffeec
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, issued_at, expires_at, authenticated_at, identity_id, created_at, updated_at, token, active, nid, logout_token, aal, authentication_methods) FROM stdin;
\.


--
-- Name: continuity_containers continuity_containers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.continuity_containers
    ADD CONSTRAINT continuity_containers_pkey PRIMARY KEY (id);


--
-- Name: courier_messages courier_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courier_messages
    ADD CONSTRAINT courier_messages_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identity_credential_identifiers identity_credential_identifiers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_credential_identifiers
    ADD CONSTRAINT identity_credential_identifiers_pkey PRIMARY KEY (id);


--
-- Name: identity_credential_types identity_credential_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_credential_types
    ADD CONSTRAINT identity_credential_types_pkey PRIMARY KEY (id);


--
-- Name: identity_credentials identity_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_credentials
    ADD CONSTRAINT identity_credentials_pkey PRIMARY KEY (id);


--
-- Name: identity_recovery_addresses identity_recovery_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_recovery_addresses
    ADD CONSTRAINT identity_recovery_addresses_pkey PRIMARY KEY (id);


--
-- Name: identity_recovery_tokens identity_recovery_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_recovery_tokens
    ADD CONSTRAINT identity_recovery_tokens_pkey PRIMARY KEY (id);


--
-- Name: identity_verifiable_addresses identity_verifiable_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_verifiable_addresses
    ADD CONSTRAINT identity_verifiable_addresses_pkey PRIMARY KEY (id);


--
-- Name: identity_verification_tokens identity_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_verification_tokens
    ADD CONSTRAINT identity_verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: networks networks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.networks
    ADD CONSTRAINT networks_pkey PRIMARY KEY (id);


--
-- Name: selfservice_errors selfservice_errors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_errors
    ADD CONSTRAINT selfservice_errors_pkey PRIMARY KEY (id);


--
-- Name: selfservice_login_flows selfservice_login_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_login_flows
    ADD CONSTRAINT selfservice_login_requests_pkey PRIMARY KEY (id);


--
-- Name: selfservice_settings_flows selfservice_profile_management_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_settings_flows
    ADD CONSTRAINT selfservice_profile_management_requests_pkey PRIMARY KEY (id);


--
-- Name: selfservice_recovery_flows selfservice_recovery_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_recovery_flows
    ADD CONSTRAINT selfservice_recovery_requests_pkey PRIMARY KEY (id);


--
-- Name: selfservice_registration_flows selfservice_registration_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_registration_flows
    ADD CONSTRAINT selfservice_registration_requests_pkey PRIMARY KEY (id);


--
-- Name: selfservice_verification_flows selfservice_verification_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_verification_flows
    ADD CONSTRAINT selfservice_verification_requests_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: continuity_containers_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX continuity_containers_nid_idx ON public.continuity_containers USING btree (id, nid);


--
-- Name: courier_messages_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX courier_messages_nid_idx ON public.courier_messages USING btree (id, nid);


--
-- Name: courier_messages_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX courier_messages_status_idx ON public.courier_messages USING btree (status);


--
-- Name: identities_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identities_nid_idx ON public.identities USING btree (id, nid);


--
-- Name: identity_credential_identifiers_identifier_nid_type_uq_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX identity_credential_identifiers_identifier_nid_type_uq_idx ON public.identity_credential_identifiers USING btree (nid, identity_credential_type_id, identifier);


--
-- Name: identity_credential_identifiers_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_credential_identifiers_nid_idx ON public.identity_credential_identifiers USING btree (id, nid);


--
-- Name: identity_credential_types_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX identity_credential_types_name_idx ON public.identity_credential_types USING btree (name);


--
-- Name: identity_credentials_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_credentials_nid_idx ON public.identity_credentials USING btree (id, nid);


--
-- Name: identity_recovery_addresses_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_recovery_addresses_code_idx ON public.identity_recovery_tokens USING btree (token);


--
-- Name: identity_recovery_addresses_code_uq_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX identity_recovery_addresses_code_uq_idx ON public.identity_recovery_tokens USING btree (token);


--
-- Name: identity_recovery_addresses_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_recovery_addresses_nid_idx ON public.identity_recovery_addresses USING btree (id, nid);


--
-- Name: identity_recovery_addresses_status_via_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_recovery_addresses_status_via_idx ON public.identity_recovery_addresses USING btree (nid, via, value);


--
-- Name: identity_recovery_addresses_status_via_uq_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX identity_recovery_addresses_status_via_uq_idx ON public.identity_recovery_addresses USING btree (nid, via, value);


--
-- Name: identity_recovery_tokens_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_recovery_tokens_nid_idx ON public.identity_recovery_tokens USING btree (id, nid);


--
-- Name: identity_verifiable_addresses_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_verifiable_addresses_nid_idx ON public.identity_verifiable_addresses USING btree (id, nid);


--
-- Name: identity_verifiable_addresses_status_via_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_verifiable_addresses_status_via_idx ON public.identity_verifiable_addresses USING btree (nid, via, value);


--
-- Name: identity_verifiable_addresses_status_via_uq_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX identity_verifiable_addresses_status_via_uq_idx ON public.identity_verifiable_addresses USING btree (nid, via, value);


--
-- Name: identity_verification_tokens_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_verification_tokens_nid_idx ON public.identity_verification_tokens USING btree (id, nid);


--
-- Name: identity_verification_tokens_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_verification_tokens_token_idx ON public.identity_verification_tokens USING btree (token);


--
-- Name: identity_verification_tokens_token_uq_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX identity_verification_tokens_token_uq_idx ON public.identity_verification_tokens USING btree (token);


--
-- Name: identity_verification_tokens_verifiable_address_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_verification_tokens_verifiable_address_id_idx ON public.identity_verification_tokens USING btree (identity_verifiable_address_id);


--
-- Name: identity_verification_tokens_verification_flow_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_verification_tokens_verification_flow_id_idx ON public.identity_verification_tokens USING btree (selfservice_verification_flow_id);


--
-- Name: schema_migration_version_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX schema_migration_version_idx ON public.schema_migration USING btree (version);


--
-- Name: schema_migration_version_self_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX schema_migration_version_self_idx ON public.schema_migration USING btree (version_self);


--
-- Name: selfservice_errors_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX selfservice_errors_nid_idx ON public.selfservice_errors USING btree (id, nid);


--
-- Name: selfservice_login_flows_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX selfservice_login_flows_nid_idx ON public.selfservice_login_flows USING btree (id, nid);


--
-- Name: selfservice_recovery_flows_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX selfservice_recovery_flows_nid_idx ON public.selfservice_recovery_flows USING btree (id, nid);


--
-- Name: selfservice_registration_flows_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX selfservice_registration_flows_nid_idx ON public.selfservice_registration_flows USING btree (id, nid);


--
-- Name: selfservice_settings_flows_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX selfservice_settings_flows_nid_idx ON public.selfservice_settings_flows USING btree (id, nid);


--
-- Name: selfservice_verification_flows_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX selfservice_verification_flows_nid_idx ON public.selfservice_verification_flows USING btree (id, nid);


--
-- Name: sessions_logout_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_logout_token_idx ON public.sessions USING btree (logout_token);


--
-- Name: sessions_logout_token_uq_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sessions_logout_token_uq_idx ON public.sessions USING btree (logout_token);


--
-- Name: sessions_nid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_nid_idx ON public.sessions USING btree (id, nid);


--
-- Name: sessions_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_token_idx ON public.sessions USING btree (token);


--
-- Name: sessions_token_uq_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sessions_token_uq_idx ON public.sessions USING btree (token);


--
-- Name: continuity_containers continuity_containers_identity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.continuity_containers
    ADD CONSTRAINT continuity_containers_identity_id_fkey FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: continuity_containers continuity_containers_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.continuity_containers
    ADD CONSTRAINT continuity_containers_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: courier_messages courier_messages_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courier_messages
    ADD CONSTRAINT courier_messages_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: identities identities_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: identity_credential_identifiers identity_credential_identifiers_identity_credential_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_credential_identifiers
    ADD CONSTRAINT identity_credential_identifiers_identity_credential_id_fkey FOREIGN KEY (identity_credential_id) REFERENCES public.identity_credentials(id) ON DELETE CASCADE;


--
-- Name: identity_credential_identifiers identity_credential_identifiers_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_credential_identifiers
    ADD CONSTRAINT identity_credential_identifiers_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: identity_credential_identifiers identity_credential_identifiers_type_id_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_credential_identifiers
    ADD CONSTRAINT identity_credential_identifiers_type_id_fk_idx FOREIGN KEY (identity_credential_type_id) REFERENCES public.identity_credential_types(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: identity_credentials identity_credentials_identity_credential_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_credentials
    ADD CONSTRAINT identity_credentials_identity_credential_type_id_fkey FOREIGN KEY (identity_credential_type_id) REFERENCES public.identity_credential_types(id) ON DELETE CASCADE;


--
-- Name: identity_credentials identity_credentials_identity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_credentials
    ADD CONSTRAINT identity_credentials_identity_id_fkey FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: identity_credentials identity_credentials_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_credentials
    ADD CONSTRAINT identity_credentials_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: identity_recovery_addresses identity_recovery_addresses_identity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_recovery_addresses
    ADD CONSTRAINT identity_recovery_addresses_identity_id_fkey FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: identity_recovery_addresses identity_recovery_addresses_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_recovery_addresses
    ADD CONSTRAINT identity_recovery_addresses_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: identity_recovery_tokens identity_recovery_tokens_identity_recovery_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_recovery_tokens
    ADD CONSTRAINT identity_recovery_tokens_identity_recovery_address_id_fkey FOREIGN KEY (identity_recovery_address_id) REFERENCES public.identity_recovery_addresses(id) ON DELETE CASCADE;


--
-- Name: identity_recovery_tokens identity_recovery_tokens_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_recovery_tokens
    ADD CONSTRAINT identity_recovery_tokens_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: identity_recovery_tokens identity_recovery_tokens_selfservice_recovery_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_recovery_tokens
    ADD CONSTRAINT identity_recovery_tokens_selfservice_recovery_request_id_fkey FOREIGN KEY (selfservice_recovery_flow_id) REFERENCES public.selfservice_recovery_flows(id) ON DELETE CASCADE;


--
-- Name: identity_verifiable_addresses identity_verifiable_addresses_identity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_verifiable_addresses
    ADD CONSTRAINT identity_verifiable_addresses_identity_id_fkey FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: identity_verifiable_addresses identity_verifiable_addresses_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_verifiable_addresses
    ADD CONSTRAINT identity_verifiable_addresses_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: identity_verification_tokens identity_verification_tokens_identity_verifiable_address_i_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_verification_tokens
    ADD CONSTRAINT identity_verification_tokens_identity_verifiable_address_i_fkey FOREIGN KEY (identity_verifiable_address_id) REFERENCES public.identity_verifiable_addresses(id) ON DELETE CASCADE;


--
-- Name: identity_verification_tokens identity_verification_tokens_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_verification_tokens
    ADD CONSTRAINT identity_verification_tokens_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: identity_verification_tokens identity_verification_tokens_selfservice_verification_flow_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_verification_tokens
    ADD CONSTRAINT identity_verification_tokens_selfservice_verification_flow_fkey FOREIGN KEY (selfservice_verification_flow_id) REFERENCES public.selfservice_verification_flows(id) ON DELETE CASCADE;


--
-- Name: selfservice_errors selfservice_errors_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_errors
    ADD CONSTRAINT selfservice_errors_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: selfservice_login_flows selfservice_login_flows_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_login_flows
    ADD CONSTRAINT selfservice_login_flows_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: selfservice_settings_flows selfservice_profile_management_requests_identity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_settings_flows
    ADD CONSTRAINT selfservice_profile_management_requests_identity_id_fkey FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: selfservice_recovery_flows selfservice_recovery_flows_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_recovery_flows
    ADD CONSTRAINT selfservice_recovery_flows_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: selfservice_recovery_flows selfservice_recovery_requests_recovered_identity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_recovery_flows
    ADD CONSTRAINT selfservice_recovery_requests_recovered_identity_id_fkey FOREIGN KEY (recovered_identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: selfservice_registration_flows selfservice_registration_flows_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_registration_flows
    ADD CONSTRAINT selfservice_registration_flows_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: selfservice_settings_flows selfservice_settings_flows_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_settings_flows
    ADD CONSTRAINT selfservice_settings_flows_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: selfservice_verification_flows selfservice_verification_flows_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.selfservice_verification_flows
    ADD CONSTRAINT selfservice_verification_flows_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: sessions sessions_identity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_identity_id_fkey FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_nid_fk_idx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_nid_fk_idx FOREIGN KEY (nid) REFERENCES public.networks(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

