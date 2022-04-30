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


--
-- Name: date_format(timestamp without time zone, text); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.date_format(timestamp without time zone, text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $_$ DECLARE i int := 1; temp text := ''; c text; n text; res text; BEGIN WHILE i <= pg_catalog.length($2) LOOP c := SUBSTRING ($2 FROM i FOR 1); IF c = '%' AND i != pg_catalog.length($2) THEN n := SUBSTRING ($2 FROM (i + 1) FOR 1); SELECT INTO res CASE WHEN n = 'a' THEN pg_catalog.to_char($1, 'Dy') WHEN n = 'b' THEN pg_catalog.to_char($1, 'Mon') WHEN n = 'c' THEN pg_catalog.to_char($1, 'FMMM') WHEN n = 'D' THEN pg_catalog.to_char($1, 'FMDDth') WHEN n = 'd' THEN pg_catalog.to_char($1, 'DD') WHEN n = 'e' THEN pg_catalog.to_char($1, 'FMDD') WHEN n = 'f' THEN pg_catalog.to_char($1, 'US') WHEN n = 'H' THEN pg_catalog.to_char($1, 'HH24') WHEN n = 'h' THEN pg_catalog.to_char($1, 'HH12') WHEN n = 'I' THEN pg_catalog.to_char($1, 'HH12') WHEN n = 'i' THEN pg_catalog.to_char($1, 'MI') WHEN n = 'j' THEN pg_catalog.to_char($1, 'DDD') WHEN n = 'k' THEN pg_catalog.to_char($1, 'FMHH24') WHEN n = 'l' THEN pg_catalog.to_char($1, 'FMHH12') WHEN n = 'M' THEN pg_catalog.to_char($1, 'FMMonth') WHEN n = 'm' THEN pg_catalog.to_char($1, 'MM') WHEN n = 'p' THEN pg_catalog.to_char($1, 'AM') WHEN n = 'r' THEN pg_catalog.to_char($1, 'HH12:MI:SS AM') WHEN n = 'S' THEN pg_catalog.to_char($1, 'SS') WHEN n = 's' THEN pg_catalog.to_char($1, 'SS') WHEN n = 'T' THEN pg_catalog.to_char($1, 'HH24:MI:SS') WHEN n = 'U' THEN pg_catalog.to_char($1, '?') WHEN n = 'u' THEN pg_catalog.to_char($1, '?') WHEN n = 'V' THEN pg_catalog.to_char($1, '?') WHEN n = 'v' THEN pg_catalog.to_char($1, '?') WHEN n = 'W' THEN pg_catalog.to_char($1, 'FMDay') WHEN n = 'w' THEN EXTRACT(DOW FROM $1)::text WHEN n = 'X' THEN pg_catalog.to_char($1, '?') WHEN n = 'x' THEN pg_catalog.to_char($1, '?') WHEN n = 'Y' THEN pg_catalog.to_char($1, 'YYYY') WHEN n = 'y' THEN pg_catalog.to_char($1, 'YY') WHEN n = '%' THEN pg_catalog.to_char($1, '%') ELSE NULL END; temp := temp operator(pg_catalog.||) res; i := i + 2; ELSE temp = temp operator(pg_catalog.||) c; i := i + 1; END IF; END LOOP; RETURN temp; END $_$;


ALTER FUNCTION public.date_format(timestamp without time zone, text) OWNER TO knowledgebase;

--
-- Name: date_format(timestamp with time zone, text); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.date_format(timestamp with time zone, text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $_$ DECLARE i int := 1; temp text := ''; c text; n text; res text; BEGIN WHILE i <= pg_catalog.length($2) LOOP c := SUBSTRING ($2 FROM i FOR 1); IF c = '%' AND i != pg_catalog.length($2) THEN n := SUBSTRING ($2 FROM (i + 1) FOR 1); SELECT INTO res CASE WHEN n = 'a' THEN pg_catalog.to_char($1, 'Dy') WHEN n = 'b' THEN pg_catalog.to_char($1, 'Mon') WHEN n = 'c' THEN pg_catalog.to_char($1, 'FMMM') WHEN n = 'D' THEN pg_catalog.to_char($1, 'FMDDth') WHEN n = 'd' THEN pg_catalog.to_char($1, 'DD') WHEN n = 'e' THEN pg_catalog.to_char($1, 'FMDD') WHEN n = 'f' THEN pg_catalog.to_char($1, 'US') WHEN n = 'H' THEN pg_catalog.to_char($1, 'HH24') WHEN n = 'h' THEN pg_catalog.to_char($1, 'HH12') WHEN n = 'I' THEN pg_catalog.to_char($1, 'HH12') WHEN n = 'i' THEN pg_catalog.to_char($1, 'MI') WHEN n = 'j' THEN pg_catalog.to_char($1, 'DDD') WHEN n = 'k' THEN pg_catalog.to_char($1, 'FMHH24') WHEN n = 'l' THEN pg_catalog.to_char($1, 'FMHH12') WHEN n = 'M' THEN pg_catalog.to_char($1, 'FMMonth') WHEN n = 'm' THEN pg_catalog.to_char($1, 'MM') WHEN n = 'p' THEN pg_catalog.to_char($1, 'AM') WHEN n = 'r' THEN pg_catalog.to_char($1, 'HH12:MI:SS AM') WHEN n = 'S' THEN pg_catalog.to_char($1, 'SS') WHEN n = 's' THEN pg_catalog.to_char($1, 'SS') WHEN n = 'T' THEN pg_catalog.to_char($1, 'HH24:MI:SS') WHEN n = 'U' THEN pg_catalog.to_char($1, '?') WHEN n = 'u' THEN pg_catalog.to_char($1, '?') WHEN n = 'V' THEN pg_catalog.to_char($1, '?') WHEN n = 'v' THEN pg_catalog.to_char($1, '?') WHEN n = 'W' THEN pg_catalog.to_char($1, 'FMDay') WHEN n = 'w' THEN EXTRACT(DOW FROM $1)::text WHEN n = 'X' THEN pg_catalog.to_char($1, '?') WHEN n = 'x' THEN pg_catalog.to_char($1, '?') WHEN n = 'Y' THEN pg_catalog.to_char($1, 'YYYY') WHEN n = 'y' THEN pg_catalog.to_char($1, 'YY') WHEN n = '%' THEN pg_catalog.to_char($1, '%') ELSE NULL END; temp := temp operator(pg_catalog.||) res; i := i + 2; ELSE temp = temp operator(pg_catalog.||) c; i := i + 1; END IF; END LOOP; RETURN temp; END $_$;


ALTER FUNCTION public.date_format(timestamp with time zone, text) OWNER TO knowledgebase;

--
-- Name: day(date); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.day(date) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$ SELECT EXTRACT(DAY FROM $1)::INTEGER; $_$;


ALTER FUNCTION public.day(date) OWNER TO knowledgebase;

--
-- Name: day(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.day(timestamp without time zone) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$ SELECT EXTRACT(DAY FROM $1)::INTEGER; $_$;


ALTER FUNCTION public.day(timestamp without time zone) OWNER TO knowledgebase;

--
-- Name: day(timestamp with time zone); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.day(timestamp with time zone) RETURNS integer
    LANGUAGE sql STABLE
    AS $_$ SELECT EXTRACT(DAY FROM $1)::INTEGER; $_$;


ALTER FUNCTION public.day(timestamp with time zone) OWNER TO knowledgebase;

--
-- Name: dol_util_rebuild_sequences(); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.dol_util_rebuild_sequences() RETURNS integer
    LANGUAGE plpgsql
    AS $$ DECLARE sequencedefs RECORD; c integer ; BEGIN FOR sequencedefs IN SELECT DISTINCT constraint_column_usage.table_name as tablename, constraint_column_usage.table_name as tablename, constraint_column_usage.column_name as columnname, replace(replace(columns.column_default,'''::regclass)',''),'nextval(''','') as sequencename from information_schema.constraint_column_usage, information_schema.columns, information_schema.sequences where constraint_column_usage.table_schema ='public' AND columns.table_schema = 'public' AND columns.table_name=constraint_column_usage.table_name AND constraint_column_usage.column_name IN ('rowid','id') AND constraint_column_usage.column_name = columns.column_name AND columns.column_default is not null AND replace(replace(columns.column_default,'''::regclass)',''),'nextval(''','')=sequence_name LOOP EXECUTE 'select max('||sequencedefs.columnname||') from ' || sequencedefs.tablename INTO c; IF c is null THEN c = 0; END IF; IF c is not null THEN c = c+ 1; END IF; EXECUTE 'alter sequence ' || sequencedefs.sequencename ||' restart  with ' || c; END LOOP; RETURN 1; END; $$;


ALTER FUNCTION public.dol_util_rebuild_sequences() OWNER TO knowledgebase;

--
-- Name: dol_util_triggerall(boolean); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.dol_util_triggerall(doenable boolean) RETURNS integer
    LANGUAGE plpgsql
    AS $$ DECLARE mytables RECORD; BEGIN FOR mytables IN SELECT relname FROM pg_class WHERE relhastriggers IS TRUE AND relkind = 'r' AND NOT relname ILIKE 'pg_%' LOOP IF DoEnable THEN EXECUTE 'ALTER TABLE ' || mytables.relname || ' ENABLE TRIGGER ALL'; ELSE  EXECUTE 'ALTER TABLE ' || mytables.relname || ' DISABLE TRIGGER ALL'; END IF; END LOOP; RETURN 1; END; $$;


ALTER FUNCTION public.dol_util_triggerall(doenable boolean) OWNER TO knowledgebase;

--
-- Name: month(date); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.month(date) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$ SELECT EXTRACT(MONTH FROM $1)::INTEGER; $_$;


ALTER FUNCTION public.month(date) OWNER TO knowledgebase;

--
-- Name: month(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.month(timestamp without time zone) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$ SELECT EXTRACT(MONTH FROM $1)::INTEGER; $_$;


ALTER FUNCTION public.month(timestamp without time zone) OWNER TO knowledgebase;

--
-- Name: month(timestamp with time zone); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.month(timestamp with time zone) RETURNS integer
    LANGUAGE sql STABLE
    AS $_$ SELECT EXTRACT(MONTH FROM $1)::INTEGER; $_$;


ALTER FUNCTION public.month(timestamp with time zone) OWNER TO knowledgebase;

--
-- Name: unix_timestamp(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.unix_timestamp(timestamp without time zone) RETURNS bigint
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$SELECT EXTRACT(EPOCH FROM $1)::bigint;$_$;


ALTER FUNCTION public.unix_timestamp(timestamp without time zone) OWNER TO knowledgebase;

--
-- Name: unix_timestamp(timestamp with time zone); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.unix_timestamp(timestamp with time zone) RETURNS bigint
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$SELECT EXTRACT(EPOCH FROM $1)::bigint;$_$;


ALTER FUNCTION public.unix_timestamp(timestamp with time zone) OWNER TO knowledgebase;

--
-- Name: update_modified_column_tms(); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.update_modified_column_tms() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ BEGIN NEW.tms = now(); RETURN NEW; END; $$;


ALTER FUNCTION public.update_modified_column_tms() OWNER TO knowledgebase;

--
-- Name: year(date); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.year(date) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$ SELECT EXTRACT(YEAR FROM $1)::INTEGER; $_$;


ALTER FUNCTION public.year(date) OWNER TO knowledgebase;

--
-- Name: year(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.year(timestamp without time zone) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$ SELECT EXTRACT(YEAR FROM $1)::INTEGER; $_$;


ALTER FUNCTION public.year(timestamp without time zone) OWNER TO knowledgebase;

--
-- Name: year(timestamp with time zone); Type: FUNCTION; Schema: public; Owner: knowledgebase
--

CREATE FUNCTION public.year(timestamp with time zone) RETURNS integer
    LANGUAGE sql STABLE
    AS $_$ SELECT EXTRACT(YEAR FROM $1)::INTEGER; $_$;


ALTER FUNCTION public.year(timestamp with time zone) OWNER TO knowledgebase;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: delivery; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.delivery (
    id integer NOT NULL,
    order_id integer NOT NULL,
    gig_id integer NOT NULL,
    seller_id character varying NOT NULL,
    buyer_id character varying NOT NULL,
    message text,
    metadata text,
    delivery_status character varying,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    declined_at timestamp without time zone
);


ALTER TABLE public.delivery OWNER TO knowledgebase;

--
-- Name: delivery_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.delivery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.delivery_id_seq OWNER TO knowledgebase;

--
-- Name: delivery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.delivery_id_seq OWNED BY public.delivery.id;


--
-- Name: gig_images; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.gig_images (
    id integer NOT NULL,
    gig_id integer NOT NULL,
    image_url character varying,
    order_in_sequence integer DEFAULT 0
);


ALTER TABLE public.gig_images OWNER TO knowledgebase;

--
-- Name: gig_images_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.gig_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gig_images_id_seq OWNER TO knowledgebase;

--
-- Name: gig_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.gig_images_id_seq OWNED BY public.gig_images.id;


--
-- Name: gig_location_tags; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.gig_location_tags (
    id integer NOT NULL,
    gig_location_code character varying NOT NULL,
    gig_id integer NOT NULL
);


ALTER TABLE public.gig_location_tags OWNER TO knowledgebase;

--
-- Name: gig_packages; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.gig_packages (
    id integer NOT NULL,
    package_type character varying NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    delivery_time character varying NOT NULL,
    metadata text,
    gig_id integer NOT NULL,
    price integer DEFAULT 0
);


ALTER TABLE public.gig_packages OWNER TO knowledgebase;

--
-- Name: gig_packages_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.gig_packages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gig_packages_id_seq OWNER TO knowledgebase;

--
-- Name: gig_packages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.gig_packages_id_seq OWNED BY public.gig_packages.id;


--
-- Name: gig_requirements; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.gig_requirements (
    id integer NOT NULL,
    gig_id integer NOT NULL,
    question text,
    response_type text,
    metadata text,
    is_required boolean DEFAULT true NOT NULL,
    order_in_sequence integer DEFAULT 1
);


ALTER TABLE public.gig_requirements OWNER TO knowledgebase;

--
-- Name: gig_requirements_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.gig_requirements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gig_requirements_id_seq OWNER TO knowledgebase;

--
-- Name: gig_requirements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.gig_requirements_id_seq OWNED BY public.gig_requirements.id;


--
-- Name: gig_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.gig_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gig_tags_id_seq OWNER TO knowledgebase;

--
-- Name: gig_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.gig_tags_id_seq OWNED BY public.gig_location_tags.id;


--
-- Name: gigs; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.gigs (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    title character varying NOT NULL,
    gig_status character varying,
    category_id integer NOT NULL,
    subcategory_id integer NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata text
);


ALTER TABLE public.gigs OWNER TO knowledgebase;

--
-- Name: gigs_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.gigs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gigs_id_seq OWNER TO knowledgebase;

--
-- Name: gigs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.gigs_id_seq OWNED BY public.gigs.id;


--
-- Name: llx_accounting_account; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_accounting_account (
    rowid bigint NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    datec timestamp without time zone,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    fk_pcg_version character varying(32) NOT NULL,
    pcg_type character varying(20) NOT NULL,
    account_number character varying(32) NOT NULL,
    account_parent integer DEFAULT 0,
    label character varying(255) NOT NULL,
    labelshort character varying(255) DEFAULT NULL::character varying,
    fk_accounting_category integer DEFAULT 0,
    fk_user_author integer,
    fk_user_modif integer,
    active smallint DEFAULT 1 NOT NULL,
    reconcilable smallint DEFAULT 0 NOT NULL,
    import_key character varying(14),
    extraparams character varying(255)
);


ALTER TABLE public.llx_accounting_account OWNER TO knowledgebase;

--
-- Name: llx_accounting_account_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_accounting_account_rowid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_accounting_account_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_accounting_account_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_accounting_account_rowid_seq OWNED BY public.llx_accounting_account.rowid;


--
-- Name: llx_accounting_bookkeeping; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_accounting_bookkeeping (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    piece_num integer NOT NULL,
    doc_date date NOT NULL,
    doc_type character varying(30) NOT NULL,
    doc_ref character varying(300) NOT NULL,
    fk_doc integer NOT NULL,
    fk_docdet integer NOT NULL,
    thirdparty_code character varying(32),
    subledger_account character varying(32),
    subledger_label character varying(255),
    numero_compte character varying(32) NOT NULL,
    label_compte character varying(255) NOT NULL,
    label_operation character varying(255),
    debit numeric(24,8) NOT NULL,
    credit numeric(24,8) NOT NULL,
    montant numeric(24,8),
    sens character varying(1) DEFAULT NULL::character varying,
    multicurrency_amount numeric(24,8),
    multicurrency_code character varying(255),
    lettering_code character varying(255),
    date_lettering timestamp without time zone,
    date_lim_reglement timestamp without time zone,
    fk_user_author integer NOT NULL,
    fk_user_modif integer,
    date_creation timestamp without time zone,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    fk_user integer,
    code_journal character varying(32) NOT NULL,
    journal_label character varying(255),
    date_validated timestamp without time zone,
    date_export timestamp without time zone,
    import_key character varying(14),
    extraparams character varying(255)
);


ALTER TABLE public.llx_accounting_bookkeeping OWNER TO knowledgebase;

--
-- Name: llx_accounting_bookkeeping_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_accounting_bookkeeping_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_accounting_bookkeeping_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_accounting_bookkeeping_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_accounting_bookkeeping_rowid_seq OWNED BY public.llx_accounting_bookkeeping.rowid;


--
-- Name: llx_accounting_bookkeeping_tmp; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_accounting_bookkeeping_tmp (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    doc_date date NOT NULL,
    doc_type character varying(30) NOT NULL,
    doc_ref character varying(300) NOT NULL,
    fk_doc integer NOT NULL,
    fk_docdet integer NOT NULL,
    thirdparty_code character varying(32),
    subledger_account character varying(32),
    subledger_label character varying(255),
    numero_compte character varying(32),
    label_compte character varying(255) NOT NULL,
    label_operation character varying(255),
    debit numeric(24,8) NOT NULL,
    credit numeric(24,8) NOT NULL,
    montant numeric(24,8) NOT NULL,
    sens character varying(1) DEFAULT NULL::character varying,
    multicurrency_amount numeric(24,8),
    multicurrency_code character varying(255),
    lettering_code character varying(255),
    date_lettering timestamp without time zone,
    date_lim_reglement timestamp without time zone,
    fk_user_author integer NOT NULL,
    fk_user_modif integer,
    date_creation timestamp without time zone,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    fk_user integer,
    code_journal character varying(32) NOT NULL,
    journal_label character varying(255),
    piece_num integer NOT NULL,
    date_validated timestamp without time zone,
    import_key character varying(14),
    extraparams character varying(255)
);


ALTER TABLE public.llx_accounting_bookkeeping_tmp OWNER TO knowledgebase;

--
-- Name: llx_accounting_bookkeeping_tmp_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_accounting_bookkeeping_tmp_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_accounting_bookkeeping_tmp_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_accounting_bookkeeping_tmp_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_accounting_bookkeeping_tmp_rowid_seq OWNED BY public.llx_accounting_bookkeeping_tmp.rowid;


--
-- Name: llx_accounting_fiscalyear; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_accounting_fiscalyear (
    rowid integer NOT NULL,
    label character varying(128) NOT NULL,
    date_start date,
    date_end date,
    statut smallint DEFAULT 0 NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    datec timestamp without time zone,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    fk_user_author integer,
    fk_user_modif integer
);


ALTER TABLE public.llx_accounting_fiscalyear OWNER TO knowledgebase;

--
-- Name: llx_accounting_fiscalyear_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_accounting_fiscalyear_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_accounting_fiscalyear_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_accounting_fiscalyear_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_accounting_fiscalyear_rowid_seq OWNED BY public.llx_accounting_fiscalyear.rowid;


--
-- Name: llx_accounting_groups_account; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_accounting_groups_account (
    rowid integer NOT NULL,
    fk_accounting_account integer NOT NULL,
    fk_c_accounting_category integer NOT NULL
);


ALTER TABLE public.llx_accounting_groups_account OWNER TO knowledgebase;

--
-- Name: llx_accounting_groups_account_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_accounting_groups_account_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_accounting_groups_account_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_accounting_groups_account_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_accounting_groups_account_rowid_seq OWNED BY public.llx_accounting_groups_account.rowid;


--
-- Name: llx_accounting_journal; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_accounting_journal (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    code character varying(32) NOT NULL,
    label character varying(128) NOT NULL,
    nature smallint DEFAULT 1 NOT NULL,
    active smallint DEFAULT 0
);


ALTER TABLE public.llx_accounting_journal OWNER TO knowledgebase;

--
-- Name: llx_accounting_journal_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_accounting_journal_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_accounting_journal_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_accounting_journal_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_accounting_journal_rowid_seq OWNED BY public.llx_accounting_journal.rowid;


--
-- Name: llx_accounting_system; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_accounting_system (
    rowid integer NOT NULL,
    fk_country integer,
    pcg_version character varying(32) NOT NULL,
    label character varying(128) NOT NULL,
    active smallint DEFAULT 0
);


ALTER TABLE public.llx_accounting_system OWNER TO knowledgebase;

--
-- Name: llx_accounting_system_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_accounting_system_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_accounting_system_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_accounting_system_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_accounting_system_rowid_seq OWNED BY public.llx_accounting_system.rowid;


--
-- Name: llx_c_departements; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_departements (
    rowid integer NOT NULL,
    code_departement character varying(6) NOT NULL,
    fk_region integer,
    cheflieu character varying(50),
    tncc integer,
    ncc character varying(50),
    nom character varying(50),
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_departements OWNER TO knowledgebase;

--
-- Name: llx_c_departements_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_departements_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_departements_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_departements_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_departements_rowid_seq OWNED BY public.llx_c_departements.rowid;


--
-- Name: llx_c_ecotaxe; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_ecotaxe (
    rowid integer NOT NULL,
    code character varying(64) NOT NULL,
    label character varying(255),
    price numeric(24,8),
    organization character varying(255),
    fk_pays integer NOT NULL,
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_ecotaxe OWNER TO knowledgebase;

--
-- Name: llx_c_ecotaxe_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_ecotaxe_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_ecotaxe_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_ecotaxe_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_ecotaxe_rowid_seq OWNED BY public.llx_c_ecotaxe.rowid;


--
-- Name: llx_c_effectif; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_effectif (
    id integer NOT NULL,
    code character varying(12) NOT NULL,
    libelle character varying(30),
    active smallint DEFAULT 1 NOT NULL,
    module character varying(32)
);


ALTER TABLE public.llx_c_effectif OWNER TO knowledgebase;

--
-- Name: llx_c_email_senderprofile; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_email_senderprofile (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    private smallint DEFAULT 0 NOT NULL,
    date_creation timestamp without time zone,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    label character varying(255),
    email character varying(255) NOT NULL,
    signature text,
    "position" smallint DEFAULT 0,
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_email_senderprofile OWNER TO knowledgebase;

--
-- Name: llx_c_email_senderprofile_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_email_senderprofile_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_email_senderprofile_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_email_senderprofile_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_email_senderprofile_rowid_seq OWNED BY public.llx_c_email_senderprofile.rowid;


--
-- Name: llx_c_email_templates; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_email_templates (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    module character varying(32),
    type_template character varying(32),
    lang character varying(6) DEFAULT ''::character varying,
    private smallint DEFAULT 0 NOT NULL,
    fk_user integer,
    datec timestamp without time zone,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    label character varying(180),
    "position" smallint,
    enabled character varying(255) DEFAULT '1'::character varying,
    active smallint DEFAULT 1 NOT NULL,
    topic text,
    joinfiles text,
    content text,
    content_lines text
);


ALTER TABLE public.llx_c_email_templates OWNER TO knowledgebase;

--
-- Name: llx_c_email_templates_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_email_templates_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_email_templates_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_email_templates_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_email_templates_rowid_seq OWNED BY public.llx_c_email_templates.rowid;


--
-- Name: llx_c_exp_tax_cat; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_exp_tax_cat (
    rowid integer NOT NULL,
    label character varying(48) NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    active integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_exp_tax_cat OWNER TO knowledgebase;

--
-- Name: llx_c_exp_tax_cat_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_exp_tax_cat_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_exp_tax_cat_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_exp_tax_cat_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_exp_tax_cat_rowid_seq OWNED BY public.llx_c_exp_tax_cat.rowid;


--
-- Name: llx_c_exp_tax_range; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_exp_tax_range (
    rowid integer NOT NULL,
    fk_c_exp_tax_cat integer DEFAULT 1 NOT NULL,
    range_ik numeric DEFAULT 0 NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    active integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_exp_tax_range OWNER TO knowledgebase;

--
-- Name: llx_c_exp_tax_range_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_exp_tax_range_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_exp_tax_range_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_exp_tax_range_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_exp_tax_range_rowid_seq OWNED BY public.llx_c_exp_tax_range.rowid;


--
-- Name: llx_c_field_list; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_field_list (
    rowid integer NOT NULL,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    element character varying(64) NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    name character varying(32) NOT NULL,
    alias character varying(32) NOT NULL,
    title character varying(32) NOT NULL,
    align character varying(6) DEFAULT 'left'::character varying,
    sort smallint DEFAULT 1 NOT NULL,
    search smallint DEFAULT 0 NOT NULL,
    visible smallint DEFAULT 1 NOT NULL,
    enabled character varying(255) DEFAULT 1,
    rang integer DEFAULT 0
);


ALTER TABLE public.llx_c_field_list OWNER TO knowledgebase;

--
-- Name: llx_c_field_list_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_field_list_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_field_list_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_field_list_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_field_list_rowid_seq OWNED BY public.llx_c_field_list.rowid;


--
-- Name: llx_c_format_cards; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_format_cards (
    rowid integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    paper_size character varying(20) NOT NULL,
    orientation character varying(1) NOT NULL,
    metric character varying(5) NOT NULL,
    leftmargin numeric(24,8) NOT NULL,
    topmargin numeric(24,8) NOT NULL,
    nx integer NOT NULL,
    ny integer NOT NULL,
    spacex numeric(24,8) NOT NULL,
    spacey numeric(24,8) NOT NULL,
    width numeric(24,8) NOT NULL,
    height numeric(24,8) NOT NULL,
    font_size integer NOT NULL,
    custom_x numeric(24,8) NOT NULL,
    custom_y numeric(24,8) NOT NULL,
    active integer NOT NULL
);


ALTER TABLE public.llx_c_format_cards OWNER TO knowledgebase;

--
-- Name: llx_c_format_cards_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_format_cards_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_format_cards_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_format_cards_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_format_cards_rowid_seq OWNED BY public.llx_c_format_cards.rowid;


--
-- Name: llx_c_forme_juridique; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_forme_juridique (
    rowid integer NOT NULL,
    code integer NOT NULL,
    fk_pays integer NOT NULL,
    libelle character varying(255),
    isvatexempted smallint DEFAULT 0 NOT NULL,
    active smallint DEFAULT 1 NOT NULL,
    module character varying(32),
    "position" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.llx_c_forme_juridique OWNER TO knowledgebase;

--
-- Name: llx_c_forme_juridique_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_forme_juridique_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_forme_juridique_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_forme_juridique_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_forme_juridique_rowid_seq OWNED BY public.llx_c_forme_juridique.rowid;


--
-- Name: llx_c_holiday_types; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_holiday_types (
    rowid integer NOT NULL,
    code character varying(16) NOT NULL,
    label character varying(255) NOT NULL,
    affect integer NOT NULL,
    delay integer NOT NULL,
    newbymonth numeric(8,5) DEFAULT 0 NOT NULL,
    fk_country integer,
    active integer DEFAULT 1
);


ALTER TABLE public.llx_c_holiday_types OWNER TO knowledgebase;

--
-- Name: llx_c_holiday_types_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_holiday_types_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_holiday_types_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_holiday_types_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_holiday_types_rowid_seq OWNED BY public.llx_c_holiday_types.rowid;


--
-- Name: llx_c_hrm_department; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_hrm_department (
    rowid integer NOT NULL,
    pos smallint DEFAULT 0 NOT NULL,
    code character varying(16) NOT NULL,
    label character varying(50),
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_hrm_department OWNER TO knowledgebase;

--
-- Name: llx_c_hrm_function; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_hrm_function (
    rowid integer NOT NULL,
    pos smallint DEFAULT 0 NOT NULL,
    code character varying(16) NOT NULL,
    label character varying(50),
    c_level smallint DEFAULT 0 NOT NULL,
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_hrm_function OWNER TO knowledgebase;

--
-- Name: llx_c_hrm_public_holiday; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_hrm_public_holiday (
    id integer NOT NULL,
    entity integer DEFAULT 0 NOT NULL,
    fk_country integer,
    code character varying(62),
    dayrule character varying(64) DEFAULT ''::character varying,
    day integer,
    month integer,
    year integer,
    active integer DEFAULT 1,
    import_key character varying(14)
);


ALTER TABLE public.llx_c_hrm_public_holiday OWNER TO knowledgebase;

--
-- Name: llx_c_hrm_public_holiday_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_hrm_public_holiday_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_hrm_public_holiday_id_seq OWNER TO knowledgebase;

--
-- Name: llx_c_hrm_public_holiday_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_hrm_public_holiday_id_seq OWNED BY public.llx_c_hrm_public_holiday.id;


--
-- Name: llx_c_input_method; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_input_method (
    rowid integer NOT NULL,
    code character varying(30),
    libelle character varying(60),
    active smallint DEFAULT 1 NOT NULL,
    module character varying(32)
);


ALTER TABLE public.llx_c_input_method OWNER TO knowledgebase;

--
-- Name: llx_c_input_method_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_input_method_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_input_method_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_input_method_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_input_method_rowid_seq OWNED BY public.llx_c_input_method.rowid;


--
-- Name: llx_c_input_reason; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_input_reason (
    rowid integer NOT NULL,
    code character varying(30),
    label character varying(60),
    active smallint DEFAULT 1 NOT NULL,
    module character varying(32)
);


ALTER TABLE public.llx_c_input_reason OWNER TO knowledgebase;

--
-- Name: llx_c_input_reason_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_input_reason_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_input_reason_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_input_reason_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_input_reason_rowid_seq OWNED BY public.llx_c_input_reason.rowid;


--
-- Name: llx_c_lead_status; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_lead_status (
    rowid integer NOT NULL,
    code character varying(10),
    label character varying(50),
    "position" integer,
    percent numeric(5,2),
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_lead_status OWNER TO knowledgebase;

--
-- Name: llx_c_lead_status_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_lead_status_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_lead_status_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_lead_status_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_lead_status_rowid_seq OWNED BY public.llx_c_lead_status.rowid;


--
-- Name: llx_c_paiement; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_paiement (
    id integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    code character varying(6) NOT NULL,
    libelle character varying(62),
    type smallint,
    active smallint DEFAULT 1 NOT NULL,
    accountancy_code character varying(32),
    module character varying(32),
    "position" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.llx_c_paiement OWNER TO knowledgebase;

--
-- Name: llx_c_paiement_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_paiement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_paiement_id_seq OWNER TO knowledgebase;

--
-- Name: llx_c_paiement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_paiement_id_seq OWNED BY public.llx_c_paiement.id;


--
-- Name: llx_c_paper_format; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_paper_format (
    rowid integer NOT NULL,
    code character varying(16) NOT NULL,
    label character varying(50) NOT NULL,
    width numeric(6,2) DEFAULT 0,
    height numeric(6,2) DEFAULT 0,
    unit character varying(5) NOT NULL,
    active smallint DEFAULT 1 NOT NULL,
    module character varying(32)
);


ALTER TABLE public.llx_c_paper_format OWNER TO knowledgebase;

--
-- Name: llx_c_paper_format_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_paper_format_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_paper_format_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_paper_format_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_paper_format_rowid_seq OWNED BY public.llx_c_paper_format.rowid;


--
-- Name: llx_c_partnership_type; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_partnership_type (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    code character varying(32) NOT NULL,
    label character varying(64) NOT NULL,
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_partnership_type OWNER TO knowledgebase;

--
-- Name: llx_c_partnership_type_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_partnership_type_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_partnership_type_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_partnership_type_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_partnership_type_rowid_seq OWNED BY public.llx_c_partnership_type.rowid;


--
-- Name: llx_c_payment_term; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_payment_term (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    code character varying(16),
    sortorder smallint,
    active smallint DEFAULT 1,
    libelle character varying(255),
    libelle_facture text,
    type_cdr smallint,
    nbjour smallint,
    decalage smallint,
    module character varying(32),
    "position" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.llx_c_payment_term OWNER TO knowledgebase;

--
-- Name: llx_c_payment_term_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_payment_term_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_payment_term_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_payment_term_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_payment_term_rowid_seq OWNED BY public.llx_c_payment_term.rowid;


--
-- Name: llx_c_price_expression; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_price_expression (
    rowid integer NOT NULL,
    title character varying(20) NOT NULL,
    expression character varying(255) NOT NULL
);


ALTER TABLE public.llx_c_price_expression OWNER TO knowledgebase;

--
-- Name: llx_c_price_expression_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_price_expression_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_price_expression_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_price_expression_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_price_expression_rowid_seq OWNED BY public.llx_c_price_expression.rowid;


--
-- Name: llx_c_price_global_variable; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_price_global_variable (
    rowid integer NOT NULL,
    code character varying(20) NOT NULL,
    description text,
    value numeric(24,8) DEFAULT 0
);


ALTER TABLE public.llx_c_price_global_variable OWNER TO knowledgebase;

--
-- Name: llx_c_price_global_variable_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_price_global_variable_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_price_global_variable_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_price_global_variable_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_price_global_variable_rowid_seq OWNED BY public.llx_c_price_global_variable.rowid;


--
-- Name: llx_c_price_global_variable_updater; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_price_global_variable_updater (
    rowid integer NOT NULL,
    type integer NOT NULL,
    description text,
    parameters text,
    fk_variable integer NOT NULL,
    update_interval integer DEFAULT 0,
    next_update integer DEFAULT 0,
    last_status text
);


ALTER TABLE public.llx_c_price_global_variable_updater OWNER TO knowledgebase;

--
-- Name: llx_c_price_global_variable_updater_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_price_global_variable_updater_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_price_global_variable_updater_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_price_global_variable_updater_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_price_global_variable_updater_rowid_seq OWNED BY public.llx_c_price_global_variable_updater.rowid;


--
-- Name: llx_c_product_nature; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_product_nature (
    rowid integer NOT NULL,
    code smallint NOT NULL,
    label character varying(100),
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_product_nature OWNER TO knowledgebase;

--
-- Name: llx_c_product_nature_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_product_nature_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_product_nature_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_product_nature_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_product_nature_rowid_seq OWNED BY public.llx_c_product_nature.rowid;


--
-- Name: llx_c_productbatch_qcstatus; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_productbatch_qcstatus (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    code character varying(16) NOT NULL,
    label character varying(50) NOT NULL,
    active integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_productbatch_qcstatus OWNER TO knowledgebase;

--
-- Name: llx_c_productbatch_qcstatus_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_productbatch_qcstatus_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_productbatch_qcstatus_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_productbatch_qcstatus_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_productbatch_qcstatus_rowid_seq OWNED BY public.llx_c_productbatch_qcstatus.rowid;


--
-- Name: llx_c_propalst; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_propalst (
    id smallint NOT NULL,
    code character varying(12) NOT NULL,
    label character varying(30),
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_propalst OWNER TO knowledgebase;

--
-- Name: llx_c_prospectcontactlevel; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_prospectcontactlevel (
    code character varying(12) NOT NULL,
    label character varying(30),
    sortorder smallint,
    active smallint DEFAULT 1 NOT NULL,
    module character varying(32)
);


ALTER TABLE public.llx_c_prospectcontactlevel OWNER TO knowledgebase;

--
-- Name: llx_c_prospectlevel; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_prospectlevel (
    code character varying(12) NOT NULL,
    label character varying(30),
    sortorder smallint,
    active smallint DEFAULT 1 NOT NULL,
    module character varying(32)
);


ALTER TABLE public.llx_c_prospectlevel OWNER TO knowledgebase;

--
-- Name: llx_c_recruitment_origin; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_recruitment_origin (
    rowid integer NOT NULL,
    code character varying(32) NOT NULL,
    label character varying(64) NOT NULL,
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_recruitment_origin OWNER TO knowledgebase;

--
-- Name: llx_c_recruitment_origin_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_recruitment_origin_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_recruitment_origin_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_recruitment_origin_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_recruitment_origin_rowid_seq OWNED BY public.llx_c_recruitment_origin.rowid;


--
-- Name: llx_c_regions; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_regions (
    rowid integer NOT NULL,
    code_region integer NOT NULL,
    fk_pays integer NOT NULL,
    cheflieu character varying(50),
    tncc integer,
    nom character varying(100),
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_regions OWNER TO knowledgebase;

--
-- Name: llx_c_regions_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_regions_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_regions_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_regions_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_regions_rowid_seq OWNED BY public.llx_c_regions.rowid;


--
-- Name: llx_c_revenuestamp; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_revenuestamp (
    rowid integer NOT NULL,
    fk_pays integer NOT NULL,
    taux numeric NOT NULL,
    revenuestamp_type character varying(16) DEFAULT 'fixed'::character varying NOT NULL,
    note character varying(128),
    active smallint DEFAULT 1 NOT NULL,
    accountancy_code_sell character varying(32) DEFAULT NULL::character varying,
    accountancy_code_buy character varying(32) DEFAULT NULL::character varying
);


ALTER TABLE public.llx_c_revenuestamp OWNER TO knowledgebase;

--
-- Name: llx_c_revenuestamp_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_revenuestamp_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_revenuestamp_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_revenuestamp_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_revenuestamp_rowid_seq OWNED BY public.llx_c_revenuestamp.rowid;


--
-- Name: llx_c_shipment_mode; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_shipment_mode (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    code character varying(30) NOT NULL,
    libelle character varying(50) NOT NULL,
    description text,
    tracking character varying(255),
    active smallint DEFAULT 0,
    module character varying(32)
);


ALTER TABLE public.llx_c_shipment_mode OWNER TO knowledgebase;

--
-- Name: llx_c_shipment_mode_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_shipment_mode_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_shipment_mode_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_shipment_mode_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_shipment_mode_rowid_seq OWNED BY public.llx_c_shipment_mode.rowid;


--
-- Name: llx_c_shipment_package_type; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_shipment_package_type (
    rowid integer NOT NULL,
    label character varying(50) NOT NULL,
    description character varying(255),
    active integer DEFAULT 1 NOT NULL,
    entity integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_shipment_package_type OWNER TO knowledgebase;

--
-- Name: llx_c_shipment_package_type_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_shipment_package_type_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_shipment_package_type_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_shipment_package_type_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_shipment_package_type_rowid_seq OWNED BY public.llx_c_shipment_package_type.rowid;


--
-- Name: llx_c_socialnetworks; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_c_socialnetworks (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    code character varying(100),
    label character varying(150),
    url text,
    icon character varying(20),
    active smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.llx_c_socialnetworks OWNER TO knowledgebase;

--
-- Name: llx_c_socialnetworks_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_c_socialnetworks_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_c_socialnetworks_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_c_socialnetworks_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_c_socialnetworks_rowid_seq OWNED BY public.llx_c_socialnetworks.rowid;


--
-- Name: llx_facturedet_rec; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_facturedet_rec (
    rowid integer NOT NULL,
    fk_facture integer NOT NULL,
    fk_parent_line integer,
    fk_product integer,
    product_type integer DEFAULT 0,
    label character varying(255) DEFAULT NULL::character varying,
    description text,
    vat_src_code character varying(10) DEFAULT ''::character varying,
    tva_tx numeric(7,4),
    localtax1_tx numeric(7,4) DEFAULT 0,
    localtax1_type character varying(10),
    localtax2_tx numeric(7,4) DEFAULT 0,
    localtax2_type character varying(10),
    qty real,
    remise_percent real DEFAULT 0,
    remise real DEFAULT 0,
    subprice numeric(24,8),
    price numeric(24,8),
    total_ht numeric(24,8),
    total_tva numeric(24,8),
    total_localtax1 numeric(24,8) DEFAULT 0,
    total_localtax2 numeric(24,8) DEFAULT 0,
    total_ttc numeric(24,8),
    date_start_fill integer DEFAULT 0,
    date_end_fill integer DEFAULT 0,
    info_bits integer DEFAULT 0,
    buy_price_ht numeric(24,8) DEFAULT 0,
    fk_product_fournisseur_price integer,
    special_code integer DEFAULT 0,
    rang integer DEFAULT 0,
    fk_contract_line integer,
    fk_unit integer,
    import_key character varying(14),
    fk_user_author integer,
    fk_user_modif integer,
    fk_multicurrency integer,
    multicurrency_code character varying(3),
    multicurrency_subprice numeric(24,8) DEFAULT 0,
    multicurrency_total_ht numeric(24,8) DEFAULT 0,
    multicurrency_total_tva numeric(24,8) DEFAULT 0,
    multicurrency_total_ttc numeric(24,8) DEFAULT 0
);


ALTER TABLE public.llx_facturedet_rec OWNER TO knowledgebase;

--
-- Name: llx_facturedet_rec_extrafields; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_facturedet_rec_extrafields (
    rowid integer NOT NULL,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    fk_object integer NOT NULL,
    import_key character varying(14)
);


ALTER TABLE public.llx_facturedet_rec_extrafields OWNER TO knowledgebase;

--
-- Name: llx_facturedet_rec_extrafields_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_facturedet_rec_extrafields_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_facturedet_rec_extrafields_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_facturedet_rec_extrafields_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_facturedet_rec_extrafields_rowid_seq OWNED BY public.llx_facturedet_rec_extrafields.rowid;


--
-- Name: llx_facturedet_rec_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_facturedet_rec_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_facturedet_rec_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_facturedet_rec_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_facturedet_rec_rowid_seq OWNED BY public.llx_facturedet_rec.rowid;


--
-- Name: llx_fichinterdet_extrafields; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_fichinterdet_extrafields (
    rowid integer NOT NULL,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    fk_object integer NOT NULL,
    import_key character varying(14)
);


ALTER TABLE public.llx_fichinterdet_extrafields OWNER TO knowledgebase;

--
-- Name: llx_fichinterdet_extrafields_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_fichinterdet_extrafields_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_fichinterdet_extrafields_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_fichinterdet_extrafields_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_fichinterdet_extrafields_rowid_seq OWNED BY public.llx_fichinterdet_extrafields.rowid;


--
-- Name: llx_recruitment_recruitmentcandidature_extrafields; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_recruitment_recruitmentcandidature_extrafields (
    rowid integer NOT NULL,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    fk_object integer NOT NULL,
    import_key character varying(14)
);


ALTER TABLE public.llx_recruitment_recruitmentcandidature_extrafields OWNER TO knowledgebase;

--
-- Name: llx_recruitment_recruitmentcandidature_extrafields_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_recruitment_recruitmentcandidature_extrafields_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_recruitment_recruitmentcandidature_extrafields_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_recruitment_recruitmentcandidature_extrafields_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_recruitment_recruitmentcandidature_extrafields_rowid_seq OWNED BY public.llx_recruitment_recruitmentcandidature_extrafields.rowid;


--
-- Name: llx_resource_extrafields; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_resource_extrafields (
    rowid integer NOT NULL,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    fk_object integer NOT NULL,
    import_key character varying(14)
);


ALTER TABLE public.llx_resource_extrafields OWNER TO knowledgebase;

--
-- Name: llx_resource_extrafields_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_resource_extrafields_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_resource_extrafields_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_resource_extrafields_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_resource_extrafields_rowid_seq OWNED BY public.llx_resource_extrafields.rowid;


--
-- Name: llx_rights_def; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_rights_def (
    id integer NOT NULL,
    libelle character varying(255),
    module character varying(64),
    module_position integer DEFAULT 0 NOT NULL,
    family_position integer DEFAULT 0 NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    perms character varying(50),
    subperms character varying(50),
    type character varying(1),
    bydefault smallint DEFAULT 0
);


ALTER TABLE public.llx_rights_def OWNER TO knowledgebase;

--
-- Name: llx_takepos_floor_tables; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_takepos_floor_tables (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    label character varying(255),
    leftpos numeric,
    toppos numeric,
    floor smallint
);


ALTER TABLE public.llx_takepos_floor_tables OWNER TO knowledgebase;

--
-- Name: llx_takepos_floor_tables_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_takepos_floor_tables_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_takepos_floor_tables_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_takepos_floor_tables_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_takepos_floor_tables_rowid_seq OWNED BY public.llx_takepos_floor_tables.rowid;


--
-- Name: llx_user_rights; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_user_rights (
    rowid integer NOT NULL,
    entity integer DEFAULT 1 NOT NULL,
    fk_user integer NOT NULL,
    fk_id integer NOT NULL
);


ALTER TABLE public.llx_user_rights OWNER TO knowledgebase;

--
-- Name: llx_user_rights_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_user_rights_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_user_rights_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_user_rights_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_user_rights_rowid_seq OWNED BY public.llx_user_rights.rowid;


--
-- Name: llx_usergroup_extrafields; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_usergroup_extrafields (
    rowid integer NOT NULL,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    fk_object integer NOT NULL,
    import_key character varying(14)
);


ALTER TABLE public.llx_usergroup_extrafields OWNER TO knowledgebase;

--
-- Name: llx_usergroup_extrafields_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_usergroup_extrafields_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_usergroup_extrafields_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_usergroup_extrafields_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_usergroup_extrafields_rowid_seq OWNED BY public.llx_usergroup_extrafields.rowid;


--
-- Name: llx_workstation_workstation_resource; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.llx_workstation_workstation_resource (
    rowid integer NOT NULL,
    tms timestamp without time zone DEFAULT now() NOT NULL,
    fk_resource integer,
    fk_workstation integer
);


ALTER TABLE public.llx_workstation_workstation_resource OWNER TO knowledgebase;

--
-- Name: llx_workstation_workstation_resource_rowid_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.llx_workstation_workstation_resource_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llx_workstation_workstation_resource_rowid_seq OWNER TO knowledgebase;

--
-- Name: llx_workstation_workstation_resource_rowid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.llx_workstation_workstation_resource_rowid_seq OWNED BY public.llx_workstation_workstation_resource.rowid;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    gig_id integer NOT NULL,
    seller_id character varying NOT NULL,
    buyer_id character varying NOT NULL,
    order_status character varying,
    accepted_at timestamp without time zone,
    delivery_time integer,
    price integer,
    metadata text,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    delivered_at timestamp without time zone,
    declined_at timestamp without time zone,
    cancelled_at timestamp without time zone
);


ALTER TABLE public.orders OWNER TO knowledgebase;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO knowledgebase;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: proposals; Type: TABLE; Schema: public; Owner: knowledgebase
--

CREATE TABLE public.proposals (
    id integer NOT NULL,
    gig_id integer NOT NULL,
    seller_id character varying NOT NULL,
    buyer_id character varying NOT NULL,
    proposal_status character varying,
    delivery_time integer,
    price integer,
    metadata text,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    description text
);


ALTER TABLE public.proposals OWNER TO knowledgebase;

--
-- Name: proposals_id_seq; Type: SEQUENCE; Schema: public; Owner: knowledgebase
--

CREATE SEQUENCE public.proposals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.proposals_id_seq OWNER TO knowledgebase;

--
-- Name: proposals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: knowledgebase
--

ALTER SEQUENCE public.proposals_id_seq OWNED BY public.proposals.id;


--
-- Name: delivery id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.delivery ALTER COLUMN id SET DEFAULT nextval('public.delivery_id_seq'::regclass);


--
-- Name: gig_images id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.gig_images ALTER COLUMN id SET DEFAULT nextval('public.gig_images_id_seq'::regclass);


--
-- Name: gig_location_tags id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.gig_location_tags ALTER COLUMN id SET DEFAULT nextval('public.gig_tags_id_seq'::regclass);


--
-- Name: gig_packages id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.gig_packages ALTER COLUMN id SET DEFAULT nextval('public.gig_packages_id_seq'::regclass);


--
-- Name: gig_requirements id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.gig_requirements ALTER COLUMN id SET DEFAULT nextval('public.gig_requirements_id_seq'::regclass);


--
-- Name: gigs id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.gigs ALTER COLUMN id SET DEFAULT nextval('public.gigs_id_seq'::regclass);


--
-- Name: llx_accounting_account rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_account ALTER COLUMN rowid SET DEFAULT nextval('public.llx_accounting_account_rowid_seq'::regclass);


--
-- Name: llx_accounting_bookkeeping rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_bookkeeping ALTER COLUMN rowid SET DEFAULT nextval('public.llx_accounting_bookkeeping_rowid_seq'::regclass);


--
-- Name: llx_accounting_bookkeeping_tmp rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_bookkeeping_tmp ALTER COLUMN rowid SET DEFAULT nextval('public.llx_accounting_bookkeeping_tmp_rowid_seq'::regclass);


--
-- Name: llx_accounting_fiscalyear rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_fiscalyear ALTER COLUMN rowid SET DEFAULT nextval('public.llx_accounting_fiscalyear_rowid_seq'::regclass);


--
-- Name: llx_accounting_groups_account rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_groups_account ALTER COLUMN rowid SET DEFAULT nextval('public.llx_accounting_groups_account_rowid_seq'::regclass);


--
-- Name: llx_accounting_journal rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_journal ALTER COLUMN rowid SET DEFAULT nextval('public.llx_accounting_journal_rowid_seq'::regclass);


--
-- Name: llx_accounting_system rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_system ALTER COLUMN rowid SET DEFAULT nextval('public.llx_accounting_system_rowid_seq'::regclass);


--
-- Name: llx_c_departements rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_departements ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_departements_rowid_seq'::regclass);


--
-- Name: llx_c_ecotaxe rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_ecotaxe ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_ecotaxe_rowid_seq'::regclass);


--
-- Name: llx_c_email_senderprofile rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_email_senderprofile ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_email_senderprofile_rowid_seq'::regclass);


--
-- Name: llx_c_email_templates rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_email_templates ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_email_templates_rowid_seq'::regclass);


--
-- Name: llx_c_exp_tax_cat rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_exp_tax_cat ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_exp_tax_cat_rowid_seq'::regclass);


--
-- Name: llx_c_exp_tax_range rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_exp_tax_range ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_exp_tax_range_rowid_seq'::regclass);


--
-- Name: llx_c_field_list rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_field_list ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_field_list_rowid_seq'::regclass);


--
-- Name: llx_c_format_cards rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_format_cards ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_format_cards_rowid_seq'::regclass);


--
-- Name: llx_c_forme_juridique rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_forme_juridique ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_forme_juridique_rowid_seq'::regclass);


--
-- Name: llx_c_holiday_types rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_holiday_types ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_holiday_types_rowid_seq'::regclass);


--
-- Name: llx_c_hrm_public_holiday id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_hrm_public_holiday ALTER COLUMN id SET DEFAULT nextval('public.llx_c_hrm_public_holiday_id_seq'::regclass);


--
-- Name: llx_c_input_method rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_input_method ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_input_method_rowid_seq'::regclass);


--
-- Name: llx_c_input_reason rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_input_reason ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_input_reason_rowid_seq'::regclass);


--
-- Name: llx_c_lead_status rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_lead_status ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_lead_status_rowid_seq'::regclass);


--
-- Name: llx_c_paiement id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_paiement ALTER COLUMN id SET DEFAULT nextval('public.llx_c_paiement_id_seq'::regclass);


--
-- Name: llx_c_paper_format rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_paper_format ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_paper_format_rowid_seq'::regclass);


--
-- Name: llx_c_partnership_type rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_partnership_type ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_partnership_type_rowid_seq'::regclass);


--
-- Name: llx_c_payment_term rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_payment_term ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_payment_term_rowid_seq'::regclass);


--
-- Name: llx_c_price_expression rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_price_expression ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_price_expression_rowid_seq'::regclass);


--
-- Name: llx_c_price_global_variable rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_price_global_variable ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_price_global_variable_rowid_seq'::regclass);


--
-- Name: llx_c_price_global_variable_updater rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_price_global_variable_updater ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_price_global_variable_updater_rowid_seq'::regclass);


--
-- Name: llx_c_product_nature rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_product_nature ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_product_nature_rowid_seq'::regclass);


--
-- Name: llx_c_productbatch_qcstatus rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_productbatch_qcstatus ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_productbatch_qcstatus_rowid_seq'::regclass);


--
-- Name: llx_c_recruitment_origin rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_recruitment_origin ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_recruitment_origin_rowid_seq'::regclass);


--
-- Name: llx_c_regions rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_regions ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_regions_rowid_seq'::regclass);


--
-- Name: llx_c_revenuestamp rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_revenuestamp ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_revenuestamp_rowid_seq'::regclass);


--
-- Name: llx_c_shipment_mode rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_shipment_mode ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_shipment_mode_rowid_seq'::regclass);


--
-- Name: llx_c_shipment_package_type rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_shipment_package_type ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_shipment_package_type_rowid_seq'::regclass);


--
-- Name: llx_c_socialnetworks rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_socialnetworks ALTER COLUMN rowid SET DEFAULT nextval('public.llx_c_socialnetworks_rowid_seq'::regclass);


--
-- Name: llx_facturedet_rec rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_facturedet_rec ALTER COLUMN rowid SET DEFAULT nextval('public.llx_facturedet_rec_rowid_seq'::regclass);


--
-- Name: llx_facturedet_rec_extrafields rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_facturedet_rec_extrafields ALTER COLUMN rowid SET DEFAULT nextval('public.llx_facturedet_rec_extrafields_rowid_seq'::regclass);


--
-- Name: llx_fichinterdet_extrafields rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_fichinterdet_extrafields ALTER COLUMN rowid SET DEFAULT nextval('public.llx_fichinterdet_extrafields_rowid_seq'::regclass);


--
-- Name: llx_recruitment_recruitmentcandidature_extrafields rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_recruitment_recruitmentcandidature_extrafields ALTER COLUMN rowid SET DEFAULT nextval('public.llx_recruitment_recruitmentcandidature_extrafields_rowid_seq'::regclass);


--
-- Name: llx_resource_extrafields rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_resource_extrafields ALTER COLUMN rowid SET DEFAULT nextval('public.llx_resource_extrafields_rowid_seq'::regclass);


--
-- Name: llx_takepos_floor_tables rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_takepos_floor_tables ALTER COLUMN rowid SET DEFAULT nextval('public.llx_takepos_floor_tables_rowid_seq'::regclass);


--
-- Name: llx_user_rights rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_user_rights ALTER COLUMN rowid SET DEFAULT nextval('public.llx_user_rights_rowid_seq'::regclass);


--
-- Name: llx_usergroup_extrafields rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_usergroup_extrafields ALTER COLUMN rowid SET DEFAULT nextval('public.llx_usergroup_extrafields_rowid_seq'::regclass);


--
-- Name: llx_workstation_workstation_resource rowid; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_workstation_workstation_resource ALTER COLUMN rowid SET DEFAULT nextval('public.llx_workstation_workstation_resource_rowid_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: proposals id; Type: DEFAULT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.proposals ALTER COLUMN id SET DEFAULT nextval('public.proposals_id_seq'::regclass);


--
-- Data for Name: delivery; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.delivery (id, order_id, gig_id, seller_id, buyer_id, message, metadata, delivery_status, created_at, declined_at) FROM stdin;
1	3	2	seller identity	buyer identity	Here is your delivery	...	pending	2022-03-22 15:25:31.337672	\N
\.


--
-- Data for Name: gig_images; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.gig_images (id, gig_id, image_url, order_in_sequence) FROM stdin;
\.


--
-- Data for Name: gig_location_tags; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.gig_location_tags (id, gig_location_code, gig_id) FROM stdin;
\.


--
-- Data for Name: gig_packages; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.gig_packages (id, package_type, name, description, delivery_time, metadata, gig_id, price) FROM stdin;
\.


--
-- Data for Name: gig_requirements; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.gig_requirements (id, gig_id, question, response_type, metadata, is_required, order_in_sequence) FROM stdin;
\.


--
-- Data for Name: gigs; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.gigs (id, user_id, title, gig_status, category_id, subcategory_id, description, created_at, updated_at, metadata) FROM stdin;
\.


--
-- Data for Name: llx_accounting_account; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_accounting_account (rowid, entity, datec, tms, fk_pcg_version, pcg_type, account_number, account_parent, label, labelshort, fk_accounting_category, fk_user_author, fk_user_modif, active, reconcilable, import_key, extraparams) FROM stdin;
\.


--
-- Data for Name: llx_accounting_bookkeeping; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_accounting_bookkeeping (rowid, entity, piece_num, doc_date, doc_type, doc_ref, fk_doc, fk_docdet, thirdparty_code, subledger_account, subledger_label, numero_compte, label_compte, label_operation, debit, credit, montant, sens, multicurrency_amount, multicurrency_code, lettering_code, date_lettering, date_lim_reglement, fk_user_author, fk_user_modif, date_creation, tms, fk_user, code_journal, journal_label, date_validated, date_export, import_key, extraparams) FROM stdin;
\.


--
-- Data for Name: llx_accounting_bookkeeping_tmp; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_accounting_bookkeeping_tmp (rowid, entity, doc_date, doc_type, doc_ref, fk_doc, fk_docdet, thirdparty_code, subledger_account, subledger_label, numero_compte, label_compte, label_operation, debit, credit, montant, sens, multicurrency_amount, multicurrency_code, lettering_code, date_lettering, date_lim_reglement, fk_user_author, fk_user_modif, date_creation, tms, fk_user, code_journal, journal_label, piece_num, date_validated, import_key, extraparams) FROM stdin;
\.


--
-- Data for Name: llx_accounting_fiscalyear; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_accounting_fiscalyear (rowid, label, date_start, date_end, statut, entity, datec, tms, fk_user_author, fk_user_modif) FROM stdin;
\.


--
-- Data for Name: llx_accounting_groups_account; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_accounting_groups_account (rowid, fk_accounting_account, fk_c_accounting_category) FROM stdin;
\.


--
-- Data for Name: llx_accounting_journal; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_accounting_journal (rowid, entity, code, label, nature, active) FROM stdin;
1	1	VT	ACCOUNTING_SELL_JOURNAL	2	1
2	1	AC	ACCOUNTING_PURCHASE_JOURNAL	3	1
3	1	BQ	FinanceJournal	4	1
4	1	OD	ACCOUNTING_MISCELLANEOUS_JOURNAL	1	1
5	1	AN	ACCOUNTING_HAS_NEW_JOURNAL	9	1
6	1	ER	ExpenseReportsJournal	5	1
7	1	INV	InventoryJournal	8	1
\.


--
-- Data for Name: llx_accounting_system; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_accounting_system (rowid, fk_country, pcg_version, label, active) FROM stdin;
1	1	PCG99-ABREGE	The simple accountancy french plan	1
2	1	PCG99-BASE	The base accountancy french plan	1
3	1	PCG14-DEV	The developed accountancy french plan 2014	1
4	1	PCG18-ASSOC	French foundation chart of accounts 2018	1
5	1	PCGAFR14-DEV	The developed farm accountancy french plan 2014	1
6	2	PCMN-BASE	The base accountancy belgium plan	1
7	4	PCG08-PYME	The PYME accountancy spanish plan	1
8	5	SKR03	Standardkontenrahmen SKR 03	1
9	5	SKR04	Standardkontenrahmen SKR 04	1
10	6	PCG_SUISSE	Switzerland plan	1
11	7	ENG-BASE	England plan	1
12	10	PCT	The Tunisia plan	1
13	12	PCG	The Moroccan chart of accounts	1
14	13	NSCF	Nouveau système comptable financier	1
15	17	NL-VERKORT	Verkort rekeningschema	1
16	20	BAS-K1-MINI	The Swedish mini chart of accounts	1
17	41	AT-BASE	Plan Austria	1
18	67	PC-MIPYME	The PYME accountancy Chile plan	1
19	80	DK-STD	Standardkontoplan fra SKAT	1
20	84	EC-SUPERCIAS	Plan de cuentas Ecuador	1
21	140	PCN-LUXEMBURG	Plan comptable normalisé Luxembourgeois	1
22	188	RO-BASE	Plan de conturi romanesc	1
23	49	SYSCOHADA-BJ	Plan comptable Ouest-Africain	1
24	60	SYSCOHADA-BF	Plan comptable Ouest-Africain	1
25	73	SYSCOHADA-CD	Plan comptable Ouest-Africain	1
26	65	SYSCOHADA-CF	Plan comptable Ouest-Africain	1
27	72	SYSCOHADA-CG	Plan comptable Ouest-Africain	1
28	21	SYSCOHADA-CI	Plan comptable Ouest-Africain	1
29	24	SYSCOHADA-CM	Plan comptable Ouest-Africain	1
30	16	SYSCOHADA-GA	Plan comptable Ouest-Africain	1
31	87	SYSCOHADA-GQ	Plan comptable Ouest-Africain	1
32	71	SYSCOHADA-KM	Plan comptable Ouest-Africain	1
33	147	SYSCOHADA-ML	Plan comptable Ouest-Africain	1
34	168	SYSCOHADA-NE	Plan comptable Ouest-Africain	1
35	22	SYSCOHADA-SN	Plan comptable Ouest-Africain	1
36	66	SYSCOHADA-TD	Plan comptable Ouest-Africain	1
37	15	SYSCOHADA-TG	Plan comptable Ouest-Africain	1
38	11	US-BASE	USA basic chart of accounts	1
39	14	CA-ENG-BASE	Canadian basic chart of accounts - English	1
40	154	SAT/24-2019	Catalogo y codigo agrupador fiscal del 2019	1
\.


--
-- Data for Name: llx_c_departements; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_departements (rowid, code_departement, fk_region, cheflieu, tncc, ncc, nom, active) FROM stdin;
1	0	0	0	0	-	-	1
2	AL01	1301		0		Wilaya d'Adrar	1
3	AL02	1301		0		Wilaya de Chlef	1
4	AL03	1301		0		Wilaya de Laghouat	1
5	AL04	1301		0		Wilaya d'Oum El Bouaghi	1
6	AL05	1301		0		Wilaya de Batna	1
7	AL06	1301		0		Wilaya de Béjaïa	1
8	AL07	1301		0		Wilaya de Biskra	1
9	AL08	1301		0		Wilaya de Béchar	1
10	AL09	1301		0		Wilaya de Blida	1
11	AL10	1301		0		Wilaya de Bouira	1
12	AL11	1301		0		Wilaya de Tamanrasset	1
13	AL12	1301		0		Wilaya de Tébessa	1
14	AL13	1301		0		Wilaya de Tlemcen	1
15	AL14	1301		0		Wilaya de Tiaret	1
16	AL15	1301		0		Wilaya de Tizi Ouzou	1
17	AL16	1301		0		Wilaya d'Alger	1
18	AL17	1301		0		Wilaya de Djelfa	1
19	AL18	1301		0		Wilaya de Jijel	1
20	AL19	1301		0		Wilaya de Sétif	1
21	AL20	1301		0		Wilaya de Saïda	1
22	AL21	1301		0		Wilaya de Skikda	1
23	AL22	1301		0		Wilaya de Sidi Bel Abbès	1
24	AL23	1301		0		Wilaya d'Annaba	1
25	AL24	1301		0		Wilaya de Guelma	1
26	AL25	1301		0		Wilaya de Constantine	1
27	AL26	1301		0		Wilaya de Médéa	1
28	AL27	1301		0		Wilaya de Mostaganem	1
29	AL28	1301		0		Wilaya de M'Sila	1
30	AL29	1301		0		Wilaya de Mascara	1
31	AL30	1301		0		Wilaya d'Ouargla	1
32	AL31	1301		0		Wilaya d'Oran	1
33	AL32	1301		0		Wilaya d'El Bayadh	1
34	AL33	1301		0		Wilaya d'Illizi	1
35	AL34	1301		0		Wilaya de Bordj Bou Arreridj	1
36	AL35	1301		0		Wilaya de Boumerdès	1
37	AL36	1301		0		Wilaya d'El Tarf	1
38	AL37	1301		0		Wilaya de Tindouf	1
39	AL38	1301		0		Wilaya de Tissemsilt	1
40	AL39	1301		0		Wilaya d'El Oued	1
41	AL40	1301		0		Wilaya de Khenchela	1
42	AL41	1301		0		Wilaya de Souk Ahras	1
43	AL42	1301		0		Wilaya de Tipaza	1
44	AL43	1301		0		Wilaya de Mila	1
45	AL44	1301		0		Wilaya d'Aïn Defla	1
46	AL45	1301		0		Wilaya de Naâma	1
47	AL46	1301		0		Wilaya d'Aïn Témouchent	1
48	AL47	1301		0		Wilaya de Ghardaia	1
49	AL48	1301		0		Wilaya de Relizane	1
50	AD-002	34000	AD100	\N	\N	Canillo	1
51	AD-003	34000	AD200	\N	\N	Encamp	1
52	AD-004	34000	AD400	\N	\N	La Massana	1
53	AD-005	34000	AD300	\N	\N	Ordino	1
54	AD-006	34000	AD600	\N	\N	Sant Julià de Lòria	1
55	AD-007	34000	AD500	\N	\N	Andorra la Vella	1
56	AD-008	34000	AD700	\N	\N	Escaldes-Engordany	1
57	AO-ABO	35001	\N	\N	BENGO	Bengo	1
58	AO-BGU	35001	\N	\N	BENGUELA	Benguela	1
59	AO-BIE	35001	\N	\N	BIÉ	Bié	1
60	AO-CAB	35001	\N	\N	CABINDA	Cabinda	1
61	AO-CCU	35001	\N	\N	KUANDO KUBANGO	Kuando Kubango	1
62	AO-CNO	35001	\N	\N	KWANZA NORTE	Kwanza Norte	1
63	AO-CUS	35001	\N	\N	KWANZA SUL	Kwanza Sul	1
64	AO-CNN	35001	\N	\N	CUNENE	Cunene	1
65	AO-HUA	35001	\N	\N	HUAMBO	Huambo	1
66	AO-HUI	35001	\N	\N	HUÍLA	Huila	1
67	AO-LUA	35001	\N	\N	LUANDA	Luanda	1
68	AO-LNO	35001	\N	\N	LUNDA-NORTE	Lunda-Norte	1
69	AO-LSU	35001	\N	\N	LUNDA-SUL	Lunda-Sul	1
70	AO-MAL	35001	\N	\N	MALANGE	Malange	1
71	AO-MOX	35001	\N	\N	MOXICO	Moxico	1
72	AO-NAM	35001	\N	\N	NAMÍBE	Namíbe	1
73	AO-UIG	35001	\N	\N	UÍGE	Uíge	1
74	AO-ZAI	35001	\N	\N	ZAÍRE	Zaíre	1
75	2301	2301		0	CATAMARCA	Catamarca	1
76	2302	2301		0	JUJUY	Jujuy	1
77	2303	2301		0	TUCAMAN	Tucamán	1
78	2304	2301		0	SANTIAGO DEL ESTERO	Santiago del Estero	1
79	2305	2301		0	SALTA	Salta	1
80	2306	2302		0	CHACO	Chaco	1
81	2307	2302		0	CORRIENTES	Corrientes	1
82	2308	2302		0	ENTRE RIOS	Entre Ríos	1
83	2309	2302		0	FORMOSA	Formosa	1
84	2310	2302		0	SANTA FE	Santa Fe	1
85	2311	2303		0	LA RIOJA	La Rioja	1
86	2312	2303		0	MENDOZA	Mendoza	1
87	2313	2303		0	SAN JUAN	San Juan	1
88	2314	2303		0	SAN LUIS	San Luis	1
89	2315	2304		0	CORDOBA	Córdoba	1
90	2316	2304		0	BUENOS AIRES	Buenos Aires	1
91	2317	2304		0	CABA	Caba	1
92	2318	2305		0	LA PAMPA	La Pampa	1
93	2319	2305		0	NEUQUEN	Neuquén	1
94	2320	2305		0	RIO NEGRO	Río Negro	1
95	2321	2305		0	CHUBUT	Chubut	1
96	2322	2305		0	SANTA CRUZ	Santa Cruz	1
97	2323	2305		0	TIERRA DEL FUEGO	Tierra del Fuego	1
98	2324	2305		0	ISLAS MALVINAS	Islas Malvinas	1
99	2325	2305		0	ANTARTIDA	Antártida	1
100	2326	2305		0	MISIONES	Misiones	1
101	NSW	2801		1		New South Wales	1
102	VIC	2801		1		Victoria	1
103	QLD	2801		1		Queensland	1
104	SA	2801		1		South Australia	1
105	ACT	2801		1		Australia Capital Territory	1
106	TAS	2801		1		Tasmania	1
107	WA	2801		1		Western Australia	1
108	NT	2801		1		Northern Territory	1
109	B	4101	\N	\N	BURGENLAND	Burgenland	1
110	K	4101	\N	\N	KAERNTEN	Kärnten	1
224	134	6713		0	134	Maipo	1
111	N	4101	\N	\N	NIEDEROESTERREICH	Niederösterreich	1
112	O	4101	\N	\N	OBEROESTERREICH	Oberösterreich	1
113	S	4101	\N	\N	SALZBURG	Salzburg	1
114	ST	4101	\N	\N	STEIERMARK	Steiermark	1
115	T	4101	\N	\N	TIROL	Tirol	1
116	V	4101	\N	\N	VORARLBERG	Vorarlberg	1
117	W	4101	\N	\N	WIEN	Wien	1
118	CC	4601	Oistins	0	CC	Christ Church	1
119	SA	4601	Greenland	0	SA	Saint Andrew	1
120	SG	4601	Bulkeley	0	SG	Saint George	1
121	JA	4601	Holetown	0	JA	Saint James	1
122	SJ	4601	Four Roads	0	SJ	Saint John	1
123	SB	4601	Bathsheba	0	SB	Saint Joseph	1
124	SL	4601	Crab Hill	0	SL	Saint Lucy	1
125	SM	4601	Bridgetown	0	SM	Saint Michael	1
126	SP	4601	Speightstown	0	SP	Saint Peter	1
127	SC	4601	Crane	0	SC	Saint Philip	1
128	ST	4601	Hillaby	0	ST	Saint Thomas	1
129	01	201		1	ANVERS	Anvers	1
130	02	203		3	BRUXELLES-CAPITALE	Bruxelles-Capitale	1
131	03	202		2	BRABANT-WALLON	Brabant-Wallon	1
132	04	201		1	BRABANT-FLAMAND	Brabant-Flamand	1
133	05	201		1	FLANDRE-OCCIDENTALE	Flandre-Occidentale	1
134	06	201		1	FLANDRE-ORIENTALE	Flandre-Orientale	1
135	07	202		2	HAINAUT	Hainaut	1
136	08	202		2	LIEGE	Liège	1
137	09	202		1	LIMBOURG	Limbourg	1
138	10	202		2	LUXEMBOURG	Luxembourg	1
139	11	202		2	NAMUR	Namur	1
140	AC	5601	ACRE	0	AC	Acre	1
141	AL	5601	ALAGOAS	0	AL	Alagoas	1
142	AP	5601	AMAPA	0	AP	Amapá	1
143	AM	5601	AMAZONAS	0	AM	Amazonas	1
144	BA	5601	BAHIA	0	BA	Bahia	1
145	CE	5601	CEARA	0	CE	Ceará	1
146	ES	5601	ESPIRITO SANTO	0	ES	Espirito Santo	1
147	GO	5601	GOIAS	0	GO	Goiás	1
148	MA	5601	MARANHAO	0	MA	Maranhão	1
149	MT	5601	MATO GROSSO	0	MT	Mato Grosso	1
150	MS	5601	MATO GROSSO DO SUL	0	MS	Mato Grosso do Sul	1
151	MG	5601	MINAS GERAIS	0	MG	Minas Gerais	1
152	PA	5601	PARA	0	PA	Pará	1
153	PB	5601	PARAIBA	0	PB	Paraiba	1
154	PR	5601	PARANA	0	PR	Paraná	1
155	PE	5601	PERNAMBUCO	0	PE	Pernambuco	1
156	PI	5601	PIAUI	0	PI	Piauí	1
157	RJ	5601	RIO DE JANEIRO	0	RJ	Rio de Janeiro	1
158	RN	5601	RIO GRANDE DO NORTE	0	RN	Rio Grande do Norte	1
159	RS	5601	RIO GRANDE DO SUL	0	RS	Rio Grande do Sul	1
160	RO	5601	RONDONIA	0	RO	Rondônia	1
161	RR	5601	RORAIMA	0	RR	Roraima	1
162	SC	5601	SANTA CATARINA	0	SC	Santa Catarina	1
163	SE	5601	SERGIPE	0	SE	Sergipe	1
164	SP	5601	SAO PAULO	0	SP	Sao Paulo	1
165	TO	5601	TOCANTINS	0	TO	Tocantins	1
166	DF	5601	DISTRITO FEDERAL	0	DF	Distrito Federal	1
167	ON	1401		1		Ontario	1
168	QC	1401		1		Quebec	1
169	NS	1401		1		Nova Scotia	1
170	NB	1401		1		New Brunswick	1
171	MB	1401		1		Manitoba	1
172	BC	1401		1		British Columbia	1
173	PE	1401		1		Prince Edward Island	1
174	SK	1401		1		Saskatchewan	1
175	AB	1401		1		Alberta	1
176	NL	1401		1		Newfoundland and Labrador	1
177	011	6701		0	011	Iquique	1
178	014	6701		0	014	Tamarugal	1
179	021	6702		0	021	Antofagasa	1
180	022	6702		0	022	El Loa	1
181	023	6702		0	023	Tocopilla	1
182	031	6703		0	031	Copiapó	1
183	032	6703		0	032	Chañaral	1
184	033	6703		0	033	Huasco	1
185	041	6704		0	041	Elqui	1
186	042	6704		0	042	Choapa	1
187	043	6704		0	043	Limarí	1
188	051	6705		0	051	Valparaíso	1
189	052	6705		0	052	Isla de Pascua	1
190	053	6705		0	053	Los Andes	1
191	054	6705		0	054	Petorca	1
192	055	6705		0	055	Quillota	1
193	056	6705		0	056	San Antonio	1
194	057	6705		0	057	San Felipe de Aconcagua	1
195	058	6705		0	058	Marga Marga	1
196	061	6706		0	061	Cachapoal	1
197	062	6706		0	062	Cardenal Caro	1
198	063	6706		0	063	Colchagua	1
199	071	6707		0	071	Talca	1
200	072	6707		0	072	Cauquenes	1
201	073	6707		0	073	Curicó	1
202	074	6707		0	074	Linares	1
203	081	6708		0	081	Concepción	1
204	082	6708		0	082	Arauco	1
205	083	6708		0	083	Biobío	1
206	084	6708		0	084	Ñuble	1
207	091	6709		0	091	Cautín	1
208	092	6709		0	092	Malleco	1
209	101	6710		0	101	Llanquihue	1
210	102	6710		0	102	Chiloé	1
211	103	6710		0	103	Osorno	1
212	104	6710		0	104	Palena	1
213	111	6711		0	111	Coihaique	1
214	112	6711		0	112	Aisén	1
215	113	6711		0	113	Capitán Prat	1
216	114	6711		0	114	General Carrera	1
217	121	6712		0	121	Magallanes	1
218	122	6712		0	122	Antártica Chilena	1
219	123	6712		0	123	Tierra del Fuego	1
220	124	6712		0	124	Última Esperanza	1
221	131	6713		0	131	Santiago	1
222	132	6713		0	132	Cordillera	1
223	133	6713		0	133	Chacabuco	1
225	135	6713		0	135	Melipilla	1
226	136	6713		0	136	Talagante	1
227	141	6714		0	141	Valdivia	1
228	142	6714		0	142	Ranco	1
229	151	6715		0	151	Arica	1
230	152	6715		0	152	Parinacota	1
231	ANT	7001		0	ANT	Antioquia	1
232	BOL	7001		0	BOL	Bolívar	1
233	BOY	7001		0	BOY	Boyacá	1
234	CAL	7001		0	CAL	Caldas	1
235	CAU	7001		0	CAU	Cauca	1
236	CUN	7001		0	CUN	Cundinamarca	1
237	HUI	7001		0	HUI	Huila	1
238	LAG	7001		0	LAG	La Guajira	1
239	MET	7001		0	MET	Meta	1
240	NAR	7001		0	NAR	Nariño	1
241	NDS	7001		0	NDS	Norte de Santander	1
242	SAN	7001		0	SAN	Santander	1
243	SUC	7001		0	SUC	Sucre	1
244	TOL	7001		0	TOL	Tolima	1
245	VAC	7001		0	VAC	Valle del Cauca	1
246	RIS	7001		0	RIS	Risalda	1
247	ATL	7001		0	ATL	Atlántico	1
248	COR	7001		0	COR	Córdoba	1
249	SAP	7001		0	SAP	San Andrés, Providencia y Santa Catalina	1
250	ARA	7001		0	ARA	Arauca	1
251	CAS	7001		0	CAS	Casanare	1
252	AMA	7001		0	AMA	Amazonas	1
253	CAQ	7001		0	CAQ	Caquetá	1
254	CHO	7001		0	CHO	Chocó	1
255	GUA	7001		0	GUA	Guainía	1
256	GUV	7001		0	GUV	Guaviare	1
257	PUT	7001		0	PUT	Putumayo	1
258	QUI	7001		0	QUI	Quindío	1
259	VAU	7001		0	VAU	Vaupés	1
260	BOG	7001		0	BOG	Bogotá	1
261	VID	7001		0	VID	Vichada	1
262	CES	7001		0	CES	Cesar	1
263	MAG	7001		0	MAG	Magdalena	1
264	971	1	97105	3	GUADELOUPE	Guadeloupe	1
265	972	2	97209	3	MARTINIQUE	Martinique	1
266	973	3	97302	3	GUYANE	Guyane	1
267	974	4	97411	3	REUNION	Réunion	1
268	976	6	97601	3	MAYOTTE	Mayotte	1
269	01	84	01053	5	AIN	Ain	1
270	02	32	02408	5	AISNE	Aisne	1
271	03	84	03190	5	ALLIER	Allier	1
272	04	93	04070	4	ALPES-DE-HAUTE-PROVENCE	Alpes-de-Haute-Provence	1
273	05	93	05061	4	HAUTES-ALPES	Hautes-Alpes	1
274	06	93	06088	4	ALPES-MARITIMES	Alpes-Maritimes	1
275	07	84	07186	5	ARDECHE	Ardèche	1
276	08	44	08105	4	ARDENNES	Ardennes	1
277	09	76	09122	5	ARIEGE	Ariège	1
278	10	44	10387	5	AUBE	Aube	1
279	11	76	11069	5	AUDE	Aude	1
280	12	76	12202	5	AVEYRON	Aveyron	1
281	13	93	13055	4	BOUCHES-DU-RHONE	Bouches-du-Rhône	1
282	14	28	14118	2	CALVADOS	Calvados	1
283	15	84	15014	2	CANTAL	Cantal	1
284	16	75	16015	3	CHARENTE	Charente	1
285	17	75	17300	3	CHARENTE-MARITIME	Charente-Maritime	1
286	18	24	18033	2	CHER	Cher	1
287	19	75	19272	3	CORREZE	Corrèze	1
288	2A	94	2A004	3	CORSE-DU-SUD	Corse-du-Sud	1
289	2B	94	2B033	3	HAUTE-CORSE	Haute-Corse	1
290	21	27	21231	3	COTE-D OR	Côte-d Or	1
291	22	53	22278	4	COTES-D ARMOR	Côtes-d Armor	1
292	23	75	23096	3	CREUSE	Creuse	1
293	24	75	24322	3	DORDOGNE	Dordogne	1
294	25	27	25056	2	DOUBS	Doubs	1
295	26	84	26362	3	DROME	Drôme	1
296	27	28	27229	5	EURE	Eure	1
297	28	24	28085	1	EURE-ET-LOIR	Eure-et-Loir	1
298	29	53	29232	2	FINISTERE	Finistère	1
299	30	76	30189	2	GARD	Gard	1
300	31	76	31555	3	HAUTE-GARONNE	Haute-Garonne	1
301	32	76	32013	2	GERS	Gers	1
302	33	75	33063	3	GIRONDE	Gironde	1
303	34	76	34172	5	HERAULT	Hérault	1
304	35	53	35238	1	ILLE-ET-VILAINE	Ille-et-Vilaine	1
305	36	24	36044	5	INDRE	Indre	1
306	37	24	37261	1	INDRE-ET-LOIRE	Indre-et-Loire	1
307	38	84	38185	5	ISERE	Isère	1
308	39	27	39300	2	JURA	Jura	1
309	40	75	40192	4	LANDES	Landes	1
310	41	24	41018	0	LOIR-ET-CHER	Loir-et-Cher	1
311	42	84	42218	3	LOIRE	Loire	1
312	43	84	43157	3	HAUTE-LOIRE	Haute-Loire	1
313	44	52	44109	3	LOIRE-ATLANTIQUE	Loire-Atlantique	1
314	45	24	45234	2	LOIRET	Loiret	1
315	46	76	46042	2	LOT	Lot	1
316	47	75	47001	0	LOT-ET-GARONNE	Lot-et-Garonne	1
317	48	76	48095	3	LOZERE	Lozère	1
318	49	52	49007	0	MAINE-ET-LOIRE	Maine-et-Loire	1
319	50	28	50502	3	MANCHE	Manche	1
320	51	44	51108	3	MARNE	Marne	1
321	52	44	52121	3	HAUTE-MARNE	Haute-Marne	1
322	53	52	53130	3	MAYENNE	Mayenne	1
323	54	44	54395	0	MEURTHE-ET-MOSELLE	Meurthe-et-Moselle	1
324	55	44	55029	3	MEUSE	Meuse	1
325	56	53	56260	2	MORBIHAN	Morbihan	1
326	57	44	57463	3	MOSELLE	Moselle	1
327	58	27	58194	3	NIEVRE	Nièvre	1
328	59	32	59350	2	NORD	Nord	1
329	60	32	60057	5	OISE	Oise	1
330	61	28	61001	5	ORNE	Orne	1
331	62	32	62041	2	PAS-DE-CALAIS	Pas-de-Calais	1
332	63	84	63113	2	PUY-DE-DOME	Puy-de-Dôme	1
333	64	75	64445	4	PYRENEES-ATLANTIQUES	Pyrénées-Atlantiques	1
334	65	76	65440	4	HAUTES-PYRENEES	Hautes-Pyrénées	1
335	66	76	66136	4	PYRENEES-ORIENTALES	Pyrénées-Orientales	1
336	67	44	67482	2	BAS-RHIN	Bas-Rhin	1
337	68	44	68066	2	HAUT-RHIN	Haut-Rhin	1
338	69	84	69123	2	RHONE	Rhône	1
339	70	27	70550	3	HAUTE-SAONE	Haute-Saône	1
340	71	27	71270	0	SAONE-ET-LOIRE	Saône-et-Loire	1
341	72	52	72181	3	SARTHE	Sarthe	1
342	73	84	73065	3	SAVOIE	Savoie	1
343	74	84	74010	3	HAUTE-SAVOIE	Haute-Savoie	1
344	75	11	75056	0	PARIS	Paris	1
345	76	28	76540	3	SEINE-MARITIME	Seine-Maritime	1
346	77	11	77288	0	SEINE-ET-MARNE	Seine-et-Marne	1
347	78	11	78646	4	YVELINES	Yvelines	1
348	79	75	79191	4	DEUX-SEVRES	Deux-Sèvres	1
349	80	32	80021	3	SOMME	Somme	1
350	81	76	81004	2	TARN	Tarn	1
351	82	76	82121	0	TARN-ET-GARONNE	Tarn-et-Garonne	1
352	83	93	83137	2	VAR	Var	1
353	84	93	84007	0	VAUCLUSE	Vaucluse	1
354	85	52	85191	3	VENDEE	Vendée	1
355	86	75	86194	3	VIENNE	Vienne	1
356	87	75	87085	3	HAUTE-VIENNE	Haute-Vienne	1
357	88	44	88160	4	VOSGES	Vosges	1
358	89	27	89024	5	YONNE	Yonne	1
359	90	27	90010	0	TERRITOIRE DE BELFORT	Territoire de Belfort	1
360	91	11	91228	5	ESSONNE	Essonne	1
361	92	11	92050	4	HAUTS-DE-SEINE	Hauts-de-Seine	1
362	93	11	93008	3	SEINE-SAINT-DENIS	Seine-Saint-Denis	1
363	94	11	94028	2	VAL-DE-MARNE	Val-de-Marne	1
364	95	11	95500	2	VAL-D OISE	Val-d Oise	1
365	BW	501	\N	\N	BADEN-WÜRTTEMBERG	Baden-Württemberg	1
366	BY	501	\N	\N	BAYERN	Bayern	1
367	BE	501	\N	\N	BERLIN	Berlin	1
368	BB	501	\N	\N	BRANDENBURG	Brandenburg	1
369	HB	501	\N	\N	BREMEN	Bremen	1
370	HH	501	\N	\N	HAMBURG	Hamburg	1
371	HE	501	\N	\N	HESSEN	Hessen	1
372	MV	501	\N	\N	MECKLENBURG-VORPOMMERN	Mecklenburg-Vorpommern	1
373	NI	501	\N	\N	NIEDERSACHSEN	Niedersachsen	1
374	NW	501	\N	\N	NORDRHEIN-WESTFALEN	Nordrhein-Westfalen	1
375	RP	501	\N	\N	RHEINLAND-PFALZ	Rheinland-Pfalz	1
376	SL	501	\N	\N	SAARLAND	Saarland	1
377	SN	501	\N	\N	SACHSEN	Sachsen	1
378	ST	501	\N	\N	SACHSEN-ANHALT	Sachsen-Anhalt	1
379	SH	501	\N	\N	SCHLESWIG-HOLSTEIN	Schleswig-Holstein	1
380	TH	501	\N	\N	THÜRINGEN	Thüringen	1
381	AT	11401		0	AT	Atlántida	1
382	CH	11401		0	CH	Choluteca	1
383	CL	11401		0	CL	Colón	1
384	CM	11401		0	CM	Comayagua	1
385	CO	11401		0	CO	Copán	1
386	CR	11401		0	CR	Cortés	1
387	EP	11401		0	EP	El Paraíso	1
388	FM	11401		0	FM	Francisco Morazán	1
389	GD	11401		0	GD	Gracias a Dios	1
390	IN	11401		0	IN	Intibucá	1
391	IB	11401		0	IB	Islas de la Bahía	1
392	LP	11401		0	LP	La Paz	1
393	LM	11401		0	LM	Lempira	1
394	OC	11401		0	OC	Ocotepeque	1
395	OL	11401		0	OL	Olancho	1
396	SB	11401		0	SB	Santa Bárbara	1
397	VL	11401		0	VL	Valle	1
398	YO	11401		0	YO	Yoro	1
399	DC	11401		0	DC	Distrito Central	1
400	HU-BU	180100	HU101	\N	\N	Budapest	1
401	HU-PE	180100	HU102	\N	\N	Pest	1
402	HU-FE	182100	HU211	\N	\N	Fejér	1
403	HU-KE	182100	HU212	\N	\N	Komárom-Esztergom	1
404	HU-VE	182100	HU213	\N	\N	Veszprém	1
405	HU-GS	182200	HU221	\N	\N	Győr-Moson-Sopron	1
406	HU-VA	182200	HU222	\N	\N	Vas	1
407	HU-ZA	182200	HU223	\N	\N	Zala	1
408	HU-BA	182300	HU231	\N	\N	Baranya	1
409	HU-SO	182300	HU232	\N	\N	Somogy	1
410	HU-TO	182300	HU233	\N	\N	Tolna	1
411	HU-BZ	183100	HU311	\N	\N	Borsod-Abaúj-Zemplén	1
412	HU-HE	183100	HU312	\N	\N	Heves	1
413	HU-NO	183100	HU313	\N	\N	Nógrád	1
414	HU-HB	183200	HU321	\N	\N	Hajdú-Bihar	1
415	HU-JN	183200	HU322	\N	\N	Jász-Nagykun-Szolnok	1
416	HU-SZ	183200	HU323	\N	\N	Szabolcs-Szatmár-Bereg	1
417	HU-BK	183300	HU331	\N	\N	Bács-Kiskun	1
418	HU-BE	183300	HU332	\N	\N	Békés	1
419	HU-CS	183300	HU333	\N	\N	Csongrád	1
420	AG	315	\N	\N	\N	AGRIGENTO	1
421	AL	312	\N	\N	\N	ALESSANDRIA	1
422	AN	310	\N	\N	\N	ANCONA	1
423	AO	319	\N	\N	\N	AOSTA	1
424	AR	316	\N	\N	\N	AREZZO	1
425	AP	310	\N	\N	\N	ASCOLI PICENO	1
426	AT	312	\N	\N	\N	ASTI	1
427	AV	304	\N	\N	\N	AVELLINO	1
428	BA	313	\N	\N	\N	BARI	1
429	BT	313	\N	\N	\N	BARLETTA-ANDRIA-TRANI	1
430	BL	320	\N	\N	\N	BELLUNO	1
431	BN	304	\N	\N	\N	BENEVENTO	1
432	BG	309	\N	\N	\N	BERGAMO	1
433	BI	312	\N	\N	\N	BIELLA	1
434	BO	305	\N	\N	\N	BOLOGNA	1
435	BZ	317	\N	\N	\N	BOLZANO	1
436	BS	309	\N	\N	\N	BRESCIA	1
437	BR	313	\N	\N	\N	BRINDISI	1
438	CA	314	\N	\N	\N	CAGLIARI	1
439	CL	315	\N	\N	\N	CALTANISSETTA	1
440	CB	311	\N	\N	\N	CAMPOBASSO	1
441	CI	314	\N	\N	\N	CARBONIA-IGLESIAS	1
442	CE	304	\N	\N	\N	CASERTA	1
443	CT	315	\N	\N	\N	CATANIA	1
444	CZ	303	\N	\N	\N	CATANZARO	1
445	CH	301	\N	\N	\N	CHIETI	1
446	CO	309	\N	\N	\N	COMO	1
447	CS	303	\N	\N	\N	COSENZA	1
448	CR	309	\N	\N	\N	CREMONA	1
449	KR	303	\N	\N	\N	CROTONE	1
450	CN	312	\N	\N	\N	CUNEO	1
451	EN	315	\N	\N	\N	ENNA	1
452	FM	310	\N	\N	\N	FERMO	1
453	FE	305	\N	\N	\N	FERRARA	1
454	FI	316	\N	\N	\N	FIRENZE	1
455	FG	313	\N	\N	\N	FOGGIA	1
456	FC	305	\N	\N	\N	FORLI-CESENA	1
457	FR	307	\N	\N	\N	FROSINONE	1
458	GE	308	\N	\N	\N	GENOVA	1
459	GO	306	\N	\N	\N	GORIZIA	1
460	GR	316	\N	\N	\N	GROSSETO	1
461	IM	308	\N	\N	\N	IMPERIA	1
462	IS	311	\N	\N	\N	ISERNIA	1
463	SP	308	\N	\N	\N	LA SPEZIA	1
464	AQ	301	\N	\N	\N	L AQUILA	1
465	LT	307	\N	\N	\N	LATINA	1
466	LE	313	\N	\N	\N	LECCE	1
467	LC	309	\N	\N	\N	LECCO	1
468	LI	316	\N	\N	\N	LIVORNO	1
469	LO	309	\N	\N	\N	LODI	1
470	LU	316	\N	\N	\N	LUCCA	1
471	MC	310	\N	\N	\N	MACERATA	1
472	MN	309	\N	\N	\N	MANTOVA	1
473	MS	316	\N	\N	\N	MASSA-CARRARA	1
474	MT	302	\N	\N	\N	MATERA	1
475	VS	314	\N	\N	\N	MEDIO CAMPIDANO	1
476	ME	315	\N	\N	\N	MESSINA	1
477	MI	309	\N	\N	\N	MILANO	1
478	MB	309	\N	\N	\N	MONZA e BRIANZA	1
479	MO	305	\N	\N	\N	MODENA	1
480	NA	304	\N	\N	\N	NAPOLI	1
481	NO	312	\N	\N	\N	NOVARA	1
482	NU	314	\N	\N	\N	NUORO	1
483	OG	314	\N	\N	\N	OGLIASTRA	1
484	OT	314	\N	\N	\N	OLBIA-TEMPIO	1
485	OR	314	\N	\N	\N	ORISTANO	1
486	PD	320	\N	\N	\N	PADOVA	1
487	PA	315	\N	\N	\N	PALERMO	1
488	PR	305	\N	\N	\N	PARMA	1
489	PV	309	\N	\N	\N	PAVIA	1
490	PG	318	\N	\N	\N	PERUGIA	1
491	PU	310	\N	\N	\N	PESARO e URBINO	1
492	PE	301	\N	\N	\N	PESCARA	1
493	PC	305	\N	\N	\N	PIACENZA	1
494	PI	316	\N	\N	\N	PISA	1
495	PT	316	\N	\N	\N	PISTOIA	1
496	PN	306	\N	\N	\N	PORDENONE	1
497	PZ	302	\N	\N	\N	POTENZA	1
498	PO	316	\N	\N	\N	PRATO	1
499	RG	315	\N	\N	\N	RAGUSA	1
500	RA	305	\N	\N	\N	RAVENNA	1
501	RC	303	\N	\N	\N	REGGIO CALABRIA	1
502	RE	305	\N	\N	\N	REGGIO NELL EMILIA	1
503	RI	307	\N	\N	\N	RIETI	1
504	RN	305	\N	\N	\N	RIMINI	1
505	RM	307	\N	\N	\N	ROMA	1
506	RO	320	\N	\N	\N	ROVIGO	1
507	SA	304	\N	\N	\N	SALERNO	1
508	SS	314	\N	\N	\N	SASSARI	1
509	SV	308	\N	\N	\N	SAVONA	1
510	SI	316	\N	\N	\N	SIENA	1
511	SR	315	\N	\N	\N	SIRACUSA	1
512	SO	309	\N	\N	\N	SONDRIO	1
513	TA	313	\N	\N	\N	TARANTO	1
514	TE	301	\N	\N	\N	TERAMO	1
515	TR	318	\N	\N	\N	TERNI	1
516	TO	312	\N	\N	\N	TORINO	1
517	TP	315	\N	\N	\N	TRAPANI	1
518	TN	317	\N	\N	\N	TRENTO	1
519	TV	320	\N	\N	\N	TREVISO	1
520	TS	306	\N	\N	\N	TRIESTE	1
521	UD	306	\N	\N	\N	UDINE	1
522	VA	309	\N	\N	\N	VARESE	1
523	VE	320	\N	\N	\N	VENEZIA	1
524	VB	312	\N	\N	\N	VERBANO-CUSIO-OSSOLA	1
525	VC	312	\N	\N	\N	VERCELLI	1
526	VR	320	\N	\N	\N	VERONA	1
527	VV	303	\N	\N	\N	VIBO VALENTIA	1
528	VI	320	\N	\N	\N	VICENZA	1
529	VT	307	\N	\N	\N	VITERBO	1
530	LU0001	14001		0		Clervaux	1
531	LU0002	14001		0		Diekirch	1
532	LU0003	14001		0		Redange	1
533	LU0004	14001		0		Vianden	1
534	LU0005	14001		0		Wiltz	1
535	LU0006	14002		0		Echternach	1
536	LU0007	14002		0		Grevenmacher	1
537	LU0008	14002		0		Remich	1
538	LU0009	14003		0		Capellen	1
539	LU0010	14003		0		Esch-sur-Alzette	1
540	LU0011	14003		0		Luxembourg	1
541	LU0012	14003		0		Mersch	1
542	MA	1209		0		Province de Benslimane	1
543	MA1	1209		0		Province de Berrechid	1
544	MA2	1209		0		Province de Khouribga	1
545	MA3	1209		0		Province de Settat	1
546	MA4	1210		0		Province d'El Jadida	1
547	MA5	1210		0		Province de Safi	1
548	MA6	1210		0		Province de Sidi Bennour	1
549	MA7	1210		0		Province de Youssoufia	1
550	MA6B	1205		0		Préfecture de Fès	1
551	MA7B	1205		0		Province de Boulemane	1
552	MA8	1205		0		Province de Moulay Yacoub	1
553	MA9	1205		0		Province de Sefrou	1
554	MA8A	1202		0		Province de Kénitra	1
555	MA9A	1202		0		Province de Sidi Kacem	1
556	MA10	1202		0		Province de Sidi Slimane	1
557	MA11	1208		0		Préfecture de Casablanca	1
558	MA12	1208		0		Préfecture de Mohammédia	1
559	MA13	1208		0		Province de Médiouna	1
560	MA14	1208		0		Province de Nouaceur	1
561	MA15	1214		0		Province d'Assa-Zag	1
562	MA16	1214		0		Province d'Es-Semara	1
563	MA17A	1214		0		Province de Guelmim	1
564	MA18	1214		0		Province de Tata	1
565	MA19	1214		0		Province de Tan-Tan	1
566	MA15	1215		0		Province de Boujdour	1
567	MA16	1215		0		Province de Lâayoune	1
568	MA17	1215		0		Province de Tarfaya	1
569	MA18	1211		0		Préfecture de Marrakech	1
570	MA19	1211		0		Province d'Al Haouz	1
571	MA20	1211		0		Province de Chichaoua	1
572	MA21	1211		0		Province d'El Kelâa des Sraghna	1
573	MA22	1211		0		Province d'Essaouira	1
574	MA23	1211		0		Province de Rehamna	1
575	MA24	1206		0		Préfecture de Meknès	1
576	MA25	1206		0		Province d’El Hajeb	1
577	MA26	1206		0		Province d'Errachidia	1
578	MA27	1206		0		Province d’Ifrane	1
579	MA28	1206		0		Province de Khénifra	1
580	MA29	1206		0		Province de Midelt	1
581	MA30	1204		0		Préfecture d'Oujda-Angad	1
582	MA31	1204		0		Province de Berkane	1
583	MA32	1204		0		Province de Driouch	1
584	MA33	1204		0		Province de Figuig	1
585	MA34	1204		0		Province de Jerada	1
586	MA35	1204		0		Province de Nador	1
587	MA36	1204		0		Province de Taourirt	1
588	MA37	1216		0		Province d'Aousserd	1
589	MA38	1216		0		Province d'Oued Ed-Dahab	1
590	MA39	1207		0		Préfecture de Rabat	1
591	MA40	1207		0		Préfecture de Skhirat-Témara	1
592	MA41	1207		0		Préfecture de Salé	1
593	MA42	1207		0		Province de Khémisset	1
594	MA43	1213		0		Préfecture d'Agadir Ida-Outanane	1
595	MA44	1213		0		Préfecture d'Inezgane-Aït Melloul	1
596	MA45	1213		0		Province de Chtouka-Aït Baha	1
597	MA46	1213		0		Province d'Ouarzazate	1
598	MA47	1213		0		Province de Sidi Ifni	1
599	MA48	1213		0		Province de Taroudant	1
600	MA49	1213		0		Province de Tinghir	1
601	MA50	1213		0		Province de Tiznit	1
602	MA51	1213		0		Province de Zagora	1
603	MA52	1212		0		Province d'Azilal	1
604	MA53	1212		0		Province de Beni Mellal	1
605	MA54	1212		0		Province de Fquih Ben Salah	1
606	MA55	1201		0		Préfecture de M'diq-Fnideq	1
607	MA56	1201		0		Préfecture de Tanger-Asilah	1
608	MA57	1201		0		Province de Chefchaouen	1
609	MA58	1201		0		Province de Fahs-Anjra	1
610	MA59	1201		0		Province de Larache	1
611	MA60	1201		0		Province d'Ouezzane	1
612	MA61	1201		0		Province de Tétouan	1
613	MA62	1203		0		Province de Guercif	1
614	MA63	1203		0		Province d'Al Hoceïma	1
615	MA64	1203		0		Province de Taounate	1
616	MA65	1203		0		Province de Taza	1
617	MA6A	1205		0		Préfecture de Fès	1
618	MA7A	1205		0		Province de Boulemane	1
619	MA15A	1214		0		Province d'Assa-Zag	1
620	MA16A	1214		0		Province d'Es-Semara	1
621	MA18A	1211		0		Préfecture de Marrakech	1
622	MA19A	1214		0		Province de Tan-Tan	1
623	MA19B	1214		0		Province de Tan-Tan	1
624	GR	1701	\N	\N	\N	Groningen	1
625	FR	1701	\N	\N	\N	Friesland	1
626	DR	1701	\N	\N	\N	Drenthe	1
627	OV	1701	\N	\N	\N	Overijssel	1
628	GD	1701	\N	\N	\N	Gelderland	1
629	FL	1701	\N	\N	\N	Flevoland	1
630	UT	1701	\N	\N	\N	Utrecht	1
631	NH	1701	\N	\N	\N	Noord-Holland	1
632	ZH	1701	\N	\N	\N	Zuid-Holland	1
633	ZL	1701	\N	\N	\N	Zeeland	1
634	NB	1701	\N	\N	\N	Noord-Brabant	1
635	LB	1701	\N	\N	\N	Limburg	1
636	PA-1	17801		0		Bocas del Toro	1
637	PA-2	17801		0		Coclé	1
638	PA-3	17801		0		Colón	1
639	PA-4	17801		0		Chiriquí	1
640	PA-5	17801		0		Darién	1
641	PA-6	17801		0		Herrera	1
642	PA-7	17801		0		Los Santos	1
643	PA-8	17801		0		Panamá	1
644	PA-9	17801		0		Veraguas	1
645	PA-13	17801		0		Panamá Oeste	1
646	0101	18101		0		Chachapoyas	1
647	0102	18101		0		Bagua	1
648	0103	18101		0		Bongará	1
649	0104	18101		0		Condorcanqui	1
650	0105	18101		0		Luya	1
651	0106	18101		0		Rodríguez de Mendoza	1
652	0107	18101		0		Utcubamba	1
653	0201	18102		0		Huaraz	1
654	0202	18102		0		Aija	1
655	0203	18102		0		Antonio Raymondi	1
656	0204	18102		0		Asunción	1
657	0205	18102		0		Bolognesi	1
658	0206	18102		0		Carhuaz	1
659	0207	18102		0		Carlos Fermín Fitzcarrald	1
660	0208	18102		0		Casma	1
661	0209	18102		0		Corongo	1
662	0210	18102		0		Huari	1
663	0211	18102		0		Huarmey	1
664	0212	18102		0		Huaylas	1
665	0213	18102		0		Mariscal Luzuriaga	1
666	0214	18102		0		Ocros	1
667	0215	18102		0		Pallasca	1
668	0216	18102		0		Pomabamba	1
669	0217	18102		0		Recuay	1
670	0218	18102		0		Papá	1
671	0219	18102		0		Sihuas	1
672	0220	18102		0		Yungay	1
673	0301	18103		0		Abancay	1
674	0302	18103		0		Andahuaylas	1
675	0303	18103		0		Antabamba	1
676	0304	18103		0		Aymaraes	1
677	0305	18103		0		Cotabambas	1
678	0306	18103		0		Chincheros	1
679	0307	18103		0		Grau	1
680	0401	18104		0		Arequipa	1
681	0402	18104		0		Camaná	1
682	0403	18104		0		Caravelí	1
683	0404	18104		0		Castilla	1
684	0405	18104		0		Caylloma	1
685	0406	18104		0		Condesuyos	1
686	0407	18104		0		Islay	1
687	0408	18104		0		La Unión	1
688	0501	18105		0		Huamanga	1
689	0502	18105		0		Cangallo	1
690	0503	18105		0		Huanca Sancos	1
691	0504	18105		0		Huanta	1
692	0505	18105		0		La Mar	1
693	0506	18105		0		Lucanas	1
694	0507	18105		0		Parinacochas	1
695	0508	18105		0		Páucar del Sara Sara	1
696	0509	18105		0		Sucre	1
697	0510	18105		0		Víctor Fajardo	1
698	0511	18105		0		Vilcas Huamán	1
699	0601	18106		0		Cajamarca	1
700	0602	18106		0		Cajabamba	1
701	0603	18106		0		Celendín	1
702	0604	18106		0		Chota	1
703	0605	18106		0		Contumazá	1
704	0606	18106		0		Cutervo	1
705	0607	18106		0		Hualgayoc	1
706	0608	18106		0		Jaén	1
707	0609	18106		0		San Ignacio	1
708	0610	18106		0		San Marcos	1
709	0611	18106		0		San Miguel	1
710	0612	18106		0		San Pablo	1
711	0613	18106		0		Santa Cruz	1
712	0701	18107		0		Callao	1
713	0801	18108		0		Cusco	1
714	0802	18108		0		Acomayo	1
715	0803	18108		0		Anta	1
716	0804	18108		0		Calca	1
717	0805	18108		0		Canas	1
718	0806	18108		0		Canchis	1
719	0807	18108		0		Chumbivilcas	1
720	0808	18108		0		Espinar	1
721	0809	18108		0		La Convención	1
722	0810	18108		0		Paruro	1
723	0811	18108		0		Paucartambo	1
724	0812	18108		0		Quispicanchi	1
725	0813	18108		0		Urubamba	1
726	0901	18109		0		Huancavelica	1
727	0902	18109		0		Acobamba	1
728	0903	18109		0		Angaraes	1
729	0904	18109		0		Castrovirreyna	1
730	0905	18109		0		Churcampa	1
731	0906	18109		0		Huaytará	1
732	0907	18109		0		Tayacaja	1
733	1001	18110		0		Huánuco	1
734	1002	18110		0		Ambón	1
735	1003	18110		0		Dos de Mayo	1
736	1004	18110		0		Huacaybamba	1
737	1005	18110		0		Huamalíes	1
738	1006	18110		0		Leoncio Prado	1
739	1007	18110		0		Marañón	1
740	1008	18110		0		Pachitea	1
741	1009	18110		0		Puerto Inca	1
742	1010	18110		0		Lauricocha	1
743	1011	18110		0		Yarowilca	1
744	1101	18111		0		Ica	1
745	1102	18111		0		Chincha	1
746	1103	18111		0		Nazca	1
747	1104	18111		0		Palpa	1
748	1105	18111		0		Pisco	1
749	1201	18112		0		Huancayo	1
750	1202	18112		0		Concepción	1
751	1203	18112		0		Chanchamayo	1
752	1204	18112		0		Jauja	1
753	1205	18112		0		Junín	1
754	1206	18112		0		Satipo	1
755	1207	18112		0		Tarma	1
756	1208	18112		0		Yauli	1
757	1209	18112		0		Chupaca	1
758	1301	18113		0		Trujillo	1
759	1302	18113		0		Ascope	1
760	1303	18113		0		Bolívar	1
761	1304	18113		0		Chepén	1
762	1305	18113		0		Julcán	1
763	1306	18113		0		Otuzco	1
764	1307	18113		0		Pacasmayo	1
765	1308	18113		0		Pataz	1
766	1309	18113		0		Sánchez Carrión	1
767	1310	18113		0		Santiago de Chuco	1
768	1311	18113		0		Gran Chimú	1
769	1312	18113		0		Virú	1
770	1401	18114		0		Chiclayo	1
771	1402	18114		0		Ferreñafe	1
772	1403	18114		0		Lambayeque	1
773	1501	18115		0		Lima	1
774	1502	18116		0		Huaura	1
775	1503	18116		0		Barranca	1
776	1504	18116		0		Cajatambo	1
777	1505	18116		0		Canta	1
778	1506	18116		0		Cañete	1
779	1507	18116		0		Huaral	1
780	1508	18116		0		Huarochirí	1
781	1509	18116		0		Oyón	1
782	1510	18116		0		Yauyos	1
783	1601	18117		0		Maynas	1
784	1602	18117		0		Alto Amazonas	1
785	1603	18117		0		Loreto	1
786	1604	18117		0		Mariscal Ramón Castilla	1
787	1605	18117		0		Requena	1
788	1606	18117		0		Ucayali	1
789	1607	18117		0		Datem del Marañón	1
790	1701	18118		0		Tambopata	1
791	1702	18118		0		Manú	1
792	1703	18118		0		Tahuamanu	1
793	1801	18119		0		Mariscal Nieto	1
794	1802	18119		0		General Sánchez Cerro	1
795	1803	18119		0		Ilo	1
796	1901	18120		0		Pasco	1
797	1902	18120		0		Daniel Alcides Carrión	1
798	1903	18120		0		Oxapampa	1
799	2001	18121		0		Piura	1
800	2002	18121		0		Ayabaca	1
801	2003	18121		0		Huancabamba	1
802	2004	18121		0		Morropón	1
803	2005	18121		0		Paita	1
804	2006	18121		0		Sullana	1
805	2007	18121		0		Talara	1
806	2008	18121		0		Sechura	1
807	2101	18122		0		Puno	1
808	2102	18122		0		Azángaro	1
809	2103	18122		0		Carabaya	1
810	2104	18122		0		Chucuito	1
811	2105	18122		0		El Collao	1
812	2106	18122		0		Huancané	1
813	2107	18122		0		Lampa	1
814	2108	18122		0		Melgar	1
815	2109	18122		0		Moho	1
816	2110	18122		0		San Antonio de Putina	1
817	2111	18122		0		San Román	1
818	2112	18122		0		Sandia	1
819	2113	18122		0		Yunguyo	1
820	2201	18123		0		Moyobamba	1
821	2202	18123		0		Bellavista	1
822	2203	18123		0		El Dorado	1
823	2204	18123		0		Huallaga	1
824	2205	18123		0		Lamas	1
825	2206	18123		0		Mariscal Cáceres	1
826	2207	18123		0		Picota	1
827	2208	18123		0		La Rioja	1
828	2209	18123		0		San Martín	1
829	2210	18123		0		Tocache	1
830	2301	18124		0		Tacna	1
831	2302	18124		0		Candarave	1
832	2303	18124		0		Jorge Basadre	1
833	2304	18124		0		Tarata	1
834	2401	18125		0		Tumbes	1
835	2402	18125		0		Contralmirante Villar	1
836	2403	18125		0		Zarumilla	1
837	2501	18126		0		Coronel Portillo	1
838	2502	18126		0		Atalaya	1
839	2503	18126		0		Padre Abad	1
840	2504	18126		0		Purús	1
841	PT-AV	15001	\N	\N	AVEIRO	Aveiro	1
842	PT-AC	15002	\N	\N	AZORES	Azores	1
843	PT-BE	15001	\N	\N	BEJA	Beja	1
844	PT-BR	15001	\N	\N	BRAGA	Braga	1
845	PT-BA	15001	\N	\N	BRAGANCA	Bragança	1
846	PT-CB	15001	\N	\N	CASTELO BRANCO	Castelo Branco	1
847	PT-CO	15001	\N	\N	COIMBRA	Coimbra	1
848	PT-EV	15001	\N	\N	EVORA	Évora	1
849	PT-FA	15001	\N	\N	FARO	Faro	1
850	PT-GU	15001	\N	\N	GUARDA	Guarda	1
851	PT-LE	15001	\N	\N	LEIRIA	Leiria	1
852	PT-LI	15001	\N	\N	LISBON	Lisboa	1
853	PT-AML	15001	\N	\N	AREA METROPOLITANA LISBOA	Área Metropolitana de Lisboa	1
854	PT-MA	15002	\N	\N	MADEIRA	Madeira	1
855	PT-PA	15001	\N	\N	PORTALEGRE	Portalegre	1
856	PT-PO	15001	\N	\N	PORTO	Porto	1
857	PT-SA	15001	\N	\N	SANTAREM	Santarém	1
858	PT-SE	15001	\N	\N	SETUBAL	Setúbal	1
859	PT-VC	15001	\N	\N	VIANA DO CASTELO	Viana Do Castelo	1
860	PT-VR	15001	\N	\N	VILA REAL	Vila Real	1
861	PT-VI	15001	\N	\N	VISEU	Viseu	1
862	AB	18801		0		Alba	1
863	AR	18801		0		Arad	1
864	AG	18801		0		Argeș	1
865	BC	18801		0		Bacău	1
866	BH	18801		0		Bihor	1
867	BN	18801		0		Bistrița-Năsăud	1
868	BT	18801		0		Botoșani	1
869	BV	18801		0		Brașov	1
870	BR	18801		0		Brăila	1
871	BU	18801		0		Bucuresti	1
872	BZ	18801		0		Buzău	1
873	CL	18801		0		Călărași	1
874	CS	18801		0		Caraș-Severin	1
875	CJ	18801		0		Cluj	1
876	CT	18801		0		Constanța	1
877	CV	18801		0		Covasna	1
878	DB	18801		0		Dâmbovița	1
879	DJ	18801		0		Dolj	1
880	GL	18801		0		Galați	1
881	GR	18801		0		Giurgiu	1
882	GJ	18801		0		Gorj	1
883	HR	18801		0		Harghita	1
884	HD	18801		0		Hunedoara	1
885	IL	18801		0		Ialomița	1
886	IS	18801		0		Iași	1
887	IF	18801		0		Ilfov	1
888	MM	18801		0		Maramureș	1
889	MH	18801		0		Mehedinți	1
890	MS	18801		0		Mureș	1
891	NT	18801		0		Neamț	1
892	OT	18801		0		Olt	1
893	PH	18801		0		Prahova	1
894	SM	18801		0		Satu Mare	1
895	SJ	18801		0		Sălaj	1
896	SB	18801		0		Sibiu	1
897	SV	18801		0		Suceava	1
898	TR	18801		0		Teleorman	1
899	TM	18801		0		Timiș	1
900	TL	18801		0		Tulcea	1
901	VS	18801		0		Vaslui	1
902	VL	18801		0		Vâlcea	1
903	VN	18801		0		Vrancea	1
904	SI031	20203	\N	\N	MURA	Mura	1
905	SI032	20203	\N	\N	DRAVA	Drava	1
906	SI033	20203	\N	\N	CARINTHIA	Carinthia	1
907	SI034	20203	\N	\N	SAVINJA	Savinja	1
908	SI035	20203	\N	\N	CENTRAL SAVA	Central Sava	1
909	SI036	20203	\N	\N	LOWER SAVA	Lower Sava	1
910	SI037	20203	\N	\N	SOUTHEAST SLOVENIA	Southeast Slovenia	1
911	SI038	20203	\N	\N	LITTORAL–INNER CARNIOLA	Littoral–Inner Carniola	1
912	SI041	20204	\N	\N	CENTRAL SLOVENIA	Central Slovenia	1
913	SI038	20204	\N	\N	UPPER CARNIOLA	Upper Carniola	1
914	SI043	20204	\N	\N	GORIZIA	Gorizia	1
915	SI044	20204	\N	\N	COASTAL–KARST	Coastal–Karst	1
916	TW-KLU	21301	KLU	\N	\N	基隆市	1
917	TW-TPE	21301	TPE	\N	\N	臺北市	1
918	TW-TPH	21301	TPH	\N	\N	新北市	1
919	TW-TYC	21301	TYC	\N	\N	桃園市	1
920	TW-HSH	21301	HSH	\N	\N	新竹縣	1
921	TW-HSC	21301	HSC	\N	\N	新竹市	1
922	TW-MAL	21301	MAL	\N	\N	苗栗縣	1
923	TW-MAC	21301	MAC	\N	\N	苗栗市	1
924	TW-TXG	21301	TXG	\N	\N	臺中市	1
925	TW-CWH	21301	CWH	\N	\N	彰化縣	1
926	TW-CWS	21301	CWS	\N	\N	彰化市	1
927	TW-NTC	21301	NTC	\N	\N	南投市	1
928	TW-NTO	21301	NTO	\N	\N	南投縣	1
929	TW-YLH	21301	YLH	\N	\N	雲林縣	1
930	TW-CHY	21301	CHY	\N	\N	嘉義縣	1
931	TW-CYI	21301	CYI	\N	\N	嘉義市	1
932	TW-TNN	21301	TNN	\N	\N	臺南市	1
933	TW-KHH	21301	KHH	\N	\N	高雄市	1
934	TW-IUH	21301	IUH	\N	\N	屏東縣	1
935	TW-PTS	21301	PTS	\N	\N	屏東市	1
936	TW-ILN	21301	ILN	\N	\N	宜蘭縣	1
937	TW-ILC	21301	ILC	\N	\N	宜蘭市	1
938	TW-HWA	21301	HWA	\N	\N	花蓮縣	1
939	TW-HWC	21301	HWC	\N	\N	花蓮市	1
940	TW-TTC	21301	TTC	\N	\N	臺東市	1
941	TW-TTT	21301	TTT	\N	\N	臺東縣	1
942	TW-PEH	21301	PEH	\N	\N	澎湖縣	1
943	TW-GNI	21301	GNI	\N	\N	綠島	1
944	TW-KYD	21301	KYD	\N	\N	蘭嶼	1
945	TW-KMN	21301	KMN	\N	\N	金門縣	1
946	TW-LNN	21301	LNN	\N	\N	連江縣	1
947	TN01	1001		0		Ariana	1
948	TN02	1001		0		Béja	1
949	TN03	1001		0		Ben Arous	1
950	TN04	1001		0		Bizerte	1
951	TN05	1001		0		Gabès	1
952	TN06	1001		0		Gafsa	1
953	TN07	1001		0		Jendouba	1
954	TN08	1001		0		Kairouan	1
955	TN09	1001		0		Kasserine	1
956	TN10	1001		0		Kébili	1
957	TN11	1001		0		La Manouba	1
958	TN12	1001		0		Le Kef	1
959	TN13	1001		0		Mahdia	1
960	TN14	1001		0		Médenine	1
961	TN15	1001		0		Monastir	1
962	TN16	1001		0		Nabeul	1
963	TN17	1001		0		Sfax	1
964	TN18	1001		0		Sidi Bouzid	1
965	TN19	1001		0		Siliana	1
966	TN20	1001		0		Sousse	1
967	TN21	1001		0		Tataouine	1
968	TN22	1001		0		Tozeur	1
969	TN23	1001		0		Tunis	1
970	TN24	1001		0		Zaghouan	1
971	AL	1101		0	ALABAMA	Alabama	1
972	AK	1101		0	ALASKA	Alaska	1
973	AZ	1101		0	ARIZONA	Arizona	1
974	AR	1101		0	ARKANSAS	Arkansas	1
975	CA	1101		0	CALIFORNIA	California	1
976	CO	1101		0	COLORADO	Colorado	1
977	CT	1101		0	CONNECTICUT	Connecticut	1
978	DE	1101		0	DELAWARE	Delaware	1
979	FL	1101		0	FLORIDA	Florida	1
980	GA	1101		0	GEORGIA	Georgia	1
981	HI	1101		0	HAWAII	Hawaii	1
982	ID	1101		0	IDAHO	Idaho	1
983	IL	1101		0	ILLINOIS	Illinois	1
984	IN	1101		0	INDIANA	Indiana	1
985	IA	1101		0	IOWA	Iowa	1
986	KS	1101		0	KANSAS	Kansas	1
987	KY	1101		0	KENTUCKY	Kentucky	1
988	LA	1101		0	LOUISIANA	Louisiana	1
989	ME	1101		0	MAINE	Maine	1
990	MD	1101		0	MARYLAND	Maryland	1
991	MA	1101		0	MASSACHUSSETTS	Massachusetts	1
992	MI	1101		0	MICHIGAN	Michigan	1
993	MN	1101		0	MINNESOTA	Minnesota	1
994	MS	1101		0	MISSISSIPPI	Mississippi	1
995	MO	1101		0	MISSOURI	Missouri	1
996	MT	1101		0	MONTANA	Montana	1
997	NE	1101		0	NEBRASKA	Nebraska	1
998	NV	1101		0	NEVADA	Nevada	1
999	NH	1101		0	NEW HAMPSHIRE	New Hampshire	1
1000	NJ	1101		0	NEW JERSEY	New Jersey	1
1001	NM	1101		0	NEW MEXICO	New Mexico	1
1002	NY	1101		0	NEW YORK	New York	1
1003	NC	1101		0	NORTH CAROLINA	North Carolina	1
1004	ND	1101		0	NORTH DAKOTA	North Dakota	1
1005	OH	1101		0	OHIO	Ohio	1
1006	OK	1101		0	OKLAHOMA	Oklahoma	1
1007	OR	1101		0	OREGON	Oregon	1
1008	PA	1101		0	PENNSYLVANIA	Pennsylvania	1
1009	RI	1101		0	RHODE ISLAND	Rhode Island	1
1010	SC	1101		0	SOUTH CAROLINA	South Carolina	1
1011	SD	1101		0	SOUTH DAKOTA	South Dakota	1
1012	TN	1101		0	TENNESSEE	Tennessee	1
1013	TX	1101		0	TEXAS	Texas	1
1014	UT	1101		0	UTAH	Utah	1
1015	VT	1101		0	VERMONT	Vermont	1
1016	VA	1101		0	VIRGINIA	Virginia	1
1017	WA	1101		0	WASHINGTON	Washington	1
1018	WV	1101		0	WEST VIRGINIA	West Virginia	1
1019	WI	1101		0	WISCONSIN	Wisconsin	1
1020	WY	1101		0	WYOMING	Wyoming	1
1021	001	5201		0		Belisario Boeto	1
1022	002	5201		0		Hernando Siles	1
1023	003	5201		0		Jaime Zudáñez	1
1024	004	5201		0		Juana Azurduy de Padilla	1
1025	005	5201		0		Luis Calvo	1
1026	006	5201		0		Nor Cinti	1
1027	007	5201		0		Oropeza	1
1028	008	5201		0		Sud Cinti	1
1029	009	5201		0		Tomina	1
1030	010	5201		0		Yamparáez	1
1031	011	5202		0		Abel Iturralde	1
1032	012	5202		0		Aroma	1
1033	013	5202		0		Bautista Saavedra	1
1034	014	5202		0		Caranavi	1
1035	015	5202		0		Eliodoro Camacho	1
1036	016	5202		0		Franz Tamayo	1
1037	017	5202		0		Gualberto Villarroel	1
1038	018	5202		0		Ingaví	1
1039	019	5202		0		Inquisivi	1
1040	020	5202		0		José Ramón Loayza	1
1041	021	5202		0		Larecaja	1
1042	022	5202		0		Los Andes (Bolivia)	1
1043	023	5202		0		Manco Kapac	1
1044	024	5202		0		Muñecas	1
1045	025	5202		0		Nor Yungas	1
1046	026	5202		0		Omasuyos	1
1047	027	5202		0		Pacajes	1
1048	028	5202		0		Pedro Domingo Murillo	1
1049	029	5202		0		Sud Yungas	1
1050	030	5202		0		General José Manuel Pando	1
1051	031	5203		0		Arani	1
1052	032	5203		0		Arque	1
1053	033	5203		0		Ayopaya	1
1054	034	5203		0		Bolívar (Bolivia)	1
1055	035	5203		0		Campero	1
1056	036	5203		0		Capinota	1
1057	037	5203		0		Cercado (Cochabamba)	1
1058	038	5203		0		Esteban Arze	1
1059	039	5203		0		Germán Jordán	1
1060	040	5203		0		José Carrasco	1
1061	041	5203		0		Mizque	1
1062	042	5203		0		Punata	1
1063	043	5203		0		Quillacollo	1
1064	044	5203		0		Tapacarí	1
1065	045	5203		0		Tiraque	1
1066	046	5203		0		Chapare	1
1067	047	5204		0		Carangas	1
1068	048	5204		0		Cercado (Oruro)	1
1069	049	5204		0		Eduardo Avaroa	1
1070	050	5204		0		Ladislao Cabrera	1
1071	051	5204		0		Litoral de Atacama	1
1072	052	5204		0		Mejillones	1
1073	053	5204		0		Nor Carangas	1
1074	054	5204		0		Pantaleón Dalence	1
1075	055	5204		0		Poopó	1
1076	056	5204		0		Sabaya	1
1077	057	5204		0		Sajama	1
1078	058	5204		0		San Pedro de Totora	1
1079	059	5204		0		Saucarí	1
1080	060	5204		0		Sebastián Pagador	1
1081	061	5204		0		Sud Carangas	1
1082	062	5204		0		Tomás Barrón	1
1083	063	5205		0		Alonso de Ibáñez	1
1084	064	5205		0		Antonio Quijarro	1
1085	065	5205		0		Bernardino Bilbao	1
1086	066	5205		0		Charcas (Potosí)	1
1087	067	5205		0		Chayanta	1
1088	068	5205		0		Cornelio Saavedra	1
1089	069	5205		0		Daniel Campos	1
1090	070	5205		0		Enrique Baldivieso	1
1091	071	5205		0		José María Linares	1
1092	072	5205		0		Modesto Omiste	1
1093	073	5205		0		Nor Chichas	1
1094	074	5205		0		Nor Lípez	1
1095	075	5205		0		Rafael Bustillo	1
1096	076	5205		0		Sud Chichas	1
1097	077	5205		0		Sud Lípez	1
1098	078	5205		0		Tomás Frías	1
1099	079	5206		0		Aniceto Arce	1
1100	080	5206		0		Burdet O'Connor	1
1101	081	5206		0		Cercado (Tarija)	1
1102	082	5206		0		Eustaquio Méndez	1
1103	083	5206		0		José María Avilés	1
1104	084	5206		0		Gran Chaco	1
1105	085	5207		0		Andrés Ibáñez	1
1106	086	5207		0		Caballero	1
1107	087	5207		0		Chiquitos	1
1108	088	5207		0		Cordillera (Bolivia)	1
1109	089	5207		0		Florida	1
1110	090	5207		0		Germán Busch	1
1111	091	5207		0		Guarayos	1
1112	092	5207		0		Ichilo	1
1113	093	5207		0		Obispo Santistevan	1
1114	094	5207		0		Sara	1
1115	095	5207		0		Vallegrande	1
1116	096	5207		0		Velasco	1
1117	097	5207		0		Warnes	1
1118	098	5207		0		Ángel Sandóval	1
1119	099	5207		0		Ñuflo de Chaves	1
1120	100	5208		0		Cercado (Beni)	1
1121	101	5208		0		Iténez	1
1122	102	5208		0		Mamoré	1
1123	103	5208		0		Marbán	1
1124	104	5208		0		Moxos	1
1125	105	5208		0		Vaca Díez	1
1126	106	5208		0		Yacuma	1
1127	107	5208		0		General José Ballivián Segurola	1
1128	108	5209		0		Abuná	1
1129	109	5209		0		Madre de Dios	1
1130	110	5209		0		Manuripi	1
1131	111	5209		0		Nicolás Suárez	1
1132	112	5209		0		General Federico Román	1
1133	VI	419	01	19	ALAVA	Álava	1
1134	AB	404	02	4	ALBACETE	Albacete	1
1135	A	411	03	11	ALICANTE	Alicante	1
1136	AL	401	04	1	ALMERIA	Almería	1
1137	O	418	33	18	ASTURIAS	Asturias	1
1138	AV	403	05	3	AVILA	Ávila	1
1139	BA	412	06	12	BADAJOZ	Badajoz	1
1140	B	406	08	6	BARCELONA	Barcelona	1
1141	BU	403	09	8	BURGOS	Burgos	1
1142	CC	412	10	12	CACERES	Cáceres	1
1143	CA	401	11	1	CADIZ	Cádiz	1
1144	S	410	39	10	CANTABRIA	Cantabria	1
1145	CS	411	12	11	CASTELLON	Castellón	1
1146	CE	407	51	7	CEUTA	Ceuta	1
1147	CR	404	13	4	CIUDAD REAL	Ciudad Real	1
1148	CO	401	14	1	CORDOBA	Córdoba	1
1149	CU	404	16	4	CUENCA	Cuenca	1
1150	GI	406	17	6	GERONA	Gerona	1
1151	GR	401	18	1	GRANADA	Granada	1
1152	GU	404	19	4	GUADALAJARA	Guadalajara	1
1153	SS	419	20	19	GUIPUZCOA	Guipúzcoa	1
1154	H	401	21	1	HUELVA	Huelva	1
1155	HU	402	22	2	HUESCA	Huesca	1
1156	PM	414	07	14	ISLAS BALEARES	Islas Baleares	1
1157	J	401	23	1	JAEN	Jaén	1
1158	C	413	15	13	LA CORUÑA	La Coruña	1
1159	LO	415	26	15	LA RIOJA	La Rioja	1
1160	GC	405	35	5	LAS PALMAS	Las Palmas	1
1161	LE	403	24	3	LEON	León	1
1162	L	406	25	6	LERIDA	Lérida	1
1163	LU	413	27	13	LUGO	Lugo	1
1164	M	416	28	16	MADRID	Madrid	1
1165	MA	401	29	1	MALAGA	Málaga	1
1166	ML	409	52	9	MELILLA	Melilla	1
1167	MU	417	30	17	MURCIA	Murcia	1
1168	NA	408	31	8	NAVARRA	Navarra	1
1169	OR	413	32	13	ORENSE	Orense	1
1170	P	403	34	3	PALENCIA	Palencia	1
1171	PO	413	36	13	PONTEVEDRA	Pontevedra	1
1172	SA	403	37	3	SALAMANCA	Salamanca	1
1173	TF	405	38	5	STA. CRUZ DE TENERIFE	Santa Cruz de Tenerife	1
1174	SG	403	40	3	SEGOVIA	Segovia	1
1175	SE	401	41	1	SEVILLA	Sevilla	1
1176	SO	403	42	3	SORIA	Soria	1
1177	T	406	43	6	TARRAGONA	Tarragona	1
1178	TE	402	44	2	TERUEL	Teruel	1
1179	TO	404	45	5	TOLEDO	Toledo	1
1180	V	411	46	11	VALENCIA	Valencia	1
1181	VA	403	47	3	VALLADOLID	Valladolid	1
1182	BI	419	48	19	VIZCAYA	Vizcaya	1
1183	ZA	403	49	3	ZAMORA	Zamora	1
1184	Z	402	50	1	ZARAGOZA	Zaragoza	1
1185	66	10201		0		Αθήνα	1
1186	67	10205		0		Δράμα	1
1187	01	10205		0		Έβρος	1
1188	02	10205		0		Θάσος	1
1189	03	10205		0		Καβάλα	1
1190	04	10205		0		Ξάνθη	1
1191	05	10205		0		Ροδόπη	1
1192	06	10203		0		Ημαθία	1
1193	07	10203		0		Θεσσαλονίκη	1
1194	08	10203		0		Κιλκίς	1
1195	09	10203		0		Πέλλα	1
1196	10	10203		0		Πιερία	1
1197	11	10203		0		Σέρρες	1
1198	12	10203		0		Χαλκιδική	1
1199	13	10206		0		Άρτα	1
1200	14	10206		0		Θεσπρωτία	1
1201	15	10206		0		Ιωάννινα	1
1202	16	10206		0		Πρέβεζα	1
1203	17	10213		0		Γρεβενά	1
1204	18	10213		0		Καστοριά	1
1205	19	10213		0		Κοζάνη	1
1206	20	10213		0		Φλώρινα	1
1207	21	10212		0		Καρδίτσα	1
1208	22	10212		0		Λάρισα	1
1209	23	10212		0		Μαγνησία	1
1210	24	10212		0		Τρίκαλα	1
1211	25	10212		0		Σποράδες	1
1212	26	10212		0		Βοιωτία	1
1213	27	10202		0		Εύβοια	1
1214	28	10202		0		Ευρυτανία	1
1215	29	10202		0		Φθιώτιδα	1
1216	30	10202		0		Φωκίδα	1
1217	31	10209		0		Αργολίδα	1
1218	32	10209		0		Αρκαδία	1
1219	33	10209		0		Κορινθία	1
1220	34	10209		0		Λακωνία	1
1221	35	10209		0		Μεσσηνία	1
1222	36	10211		0		Αιτωλοακαρνανία	1
1223	37	10211		0		Αχαΐα	1
1224	38	10211		0		Ηλεία	1
1225	39	10207		0		Ζάκυνθος	1
1226	40	10207		0		Κέρκυρα	1
1227	41	10207		0		Κεφαλληνία	1
1228	42	10207		0		Ιθάκη	1
1229	43	10207		0		Λευκάδα	1
1230	44	10208		0		Ικαρία	1
1231	45	10208		0		Λέσβος	1
1232	46	10208		0		Λήμνος	1
1233	47	10208		0		Σάμος	1
1234	48	10208		0		Χίος	1
1235	49	10210		0		Άνδρος	1
1236	50	10210		0		Θήρα	1
1237	51	10210		0		Κάλυμνος	1
1238	52	10210		0		Κάρπαθος	1
1239	53	10210		0		Κέα-Κύθνος	1
1240	54	10210		0		Κω	1
1241	55	10210		0		Μήλος	1
1242	56	10210		0		Μύκονος	1
1243	57	10210		0		Νάξος	1
1244	58	10210		0		Πάρος	1
1245	59	10210		0		Ρόδος	1
1246	60	10210		0		Σύρος	1
1247	61	10210		0		Τήνος	1
1248	62	10204		0		Ηράκλειο	1
1249	63	10204		0		Λασίθι	1
1250	64	10204		0		Ρέθυμνο	1
1251	65	10204		0		Χανιά	1
1252	AG	601	\N	\N	ARGOVIE	Argovie	1
1253	AI	601	\N	\N	APPENZELL RHODES INTERIEURES	Appenzell Rhodes intérieures	1
1254	AR	601	\N	\N	APPENZELL RHODES EXTERIEURES	Appenzell Rhodes extérieures	1
1255	BE	601	\N	\N	BERNE	Berne	1
1256	BL	601	\N	\N	BALE CAMPAGNE	Bâle Campagne	1
1257	BS	601	\N	\N	BALE VILLE	Bâle Ville	1
1258	FR	601	\N	\N	FRIBOURG	Fribourg	1
1259	GE	601	\N	\N	GENEVE	Genève	1
1260	GL	601	\N	\N	GLARIS	Glaris	1
1261	GR	601	\N	\N	GRISONS	Grisons	1
1262	JU	601	\N	\N	JURA	Jura	1
1263	LU	601	\N	\N	LUCERNE	Lucerne	1
1264	NE	601	\N	\N	NEUCHATEL	Neuchâtel	1
1265	NW	601	\N	\N	NIDWALD	Nidwald	1
1266	OW	601	\N	\N	OBWALD	Obwald	1
1267	SG	601	\N	\N	SAINT-GALL	Saint-Gall	1
1268	SH	601	\N	\N	SCHAFFHOUSE	Schaffhouse	1
1269	SO	601	\N	\N	SOLEURE	Soleure	1
1270	SZ	601	\N	\N	SCHWYZ	Schwyz	1
1271	TG	601	\N	\N	THURGOVIE	Thurgovie	1
1272	TI	601	\N	\N	TESSIN	Tessin	1
1273	UR	601	\N	\N	URI	Uri	1
1274	VD	601	\N	\N	VAUD	Vaud	1
1275	VS	601	\N	\N	VALAIS	Valais	1
1276	ZG	601	\N	\N	ZUG	Zug	1
1277	ZH	601	\N	\N	ZURICH	Zürich	1
1278	701	701	\N	0	\N	Bedfordshire	1
1279	702	701	\N	0	\N	Berkshire	1
1280	703	701	\N	0	\N	Bristol, City of	1
1281	704	701	\N	0	\N	Buckinghamshire	1
1282	705	701	\N	0	\N	Cambridgeshire	1
1283	706	701	\N	0	\N	Cheshire	1
1284	707	701	\N	0	\N	Cleveland	1
1285	708	701	\N	0	\N	Cornwall	1
1286	709	701	\N	0	\N	Cumberland	1
1287	710	701	\N	0	\N	Cumbria	1
1288	711	701	\N	0	\N	Derbyshire	1
1289	712	701	\N	0	\N	Devon	1
1290	713	701	\N	0	\N	Dorset	1
1291	714	701	\N	0	\N	Co. Durham	1
1292	715	701	\N	0	\N	East Riding of Yorkshire	1
1293	716	701	\N	0	\N	East Sussex	1
1294	717	701	\N	0	\N	Essex	1
1295	718	701	\N	0	\N	Gloucestershire	1
1296	719	701	\N	0	\N	Greater Manchester	1
1297	720	701	\N	0	\N	Hampshire	1
1298	721	701	\N	0	\N	Hertfordshire	1
1299	722	701	\N	0	\N	Hereford and Worcester	1
1300	723	701	\N	0	\N	Herefordshire	1
1301	724	701	\N	0	\N	Huntingdonshire	1
1302	725	701	\N	0	\N	Isle of Man	1
1303	726	701	\N	0	\N	Isle of Wight	1
1304	727	701	\N	0	\N	Jersey	1
1305	728	701	\N	0	\N	Kent	1
1306	729	701	\N	0	\N	Lancashire	1
1307	730	701	\N	0	\N	Leicestershire	1
1308	731	701	\N	0	\N	Lincolnshire	1
1309	732	701	\N	0	\N	London - City of London	1
1310	733	701	\N	0	\N	Merseyside	1
1311	734	701	\N	0	\N	Middlesex	1
1312	735	701	\N	0	\N	Norfolk	1
1313	736	701	\N	0	\N	North Yorkshire	1
1314	737	701	\N	0	\N	North Riding of Yorkshire	1
1315	738	701	\N	0	\N	Northamptonshire	1
1316	739	701	\N	0	\N	Northumberland	1
1317	740	701	\N	0	\N	Nottinghamshire	1
1318	741	701	\N	0	\N	Oxfordshire	1
1319	742	701	\N	0	\N	Rutland	1
1320	743	701	\N	0	\N	Shropshire	1
1321	744	701	\N	0	\N	Somerset	1
1322	745	701	\N	0	\N	Staffordshire	1
1323	746	701	\N	0	\N	Suffolk	1
1324	747	701	\N	0	\N	Surrey	1
1325	748	701	\N	0	\N	Sussex	1
1326	749	701	\N	0	\N	Tyne and Wear	1
1327	750	701	\N	0	\N	Warwickshire	1
1328	751	701	\N	0	\N	West Midlands	1
1329	752	701	\N	0	\N	West Sussex	1
1330	753	701	\N	0	\N	West Yorkshire	1
1331	754	701	\N	0	\N	West Riding of Yorkshire	1
1332	755	701	\N	0	\N	Wiltshire	1
1333	756	701	\N	0	\N	Worcestershire	1
1334	757	701	\N	0	\N	Yorkshire	1
1335	758	702	\N	0	\N	Anglesey	1
1336	759	702	\N	0	\N	Breconshire	1
1337	760	702	\N	0	\N	Caernarvonshire	1
1338	761	702	\N	0	\N	Cardiganshire	1
1339	762	702	\N	0	\N	Carmarthenshire	1
1340	763	702	\N	0	\N	Ceredigion	1
1341	764	702	\N	0	\N	Denbighshire	1
1342	765	702	\N	0	\N	Flintshire	1
1343	766	702	\N	0	\N	Glamorgan	1
1344	767	702	\N	0	\N	Gwent	1
1345	768	702	\N	0	\N	Gwynedd	1
1346	769	702	\N	0	\N	Merionethshire	1
1347	770	702	\N	0	\N	Monmouthshire	1
1348	771	702	\N	0	\N	Mid Glamorgan	1
1349	772	702	\N	0	\N	Montgomeryshire	1
1350	773	702	\N	0	\N	Pembrokeshire	1
1351	774	702	\N	0	\N	Powys	1
1352	775	702	\N	0	\N	Radnorshire	1
1353	776	702	\N	0	\N	South Glamorgan	1
1354	777	703	\N	0	\N	Aberdeen, City of	1
1355	778	703	\N	0	\N	Angus	1
1356	779	703	\N	0	\N	Argyll	1
1357	780	703	\N	0	\N	Ayrshire	1
1358	781	703	\N	0	\N	Banffshire	1
1359	782	703	\N	0	\N	Berwickshire	1
1360	783	703	\N	0	\N	Bute	1
1361	784	703	\N	0	\N	Caithness	1
1362	785	703	\N	0	\N	Clackmannanshire	1
1363	786	703	\N	0	\N	Dumfriesshire	1
1364	787	703	\N	0	\N	Dumbartonshire	1
1365	788	703	\N	0	\N	Dundee, City of	1
1366	789	703	\N	0	\N	East Lothian	1
1367	790	703	\N	0	\N	Fife	1
1368	791	703	\N	0	\N	Inverness	1
1369	792	703	\N	0	\N	Kincardineshire	1
1370	793	703	\N	0	\N	Kinross-shire	1
1371	794	703	\N	0	\N	Kirkcudbrightshire	1
1372	795	703	\N	0	\N	Lanarkshire	1
1373	796	703	\N	0	\N	Midlothian	1
1374	797	703	\N	0	\N	Morayshire	1
1375	798	703	\N	0	\N	Nairnshire	1
1376	799	703	\N	0	\N	Orkney	1
1377	800	703	\N	0	\N	Peebleshire	1
1378	801	703	\N	0	\N	Perthshire	1
1379	802	703	\N	0	\N	Renfrewshire	1
1380	803	703	\N	0	\N	Ross & Cromarty	1
1381	804	703	\N	0	\N	Roxburghshire	1
1382	805	703	\N	0	\N	Selkirkshire	1
1383	806	703	\N	0	\N	Shetland	1
1384	807	703	\N	0	\N	Stirlingshire	1
1385	808	703	\N	0	\N	Sutherland	1
1386	809	703	\N	0	\N	West Lothian	1
1387	810	703	\N	0	\N	Wigtownshire	1
1388	811	704	\N	0	\N	Antrim	1
1389	812	704	\N	0	\N	Armagh	1
1390	813	704	\N	0	\N	Co. Down	1
1391	814	704	\N	0	\N	Co. Fermanagh	1
1392	815	704	\N	0	\N	Co. Londonderry	1
1393	SS	8601		0		San Salvador	1
1394	SA	8603		0		Santa Ana	1
1395	AH	8603		0		Ahuachapan	1
1396	SO	8603		0		Sonsonate	1
1397	US	8602		0		Usulutan	1
1398	SM	8602		0		San Miguel	1
1399	MO	8602		0		Morazan	1
1400	LU	8602		0		La Union	1
1401	LL	8601		0		La Libertad	1
1402	CH	8601		0		Chalatenango	1
1403	CA	8601		0		Cabañas	1
1404	LP	8601		0		La Paz	1
1405	SV	8601		0		San Vicente	1
1406	CU	8601		0		Cuscatlan	1
1407	AN	11701	\N	0	AN	Andaman & Nicobar	1
1408	AP	11701	\N	0	AP	Andhra Pradesh	1
1409	AR	11701	\N	0	AR	Arunachal Pradesh	1
1410	AS	11701	\N	0	AS	Assam	1
1411	BR	11701	\N	0	BR	Bihar	1
1412	CG	11701	\N	0	CG	Chattisgarh	1
1413	CH	11701	\N	0	CH	Chandigarh	1
1414	DD	11701	\N	0	DD	Daman & Diu	1
1415	DL	11701	\N	0	DL	Delhi	1
1416	DN	11701	\N	0	DN	Dadra and Nagar Haveli	1
1417	GA	11701	\N	0	GA	Goa	1
1418	GJ	11701	\N	0	GJ	Gujarat	1
1419	HP	11701	\N	0	HP	Himachal Pradesh	1
1420	HR	11701	\N	0	HR	Haryana	1
1421	JH	11701	\N	0	JH	Jharkhand	1
1422	JK	11701	\N	0	JK	Jammu & Kashmir	1
1423	KA	11701	\N	0	KA	Karnataka	1
1424	KL	11701	\N	0	KL	Kerala	1
1425	LD	11701	\N	0	LD	Lakshadweep	1
1426	MH	11701	\N	0	MH	Maharashtra	1
1427	ML	11701	\N	0	ML	Meghalaya	1
1428	MN	11701	\N	0	MN	Manipur	1
1429	MP	11701	\N	0	MP	Madhya Pradesh	1
1430	MZ	11701	\N	0	MZ	Mizoram	1
1431	NL	11701	\N	0	NL	Nagaland	1
1432	OR	11701	\N	0	OR	Orissa	1
1433	PB	11701	\N	0	PB	Punjab	1
1434	PY	11701	\N	0	PY	Puducherry	1
1435	RJ	11701	\N	0	RJ	Rajasthan	1
1436	SK	11701	\N	0	SK	Sikkim	1
1437	TE	11701	\N	0	TE	Telangana	1
1438	TN	11701	\N	0	TN	Tamil Nadu	1
1439	TR	11701	\N	0	TR	Tripura	1
1440	UL	11701	\N	0	UL	Uttarakhand	1
1441	UP	11701	\N	0	UP	Uttar Pradesh	1
1442	WB	11701	\N	0	WB	West Bengal	1
1443	BA	11801	\N	0	BA	Bali	1
1444	BB	11801	\N	0	BB	Bangka Belitung	1
1445	BT	11801	\N	0	BT	Banten	1
1446	BE	11801	\N	0	BA	Bengkulu	1
1447	YO	11801	\N	0	YO	DI Yogyakarta	1
1448	JK	11801	\N	0	JK	DKI Jakarta	1
1449	GO	11801	\N	0	GO	Gorontalo	1
1450	JA	11801	\N	0	JA	Jambi	1
1451	JB	11801	\N	0	JB	Jawa Barat	1
1452	JT	11801	\N	0	JT	Jawa Tengah	1
1453	JI	11801	\N	0	JI	Jawa Timur	1
1454	KB	11801	\N	0	KB	Kalimantan Barat	1
1455	KS	11801	\N	0	KS	Kalimantan Selatan	1
1456	KT	11801	\N	0	KT	Kalimantan Tengah	1
1457	KI	11801	\N	0	KI	Kalimantan Timur	1
1458	KU	11801	\N	0	KU	Kalimantan Utara	1
1459	KR	11801	\N	0	KR	Kepulauan Riau	1
1460	LA	11801	\N	0	LA	Lampung	1
1461	MA	11801	\N	0	MA	Maluku	1
1462	MU	11801	\N	0	MU	Maluku Utara	1
1463	AC	11801	\N	0	AC	Nanggroe Aceh Darussalam	1
1464	NB	11801	\N	0	NB	Nusa Tenggara Barat	1
1465	NT	11801	\N	0	NT	Nusa Tenggara Timur	1
1466	PA	11801	\N	0	PA	Papua	1
1467	PB	11801	\N	0	PB	Papua Barat	1
1468	RI	11801	\N	0	RI	Riau	1
1469	SR	11801	\N	0	SR	Sulawesi Barat	1
1470	SN	11801	\N	0	SN	Sulawesi Selatan	1
1471	ST	11801	\N	0	ST	Sulawesi Tengah	1
1472	SG	11801	\N	0	SG	Sulawesi Tenggara	1
1473	SA	11801	\N	0	SA	Sulawesi Utara	1
1474	SB	11801	\N	0	SB	Sumatera Barat	1
1475	SS	11801	\N	0	SS	Sumatera Selatan	1
1476	SU	11801	\N	0	SU	Sumatera Utara\t	1
1477	CMX	15401		0	CMX	Ciudad de México	1
1478	AGS	15401		0	AGS	Aguascalientes	1
1479	BCN	15401		0	BCN	Baja California Norte	1
1480	BCS	15401		0	BCS	Baja California Sur	1
1481	CAM	15401		0	CAM	Campeche	1
1482	CHP	15401		0	CHP	Chiapas	1
1483	CHI	15401		0	CHI	Chihuahua	1
1484	COA	15401		0	COA	Coahuila	1
1485	COL	15401		0	COL	Colima	1
1486	DUR	15401		0	DUR	Durango	1
1487	GTO	15401		0	GTO	Guanajuato	1
1488	GRO	15401		0	GRO	Guerrero	1
1489	HGO	15401		0	HGO	Hidalgo	1
1490	JAL	15401		0	JAL	Jalisco	1
1491	MEX	15401		0	MEX	México	1
1492	MIC	15401		0	MIC	Michoacán de Ocampo	1
1493	MOR	15401		0	MOR	Morelos	1
1494	NAY	15401		0	NAY	Nayarit	1
1495	NLE	15401		0	NLE	Nuevo León	1
1496	OAX	15401		0	OAX	Oaxaca	1
1497	PUE	15401		0	PUE	Puebla	1
1498	QRO	15401		0	QRO	Querétaro	1
1499	ROO	15401		0	ROO	Quintana Roo	1
1500	SLP	15401		0	SLP	San Luis Potosí	1
1501	SIN	15401		0	SIN	Sinaloa	1
1502	SON	15401		0	SON	Sonora	1
1503	TAB	15401		0	TAB	Tabasco	1
1504	TAM	15401		0	TAM	Tamaulipas	1
1505	TLX	15401		0	TLX	Tlaxcala	1
1506	VER	15401		0	VER	Veracruz	1
1507	YUC	15401		0	YUC	Yucatán	1
1508	ZAC	15401		0	ZAC	Zacatecas	1
1509	VE-L	23201		0	VE-L	Mérida	1
1510	VE-T	23201		0	VE-T	Trujillo	1
1511	VE-E	23201		0	VE-E	Barinas	1
1512	VE-M	23202		0	VE-M	Miranda	1
1513	VE-W	23202		0	VE-W	Vargas	1
1514	VE-A	23202		0	VE-A	Distrito Capital	1
1515	VE-D	23203		0	VE-D	Aragua	1
1516	VE-G	23203		0	VE-G	Carabobo	1
1517	VE-I	23204		0	VE-I	Falcón	1
1518	VE-K	23204		0	VE-K	Lara	1
1519	VE-U	23204		0	VE-U	Yaracuy	1
1520	VE-F	23205		0	VE-F	Bolívar	1
1521	VE-X	23205		0	VE-X	Amazonas	1
1522	VE-Y	23205		0	VE-Y	Delta Amacuro	1
1523	VE-O	23206		0	VE-O	Nueva Esparta	1
1524	VE-Z	23206		0	VE-Z	Dependencias Federales	1
1525	VE-C	23207		0	VE-C	Apure	1
1526	VE-J	23207		0	VE-J	Guárico	1
1527	VE-H	23207		0	VE-H	Cojedes	1
1528	VE-P	23207		0	VE-P	Portuguesa	1
1529	VE-B	23208		0	VE-B	Anzoátegui	1
1530	VE-N	23208		0	VE-N	Monagas	1
1531	VE-R	23208		0	VE-R	Sucre	1
1532	VE-V	23209		0	VE-V	Zulia	1
1533	VE-S	23209		0	VE-S	Táchira	1
1534	AE-1	22701		0		Abu Dhabi	1
1535	AE-2	22701		0		Dubai	1
1536	AE-3	22701		0		Ajman	1
1537	AE-4	22701		0		Fujairah	1
1538	AE-5	22701		0		Ras al-Khaimah	1
1539	AE-6	22701		0		Sharjah	1
1540	AE-7	22701		0		Umm al-Quwain	1
\.


--
-- Data for Name: llx_c_ecotaxe; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_ecotaxe (rowid, code, label, price, organization, fk_pays, active) FROM stdin;
1	25040	PETIT APPAREILS MENAGERS	0.25000000	Eco-systèmes	1	1
2	25050	TRES PETIT APPAREILS MENAGERS	0.08000000	Eco-systèmes	1	1
3	32070	ECRAN POIDS < 5 KG	2.08000000	Eco-systèmes	1	1
4	32080	ECRAN POIDS > 5 KG	1.25000000	Eco-systèmes	1	1
5	32051	ORDINATEUR PORTABLE	0.42000000	Eco-systèmes	1	1
6	32061	TABLETTE INFORMATIQUE	0.84000000	Eco-systèmes	1	1
7	36011	ORDINATEUR FIXE (UC)	1.15000000	Eco-systèmes	1	1
8	36021	IMPRIMANTES	0.83000000	Eco-systèmes	1	1
9	36030	IT (INFORMATIQUE ET TELECOMS)	0.83000000	Eco-systèmes	1	1
10	36040	PETIT IT (CLAVIERS / SOURIS)	0.08000000	Eco-systèmes	1	1
11	36050	TELEPHONIE MOBILE	0.02000000	Eco-systèmes	1	1
12	36060	CONNECTIQUE CABLES	0.02000000	Eco-systèmes	1	1
13	45010	GROS MATERIEL GRAND PUBLIC (TELEAGRANDISSEURS)	1.67000000	Eco-systèmes	1	1
14	45020	MOYEN MATERIEL GRAND PUBLIC (LOUPES ELECTRONIQUES)	0.42000000	Eco-systèmes	1	1
15	45030	PETIT MATERIEL GRAND PUBLIC (VIE QUOTIDIENNE)	0.08000000	Eco-systèmes	1	1
16	75030	JOUETS < 0,5 KG	0.08000000	Eco-systèmes	1	1
17	75040	JOUETS ENTRE 0,5 KG ET 10 KG	0.17000000	Eco-systèmes	1	1
18	74050	JOUETS > 10 KG	1.67000000	Eco-systèmes	1	1
19	85010	EQUIPEMENT MEDICAL < 0,5 KG	0.08000000	Eco-systèmes	1	1
\.


--
-- Data for Name: llx_c_effectif; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_effectif (id, code, libelle, active, module) FROM stdin;
0	EF0	-	1	\N
1	EF1-5	1 - 5	1	\N
2	EF6-10	6 - 10	1	\N
3	EF11-50	11 - 50	1	\N
4	EF51-100	51 - 100	1	\N
5	EF100-500	100 - 500	1	\N
6	EF500-	> 500	1	\N
\.


--
-- Data for Name: llx_c_email_senderprofile; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_email_senderprofile (rowid, entity, private, date_creation, tms, label, email, signature, "position", active) FROM stdin;
\.


--
-- Data for Name: llx_c_email_templates; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_email_templates (rowid, entity, module, type_template, lang, private, fk_user, datec, tms, label, "position", enabled, active, topic, joinfiles, content, content_lines) FROM stdin;
1	0	banque	thirdparty		0	\N	\N	2022-03-11 11:42:56.687356	(YourSEPAMandate)	1	$conf->societe->enabled && $conf->banque->enabled && $conf->prelevement->enabled	0	__(YourSEPAMandate)__	0	__(Hello)__,<br><br>\\n\\n__(FindYourSEPAMandate)__ :<br>\\n__MYCOMPANY_NAME__<br>\\n__MYCOMPANY_FULLADDRESS__<br><br>\\n__(Sincerely)__<br>\\n__USER_SIGNATURE__	\N
2	0	adherent	member		0	\N	\N	2022-03-11 11:42:56.687356	(SendingEmailOnAutoSubscription)	10	$conf->adherent->enabled	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(YourMembershipRequestWasReceived)__	0	__(Hello)__ __MEMBER_FULLNAME__,<br><br>\\n\\n__(ThisIsContentOfYourMembershipRequestWasReceived)__<br>\\n<br>__ONLINE_PAYMENT_TEXT_AND_URL__<br>\\n<br><br>\\n__(Sincerely)__<br>__USER_SIGNATURE__	\N
3	0	adherent	member		0	\N	\N	2022-03-11 11:42:56.687356	(SendingEmailOnMemberValidation)	20	$conf->adherent->enabled	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(YourMembershipWasValidated)__	0	__(Hello)__ __MEMBER_FULLNAME__,<br><br>\\n\\n__(ThisIsContentOfYourMembershipWasValidated)__<br>__(FirstName)__ : __MEMBER_FIRSTNAME__<br>__(LastName)__ : __MEMBER_LASTNAME__<br>__(ID)__ : __MEMBER_ID__<br>\\n<br>__ONLINE_PAYMENT_TEXT_AND_URL__<br>\\n<br><br>\\n__(Sincerely)__<br>__USER_SIGNATURE__	\N
4	0	adherent	member		0	\N	\N	2022-03-11 11:42:56.687356	(SendingEmailOnNewSubscription)	30	$conf->adherent->enabled	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(YourSubscriptionWasRecorded)__	1	__(Hello)__ __MEMBER_FULLNAME__,<br><br>\\n\\n__(ThisIsContentOfYourSubscriptionWasRecorded)__<br>\\n\\n<br><br>\\n__(Sincerely)__<br>__USER_SIGNATURE__	\N
5	0	adherent	member		0	\N	\N	2022-03-11 11:42:56.687356	(SendingReminderForExpiredSubscription)	40	$conf->adherent->enabled	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(SubscriptionReminderEmail)__	0	__(Hello)__ __MEMBER_FULLNAME__,<br><br>\\n\\n__(ThisIsContentOfSubscriptionReminderEmail)__<br>\\n<br>__ONLINE_PAYMENT_TEXT_AND_URL__<br>\\n<br><br>\\n__(Sincerely)__<br>__USER_SIGNATURE__	\N
6	0	adherent	member		0	\N	\N	2022-03-11 11:42:56.687356	(SendingEmailOnCancelation)	50	$conf->adherent->enabled	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(YourMembershipWasCanceled)__	0	__(Hello)__ __MEMBER_FULLNAME__,<br><br>\\n\\n__(YourMembershipWasCanceled)__<br>\\n<br><br>\\n__(Sincerely)__<br>__USER_SIGNATURE__	\N
7	0	adherent	member		0	\N	\N	2022-03-11 11:42:56.687356	(SendingAnEMailToMember)	60	$conf->adherent->enabled	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(CardContent)__	0	__(Hello)__,<br><br>\\n\\n__(ThisIsContentOfYourCard)__<br>\\n__(ID)__ : __ID__<br>\\n__(Civility)__ : __MEMBER_CIVILITY__<br>\\n__(Firstname)__ : __MEMBER_FIRSTNAME__<br>\\n__(Lastname)__ : __MEMBER_LASTNAME__<br>\\n__(Fullname)__ : __MEMBER_FULLNAME__<br>\\n__(Company)__ : __MEMBER_COMPANY__<br>\\n__(Address)__ : __MEMBER_ADDRESS__<br>\\n__(Zip)__ : __MEMBER_ZIP__<br>\\n__(Town)__ : __MEMBER_TOWN__<br>\\n__(Country)__ : __MEMBER_COUNTRY__<br>\\n__(Email)__ : __MEMBER_EMAIL__<br>\\n__(Birthday)__ : __MEMBER_BIRTH__<br>\\n__(Photo)__ : __MEMBER_PHOTO__<br>\\n__(Login)__ : __MEMBER_LOGIN__<br>\\n__(Phone)__ : __MEMBER_PHONE__<br>\\n__(PhonePerso)__ : __MEMBER_PHONEPRO__<br>\\n__(PhoneMobile)__ : __MEMBER_PHONEMOBILE__<br><br>\\n__(Sincerely)__<br>__USER_SIGNATURE__	\N
8	0	recruitment	recruitmentcandidature_send		0	\N	\N	2022-03-11 11:42:56.687356	(AnswerCandidature)	100	$conf->recruitment->enabled	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(YourCandidature)__	0	__(Hello)__ __CANDIDATE_FULLNAME__,<br><br>\\n\\n__(YourCandidatureAnswerMessage)__<br>__ONLINE_INTERVIEW_SCHEDULER_TEXT_AND_URL__\\n<br><br>\\n__(Sincerely)__<br>__USER_SIGNATURE__	\N
9	0		conferenceorbooth		0	\N	\N	2022-03-11 11:42:56.687356	(EventOrganizationEmailAskConf)	10	1	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(EventOrganizationEmailAskConf)__	\N	__(Hello)__,<br /><br />__(OrganizationEventConfRequestWasReceived)__<br /><br /><br />__(Sincerely)__<br />__USER_SIGNATURE__	\N
10	0		conferenceorbooth		0	\N	\N	2022-03-11 11:42:56.687356	(EventOrganizationEmailAskBooth)	20	1	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(EventOrganizationEmailAskBooth)__	\N	__(Hello)__,<br /><br />__(OrganizationEventBoothRequestWasReceived)__<br /><br /><br />__(Sincerely)__<br />__USER_SIGNATURE__	\N
11	0		conferenceorbooth		0	\N	\N	2022-03-11 11:42:56.687356	(EventOrganizationEmailSubsBooth)	30	1	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(EventOrganizationEmailBoothPayment)__	\N	__(Hello)__,<br /><br />__(OrganizationEventPaymentOfBoothWasReceived)__<br /><br /><br />__(Sincerely)__<br />__USER_SIGNATURE__	\N
12	0		conferenceorbooth		0	\N	\N	2022-03-11 11:42:56.687356	(EventOrganizationEmailSubsEvent)	40	1	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(EventOrganizationEmailRegistrationPayment)__	\N	__(Hello)__,<br /><br />__(OrganizationEventPaymentOfRegistrationWasReceived)__<br /><br />__(Sincerely)__<br />__USER_SIGNATURE__	\N
13	0		conferenceorbooth		0	\N	\N	2022-03-11 11:42:56.687356	(EventOrganizationMassEmailAttendees)	50	1	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(EventOrganizationMassEmailAttendees)__	\N	__(Hello)__,<br /><br />__(OrganizationEventBulkMailToAttendees)__<br /><br />__(Sincerely)__<br />__USER_SIGNATURE__	\N
14	0		conferenceorbooth		0	\N	\N	2022-03-11 11:42:56.687356	(EventOrganizationMassEmailSpeakers)	60	1	1	[__[MAIN_INFO_SOCIETE_NOM]__] __(EventOrganizationMassEmailSpeakers)__	\N	__(Hello)__,<br /><br />__(OrganizationEventBulkMailToSpeakers)__<br /><br />__(Sincerely)__<br />__USER_SIGNATURE__	\N
15	0	partnership	partnership_send		0	\N	\N	2022-03-11 11:42:56.687356	(SendingEmailOnPartnershipWillSoonBeCanceled)	100	1	1	[__[MAIN_INFO_SOCIETE_NOM]__] - __(YourPartnershipWillSoonBeCanceledTopic)__	0	<body>\\n <p>__(Hello)__,<br><br>\\n__(YourPartnershipWillSoonBeCanceledContent)__</p>\\n<br />\\n\\n<br />\\n\\n            __(Sincerely)__ <br />\\n            __[MAIN_INFO_SOCIETE_NOM]__ <br />\\n </body>\\n	\N
16	0	partnership	partnership_send		0	\N	\N	2022-03-11 11:42:56.687356	(SendingEmailOnPartnershipCanceled)	100	1	1	[__[MAIN_INFO_SOCIETE_NOM]__] - __(YourPartnershipCanceledTopic)__	0	<body>\\n <p>__(Hello)__,<br><br>\\n__(YourPartnershipCanceledContent)__</p>\\n<br />\\n\\n<br />\\n\\n            __(Sincerely)__ <br />\\n            __[MAIN_INFO_SOCIETE_NOM]__ <br />\\n </body>\\n	\N
17	0	partnership	partnership_send		0	\N	\N	2022-03-11 11:42:56.687356	(SendingEmailOnPartnershipRefused)	100	1	1	[__[MAIN_INFO_SOCIETE_NOM]__] - __(YourPartnershipRefusedTopic)__	0	<body>\\n <p>__(Hello)__,<br><br>\\n__(YourPartnershipRefusedContent)__</p>\\n<br />\\n\\n<br />\\n\\n            __(Sincerely)__ <br />\\n            __[MAIN_INFO_SOCIETE_NOM]__ <br />\\n </body>\\n	\N
18	0	partnership	partnership_send		0	\N	\N	2022-03-11 11:42:56.687356	(SendingEmailOnPartnershipAccepted)	100	1	1	[__[MAIN_INFO_SOCIETE_NOM]__] - __(YourPartnershipAcceptedTopic)__	0	<body>\\n <p>__(Hello)__,<br><br>\\n__(YourPartnershipAcceptedContent)__</p>\\n<br />\\n\\n<br />\\n\\n            __(Sincerely)__ <br />\\n            __[MAIN_INFO_SOCIETE_NOM]__ <br />\\n </body>\\n	\N
\.


--
-- Data for Name: llx_c_exp_tax_cat; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_exp_tax_cat (rowid, label, entity, active) FROM stdin;
1	ExpAutoCat	1	0
2	ExpCycloCat	1	0
3	ExpMotoCat	1	0
4	ExpAuto3CV	1	1
5	ExpAuto4CV	1	1
6	ExpAuto5CV	1	1
7	ExpAuto6CV	1	1
8	ExpAuto7CV	1	1
9	ExpAuto8CV	1	1
10	ExpAuto9CV	1	0
11	ExpAuto10CV	1	0
12	ExpAuto11CV	1	0
13	ExpAuto12CV	1	0
14	ExpAuto3PCV	1	0
15	ExpAuto4PCV	1	0
16	ExpAuto5PCV	1	0
17	ExpAuto6PCV	1	0
18	ExpAuto7PCV	1	0
19	ExpAuto8PCV	1	0
20	ExpAuto9PCV	1	0
21	ExpAuto10PCV	1	0
22	ExpAuto11PCV	1	0
23	ExpAuto12PCV	1	0
24	ExpAuto13PCV	1	0
25	ExpCyclo	1	0
26	ExpMoto12CV	1	0
27	ExpMoto345CV	1	0
28	ExpMoto5PCV	1	0
\.


--
-- Data for Name: llx_c_exp_tax_range; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_exp_tax_range (rowid, fk_c_exp_tax_cat, range_ik, entity, active) FROM stdin;
1	4	0	1	1
2	4	5000	1	1
3	4	20000	1	1
4	5	0	1	1
5	5	5000	1	1
6	5	20000	1	1
7	6	0	1	1
8	6	5000	1	1
9	6	20000	1	1
10	7	0	1	1
11	7	5000	1	1
12	7	20000	1	1
13	8	0	1	1
14	8	5000	1	1
15	8	20000	1	1
\.


--
-- Data for Name: llx_c_field_list; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_field_list (rowid, tms, element, entity, name, alias, title, align, sort, search, visible, enabled, rang) FROM stdin;
\.


--
-- Data for Name: llx_c_format_cards; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_format_cards (rowid, code, name, paper_size, orientation, metric, leftmargin, topmargin, nx, ny, spacex, spacey, width, height, font_size, custom_x, custom_y, active) FROM stdin;
1	5160	Avery-5160, WL-875WX	letter	P	mm	5.58165000	12.70000000	3	10	3.55600000	0.00000000	65.87490000	25.40000000	7	0.00000000	0.00000000	1
2	5161	Avery-5161, WL-75WX	letter	P	mm	4.44500000	12.70000000	2	10	3.96800000	0.00000000	101.60000000	25.40000000	7	0.00000000	0.00000000	1
3	5162	Avery-5162, WL-100WX	letter	P	mm	3.87350000	22.35200000	2	7	4.95400000	0.00000000	101.60000000	33.78100000	8	0.00000000	0.00000000	1
4	5163	Avery-5163, WL-125WX	letter	P	mm	4.57200000	12.70000000	2	5	3.55600000	0.00000000	101.60000000	50.80000000	10	0.00000000	0.00000000	1
5	5164	Avery-5164 (inch)	letter	P	in	0.14800000	0.50000000	2	3	0.20310000	0.00000000	4.00000000	3.33000000	12	0.00000000	0.00000000	0
6	8600	Avery-8600	letter	P	mm	7.10000000	19.00000000	3	10	9.50000000	3.10000000	66.60000000	25.40000000	7	0.00000000	0.00000000	1
7	99012	DYMO 99012 89*36mm	custom	L	mm	1.00000000	1.00000000	1	1	0.00000000	0.00000000	36.00000000	89.00000000	10	36.00000000	89.00000000	1
8	99014	DYMO 99014 101*54mm	custom	L	mm	1.00000000	1.00000000	1	1	0.00000000	0.00000000	54.00000000	101.00000000	10	54.00000000	101.00000000	1
9	AVERYC32010	Avery-C32010	A4	P	mm	15.00000000	13.00000000	2	5	10.00000000	0.00000000	85.00000000	54.00000000	10	0.00000000	0.00000000	1
10	CARD	Dolibarr Business cards	A4	P	mm	15.00000000	15.00000000	2	5	0.00000000	0.00000000	85.00000000	54.00000000	10	0.00000000	0.00000000	1
11	L7163	Avery-L7163	A4	P	mm	5.00000000	15.00000000	2	7	2.50000000	0.00000000	99.10000000	38.10000000	8	0.00000000	0.00000000	1
\.


--
-- Data for Name: llx_c_forme_juridique; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_forme_juridique (rowid, code, fk_pays, libelle, isvatexempted, active, module, "position") FROM stdin;
1	0	0	-	0	1	\N	0
2	2301	23	Monotributista	0	1	\N	0
3	2302	23	Sociedad Civil	0	1	\N	0
4	2303	23	Sociedades Comerciales	0	1	\N	0
5	2304	23	Sociedades de Hecho	0	1	\N	0
6	2305	23	Sociedades Irregulares	0	1	\N	0
7	2306	23	Sociedad Colectiva	0	1	\N	0
8	2307	23	Sociedad en Comandita Simple	0	1	\N	0
9	2308	23	Sociedad de Capital e Industria	0	1	\N	0
10	2309	23	Sociedad Accidental o en participación	0	1	\N	0
11	2310	23	Sociedad de Responsabilidad Limitada	0	1	\N	0
12	2311	23	Sociedad Anónima	0	1	\N	0
13	2312	23	Sociedad Anónima con Participación Estatal Mayoritaria	0	1	\N	0
14	2313	23	Sociedad en Comandita por Acciones (arts. 315 a 324, LSC)	0	1	\N	0
15	4100	41	GmbH - Gesellschaft mit beschränkter Haftung	0	1	\N	0
16	4101	41	GesmbH - Gesellschaft mit beschränkter Haftung	0	1	\N	0
17	4102	41	AG - Aktiengesellschaft	0	1	\N	0
18	4103	41	EWIV - Europäische wirtschaftliche Interessenvereinigung	0	1	\N	0
19	4104	41	KEG - Kommanditerwerbsgesellschaft	0	1	\N	0
20	4105	41	OEG - Offene Erwerbsgesellschaft	0	1	\N	0
21	4106	41	OHG - Offene Handelsgesellschaft	0	1	\N	0
22	4107	41	AG & Co KG - Kommanditgesellschaft	0	1	\N	0
23	4108	41	GmbH & Co KG - Kommanditgesellschaft	0	1	\N	0
24	4109	41	KG - Kommanditgesellschaft	0	1	\N	0
25	4110	41	OG - Offene Gesellschaft	0	1	\N	0
26	4111	41	GbR - Gesellschaft nach bürgerlichem Recht	0	1	\N	0
27	4112	41	GesbR - Gesellschaft nach bürgerlichem Recht	0	1	\N	0
28	4113	41	GesnbR - Gesellschaft nach bürgerlichem Recht	0	1	\N	0
29	4114	41	e.U. - eingetragener Einzelunternehmer	0	1	\N	0
30	200	2	Indépendant	0	1	\N	0
31	201	2	SRL - Société à responsabilité limitée	0	1	\N	0
32	202	2	SA   - Société Anonyme	0	1	\N	0
33	203	2	SCRL - Société coopérative à responsabilité limitée	0	1	\N	0
34	204	2	ASBL - Association sans but Lucratif	0	1	\N	0
35	205	2	SCRI - Société coopérative à responsabilité illimitée	0	1	\N	0
36	206	2	SCS  - Société en commandite simple	0	1	\N	0
37	207	2	SCA  - Société en commandite par action	0	1	\N	0
38	208	2	SNC  - Société en nom collectif	0	1	\N	0
39	209	2	GIE  - Groupement d intérêt économique	0	1	\N	0
40	210	2	GEIE - Groupement européen d intérêt économique	0	1	\N	0
41	220	2	Eenmanszaak	0	1	\N	0
42	221	2	BVBA - Besloten vennootschap met beperkte aansprakelijkheid	0	1	\N	0
43	222	2	NV   - Naamloze Vennootschap	0	1	\N	0
44	223	2	CVBA - Coöperatieve vennootschap met beperkte aansprakelijkheid	0	1	\N	0
45	224	2	VZW  - Vereniging zonder winstoogmerk	0	1	\N	0
46	225	2	CVOA - Coöperatieve vennootschap met onbeperkte aansprakelijkheid 	0	1	\N	0
47	226	2	GCV  - Gewone commanditaire vennootschap	0	1	\N	0
48	227	2	Comm.VA - Commanditaire vennootschap op aandelen	0	1	\N	0
49	228	2	VOF  - Vennootschap onder firma	0	1	\N	0
50	229	2	VS0  - Vennootschap met sociaal oogmerk	0	1	\N	0
51	11	1	Artisan Commerçant (EI)	0	1	\N	0
52	12	1	Commerçant (EI)	0	1	\N	0
53	13	1	Artisan (EI)	0	1	\N	0
54	14	1	Officier public ou ministériel	0	1	\N	0
55	15	1	Profession libérale (EI)	0	1	\N	0
56	16	1	Exploitant agricole	0	1	\N	0
57	17	1	Agent commercial	0	1	\N	0
58	18	1	Associé Gérant de société	0	1	\N	0
59	19	1	Personne physique	0	1	\N	0
60	21	1	Indivision	0	1	\N	0
61	22	1	Société créée de fait	0	1	\N	0
62	23	1	Société en participation	0	1	\N	0
63	24	1	Société coopérative d'interet collectif (SCIC)	0	1	\N	0
64	25	1	Société coopérative de production à responsabilité limitée (SCOP)	0	1	\N	0
65	27	1	Paroisse hors zone concordataire	0	1	\N	0
66	29	1	Groupement de droit privé non doté de la personnalité morale	0	1	\N	0
67	31	1	Personne morale de droit étranger, immatriculée au RCS	0	1	\N	0
68	32	1	Personne morale de droit étranger, non immatriculée au RCS	0	1	\N	0
69	35	1	Régime auto-entrepreneur	0	1	\N	0
70	41	1	Etablissement public ou régie à caractère industriel ou commercial	0	1	\N	0
71	51	1	Société coopérative commerciale particulière	0	1	\N	0
72	52	1	Société en nom collectif	0	1	\N	0
73	53	1	Société en commandite	0	1	\N	0
74	54	1	Société à responsabilité limitée (SARL)	0	1	\N	0
75	55	1	Société anonyme à conseil d administration	0	1	\N	0
76	56	1	Société anonyme à directoire	0	1	\N	0
77	57	1	Société par actions simplifiée (SAS)	0	1	\N	0
78	58	1	Entreprise Unipersonnelle à Responsabilité Limitée (EURL)	0	1	\N	0
79	59	1	Société par actions simplifiée unipersonnelle (SASU)	0	1	\N	0
80	60	1	Entreprise Individuelle à Responsabilité Limitée (EIRL)	0	1	\N	0
81	61	1	Caisse d'épargne et de prévoyance	0	1	\N	0
82	62	1	Groupement d'intérêt économique (GIE)	0	1	\N	0
83	63	1	Société coopérative agricole	0	1	\N	0
84	64	1	Société non commerciale d assurances	0	1	\N	0
85	65	1	Société civile	0	1	\N	0
86	69	1	Personnes de droit privé inscrites au RCS	0	1	\N	0
87	71	1	Administration de l état	0	1	\N	0
88	72	1	Collectivité territoriale	0	1	\N	0
89	73	1	Etablissement public administratif	0	1	\N	0
90	74	1	Personne morale de droit public administratif	0	1	\N	0
91	81	1	Organisme gérant régime de protection social à adhésion obligatoire	0	1	\N	0
92	82	1	Organisme mutualiste	0	1	\N	0
93	83	1	Comité d entreprise	0	1	\N	0
94	84	1	Organisme professionnel	0	1	\N	0
95	85	1	Organisme de retraite à adhésion non obligatoire	0	1	\N	0
96	91	1	Syndicat de propriétaires	0	1	\N	0
97	92	1	Association loi 1901 ou assimilé	0	1	\N	0
98	93	1	Fondation	0	1	\N	0
99	99	1	Personne morale de droit privé	0	1	\N	0
100	500	5	GmbH - Gesellschaft mit beschränkter Haftung	0	1	\N	0
101	501	5	AG - Aktiengesellschaft 	0	1	\N	0
102	502	5	GmbH&Co. KG - Gesellschaft mit beschränkter Haftung & Compagnie Kommanditgesellschaft	0	1	\N	0
103	503	5	Gewerbe - Personengesellschaft	0	1	\N	0
104	504	5	UG - Unternehmergesellschaft -haftungsbeschränkt-	0	1	\N	0
105	505	5	GbR - Gesellschaft des bürgerlichen Rechts	0	1	\N	0
106	506	5	KG - Kommanditgesellschaft	0	1	\N	0
107	507	5	Ltd. - Limited Company	0	1	\N	0
108	508	5	OHG - Offene Handelsgesellschaft	0	1	\N	0
109	509	5	eG - eingetragene Genossenschaft	0	1	\N	0
110	8001	80	Aktieselvskab A/S	0	1	\N	0
111	8002	80	Anparts Selvskab ApS	0	1	\N	0
112	8003	80	Personlig ejet selvskab	0	1	\N	0
113	8004	80	Iværksætterselvskab IVS	0	1	\N	0
114	8005	80	Interessentskab I/S	0	1	\N	0
115	8006	80	Holdingselskab	0	1	\N	0
116	8007	80	Selskab Med Begrænset Hæftelse SMBA	0	1	\N	0
117	8008	80	Kommanditselskab K/S	0	1	\N	0
118	8009	80	SPE-selskab	0	1	\N	0
119	10201	102	Ατομική επιχείρηση	0	1	\N	0
120	10202	102	Εταιρική  επιχείρηση	0	1	\N	0
121	10203	102	Ομόρρυθμη Εταιρεία Ο.Ε	0	1	\N	0
122	10204	102	Ετερόρρυθμη Εταιρεία Ε.Ε	0	1	\N	0
123	10205	102	Εταιρεία Περιορισμένης Ευθύνης Ε.Π.Ε	0	1	\N	0
124	10206	102	Ανώνυμη Εταιρεία Α.Ε	0	1	\N	0
125	10207	102	Ανώνυμη ναυτιλιακή εταιρεία Α.Ν.Ε	0	1	\N	0
126	10208	102	Συνεταιρισμός	0	1	\N	0
127	10209	102	Συμπλοιοκτησία	0	1	\N	0
128	301	3	Società semplice	0	1	\N	0
129	302	3	Società in nome collettivo s.n.c.	0	1	\N	0
130	303	3	Società in accomandita semplice s.a.s.	0	1	\N	0
131	304	3	Società per azioni s.p.a.	0	1	\N	0
132	305	3	Società a responsabilità limitata s.r.l.	0	1	\N	0
133	306	3	Società in accomandita per azioni s.a.p.a.	0	1	\N	0
134	307	3	Società cooperativa a r.l.	0	1	\N	0
135	308	3	Società consortile	0	1	\N	0
136	309	3	Società europea	0	1	\N	0
137	310	3	Società cooperativa europea	0	1	\N	0
138	311	3	Società unipersonale	0	1	\N	0
139	312	3	Società di professionisti	0	1	\N	0
140	313	3	Società di fatto	0	1	\N	0
141	315	3	Società apparente	0	1	\N	0
142	316	3	Impresa individuale 	0	1	\N	0
143	317	3	Impresa coniugale	0	1	\N	0
144	318	3	Impresa familiare	0	1	\N	0
145	319	3	Consorzio cooperativo	0	1	\N	0
146	320	3	Società cooperativa sociale	0	1	\N	0
147	321	3	Società cooperativa di consumo	0	1	\N	0
148	322	3	Società cooperativa agricola	0	1	\N	0
149	323	3	A.T.I. Associazione temporanea di imprese	0	1	\N	0
150	324	3	R.T.I. Raggruppamento temporaneo di imprese	0	1	\N	0
151	325	3	Studio associato	0	1	\N	0
152	600	6	Raison Individuelle	0	1	\N	0
153	601	6	Société Simple	0	1	\N	0
154	602	6	Société en nom collectif	0	1	\N	0
155	603	6	Société en commandite	0	1	\N	0
156	604	6	Société anonyme (SA)	0	1	\N	0
157	605	6	Société en commandite par actions	0	1	\N	0
158	606	6	Société à responsabilité limitée (SARL)	0	1	\N	0
159	607	6	Société coopérative	0	1	\N	0
160	608	6	Association	0	1	\N	0
161	609	6	Fondation	0	1	\N	0
162	700	7	Sole Trader	0	1	\N	0
163	701	7	Partnership	0	1	\N	0
164	702	7	Private Limited Company by shares (LTD)	0	1	\N	0
165	703	7	Public Limited Company	0	1	\N	0
166	704	7	Workers Cooperative	0	1	\N	0
167	705	7	Limited Liability Partnership	0	1	\N	0
168	706	7	Franchise	0	1	\N	0
169	1000	10	Société à responsabilité limitée (SARL)	0	1	\N	0
170	1001	10	Société en Nom Collectif (SNC)	0	1	\N	0
171	1002	10	Société en Commandite Simple (SCS)	0	1	\N	0
172	1003	10	société en participation	0	1	\N	0
173	1004	10	Société Anonyme (SA)	0	1	\N	0
174	1005	10	Société Unipersonnelle à Responsabilité Limitée (SUARL)	0	1	\N	0
175	1006	10	Groupement d'intérêt économique (GEI)	0	1	\N	0
176	1007	10	Groupe de sociétés	0	1	\N	0
177	1701	17	Eenmanszaak	0	1	\N	0
178	1702	17	Maatschap	0	1	\N	0
179	1703	17	Vennootschap onder firma	0	1	\N	0
180	1704	17	Commanditaire vennootschap	0	1	\N	0
181	1705	17	Besloten vennootschap (BV)	0	1	\N	0
182	1706	17	Naamloze Vennootschap (NV)	0	1	\N	0
183	1707	17	Vereniging	0	1	\N	0
184	1708	17	Stichting	0	1	\N	0
185	1709	17	Coöperatie met beperkte aansprakelijkheid (BA)	0	1	\N	0
186	1710	17	Coöperatie met uitgesloten aansprakelijkheid (UA)	0	1	\N	0
187	1711	17	Coöperatie met wettelijke aansprakelijkheid (WA)	0	1	\N	0
188	1712	17	Onderlinge waarborgmaatschappij	0	1	\N	0
189	401	4	Empresario Individual	0	1	\N	0
190	402	4	Comunidad de Bienes	0	1	\N	0
191	403	4	Sociedad Civil	0	1	\N	0
192	404	4	Sociedad Colectiva	0	1	\N	0
193	405	4	Sociedad Limitada	0	1	\N	0
194	406	4	Sociedad Anónima	0	1	\N	0
195	407	4	Sociedad Comanditaria por Acciones	0	1	\N	0
196	408	4	Sociedad Comanditaria Simple	0	1	\N	0
197	409	4	Sociedad Laboral	0	1	\N	0
198	410	4	Sociedad Cooperativa	0	1	\N	0
199	411	4	Sociedad de Garantía Recíproca	0	1	\N	0
200	412	4	Entidad de Capital-Riesgo	0	1	\N	0
201	413	4	Agrupación de Interés Económico	0	1	\N	0
202	414	4	Sociedad de Inversión Mobiliaria	0	1	\N	0
203	415	4	Agrupación sin Ánimo de Lucro	0	1	\N	0
204	15201	152	Mauritius Private Company Limited By Shares	0	1	\N	0
205	15202	152	Mauritius Company Limited By Guarantee	0	1	\N	0
206	15203	152	Mauritius Public Company Limited By Shares	0	1	\N	0
207	15204	152	Mauritius Foreign Company	0	1	\N	0
208	15205	152	Mauritius GBC1 (Offshore Company)	0	1	\N	0
209	15206	152	Mauritius GBC2 (International Company)	0	1	\N	0
210	15207	152	Mauritius General Partnership	0	1	\N	0
211	15208	152	Mauritius Limited Partnership	0	1	\N	0
212	15209	152	Mauritius Sole Proprietorship	0	1	\N	0
213	15210	152	Mauritius Trusts	0	1	\N	0
214	15401	154	Sociedad en nombre colectivo	0	1	\N	0
215	15402	154	Sociedad en comandita simple	0	1	\N	0
216	15403	154	Sociedad de responsabilidad limitada	0	1	\N	0
217	15404	154	Sociedad anónima	0	1	\N	0
218	15405	154	Sociedad en comandita por acciones	0	1	\N	0
219	15406	154	Sociedad cooperativa	0	1	\N	0
220	14001	140	Entreprise individuelle	0	1	\N	0
221	14002	140	Société en nom collectif (SENC)	0	1	\N	0
222	14003	140	Société en commandite simple (SECS)	0	1	\N	0
223	14004	140	Société en commandite par actions (SECA)	0	1	\N	0
224	14005	140	Société à responsabilité limitée (SARL)	0	1	\N	0
225	14006	140	Société anonyme (SA)	0	1	\N	0
226	14007	140	Société coopérative (SC)	0	1	\N	0
227	14008	140	Société européenne (SE)	0	1	\N	0
228	18801	188	AFJ - Alte forme juridice	0	1	\N	0
229	18802	188	ASF - Asociatie familialã	0	1	\N	0
230	18803	188	CON - Concesiune	0	1	\N	0
231	18804	188	CRL - Soc civilã profesionala cu pers. juridica si rãspundere limitata (SPRL)	0	1	\N	0
232	18805	188	INC - Închiriere	0	1	\N	0
233	18806	188	LOC - Locaţie de gestiune	0	1	\N	0
234	18807	188	OC1 - Organizaţie cooperatistã meşteşugãreascã	0	1	\N	0
235	18808	188	OC2 - Organizaţie cooperatistã de consum	0	1	\N	0
236	18809	188	OC3 - Organizaţie cooperatistã de credit	0	1	\N	0
237	18810	188	PFA - Persoanã fizicã independentã	0	1	\N	0
238	18811	188	RA - Regie autonomã	0	1	\N	0
239	18812	188	SA - Societate comercialã pe acţiuni	0	1	\N	0
240	18813	188	SCS - Societate comercialã în comanditã simplã	0	1	\N	0
241	18814	188	SNC - Societate comercialã în nume colectiv	0	1	\N	0
242	18815	188	SPI - Societate profesionala practicieni in insolventa (SPPI)	0	1	\N	0
243	18816	188	SRL - Societate comercialã cu rãspundere limitatã	0	1	\N	0
244	18817	188	URL - Intreprindere profesionala unipersonala cu rãspundere limitata (IPURL)	0	1	\N	0
245	17801	178	Empresa individual	0	1	\N	0
246	17802	178	Asociación General	0	1	\N	0
247	17803	178	Sociedad de Responsabilidad Limitada	0	1	\N	0
248	17804	178	Sociedad Civil	0	1	\N	0
249	17805	178	Sociedad Anónima	0	1	\N	0
250	1300	13	Personne physique	0	1	\N	0
251	1301	13	Société à responsabilité limitée (SARL)	0	1	\N	0
252	1302	13	Entreprise unipersonnelle à responsabilité limitée (EURL)	0	1	\N	0
253	1303	13	Société en Nom Collectif (SNC)	0	1	\N	0
254	1304	13	société par actions (SPA)	0	1	\N	0
255	1305	13	Société en Commandite Simple (SCS)	0	1	\N	0
256	1306	13	Société en commandite par actions (SCA)	0	1	\N	0
257	1307	13	Société en participation	0	1	\N	0
258	1308	13	Groupe de sociétés	0	1	\N	0
259	2001	20	Aktiebolag	0	1	\N	0
260	2002	20	Publikt aktiebolag (AB publ)	0	1	\N	0
261	2003	20	Ekonomisk förening (ek. för.)	0	1	\N	0
262	2004	20	Bostadsrättsförening (BRF)	0	1	\N	0
263	2005	20	Hyresrättsförening (HRF)	0	1	\N	0
264	2006	20	Kooperativ	0	1	\N	0
265	2007	20	Enskild firma (EF)	0	1	\N	0
266	2008	20	Handelsbolag (HB)	0	1	\N	0
267	2009	20	Kommanditbolag (KB)	0	1	\N	0
268	2010	20	Enkelt bolag	0	1	\N	0
269	2011	20	Ideell förening	0	1	\N	0
270	2012	20	Stiftelse	0	1	\N	0
\.


--
-- Data for Name: llx_c_holiday_types; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_holiday_types (rowid, code, label, affect, delay, newbymonth, fk_country, active) FROM stdin;
1	LEAVE_SICK	Sick leave	0	0	0.00000	\N	1
2	LEAVE_OTHER	Other leave	0	0	0.00000	\N	1
3	LEAVE_PAID	Paid vacation	1	7	0.00000	\N	0
4	LEAVE_RTT_FR	RTT	1	7	0.83000	1	1
5	LEAVE_PAID_FR	Paid vacation	1	30	2.08334	1	1
\.


--
-- Data for Name: llx_c_hrm_department; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_hrm_department (rowid, pos, code, label, active) FROM stdin;
1	5	MANAGEMENT	Management	1
3	15	TRAINING	Training	1
4	20	IT	Inform. Technology (IT)	0
5	25	MARKETING	Marketing	0
6	30	SALES	Sales	1
7	35	LEGAL	Legal	0
8	40	FINANCIAL	Financial accounting	1
9	45	HUMANRES	Human resources	1
10	50	PURCHASING	Purchasing	1
12	60	CUSTOMSERV	Customer service	0
14	70	LOGISTIC	Logistics	1
15	75	CONSTRUCT	Engineering/design	0
16	80	PRODUCTION	Production	1
17	85	QUALITY	Quality assurance	0
\.


--
-- Data for Name: llx_c_hrm_function; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_hrm_function (rowid, pos, code, label, c_level, active) FROM stdin;
1	5	EXECBOARD	Executive board	0	1
2	10	MANAGDIR	Managing director	1	1
3	15	ACCOUNTMANAG	Account manager	0	1
4	20	ENGAGDIR	Engagement director	1	1
5	25	DIRECTOR	Director	1	1
6	30	PROJMANAG	Project manager	0	1
7	35	DEPHEAD	Department head	0	1
8	40	SECRETAR	Secretary	0	1
9	45	EMPLOYEE	Department employee	0	1
\.


--
-- Data for Name: llx_c_hrm_public_holiday; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_hrm_public_holiday (id, entity, fk_country, code, dayrule, day, month, year, active, import_key) FROM stdin;
1	0	0	NEWYEARDAY1		1	1	0	1	\N
2	0	0	LABORDAY1		1	5	0	1	\N
3	0	0	ASSOMPTIONDAY1		15	8	0	1	\N
4	0	0	CHRISTMASDAY1		25	12	0	1	\N
5	0	1	FR-VICTORYDAY		8	5	0	1	\N
6	0	1	FR-NATIONALDAY		14	7	0	1	\N
7	0	1	FR-ASSOMPTION		15	8	0	1	\N
8	0	1	FR-TOUSSAINT		1	11	0	1	\N
9	0	1	FR-ARMISTICE		11	11	0	1	\N
10	0	1	FR-EASTER	eastermonday	0	0	0	1	\N
11	0	1	FR-ASCENSION	ascension	0	0	0	1	\N
12	0	1	FR-PENTECOST	pentecost	0	0	0	1	\N
13	0	3	IT-LIBEAZIONE		25	4	0	1	\N
14	0	3	IT-EPIPHANY		1	6	0	1	\N
15	0	3	IT-REPUBBLICA		2	6	0	1	\N
16	0	3	IT-TUTTISANTIT		1	11	0	1	\N
17	0	3	IT-IMMACULE		8	12	0	1	\N
18	0	3	IT-SAINTSTEFAN		26	12	0	1	\N
19	0	4	ES-EASTER	easter	0	0	0	1	\N
20	0	4	ES-REYE		1	6	0	1	\N
21	0	4	ES-HISPANIDAD		12	10	0	1	\N
22	0	4	ES-TOUSSAINT		1	11	0	1	\N
23	0	4	ES-CONSTITUIZION		6	12	0	1	\N
24	0	4	ES-IMMACULE		8	12	0	1	\N
25	0	41	AT-EASTER	eastermonday	0	0	0	1	\N
26	0	41	AT-ASCENSION	ascension	0	0	0	1	\N
27	0	41	AT-PENTECOST	pentecost	0	0	0	1	\N
28	0	41	AT-FRONLEICHNAM	fronleichnam	0	0	0	1	\N
29	0	41	AT-KONEGIE		1	6	0	1	\N
30	0	41	AT-26OKT		26	10	0	1	\N
31	0	41	AT-TOUSSAINT		1	11	0	1	\N
32	0	41	AT-IMMACULE		8	12	0	1	\N
33	0	41	AT-24DEC		24	12	0	1	\N
34	0	41	AT-SAINTSTEFAN		26	12	0	1	\N
35	0	41	AT-Silvester		31	12	0	1	\N
36	0	117	IN-REPUBLICDAY		26	1	0	1	\N
37	0	117	IN-GANDI		2	10	0	1	\N
\.


--
-- Data for Name: llx_c_input_method; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_input_method (rowid, code, libelle, active, module) FROM stdin;
1	OrderByMail	Courrier	1	\N
2	OrderByFax	Fax	1	\N
3	OrderByEMail	EMail	1	\N
4	OrderByPhone	Téléphone	1	\N
5	OrderByWWW	En ligne	1	\N
\.


--
-- Data for Name: llx_c_input_reason; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_input_reason (rowid, code, label, active, module) FROM stdin;
1	SRC_INTE	Web site	1	\N
2	SRC_CAMP_MAIL	Mailing campaign	1	\N
3	SRC_CAMP_PHO	Phone campaign	1	\N
4	SRC_CAMP_FAX	Fax campaign	1	\N
5	SRC_COMM	Commercial contact	1	\N
6	SRC_SHOP	Shop contact	1	\N
7	SRC_CAMP_EMAIL	EMailing campaign	1	\N
8	SRC_WOM	Word of mouth	1	\N
9	SRC_PARTNER	Partner	1	\N
10	SRC_EMPLOYEE	Employee	1	\N
11	SRC_SPONSORING	Sponsorship	1	\N
12	SRC_CUSTOMER	Incoming contact of a customer	1	\N
\.


--
-- Data for Name: llx_c_lead_status; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_lead_status (rowid, code, label, "position", percent, active) FROM stdin;
1	PROSP	Prospection	10	0.00	1
2	QUAL	Qualification	20	20.00	1
3	PROPO	Proposal	30	40.00	1
4	NEGO	Negotiation	40	60.00	1
5	PENDING	Pending	50	50.00	0
6	WON	Won	60	100.00	1
7	LOST	Lost	70	0.00	1
\.


--
-- Data for Name: llx_c_paiement; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_paiement (id, entity, code, libelle, type, active, accountancy_code, module, "position") FROM stdin;
1	1	TIP	TIP	2	0	\N	\N	0
2	1	VIR	Transfer	2	1	\N	\N	0
3	1	PRE	Debit order	2	1	\N	\N	0
4	1	LIQ	Cash	2	1	\N	\N	0
6	1	CB	Credit card	2	1	\N	\N	0
7	1	CHQ	Cheque	2	1	\N	\N	0
50	1	VAD	Online payment	2	0	\N	\N	0
51	1	TRA	Traite	2	0	\N	\N	0
52	1	LCR	LCR	2	0	\N	\N	0
53	1	FAC	Factor	2	0	\N	\N	0
100	1	KLA	Klarna	1	0	\N	\N	0
101	1	SOF	Sofort	1	0	\N	\N	0
102	1	BAN	Bancontact	1	0	\N	\N	0
103	1	IDE	iDeal	1	0	\N	\N	0
104	1	GIR	Giropay	1	0	\N	\N	0
\.


--
-- Data for Name: llx_c_paper_format; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_paper_format (rowid, code, label, width, height, unit, active, module) FROM stdin;
1	EU4A0	Format 4A0	1682.00	2378.00	mm	1	\N
2	EU2A0	Format 2A0	1189.00	1682.00	mm	1	\N
3	EUA0	Format A0	840.00	1189.00	mm	1	\N
4	EUA1	Format A1	594.00	840.00	mm	1	\N
5	EUA2	Format A2	420.00	594.00	mm	1	\N
6	EUA3	Format A3	297.00	420.00	mm	1	\N
7	EUA4	Format A4	210.00	297.00	mm	1	\N
8	EUA5	Format A5	148.00	210.00	mm	1	\N
9	EUA6	Format A6	105.00	148.00	mm	1	\N
100	USLetter	Format Letter (A)	216.00	279.00	mm	1	\N
105	USLegal	Format Legal	216.00	356.00	mm	1	\N
110	USExecutive	Format Executive	190.00	254.00	mm	1	\N
115	USLedger	Format Ledger/Tabloid (B)	279.00	432.00	mm	1	\N
200	CAP1	Format Canadian P1	560.00	860.00	mm	1	\N
205	CAP2	Format Canadian P2	430.00	560.00	mm	1	\N
210	CAP3	Format Canadian P3	280.00	430.00	mm	1	\N
215	CAP4	Format Canadian P4	215.00	280.00	mm	1	\N
220	CAP5	Format Canadian P5	140.00	215.00	mm	1	\N
225	CAP6	Format Canadian P6	107.00	140.00	mm	1	\N
\.


--
-- Data for Name: llx_c_partnership_type; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_partnership_type (rowid, entity, code, label, active) FROM stdin;
\.


--
-- Data for Name: llx_c_payment_term; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_payment_term (rowid, entity, code, sortorder, active, libelle, libelle_facture, type_cdr, nbjour, decalage, module, "position") FROM stdin;
1	1	RECEP	1	1	Due upon receipt	Due upon receipt	0	1	\N	\N	0
2	1	30D	2	1	30 days	Due in 30 days	0	30	\N	\N	0
3	1	30DENDMONTH	3	1	30 days end of month	Due in 30 days, end of month	1	30	\N	\N	0
4	1	60D	4	1	60 days	Due in 60 days, end of month	0	60	\N	\N	0
5	1	60DENDMONTH	5	1	60 days end of month	Due in 60 days, end of month	1	60	\N	\N	0
6	1	PT_ORDER	6	1	Due on order	Due on order	0	1	\N	\N	0
7	1	PT_DELIVERY	7	1	Due on delivery	Due on delivery	0	1	\N	\N	0
8	1	PT_5050	8	1	50 and 50	50% on order, 50% on delivery	0	1	\N	\N	0
9	1	10D	9	1	10 days	Due in 10 days	0	10	\N	\N	0
10	1	10DENDMONTH	10	1	10 days end of month	Due in 10 days, end of month	1	10	\N	\N	0
11	1	14D	11	1	14 days	Due in 14 days	0	14	\N	\N	0
12	1	14DENDMONTH	12	1	14 days end of month	Due in 14 days, end of month	1	14	\N	\N	0
\.


--
-- Data for Name: llx_c_price_expression; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_price_expression (rowid, title, expression) FROM stdin;
\.


--
-- Data for Name: llx_c_price_global_variable; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_price_global_variable (rowid, code, description, value) FROM stdin;
\.


--
-- Data for Name: llx_c_price_global_variable_updater; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_price_global_variable_updater (rowid, type, description, parameters, fk_variable, update_interval, next_update, last_status) FROM stdin;
\.


--
-- Data for Name: llx_c_product_nature; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_product_nature (rowid, code, label, active) FROM stdin;
1	0	RowMaterial	1
2	1	Finished	1
\.


--
-- Data for Name: llx_c_productbatch_qcstatus; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_productbatch_qcstatus (rowid, entity, code, label, active) FROM stdin;
1	1	OK	InWorkingOrder	1
2	1	KO	OutOfOrder	1
\.


--
-- Data for Name: llx_c_propalst; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_propalst (id, code, label, active) FROM stdin;
0	PR_DRAFT	Brouillon	1
1	PR_OPEN	Ouverte	1
2	PR_SIGNED	Signée	1
3	PR_NOTSIGNED	Non Signée	1
4	PR_FAC	Facturée	1
\.


--
-- Data for Name: llx_c_prospectcontactlevel; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_prospectcontactlevel (code, label, sortorder, active, module) FROM stdin;
PL_NONE	None	1	1	\N
PL_LOW	Low	2	1	\N
PL_MEDIUM	Medium	3	1	\N
PL_HIGH	High	4	1	\N
\.


--
-- Data for Name: llx_c_prospectlevel; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_prospectlevel (code, label, sortorder, active, module) FROM stdin;
PL_NONE	None	1	1	\N
PL_LOW	Low	2	1	\N
PL_MEDIUM	Medium	3	1	\N
PL_HIGH	High	4	1	\N
\.


--
-- Data for Name: llx_c_recruitment_origin; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_recruitment_origin (rowid, code, label, active) FROM stdin;
\.


--
-- Data for Name: llx_c_regions; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_regions (rowid, code_region, fk_pays, cheflieu, tncc, nom, active) FROM stdin;
1	0	0	0	0	-	1
2	1301	13		0	Algerie	1
3	34000	34	AD	\N	Andorra	1
4	35001	35	AO	\N	Angola	1
5	2301	23		0	Norte	1
6	2302	23		0	Litoral	1
7	2303	23		0	Cuyana	1
8	2304	23		0	Central	1
9	2305	23		0	Patagonia	1
10	2801	28		0	Australia	1
11	4101	41		0	Österreich	1
12	4601	46		0	Barbados	1
13	201	2		1	Flandre	1
14	202	2		2	Wallonie	1
15	203	2		3	Bruxelles-Capitale	1
16	5201	52		0	Chuquisaca	1
17	5202	52		0	La Paz	1
18	5203	52		0	Cochabamba	1
19	5204	52		0	Oruro	1
20	5205	52		0	Potosí	1
21	5206	52		0	Tarija	1
22	5207	52		0	Santa Cruz	1
23	5208	52		0	El Beni	1
24	5209	52		0	Pando	1
25	5601	56		0	Brasil	1
26	1401	14		0	Canada	1
27	6701	67	\N	\N	Tarapacá	1
28	6702	67	\N	\N	Antofagasta	1
29	6703	67	\N	\N	Atacama	1
30	6704	67	\N	\N	Coquimbo	1
31	6705	67	\N	\N	Valparaíso	1
32	6706	67	\N	\N	General Bernardo O Higgins	1
33	6707	67	\N	\N	Maule	1
34	6708	67	\N	\N	Biobío	1
35	6709	67	\N	\N	Raucanía	1
36	6710	67	\N	\N	Los Lagos	1
37	6711	67	\N	\N	Aysén General Carlos Ibáñez del Campo	1
38	6712	67	\N	\N	Magallanes y Antártica Chilena	1
39	6713	67	\N	\N	Metropolitana de Santiago	1
40	6714	67	\N	\N	Los Ríos	1
41	6715	67	\N	\N	Arica y Parinacota	1
42	901	9	京	0	北京市	1
43	902	9	津	0	天津市	1
44	903	9	沪	0	上海市	1
45	904	9	渝	0	重庆市	1
46	905	9	冀	0	河北省	1
47	906	9	晋	0	山西省	1
48	907	9	辽	0	辽宁省	1
49	908	9	吉	0	吉林省	1
50	909	9	黑	0	黑龙江省	1
51	910	9	苏	0	江苏省	1
52	911	9	浙	0	浙江省	1
53	912	9	皖	0	安徽省	1
54	913	9	闽	0	福建省	1
55	914	9	赣	0	江西省	1
56	915	9	鲁	0	山东省	1
57	916	9	豫	0	河南省	1
58	917	9	鄂	0	湖北省	1
59	918	9	湘	0	湖南省	1
60	919	9	粤	0	广东省	1
61	920	9	琼	0	海南省	1
62	921	9	川	0	四川省	1
63	922	9	贵	0	贵州省	1
64	923	9	云	0	云南省	1
65	924	9	陕	0	陕西省	1
66	925	9	甘	0	甘肃省	1
67	926	9	青	0	青海省	1
68	927	9	台	0	台湾省	1
69	928	9	蒙	0	内蒙古自治区	1
70	929	9	桂	0	广西壮族自治区	1
71	930	9	藏	0	西藏自治区	1
72	931	9	宁	0	宁夏回族自治区	1
73	932	9	新	0	新疆维吾尔自治区	1
74	933	9	港	0	香港特别行政区	1
75	934	9	澳	0	澳门特别行政区	1
76	7001	70		0	Colombie	1
77	8001	80		0	Nordjylland	1
78	8002	80		0	Midtjylland	1
79	8003	80		0	Syddanmark	1
80	8004	80		0	Hovedstaden	1
81	8005	80		0	Sjælland	1
82	1	1	97105	3	Guadeloupe	1
83	2	1	97209	3	Martinique	1
84	3	1	97302	3	Guyane	1
85	4	1	97411	3	Réunion	1
86	6	1	97601	3	Mayotte	1
87	11	1	75056	1	Île-de-France	1
88	24	1	45234	2	Centre-Val de Loire	1
89	27	1	21231	0	Bourgogne-Franche-Comté	1
90	28	1	76540	0	Normandie	1
91	32	1	59350	4	Hauts-de-France	1
92	44	1	67482	2	Grand Est	1
93	52	1	44109	4	Pays de la Loire	1
94	53	1	35238	0	Bretagne	1
95	75	1	33063	0	Nouvelle-Aquitaine	1
96	76	1	31355	1	Occitanie	1
97	84	1	69123	1	Auvergne-Rhône-Alpes	1
98	93	1	13055	0	Provence-Alpes-Côte d'Azur	1
99	94	1	2A004	0	Corse	1
100	501	5		0	Deutschland	1
101	10201	102	\N	\N	Αττική	1
102	10202	102	\N	\N	Στερεά Ελλάδα	1
103	10203	102	\N	\N	Κεντρική Μακεδονία	1
104	10204	102	\N	\N	Κρήτη	1
105	10205	102	\N	\N	Ανατολική Μακεδονία και Θράκη	1
106	10206	102	\N	\N	Ήπειρος	1
107	10207	102	\N	\N	Ιόνια νησιά	1
108	10208	102	\N	\N	Βόρειο Αιγαίο	1
109	10209	102	\N	\N	Πελοπόννησος	1
110	10210	102	\N	\N	Νότιο Αιγαίο	1
111	10211	102	\N	\N	Δυτική Ελλάδα	1
112	10212	102	\N	\N	Θεσσαλία	1
113	10213	102	\N	\N	Δυτική Μακεδονία	1
114	11401	114		0	Honduras	1
115	180100	18	HU1	\N	Közép-Magyarország	1
116	182100	18	HU21	\N	Közép-Dunántúl	1
117	182200	18	HU22	\N	Nyugat-Dunántúl	1
118	182300	18	HU23	\N	Dél-Dunántúl	1
119	183100	18	HU31	\N	Észak-Magyarország	1
120	183200	18	HU32	\N	Észak-Alföld	1
121	183300	18	HU33	\N	Dél-Alföld	1
122	11701	117		0	India	1
123	11801	118		0	Indonesia	1
124	301	3	\N	1	Abruzzo	1
125	302	3	\N	1	Basilicata	1
126	303	3	\N	1	Calabria	1
127	304	3	\N	1	Campania	1
128	305	3	\N	1	Emilia-Romagna	1
129	306	3	\N	1	Friuli-Venezia Giulia	1
130	307	3	\N	1	Lazio	1
131	308	3	\N	1	Liguria	1
132	309	3	\N	1	Lombardia	1
133	310	3	\N	1	Marche	1
134	311	3	\N	1	Molise	1
135	312	3	\N	1	Piemonte	1
136	313	3	\N	1	Puglia	1
137	314	3	\N	1	Sardegna	1
138	315	3	\N	1	Sicilia	1
139	316	3	\N	1	Toscana	1
140	317	3	\N	1	Trentino-Alto Adige	1
141	318	3	\N	1	Umbria	1
142	319	3	\N	1	Valle d Aosta	1
143	320	3	\N	1	Veneto	1
144	14001	140		0	Diekirch	1
145	14002	140		0	Grevenmacher	1
146	14003	140		0	Luxembourg	1
147	15201	152		0	Rivière Noire	1
148	15202	152		0	Flacq	1
149	15203	152		0	Grand Port	1
150	15204	152		0	Moka	1
151	15205	152		0	Pamplemousses	1
152	15206	152		0	Plaines Wilhems	1
153	15207	152		0	Port-Louis	1
154	15208	152		0	Rivière du Rempart	1
155	15209	152		0	Savanne	1
156	15210	152		0	Rodrigues	1
157	15211	152		0	Les îles Agaléga	1
158	15212	152		0	Les écueils des Cargados Carajos	1
159	15401	154		0	Mexique	1
160	1201	12		0	Tanger-Tétouan	1
161	1202	12		0	Gharb-Chrarda-Beni Hssen	1
162	1203	12		0	Taza-Al Hoceima-Taounate	1
163	1204	12		0	L'Oriental	1
164	1205	12		0	Fès-Boulemane	1
165	1206	12		0	Meknès-Tafialet	1
166	1207	12		0	Rabat-Salé-Zemour-Zaër	1
167	1208	12		0	Grand Cassablanca	1
168	1209	12		0	Chaouia-Ouardigha	1
169	1210	12		0	Doukahla-Adba	1
170	1211	12		0	Marrakech-Tensift-Al Haouz	1
171	1212	12		0	Tadla-Azilal	1
172	1213	12		0	Sous-Massa-Drâa	1
173	1214	12		0	Guelmim-Es Smara	1
174	1215	12		0	Laâyoune-Boujdour-Sakia el Hamra	1
175	1216	12		0	Oued Ed-Dahab Lagouira	1
176	1701	17		0	Provincies van Nederland 	1
177	17801	178		0	Panama	1
178	18101	181		0	Amazonas	1
179	18102	181		0	Ancash	1
180	18103	181		0	Apurimac	1
181	18104	181		0	Arequipa	1
182	18105	181		0	Ayacucho	1
183	18106	181		0	Cajamarca	1
184	18107	181		0	Callao	1
185	18108	181		0	Cuzco	1
186	18109	181		0	Huancavelica	1
187	18110	181		0	Huanuco	1
188	18111	181		0	Ica	1
189	18112	181		0	Junin	1
190	18113	181		0	La Libertad	1
191	18114	181		0	Lambayeque	1
192	18115	181		0	Lima Metropolitana	1
193	18116	181		0	Lima	1
194	18117	181		0	Loreto	1
195	18118	181		0	Madre de Dios	1
196	18119	181		0	Moquegua	1
197	18120	181		0	Pasco	1
198	18121	181		0	Piura	1
199	18122	181		0	Puno	1
200	18123	181		0	San Martín	1
201	18124	181		0	Tacna	1
202	18125	181		0	Tumbes	1
203	18126	181		0	Ucayali	1
204	15001	25	PT	\N	Portugal	1
205	15002	25	PT9	\N	Azores-Madeira	1
206	18801	188		0	Romania	1
207	8601	86	\N	\N	Central	1
208	8602	86	\N	\N	Oriental	1
209	8603	86	\N	\N	Occidental	1
210	20203	202	SI03	\N	East Slovenia	1
211	20204	202	SI04	\N	West Slovenia	1
212	401	4		0	Andalucia	1
213	402	4		0	Aragón	1
214	403	4		0	Castilla y León	1
215	404	4		0	Castilla la Mancha	1
216	405	4		0	Canarias	1
217	406	4		0	Cataluña	1
218	407	4		0	Comunidad de Ceuta	1
219	408	4		0	Comunidad Foral de Navarra	1
220	409	4		0	Comunidad de Melilla	1
221	410	4		0	Cantabria	1
222	411	4		0	Comunidad Valenciana	1
223	412	4		0	Extemadura	1
224	413	4		0	Galicia	1
225	414	4		0	Islas Baleares	1
226	415	4		0	La Rioja	1
227	416	4		0	Comunidad de Madrid	1
228	417	4		0	Región de Murcia	1
229	418	4		0	Principado de Asturias	1
230	419	4		0	Pais Vasco	1
231	420	4		0	Otros	1
232	601	6		1	Cantons	1
233	21301	213	TW	\N	Taiwan	1
234	1001	10		0	Ariana	1
235	1002	10		0	Béja	1
236	1003	10		0	Ben Arous	1
237	1004	10		0	Bizerte	1
238	1005	10		0	Gabès	1
239	1006	10		0	Gafsa	1
240	1007	10		0	Jendouba	1
241	1008	10		0	Kairouan	1
242	1009	10		0	Kasserine	1
243	1010	10		0	Kébili	1
244	1011	10		0	La Manouba	1
245	1012	10		0	Le Kef	1
246	1013	10		0	Mahdia	1
247	1014	10		0	Médenine	1
248	1015	10		0	Monastir	1
249	1016	10		0	Nabeul	1
250	1017	10		0	Sfax	1
251	1018	10		0	Sidi Bouzid	1
252	1019	10		0	Siliana	1
253	1020	10		0	Sousse	1
254	1021	10		0	Tataouine	1
255	1022	10		0	Tozeur	1
256	1023	10		0	Tunis	1
257	1024	10		0	Zaghouan	1
258	22701	227		0	United Arab Emirates	1
259	701	7		0	England	1
260	702	7		0	Wales	1
261	703	7		0	Scotland	1
262	704	7		0	Northern Ireland	1
263	1101	11		0	United-States	1
264	23201	232		0	Los Andes	1
265	23202	232		0	Capital	1
266	23203	232		0	Central	1
267	23204	232		0	Cento Occidental	1
268	23205	232		0	Guayana	1
269	23206	232		0	Insular	1
270	23207	232		0	Los Llanos	1
271	23208	232		0	Nor-Oriental	1
272	23209	232		0	Zuliana	1
\.


--
-- Data for Name: llx_c_revenuestamp; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_revenuestamp (rowid, fk_pays, taux, revenuestamp_type, note, active, accountancy_code_sell, accountancy_code_buy) FROM stdin;
101	10	0.4	fixed	Revenue stamp tunisia	1	\N	\N
1541	154	1.5	percent	Revenue stamp mexico	1	\N	\N
1542	154	3	percent	Revenue stamp mexico	1	\N	\N
\.


--
-- Data for Name: llx_c_shipment_mode; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_shipment_mode (rowid, entity, tms, code, libelle, description, tracking, active, module) FROM stdin;
1	1	2022-03-11 11:42:57.003327	CATCH	In-Store Collection	In-store collection by the customer		1	\N
2	1	2022-03-11 11:42:57.003327	TRANS	Generic transport service	Generic transport service		1	\N
3	1	2022-03-11 11:42:57.003327	COLSUI	Colissimo Suivi	Colissimo Suivi	https://www.laposte.fr/outils/suivre-vos-envois?code={TRACKID}	0	\N
4	1	2022-03-11 11:42:57.003327	LETTREMAX	Lettre Max	Courrier Suivi et Lettre Max	https://www.laposte.fr/outils/suivre-vos-envois?code={TRACKID}	0	\N
5	1	2022-03-11 11:42:57.003327	UPS	UPS	United Parcel Service	http://wwwapps.ups.com/etracking/tracking.cgi?InquiryNumber2=&InquiryNumber3=&tracknums_displayed=3&loc=fr_FR&TypeOfInquiryNumber=T&HTMLVersion=4.0&InquiryNumber22=&InquiryNumber32=&track=Track&Suivi.x=64&Suivi.y=7&Suivi=Valider&InquiryNumber1={TRACKID}	1	\N
6	1	2022-03-11 11:42:57.003327	KIALA	KIALA	Relais Kiala	http://www.kiala.fr/tnt/delivery/{TRACKID}	0	\N
7	1	2022-03-11 11:42:57.003327	GLS	GLS	General Logistics Systems	https://gls-group.eu/FR/fr/suivi-colis?match={TRACKID}	0	\N
8	1	2022-03-11 11:42:57.003327	CHRONO	Chronopost	Chronopost	http://www.chronopost.fr/expedier/inputLTNumbersNoJahia.do?listeNumeros={TRACKID}	0	\N
9	1	2022-03-11 11:42:57.003327	INPERSON	In person at your site	\N	\N	0	\N
10	1	2022-03-11 11:42:57.003327	FEDEX	Fedex	\N	https://www.fedex.com/apps/fedextrack/index.html?tracknumbers={TRACKID}	0	\N
11	1	2022-03-11 11:42:57.003327	TNT	TNT	\N	https://www.tnt.com/express/fr_fr/site/outils-expedition/suivi.html?searchType=con&cons=={TRACKID}	0	\N
12	1	2022-03-11 11:42:57.003327	DHL	DHL	\N	https://www.dhl.com/fr-fr/home/tracking/tracking-global-forwarding.html?submit=1&tracking-id={TRACKID}	0	\N
13	1	2022-03-11 11:42:57.003327	DPD	DPD	\N	https://www.dpd.fr/trace/{TRACKID}	0	\N
14	1	2022-03-11 11:42:57.003327	MAINFREIGHT	Mainfreight	\N	https://www.mainfreight.com/track?{TRACKID}	0	\N
\.


--
-- Data for Name: llx_c_shipment_package_type; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_shipment_package_type (rowid, label, description, active, entity) FROM stdin;
\.


--
-- Data for Name: llx_c_socialnetworks; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_c_socialnetworks (rowid, entity, code, label, url, icon, active) FROM stdin;
1	1	500px	500px	{socialid}	fa-500px	0
2	1	dailymotion	Dailymotion	{socialid}		0
3	1	diaspora	Diaspora	{socialid}		0
4	1	discord	Discord	{socialid}	fa-discord	0
5	1	facebook	Facebook	https://www.facebook.com/{socialid}	fa-facebook	1
6	1	flickr	Flickr	{socialid}	fa-flickr	0
7	1	gifycat	Gificat	{socialid}		0
8	1	giphy	Giphy	{socialid}		0
9	1	googleplus	GooglePlus	https://www.googleplus.com/{socialid}	fa-google-plus-g	0
10	1	instagram	Instagram	https://www.instagram.com/{socialid}	fa-instagram	1
11	1	linkedin	LinkedIn	https://www.linkedin.com/{socialid}	fa-linkedin	1
12	1	mastodon	Mastodon	{socialid}		0
13	1	meetup	Meetup	{socialid}	fa-meetup	0
14	1	periscope	Periscope	{socialid}		0
15	1	pinterest	Pinterest	{socialid}	fa-pinterest	0
16	1	quora	Quora	{socialid}		0
17	1	reddit	Reddit	{socialid}	fa-reddit	0
18	1	slack	Slack	{socialid}	fa-slack	0
19	1	snapchat	Snapchat	{socialid}	fa-snapchat	1
20	1	skype	Skype	https://www.skype.com/{socialid}	fa-skype	1
21	1	tripadvisor	Tripadvisor	{socialid}		0
22	1	tumblr	Tumblr	https://www.tumblr.com/{socialid}	fa-tumblr	0
23	1	twitch	Twitch	{socialid}		0
24	1	twitter	Twitter	https://www.twitter.com/{socialid}	fa-twitter	1
25	1	vero	Vero	https://vero.co/{socialid}		0
26	1	viadeo	Viadeo	https://fr.viadeo.com/fr/{socialid}	fa-viadeo	0
27	1	viber	Viber	{socialid}		0
28	1	vimeo	Vimeo	{socialid}		0
29	1	whatsapp	Whatsapp	{socialid}	fa-whatsapp	1
30	1	wikipedia	Wikipedia	{socialid}		0
31	1	xing	Xing	{socialid}	fa-xing	0
32	1	youtube	Youtube	https://www.youtube.com/{socialid}	fa-youtube	1
\.


--
-- Data for Name: llx_facturedet_rec; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_facturedet_rec (rowid, fk_facture, fk_parent_line, fk_product, product_type, label, description, vat_src_code, tva_tx, localtax1_tx, localtax1_type, localtax2_tx, localtax2_type, qty, remise_percent, remise, subprice, price, total_ht, total_tva, total_localtax1, total_localtax2, total_ttc, date_start_fill, date_end_fill, info_bits, buy_price_ht, fk_product_fournisseur_price, special_code, rang, fk_contract_line, fk_unit, import_key, fk_user_author, fk_user_modif, fk_multicurrency, multicurrency_code, multicurrency_subprice, multicurrency_total_ht, multicurrency_total_tva, multicurrency_total_ttc) FROM stdin;
\.


--
-- Data for Name: llx_facturedet_rec_extrafields; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_facturedet_rec_extrafields (rowid, tms, fk_object, import_key) FROM stdin;
\.


--
-- Data for Name: llx_fichinterdet_extrafields; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_fichinterdet_extrafields (rowid, tms, fk_object, import_key) FROM stdin;
\.


--
-- Data for Name: llx_recruitment_recruitmentcandidature_extrafields; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_recruitment_recruitmentcandidature_extrafields (rowid, tms, fk_object, import_key) FROM stdin;
\.


--
-- Data for Name: llx_resource_extrafields; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_resource_extrafields (rowid, tms, fk_object, import_key) FROM stdin;
\.


--
-- Data for Name: llx_rights_def; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_rights_def (id, libelle, module, module_position, family_position, entity, perms, subperms, type, bydefault) FROM stdin;
251	Read information of other users, groups and permissions	user	0	0	1	user	lire	r	0
252	Read permissions of other users	user	0	0	1	user_advance	readperms	r	0
253	Create/modify internal and external users, groups and permissions	user	0	0	1	user	creer	w	0
254	Create/modify external users only	user	0	0	1	user_advance	write	w	0
255	Modify the password of other users	user	0	0	1	user	password	w	0
256	Delete or disable other users	user	0	0	1	user	supprimer	d	0
341	Read its own permissions	user	0	0	1	self_advance	readperms	r	0
342	Create/modify of its own user	user	0	0	1	self	creer	w	0
343	Modify its own password	user	0	0	1	self	password	w	0
344	Modify its own permissions	user	0	0	1	self_advance	writeperms	w	0
351	Read groups	user	0	0	1	group_advance	read	r	0
352	Read permissions of groups	user	0	0	1	group_advance	readperms	r	0
353	Create/modify groups and permissions	user	0	0	1	group_advance	write	w	0
354	Delete groups	user	0	0	1	group_advance	delete	d	0
358	Export all users	user	0	0	1	user	export	r	0
\.


--
-- Data for Name: llx_takepos_floor_tables; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_takepos_floor_tables (rowid, entity, label, leftpos, toppos, floor) FROM stdin;
\.


--
-- Data for Name: llx_user_rights; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_user_rights (rowid, entity, fk_user, fk_id) FROM stdin;
2	1	1	252
4	1	1	253
5	1	1	254
7	1	1	255
9	1	1	256
10	1	1	341
11	1	1	342
12	1	1	343
13	1	1	344
16	1	1	352
18	1	1	353
19	1	1	351
20	1	1	354
21	1	1	251
22	1	1	358
\.


--
-- Data for Name: llx_usergroup_extrafields; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_usergroup_extrafields (rowid, tms, fk_object, import_key) FROM stdin;
\.


--
-- Data for Name: llx_workstation_workstation_resource; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.llx_workstation_workstation_resource (rowid, tms, fk_resource, fk_workstation) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.orders (id, gig_id, seller_id, buyer_id, order_status, accepted_at, delivery_time, price, metadata, created_at, updated_at, delivered_at, declined_at, cancelled_at) FROM stdin;
1	2	seller identity	buyer identity	pending	\N	126000	203	...	2022-03-22 14:06:14.475418	2022-03-22 14:06:14.475418	\N	\N	\N
\.


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: knowledgebase
--

COPY public.proposals (id, gig_id, seller_id, buyer_id, proposal_status, delivery_time, price, metadata, created_at, updated_at, description) FROM stdin;
1	2	seller identity	buyer identity	pending	32000	203	...	2022-03-22 13:54:55.171451	2022-03-22 13:54:55.171451	...
\.


--
-- Name: delivery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.delivery_id_seq', 1, true);


--
-- Name: gig_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.gig_images_id_seq', 6, true);


--
-- Name: gig_packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.gig_packages_id_seq', 3, true);


--
-- Name: gig_requirements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.gig_requirements_id_seq', 1, false);


--
-- Name: gig_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.gig_tags_id_seq', 3, true);


--
-- Name: gigs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.gigs_id_seq', 1, true);


--
-- Name: llx_accounting_account_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_accounting_account_rowid_seq', 1, false);


--
-- Name: llx_accounting_bookkeeping_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_accounting_bookkeeping_rowid_seq', 1, false);


--
-- Name: llx_accounting_bookkeeping_tmp_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_accounting_bookkeeping_tmp_rowid_seq', 1, false);


--
-- Name: llx_accounting_fiscalyear_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_accounting_fiscalyear_rowid_seq', 1, false);


--
-- Name: llx_accounting_groups_account_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_accounting_groups_account_rowid_seq', 1, false);


--
-- Name: llx_accounting_journal_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_accounting_journal_rowid_seq', 7, true);


--
-- Name: llx_accounting_system_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_accounting_system_rowid_seq', 40, true);


--
-- Name: llx_c_departements_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_departements_rowid_seq', 1540, true);


--
-- Name: llx_c_ecotaxe_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_ecotaxe_rowid_seq', 1, false);


--
-- Name: llx_c_email_senderprofile_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_email_senderprofile_rowid_seq', 1, false);


--
-- Name: llx_c_email_templates_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_email_templates_rowid_seq', 18, true);


--
-- Name: llx_c_exp_tax_cat_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_exp_tax_cat_rowid_seq', 1, false);


--
-- Name: llx_c_exp_tax_range_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_exp_tax_range_rowid_seq', 1, false);


--
-- Name: llx_c_field_list_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_field_list_rowid_seq', 1, false);


--
-- Name: llx_c_format_cards_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_format_cards_rowid_seq', 1, false);


--
-- Name: llx_c_forme_juridique_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_forme_juridique_rowid_seq', 270, true);


--
-- Name: llx_c_holiday_types_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_holiday_types_rowid_seq', 5, true);


--
-- Name: llx_c_hrm_public_holiday_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_hrm_public_holiday_id_seq', 37, true);


--
-- Name: llx_c_input_method_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_input_method_rowid_seq', 1, false);


--
-- Name: llx_c_input_reason_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_input_reason_rowid_seq', 1, false);


--
-- Name: llx_c_lead_status_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_lead_status_rowid_seq', 1, false);


--
-- Name: llx_c_paiement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_paiement_id_seq', 1, false);


--
-- Name: llx_c_paper_format_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_paper_format_rowid_seq', 1, false);


--
-- Name: llx_c_partnership_type_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_partnership_type_rowid_seq', 1, false);


--
-- Name: llx_c_payment_term_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_payment_term_rowid_seq', 1, false);


--
-- Name: llx_c_price_expression_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_price_expression_rowid_seq', 1, false);


--
-- Name: llx_c_price_global_variable_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_price_global_variable_rowid_seq', 1, false);


--
-- Name: llx_c_price_global_variable_updater_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_price_global_variable_updater_rowid_seq', 1, false);


--
-- Name: llx_c_product_nature_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_product_nature_rowid_seq', 2, true);


--
-- Name: llx_c_productbatch_qcstatus_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_productbatch_qcstatus_rowid_seq', 2, true);


--
-- Name: llx_c_recruitment_origin_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_recruitment_origin_rowid_seq', 1, false);


--
-- Name: llx_c_regions_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_regions_rowid_seq', 272, true);


--
-- Name: llx_c_revenuestamp_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_revenuestamp_rowid_seq', 1, false);


--
-- Name: llx_c_shipment_mode_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_shipment_mode_rowid_seq', 1, false);


--
-- Name: llx_c_shipment_package_type_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_shipment_package_type_rowid_seq', 1, false);


--
-- Name: llx_c_socialnetworks_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_c_socialnetworks_rowid_seq', 32, true);


--
-- Name: llx_facturedet_rec_extrafields_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_facturedet_rec_extrafields_rowid_seq', 1, false);


--
-- Name: llx_facturedet_rec_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_facturedet_rec_rowid_seq', 1, false);


--
-- Name: llx_fichinterdet_extrafields_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_fichinterdet_extrafields_rowid_seq', 1, false);


--
-- Name: llx_recruitment_recruitmentcandidature_extrafields_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_recruitment_recruitmentcandidature_extrafields_rowid_seq', 1, false);


--
-- Name: llx_resource_extrafields_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_resource_extrafields_rowid_seq', 1, false);


--
-- Name: llx_takepos_floor_tables_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_takepos_floor_tables_rowid_seq', 1, false);


--
-- Name: llx_user_rights_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_user_rights_rowid_seq', 22, true);


--
-- Name: llx_usergroup_extrafields_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_usergroup_extrafields_rowid_seq', 1, false);


--
-- Name: llx_workstation_workstation_resource_rowid_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.llx_workstation_workstation_resource_rowid_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, true);


--
-- Name: proposals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: knowledgebase
--

SELECT pg_catalog.setval('public.proposals_id_seq', 1, true);


--
-- Name: delivery delivery_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.delivery
    ADD CONSTRAINT delivery_pkey PRIMARY KEY (id);


--
-- Name: gig_images gig_images_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.gig_images
    ADD CONSTRAINT gig_images_pkey PRIMARY KEY (id);


--
-- Name: gig_packages gig_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.gig_packages
    ADD CONSTRAINT gig_packages_pkey PRIMARY KEY (id);


--
-- Name: gig_requirements gig_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.gig_requirements
    ADD CONSTRAINT gig_requirements_pkey PRIMARY KEY (id);


--
-- Name: gig_location_tags gig_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.gig_location_tags
    ADD CONSTRAINT gig_tags_pkey PRIMARY KEY (id);


--
-- Name: gigs gigs_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.gigs
    ADD CONSTRAINT gigs_pkey PRIMARY KEY (id);


--
-- Name: llx_accounting_account llx_accounting_account_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_account
    ADD CONSTRAINT llx_accounting_account_pkey PRIMARY KEY (rowid);


--
-- Name: llx_accounting_bookkeeping llx_accounting_bookkeeping_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_bookkeeping
    ADD CONSTRAINT llx_accounting_bookkeeping_pkey PRIMARY KEY (rowid);


--
-- Name: llx_accounting_bookkeeping_tmp llx_accounting_bookkeeping_tmp_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_bookkeeping_tmp
    ADD CONSTRAINT llx_accounting_bookkeeping_tmp_pkey PRIMARY KEY (rowid);


--
-- Name: llx_accounting_fiscalyear llx_accounting_fiscalyear_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_fiscalyear
    ADD CONSTRAINT llx_accounting_fiscalyear_pkey PRIMARY KEY (rowid);


--
-- Name: llx_accounting_groups_account llx_accounting_groups_account_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_groups_account
    ADD CONSTRAINT llx_accounting_groups_account_pkey PRIMARY KEY (rowid);


--
-- Name: llx_accounting_journal llx_accounting_journal_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_journal
    ADD CONSTRAINT llx_accounting_journal_pkey PRIMARY KEY (rowid);


--
-- Name: llx_accounting_system llx_accounting_system_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_system
    ADD CONSTRAINT llx_accounting_system_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_departements llx_c_departements_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_departements
    ADD CONSTRAINT llx_c_departements_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_ecotaxe llx_c_ecotaxe_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_ecotaxe
    ADD CONSTRAINT llx_c_ecotaxe_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_effectif llx_c_effectif_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_effectif
    ADD CONSTRAINT llx_c_effectif_pkey PRIMARY KEY (id);


--
-- Name: llx_c_email_senderprofile llx_c_email_senderprofile_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_email_senderprofile
    ADD CONSTRAINT llx_c_email_senderprofile_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_email_templates llx_c_email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_email_templates
    ADD CONSTRAINT llx_c_email_templates_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_exp_tax_cat llx_c_exp_tax_cat_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_exp_tax_cat
    ADD CONSTRAINT llx_c_exp_tax_cat_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_exp_tax_range llx_c_exp_tax_range_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_exp_tax_range
    ADD CONSTRAINT llx_c_exp_tax_range_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_field_list llx_c_field_list_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_field_list
    ADD CONSTRAINT llx_c_field_list_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_format_cards llx_c_format_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_format_cards
    ADD CONSTRAINT llx_c_format_cards_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_forme_juridique llx_c_forme_juridique_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_forme_juridique
    ADD CONSTRAINT llx_c_forme_juridique_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_holiday_types llx_c_holiday_types_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_holiday_types
    ADD CONSTRAINT llx_c_holiday_types_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_hrm_department llx_c_hrm_department_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_hrm_department
    ADD CONSTRAINT llx_c_hrm_department_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_hrm_function llx_c_hrm_function_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_hrm_function
    ADD CONSTRAINT llx_c_hrm_function_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_hrm_public_holiday llx_c_hrm_public_holiday_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_hrm_public_holiday
    ADD CONSTRAINT llx_c_hrm_public_holiday_pkey PRIMARY KEY (id);


--
-- Name: llx_c_input_method llx_c_input_method_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_input_method
    ADD CONSTRAINT llx_c_input_method_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_input_reason llx_c_input_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_input_reason
    ADD CONSTRAINT llx_c_input_reason_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_lead_status llx_c_lead_status_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_lead_status
    ADD CONSTRAINT llx_c_lead_status_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_paiement llx_c_paiement_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_paiement
    ADD CONSTRAINT llx_c_paiement_pkey PRIMARY KEY (id);


--
-- Name: llx_c_paper_format llx_c_paper_format_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_paper_format
    ADD CONSTRAINT llx_c_paper_format_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_partnership_type llx_c_partnership_type_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_partnership_type
    ADD CONSTRAINT llx_c_partnership_type_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_payment_term llx_c_payment_term_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_payment_term
    ADD CONSTRAINT llx_c_payment_term_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_price_expression llx_c_price_expression_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_price_expression
    ADD CONSTRAINT llx_c_price_expression_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_price_global_variable llx_c_price_global_variable_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_price_global_variable
    ADD CONSTRAINT llx_c_price_global_variable_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_price_global_variable_updater llx_c_price_global_variable_updater_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_price_global_variable_updater
    ADD CONSTRAINT llx_c_price_global_variable_updater_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_product_nature llx_c_product_nature_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_product_nature
    ADD CONSTRAINT llx_c_product_nature_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_productbatch_qcstatus llx_c_productbatch_qcstatus_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_productbatch_qcstatus
    ADD CONSTRAINT llx_c_productbatch_qcstatus_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_propalst llx_c_propalst_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_propalst
    ADD CONSTRAINT llx_c_propalst_pkey PRIMARY KEY (id);


--
-- Name: llx_c_prospectcontactlevel llx_c_prospectcontactlevel_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_prospectcontactlevel
    ADD CONSTRAINT llx_c_prospectcontactlevel_pkey PRIMARY KEY (code);


--
-- Name: llx_c_prospectlevel llx_c_prospectlevel_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_prospectlevel
    ADD CONSTRAINT llx_c_prospectlevel_pkey PRIMARY KEY (code);


--
-- Name: llx_c_recruitment_origin llx_c_recruitment_origin_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_recruitment_origin
    ADD CONSTRAINT llx_c_recruitment_origin_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_regions llx_c_regions_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_regions
    ADD CONSTRAINT llx_c_regions_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_revenuestamp llx_c_revenuestamp_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_revenuestamp
    ADD CONSTRAINT llx_c_revenuestamp_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_shipment_mode llx_c_shipment_mode_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_shipment_mode
    ADD CONSTRAINT llx_c_shipment_mode_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_shipment_package_type llx_c_shipment_package_type_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_shipment_package_type
    ADD CONSTRAINT llx_c_shipment_package_type_pkey PRIMARY KEY (rowid);


--
-- Name: llx_c_socialnetworks llx_c_socialnetworks_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_socialnetworks
    ADD CONSTRAINT llx_c_socialnetworks_pkey PRIMARY KEY (rowid);


--
-- Name: llx_facturedet_rec_extrafields llx_facturedet_rec_extrafields_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_facturedet_rec_extrafields
    ADD CONSTRAINT llx_facturedet_rec_extrafields_pkey PRIMARY KEY (rowid);


--
-- Name: llx_facturedet_rec llx_facturedet_rec_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_facturedet_rec
    ADD CONSTRAINT llx_facturedet_rec_pkey PRIMARY KEY (rowid);


--
-- Name: llx_fichinterdet_extrafields llx_fichinterdet_extrafields_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_fichinterdet_extrafields
    ADD CONSTRAINT llx_fichinterdet_extrafields_pkey PRIMARY KEY (rowid);


--
-- Name: llx_recruitment_recruitmentcandidature_extrafields llx_recruitment_recruitmentcandidature_extrafields_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_recruitment_recruitmentcandidature_extrafields
    ADD CONSTRAINT llx_recruitment_recruitmentcandidature_extrafields_pkey PRIMARY KEY (rowid);


--
-- Name: llx_resource_extrafields llx_resource_extrafields_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_resource_extrafields
    ADD CONSTRAINT llx_resource_extrafields_pkey PRIMARY KEY (rowid);


--
-- Name: llx_rights_def llx_rights_def_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_rights_def
    ADD CONSTRAINT llx_rights_def_pkey PRIMARY KEY (id, entity);


--
-- Name: llx_takepos_floor_tables llx_takepos_floor_tables_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_takepos_floor_tables
    ADD CONSTRAINT llx_takepos_floor_tables_pkey PRIMARY KEY (rowid);


--
-- Name: llx_user_rights llx_user_rights_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_user_rights
    ADD CONSTRAINT llx_user_rights_pkey PRIMARY KEY (rowid);


--
-- Name: llx_usergroup_extrafields llx_usergroup_extrafields_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_usergroup_extrafields
    ADD CONSTRAINT llx_usergroup_extrafields_pkey PRIMARY KEY (rowid);


--
-- Name: llx_workstation_workstation_resource llx_workstation_workstation_resource_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_workstation_workstation_resource
    ADD CONSTRAINT llx_workstation_workstation_resource_pkey PRIMARY KEY (rowid);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- Name: idx_accounting_account_account_parent; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_account_account_parent ON public.llx_accounting_account USING btree (account_parent);


--
-- Name: idx_accounting_account_fk_pcg_version; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_account_fk_pcg_version ON public.llx_accounting_account USING btree (fk_pcg_version);


--
-- Name: idx_accounting_bookkeeping_code_journal; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_bookkeeping_code_journal ON public.llx_accounting_bookkeeping USING btree (code_journal, entity);


--
-- Name: idx_accounting_bookkeeping_doc_date; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_bookkeeping_doc_date ON public.llx_accounting_bookkeeping USING btree (doc_date);


--
-- Name: idx_accounting_bookkeeping_fk_doc; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_bookkeeping_fk_doc ON public.llx_accounting_bookkeeping USING btree (fk_doc);


--
-- Name: idx_accounting_bookkeeping_fk_docdet; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_bookkeeping_fk_docdet ON public.llx_accounting_bookkeeping USING btree (fk_docdet);


--
-- Name: idx_accounting_bookkeeping_numero_compte; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_bookkeeping_numero_compte ON public.llx_accounting_bookkeeping USING btree (numero_compte, entity);


--
-- Name: idx_accounting_bookkeeping_piece_num; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_bookkeeping_piece_num ON public.llx_accounting_bookkeeping USING btree (piece_num, entity);


--
-- Name: idx_accounting_bookkeeping_tmp_code_journal; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_bookkeeping_tmp_code_journal ON public.llx_accounting_bookkeeping_tmp USING btree (code_journal);


--
-- Name: idx_accounting_bookkeeping_tmp_doc_date; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_bookkeeping_tmp_doc_date ON public.llx_accounting_bookkeeping_tmp USING btree (doc_date);


--
-- Name: idx_accounting_bookkeeping_tmp_fk_docdet; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_bookkeeping_tmp_fk_docdet ON public.llx_accounting_bookkeeping_tmp USING btree (fk_docdet);


--
-- Name: idx_accounting_bookkeeping_tmp_numero_compte; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_accounting_bookkeeping_tmp_numero_compte ON public.llx_accounting_bookkeeping_tmp USING btree (numero_compte);


--
-- Name: idx_c_regions_fk_pays; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_c_regions_fk_pays ON public.llx_c_regions USING btree (fk_pays);


--
-- Name: idx_c_socialnetworks_code_entity; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX idx_c_socialnetworks_code_entity ON public.llx_c_socialnetworks USING btree (entity, code);


--
-- Name: idx_departements_fk_region; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_departements_fk_region ON public.llx_c_departements USING btree (fk_region);


--
-- Name: idx_facturedet_rec_extrafields; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_facturedet_rec_extrafields ON public.llx_facturedet_rec_extrafields USING btree (fk_object);


--
-- Name: idx_ficheinterdet_extrafields; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_ficheinterdet_extrafields ON public.llx_fichinterdet_extrafields USING btree (fk_object);


--
-- Name: idx_recruitmentcandidature_fk_object; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_recruitmentcandidature_fk_object ON public.llx_recruitment_recruitmentcandidature_extrafields USING btree (fk_object);


--
-- Name: idx_resource_extrafields; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_resource_extrafields ON public.llx_resource_extrafields USING btree (fk_object);


--
-- Name: idx_type; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_type ON public.llx_c_email_templates USING btree (type_template);


--
-- Name: idx_usergroup_extrafields; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE INDEX idx_usergroup_extrafields ON public.llx_usergroup_extrafields USING btree (fk_object);


--
-- Name: uk_accounting_account; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_accounting_account ON public.llx_accounting_account USING btree (account_number, entity, fk_pcg_version);


--
-- Name: uk_accounting_journal_code; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_accounting_journal_code ON public.llx_accounting_journal USING btree (code, entity);


--
-- Name: uk_accounting_system_pcg_version; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_accounting_system_pcg_version ON public.llx_accounting_system USING btree (pcg_version);


--
-- Name: uk_c_ecotaxe; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_ecotaxe ON public.llx_c_ecotaxe USING btree (code);


--
-- Name: uk_c_effectif; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_effectif ON public.llx_c_effectif USING btree (code);


--
-- Name: uk_c_email_senderprofile; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_email_senderprofile ON public.llx_c_email_senderprofile USING btree (entity, label, email);


--
-- Name: uk_c_email_templates; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_email_templates ON public.llx_c_email_templates USING btree (entity, label, lang);


--
-- Name: uk_c_forme_juridique; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_forme_juridique ON public.llx_c_forme_juridique USING btree (code);


--
-- Name: uk_c_holiday_types; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_holiday_types ON public.llx_c_holiday_types USING btree (code);


--
-- Name: uk_c_hrm_public_holiday; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_hrm_public_holiday ON public.llx_c_hrm_public_holiday USING btree (entity, code);


--
-- Name: uk_c_hrm_public_holiday2; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_hrm_public_holiday2 ON public.llx_c_hrm_public_holiday USING btree (entity, fk_country, dayrule, day, month, year);


--
-- Name: uk_c_input_method; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_input_method ON public.llx_c_input_method USING btree (code);


--
-- Name: uk_c_input_reason; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_input_reason ON public.llx_c_input_reason USING btree (code);


--
-- Name: uk_c_lead_status_code; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_lead_status_code ON public.llx_c_lead_status USING btree (code);


--
-- Name: uk_c_paiement_code; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_paiement_code ON public.llx_c_paiement USING btree (entity, code);


--
-- Name: uk_c_partnership_type; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_partnership_type ON public.llx_c_partnership_type USING btree (entity, code);


--
-- Name: uk_c_payment_term_code; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_payment_term_code ON public.llx_c_payment_term USING btree (entity, code);


--
-- Name: uk_c_product_nature; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_product_nature ON public.llx_c_product_nature USING btree (code);


--
-- Name: uk_c_productbatch_qcstatus; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_productbatch_qcstatus ON public.llx_c_productbatch_qcstatus USING btree (code, entity);


--
-- Name: uk_c_propalst; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_propalst ON public.llx_c_propalst USING btree (code);


--
-- Name: uk_c_shipment_mode; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_c_shipment_mode ON public.llx_c_shipment_mode USING btree (code, entity);


--
-- Name: uk_code_region; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_code_region ON public.llx_c_regions USING btree (code_region);


--
-- Name: uk_departements; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_departements ON public.llx_c_departements USING btree (code_departement, fk_region);


--
-- Name: uk_user_rights; Type: INDEX; Schema: public; Owner: knowledgebase
--

CREATE UNIQUE INDEX uk_user_rights ON public.llx_user_rights USING btree (entity, fk_user, fk_id);


--
-- Name: llx_accounting_account fk_accounting_account_fk_pcg_version; Type: FK CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_accounting_account
    ADD CONSTRAINT fk_accounting_account_fk_pcg_version FOREIGN KEY (fk_pcg_version) REFERENCES public.llx_accounting_system(pcg_version) DEFERRABLE;


--
-- Name: llx_c_departements fk_departements_fk_region; Type: FK CONSTRAINT; Schema: public; Owner: knowledgebase
--

ALTER TABLE ONLY public.llx_c_departements
    ADD CONSTRAINT fk_departements_fk_region FOREIGN KEY (fk_region) REFERENCES public.llx_c_regions(code_region) DEFERRABLE;


--
-- PostgreSQL database dump complete
--

