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
-- Name: calendars; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.calendars (
    id integer NOT NULL,
    name character varying,
    timezone character varying,
    business_hours character varying,
    default_ boolean DEFAULT false NOT NULL,
    ical_url character varying,
    public_holidays text,
    last_log text,
    last_sync timestamp without time zone,
    updated_by_id integer NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.calendars OWNER TO knowledgebase;

--
-- Name: calendars_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.calendars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.calendars_id_seq OWNER TO knowledgebase;

--
-- Name: calendars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.calendars_id_seq OWNED BY public.calendars.id;


--
-- Name: delayed_jobs; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.delayed_jobs (
    id integer NOT NULL,
    priority integer,
    attempts integer,
    handler text,
    last_error text,
    run_at timestamp without time zone,
    locked_at timestamp without time zone,
    failed_at timestamp without time zone,
    locked_by character varying,
    queue character varying,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.delayed_jobs OWNER TO knowledgebase;

--
-- Name: delayed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.delayed_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.delayed_jobs_id_seq OWNER TO knowledgebase;

--
-- Name: delayed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.delayed_jobs_id_seq OWNED BY public.delayed_jobs.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    note character varying,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type character varying
);


ALTER TABLE public.groups OWNER TO knowledgebase;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.groups_id_seq OWNER TO knowledgebase;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: groups_users; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.groups_users (
    user_id integer NOT NULL,
    group_id integer NOT NULL,
    access character varying DEFAULT 'full'::character varying NOT NULL
);


ALTER TABLE public.groups_users OWNER TO knowledgebase;

--
-- Name: knowledge_base_answer_translation_contents; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.knowledge_base_answer_translation_contents (
    id integer NOT NULL,
    body text
);


ALTER TABLE public.knowledge_base_answer_translation_contents OWNER TO knowledgebase;

--
-- Name: knowledge_base_answer_translation_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.knowledge_base_answer_translation_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_answer_translation_contents_id_seq OWNER TO knowledgebase;

--
-- Name: knowledge_base_answer_translation_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.knowledge_base_answer_translation_contents_id_seq OWNED BY public.knowledge_base_answer_translation_contents.id;


--
-- Name: knowledge_base_article_translations; Type: TABLE; Schema: public; Owner: knowledgebase
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
    is_update_scheduled boolean DEFAULT false
);


ALTER TABLE public.knowledge_base_article_translations OWNER TO knowledgebase;

--
-- Name: knowledge_base_answer_translations_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.knowledge_base_answer_translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_answer_translations_id_seq OWNER TO knowledgebase;

--
-- Name: knowledge_base_answer_translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.knowledge_base_answer_translations_id_seq OWNED BY public.knowledge_base_article_translations.id;


--
-- Name: knowledge_base_articles; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.knowledge_base_articles (
    id integer NOT NULL,
    category_id integer NOT NULL,
    "position" integer NOT NULL,
    updated_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    knowledge_base_id integer
);


ALTER TABLE public.knowledge_base_articles OWNER TO knowledgebase;

--
-- Name: knowledge_base_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.knowledge_base_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_answers_id_seq OWNER TO knowledgebase;

--
-- Name: knowledge_base_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.knowledge_base_answers_id_seq OWNED BY public.knowledge_base_articles.id;


--
-- Name: knowledge_base_article_delayed_jobs; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.knowledge_base_article_delayed_jobs OWNER TO knowledgebase;

--
-- Name: knowledge_base_article_delayed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.knowledge_base_article_delayed_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_article_delayed_jobs_id_seq OWNER TO knowledgebase;

--
-- Name: knowledge_base_article_delayed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.knowledge_base_article_delayed_jobs_id_seq OWNED BY public.knowledge_base_article_delayed_jobs.id;


--
-- Name: knowledge_base_categories; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.knowledge_base_categories (
    id integer NOT NULL,
    knowledge_base_id integer NOT NULL,
    parent_id integer,
    "position" integer NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL
);


ALTER TABLE public.knowledge_base_categories OWNER TO knowledgebase;

--
-- Name: knowledge_base_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.knowledge_base_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_categories_id_seq OWNER TO knowledgebase;

--
-- Name: knowledge_base_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.knowledge_base_categories_id_seq OWNED BY public.knowledge_base_categories.id;


--
-- Name: knowledge_base_category_delayed_jobs; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.knowledge_base_category_delayed_jobs (
    id integer NOT NULL,
    knowledge_base_category_translation_id integer NOT NULL,
    run_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    knowledge_base_id integer,
    publish_update_delete character varying
);


ALTER TABLE public.knowledge_base_category_delayed_jobs OWNER TO knowledgebase;

--
-- Name: knowledge_base_category_delayed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.knowledge_base_category_delayed_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_category_delayed_jobs_id_seq OWNER TO knowledgebase;

--
-- Name: knowledge_base_category_delayed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.knowledge_base_category_delayed_jobs_id_seq OWNED BY public.knowledge_base_category_delayed_jobs.id;


--
-- Name: knowledge_base_category_translations; Type: TABLE; Schema: public; Owner: knowledgebase
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
    group_name character varying DEFAULT ''::character varying,
    is_delete_scheduled boolean DEFAULT false NOT NULL,
    is_update_scheduled boolean DEFAULT false NOT NULL
);


ALTER TABLE public.knowledge_base_category_translations OWNER TO knowledgebase;

--
-- Name: knowledge_base_category_translations_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.knowledge_base_category_translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_category_translations_id_seq OWNER TO knowledgebase;

--
-- Name: knowledge_base_category_translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.knowledge_base_category_translations_id_seq OWNED BY public.knowledge_base_category_translations.id;


--
-- Name: knowledge_base_locales; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.knowledge_base_locales (
    id integer NOT NULL,
    knowledge_base_id integer NOT NULL,
    system_locale_id integer NOT NULL,
    primary_ boolean NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL
);


ALTER TABLE public.knowledge_base_locales OWNER TO knowledgebase;

--
-- Name: knowledge_base_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.knowledge_base_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_locales_id_seq OWNER TO knowledgebase;

--
-- Name: knowledge_base_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.knowledge_base_locales_id_seq OWNED BY public.knowledge_base_locales.id;


--
-- Name: knowledge_base_menu_items; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.knowledge_base_menu_items (
    id integer NOT NULL,
    kb_locale_id integer NOT NULL,
    location character varying NOT NULL,
    "position" integer NOT NULL,
    title character varying NOT NULL,
    url character varying NOT NULL,
    new_tab boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP) NOT NULL
);


ALTER TABLE public.knowledge_base_menu_items OWNER TO knowledgebase;

--
-- Name: knowledge_base_menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.knowledge_base_menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_base_menu_items_id_seq OWNER TO knowledgebase;

--
-- Name: knowledge_base_menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.knowledge_base_menu_items_id_seq OWNED BY public.knowledge_base_menu_items.id;


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
    active boolean DEFAULT false
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
-- Name: knowledge_bases; Type: TABLE; Schema: public; Owner: knowledgebase
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
    "position" integer DEFAULT '-1'::integer NOT NULL
);


ALTER TABLE public.knowledge_bases OWNER TO knowledgebase;

--
-- Name: knowledge_bases_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.knowledge_bases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_bases_id_seq OWNER TO knowledgebase;

--
-- Name: knowledge_bases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.knowledge_bases_id_seq OWNED BY public.knowledge_bases.id;


--
-- Name: link_objects; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.link_objects (
    id integer NOT NULL,
    name character varying NOT NULL,
    note character varying,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.link_objects OWNER TO knowledgebase;

--
-- Name: link_objects_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.link_objects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.link_objects_id_seq OWNER TO knowledgebase;

--
-- Name: link_objects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.link_objects_id_seq OWNED BY public.link_objects.id;


--
-- Name: link_types; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.link_types (
    id integer NOT NULL,
    name character varying NOT NULL,
    note character varying,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.link_types OWNER TO knowledgebase;

--
-- Name: link_types_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.link_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.link_types_id_seq OWNER TO knowledgebase;

--
-- Name: link_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.link_types_id_seq OWNED BY public.link_types.id;


--
-- Name: links; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.links (
    id integer NOT NULL,
    link_type_id integer NOT NULL,
    link_object_source_id integer NOT NULL,
    link_object_source_value integer NOT NULL,
    link_object_target_id integer NOT NULL,
    link_object_target_value integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.links OWNER TO knowledgebase;

--
-- Name: links_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.links_id_seq OWNER TO knowledgebase;

--
-- Name: links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.links_id_seq OWNED BY public.links.id;


--
-- Name: locales; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.locales OWNER TO knowledgebase;

--
-- Name: locales_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.locales_id_seq OWNER TO knowledgebase;

--
-- Name: locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.locales_id_seq OWNED BY public.locales.id;


--
-- Name: mentions; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.mentions (
    id integer NOT NULL,
    mentionable_type character varying,
    mentionable_id integer,
    user_id integer,
    updated_by_id integer,
    created_by_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.mentions OWNER TO knowledgebase;

--
-- Name: mentions_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.mentions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mentions_id_seq OWNER TO knowledgebase;

--
-- Name: mentions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.mentions_id_seq OWNED BY public.mentions.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    permission_id character varying NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.permissions OWNER TO knowledgebase;

--
-- Name: permissions_groups; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.permissions_groups (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.permissions_groups OWNER TO knowledgebase;

--
-- Name: permissions_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.permissions_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permissions_groups_id_seq OWNER TO knowledgebase;

--
-- Name: permissions_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.permissions_groups_id_seq OWNED BY public.permissions_groups.id;


--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permissions_id_seq OWNER TO knowledgebase;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


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
-- Name: tag_items; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.tag_items (
    id integer NOT NULL,
    name character varying NOT NULL,
    name_downcase character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.tag_items OWNER TO knowledgebase;

--
-- Name: tag_items_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.tag_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_items_id_seq OWNER TO knowledgebase;

--
-- Name: tag_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.tag_items_id_seq OWNED BY public.tag_items.id;


--
-- Name: tag_objects; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.tag_objects (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.tag_objects OWNER TO knowledgebase;

--
-- Name: tag_objects_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.tag_objects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_objects_id_seq OWNER TO knowledgebase;

--
-- Name: tag_objects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.tag_objects_id_seq OWNED BY public.tag_objects.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    tag_item_id integer NOT NULL,
    tag_object_id integer NOT NULL,
    o_id integer NOT NULL,
    created_by_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
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
-- Name: ticket_article_flags; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.ticket_article_flags OWNER TO knowledgebase;

--
-- Name: ticket_article_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.ticket_article_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_article_flags_id_seq OWNER TO knowledgebase;

--
-- Name: ticket_article_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.ticket_article_flags_id_seq OWNED BY public.ticket_article_flags.id;


--
-- Name: ticket_article_senders; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.ticket_article_senders OWNER TO knowledgebase;

--
-- Name: ticket_article_senders_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.ticket_article_senders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_article_senders_id_seq OWNER TO knowledgebase;

--
-- Name: ticket_article_senders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.ticket_article_senders_id_seq OWNED BY public.ticket_article_senders.id;


--
-- Name: ticket_article_types; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.ticket_article_types OWNER TO knowledgebase;

--
-- Name: ticket_article_types_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.ticket_article_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_article_types_id_seq OWNER TO knowledgebase;

--
-- Name: ticket_article_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.ticket_article_types_id_seq OWNED BY public.ticket_article_types.id;


--
-- Name: ticket_articles; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.ticket_articles OWNER TO knowledgebase;

--
-- Name: ticket_articles_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.ticket_articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_articles_id_seq OWNER TO knowledgebase;

--
-- Name: ticket_articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.ticket_articles_id_seq OWNED BY public.ticket_articles.id;


--
-- Name: ticket_counters; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.ticket_counters (
    id integer NOT NULL,
    content character varying NOT NULL,
    generator character varying NOT NULL
);


ALTER TABLE public.ticket_counters OWNER TO knowledgebase;

--
-- Name: ticket_counters_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.ticket_counters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_counters_id_seq OWNER TO knowledgebase;

--
-- Name: ticket_counters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.ticket_counters_id_seq OWNED BY public.ticket_counters.id;


--
-- Name: ticket_flags; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.ticket_flags OWNER TO knowledgebase;

--
-- Name: ticket_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.ticket_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_flags_id_seq OWNER TO knowledgebase;

--
-- Name: ticket_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.ticket_flags_id_seq OWNED BY public.ticket_flags.id;


--
-- Name: ticket_priorities; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.ticket_priorities OWNER TO knowledgebase;

--
-- Name: ticket_priorities_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.ticket_priorities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_priorities_id_seq OWNER TO knowledgebase;

--
-- Name: ticket_priorities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.ticket_priorities_id_seq OWNED BY public.ticket_priorities.id;


--
-- Name: ticket_state_types; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.ticket_state_types OWNER TO knowledgebase;

--
-- Name: ticket_state_types_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.ticket_state_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_state_types_id_seq OWNER TO knowledgebase;

--
-- Name: ticket_state_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.ticket_state_types_id_seq OWNED BY public.ticket_state_types.id;


--
-- Name: ticket_states; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.ticket_states OWNER TO knowledgebase;

--
-- Name: ticket_states_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.ticket_states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_states_id_seq OWNER TO knowledgebase;

--
-- Name: ticket_states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.ticket_states_id_seq OWNED BY public.ticket_states.id;


--
-- Name: ticket_time_accountings; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.ticket_time_accountings OWNER TO knowledgebase;

--
-- Name: ticket_time_accountings_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.ticket_time_accountings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_time_accountings_id_seq OWNER TO knowledgebase;

--
-- Name: ticket_time_accountings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.ticket_time_accountings_id_seq OWNED BY public.ticket_time_accountings.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: knowledgebase
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


ALTER TABLE public.tickets OWNER TO knowledgebase;

--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tickets_id_seq OWNER TO knowledgebase;

--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.users (
    id integer NOT NULL,
    identity_id character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.users OWNER TO knowledgebase;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO knowledgebase;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: calendars id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.calendars ALTER COLUMN id SET DEFAULT nextval('public.calendars_id_seq'::regclass);


--
-- Name: delayed_jobs id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.delayed_jobs ALTER COLUMN id SET DEFAULT nextval('public.delayed_jobs_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: knowledge_base_answer_translation_contents id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_answer_translation_contents ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_answer_translation_contents_id_seq'::regclass);


--
-- Name: knowledge_base_article_delayed_jobs id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_article_delayed_jobs ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_article_delayed_jobs_id_seq'::regclass);


--
-- Name: knowledge_base_article_translations id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_article_translations ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_answer_translations_id_seq'::regclass);


--
-- Name: knowledge_base_articles id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_articles ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_answers_id_seq'::regclass);


--
-- Name: knowledge_base_categories id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_categories ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_categories_id_seq'::regclass);


--
-- Name: knowledge_base_category_delayed_jobs id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_category_delayed_jobs ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_category_delayed_jobs_id_seq'::regclass);


--
-- Name: knowledge_base_category_translations id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_category_translations ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_category_translations_id_seq'::regclass);


--
-- Name: knowledge_base_locales id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_locales ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_locales_id_seq'::regclass);


--
-- Name: knowledge_base_menu_items id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_menu_items ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_menu_items_id_seq'::regclass);


--
-- Name: knowledge_base_translations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_translations ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_translations_id_seq'::regclass);


--
-- Name: knowledge_bases id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_bases ALTER COLUMN id SET DEFAULT nextval('public.knowledge_bases_id_seq'::regclass);


--
-- Name: link_objects id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.link_objects ALTER COLUMN id SET DEFAULT nextval('public.link_objects_id_seq'::regclass);


--
-- Name: link_types id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.link_types ALTER COLUMN id SET DEFAULT nextval('public.link_types_id_seq'::regclass);


--
-- Name: links id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.links ALTER COLUMN id SET DEFAULT nextval('public.links_id_seq'::regclass);


--
-- Name: locales id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.locales ALTER COLUMN id SET DEFAULT nextval('public.locales_id_seq'::regclass);


--
-- Name: mentions id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.mentions ALTER COLUMN id SET DEFAULT nextval('public.mentions_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: permissions_groups id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.permissions_groups ALTER COLUMN id SET DEFAULT nextval('public.permissions_groups_id_seq'::regclass);


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
-- Name: tag_items id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.tag_items ALTER COLUMN id SET DEFAULT nextval('public.tag_items_id_seq'::regclass);


--
-- Name: tag_objects id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.tag_objects ALTER COLUMN id SET DEFAULT nextval('public.tag_objects_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: ticket_article_flags id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_article_flags ALTER COLUMN id SET DEFAULT nextval('public.ticket_article_flags_id_seq'::regclass);


--
-- Name: ticket_article_senders id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_article_senders ALTER COLUMN id SET DEFAULT nextval('public.ticket_article_senders_id_seq'::regclass);


--
-- Name: ticket_article_types id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_article_types ALTER COLUMN id SET DEFAULT nextval('public.ticket_article_types_id_seq'::regclass);


--
-- Name: ticket_articles id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_articles ALTER COLUMN id SET DEFAULT nextval('public.ticket_articles_id_seq'::regclass);


--
-- Name: ticket_counters id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_counters ALTER COLUMN id SET DEFAULT nextval('public.ticket_counters_id_seq'::regclass);


--
-- Name: ticket_flags id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_flags ALTER COLUMN id SET DEFAULT nextval('public.ticket_flags_id_seq'::regclass);


--
-- Name: ticket_priorities id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_priorities ALTER COLUMN id SET DEFAULT nextval('public.ticket_priorities_id_seq'::regclass);


--
-- Name: ticket_state_types id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_state_types ALTER COLUMN id SET DEFAULT nextval('public.ticket_state_types_id_seq'::regclass);


--
-- Name: ticket_states id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_states ALTER COLUMN id SET DEFAULT nextval('public.ticket_states_id_seq'::regclass);


--
-- Name: ticket_time_accountings id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_time_accountings ALTER COLUMN id SET DEFAULT nextval('public.ticket_time_accountings_id_seq'::regclass);


--
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: calendars; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.calendars (id, name, timezone, business_hours, default_, ical_url, public_holidays, last_log, last_sync, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: delayed_jobs; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.delayed_jobs (id, priority, attempts, handler, last_error, run_at, locked_at, failed_at, locked_by, queue, created_at, updated_at) FROM stdin;
1	5	0	article-scheduler	never	1995-08-01 00:00:00	\N	\N	Phillis	queue1	2022-02-15 15:35:53.45053	2022-02-15 15:35:53.45053
2	5	0	category-scheduler		2022-02-15 15:38:58	\N	\N		queue2	2022-02-15 15:38:58.108591	2022-02-15 15:38:58.108591
4	1	0	default		2022-02-16 11:10:57	\N	\N			2022-02-16 11:10:57.155983	2022-02-16 11:10:57.155983
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.groups (id, name, active, note, created_at, updated_at, type) FROM stdin;
3	Decorator	t	\N	2022-03-07 15:50:48.442025	2022-03-07 15:50:48.442025	job
4	Builder	t	\N	2022-03-07 15:50:48.442025	2022-03-07 15:50:48.442025	job
5	Plumber	t	\N	2022-03-07 15:50:48.442025	2022-03-07 15:50:48.442025	job
6	Electrician	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
7	Carpenter	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
8	Roofer	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
9	Auto Body Repairer	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
10	Mechanic	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
11	Law Practitioner	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
12	Photographer	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
13	Chef	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
14	Hair Stylist	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
15	Personal Stylist	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
16	Beautician	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
17	Massage Therapist	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
18	Home Stylist	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
19	Mover	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
20	Pest Controller	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
21	Locksmith	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
22	Cleaner	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
23	Gardener / Landscape Gardener	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
24	Barber	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
25	Accountant	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
26	Therapist	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
27	Tailor	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
28	Welder	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
29	Artist	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
30	Writer	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
31	Handyman	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
32	Translator	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
33	Pet Specialist	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
34	Musicians and Bands	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
35	Magician	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
36	Lookalike	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
37	Celebrity	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
38	Blacksmith / Metal Worker	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
39	Errand Runner	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
40	Fashion and Textile Designer	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
41	Plane and Pilot	t	\N	2022-03-07 15:59:35.322172	2022-03-07 15:59:35.322172	job
42	anthony.rex	t		2022-03-08 12:08:09.810174	2022-03-08 12:08:09.810174	usr
43	anthony.rex	t		2022-03-08 12:26:46.196301	2022-03-08 12:26:46.196301	usr
44	test	t		2022-03-10 15:23:38.62381	2022-03-10 15:23:38.62381	usr
45	leslie.makelpine	t		2022-03-10 16:36:40.624349	2022-03-10 16:36:40.624349	usr
\.


--
-- Data for Name: groups_users; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.groups_users (user_id, group_id, access) FROM stdin;
300	3	
1	42	
3	43	
3	34	
4	45	
4	13	
\.


--
-- Data for Name: knowledge_base_answer_translation_contents; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.knowledge_base_answer_translation_contents (id, body) FROM stdin;
\.


--
-- Data for Name: knowledge_base_article_delayed_jobs; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.knowledge_base_article_delayed_jobs (id, knowledge_base_id, knowledge_base_article_id, knowledge_base_article_translation_id, run_at, created_at, publish_update_delete) FROM stdin;
2	71	25	28	2022-02-26 00:00:00	2022-03-17 16:36:30.52349	update
4	71	25	28	2022-02-26 00:00:00	2022-03-18 15:08:11.734273	update
\.


--
-- Data for Name: knowledge_base_article_translations; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.knowledge_base_article_translations (id, title, kb_locale_id, created_at, updated_at, body, keywords, title_tag, meta_description, article_id, active, publish_now, update_metadata, is_delete_scheduled, is_update_scheduled) FROM stdin;
1	English (United Kingdom)	-1	2022-02-14 16:43:09.023087	2022-02-14 16:43:09.023087	\N	\N	\N	\N	\N	t	t	\N	f	f
2	English (Asia)	-1	2022-02-14 16:43:34.024913	2022-02-14 16:43:34.024913	\N	\N	\N	\N	\N	t	t	\N	f	f
4	This an article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the article	keywords	title tag	an article	3	t	t	\N	f	f
6	This a new article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the article	keywords	title tag	an article	5	t	t	\N	f	f
7	Article 001	2	2022-03-01 15:06:59	2022-03-01 15:06:59	<p>BODYBODYBODYBODY</p>	Keywords	Title Tag	Meta	6	t	t	\N	f	f
8	Article 001 (Dansk)	4	2022-03-01 15:11:03	2022-03-01 15:11:03	<p>Article 001 (Dansk)</p>	KK	TT	MD	7	t	t	\N	f	f
9	Article 002 (DENSK)	4	2022-03-01 15:29:52	2022-03-01 15:29:52	<p>BODY\t</p>	KEYWORDS	TITLE TAH	META DESC	8	\N	t	\N	f	f
10	This a new article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the article	keywords	title tag	an article	9	\N	t	\N	f	f
11	Article 003 (Dansk)	4	2022-03-01 15:47:02	2022-03-01 15:47:02	<p>Article 003 (Dansk) DESC\t</p>	Keywords	Title Tag	Meta Description	10	\N	t	\N	f	f
12	Article 001 (Densk)	4	2022-03-01 16:11:59	2022-03-01 16:11:59	<p>Article 001 (Densk)</p>	KEYWORDS	TT	META DESC	11	\N	t	\N	f	f
5	Modified article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the new body of the article	keywords	title tag	an article	-1	\N	t	\N	f	f
13	New modified article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the new body of the article	keywords	title tag	an article	4	\N	t	\N	f	f
14	My article title	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my article	keywords	title tag	an article	13	\N	t	\N	f	f
15	Mongrove Savanna	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the body of the my article	keywords	title tag	an article	14	\N	t	\N	f	f
17	Modified Mongroove	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the new body of the article	keywords	title tag	an article	16	t	t	\N	f	f
20	Article 001 English (United States)	1	2022-03-01 17:22:27	2022-03-01 17:22:27	<p>Article 001 English (United States)</p>	Keywords	Title tag	Meta Description	18	t	t	\N	f	f
21	Article 001 (English (Great Britain))	8	2022-03-01 17:25:09	2022-03-01 17:25:09	<p>Article 001 English (Great Britain)</p>	Keywords	Title tag	Meta Description	18	t	t	\N	f	f
22	Service Article 001	8	2022-03-10 13:37:14	2022-03-10 13:37:14	<p><strong>Content</strong></p><p><span class="ql-cursor">﻿</span>Service Article 001</p>	K	TT	MD	19	t	t	\N	f	f
23	p-SERVICES Article 01	8	2022-03-10 14:08:58	2022-03-10 14:08:58	<p>p-SERVICES Article 01</p>	p-SERVICES Article 01	p-SERVICES Article 01	p-SERVICES Article 01	20	t	t	\N	f	f
25	Decorator Article 02	1	2022-03-17 14:10:57	2022-03-17 14:10:57	<p>Decorator Article 02</p>	Decorator Article 02	Decorator Article 02	Decorator Article 02	22	t	t	\N	f	f
26	Decorator Article 03	1	2022-03-17 14:11:38	2022-03-17 14:11:38	<p>Decorator Article 03</p>				23	t	t	\N	f	f
27	Decorator Article 04	1	2022-03-17 14:12:28	2022-03-17 14:12:28	<p>Decorator Article 04</p>				24	t	t	\N	f	f
28	Some test article	1	2022-02-26 00:00:00	2022-02-26 00:00:00	This is the new body of the article	keywords	title tag	an article	25	t	t	{"knowledge_base_id":71,"category_id":806,"position":10,"updated_at":"2022-02-26","created_at":"2022-02-26","article_id":25,"title":"new test article","kb_locale_id":1,"body":"This is the new body of the article","keywords":"keywords","title_tag":"title tag","meta_description":"an article","active":true,"publish_now":true,"schedule_at":null}	f	t
29	Article 001	21	2022-03-22 17:28:47	2022-03-22 17:28:47	<p>Content</p>	Keywords	Title tag	Meta	26	t	t		f	f
30	m,njb	2	2022-03-22 17:31:28	2022-03-22 17:31:28	<p>lkjhvgbjnkm</p>				27	f	t	\N	f	f
24	Decorator Cat Article 01	1	2022-03-22 18:28:39	2022-03-22 18:28:39	<p>Decorator Cat Article lkjk;lkjklkjlkl</p>	Decorator Cat Article	Decorator Cat Article	Decorator Cat Article	21	t	t	\N	f	f
31	jhjk	7	2022-03-22 18:50:45	2022-03-22 18:50:45	<p>lkjnhbnjkjhnjkjnhbnjk ikjhbnjkjnhbnjkkjnhbnj lkjnhnjkkjnhbnjkkjhjnhbnjmkmjnh</p>		kjhjkjhjk		28	t	t	\N	f	f
32	,kjnhjmk,lkj	7	2022-03-22 18:51:07	2022-03-22 18:51:07	<p>l,kmjnhbnjmk,lkmijnhujimk,mjinmk</p>				29	f	t	\N	f	f
\.


--
-- Data for Name: knowledge_base_articles; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.knowledge_base_articles (id, category_id, "position", updated_at, created_at, knowledge_base_id) FROM stdin;
6	0	-1	2022-03-01 15:06:59	2022-03-01 15:06:59	32
7	0	-1	2022-03-01 15:11:03	2022-03-01 15:11:03	32
8	0	-1	2022-03-01 15:29:52	2022-03-01 15:29:52	32
9	200	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32
10	0	-1	2022-03-01 15:47:02	2022-03-01 15:47:02	32
11	44	-1	2022-03-01 16:11:59	2022-03-01 16:11:59	32
26	851	-1	2022-03-22 17:28:47	2022-03-22 17:28:47	73
4	36	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32
12	200	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32
13	200	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32
14	200	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32
15	44	-1	2022-03-01 16:46:40	2022-03-01 16:46:40	32
16	200	1	2022-02-26 00:00:00	2022-02-26 00:00:00	32
17	44	-1	2022-03-01 16:53:03	2022-03-01 16:53:03	32
18	47	-1	2022-03-01 17:25:09	2022-03-01 17:25:09	37
19	778	-1	2022-03-10 13:37:14	2022-03-10 13:37:14	38
20	782	-1	2022-03-10 14:08:58	2022-03-10 14:08:58	38
1	1	1	\N	2022-02-14 16:02:32.361821	\N
3	46	2	2022-02-26 00:00:00	2022-02-26 00:00:00	32
5	46	3	2022-02-26 00:00:00	2022-02-26 00:00:00	32
27	819	-1	2022-03-22 17:31:28	2022-03-22 17:31:28	72
21	210	-1	2022-03-22 18:28:39	2022-03-22 18:28:39	39
29	855	1	2022-03-22 18:51:07	2022-03-22 18:51:07	74
28	855	2	2022-03-22 18:50:45	2022-03-22 18:50:45	74
25	806	10	2022-02-26 00:00:00	2022-02-26 00:00:00	71
24	210	1	2022-03-17 14:12:28	2022-03-17 14:12:28	39
23	210	2	2022-03-17 14:11:38	2022-03-17 14:11:38	39
22	210	3	2022-03-17 14:10:57	2022-03-17 14:10:57	39
\.


--
-- Data for Name: knowledge_base_categories; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.knowledge_base_categories (id, knowledge_base_id, parent_id, "position", created_at, updated_at) FROM stdin;
3	1	1	2	2022-02-15 00:00:00	2022-02-15 00:00:00
4	1	1	2	2022-02-15 00:00:00	2022-02-15 00:00:00
5	1	1	2	2022-02-21 00:00:00	2022-02-21 00:00:00
6	21	-1	-1	2022-02-21 16:18:48	2022-02-21 16:18:48
7	21	-1	-1	2022-02-21 16:19:48	2022-02-21 16:19:48
8	1	7	2	2022-02-21 00:00:00	2022-02-21 00:00:00
9	1	7	2	2022-02-21 00:00:00	2022-02-21 00:00:00
1	1	2	3	2022-02-21 17:51:44	2022-02-21 17:51:44
11	1	7	2	2022-02-21 00:00:00	2022-02-21 00:00:00
12	1	2	3	2022-02-21 18:21:10	2022-02-21 18:21:10
10	21	6	-1	2022-02-21 19:02:21	2022-02-21 19:02:21
29	29	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
41	32	-1	-1	2022-02-25 16:22:02	2022-02-25 16:22:02
42	32	-1	-1	2022-02-25 16:26:10	2022-02-25 16:26:10
13	1	3	3	2022-02-22 11:55:31	2022-02-22 11:55:31
17	20	-1	-1	2022-02-22 15:28:37	2022-02-22 15:28:37
44	32	-1	-1	2022-02-26 11:48:50	2022-02-26 11:48:50
18	23	-1	-1	2022-02-22 18:03:57	2022-02-22 18:03:57
19	26	7	2	2022-02-21 00:00:00	2022-02-21 00:00:00
20	27	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
21	30	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
22	30	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
23	30	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
24	30	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
25	29	-1	-1	2022-02-24 15:27:54	2022-02-24 15:27:54
26	31	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
27	31	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
28	31	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
30	32	-1	-1	2022-02-25 13:36:56	2022-02-25 13:36:56
31	29	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
46	32	37	-1	2022-02-26 12:26:29	2022-02-26 12:26:29
45	35	-1	1	2022-02-23 00:00:00	2022-02-23 00:00:00
43	37	-1	-1	2022-03-01 17:20:15	2022-03-01 17:20:15
47	37	-1	-1	2022-03-01 17:21:37	2022-03-01 17:21:37
48	39	-1	7	2022-02-02 22:07:34	2022-02-08 11:59:57
49	39	-1	12	2022-02-02 22:13:40	2022-02-08 12:00:02
50	39	-1	14	2022-02-02 22:21:39	2022-02-08 12:00:07
51	39	-1	15	2022-02-02 22:21:53	2022-02-08 12:00:09
52	39	-1	16	2022-02-02 22:23:33	2022-02-08 12:00:12
53	39	-1	17	2022-02-02 22:24:52	2022-02-08 12:00:15
54	39	-1	18	2022-02-02 22:25:14	2022-02-08 12:00:19
55	39	-1	19	2022-02-02 22:27:37	2022-02-08 12:00:16
56	39	-1	20	2022-02-02 22:27:53	2022-02-08 12:00:18
57	39	-1	21	2022-02-02 22:30:32	2022-02-08 12:00:23
58	39	-1	22	2022-02-02 22:30:56	2022-02-08 12:00:24
59	39	-1	24	2022-02-02 22:38:29	2022-02-08 12:00:24
60	39	-1	25	2022-02-02 22:38:50	2022-02-08 12:00:25
61	39	-1	26	2022-02-02 22:39:24	2022-02-08 12:00:25
62	39	-1	27	2022-02-02 22:39:40	2022-02-08 12:00:28
63	39	-1	28	2022-02-02 22:41:12	2022-02-08 12:00:29
64	39	-1	29	2022-02-02 22:42:40	2022-02-08 12:00:30
65	39	-1	30	2022-02-02 22:49:04	2022-02-08 12:00:32
66	39	-1	31	2022-02-02 22:50:45	2022-02-08 12:00:32
67	39	-1	32	2022-02-02 22:51:21	2022-02-08 12:00:32
68	39	-1	33	2022-02-02 22:51:33	2022-02-08 12:00:33
69	39	-1	34	2022-02-02 22:52:54	2022-02-08 12:00:34
70	39	-1	35	2022-02-02 22:55:55	2022-02-08 12:00:34
71	39	-1	36	2022-02-02 23:00:36	2022-02-08 12:00:35
72	39	-1	37	2022-02-02 23:04:13	2022-02-08 12:00:36
73	39	-1	38	2022-02-02 23:04:44	2022-02-08 12:00:37
74	39	-1	39	2022-02-02 23:09:13	2022-02-08 12:00:37
75	39	-1	40	2022-02-02 23:22:42	2022-02-08 12:00:07
76	39	-1	42	2022-02-02 23:24:35	2022-02-08 12:00:08
77	39	-1	43	2022-02-02 23:28:54	2022-02-08 12:00:07
78	39	-1	44	2022-02-02 23:29:29	2022-02-08 12:00:08
79	39	-1	45	2022-02-02 23:29:45	2022-02-08 12:00:07
80	39	-1	46	2022-02-02 23:30:34	2022-02-08 12:00:07
81	39	-1	49	2022-02-02 23:31:59	2022-02-08 12:00:10
82	39	-1	50	2022-02-02 23:32:17	2022-02-08 12:00:08
83	39	-1	51	2022-02-02 23:32:41	2022-02-08 12:00:08
84	39	-1	52	2022-02-02 23:33:01	2022-02-08 12:00:08
85	39	-1	53	2022-02-02 23:34:31	2022-02-08 12:00:16
86	39	-1	54	2022-02-02 23:34:47	2022-02-08 12:00:15
87	39	-1	55	2022-02-02 23:35:02	2022-02-08 12:00:16
88	39	-1	56	2022-02-02 23:35:17	2022-02-08 12:00:16
89	39	-1	57	2022-02-02 23:35:33	2022-02-08 12:00:15
90	39	-1	58	2022-02-02 23:35:56	2022-02-08 12:00:15
91	39	-1	59	2022-02-02 23:36:10	2022-02-08 12:00:16
92	39	-1	60	2022-02-02 23:36:27	2022-02-08 12:00:16
93	39	-1	61	2022-02-02 23:36:39	2022-02-08 12:00:16
94	39	-1	62	2022-02-02 23:36:53	2022-02-08 12:00:16
95	39	-1	63	2022-02-02 23:37:05	2022-02-08 12:00:16
96	39	-1	64	2022-02-02 23:38:53	2022-02-08 12:00:03
97	39	-1	65	2022-02-02 23:39:09	2022-02-08 12:00:05
98	39	-1	66	2022-02-02 23:39:36	2022-02-08 12:00:03
99	39	-1	67	2022-02-02 23:41:25	2022-02-08 12:00:02
100	39	-1	68	2022-02-02 23:41:40	2022-02-08 12:00:04
101	39	-1	69	2022-02-02 23:41:55	2022-02-08 12:00:03
102	39	-1	70	2022-02-02 23:42:07	2022-02-08 12:00:05
103	39	-1	71	2022-02-02 23:42:22	2022-02-08 12:00:03
104	39	-1	72	2022-02-02 23:42:35	2022-02-08 12:00:05
105	39	-1	73	2022-02-02 23:42:56	2022-02-08 12:00:04
106	39	-1	74	2022-02-02 23:43:20	2022-02-08 12:00:06
107	39	-1	75	2022-02-02 23:43:32	2022-02-08 12:00:06
108	39	-1	76	2022-02-02 23:43:43	2022-02-08 12:00:03
109	39	-1	77	2022-02-02 23:44:01	2022-02-08 12:00:04
110	39	-1	78	2022-02-02 23:44:19	2022-02-08 12:00:05
111	39	-1	79	2022-02-02 23:44:29	2022-02-08 12:00:37
112	39	-1	80	2022-02-02 23:44:31	2022-02-08 12:00:03
113	39	-1	81	2022-02-02 23:44:41	2022-02-08 12:00:05
114	39	-1	82	2022-02-02 23:44:55	2022-02-08 12:00:03
115	39	-1	83	2022-02-02 23:45:12	2022-02-08 12:00:05
116	39	-1	84	2022-02-02 23:45:47	2022-02-08 12:00:04
117	39	-1	85	2022-02-02 23:45:59	2022-02-08 12:00:04
118	39	-1	86	2022-02-02 23:46:21	2022-02-08 12:00:05
119	39	-1	87	2022-02-02 23:46:35	2022-02-08 12:00:03
120	39	-1	88	2022-02-02 23:46:48	2022-02-08 12:00:07
121	39	-1	89	2022-02-02 23:47:32	2022-02-08 12:00:13
122	39	-1	90	2022-02-02 23:47:53	2022-02-08 12:00:12
123	39	-1	91	2022-02-02 23:48:08	2022-02-08 12:00:14
124	39	-1	92	2022-02-02 23:48:21	2022-02-08 12:00:15
125	39	-1	93	2022-02-02 23:48:33	2022-02-08 12:00:13
126	39	-1	94	2022-02-02 23:48:44	2022-02-08 12:00:13
127	39	-1	95	2022-02-02 23:48:54	2022-02-08 12:00:13
128	39	-1	96	2022-02-02 23:49:03	2022-02-08 12:00:14
129	39	-1	97	2022-02-02 23:49:44	2022-02-08 12:00:14
130	39	-1	98	2022-02-02 23:50:23	2022-02-08 12:00:13
131	39	-1	99	2022-02-02 23:50:45	2022-02-08 12:00:14
132	39	-1	100	2022-02-02 23:51:03	2022-02-08 12:00:14
133	39	-1	101	2022-02-02 23:51:44	2022-02-08 12:00:14
134	39	-1	102	2022-02-02 23:52:04	2022-02-08 12:00:13
135	39	-1	103	2022-02-02 23:52:30	2022-02-08 12:00:13
136	39	-1	104	2022-02-02 23:53:01	2022-02-08 12:00:13
137	39	-1	105	2022-02-02 23:53:17	2022-02-08 12:00:15
138	39	-1	106	2022-02-02 23:53:31	2022-02-08 12:00:15
139	39	-1	107	2022-02-02 23:53:43	2022-02-08 12:00:13
140	39	-1	108	2022-02-02 23:54:00	2022-02-08 12:00:15
141	39	-1	109	2022-02-02 23:54:16	2022-02-08 12:00:14
142	39	-1	110	2022-02-02 23:54:41	2022-02-08 12:00:14
143	39	-1	111	2022-02-02 23:54:56	2022-02-08 12:00:15
144	39	-1	112	2022-02-02 23:55:43	2022-02-08 12:00:10
145	39	-1	113	2022-02-02 23:55:53	2022-02-08 12:00:09
146	39	-1	114	2022-02-02 23:56:06	2022-02-08 12:00:12
147	39	-1	115	2022-02-02 23:56:17	2022-02-08 12:00:10
148	39	-1	116	2022-02-02 23:56:29	2022-02-08 12:00:11
149	39	-1	119	2022-02-02 23:57:26	2022-02-08 12:00:12
150	39	-1	120	2022-02-02 23:57:43	2022-02-08 12:00:11
151	39	-1	121	2022-02-02 23:57:57	2022-02-08 12:00:12
152	39	-1	122	2022-02-02 23:58:18	2022-02-08 12:00:11
153	39	-1	123	2022-02-02 23:58:42	2022-02-08 12:00:11
154	39	-1	124	2022-02-02 23:59:36	2022-02-08 12:00:11
155	39	-1	125	2022-02-03 00:00:03	2022-02-08 12:00:12
156	39	-1	127	2022-02-03 00:00:34	2022-02-08 12:00:11
157	39	-1	128	2022-02-03 00:00:47	2022-02-08 12:00:12
158	39	-1	130	2022-02-03 00:01:08	2022-02-08 12:00:11
159	39	-1	132	2022-02-03 00:03:16	2022-02-08 12:00:38
160	39	-1	133	2022-02-03 00:03:52	2022-02-08 11:59:57
161	39	-1	134	2022-02-03 00:04:23	2022-02-08 11:59:59
162	39	-1	135	2022-02-03 00:04:36	2022-02-08 11:59:59
163	39	-1	136	2022-02-03 00:04:47	2022-02-08 11:59:59
164	39	-1	137	2022-02-03 00:04:57	2022-02-08 11:59:59
165	39	-1	138	2022-02-03 00:05:47	2022-02-08 12:00:38
166	39	-1	139	2022-02-03 00:06:02	2022-02-08 12:00:38
167	39	-1	140	2022-02-03 00:06:36	2022-02-08 12:00:39
168	39	-1	141	2022-02-03 00:06:50	2022-02-08 12:00:38
169	39	-1	142	2022-02-03 00:07:10	2022-02-08 12:00:38
170	39	-1	143	2022-02-03 00:07:28	2022-02-08 12:00:38
171	39	-1	144	2022-02-03 00:07:42	2022-02-08 12:00:38
172	39	-1	145	2022-02-03 00:07:54	2022-02-08 12:00:38
173	39	-1	146	2022-02-03 00:08:15	2022-02-08 11:59:59
174	39	-1	147	2022-02-03 00:08:30	2022-02-08 11:59:59
175	39	-1	149	2022-02-03 00:09:45	2022-02-08 12:00:16
176	39	-1	150	2022-02-03 00:10:01	2022-02-08 12:00:17
177	39	-1	152	2022-02-03 00:10:24	2022-02-08 12:00:18
178	39	-1	153	2022-02-03 00:10:41	2022-02-08 12:00:17
179	39	-1	154	2022-02-03 00:11:00	2022-02-08 12:00:17
180	39	-1	155	2022-02-03 00:11:12	2022-02-08 12:00:17
181	39	-1	157	2022-02-03 00:12:10	2022-02-08 12:00:18
182	39	-1	158	2022-02-03 00:12:23	2022-02-08 12:00:17
183	39	-1	159	2022-02-03 00:12:34	2022-02-08 12:00:17
184	39	-1	160	2022-02-03 00:12:45	2022-02-08 12:00:18
185	39	-1	161	2022-02-03 00:12:56	2022-02-08 12:00:17
186	39	-1	162	2022-02-03 00:13:09	2022-02-08 12:00:17
187	39	-1	163	2022-02-03 00:13:21	2022-02-08 12:00:17
188	39	-1	164	2022-02-03 00:13:32	2022-02-08 12:00:18
189	39	-1	171	2022-02-03 11:37:06	2022-02-07 14:50:27
190	39	-1	172	2022-02-03 11:37:52	2022-02-07 14:50:27
191	39	-1	174	2022-02-03 12:14:57	2022-02-07 14:50:27
192	39	-1	175	2022-02-03 12:23:05	2022-02-07 14:50:27
193	39	-1	176	2022-02-03 12:29:18	2022-02-07 14:44:18
194	39	-1	178	2022-02-03 22:00:39	2022-02-08 12:00:39
195	39	-1	179	2022-02-03 22:01:15	2022-02-08 12:00:32
196	39	-1	180	2022-02-03 22:01:39	2022-02-08 12:00:32
197	39	-1	181	2022-02-03 22:02:05	2022-02-08 12:00:33
198	39	-1	182	2022-02-03 22:02:19	2022-02-08 12:00:32
199	39	-1	183	2022-02-03 22:02:34	2022-02-08 12:00:32
200	39	-1	184	2022-02-03 22:02:51	2022-02-08 12:00:33
201	39	-1	185	2022-02-03 22:03:10	2022-02-08 12:00:33
202	39	-1	186	2022-02-03 22:03:27	2022-02-08 12:00:33
203	39	-1	187	2022-02-03 22:04:16	2022-02-08 12:00:33
204	39	-1	188	2022-02-03 22:04:33	2022-02-08 12:00:33
205	39	-1	189	2022-02-03 22:05:49	2022-02-08 12:00:33
206	39	-1	190	2022-02-03 22:06:08	2022-02-08 12:00:33
207	39	-1	191	2022-02-03 22:06:55	2022-02-08 12:00:33
208	39	-1	192	2022-02-03 22:11:40	2022-02-08 12:00:32
209	39	-1	193	2022-02-03 22:11:59	2022-02-08 12:00:32
237	39	210	7	2022-03-04 12:18:08	2022-03-04 12:18:08
299	39	230	104	2022-03-04 12:18:08	2022-03-04 12:18:08
293	39	214	98	2022-03-04 12:18:08	2022-03-04 12:18:08
295	39	214	100	2022-03-04 12:18:08	2022-03-04 12:18:08
296	39	214	101	2022-03-04 12:18:08	2022-03-04 12:18:08
302	39	214	107	2022-03-04 12:18:08	2022-03-04 12:18:08
250	39	215	55	2022-03-04 12:18:08	2022-03-04 12:18:08
257	39	215	62	2022-03-04 12:18:08	2022-03-04 12:18:08
272	39	469	77	2022-03-04 12:18:08	2022-03-04 12:18:08
259	39	212	64	2022-03-04 12:18:08	2022-03-04 12:18:08
260	39	212	65	2022-03-04 12:18:08	2022-03-04 12:18:08
261	39	212	66	2022-03-04 12:18:08	2022-03-04 12:18:08
262	39	212	67	2022-03-04 12:18:08	2022-03-04 12:18:08
263	39	212	68	2022-03-04 12:18:08	2022-03-04 12:18:08
265	39	212	70	2022-03-04 12:18:08	2022-03-04 12:18:08
266	39	212	71	2022-03-04 12:18:08	2022-03-04 12:18:08
267	39	212	72	2022-03-04 12:18:08	2022-03-04 12:18:08
269	39	212	74	2022-03-04 12:18:08	2022-03-04 12:18:08
270	39	212	75	2022-03-04 12:18:08	2022-03-04 12:18:08
275	39	214	80	2022-03-04 12:18:08	2022-03-04 12:18:08
216	39	-1	10	2022-03-04 12:18:08	2022-03-04 12:18:08
241	39	234	44	2022-03-04 12:18:08	2022-03-04 12:18:08
283	39	214	88	2022-03-04 12:18:08	2022-03-04 12:18:08
277	39	212	82	2022-03-04 12:18:08	2022-03-04 12:18:08
276	39	212	81	2022-03-04 12:18:08	2022-03-04 12:18:08
290	39	230	95	2022-03-04 12:18:08	2022-03-04 12:18:08
279	39	212	84	2022-03-04 12:18:08	2022-03-04 12:18:08
280	39	212	85	2022-03-04 12:18:08	2022-03-04 12:18:08
281	39	212	86	2022-03-04 12:18:08	2022-03-04 12:18:08
282	39	212	87	2022-03-04 12:18:08	2022-03-04 12:18:08
284	39	214	89	2022-03-04 12:18:08	2022-03-04 12:18:08
217	39	234	19	2022-03-04 12:18:08	2022-03-04 12:18:08
306	39	214	111	2022-03-04 12:18:08	2022-03-04 12:18:08
287	39	214	92	2022-03-04 12:18:08	2022-03-04 12:18:08
242	39	234	45	2022-03-04 12:18:08	2022-03-04 12:18:08
307	39	213	112	2022-03-04 12:18:08	2022-03-04 12:18:08
244	39	213	49	2022-03-04 12:18:08	2022-03-04 12:18:08
309	39	213	114	2022-03-04 12:18:08	2022-03-04 12:18:08
308	39	213	113	2022-03-04 12:18:08	2022-03-04 12:18:08
318	39	234	125	2022-03-04 12:18:08	2022-03-04 12:18:08
314	39	213	121	2022-03-04 12:18:08	2022-03-04 12:18:08
313	39	213	120	2022-03-04 12:18:08	2022-03-04 12:18:08
315	39	213	122	2022-03-04 12:18:08	2022-03-04 12:18:08
316	39	213	123	2022-03-04 12:18:08	2022-03-04 12:18:08
317	39	213	124	2022-03-04 12:18:08	2022-03-04 12:18:08
288	39	322	93	2022-03-04 12:18:08	2022-03-04 12:18:08
319	39	213	127	2022-03-04 12:18:08	2022-03-04 12:18:08
320	39	213	128	2022-03-04 12:18:08	2022-03-04 12:18:08
286	39	214	91	2022-03-04 12:18:08	2022-03-04 12:18:08
285	39	214	90	2022-03-04 12:18:08	2022-03-04 12:18:08
311	39	322	116	2022-03-04 12:18:08	2022-03-04 12:18:08
289	39	214	94	2022-03-04 12:18:08	2022-03-04 12:18:08
291	39	214	96	2022-03-04 12:18:08	2022-03-04 12:18:08
292	39	214	97	2022-03-04 12:18:08	2022-03-04 12:18:08
294	39	214	99	2022-03-04 12:18:08	2022-03-04 12:18:08
297	39	214	102	2022-03-04 12:18:08	2022-03-04 12:18:08
298	39	214	103	2022-03-04 12:18:08	2022-03-04 12:18:08
303	39	214	108	2022-03-04 12:18:08	2022-03-04 12:18:08
304	39	214	109	2022-03-04 12:18:08	2022-03-04 12:18:08
249	39	234	54	2022-03-04 12:18:08	2022-03-04 12:18:08
251	39	215	56	2022-03-04 12:18:08	2022-03-04 12:18:08
252	39	215	57	2022-03-04 12:18:08	2022-03-04 12:18:08
253	39	215	58	2022-03-04 12:18:08	2022-03-04 12:18:08
254	39	215	59	2022-03-04 12:18:08	2022-03-04 12:18:08
255	39	215	60	2022-03-04 12:18:08	2022-03-04 12:18:08
236	39	216	39	2022-03-04 12:18:08	2022-03-04 12:18:08
273	39	216	78	2022-03-04 12:18:08	2022-03-04 12:18:08
278	39	229	83	2022-03-04 12:18:08	2022-03-04 12:18:08
248	39	234	53	2022-03-04 12:18:08	2022-03-04 12:18:08
312	39	322	119	2022-03-04 12:18:08	2022-03-04 12:18:08
258	39	469	63	2022-03-04 12:18:08	2022-03-04 12:18:08
220	39	-1	11	2022-03-04 12:18:08	2022-03-04 12:18:08
210	39	-1	1	2022-03-04 12:18:08	2022-03-04 12:18:08
212	39	-1	2	2022-03-04 12:18:08	2022-03-04 12:18:08
213	39	-1	3	2022-03-04 12:18:08	2022-03-04 12:18:08
214	39	-1	4	2022-03-04 12:18:08	2022-03-04 12:18:08
215	39	-1	5	2022-03-04 12:18:08	2022-03-04 12:18:08
218	39	-1	6	2022-03-04 12:18:08	2022-03-04 12:18:08
219	39	-1	7	2022-03-04 12:18:08	2022-03-04 12:18:08
221	39	-1	12	2022-03-04 12:18:08	2022-03-04 12:18:08
222	39	-1	13	2022-03-04 12:18:08	2022-03-04 12:18:08
224	39	-1	15	2022-03-04 12:18:08	2022-03-04 12:18:08
225	39	-1	16	2022-03-04 12:18:08	2022-03-04 12:18:08
226	39	-1	17	2022-03-04 12:18:08	2022-03-04 12:18:08
227	39	-1	18	2022-03-04 12:18:08	2022-03-04 12:18:08
228	39	-1	19	2022-03-04 12:18:08	2022-03-04 12:18:08
229	39	-1	20	2022-03-04 12:18:08	2022-03-04 12:18:08
230	39	-1	21	2022-03-04 12:18:08	2022-03-04 12:18:08
231	39	-1	22	2022-03-04 12:18:08	2022-03-04 12:18:08
232	39	-1	23	2022-03-04 12:18:08	2022-03-04 12:18:08
233	39	-1	24	2022-03-04 12:18:08	2022-03-04 12:18:08
234	39	-1	25	2022-03-04 12:18:08	2022-03-04 12:18:08
235	39	-1	26	2022-03-04 12:18:08	2022-03-04 12:18:08
239	39	-1	27	2022-03-04 12:18:08	2022-03-04 12:18:08
240	39	-1	28	2022-03-04 12:18:08	2022-03-04 12:18:08
243	39	-1	29	2022-03-04 12:18:08	2022-03-04 12:18:08
245	39	-1	30	2022-03-04 12:18:08	2022-03-04 12:18:08
274	39	-1	32	2022-03-04 12:18:08	2022-03-04 12:18:08
300	39	-1	33	2022-03-04 12:18:08	2022-03-04 12:18:08
301	39	-1	34	2022-03-04 12:18:08	2022-03-04 12:18:08
310	39	-1	35	2022-03-04 12:18:08	2022-03-04 12:18:08
321	39	-1	36	2022-03-04 12:18:08	2022-03-04 12:18:08
322	39	-1	37	2022-03-04 12:18:08	2022-03-04 12:18:08
238	39	-1	55	2022-03-04 12:18:08	2022-03-04 12:18:08
247	39	210	2	2022-03-04 12:18:08	2022-03-04 12:18:08
324	39	210	4	2022-03-04 12:18:08	2022-03-04 12:18:08
363	39	229	184	2022-03-04 12:18:08	2022-03-04 12:18:08
432	39	218	1	2022-03-04 12:18:08	2022-03-04 12:18:08
338	39	217	149	2022-03-04 12:18:08	2022-03-04 12:18:08
327	39	210	6	2022-03-04 12:18:08	2022-03-04 12:18:08
325	39	212	135	2022-03-04 12:18:08	2022-03-04 12:18:08
369	39	229	190	2022-03-04 12:18:08	2022-03-04 12:18:08
339	39	234	150	2022-03-04 12:18:08	2022-03-04 12:18:08
334	39	322	144	2022-03-04 12:18:08	2022-03-04 12:18:08
336	39	214	146	2022-03-04 12:18:08	2022-03-04 12:18:08
343	39	234	155	2022-03-04 12:18:08	2022-03-04 12:18:08
345	39	234	158	2022-03-04 12:18:08	2022-03-04 12:18:08
341	39	217	153	2022-03-04 12:18:08	2022-03-04 12:18:08
342	39	217	154	2022-03-04 12:18:08	2022-03-04 12:18:08
344	39	217	157	2022-03-04 12:18:08	2022-03-04 12:18:08
350	39	234	163	2022-03-04 12:18:08	2022-03-04 12:18:08
346	39	217	159	2022-03-04 12:18:08	2022-03-04 12:18:08
347	39	217	160	2022-03-04 12:18:08	2022-03-04 12:18:08
349	39	217	162	2022-03-04 12:18:08	2022-03-04 12:18:08
351	39	234	164	2022-03-04 12:18:08	2022-03-04 12:18:08
374	39	234	195	2022-03-04 12:18:08	2022-03-04 12:18:08
439	39	218	5	2022-03-04 12:18:08	2022-03-04 12:18:08
437	39	218	4	2022-03-04 12:18:08	2022-03-04 12:18:08
440	39	218	6	2022-03-04 12:18:08	2022-03-04 12:18:08
441	39	218	7	2022-03-04 12:18:08	2022-03-04 12:18:08
435	39	218	10	2022-03-04 12:18:08	2022-03-04 12:18:08
438	39	218	8	2022-03-04 12:18:08	2022-03-04 12:18:08
436	39	218	9	2022-03-04 12:18:08	2022-03-04 12:18:08
434	39	218	2	2022-03-04 12:18:08	2022-03-04 12:18:08
433	39	218	3	2022-03-04 12:18:08	2022-03-04 12:18:08
354	39	216	174	2022-03-04 12:18:08	2022-03-04 12:18:08
390	39	216	211	2022-03-04 12:18:08	2022-03-04 12:18:08
391	39	216	213	2022-03-04 12:18:08	2022-03-04 12:18:08
393	39	216	215	2022-03-04 12:18:08	2022-03-04 12:18:08
394	39	216	216	2022-03-04 12:18:08	2022-03-04 12:18:08
395	39	216	217	2022-03-04 12:18:08	2022-03-04 12:18:08
396	39	216	218	2022-03-04 12:18:08	2022-03-04 12:18:08
397	39	216	219	2022-03-04 12:18:08	2022-03-04 12:18:08
398	39	216	220	2022-03-04 12:18:08	2022-03-04 12:18:08
399	39	216	221	2022-03-04 12:18:08	2022-03-04 12:18:08
400	39	216	222	2022-03-04 12:18:08	2022-03-04 12:18:08
419	39	219	241	2022-03-04 12:18:08	2022-03-04 12:18:08
402	39	216	224	2022-03-04 12:18:08	2022-03-04 12:18:08
403	39	216	225	2022-03-04 12:18:08	2022-03-04 12:18:08
404	39	216	226	2022-03-04 12:18:08	2022-03-04 12:18:08
405	39	216	227	2022-03-04 12:18:08	2022-03-04 12:18:08
406	39	216	228	2022-03-04 12:18:08	2022-03-04 12:18:08
407	39	216	229	2022-03-04 12:18:08	2022-03-04 12:18:08
408	39	216	230	2022-03-04 12:18:08	2022-03-04 12:18:08
410	39	216	232	2022-03-04 12:18:08	2022-03-04 12:18:08
411	39	216	233	2022-03-04 12:18:08	2022-03-04 12:18:08
412	39	216	234	2022-03-04 12:18:08	2022-03-04 12:18:08
413	39	216	235	2022-03-04 12:18:08	2022-03-04 12:18:08
414	39	216	236	2022-03-04 12:18:08	2022-03-04 12:18:08
415	39	216	237	2022-03-04 12:18:08	2022-03-04 12:18:08
416	39	216	238	2022-03-04 12:18:08	2022-03-04 12:18:08
417	39	216	239	2022-03-04 12:18:08	2022-03-04 12:18:08
418	39	216	240	2022-03-04 12:18:08	2022-03-04 12:18:08
424	39	219	246	2022-03-04 12:18:08	2022-03-04 12:18:08
328	39	322	138	2022-03-04 12:18:08	2022-03-04 12:18:08
421	39	216	243	2022-03-04 12:18:08	2022-03-04 12:18:08
427	39	219	249	2022-03-04 12:18:08	2022-03-04 12:18:08
423	39	216	245	2022-03-04 12:18:08	2022-03-04 12:18:08
401	39	219	223	2022-03-04 12:18:08	2022-03-04 12:18:08
425	39	219	247	2022-03-04 12:18:08	2022-03-04 12:18:08
428	39	219	250	2022-03-04 12:18:08	2022-03-04 12:18:08
429	39	219	251	2022-03-04 12:18:08	2022-03-04 12:18:08
430	39	219	252	2022-03-04 12:18:08	2022-03-04 12:18:08
431	39	219	253	2022-03-04 12:18:08	2022-03-04 12:18:08
371	39	227	192	2022-03-04 12:18:08	2022-03-04 12:18:08
372	39	227	193	2022-03-04 12:18:08	2022-03-04 12:18:08
358	39	229	179	2022-03-04 12:18:08	2022-03-04 12:18:08
360	39	229	181	2022-03-04 12:18:08	2022-03-04 12:18:08
359	39	229	180	2022-03-04 12:18:08	2022-03-04 12:18:08
364	39	229	185	2022-03-04 12:18:08	2022-03-04 12:18:08
365	39	229	186	2022-03-04 12:18:08	2022-03-04 12:18:08
366	39	229	187	2022-03-04 12:18:08	2022-03-04 12:18:08
367	39	229	188	2022-03-04 12:18:08	2022-03-04 12:18:08
368	39	229	189	2022-03-04 12:18:08	2022-03-04 12:18:08
370	39	229	191	2022-03-04 12:18:08	2022-03-04 12:18:08
331	39	322	141	2022-03-04 12:18:08	2022-03-04 12:18:08
340	39	234	152	2022-03-04 12:18:08	2022-03-04 12:18:08
375	39	234	196	2022-03-04 12:18:08	2022-03-04 12:18:08
376	39	234	197	2022-03-04 12:18:08	2022-03-04 12:18:08
377	39	234	198	2022-03-04 12:18:08	2022-03-04 12:18:08
378	39	234	199	2022-03-04 12:18:08	2022-03-04 12:18:08
379	39	234	200	2022-03-04 12:18:08	2022-03-04 12:18:08
380	39	234	201	2022-03-04 12:18:08	2022-03-04 12:18:08
381	39	234	202	2022-03-04 12:18:08	2022-03-04 12:18:08
382	39	234	203	2022-03-04 12:18:08	2022-03-04 12:18:08
383	39	234	204	2022-03-04 12:18:08	2022-03-04 12:18:08
384	39	234	205	2022-03-04 12:18:08	2022-03-04 12:18:08
385	39	234	206	2022-03-04 12:18:08	2022-03-04 12:18:08
386	39	234	207	2022-03-04 12:18:08	2022-03-04 12:18:08
387	39	234	208	2022-03-04 12:18:08	2022-03-04 12:18:08
388	39	234	209	2022-03-04 12:18:08	2022-03-04 12:18:08
389	39	234	210	2022-03-04 12:18:08	2022-03-04 12:18:08
329	39	322	139	2022-03-04 12:18:08	2022-03-04 12:18:08
330	39	322	140	2022-03-04 12:18:08	2022-03-04 12:18:08
332	39	322	142	2022-03-04 12:18:08	2022-03-04 12:18:08
335	39	322	145	2022-03-04 12:18:08	2022-03-04 12:18:08
352	39	-1	38	2022-03-04 12:18:08	2022-03-04 12:18:08
353	39	-1	39	2022-03-04 12:18:08	2022-03-04 12:18:08
355	39	-1	40	2022-03-04 12:18:08	2022-03-04 12:18:08
356	39	-1	41	2022-03-04 12:18:08	2022-03-04 12:18:08
357	39	-1	42	2022-03-04 12:18:08	2022-03-04 12:18:08
361	39	-1	43	2022-03-04 12:18:08	2022-03-04 12:18:08
362	39	-1	44	2022-03-04 12:18:08	2022-03-04 12:18:08
373	39	-1	45	2022-03-04 12:18:08	2022-03-04 12:18:08
422	39	-1	46	2022-03-04 12:18:08	2022-03-04 12:18:08
442	39	-1	47	2022-03-04 12:18:08	2022-03-04 12:18:08
337	39	210	1	2022-03-04 12:18:08	2022-03-04 12:18:08
562	39	214	394	2022-03-04 12:18:08	2022-03-04 12:18:08
538	39	210	13	2022-03-04 12:18:08	2022-03-04 12:18:08
539	39	210	14	2022-03-04 12:18:08	2022-03-04 12:18:08
545	39	234	375	2022-03-04 12:18:08	2022-03-04 12:18:08
540	39	210	15	2022-03-04 12:18:08	2022-03-04 12:18:08
541	39	210	16	2022-03-04 12:18:08	2022-03-04 12:18:08
555	39	210	17	2022-03-04 12:18:08	2022-03-04 12:18:08
559	39	210	18	2022-03-04 12:18:08	2022-03-04 12:18:08
561	39	210	19	2022-03-04 12:18:08	2022-03-04 12:18:08
532	39	210	8	2022-03-04 12:18:08	2022-03-04 12:18:08
535	39	210	10	2022-03-04 12:18:08	2022-03-04 12:18:08
443	39	-1	48	2022-03-04 12:18:08	2022-03-04 12:18:08
536	39	210	11	2022-03-04 12:18:08	2022-03-04 12:18:08
453	39	230	276	2022-03-04 12:18:08	2022-03-04 12:18:08
458	39	230	281	2022-03-04 12:18:08	2022-03-04 12:18:08
473	39	469	296	2022-03-04 12:18:08	2022-03-04 12:18:08
478	39	212	301	2022-03-04 12:18:08	2022-03-04 12:18:08
528	39	231	356	2022-03-04 12:18:08	2022-03-04 12:18:08
482	39	212	307	2022-03-04 12:18:08	2022-03-04 12:18:08
481	39	212	306	2022-03-04 12:18:08	2022-03-04 12:18:08
486	39	213	311	2022-03-04 12:18:08	2022-03-04 12:18:08
483	39	212	308	2022-03-04 12:18:08	2022-03-04 12:18:08
484	39	213	309	2022-03-04 12:18:08	2022-03-04 12:18:08
487	39	213	313	2022-03-04 12:18:08	2022-03-04 12:18:08
488	39	213	314	2022-03-04 12:18:08	2022-03-04 12:18:08
489	39	213	315	2022-03-04 12:18:08	2022-03-04 12:18:08
554	39	213	385	2022-03-04 12:18:08	2022-03-04 12:18:08
560	39	213	392	2022-03-04 12:18:08	2022-03-04 12:18:08
457	39	230	280	2022-03-04 12:18:08	2022-03-04 12:18:08
477	39	469	300	2022-03-04 12:18:08	2022-03-04 12:18:08
452	39	230	275	2022-03-04 12:18:08	2022-03-04 12:18:08
446	39	220	269	2022-03-04 12:18:08	2022-03-04 12:18:08
447	39	220	270	2022-03-04 12:18:08	2022-03-04 12:18:08
449	39	220	272	2022-03-04 12:18:08	2022-03-04 12:18:08
450	39	220	273	2022-03-04 12:18:08	2022-03-04 12:18:08
524	39	221	352	2022-03-04 12:18:08	2022-03-04 12:18:08
525	39	221	353	2022-03-04 12:18:08	2022-03-04 12:18:08
526	39	221	354	2022-03-04 12:18:08	2022-03-04 12:18:08
529	39	231	357	2022-03-04 12:18:08	2022-03-04 12:18:08
527	39	221	355	2022-03-04 12:18:08	2022-03-04 12:18:08
496	39	223	322	2022-03-04 12:18:08	2022-03-04 12:18:08
497	39	223	323	2022-03-04 12:18:08	2022-03-04 12:18:08
498	39	223	324	2022-03-04 12:18:08	2022-03-04 12:18:08
499	39	223	325	2022-03-04 12:18:08	2022-03-04 12:18:08
500	39	223	326	2022-03-04 12:18:08	2022-03-04 12:18:08
501	39	223	327	2022-03-04 12:18:08	2022-03-04 12:18:08
502	39	223	328	2022-03-04 12:18:08	2022-03-04 12:18:08
505	39	223	331	2022-03-04 12:18:08	2022-03-04 12:18:08
506	39	223	332	2022-03-04 12:18:08	2022-03-04 12:18:08
507	39	223	333	2022-03-04 12:18:08	2022-03-04 12:18:08
508	39	223	335	2022-03-04 12:18:08	2022-03-04 12:18:08
509	39	223	336	2022-03-04 12:18:08	2022-03-04 12:18:08
510	39	223	337	2022-03-04 12:18:08	2022-03-04 12:18:08
511	39	223	338	2022-03-04 12:18:08	2022-03-04 12:18:08
514	39	223	341	2022-03-04 12:18:08	2022-03-04 12:18:08
512	39	223	339	2022-03-04 12:18:08	2022-03-04 12:18:08
513	39	223	340	2022-03-04 12:18:08	2022-03-04 12:18:08
515	39	223	342	2022-03-04 12:18:08	2022-03-04 12:18:08
516	39	223	343	2022-03-04 12:18:08	2022-03-04 12:18:08
517	39	223	345	2022-03-04 12:18:08	2022-03-04 12:18:08
518	39	223	346	2022-03-04 12:18:08	2022-03-04 12:18:08
519	39	223	347	2022-03-04 12:18:08	2022-03-04 12:18:08
520	39	223	348	2022-03-04 12:18:08	2022-03-04 12:18:08
521	39	223	349	2022-03-04 12:18:08	2022-03-04 12:18:08
522	39	223	350	2022-03-04 12:18:08	2022-03-04 12:18:08
490	39	224	316	2022-03-04 12:18:08	2022-03-04 12:18:08
491	39	224	317	2022-03-04 12:18:08	2022-03-04 12:18:08
492	39	224	318	2022-03-04 12:18:08	2022-03-04 12:18:08
493	39	224	319	2022-03-04 12:18:08	2022-03-04 12:18:08
494	39	224	320	2022-03-04 12:18:08	2022-03-04 12:18:08
495	39	224	321	2022-03-04 12:18:08	2022-03-04 12:18:08
451	39	230	274	2022-03-04 12:18:08	2022-03-04 12:18:08
454	39	230	277	2022-03-04 12:18:08	2022-03-04 12:18:08
455	39	230	278	2022-03-04 12:18:08	2022-03-04 12:18:08
456	39	230	279	2022-03-04 12:18:08	2022-03-04 12:18:08
460	39	230	283	2022-03-04 12:18:08	2022-03-04 12:18:08
461	39	230	284	2022-03-04 12:18:08	2022-03-04 12:18:08
463	39	230	286	2022-03-04 12:18:08	2022-03-04 12:18:08
462	39	230	285	2022-03-04 12:18:08	2022-03-04 12:18:08
465	39	230	288	2022-03-04 12:18:08	2022-03-04 12:18:08
470	39	469	293	2022-03-04 12:18:08	2022-03-04 12:18:08
468	39	230	291	2022-03-04 12:18:08	2022-03-04 12:18:08
480	39	230	305	2022-03-04 12:18:08	2022-03-04 12:18:08
471	39	469	294	2022-03-04 12:18:08	2022-03-04 12:18:08
534	39	234	363	2022-03-04 12:18:08	2022-03-04 12:18:08
547	39	234	377	2022-03-04 12:18:08	2022-03-04 12:18:08
549	39	234	379	2022-03-04 12:18:08	2022-03-04 12:18:08
466	39	469	289	2022-03-04 12:18:08	2022-03-04 12:18:08
472	39	469	295	2022-03-04 12:18:08	2022-03-04 12:18:08
474	39	469	297	2022-03-04 12:18:08	2022-03-04 12:18:08
475	39	469	298	2022-03-04 12:18:08	2022-03-04 12:18:08
476	39	469	299	2022-03-04 12:18:08	2022-03-04 12:18:08
444	39	-1	49	2022-03-04 12:18:08	2022-03-04 12:18:08
445	39	-1	50	2022-03-04 12:18:08	2022-03-04 12:18:08
459	39	-1	51	2022-03-04 12:18:08	2022-03-04 12:18:08
469	39	-1	52	2022-03-04 12:18:08	2022-03-04 12:18:08
485	39	-1	53	2022-03-04 12:18:08	2022-03-04 12:18:08
530	39	-1	56	2022-03-04 12:18:08	2022-03-04 12:18:08
531	39	-1	57	2022-03-04 12:18:08	2022-03-04 12:18:08
542	39	-1	58	2022-03-04 12:18:08	2022-03-04 12:18:08
543	39	-1	59	2022-03-04 12:18:08	2022-03-04 12:18:08
544	39	-1	60	2022-03-04 12:18:08	2022-03-04 12:18:08
546	39	-1	61	2022-03-04 12:18:08	2022-03-04 12:18:08
548	39	-1	62	2022-03-04 12:18:08	2022-03-04 12:18:08
550	39	-1	63	2022-03-04 12:18:08	2022-03-04 12:18:08
551	39	-1	64	2022-03-04 12:18:08	2022-03-04 12:18:08
552	39	-1	65	2022-03-04 12:18:08	2022-03-04 12:18:08
553	39	-1	66	2022-03-04 12:18:08	2022-03-04 12:18:08
556	39	-1	67	2022-03-04 12:18:08	2022-03-04 12:18:08
557	39	-1	68	2022-03-04 12:18:08	2022-03-04 12:18:08
558	39	-1	69	2022-03-04 12:18:08	2022-03-04 12:18:08
537	39	210	12	2022-03-04 12:18:08	2022-03-04 12:18:08
569	39	214	401	2022-03-04 12:18:08	2022-03-04 12:18:08
572	39	210	26	2022-03-04 12:18:08	2022-03-04 12:18:08
578	39	210	27	2022-03-04 12:18:08	2022-03-04 12:18:08
574	39	230	406	2022-03-04 12:18:08	2022-03-04 12:18:08
579	39	210	28	2022-03-04 12:18:08	2022-03-04 12:18:08
573	39	230	405	2022-03-04 12:18:08	2022-03-04 12:18:08
580	39	210	29	2022-03-04 12:18:08	2022-03-04 12:18:08
582	39	210	30	2022-03-04 12:18:08	2022-03-04 12:18:08
622	39	443	458	2022-03-04 12:18:08	2022-03-04 12:18:08
565	39	210	21	2022-03-04 12:18:08	2022-03-04 12:18:08
567	39	210	23	2022-03-04 12:18:08	2022-03-04 12:18:08
667	39	234	506	2022-03-04 12:18:08	2022-03-04 12:18:08
583	39	210	416	2022-03-04 12:18:08	2022-03-04 12:18:08
568	39	210	24	2022-03-04 12:18:08	2022-03-04 12:18:08
584	39	210	417	2022-03-04 12:18:08	2022-03-04 12:18:08
676	39	232	515	2022-03-04 12:18:08	2022-03-04 12:18:08
575	39	212	407	2022-03-04 12:18:08	2022-03-04 12:18:08
577	39	212	409	2022-03-04 12:18:08	2022-03-04 12:18:08
564	39	214	396	2022-03-04 12:18:08	2022-03-04 12:18:08
624	39	443	460	2022-03-04 12:18:08	2022-03-04 12:18:08
678	39	232	517	2022-03-04 12:18:08	2022-03-04 12:18:08
633	39	445	469	2022-03-04 12:18:08	2022-03-04 12:18:08
619	39	443	455	2022-03-04 12:18:08	2022-03-04 12:18:08
654	39	222	493	2022-03-04 12:18:08	2022-03-04 12:18:08
655	39	222	494	2022-03-04 12:18:08	2022-03-04 12:18:08
657	39	222	496	2022-03-04 12:18:08	2022-03-04 12:18:08
673	39	542	512	2022-03-04 12:18:08	2022-03-04 12:18:08
658	39	225	497	2022-03-04 12:18:08	2022-03-04 12:18:08
659	39	225	498	2022-03-04 12:18:08	2022-03-04 12:18:08
660	39	225	499	2022-03-04 12:18:08	2022-03-04 12:18:08
661	39	225	500	2022-03-04 12:18:08	2022-03-04 12:18:08
662	39	225	501	2022-03-04 12:18:08	2022-03-04 12:18:08
663	39	225	502	2022-03-04 12:18:08	2022-03-04 12:18:08
641	39	226	478	2022-03-04 12:18:08	2022-03-04 12:18:08
642	39	226	479	2022-03-04 12:18:08	2022-03-04 12:18:08
643	39	226	480	2022-03-04 12:18:08	2022-03-04 12:18:08
644	39	226	481	2022-03-04 12:18:08	2022-03-04 12:18:08
645	39	226	482	2022-03-04 12:18:08	2022-03-04 12:18:08
646	39	226	483	2022-03-04 12:18:08	2022-03-04 12:18:08
647	39	226	484	2022-03-04 12:18:08	2022-03-04 12:18:08
648	39	226	485	2022-03-04 12:18:08	2022-03-04 12:18:08
649	39	226	486	2022-03-04 12:18:08	2022-03-04 12:18:08
650	39	226	487	2022-03-04 12:18:08	2022-03-04 12:18:08
651	39	226	488	2022-03-04 12:18:08	2022-03-04 12:18:08
652	39	226	489	2022-03-04 12:18:08	2022-03-04 12:18:08
665	39	228	504	2022-03-04 12:18:08	2022-03-04 12:18:08
666	39	228	505	2022-03-04 12:18:08	2022-03-04 12:18:08
605	39	274	441	2022-03-04 12:18:08	2022-03-04 12:18:08
668	39	228	507	2022-03-04 12:18:08	2022-03-04 12:18:08
670	39	228	509	2022-03-04 12:18:08	2022-03-04 12:18:08
570	39	230	402	2022-03-04 12:18:08	2022-03-04 12:18:08
677	39	232	516	2022-03-04 12:18:08	2022-03-04 12:18:08
679	39	232	518	2022-03-04 12:18:08	2022-03-04 12:18:08
680	39	232	519	2022-03-04 12:18:08	2022-03-04 12:18:08
681	39	232	520	2022-03-04 12:18:08	2022-03-04 12:18:08
581	39	234	414	2022-03-04 12:18:08	2022-03-04 12:18:08
606	39	274	442	2022-03-04 12:18:08	2022-03-04 12:18:08
607	39	274	443	2022-03-04 12:18:08	2022-03-04 12:18:08
608	39	274	444	2022-03-04 12:18:08	2022-03-04 12:18:08
609	39	274	445	2022-03-04 12:18:08	2022-03-04 12:18:08
610	39	274	446	2022-03-04 12:18:08	2022-03-04 12:18:08
611	39	274	447	2022-03-04 12:18:08	2022-03-04 12:18:08
612	39	274	448	2022-03-04 12:18:08	2022-03-04 12:18:08
613	39	274	449	2022-03-04 12:18:08	2022-03-04 12:18:08
614	39	274	450	2022-03-04 12:18:08	2022-03-04 12:18:08
595	39	357	431	2022-03-04 12:18:08	2022-03-04 12:18:08
596	39	357	432	2022-03-04 12:18:08	2022-03-04 12:18:08
597	39	357	433	2022-03-04 12:18:08	2022-03-04 12:18:08
598	39	357	434	2022-03-04 12:18:08	2022-03-04 12:18:08
599	39	357	435	2022-03-04 12:18:08	2022-03-04 12:18:08
600	39	357	436	2022-03-04 12:18:08	2022-03-04 12:18:08
601	39	357	437	2022-03-04 12:18:08	2022-03-04 12:18:08
602	39	357	438	2022-03-04 12:18:08	2022-03-04 12:18:08
603	39	357	439	2022-03-04 12:18:08	2022-03-04 12:18:08
604	39	357	440	2022-03-04 12:18:08	2022-03-04 12:18:08
585	39	422	418	2022-03-04 12:18:08	2022-03-04 12:18:08
586	39	422	419	2022-03-04 12:18:08	2022-03-04 12:18:08
587	39	422	421	2022-03-04 12:18:08	2022-03-04 12:18:08
588	39	422	423	2022-03-04 12:18:08	2022-03-04 12:18:08
591	39	422	427	2022-03-04 12:18:08	2022-03-04 12:18:08
589	39	422	424	2022-03-04 12:18:08	2022-03-04 12:18:08
592	39	422	428	2022-03-04 12:18:08	2022-03-04 12:18:08
593	39	422	429	2022-03-04 12:18:08	2022-03-04 12:18:08
638	39	445	2	2022-03-04 12:18:08	2022-03-04 12:18:08
618	39	444	454	2022-03-04 12:18:08	2022-03-04 12:18:08
617	39	443	453	2022-03-04 12:18:08	2022-03-04 12:18:08
620	39	443	456	2022-03-04 12:18:08	2022-03-04 12:18:08
621	39	443	457	2022-03-04 12:18:08	2022-03-04 12:18:08
623	39	443	459	2022-03-04 12:18:08	2022-03-04 12:18:08
616	39	444	452	2022-03-04 12:18:08	2022-03-04 12:18:08
634	39	445	470	2022-03-04 12:18:08	2022-03-04 12:18:08
635	39	445	471	2022-03-04 12:18:08	2022-03-04 12:18:08
615	39	-1	70	2022-03-04 12:18:08	2022-03-04 12:18:08
637	39	445	474	2022-03-04 12:18:08	2022-03-04 12:18:08
636	39	445	1	2022-03-04 12:18:08	2022-03-04 12:18:08
640	39	445	477	2022-03-04 12:18:08	2022-03-04 12:18:08
626	39	530	462	2022-03-04 12:18:08	2022-03-04 12:18:08
628	39	530	464	2022-03-04 12:18:08	2022-03-04 12:18:08
629	66	-1	1	2022-02-23 00:00:00	2022-03-07 00:00:00
630	39	530	466	2022-03-04 12:18:08	2022-03-04 12:18:08
631	39	530	467	2022-03-04 12:18:08	2022-03-04 12:18:08
625	39	530	461	2022-03-04 12:18:08	2022-03-04 12:18:08
682	39	531	521	2022-03-04 12:18:08	2022-03-04 12:18:08
653	39	531	492	2022-03-04 12:18:08	2022-03-04 12:18:08
674	39	542	513	2022-03-04 12:18:08	2022-03-04 12:18:08
675	39	542	514	2022-03-04 12:18:08	2022-03-04 12:18:08
639	39	445	3	2022-03-04 12:18:08	2022-03-04 12:18:08
632	39	-1	71	2022-03-04 12:18:08	2022-03-04 12:18:08
656	39	-1	72	2022-03-04 12:18:08	2022-03-04 12:18:08
671	39	-1	73	2022-03-04 12:18:08	2022-03-04 12:18:08
672	39	-1	74	2022-03-04 12:18:08	2022-03-04 12:18:08
571	39	210	25	2022-03-04 12:18:08	2022-03-04 12:18:08
211	1	-1	-1	2022-03-04 12:18:08	2022-03-04 12:18:08
323	39	210	3	2022-03-04 12:18:08	2022-03-04 12:18:08
326	39	210	5	2022-03-04 12:18:08	2022-03-04 12:18:08
264	39	212	69	2022-03-04 12:18:08	2022-03-04 12:18:08
268	39	212	73	2022-03-04 12:18:08	2022-03-04 12:18:08
576	39	212	408	2022-03-04 12:18:08	2022-03-04 12:18:08
773	1	-1	-1	2022-03-07 13:00:42	2022-03-07 13:00:42
271	39	214	76	2022-03-04 12:18:08	2022-03-04 12:18:08
305	39	214	110	2022-03-04 12:18:08	2022-03-04 12:18:08
775	38	609	-1	2022-03-07 13:09:09	2022-03-07 13:09:09
256	39	215	61	2022-03-04 12:18:08	2022-03-04 12:18:08
699	39	235	538	2022-03-04 12:18:08	2022-03-04 12:18:08
348	39	217	161	2022-03-04 12:18:08	2022-03-04 12:18:08
722	39	-1	75	2022-03-04 12:18:08	2022-03-04 12:18:08
392	39	216	214	2022-03-04 12:18:08	2022-03-04 12:18:08
409	39	216	231	2022-03-04 12:18:08	2022-03-04 12:18:08
697	39	531	536	2022-03-04 12:18:08	2022-03-04 12:18:08
725	39	422	564	2022-03-04 12:18:08	2022-03-04 12:18:08
728	39	422	567	2022-03-04 12:18:08	2022-03-04 12:18:08
729	39	422	568	2022-03-04 12:18:08	2022-03-04 12:18:08
731	39	422	570	2022-03-04 12:18:08	2022-03-04 12:18:08
733	39	422	572	2022-03-04 12:18:08	2022-03-04 12:18:08
734	39	422	573	2022-03-04 12:18:08	2022-03-04 12:18:08
739	39	444	578	2022-03-04 12:18:08	2022-03-04 12:18:08
742	39	444	581	2022-03-04 12:18:08	2022-03-04 12:18:08
448	39	220	271	2022-03-04 12:18:08	2022-03-04 12:18:08
762	39	776	602	2022-03-04 12:18:08	2022-03-04 12:18:08
767	39	776	607	2022-03-04 12:18:08	2022-03-04 12:18:08
769	39	776	610	2022-03-04 12:18:08	2022-03-04 12:18:08
770	39	776	612	2022-03-04 12:18:08	2022-03-04 12:18:08
771	39	776	614	2022-03-04 12:18:08	2022-03-04 12:18:08
772	39	776	615	2022-03-04 12:18:08	2022-03-04 12:18:08
723	39	422	562	2022-03-04 12:18:08	2022-03-04 12:18:08
708	39	233	547	2022-03-04 12:18:08	2022-03-04 12:18:08
756	39	444	596	2022-03-04 12:18:08	2022-03-04 12:18:08
503	39	223	329	2022-03-04 12:18:08	2022-03-04 12:18:08
523	39	223	351	2022-03-04 12:18:08	2022-03-04 12:18:08
664	39	225	503	2022-03-04 12:18:08	2022-03-04 12:18:08
669	39	228	508	2022-03-04 12:18:08	2022-03-04 12:18:08
464	39	230	287	2022-03-04 12:18:08	2022-03-04 12:18:08
467	39	230	290	2022-03-04 12:18:08	2022-03-04 12:18:08
707	39	233	546	2022-03-04 12:18:08	2022-03-04 12:18:08
709	39	233	548	2022-03-04 12:18:08	2022-03-04 12:18:08
710	39	233	549	2022-03-04 12:18:08	2022-03-04 12:18:08
711	39	233	550	2022-03-04 12:18:08	2022-03-04 12:18:08
712	39	233	551	2022-03-04 12:18:08	2022-03-04 12:18:08
713	39	233	552	2022-03-04 12:18:08	2022-03-04 12:18:08
715	39	233	554	2022-03-04 12:18:08	2022-03-04 12:18:08
714	39	233	553	2022-03-04 12:18:08	2022-03-04 12:18:08
716	39	233	555	2022-03-04 12:18:08	2022-03-04 12:18:08
717	39	233	556	2022-03-04 12:18:08	2022-03-04 12:18:08
719	39	233	558	2022-03-04 12:18:08	2022-03-04 12:18:08
720	39	233	559	2022-03-04 12:18:08	2022-03-04 12:18:08
721	39	233	560	2022-03-04 12:18:08	2022-03-04 12:18:08
479	39	234	304	2022-03-04 12:18:08	2022-03-04 12:18:08
700	39	235	539	2022-03-04 12:18:08	2022-03-04 12:18:08
701	39	235	540	2022-03-04 12:18:08	2022-03-04 12:18:08
702	39	235	541	2022-03-04 12:18:08	2022-03-04 12:18:08
703	39	235	542	2022-03-04 12:18:08	2022-03-04 12:18:08
704	39	235	543	2022-03-04 12:18:08	2022-03-04 12:18:08
705	39	235	544	2022-03-04 12:18:08	2022-03-04 12:18:08
706	39	235	545	2022-03-04 12:18:08	2022-03-04 12:18:08
759	39	776	599	2022-03-04 12:18:08	2022-03-04 12:18:08
755	39	776	595	2022-03-04 12:18:08	2022-03-04 12:18:08
757	39	776	597	2022-03-04 12:18:08	2022-03-04 12:18:08
758	39	776	598	2022-03-04 12:18:08	2022-03-04 12:18:08
760	39	776	600	2022-03-04 12:18:08	2022-03-04 12:18:08
764	39	776	604	2022-03-04 12:18:08	2022-03-04 12:18:08
763	39	776	603	2022-03-04 12:18:08	2022-03-04 12:18:08
765	39	776	605	2022-03-04 12:18:08	2022-03-04 12:18:08
766	39	776	606	2022-03-04 12:18:08	2022-03-04 12:18:08
768	39	776	608	2022-03-04 12:18:08	2022-03-04 12:18:08
724	39	422	563	2022-03-04 12:18:08	2022-03-04 12:18:08
727	39	422	566	2022-03-04 12:18:08	2022-03-04 12:18:08
730	39	422	569	2022-03-04 12:18:08	2022-03-04 12:18:08
732	39	422	571	2022-03-04 12:18:08	2022-03-04 12:18:08
735	39	422	574	2022-03-04 12:18:08	2022-03-04 12:18:08
426	39	443	248	2022-03-04 12:18:08	2022-03-04 12:18:08
737	39	444	576	2022-03-04 12:18:08	2022-03-04 12:18:08
736	39	444	575	2022-03-04 12:18:08	2022-03-04 12:18:08
738	39	444	577	2022-03-04 12:18:08	2022-03-04 12:18:08
740	39	444	579	2022-03-04 12:18:08	2022-03-04 12:18:08
743	39	444	582	2022-03-04 12:18:08	2022-03-04 12:18:08
744	39	444	583	2022-03-04 12:18:08	2022-03-04 12:18:08
745	39	444	584	2022-03-04 12:18:08	2022-03-04 12:18:08
746	39	444	585	2022-03-04 12:18:08	2022-03-04 12:18:08
747	39	444	586	2022-03-04 12:18:08	2022-03-04 12:18:08
748	39	444	587	2022-03-04 12:18:08	2022-03-04 12:18:08
749	39	444	588	2022-03-04 12:18:08	2022-03-04 12:18:08
750	39	444	589	2022-03-04 12:18:08	2022-03-04 12:18:08
751	39	444	590	2022-03-04 12:18:08	2022-03-04 12:18:08
752	39	444	591	2022-03-04 12:18:08	2022-03-04 12:18:08
753	39	444	593	2022-03-04 12:18:08	2022-03-04 12:18:08
754	39	444	594	2022-03-04 12:18:08	2022-03-04 12:18:08
683	39	531	522	2022-03-04 12:18:08	2022-03-04 12:18:08
684	39	531	523	2022-03-04 12:18:08	2022-03-04 12:18:08
685	39	531	524	2022-03-04 12:18:08	2022-03-04 12:18:08
686	39	531	525	2022-03-04 12:18:08	2022-03-04 12:18:08
687	39	531	526	2022-03-04 12:18:08	2022-03-04 12:18:08
689	39	531	528	2022-03-04 12:18:08	2022-03-04 12:18:08
690	39	531	529	2022-03-04 12:18:08	2022-03-04 12:18:08
691	39	531	530	2022-03-04 12:18:08	2022-03-04 12:18:08
693	39	531	532	2022-03-04 12:18:08	2022-03-04 12:18:08
694	39	531	533	2022-03-04 12:18:08	2022-03-04 12:18:08
695	39	531	534	2022-03-04 12:18:08	2022-03-04 12:18:08
696	39	531	535	2022-03-04 12:18:08	2022-03-04 12:18:08
698	39	531	537	2022-03-04 12:18:08	2022-03-04 12:18:08
692	39	531	531	2022-03-04 12:18:08	2022-03-04 12:18:08
774	1	-1	1	2022-02-23 00:00:00	2022-03-07 00:00:00
726	39	-1	76	2022-03-04 12:18:08	2022-03-04 12:18:08
563	39	210	20	2022-03-04 12:18:08	2022-03-04 12:18:08
566	39	210	22	2022-03-04 12:18:08	2022-03-04 12:18:08
533	39	210	9	2022-03-04 12:18:08	2022-03-04 12:18:08
718	39	233	557	2022-03-04 12:18:08	2022-03-04 12:18:08
761	39	776	601	2022-03-04 12:18:08	2022-03-04 12:18:08
420	39	274	242	2022-03-04 12:18:08	2022-03-04 12:18:08
333	39	322	143	2022-03-04 12:18:08	2022-03-04 12:18:08
594	39	357	430	2022-03-04 12:18:08	2022-03-04 12:18:08
590	39	422	425	2022-03-04 12:18:08	2022-03-04 12:18:08
741	39	444	580	2022-03-04 12:18:08	2022-03-04 12:18:08
627	39	530	463	2022-03-04 12:18:08	2022-03-04 12:18:08
688	39	531	527	2022-03-04 12:18:08	2022-03-04 12:18:08
777	1	-1	-1	2022-03-07 15:25:22	2022-03-07 15:25:22
779	38	613	-1	2022-03-10 13:23:26	2022-03-10 13:23:26
780	38	613	-1	2022-03-10 13:25:09	2022-03-10 13:25:09
781	38	613	-1	2022-03-10 13:28:31	2022-03-10 13:28:31
778	1	-1	-1	2022-03-10 13:20:36	2022-03-10 13:20:36
783	38	617	-1	2022-03-10 14:09:39	2022-03-10 14:09:39
784	52	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00
785	52	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00
786	52	785	1	2022-03-03 00:00:00	2022-03-03 00:00:00
787	39	48	-1	2022-03-10 14:23:22	2022-03-10 14:23:22
788	38	782	-1	2022-03-10 14:28:52	2022-03-10 14:28:52
782	1	-1	-1	2022-03-10 14:07:56	2022-03-10 14:07:56
789	65	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00
790	65	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00
791	65	790	1	2022-03-03 00:00:00	2022-03-03 00:00:00
792	66	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00
794	66	793	1	2022-03-03 00:00:00	2022-03-03 00:00:00
795	67	-1	-1	2022-03-14 16:11:29	2022-03-14 16:11:29
797	68	-1	-1	2022-03-15 15:41:52	2022-03-15 15:41:52
798	68	-1	-1	2022-03-15 17:15:06	2022-03-15 17:15:06
799	68	-1	-1	2022-03-15 17:18:45	2022-03-15 17:18:45
800	69	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00
802	70	-1	-1	2022-03-16 13:53:32	2022-03-16 13:53:32
805	70	-1	0	2022-03-16 14:23:01	2022-03-16 14:23:01
819	72	-1	-1	2022-03-19 11:47:51	2022-03-19 11:47:51
820	72	819	-1	2022-03-19 11:50:14	2022-03-19 11:50:14
822	70	-1	-1	2022-03-19 13:08:07	2022-03-19 13:08:07
824	70	-1	-1	2022-03-19 13:29:33	2022-03-19 13:29:33
826	70	-1	-1	2022-03-19 13:36:07	2022-03-19 13:36:07
827	70	826	-1	2022-03-19 13:36:32	2022-03-19 13:36:32
823	1	-1	-1	2022-03-19 13:11:23	2022-03-19 13:11:23
825	1	-1	-1	2022-03-19 13:32:26	2022-03-19 13:32:26
828	1	-1	-1	2022-03-19 15:19:40	2022-03-19 15:19:40
804	70	-1	1	2022-03-16 14:20:52	2022-03-16 14:20:52
801	70	-1	2	2022-03-16 13:49:06	2022-03-16 13:49:06
803	70	-1	3	2022-03-16 14:20:01	2022-03-16 14:20:01
829	1	-1	-1	2022-03-19 15:24:58	2022-03-19 15:24:58
841	70	835	2	2022-02-23 00:00:00	2022-03-10 00:00:00
830	1	658	-1	2022-03-19 15:47:39	2022-03-19 15:47:39
831	70	822	-1	2022-03-19 16:05:25	2022-03-19 16:05:25
832	67	795	-1	2022-03-19 16:06:41	2022-03-19 16:06:41
793	66	-1	1	2022-02-23 00:00:00	2022-03-07 00:00:00
846	70	660	-1	2022-03-21 13:06:17	2022-03-21 13:06:17
833	67	795	-1	2022-03-19 16:13:46	2022-03-19 16:13:46
834	1	658	-1	2022-03-19 16:14:35	2022-03-19 16:14:35
796	39	-1	8	2022-03-15 15:32:40	2022-03-15 15:32:40
776	39	-1	9	2022-03-03 00:00:00	2022-03-03 00:00:00
223	39	-1	14	2022-03-04 12:18:08	2022-03-04 12:18:08
246	39	-1	31	2022-03-04 12:18:08	2022-03-04 12:18:08
504	39	-1	54	2022-03-04 12:18:08	2022-03-04 12:18:08
806	71	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00
808	71	-1	1	2022-03-03 00:00:00	2022-03-03 00:00:00
847	70	660	-1	2022-03-21 13:07:40	2022-03-21 13:07:40
807	72	-1	-1	2022-03-17 18:00:45	2022-03-17 18:00:45
809	70	-1	-1	2022-03-17 18:16:34	2022-03-17 18:16:34
810	70	-1	-1	2022-03-17 18:17:48	2022-03-17 18:17:48
811	70	-1	-1	2022-03-17 18:23:30	2022-03-17 18:23:30
813	70	812	-1	2022-03-17 18:39:59	2022-03-17 18:39:59
812	70	-1	-1	2022-03-17 18:42:23	2022-03-17 18:42:23
814	71	-1	-1	2022-03-18 11:34:40	2022-03-18 11:34:40
848	70	-1	-1	2022-03-21 13:18:07	2022-03-21 13:18:07
849	70	824	-1	2022-03-21 13:18:31	2022-03-21 13:18:31
844	70	822	-1	2022-03-21 12:17:12	2022-03-21 12:17:12
815	71	-1	-1	2022-03-18 12:22:44	2022-03-18 12:22:44
816	71	-1	-1	2022-03-18 12:28:16	2022-03-18 12:28:16
817	71	-1	-1	2022-03-18 13:38:21	2022-03-18 13:38:21
818	71	-1	-1	2022-03-18 14:53:07	2022-03-18 14:53:07
836	70	658	-1	2022-03-21 11:17:28	2022-03-21 11:17:28
821	1	-1	-1	2022-03-19 12:26:27	2022-03-19 12:26:27
837	70	658	-1	2022-03-21 11:25:43	2022-03-21 11:25:43
838	70	812	-1	2022-03-21 11:28:32	2022-03-21 11:28:32
839	70	812	-1	2022-03-21 11:28:49	2022-03-21 11:28:49
840	70	812	-1	2022-03-21 11:29:01	2022-03-21 11:29:01
842	70	658	-1	2022-03-21 12:10:47	2022-03-21 12:10:47
843	70	658	-1	2022-03-21 12:16:58	2022-03-21 12:16:58
835	70	-1	2	2022-02-23 00:00:00	2022-03-10 00:00:00
845	70	660	-1	2022-03-21 12:34:35	2022-03-21 12:34:35
850	70	822	-1	2022-03-21 15:21:07	2022-03-21 15:21:07
851	73	-1	-1	2022-03-21 18:10:01	2022-03-21 18:10:01
852	70	-1	-1	2022-03-22 14:45:06	2022-03-22 14:45:06
853	70	852	-1	2022-03-22 14:45:25	2022-03-22 14:45:25
854	70	852	-1	2022-03-22 14:45:46	2022-03-22 14:45:46
855	74	-1	-1	2022-03-22 18:52:20	2022-03-22 18:52:20
\.


--
-- Data for Name: knowledge_base_category_delayed_jobs; Type: TABLE DATA; Schema: public; Owner: knowledgebase
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
\.


--
-- Data for Name: knowledge_base_category_translations; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.knowledge_base_category_translations (id, name, kb_locale_id, category_id, created_at, updated_at, ui_color, category_icon, title_tag, footer, keywords, meta_description, publish_now, active, permission, update_metadata, group_name, is_delete_scheduled, is_update_scheduled) FROM stdin;
26	Category 001 (Dansk) 	4	35	2022-02-25 14:49:45	2022-02-25 14:49:45	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	FFFF	KW	MD	t	t	Public	\N		f	f
43	Category 001 English (United States)	1	47	2022-03-01 17:21:20	2022-03-01 17:21:20	red	http://77.68.102.60:1000/download?filename=preview.png	Title Tag	Footer	Keywords	Meta Description	t	t	Public	\N		f	f
44	Categroy 001 (English (Great Britain))	8	47	2022-03-01 17:21:37	2022-03-01 17:21:37	red	http://77.68.102.60:1000/download?filename=preview.png	Title tag	Footer	Keywords	Meta Description	t	t	Public	\N		f	f
1		1	14	2022-02-22 13:49:51	2022-02-22 13:49:51	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
47	Plumber 	1	212	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/graphics-design.d32a2f8.svg					t	t		\N		f	f
48	Electrician 	1	213	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg			-1		t	t		\N		f	f
2		1	15	2022-02-22 13:52:57	2022-02-22 13:52:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
3		2	15	2022-02-22 13:52:57	2022-02-22 13:52:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
4		3	15	2022-02-22 13:52:57	2022-02-22 13:52:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
5		4	15	2022-02-22 13:52:57	2022-02-22 13:52:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
6	English (United States)	1	16	2022-02-22 14:12:52	2022-02-22 14:12:52	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
7	Czech (Česky)	3	16	2022-02-22 14:12:52	2022-02-22 14:12:52	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
8	Bulgarian (Български)	2	16	2022-02-22 14:12:52	2022-02-22 14:12:52	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
9	Dansk	4	16	2022-02-22 14:12:52	2022-02-22 14:12:52	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
10	Español (Colombia)	10	17	2022-02-22 15:28:37	2022-02-22 15:28:37	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
11	English (Canada)	7	17	2022-02-22 15:28:37	2022-02-22 15:28:37	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
12	English (United States)	1	18	2022-02-22 18:03:57	2022-02-22 18:03:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
13	English (Canada)	7	18	2022-02-22 18:03:57	2022-02-22 18:03:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
14	Nederlands	22	18	2022-02-22 18:03:57	2022-02-22 18:03:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
15	Français	13	18	2022-02-22 18:03:57	2022-02-22 18:03:57	red	\N	\N	\N	\N	\N	\N	\N	\N	\N		f	f
16	category 1 for kb_id 31 locale 1	2	26	2022-02-23 00:00:00	2022-02-23 00:00:00	red	category_icon_123	test tag	footer info	key, word	meta description for knowledgebase category	t	t	public	\N		f	f
17	category 2 for kb_id 31 locale 1	1	27	2022-02-23 00:00:00	2022-02-23 00:00:00	red	category_icon_123	test tag	footer info	key, word	meta description for knowledgebase category	t	t	public	\N		f	f
18	category 2 for kb_id 31 locale 1	1	28	2022-02-23 00:00:00	2022-02-23 00:00:00	red	category_icon_123	test tag	footer info	key, word	meta description for knowledgebase category	t	t	public	\N		f	f
19	category 2 for kb_id 29 locale 17	17	29	2022-02-23 00:00:00	2022-02-23 00:00:00	red	category_icon_123	test tag	footer info	key, word	meta description for knowledgebase category	f	t	public	\N		f	f
20	category 3 for kb_id 29 locale 25	25	29	2022-02-23 00:00:00	2022-02-23 00:00:00	red	category_icon_123	test tag	footer info	key, word	meta	t	t	public	\N		f	f
24	ENGLISH UNITED STATES	1	33	2022-02-25 13:47:57	2022-02-25 13:47:57	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TTTAG	Footer	Keywords	Meta Description	t	t	Public	\N		f	f
25	English (Great Britian)	8	34	2022-02-25 14:16:05	2022-02-25 14:16:05	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	Title Tag	Footer	Keywords	Meta Description	t	t	Public	\N		f	f
27	Category 002 (Dansk)	4	36	2022-02-25 14:51:45	2022-02-25 14:51:45	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	Footer	Keywords	Meta Description	t	t	Public	\N		f	f
29	Category 002 (Bulgarian (Български))	2	38	2022-02-25 14:54:41	2022-02-25 14:54:41	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	Footer	Keywords	Meta Description	t	t	Public	\N		f	f
30	Category 002 (Bulgarian (Български))	2	39	2022-02-25 14:56:57	2022-02-25 14:56:57	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	Footer	Keywords	Meta Description	t	f	Public	\N		f	f
31	Category 002 (Bulgarian (Български))	2	40	2022-02-25 14:57:11	2022-02-25 14:57:11	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	Footer	Keywords	Meta Description	t	t	Public	\N		f	f
21	updated name	1	29	2022-02-23 00:00:00	2022-02-23 00:00:00	red	updated icon	test tag	footer info	key, word	meta	t	t	internal	\N		f	f
38	updated category english translation	1	45	2022-02-23 00:00:00	2022-02-23 00:00:00	blue	new category icon	test tag	footer info	key, word	meta	t	t	public	\N		f	f
45	Decorator	1	210	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg					t	t		\N		f	f
49	Carpenter 	1	214	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/writing-translation.32ebe2e.svg			-1		t	t		\N		f	f
50	Roofer	1	215	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/music-audio.320af20.svg			-1		t	t		\N		f	f
51	Law Practitioner 	1	216	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
52	Auto Body Repairer 	1	217	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/programming.9362366.svg			-1		t	t		\N		f	f
121	Built-In Furniture	1	286	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
46	Builder	1	211	2022-03-04 12:18:08	2022-03-04 12:18:08	red					[{"title":"Title","description":"Description","type":"checkbox","required":"","placeholder":"Placeholder","defaultvalue":"12","inputs":[{"value":"12"}]}]	t	t		\N		f	f
54	Photographer 	1	219	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/lifestyle.745b575.svg			-1		t	t		\N		f	f
55	Chef 	1	220	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
56	Hair Stylist	1	221	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
57	Personal Stylist	1	222	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
58	Beautician	1	223	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
59	Massage Therapist	1	224	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
60	Home Stylist 	1	225	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
61	Mover	1	226	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
62	Pest Controller 	1	227	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
63	Locksmith 	1	228	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
64	Cleaner 	1	229	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
65	Gardener / Landscape Gardener	1	230	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
66	Barber	1	231	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
67	Accountant 	1	232	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
68	Therapist 	1	233	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
69	Tailor 	1	234	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
70	Welder 	1	235	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
71	Artist 	1	236	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
72	Bathroom Installation 	1	237	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
73	"Bathroom	1	238	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Kitchen and WC Plumbing"	Plumber				t	t		\N		f	f
74	Emergency / 24 Hour Plumber	1	239	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
75	Guttering and Rainwater Pipe	1	240	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
76	Hot Tub Installation / Repair	1	241	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
77	Plumbing Repair & Maintenance	1	242	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
78	Power Showers and Pump	1	243	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
79	Solar Panel Installation	1	244	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
80	Sprinkler System	1	245	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
81	Water Tanks and Immersion Heater	1	246	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
82	Water Underfloor Heating 	1	247	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
83	Chimney Building / Repair	1	248	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
84	Flat Roof – Installation / Repair	1	249	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
85	Guttering and Rainwater Pipe Leadwork 	1	250	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
86	Roof Cleaning 	1	251	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
87	Roof Insulation 	1	252	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
88	Slate & Tiled Roof 	1	253	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
89	Thatched Roof 	1	254	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
90	UPVC Fascias / Soffits / Cladding 	1	255	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
91	Velux / Skylight Window 	1	256	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
92	Wooden Cladding / Fascias / Soffits	1	257	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
93	Zinc / Metal Roof	1	258	2022-03-04 12:18:08	2022-03-04 12:18:08	red				17		t	t		\N		f	f
94	Cavity Wall Insulation	1	259	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
95	Cellar & Basement Conversion	1	260	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
96	Cladding	1	261	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
97	Conservatory	1	262	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
98	Disability Access Installation	1	263	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
99	Mould / Damp Control	1	264	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
100	Garage Conversion	1	265	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
101	Garden Office / Studio Construction	1	266	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
102	Groundwork / Foundations	1	267	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
103	Home Improvements 	1	268	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
104	House Extension 	1	269	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
105	Loft Conversion 	1	270	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
106	Log Cabins / Timber Framed Building	1	271	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
107	Metal Staircases	1	272	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
108	Partition Wall	1	273	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
109	Writer	1	274	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
110	Period / Listed Building Works	1	275	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
111	Pizza Oven	1	276	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
112	Porch / Canopy	1	277	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
113	Post Construction Cleaning	1	278	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
114	Steel Fabrication / Structural Steelwork	1	279	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
115	Suspended Ceiling	1	280	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
116	Underfloor Insulation 	1	281	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
117	Underpinning / Piling / Foundations	1	282	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
118	Wooden Staircases	1	283	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
119	Bespoke Furniture	1	284	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
120	Bespoke Kitchens	1	285	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
123	Flat Pack Furniture Assembly	1	288	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
124	Floor Sanding & Finishing	1	289	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
125	Garden Shed / Playhouse	1	290	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
126	General Fitted Furniture	1	291	2022-03-04 12:18:08	2022-03-04 12:18:08	red				16		t	t		\N		f	f
127	Laminate Flooring	1	292	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
128	Radiator Covers	1	293	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
129	Skirting Board Installation 	1	294	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
130	Solid Wood Flooring 	1	295	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
131	Wood Floor Sanding / Staining	1	296	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
132	Wooden Casement Window	1	297	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
133	Wooden Cladding /Fascias /Soffits	1	298	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
134	Wooden Decking	1	299	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
135	Wooden Doors – External 	1	300	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
136	Wooden Doors – Internal	1	301	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
137	Wooden Sash Window	1	302	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
138	Wooden Shutter	1	303	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
139	Wooden Staircases 	1	304	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
140	Period / Listed Building Works 	1	305	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
141	Log Cabins / Timber Framed Building 	1	306	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
142	Access Control / Door Entry	1	307	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
143	Aerial & Satellite Dish Installation 	1	308	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
144	Air Conditioning / Refrigeration	1	309	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
145	Carbon Monoxide Alarms – Installation	1	310	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
146	Domestic Appliance Repair	1	311	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
147	Electric Oven / Hob – Installation	1	312	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
148	Electric Underfloor Heating	1	313	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
149	Electrical Inspection Condition Report	1	314	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
150	Electrical Installation / Testing	1	315	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
151	Emergency Electrician	1	316	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
152	External Lighting 	1	317	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
153	Hot Tub Installation / Repair 	1	318	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
154	Internal Lighting 	1	319	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
155	Landlord Reports / Safety Checks	1	320	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
156	Smoke Alarm – Installation 	1	321	2022-03-04 12:18:08	2022-03-04 12:18:08	red				15		t	t		\N		f	f
157	Handyman 	1	322	2022-03-04 12:18:08	2022-03-04 12:18:08	red				-1		t	t		\N		f	f
158	Door / Window Painting 	1	323	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator 		t	t		\N		f	f
159	External Wall Painting 	1	324	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
160	Mould / Damp Control 	1	325	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
161	Internal Painting & Decorating	1	326	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
162	Wall Murals / Paint Effects	1	327	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
163	Blind / Curtain / Shutter – Installation 	1	328	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N		f	f
164	Cat Flap – Installation 	1	329	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N		f	f
165	Domestic Appliance Repair 	1	330	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N		f	f
166	Electric Oven / Hob – Installation 	1	331	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N		f	f
167	Flat Pack Furniture Assembly 	1	332	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N		f	f
168	Home Maintenance / Repair	1	333	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N		f	f
169	Jet / Power Washing	1	334	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N		f	f
170	Perspex / Protective Screens	1	335	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Handyman		t	t		\N		f	f
171	Skirting Board Installation	1	336	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
172	Tiling	1	337	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
173	Paintwork Scratches	1	338	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
174	Interior Repairs – Leather & Plastic Trims	1	339	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
175	Sprayless Scratch Repairs 	1	340	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
176	Minor Dents	1	341	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
177	Minor Dents 	1	342	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
178	Minor Crash Repairs	1	343	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
179	Panel Damage	1	344	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
180	Alloy Wheel Repair	1	345	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
181	Alloy Wheel Colour Changes	1	346	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
182	Alloy Wheel Scuffs 	1	347	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
183	Bumper Scuffs	1	348	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
184	Supagard	1	349	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
185	Keyed Car Repairs	1	350	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
186	End of Lease Repairs	1	351	2022-03-04 12:18:08	2022-03-04 12:18:08	red				19		t	t		\N		f	f
187	Guides 	1	352	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Group3		t	t		\N		f	f
188	Data Guides	1	353	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Guides		t	t		\N		f	f
189	Business guides	1	354	2022-03-04 12:18:08	2022-03-04 12:18:08	red				guides		t	t		\N		f	f
191	Careers 	1	356	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Group2	Writing & Copywriting Guides	t	t		\N		f	f
192	Translator	1	357	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
193	Carpet Cleaning	1	358	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
194	Commercial Window Cleaning	1	359	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
195	Conservatory Cleaning / Maintenance	1	360	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
196	Deep Cleaning – Commercial	1	361	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
197	Deep Cleaning – Domestic	1	362	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
198	Domestic House Cleaning: One Off	1	363	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
199	Domestic House Cleaning: Regular	1	364	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
200	End of Tenancy Cleaning	1	365	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
201	Office / Commercial Cleaning 	1	366	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
202	Oven Cleaning	1	367	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
203	Post Construction Cleaning 	1	368	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
204	Repeat Wheelie Bin Clean	1	369	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
205	Window Cleaning	1	370	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Cleaner		t	t		\N		f	f
206	Commercial Pest Control	1	371	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pest Controller 		t	t		\N		f	f
207	Residential Pest Control	1	372	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pest Controller 		t	t		\N		f	f
208	"Pattern Cutting	1	373	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Grading"	Tailor				t	t		\N		f	f
209	Toiling and Fitting	1	374	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
210	Sample Production 	1	375	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
211	Small-Run Clothing Production	1	376	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
212	Shorten	1	377	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
213	Lengthen	1	378	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
214	Take In	1	379	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
215	Let Out	1	380	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
216	Alter	1	381	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
217	Repair	1	382	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
218	Adjust	1	383	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
219	Hem	1	384	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
220	Patch	1	385	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
221	Press	1	386	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
222	Mend	1	387	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
223	Embroider	1	388	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
224	Iron	1	389	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Tailor		t	t		\N		f	f
225	Business 	1	390	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
226	Administrative & Public Law	1	391	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
227	Art 	1	392	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
228	Clinical Negligence	1	393	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
229	Contractual Disputes	1	394	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
230	Court of Protection	1	395	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
231	Criminal Defence	1	396	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
232	Defamation & Privacy 	1	397	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
233	Discrimination	1	398	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
234	Education Law	1	399	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
235	Employment; Employee	1	400	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
236	Family & Relationships	1	401	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
237	Healthcare 	1	402	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
238	Immigration 	1	403	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
239	Inquests	1	404	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
240	Insolvency 	1	405	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
241	Legal Costs	1	406	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
242	Mediation 	1	407	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
243	Military Law	1	408	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
244	Motoring	1	409	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
245	Organisational Disputes	1	410	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
246	Pensions	1	411	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
247	Personal Disputes	1	412	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
248	Personal Injury	1	413	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
249	Planning (Residential)	1	414	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
250	Private Prosecution	1	415	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
251	Probate	1	416	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
252	Professional Discipline 	1	417	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
253	Professional Negligence 	1	418	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
254	Property & Housing	1	419	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
255	Small Claims	1	420	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
256	Social Security	1	421	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
257	Pet Specialist 	1	422	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
594	Printmaker	1	759	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
259	Weddings	1	424	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N		f	f
260	Party	1	425	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N		f	f
261	Engagement	1	426	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N		f	f
262	Family	1	427	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N		f	f
263	Baby	1	428	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N		f	f
264	360 VR	1	429	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N		f	f
265	Property	1	430	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N		f	f
266	Travel	1	431	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Photographer		t	t		\N		f	f
267	Mobile Fitting Services	1	432	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
268	Car Checks	1	433	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
269	Batteries	1	434	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
270	Brakes	1	435	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
271	Windscreen Treatment	1	436	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
272	DPF & Exhaust System	1	437	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
273	Tyre Services	1	438	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
274	Steering & Suspension	1	439	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
275	Engine Services	1	440	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
276	Diagnostic Check	1	441	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
277	Musicians and Bands 	1	442	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
278	Magician 	1	443	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
279	Lookalike	1	444	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
280	Celebrity 	1	445	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
281	Mediterranean	1	446	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Chef		t	t		\N		f	f
282	Italian	1	447	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Chef		t	t		\N		f	f
283	French	1	448	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Chef		t	t		\N		f	f
284	Asian	1	449	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Chef		t	t		\N		f	f
285	Latin American	1	450	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Chef		t	t		\N		f	f
286	Artificial Grass / Astro Turf 	1	451	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
287	Brick / Block Paving	1	452	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
288	Garden Clearance	1	453	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
289	Garden Design\t	1	454	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
290	Garden Maintenance 	1	455	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
291	Garden Shed / Playhouse 	1	456	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
292	Garden Wall	1	457	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
293	Landscaping	1	458	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
294	Lawn Care Services – Grass Cutting / Turfing / Seeding	1	459	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
295	Planting	1	460	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
296	Pond & Water Feature	1	461	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
297	Repeat Garden Maintenance	1	462	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
298	Soil Irrigation / Drainage	1	463	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
299	Stone / Concrete Paving	1	464	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
300	Tree Surgery / Consultancy	1	465	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
301	Wooden / Metal / Wire Fences	1	466	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
302	Wooden / Metal Gates	1	467	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
303	Wooden Decking 	1	468	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Gardener / Landscape Gardener		t	t		\N		f	f
304	Blacksmith / Metal Worker	1	469	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
305	Decorative Ironmongery and Metalwork	1	470	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N		f	f
306	Metal Kitchen Worktops	1	471	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N		f	f
307	Metal Staircases 	1	472	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N		f	f
308	Security Fencing	1	473	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N		f	f
309	Security Gates and Bollard	1	474	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N		f	f
310	Security Grill	1	475	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N		f	f
311	Wooden / Metal / Wire Fences 	1	476	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N		f	f
312	Zinc / Metal Roof 	1	477	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Blacksmith / Metal Worker		t	t		\N		f	f
313	Bricklayer	1	478	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
314	Chimney Building / Repair 	1	479	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
315	Garden Wall 	1	480	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
316	Pizza Oven 	1	481	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Bricklayer		t	t		\N		f	f
317	Pointing / Repointing	1	482	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Bricklayer		t	t		\N		f	f
318	Stonework / Stone Cladding	1	483	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
319	Aerial & Satellite Dish Installation	1	484	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Electrician 		t	t		\N		f	f
320	"Burglar	1	485	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Security & Intruder Alarm Installation"	Electrician 				t	t		\N		f	f
321	CCTV Installation	1	486	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Electrician 		t	t		\N		f	f
322	Digital Home Network	1	487	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Electrician 		t	t		\N		f	f
323	Sound & Audio Visual Installation	1	488	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Electrician 		t	t		\N		f	f
325	Deep Tissue Massage	1	490	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N		f	f
326	Swedish Massage	1	491	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N		f	f
327	Therapeutic Massage	1	492	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N		f	f
328	Thai Massage	1	493	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N		f	f
329	Aromatherapy Massage	1	494	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N		f	f
330	Hot Stone Massage	1	495	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Massage Therapist		t	t		\N		f	f
331	Face	1	496	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
332	Body	1	497	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
333	Nails	1	498	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
334	Manicure	1	499	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
335	Pedicure 	1	500	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
336	Nail or Gel Polish Removal	1	501	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
337	Gel Nails Manicure	1	502	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
338	Gel Nails Pedicure	1	503	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
339	"Acrylic	1	504	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Hard Gel & Nail Extensions"	Beautician				t	t		\N		f	f
340	Classic Facials	1	505	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
341	Eyelash Extensions	1	506	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
342	Eyebrow and Eyelash Tinting	1	507	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
343	Eyebrow Threading 	1	508	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
344	Eyebrow Waxing	1	509	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
345	Definition Brows	1	510	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
346	Spray Tanning and Sunless Tanning	1	511	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
347	Body Exfoliation Treatments	1	512	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
348	Body Wraps	1	513	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
349	Colonic Hydrotherapy	1	514	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
350	Cryolipolysis	1	515	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
351	Cellulite Treatments	1	516	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
352	Hair Removal	1	517	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
353	Ladies’ Waxing	1	518	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
354	Hollywood Waxing	1	519	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
355	Brazilian Waxing	1	520	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
356	Mens’ Waxing	1	521	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
357	Facial Threading	1	522	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
358	Laser Hair Removal 	1	523	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Beautician		t	t		\N		f	f
359	Haircut	1	524	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Hair Stylist		t	t		\N		f	f
360	Colouring	1	525	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Hair Stylist		t	t		\N		f	f
361	Blow Dry	1	526	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Hair Stylist		t	t		\N		f	f
362	Brazilian Blow Dry	1	527	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Hair Stylist		t	t		\N		f	f
363	Men’s Haircut	1	528	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Barber		t	t		\N		f	f
364	Beard Trims and Shaves	1	529	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Barber		t	t		\N		f	f
365	Errand Runner	1	530	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
366	Fashion and Textile Designer 	1	531	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
367	Decorative Cornicing / Plasterwork	1	532	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator 		t	t		\N		f	f
368	Dry Lining & Plasterboard – Installation 	1	533	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
369	Dry Lining & Plasterboard – Repair	1	534	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
370	External Wall Insulation 	1	535	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator 		t	t		\N		f	f
371	Internal Rendering	1	536	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator 		t	t		\N		f	f
372	Pebble Dashing	1	537	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
373	Plaster Skimming	1	538	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator 		t	t		\N		f	f
374	Polished / Other Plaster Finish	1	539	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
375	Screeding	1	540	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
376	Standing Coving	1	541	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
377	Plane and Pilot	1	542	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
378	Gas / Heating Engineer	1	543	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
379	Electric Boiler – Installation 	1	544	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
380	Electric Boiler – Service / Repair	1	545	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
381	Gas Boiler – Installation 	1	546	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
382	Gas Boiler – Service / Repair 	1	547	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
383	Gas Cooker / Hob – Installation 	1	548	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
384	Gas Cooker / Hob – Repair	1	549	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
385	Gas Fire 	1	550	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
386	Heat Pump (Air Source / Ground Source)	1	551	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
387	Hot Water Tank / Appliance Tank Thermostats	1	552	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
388	Oil-Fired Boiler	1	553	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
389	Solar Panel Installation  	1	554	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
390	Water Underfloor Heating	1	555	2022-03-04 12:18:08	2022-03-04 12:18:08	red						t	t		\N		f	f
391	Drainage Specialist 	1	556	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
393	Septic Tanks – Installation / Emptying / Cleaning	1	558	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
394	Carpet Fitters	1	559	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
395	Electric Underfloor Heating 	1	560	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
396	External Tiling	1	561	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
397	Floor Sanding & Finishing 	1	562	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
398	Floor Tiling	1	563	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
399	Laminate Flooring 	1	564	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
400	Linoleum Flooring	1	565	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
401	Plastic / Rubber Flooring	1	566	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
402	Polished Concrete	1	567	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
403	Screeding 	1	568	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
404	Solid Wood Flooring	1	569	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
405	Stone / Concrete Paving 	1	570	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
406	Vinyl Flooring	1	571	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
407	Water Underfloor Heating  	1	572	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
408	Wooden Decking  	1	573	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
409	Brick / Block Paving 	1	574	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
410	Concrete Driveway	1	575	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
411	Resin Driveway	1	576	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
412	Tarmac Driveway	1	577	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Builder		t	t		\N		f	f
413	Bath Resurfacing	1	578	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
414	Bathroom Design	1	579	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
415	Bathroom Installation	1	580	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
416	Bathroom Repair	1	581	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
417	Bathroom Tiling	1	582	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
418	Complete Bathroom Refurbishment	1	583	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
419	Wet Room Installation	1	584	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Decorator		t	t		\N		f	f
420	Dog Trainer 	1	585	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N		f	f
421	Dog Walking (in your neighbourhood)	1	586	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N		f	f
422	Dog Boarding (in the sitter's home)	1	587	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N		f	f
423	Dog House Sitting (in your home)	1	588	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N		f	f
424	Dog Drop-In Visits (visits in your home)	1	589	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N		f	f
425	Doggy Day Care (in the sitter's home)	1	590	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N		f	f
426	Cat Boarding (in the sitter's home) 	1	591	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N		f	f
427	Cat House Sitting (in your home) 	1	592	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N		f	f
428	Drop-In Visits (visits in your home) 	1	593	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Pet Specialist		t	t		\N		f	f
429	Braille Translation	1	594	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
430	Certified Translations	1	595	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
431	Contract Translation	1	596	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
432	Financial Translation	1	597	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
433	Legal Translation	1	598	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
434	Medical Translation	1	599	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
435	Patent Translation	1	600	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
436	Pharmaceutical Translation	1	601	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
437	Technical Translation	1	602	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
438	Website Translation	1	603	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
439	Subtitling Services	1	604	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Translator		t	t		\N		f	f
440	Chatbot Scripts	1	605	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N		f	f
441	Marketing Materials	1	606	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N		f	f
442	Claims	1	607	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N		f	f
443	Crisis Communications	1	608	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N		f	f
444	Pack Copy and Product	1	609	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N		f	f
445	Social Media Content	1	610	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N		f	f
446	Speeches and Presentations	1	611	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N		f	f
447	UX Writing	1	612	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N		f	f
448	Video Scripts	1	613	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N		f	f
449	Web Copy	1	614	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Writer		t	t		\N		f	f
450	"Whitepapers	1	615	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Articles			 Blogs"	Writer	t	t		\N		f	f
451	Anniversary	1	616	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N		f	f
452	Baby Shower	1	617	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N		f	f
453	Birthday Party	1	618	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N		f	f
454	Bridal Shower	1	619	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N		f	f
455	Celebration	1	620	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N		f	f
456	Christmas Party	1	621	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N		f	f
457	Corporate Function	1	622	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N		f	f
458	Engagement 	1	623	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N		f	f
459	Father's Day	1	624	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Magician		t	t		\N		f	f
461	Contactless Prescription Pick-up & Delivery	1	626	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N		f	f
462	Drop Off Donations	1	627	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N		f	f
463	Run Errands	1	628	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N		f	f
465	 Delivery Service	1	630	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N		f	f
466	Disinfecting Services	1	631	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N		f	f
467	"Celebrity Speakers	1	632	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Hosts & Facilitators"	Celebrity				t	t		\N		f	f
468	Celebrity Chefs and Bakers	1	633	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N		f	f
469	TV Presenters	1	634	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N		f	f
470	TV Personalities	1	635	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N		f	f
471	Celebrity Comedians 	1	636	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N		f	f
472	Famous Music Acts	1	637	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N		f	f
473	Famous DJs	1	638	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N		f	f
474	Famous Stage Acts	1	639	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N		f	f
475	TV Talent Show Acts	1	640	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Celebrity		t	t		\N		f	f
476	House Removals	1	641	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
477	Man with a Van	1	642	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
478	Furniture Removal	1	643	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
479	Sofa Removal	1	644	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
480	Packing and Moving Services	1	645	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
481	Unpacking Services	1	646	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
482	Heavy Lifting	1	647	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
483	Move Furniture Up/Downstairs	1	648	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
484	Deliver Big Piece of Furniture	1	649	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
485	Removal Services	1	650	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
486	Rubbish Removal	1	651	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
487	Pool Table Mover	1	652	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Mover		t	t		\N		f	f
489	Personal Shopping	1	654	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Personal Stylist		t	t		\N		f	f
490	Wardrobe Editing	1	655	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Personal Stylist		t	t		\N		f	f
491	"Style	1	656	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Shape and Colour Consultation"	Personal Stylist				t	t		\N		f	f
492	Occasion Dressing	1	657	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Personal Stylist		t	t		\N		f	f
493	Home Styling	1	658	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N		f	f
494	Outdoor Styling	1	659	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N		f	f
495	Decluttering & Storage	1	660	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N		f	f
496	Space Planning & Moodboards	1	661	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N		f	f
497	Virtual Styling	1	662	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N		f	f
498	Staging	1	663	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N		f	f
499	Custom Designs	1	664	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Home Stylist		t	t		\N		f	f
500	Emergency 24h Locksmith	1	665	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N		f	f
501	New Lock Installation	1	666	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N		f	f
502	Lock Repairs	1	667	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N		f	f
503	Key Cutting	1	668	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N		f	f
504	Car Locksmith	1	669	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N		f	f
505	Security and Protection	1	670	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Locksmith		t	t		\N		f	f
506	Knowledge Base 2	1	671	2022-03-04 12:18:08	2022-03-04 12:18:08	red				2		t	t		\N		f	f
507	Knowledge Base 3	1	672	2022-03-04 12:18:08	2022-03-04 12:18:08	red				3		t	t		\N		f	f
508	Private Jet Pilot	1	673	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plane and Pilot		t	t		\N		f	f
509	Single Engine Helicopter Pilot	1	674	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plane and Pilot		t	t		\N		f	f
510	Twin Engine Helicopter Pilot	1	675	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plane and Pilot		t	t		\N		f	f
511	Bookkeeping	1	676	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N		f	f
512	Chartered Accounting	1	677	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N		f	f
513	Tax Accounting	1	678	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N		f	f
514	Financial Controller Services	1	679	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N		f	f
515	Accounting Audit	1	680	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N		f	f
516	Forensic Accounting	1	681	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Accountant		t	t		\N		f	f
517	Textile and Fabric Consultancy	1	682	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
518	Fashion Design Consultancy	1	683	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
519	Apparel Designing	1	684	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
520	Trend / Mood Boards	1	685	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
521	Trim / Finding / Hangtag / Label design	1	686	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
522	Tech sketches	1	687	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
523	Pattern Drafting	1	688	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
524	Sourcing Services	1	689	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
525	Textile Repeats / Specs	1	690	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
526	Full collection design	1	691	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
528	Merchandising	1	693	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
529	Catalog Layout	1	694	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
530	Spec / Grading	1	695	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
531	Photo Shoot Art Direction / Management	1	696	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
532	Branding	1	697	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
533	Seasonal and Line Planning	1	698	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
534	Cutting Services	1	699	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N		f	f
535	Plate bending and other services	1	700	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N		f	f
536	Polishing and brushing services	1	701	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N		f	f
537	Shielded Metal Arc Welding	1	702	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N		f	f
538	Gas Metal Arc Welding	1	703	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N		f	f
539	Gas Tungsten Arc Welding	1	704	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N		f	f
540	Flux Cored Arc Welding	1	705	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N		f	f
541	Submerged Arc Welding	1	706	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Welder		t	t		\N		f	f
542	Marriage and Family Counsellor	1	707	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
543	Addiction therapist	1	708	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
544	Behavioural Therapist	1	709	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
545	Divorce Therapist	1	710	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
546	Child Therapist	1	711	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
547	Clinical Therapist	1	712	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
548	Cognitive Therapist	1	713	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
549	Cognitive-Behavioural Therapist	1	714	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
550	Eating Disorder Therapist	1	715	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
551	Exercise Therapist	1	716	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
552	Youth Therapist	1	717	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
553	Trauma Therapist	1	718	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
554	Nutritional Therapist	1	719	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
555	Psychodynamic Therapist	1	720	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
556	Dialectical Behaviour Therapist	1	721	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Therapist		t	t		\N		f	f
557	Knowledge Base 4	1	722	2022-03-04 12:18:08	2022-03-04 12:18:08	red				4		t	t		\N		f	f
558	Beatboxer	1	723	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
559	Country Music Artist	1	724	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
560	Indie & Electronic Artists	1	725	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
561	"Jazz	1	726	2022-03-04 12:18:08	2022-03-04 12:18:08	red	 Swing & Blues Artists"	Musicians and Bands				t	t		\N		f	f
562	Opera Singers & Classical Musicians	1	727	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
563	Pop Artists	1	728	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
564	Rappers	1	729	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
565	Rock Artists	1	730	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
566	Singers	1	731	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
567	Soul & Disco Artists	1	732	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
568	Urban & Hip Hop Artists	1	733	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
569	DJs	1	734	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
570	Pop Groups & Bands	1	735	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Musicians and Bands		t	t		\N		f	f
571	Anniversary 	1	736	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
572	Birthday	1	737	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
573	Bar Mitzvah / Bat Mitzvah	1	738	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
574	Civil Partnership	1	739	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
575	Charity Event	1	740	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
576	Civil Partnership 	1	741	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
577	Corporate Event	1	742	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
578	Exhibition / Trade Fair	1	743	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
579	Hotel / Restaurant Event	1	744	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
580	Exhibition / Trade Fair 	1	745	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
581	Hotel / Restaurant Event 	1	746	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
582	Festival / Outdoor Event 	1	747	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
583	Funeral	1	748	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
584	Holiday Camp / Cruise Ship	1	749	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
585	HM Forces / Army / Navy / RAF Event	1	750	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
586	Regatta / Sporting Event	1	751	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
587	University Event	1	752	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
588	Venue / Pub / Club Event 	1	753	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
589	Private Party	1	754	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
590	Painter	1	755	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
591	Other Event Type	1	756	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Lookalike		t	t		\N		f	f
592	Sculptor	1	757	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
593	Jeweller	1	758	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
53	Mechanic 	1	218	2022-03-04 12:18:08	2022-03-04 12:18:08	red	https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/business.bbdf319.svg			-1		t	t		\N		f	f
122	Fitted Bedrooms / Wardrobes	1	287	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Carpenter		t	t		\N		f	f
190	Writing & Copywriting Guides	1	355	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Business guides		t	t		\N		f	f
258	Wills and Trusts	1	423	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Law Practitioner 		t	t		\N		f	f
324	Aerial Installation 	1	489	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Electrician 		t	t		\N		f	f
392	Drains – Installation / Unblocking / Cleaning 	1	557	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Plumber		t	t		\N		f	f
460	Contactless Pick-up & Delivery	1	625	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Errand Runner		t	t		\N		f	f
488	Personal Branding	1	653	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Personal Stylist		t	t		\N		f	f
527	Color Direction	1	692	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Fashion and Textile Designer		t	t		\N		f	f
595	Grafitti Artist	1	760	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
596	Drawer	1	761	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
597	Ceramicist	1	762	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
598	Drawer 	1	763	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
599	Illustrator	1	764	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
600	Poet	1	765	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
601	Auditory Artist	1	766	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
602	Musical Composer	1	767	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
603	Performing Artist	1	768	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
604	Collage Artist	1	769	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
605	Fine Art Photographer 	1	770	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
606	Video Artist 	1	771	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
607	Installation Artist	1	772	2022-03-04 12:18:08	2022-03-04 12:18:08	red				Artist		t	t		\N		f	f
608	Graphic Designer	1	773	2022-03-07 13:00:42	2022-03-07 13:00:42	red	http://77.68.102.60:1000/download?filename=logo1.JPG	Title	Footer	meta,graphic,designer	[{"title":"STYLE","description":"Select your logo style","type":"checkbox","required":"","placeholder":"","defaultvalue":"","inputs":[{"value":"3D"},{"value":"Vintage"},{"value":"Hand-drawn"},{"value":"Cartoon"},{"value":"Watercolor"},{"value":"Signature"},{"value":"Lettering"}]}]	t	t	Public	\N		f	f
610	LOGO DESIGN	1	775	2022-03-07 13:09:09	2022-03-07 13:09:09	red	http://77.68.102.60:1000/download?filename=preview.png	LOGO DESIGN TAG	LOGO DESIGN FOOTER	LOGO DESIGN KEYWORDS	LOGO DESIGN DESCRIPTION	t	t	Public	\N		f	f
611	Artist	1	776	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N		f	f
609	Graphic Designer	1	774	2022-02-23 00:00:00	2022-03-07 00:00:00	blue	http://77.68.102.60:1000/download?filename=preview.png	Title Graphic Design	Graphic Design Footer	Graphic Design Keywords	[{"title":"STYLE","description":"desc","type":"checkbox","required":"","placeholder":"","defaultvalue":"","inputs":[{"value":"3D"},{"value":"Logo"}]}]	t	t	Public	\N		f	f
612	SERVICE CATEGORY 001	7	777	2022-03-07 15:25:22	2022-03-07 15:25:22	red		SERVICE CATEGORY 001	SERVICE CATEGORY 001	SERVICE CATEGORY 001	[{"title":"asd","description":"desc","type":"checkbox","required":"","placeholder":"","defaultvalue":"","inputs":[{"value":"AS"}]}]	t	t	Public	\N		f	f
614	C-SERVICES CAT-01	8	779	2022-03-10 13:23:26	2022-03-10 13:23:26	red		T	F	K		t	t	Public	\N		f	f
615	C-SERVICES CAT-01	8	780	2022-03-10 13:25:09	2022-03-10 13:25:09	red		C-SERVICES CAT-01	C-SERVICES CAT-01	C-SERVICES CAT-01		t	t	Public	\N		f	f
616	C-01-CATGEORY SERVICES 01	8	781	2022-03-10 13:28:31	2022-03-10 13:28:31	red		T	F	K		t	t	Public	\N		f	f
613	P-SERVICES CAT 01	8	778	2022-03-10 13:20:36	2022-03-10 13:20:36	red	http://77.68.102.60:1000/download?filename=logo1.JPG	P-SERVICES CAT 01	P-SERVICES CAT 01	P-SERVICES CAT 01	[{"title":"Graphic Design","description":"Choose Your Graphic Designer Tool","type":"checkbox","required":"","placeholder":"","defaultvalue":"","inputs":[{"value":"Photoshop"},{"value":"Illustrator"},{"value":"Adobe"}]}]	t	t	Public	\N		f	f
618	C-SERVICES  CAT 01	8	783	2022-03-10 14:09:39	2022-03-10 14:09:39	red		TT	F	KK		t	t	Public	\N		f	f
619	Artist	1	784	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N		f	f
620	cat 2	1	785	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N		f	f
621	sub of cat 2	1	786	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N		f	f
622	UPS install	1	787	2022-03-10 14:23:22	2022-03-10 14:23:22	red		TT	F	K		t	t	Public	\N		f	f
623	C-services-kb 001	8	788	2022-03-10 14:28:52	2022-03-10 14:28:52	red		TT	F			t	t	Public	\N		f	f
617	P-SERVICES KB 01	8	782	2022-03-10 14:07:56	2022-03-10 14:07:56	red		TT	F	K	[{"title":"Grsphic categories","description":"Select Graphic designing tool","type":"checkbox","required":"","placeholder":"","defaultvalue":"","inputs":[{"value":"Adobe photoshop"},{"value":"Adobe Xd"}]}]	t	t	Public	\N		f	f
624	Artist	1	789	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N		f	f
625	sub of cat 2	1	791	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N		f	f
626	cat 2	1	790	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N		f	f
627	Artist	1	792	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N		f	f
628	sub of cat 2	1	794	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	f		\N		f	f
630	Front Page	1	795	2022-03-14 16:11:29	2022-03-14 16:11:29	red		Title Front Page	Footer	Front Page		t	t	Public	\N		f	f
631	Front Page KB 01	1	796	2022-03-15 15:32:40	2022-03-15 15:32:40	red						t	t	Public	\N		f	f
632	Front Page Category 01	1	797	2022-03-15 15:41:52	2022-03-15 15:41:52	red						t	t	Public	\N		f	f
633	Front Page Category 01	1	798	2022-03-15 17:15:06	2022-03-15 17:15:06	red						t	t	Public	\N		f	f
634	Front Page Category 001	1	799	2022-03-15 17:18:45	2022-03-15 17:18:45	red						t	t	Public	\N		f	f
635	front page kb	1	800	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	t		\N		f	f
636	Front Page KB	1	801	2022-03-16 13:49:06	2022-03-16 13:49:06	red						t	t	Public	\N		f	f
638	Front Page KB 03	1	803	2022-03-16 14:20:01	2022-03-16 14:20:01	red						t	f	Public	\N		f	f
639	Front Page KB 04	1	804	2022-03-16 14:20:52	2022-03-16 14:20:52	red						t	f	Public	\N		f	f
644	Front Page KB 01	1	809	2022-03-17 18:16:34	2022-03-17 18:16:34	red						t	t	Public	\N		f	f
645	Front Page KB	1	810	2022-03-17 18:17:48	2022-03-17 18:17:48	red						t	t	Public	\N		f	f
656	Child od Category 001	2	820	2022-03-19 11:50:14	2022-03-19 11:50:14	red		Child od Category 001	Child od Category 001	Child od Category 001		t	t	Public	\N	Group No 02	f	f
28	Category 002 (Bulgarian (Български))	2	37	2022-02-25 14:54:34	2022-02-25 14:54:34	red	http://77.68.102.60:1000/download?filename=FE-LogoFinal-Trans.png	TT	Footer	Keywords	Meta Description	t	t	Public	{"knowledge_base_id":66,"parent_id":null,"category_id":null,"category_icon":"","position":1,"created_at":"2022-03-03","updated_at":"2022-03-03","schedule_at":null,"publish_now":true,"name":"test category","title_tag":"","footer":"","keywords":"","meta_description":"","permission":"","active":true,"group_id":1,"kb_locale_id":1}		f	t
657	Services Group Categroy 001	8	821	2022-03-19 12:26:27	2022-03-19 12:26:27	red					[{"title":"Title","description":"Desc","type":"checkbox","required":"","placeholder":"Placeholder","defaultvalue":"12","inputs":[{"value":"Value 01"},{"value":"Value 02"}]}]	t	t	Public	\N	Service	f	f
658	Front Page	8	822	2022-03-19 13:08:07	2022-03-19 13:08:07	red	http://77.68.102.60:1000/download?filename=friendlygig-02.png					t	t	Public	\N	Website	f	f
653	Schedule Cat 00001	1	818	2022-03-18 14:53:07	2022-03-18 14:53:07	red		TT	FF	KEY WORDS		t	t	Public	{"id":653,"category_id":818,"knowledge_base_id":"71","name":"Schedule Cat 00001","parent_id":-1,"title_tag":"TT","footer":"FF","keywords":"KEY WORDS","schedule_at":"2022-03-24T11:11:00+05:00","meta_description":"","permission":"Public","category_icon":"","position":-1,"active":true,"publish_now":false,"kb_locale_id":1,"group_name":"Group 001"}	Group 001	f	t
654	Schedule Czeh (CesKy) 001	3	818	2022-03-18 14:56:02	2022-03-18 14:56:02	red	http://77.68.102.60:1000/download?filename=friendlygig-02.png	TT	FF	KK		t	t	Public		Group 001	f	f
659	Section 01	8	823	2022-03-19 13:11:23	2022-03-19 13:11:23	red	http://77.68.102.60:1000/download?filename=friendlygig-02.png					t	t	Public	\N	Website	f	f
655	Categroy 01	2	819	2022-03-19 11:47:51	2022-03-19 11:47:51	red		Categroy 01	Categroy 01	Categroy 01		t	t	Public	{"id":655,"category_id":819,"knowledge_base_id":"72","name":"Categroy 01","parent_id":-1,"title_tag":"Categroy 01","footer":"Categroy 01","keywords":"Categroy 01","schedule_at":"2022-03-29T11:11:00+05:00","meta_description":"","permission":"Public","category_icon":"","position":-1,"active":true,"publish_now":false,"kb_locale_id":2,"group_name":"Group No 01"}	Group No 01	f	t
660	Front Page	1	824	2022-03-19 13:29:33	2022-03-19 13:29:33	red						t	t	Public	\N	Website	f	f
661	Section 2	8	825	2022-03-19 13:32:26	2022-03-19 13:32:26	red						t	t	Public	\N	Website	f	f
662	Contact Page	8	826	2022-03-19 13:36:07	2022-03-19 13:36:07	red						t	t	Public	\N	Website	f	f
663	Section 01	8	827	2022-03-19 13:36:32	2022-03-19 13:36:32	red						t	t	Public	\N	Website	f	f
664	Section 01	8	828	2022-03-19 15:19:40	2022-03-19 15:19:40	red						t	t	Public	\N	Website	f	f
665	Section 01	8	829	2022-03-19 15:24:58	2022-03-19 15:24:58	red						t	t	Public	\N	Website	f	f
666	Section 01	8	830	2022-03-19 15:47:39	2022-03-19 15:47:39	red					{"title":"A whole world of freelance talent at your fingertips","description":"Find high-quality services at every price point. No hourly rates, just project-based pricing.","image":"http://77.68.102.60:1000/download?filename=friendlygig-02.png","listData":[{"title":"The best for every budget","description":"Find high-quality services at every price point. No hourly rates, just project-based pricing.","image":"http://77.68.102.60:1000/download?filename=e37ae023-3d69-411b-99d9-b70150e861d0.jpeg"}]}	t	t	Public	\N	Website	f	f
464	Graphic Designer	1	793	2022-02-23 00:00:00	2022-03-07 00:00:00	blue	http://77.68.102.60:1000/download?filename=preview.png	Title Graphic Design	Graphic Design Footer	Graphic Design Keywords		t	t	Public	\N	front	f	f
629	Graphic Designer	1	793	2022-02-23 00:00:00	2022-03-07 00:00:00	blue	http://77.68.102.60:1000/download?filename=preview.png	Title Graphic Design	Graphic Design Footer	Graphic Design Keywords		t	t	Public	{"knowledge_base_id":66,"parent_id":null,"category_id":null,"category_icon":"","position":1,"created_at":"2022-03-03","updated_at":"2022-03-03","schedule_at":null,"publish_now":true,"name":"test category","title_tag":"","footer":"","keywords":"","meta_description":"","permission":"","active":true,"group_id":1,"kb_locale_id":1}	front	f	t
667	test category	1	793	2022-03-03 00:00:00	2022-03-03 00:00:00	red						t	t		\N	front page	f	f
679	Section 002	8	844	2022-03-21 12:17:12	2022-03-21 12:17:12	red					{"title":"Title","description":"Description","image":"http://77.68.102.60:1000/download?filename=logo1.JPG","listData":[{"title":"List title","description":"Description","image":"http://77.68.102.60:1000/download?filename=e37ae023-3d69-411b-99d9-b70150e861d0.jpeg"}]}	t	t	Public	\N	Website	f	f
668	Section 000001	1	833	2022-03-19 16:13:46	2022-03-19 16:13:46	red	http://77.68.102.60:1000/download?filename=e37ae023-3d69-411b-99d9-b70150e861d0.jpeg					t	t	Public	\N		f	f
669	Section 0001	8	834	2022-03-19 16:14:35	2022-03-19 16:14:35	red					{"title":"TITLE","description":"DESC","image":"","listData":[{"title":"TITLE","description":"DESC","image":""}]}	t	t	Public	\N	Website	f	f
685	Section 03	8	850	2022-03-21 15:21:07	2022-03-21 15:21:07	red					{"title":"Explore the marketplace","description":"","image":"","listData":[{"title":"Kay Kim, Co-Founder","description":"\\"It's extremely exciting that Friendly Squad has freelancers from all over the world — it broadens the talent pool. One of the best things about Friendly Squad is that while we're sleeping, someone's working.\\"","image":"http://77.68.102.60:1000/download?filename=d3d5ef00-0bdf-446e-80e2-024c7f417093.jpeg"},{"title":" Tim and Dan Joo, Co-Founders ","description":"\\"When you want to create a business bigger than yourself, you need a lot of help. That's what Friendly Squad does.\\"","image":"http://77.68.102.60:1000/download?filename=IMG_1592.JPG"}]}	t	t	Public	\N	Website	f	f
686	Study soooo hard	21	851	2022-03-21 18:10:02	2022-03-21 18:10:02	red			Will get thre with full strenth 			t	f	Public	\N		f	f
687	Decorator	1	852	2022-03-22 14:45:06	2022-03-22 14:45:06	red						t	t	Public	\N	Front Page KB	f	f
688	Tiling	1	853	2022-03-22 14:45:25	2022-03-22 14:45:25	red						t	t	Public	\N	Front Page KB	f	f
689	Water under Floor Heating	1	854	2022-03-22 14:45:46	2022-03-22 14:45:46	red						t	t	Public	\N	Front Page KB	f	f
671	Section 01	8	836	2022-03-21 11:17:28	2022-03-21 11:17:28	red					{"title":"Title","description":"Description","image":"","listData":[{"title":"List","description":"Desc","image":""}]}	t	t	Public	\N	Website	f	f
672	Section 01	8	837	2022-03-21 11:25:43	2022-03-21 11:25:43	red					{"title":"Title","description":"Description","image":"","listData":[{"title":"List title","description":"Description","image":""}]}	t	t	Public	\N	Website	f	f
673	Sub Category 01	8	838	2022-03-21 11:28:32	2022-03-21 11:28:32	red						t	t	Public	\N	Front Page KB	f	f
674	Sub Category 02	8	839	2022-03-21 11:28:49	2022-03-21 11:28:49	red						t	t	Public	\N	Front Page KB	f	f
675	Sub Category 03	8	840	2022-03-21 11:29:01	2022-03-21 11:29:01	red						t	t	Public	\N	Front Page KB	f	f
677	Section 01	8	842	2022-03-21 12:10:47	2022-03-21 12:10:47	red					{"title":"A whole world of freelance talent at your fingertips","description":"","image":"http://77.68.102.60:1000/download?filename=3e5a638d-7e67-4b3b-9738-a6e0b64d6293.jpeg","listData":[{"title":"The best for every budget","description":"Find high-quality services at every price point. No hourly rates, just project-based pricing.","image":"http://77.68.102.60:1000/download?filename=e37ae023-3d69-411b-99d9-b70150e861d0.jpeg"},{"title":"Quality work done quickly","description":"Find the right freelancer to begin working on your project within minutes.","image":""}]}	t	t	Public	\N	Website	f	f
678	Section 001	8	843	2022-03-21 12:16:58	2022-03-21 12:16:58	red					{"title":"Title","description":"Desc","image":"","listData":[{"title":"List Data","description":"Desc","image":""}]}	t	t	Public	\N	Website	f	f
670	Test category	8	835	2022-02-23 00:00:00	2022-03-10 00:00:00	red	http://77.68.102.60:1000/download?filename=preview.png					t	t		\N	dan	f	f
680	Section 001	1	845	2022-03-21 12:34:35	2022-03-21 12:34:35	red					{"title":"Title","description":"Desc","image":"","listData":[{"title":"List title","description":"Desc","image":""}]}	t	t	Public	\N	Website	f	f
676	Test category	8	841	2022-02-23 00:00:00	2022-03-10 00:00:00	red	http://77.68.102.60:1000/download?filename=preview.png					t	t		\N	dan	f	f
681	Section 001	1	846	2022-03-21 13:06:17	2022-03-21 13:06:17	red					{"title":"Title","description":"Description","image":"","listData":[{"title":"List title","description":"Description","image":""}]}	t	t	Public	\N	Website	f	f
682	Section 001	1	847	2022-03-21 13:07:40	2022-03-21 13:07:40	red					{"title":"Title","description":"Description","image":"","listData":[{"title":"List title","description":"Description","image":""}]}	t	t	Public	\N	Website	f	f
683	Section 01	1	848	2022-03-21 13:18:07	2022-03-21 13:18:07	red						t	t	Public	\N	Website	f	f
684	Section 001	1	849	2022-03-21 13:18:31	2022-03-21 13:18:31	red						t	t	Public	\N	Website	f	f
690	babe	7	855	2022-03-22 18:52:20	2022-03-22 18:52:20	red		p				t	t	Public	\N		f	f
\.


--
-- Data for Name: knowledge_base_locales; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.knowledge_base_locales (id, knowledge_base_id, system_locale_id, primary_, created_at, updated_at) FROM stdin;
1	1	2	f	2022-02-15 13:14:34.499638	2022-02-15 13:16:37
\.


--
-- Data for Name: knowledge_base_menu_items; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.knowledge_base_menu_items (id, kb_locale_id, location, "position", title, url, new_tab, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: knowledge_base_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_base_translations (id, knowledge_base_id, title, created_at, updated_at, footer_note, kb_locale_id, active) FROM stdin;
281	69	English (United States)	2022-03-16 11:20:53.682897	2022-03-16 11:20:53.682897		1	t
283	70	English (United States)	2022-03-16 13:42:26.583682	2022-03-16 13:42:26.583682		1	t
284	70	English (Great Britain)	2022-03-16 13:42:26.591097	2022-03-16 13:42:26.591097		8	f
285	39	English (United States)	2022-03-17 13:23:52.145301	2022-03-17 13:23:52.145301		1	t
291	71	English (United States)	2022-03-18 14:47:52.223652	2022-03-18 14:47:52.223652		1	t
292	71	Czech (Česky)	2022-03-18 14:47:52.224811	2022-03-18 14:47:52.224811		3	f
230	35	English (United States)	2022-03-03 16:31:53.045053	2022-03-03 16:31:53.045053		1	t
295	72	English (United States)	2022-03-19 11:42:50.505827	2022-03-19 11:42:50.505827		1	t
296	72	Bulgarian (Български)	2022-03-19 11:42:50.513645	2022-03-19 11:42:50.513645		2	f
298	73	Norsk bokmål	2022-03-21 18:18:10.704877	2022-03-21 18:18:10.704877		21	f
299	73	English (United States)	2022-03-21 18:18:10.70965	2022-03-21 18:18:10.70965		1	t
1	1	English (Great Britain)	2022-02-14 14:11:58.666772	2022-02-14 14:30:00		2	f
3	1	English (Canada)	2022-02-14 14:36:52.948796	2022-02-14 14:36:52.948796		1	f
4	8		2022-02-18 13:52:07.240286	2022-02-18 13:52:07.240286		1	f
5	8		2022-02-18 13:52:07.254196	2022-02-18 13:52:07.254196		2	f
6	8		2022-02-18 13:52:07.255772	2022-02-18 13:52:07.255772		3	f
10	12		2022-02-18 16:10:19.68883	2022-02-18 16:10:19.68883		1	f
11	12		2022-02-18 16:10:19.691744	2022-02-18 16:10:19.691744		2	f
12	12		2022-02-18 16:10:19.693625	2022-02-18 16:10:19.693625		3	f
263	66	English (United States)	2022-03-10 15:44:40.333634	2022-03-10 15:44:40.333634		1	t
265	67	English (United States)	2022-03-14 16:10:41.577253	2022-03-14 16:10:41.577253		1	t
\.


--
-- Data for Name: knowledge_bases; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.knowledge_bases (id, name, icon, footer, created_at, homepage_layout, category_layout, active, updated_at, front_page, "position") FROM stdin;
41	KB 005			2022-03-04 17:59:23.463178	No		f	2022-03-04 17:59:23.463178	false	5
40	KB 004			2022-03-04 17:59:07.358926	Yes		t	2022-03-04 17:59:07.358926	false	6
71	test db			2022-03-17 14:56:59.721886	No		t	2022-03-18 14:47:52	Group 001	7
42	KB 006			2022-03-04 17:59:35.813657	No		f	2022-03-04 17:59:35.813657	false	8
43	KB 007			2022-03-04 17:59:47.324954	No		f	2022-03-04 17:59:47.324954	false	9
44	KB 009			2022-03-04 17:59:58.289394	No		f	2022-03-04 17:59:58.289394	false	10
45	KB 0010			2022-03-04 18:00:11.085409	No		f	2022-03-04 18:00:11.085409	false	11
46	KB 0011			2022-03-04 18:00:22.771173	No		t	2022-03-04 18:00:22.771173	false	12
48	KB 0012			2022-03-04 18:00:58.814214	No		f	2022-03-04 18:00:58.814214	false	13
73	Ms		With Love	2022-03-21 18:08:41.63144	No		t	2022-03-21 18:18:10		14
50	FRONT PAGE			2022-03-05 14:30:08.683739	Yes		t	2022-03-05 14:30:08.683739	true	15
47	KB 0012			2022-03-04 18:00:45.500583	No		f	2022-03-04 18:00:45.500583	false	16
66	Import test			2022-03-10 15:44:40.331667			t	2022-03-10 15:44:40.331667	true	17
67	Website		Website	2022-03-14 16:10:41.539514	No		t	2022-03-14 16:10:41.539514	false	18
69	kb_name			2022-03-16 11:20:53.657218			t	2022-03-16 11:20:53.657218	front page kb, services, others	19
49	KB 0013			2022-03-04 18:01:12.139619	No		f	2022-03-04 18:01:12.139619	false	20
70	Service	http://77.68.102.60:1000/download?filename=preview.png	Footer	2022-03-16 13:12:19.70229	No		t	2022-03-16 13:42:26	Front Page KB,Website,Service,Forms	2
72	Add Group	http://77.68.102.60:1000/download?filename=friendlygig-02.png	Add group	2022-03-17 16:10:52.343226	No		t	2022-03-19 11:42:50	Group No 01,Group No 02,Group No 03	3
39	Professions	http://77.68.102.60:1000/download?filename=friendlygig-02.png	Footeras	2022-03-04 11:43:33.258726	Yes		t	2022-03-17 13:23:52	Front Page KB,Website,Service,Forms	4
\.


--
-- Data for Name: link_objects; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.link_objects (id, name, note, active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: link_types; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.link_types (id, name, note, active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: links; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.links (id, link_type_id, link_object_source_id, link_object_source_value, link_object_target_id, link_object_target_value, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: locales; Type: TABLE DATA; Schema: public; Owner: knowledgebase
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
-- Data for Name: mentions; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.mentions (id, mentionable_type, mentionable_id, user_id, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.permissions (id, permission_id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions_groups; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.permissions_groups (id, group_id, permission_id, created_at) FROM stdin;
\.


--
-- Data for Name: service_boundary_regions; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.service_boundary_regions (id, name, code, created_at) FROM stdin;
1	Scotland	SC	2022-02-16 12:14:29.568104
3	Northern Ireland	NI	2022-02-16 12:33:47.222552
4	North East	NE	2022-02-16 12:34:53.803994
5	North West	NW	2022-02-16 12:35:17.461705
6	East Midlands	EM	2022-02-16 12:35:36.741476
7	West Midlands	WM	2022-02-16 12:36:31.354395
8	Wales	W	2022-02-16 12:36:51.022625
9	South West	SW	2022-02-16 12:36:51.854422
10	South East	SE	2022-02-16 12:38:25.901925
11	Greater London	GL	2022-02-16 12:38:44.11399
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
2	1	Wick	http://77.68.102.60:9000/scotland/KW%20-%20Wick%20Postcode%20Map.svg	KW	2022-02-16 12:47:36.051465
3	1	Iverness	http://77.68.102.60:9000//scotland/IV%20-%20Inverness%20Postcode%20Map.svg	IV	2022-02-16 12:56:28.973907
4	1	Aberdeen	http://77.68.102.60:9000/scotland/AB%20-%20Aberdeen%20Postcode%20Map.svg	AB	2022-02-16 12:56:28.993772
5	1	Perth	http://77.68.102.60:9000/scotland/PH%20-%20Perth%20Postcode%20Map.svg	PH	2022-02-16 12:56:29.007835
6	1	Dundee	http://77.68.102.60:9000/scotland/DD%20-%20Dundee%20Postcode%20Map.svg	DD	2022-02-16 12:56:29.01865
7	1	Paisley	http://77.68.102.60:9000/scotland/PA%20-%20Paisley%20Postcode%20Map.svg	PA	2022-02-16 12:56:29.034786
8	1	Falkirk	http://77.68.102.60:9000/scotland/FK%20-%20Falkirk%20Postcode%20Map.svg	FK	2022-02-16 12:56:29.062749
9	1	Kirkaldy	http://77.68.102.60:9000/scotland/KY%20-%20Kircaldy%20Postcode%20Map.svg	KY	2022-02-16 12:56:29.079987
10	1	Glasgow	http://77.68.102.60:9000/scotland/G%20-%20Glasgow%20Postcode%20Map.svg	G	2022-02-16 12:56:29.082733
11	1	Kilmarnock	http://77.68.102.60:9000/scotland/KA%20-%20Kilmarnock%20Postcode%20Map.svg	KA	2022-02-16 12:56:29.084922
12	1	Motherwell	http://77.68.102.60:9000/scotland/ML%20-%20Motherwell%20Postcode%20District%20Map.svg	ML	2022-02-16 12:56:29.087574
13	1	Edinburgh	http://77.68.102.60:9000/scotland/EH%20-%20Edinburgh%204-Digit%20Postcode%20Area%20and%20District%20Map.svg	EH	2022-02-16 12:56:29.090651
14	1	Galashiels	http://77.68.102.60:9000/scotland/TD%20-%20Galashields%20Postcode%20Map.svg	TD	2022-02-16 12:56:29.093769
15	1	Dumfries	http://77.68.102.60:9000/scotland/DG%20-%20Dumfries%20Postcode%20Map.svg	DG	2022-02-16 12:56:29.096481
16	1	Harris	http://77.68.102.60:9000/scotland/HS%20-%20Isle%20of%20Harris%20Postcode%20Map.svg	HS	2022-02-16 12:56:29.099409
17	1	Shetland	http://77.68.102.60:9000/scotland/ZE%20-%20Shetland%20Postcode%20Map.svg	ZE	2022-02-16 12:56:29.102006
18	3	Belfast	http://77.68.102.60:9000/northern-ireland/belfast.svg	BT	2022-02-16 12:59:59.396099
\.


--
-- Data for Name: tag_items; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.tag_items (id, name, name_downcase, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tag_objects; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.tag_objects (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.tags (id, tag_item_id, tag_object_id, o_id, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ticket_article_flags; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.ticket_article_flags (id, ticket_article_id, key, value, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ticket_article_senders; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.ticket_article_senders (id, name, note, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ticket_article_types; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.ticket_article_types (id, name, note, communication, active, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ticket_articles; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.ticket_articles (id, ticket_id, type_id, sender_id, from_, to_, cc, subject, reply_to, message_id, message_id_md5, in_reply_to, content_type, references_, body, internal, preferences, updated_by_id, created_by_id, origin_by_id, created_at, updated_at) FROM stdin;
1	-1	-1	-1				My subject							I am a message!	f		-1	-1	-1	2022-02-22 14:40:08	2022-02-22 14:40:08
2	-1	-1	-1				My subject							I am a message!	f		-1	-1	-1	2022-02-22 14:44:51	2022-02-22 14:44:51
4	5	-1	-1				Call note					text/html		Called the customer and discussed their issues.<br/>Turns out these were caused by invalid configurations - solved.	f		-1	-1	-1	2022-02-22 16:05:54	2022-02-22 16:05:54
\.


--
-- Data for Name: ticket_counters; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.ticket_counters (id, content, generator) FROM stdin;
\.


--
-- Data for Name: ticket_flags; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.ticket_flags (id, ticket_id, key, value, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ticket_priorities; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.ticket_priorities (id, name, default_create, ui_icon, ui_color, note, active, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ticket_state_types; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.ticket_state_types (id, name, note, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ticket_states; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.ticket_states (id, state_type_id, name, next_state_id, ignore_escalation, default_create, default_follow_up, note, active, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
1	-1	small test	1	f	t	t		t	-1	-1	2022-02-21 15:38:21	2022-02-21 15:38:21
2	-1	ticket state name	1	f	t	t		t	-1	-1	2022-02-21 15:42:50	2022-02-21 15:42:50
3	2	in progress	1	t	t	t		t	-1	-1	2022-02-22 17:38:46	2022-02-22 17:38:46
\.


--
-- Data for Name: ticket_time_accountings; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.ticket_time_accountings (id, ticket_id, ticket_article_id, time_unit, created_by_id, created_at, updated_at) FROM stdin;
1	1	2	3.00	-1	2022-02-21 15:30:28	2022-02-21 15:30:28
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.tickets (id, group_id, priority_id, state_id, organization_id, number, title, owner_id, customer_id, note, first_response_at, first_response_escalation_at, first_response_in_min, first_response_diff_in_min, close_at, close_escalation_at, close_in_min, close_diff_in_min, update_escalation_at, update_in_min, update_diff_in_min, last_contact_at, last_contact_agent_at, last_contact_customer_at, last_owner_update_at, create_article_article_type_id, create_article_sender_id, article_count, escalation_at, pending_time, type, time_unit, preferences, updated_by_id, created_by_id, created_at, updated_at) FROM stdin;
1	-1	-1	-1	-1	-1	Test ticket	-1	-1		2022-02-21 15:14:16	2022-02-21 15:14:16	-1	-1	2022-02-21 15:14:16	2022-02-21 15:14:16	-1	-1	2022-02-21 15:14:16	-1	-1	2022-02-21 15:14:16	2022-02-21 15:14:16	2022-02-21 15:14:16	2022-02-21 15:14:16	-1	-1	-1	2022-02-21 15:14:16	2022-02-21 15:14:16		3.00	3	-1	-1	2022-02-21 15:14:16	2022-02-21 15:14:16
3	-1	-1	-1	-1	-1	Help me!	-1	-1		2022-02-22 14:40:08	2022-02-22 14:40:08	-1	-1	2022-02-22 14:40:08	2022-02-22 14:40:08	-1	-1	2022-02-22 14:40:08	-1	-1	2022-02-22 14:40:08	2022-02-22 14:40:08	2022-02-22 14:40:08	2022-02-22 14:40:08	-1	-1	-1	2022-02-22 14:40:08	2022-02-22 14:40:08		3.00	3	-1	-1	2022-02-22 14:40:08	2022-02-22 14:40:08
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.users (id, identity_id, email, password, created_at) FROM stdin;
1	23bc1215-a046-4e77-a64e-a5f3effe1d85	rexthony@yahoo.com	anthony	2022-03-08 12:08:09.796528
3	8ddc727a-4a3b-4842-b1cd-4f701cf1ae83	rex@sharetxt.live	anthony	2022-03-08 12:26:46.193696
4	126260c5-0120-4ce6-a6a9-4694c12e2950	leslie@idk.co	mr.rex	2022-03-10 16:36:40.616887
\.


--
-- Name: calendars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.calendars_id_seq', 1, true);


--
-- Name: delayed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.delayed_jobs_id_seq', 4, true);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.groups_id_seq', 45, true);


--
-- Name: knowledge_base_answer_translation_contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.knowledge_base_answer_translation_contents_id_seq', 1, false);


--
-- Name: knowledge_base_answer_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.knowledge_base_answer_translations_id_seq', 32, true);


--
-- Name: knowledge_base_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.knowledge_base_answers_id_seq', 29, true);


--
-- Name: knowledge_base_article_delayed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.knowledge_base_article_delayed_jobs_id_seq', 13, true);


--
-- Name: knowledge_base_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.knowledge_base_categories_id_seq', 855, true);


--
-- Name: knowledge_base_category_delayed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.knowledge_base_category_delayed_jobs_id_seq', 46, true);


--
-- Name: knowledge_base_category_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.knowledge_base_category_translations_id_seq', 690, true);


--
-- Name: knowledge_base_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.knowledge_base_locales_id_seq', 2, true);


--
-- Name: knowledge_base_menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.knowledge_base_menu_items_id_seq', 1, false);


--
-- Name: knowledge_base_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_base_translations_id_seq', 304, true);


--
-- Name: knowledge_bases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.knowledge_bases_id_seq', 74, true);


--
-- Name: link_objects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.link_objects_id_seq', 1, false);


--
-- Name: link_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.link_types_id_seq', 1, false);


--
-- Name: links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.links_id_seq', 1, false);


--
-- Name: locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.locales_id_seq', 46, true);


--
-- Name: mentions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.mentions_id_seq', 1, false);


--
-- Name: permissions_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.permissions_groups_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);


--
-- Name: service_boundary_regions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.service_boundary_regions_id_seq', 11, true);


--
-- Name: service_boundary_subregion_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.service_boundary_subregion_codes_id_seq', 1, true);


--
-- Name: service_boundary_subregions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.service_boundary_subregions_id_seq', 18, true);


--
-- Name: tag_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.tag_items_id_seq', 1, false);


--
-- Name: tag_objects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.tag_objects_id_seq', 1, false);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, false);


--
-- Name: ticket_article_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.ticket_article_flags_id_seq', 1, false);


--
-- Name: ticket_article_senders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.ticket_article_senders_id_seq', 1, false);


--
-- Name: ticket_article_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.ticket_article_types_id_seq', 1, false);


--
-- Name: ticket_articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.ticket_articles_id_seq', 4, true);


--
-- Name: ticket_counters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.ticket_counters_id_seq', 1, false);


--
-- Name: ticket_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.ticket_flags_id_seq', 1, false);


--
-- Name: ticket_priorities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.ticket_priorities_id_seq', 1, true);


--
-- Name: ticket_state_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.ticket_state_types_id_seq', 1, false);


--
-- Name: ticket_states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.ticket_states_id_seq', 3, true);


--
-- Name: ticket_time_accountings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.ticket_time_accountings_id_seq', 2, true);


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.tickets_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: calendars calendars_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT calendars_pkey PRIMARY KEY (id);


--
-- Name: delayed_jobs delayed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.delayed_jobs
    ADD CONSTRAINT delayed_jobs_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_answer_translation_contents knowledge_base_answer_translation_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_answer_translation_contents
    ADD CONSTRAINT knowledge_base_answer_translation_contents_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_article_translations knowledge_base_answer_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_article_translations
    ADD CONSTRAINT knowledge_base_answer_translations_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_articles knowledge_base_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_articles
    ADD CONSTRAINT knowledge_base_answers_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_article_delayed_jobs knowledge_base_article_delayed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_article_delayed_jobs
    ADD CONSTRAINT knowledge_base_article_delayed_jobs_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_categories knowledge_base_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_categories
    ADD CONSTRAINT knowledge_base_categories_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_category_delayed_jobs knowledge_base_category_delayed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_category_delayed_jobs
    ADD CONSTRAINT knowledge_base_category_delayed_jobs_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_category_translations knowledge_base_category_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_category_translations
    ADD CONSTRAINT knowledge_base_category_translations_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_locales knowledge_base_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_locales
    ADD CONSTRAINT knowledge_base_locales_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_menu_items knowledge_base_menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_base_menu_items
    ADD CONSTRAINT knowledge_base_menu_items_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_translations knowledge_base_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base_translations
    ADD CONSTRAINT knowledge_base_translations_pkey PRIMARY KEY (id);


--
-- Name: knowledge_bases knowledge_bases_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.knowledge_bases
    ADD CONSTRAINT knowledge_bases_pkey PRIMARY KEY (id);


--
-- Name: link_objects link_objects_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.link_objects
    ADD CONSTRAINT link_objects_pkey PRIMARY KEY (id);


--
-- Name: link_types link_types_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.link_types
    ADD CONSTRAINT link_types_pkey PRIMARY KEY (id);


--
-- Name: links links_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_pkey PRIMARY KEY (id);


--
-- Name: locales locales_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.locales
    ADD CONSTRAINT locales_pkey PRIMARY KEY (id);


--
-- Name: mentions mentions_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.mentions
    ADD CONSTRAINT mentions_pkey PRIMARY KEY (id);


--
-- Name: permissions_groups permissions_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.permissions_groups
    ADD CONSTRAINT permissions_groups_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


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
-- Name: tag_items tag_items_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.tag_items
    ADD CONSTRAINT tag_items_pkey PRIMARY KEY (id);


--
-- Name: tag_objects tag_objects_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.tag_objects
    ADD CONSTRAINT tag_objects_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: ticket_article_flags ticket_article_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_article_flags
    ADD CONSTRAINT ticket_article_flags_pkey PRIMARY KEY (id);


--
-- Name: ticket_article_senders ticket_article_senders_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_article_senders
    ADD CONSTRAINT ticket_article_senders_pkey PRIMARY KEY (id);


--
-- Name: ticket_article_types ticket_article_types_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_article_types
    ADD CONSTRAINT ticket_article_types_pkey PRIMARY KEY (id);


--
-- Name: ticket_articles ticket_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_articles
    ADD CONSTRAINT ticket_articles_pkey PRIMARY KEY (id);


--
-- Name: ticket_counters ticket_counters_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_counters
    ADD CONSTRAINT ticket_counters_pkey PRIMARY KEY (id);


--
-- Name: ticket_flags ticket_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_flags
    ADD CONSTRAINT ticket_flags_pkey PRIMARY KEY (id);


--
-- Name: ticket_priorities ticket_priorities_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_priorities
    ADD CONSTRAINT ticket_priorities_pkey PRIMARY KEY (id);


--
-- Name: ticket_state_types ticket_state_types_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_state_types
    ADD CONSTRAINT ticket_state_types_pkey PRIMARY KEY (id);


--
-- Name: ticket_states ticket_states_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_states
    ADD CONSTRAINT ticket_states_pkey PRIMARY KEY (id);


--
-- Name: ticket_time_accountings ticket_time_accountings_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.ticket_time_accountings
    ADD CONSTRAINT ticket_time_accountings_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

