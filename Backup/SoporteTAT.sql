--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-04-07 12:24:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 229 (class 1255 OID 41102)
-- Name: sync_historial_to_mantenimiento(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_historial_to_mantenimiento() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Evitar loop infinito si los valores no cambiaron
  IF (
    NEW.motivoenvio IS DISTINCT FROM OLD.motivoenvio OR
    NEW.observacion IS DISTINCT FROM OLD.observacion OR
    NEW.personaenvia IS DISTINCT FROM OLD.personaenvia OR
    NEW.fechaenvio IS DISTINCT FROM OLD.fechaenvio OR
    NEW.fecharegreso IS DISTINCT FROM OLD.fecharegreso
  ) THEN
    UPDATE historialenviosmantenimiento
    SET
      motivoenvio = NEW.motivoenvio,
      observacion = NEW.observacion,
      personaenvia = NEW.personaenvia,
      fechaenvio = NEW.fechaenvio,
      fecharegreso = NEW.fecharegreso
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.sync_historial_to_mantenimiento() OWNER TO postgres;

--
-- TOC entry 228 (class 1255 OID 41103)
-- Name: sync_mantenimiento_to_historial(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_mantenimiento_to_historial() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE historialenvios
  SET
    motivoenvio = NEW.motivoenvio,
    observacion = NEW.observacion,
    personaenvia = NEW.personaenvia,
    fechaenvio = NEW.fechaenvio,
    fecharegreso = NEW.fecharegreso
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.sync_mantenimiento_to_historial() OWNER TO postgres;

--
-- TOC entry 242 (class 1255 OID 41099)
-- Name: sync_mantenimiento_to_maquinas(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_mantenimiento_to_maquinas() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF (
    OLD.tecnologia IS DISTINCT FROM NEW.tecnologia OR
    OLD.imeiacercademac IS DISTINCT FROM NEW.imeiacercademac OR
    OLD.placa IS DISTINCT FROM NEW.placa OR
    OLD.serial IS DISTINCT FROM NEW.serial OR
    OLD.lider IS DISTINCT FROM NEW.lider OR
    OLD.siminternet IS DISTINCT FROM NEW.siminternet OR
    OLD.cedula IS DISTINCT FROM NEW.cedula OR
    OLD.nombrecorresponsal IS DISTINCT FROM NEW.nombrecorresponsal OR
    OLD.codigoseta IS DISTINCT FROM NEW.codigoseta OR
    OLD.estado IS DISTINCT FROM NEW.estado OR
    OLD.fecha IS DISTINCT FROM NEW.fecha OR
    OLD.conteoenvio IS DISTINCT FROM NEW.conteoenvio OR
    OLD.ubicacion IS DISTINCT FROM NEW.ubicacion
  ) THEN
    UPDATE maquinas
    SET
      tecnologia = NEW.tecnologia,
      imeiacercademac = NEW.imeiacercademac,
      placa = NEW.placa,
      serial = NEW.serial,
      lider = NEW.lider,
      siminternet = NEW.siminternet,
      cedula = NEW.cedula,
      nombrecorresponsal = NEW.nombrecorresponsal,
      codigoseta = NEW.codigoseta,
      estado = NEW.estado,
      fecha = NEW.fecha,
      conteoenvio = NEW.conteoenvio,
      ubicacion = NEW.ubicacion
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.sync_mantenimiento_to_maquinas() OWNER TO postgres;

--
-- TOC entry 241 (class 1255 OID 41098)
-- Name: sync_maquinas_to_mantenimiento(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_maquinas_to_mantenimiento() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Solo actualiza si los valores son distintos
  IF (
    OLD.tecnologia IS DISTINCT FROM NEW.tecnologia OR
    OLD.imeiacercademac IS DISTINCT FROM NEW.imeiacercademac OR
    OLD.placa IS DISTINCT FROM NEW.placa OR
    OLD.serial IS DISTINCT FROM NEW.serial OR
    OLD.lider IS DISTINCT FROM NEW.lider OR
    OLD.siminternet IS DISTINCT FROM NEW.siminternet OR
    OLD.cedula IS DISTINCT FROM NEW.cedula OR
    OLD.nombrecorresponsal IS DISTINCT FROM NEW.nombrecorresponsal OR
    OLD.codigoseta IS DISTINCT FROM NEW.codigoseta OR
    OLD.estado IS DISTINCT FROM NEW.estado OR
    OLD.fecha IS DISTINCT FROM NEW.fecha OR
    OLD.conteoenvio IS DISTINCT FROM NEW.conteoenvio OR
    OLD.ubicacion IS DISTINCT FROM NEW.ubicacion
  ) THEN
    UPDATE maquinasmantenimiento
    SET
      tecnologia = NEW.tecnologia,
      imeiacercademac = NEW.imeiacercademac,
      placa = NEW.placa,
      serial = NEW.serial,
      lider = NEW.lider,
      siminternet = NEW.siminternet,
      cedula = NEW.cedula,
      nombrecorresponsal = NEW.nombrecorresponsal,
      codigoseta = NEW.codigoseta,
      estado = NEW.estado,
      fecha = NEW.fecha,
      conteoenvio = NEW.conteoenvio,
      ubicacion = NEW.ubicacion
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.sync_maquinas_to_mantenimiento() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16427)
-- Name: corresponsales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.corresponsales (
    id integer NOT NULL,
    nombrecorresponsal character varying(100) NOT NULL,
    imeiacercademac character varying(50) NOT NULL,
    codigoseta character varying(20) NOT NULL,
    tecnologia character varying(50) NOT NULL,
    cedula character varying(50) NOT NULL,
    municipio character varying(50) NOT NULL,
    codigodane character varying(20) NOT NULL,
    codigopostal character varying(20),
    lider character varying(50),
    estado character varying(50) NOT NULL,
    nombrecompleto character varying(100) NOT NULL,
    telefono character varying(20),
    correo character varying(50) NOT NULL,
    direccion character varying(200),
    tiponegocio character varying(100) NOT NULL,
    zona character varying(50),
    categoria character varying(50),
    siminternet character varying(50),
    modalidad character varying(50),
    fecha date NOT NULL,
    longitud character varying(50),
    latitud character varying(50),
    activosfijos character varying(2000) DEFAULT '➤ POR ASIGNAR'::character varying
);


ALTER TABLE public.corresponsales OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16426)
-- Name: corresponsales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.corresponsales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.corresponsales_id_seq OWNER TO postgres;

--
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 217
-- Name: corresponsales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.corresponsales_id_seq OWNED BY public.corresponsales.id;


--
-- TOC entry 220 (class 1259 OID 24635)
-- Name: corresponsalesretirados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.corresponsalesretirados (
    id integer NOT NULL,
    nombrecorresponsal character varying(100),
    imeiacercademac character varying(50),
    codigoseta character varying(20),
    tecnologia character varying(50),
    cedula character varying(20),
    municipio character varying(100),
    codigodane character varying(20),
    codigopostal character varying(20),
    lider character varying(100),
    estado character varying(50),
    nombrecompleto character varying(100),
    telefono character varying(20),
    correo character varying(100),
    direccion text,
    tiponegocio character varying(100),
    zona character varying(50),
    categoria character varying(50),
    siminternet character varying(50),
    modalidad character varying(50),
    fecha date,
    longitud text,
    latitud text,
    activosfijos text,
    fecharetiro date,
    personaretira character varying(100),
    comentario text
);


ALTER TABLE public.corresponsalesretirados OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24634)
-- Name: corresponsalesretirados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.corresponsalesretirados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.corresponsalesretirados_id_seq OWNER TO postgres;

--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 219
-- Name: corresponsalesretirados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.corresponsalesretirados_id_seq OWNED BY public.corresponsalesretirados.id;


--
-- TOC entry 224 (class 1259 OID 32843)
-- Name: historialenvios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historialenvios (
    id integer NOT NULL,
    maquina_id integer,
    motivoenvio text NOT NULL,
    fechaenvio date NOT NULL,
    fecharegreso date,
    personaenvia character varying(100) DEFAULT 'Por asignar'::character varying NOT NULL,
    observacion text DEFAULT 'Sin observaciones'::text
);


ALTER TABLE public.historialenvios OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 32842)
-- Name: historialenvios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historialenvios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historialenvios_id_seq OWNER TO postgres;

--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 223
-- Name: historialenvios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historialenvios_id_seq OWNED BY public.historialenvios.id;


--
-- TOC entry 227 (class 1259 OID 32879)
-- Name: historialenviosmantenimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historialenviosmantenimiento (
    maquina_mantenimiento_id integer NOT NULL,
    motivoenvio character varying(50),
    fechaenvio date,
    fecharegreso date,
    observacion character varying(255),
    personaenvia character varying(50),
    id integer NOT NULL
);


ALTER TABLE public.historialenviosmantenimiento OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 32834)
-- Name: maquinas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maquinas (
    id integer NOT NULL,
    tecnologia character varying(50),
    imeiacercademac character varying(50),
    placa character varying(50),
    serial character varying(50),
    lider character varying(50),
    siminternet character varying(50),
    cedula character varying(50),
    nombrecorresponsal character varying(100),
    codigoseta character varying(20),
    estado character varying(50),
    fecha date,
    conteoenvio character varying(10) DEFAULT '0'::character varying,
    ubicacion character varying(50) DEFAULT 'EN LABORATORIO'::character varying
);


ALTER TABLE public.maquinas OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 32833)
-- Name: maquinas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maquinas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maquinas_id_seq OWNER TO postgres;

--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 221
-- Name: maquinas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maquinas_id_seq OWNED BY public.maquinas.id;


--
-- TOC entry 226 (class 1259 OID 32857)
-- Name: maquinasmantenimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maquinasmantenimiento (
    id integer NOT NULL,
    tecnologia character varying(50),
    imeiacercademac character varying(50),
    placa character varying(50),
    serial character varying(50),
    lider character varying(50),
    siminternet character varying(50),
    cedula character varying(50),
    nombrecorresponsal character varying(100),
    codigoseta character varying(20),
    estado character varying(50),
    fecha date,
    conteoenvio character varying(20),
    ubicacion character varying(50)
);


ALTER TABLE public.maquinasmantenimiento OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 32856)
-- Name: maquinasmantenimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maquinasmantenimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maquinasmantenimiento_id_seq OWNER TO postgres;

--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 225
-- Name: maquinasmantenimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maquinasmantenimiento_id_seq OWNED BY public.maquinasmantenimiento.id;


--
-- TOC entry 4669 (class 2604 OID 16430)
-- Name: corresponsales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corresponsales ALTER COLUMN id SET DEFAULT nextval('public.corresponsales_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 24638)
-- Name: corresponsalesretirados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corresponsalesretirados ALTER COLUMN id SET DEFAULT nextval('public.corresponsalesretirados_id_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 32846)
-- Name: historialenvios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialenvios ALTER COLUMN id SET DEFAULT nextval('public.historialenvios_id_seq'::regclass);


--
-- TOC entry 4672 (class 2604 OID 32837)
-- Name: maquinas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maquinas ALTER COLUMN id SET DEFAULT nextval('public.maquinas_id_seq'::regclass);


--
-- TOC entry 4678 (class 2604 OID 32893)
-- Name: maquinasmantenimiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maquinasmantenimiento ALTER COLUMN id SET DEFAULT nextval('public.maquinasmantenimiento_id_seq'::regclass);


--
-- TOC entry 4843 (class 0 OID 16427)
-- Dependencies: 218
-- Data for Name: corresponsales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.corresponsales (id, nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio, codigodane, codigopostal, lider, estado, nombrecompleto, telefono, correo, direccion, tiponegocio, zona, categoria, siminternet, modalidad, fecha, longitud, latitud, activosfijos) FROM stdin;
54	MAN CO TIE PRUEBA	354738	123	INCUBA MÓVIL	05462315456	Manizales	17001	17001	Dayana	ACTIVO	Ermeregildo  Hendpoint	300200100	Ermehend@gmail.com	Cra 23 #25-15	Tienda	Urbano	Senior	WIFI	Prepago	2025-04-05	4,56654544	5,65646466	
\.


--
-- TOC entry 4845 (class 0 OID 24635)
-- Dependencies: 220
-- Data for Name: corresponsalesretirados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.corresponsalesretirados (id, nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio, codigodane, codigopostal, lider, estado, nombrecompleto, telefono, correo, direccion, tiponegocio, zona, categoria, siminternet, modalidad, fecha, longitud, latitud, activosfijos, fecharetiro, personaretira, comentario) FROM stdin;
\.


--
-- TOC entry 4849 (class 0 OID 32843)
-- Dependencies: 224
-- Data for Name: historialenvios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historialenvios (id, maquina_id, motivoenvio, fechaenvio, fecharegreso, personaenvia, observacion) FROM stdin;
\.


--
-- TOC entry 4852 (class 0 OID 32879)
-- Dependencies: 227
-- Data for Name: historialenviosmantenimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historialenviosmantenimiento (maquina_mantenimiento_id, motivoenvio, fechaenvio, fecharegreso, observacion, personaenvia, id) FROM stdin;
\.


--
-- TOC entry 4847 (class 0 OID 32834)
-- Dependencies: 222
-- Data for Name: maquinas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maquinas (id, tecnologia, imeiacercademac, placa, serial, lider, siminternet, cedula, nombrecorresponsal, codigoseta, estado, fecha, conteoenvio, ubicacion) FROM stdin;
\.


--
-- TOC entry 4851 (class 0 OID 32857)
-- Dependencies: 226
-- Data for Name: maquinasmantenimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maquinasmantenimiento (id, tecnologia, imeiacercademac, placa, serial, lider, siminternet, cedula, nombrecorresponsal, codigoseta, estado, fecha, conteoenvio, ubicacion) FROM stdin;
10	BP80	00024	000234	000123	NO TIENE	NO	NADA	NADA	123	ACTIVA	2025-04-04	3	EN MANTENIMIENTO
\.


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 217
-- Name: corresponsales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.corresponsales_id_seq', 54, true);


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 219
-- Name: corresponsalesretirados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.corresponsalesretirados_id_seq', 25, true);


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 223
-- Name: historialenvios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historialenvios_id_seq', 64, true);


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 221
-- Name: maquinas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maquinas_id_seq', 11, true);


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 225
-- Name: maquinasmantenimiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maquinasmantenimiento_id_seq', 1, false);


--
-- TOC entry 4680 (class 2606 OID 16434)
-- Name: corresponsales corresponsales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corresponsales
    ADD CONSTRAINT corresponsales_pkey PRIMARY KEY (id);


--
-- TOC entry 4682 (class 2606 OID 24642)
-- Name: corresponsalesretirados corresponsalesretirados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corresponsalesretirados
    ADD CONSTRAINT corresponsalesretirados_pkey PRIMARY KEY (id);


--
-- TOC entry 4686 (class 2606 OID 32850)
-- Name: historialenvios historialenvios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialenvios
    ADD CONSTRAINT historialenvios_pkey PRIMARY KEY (id);


--
-- TOC entry 4690 (class 2606 OID 32907)
-- Name: historialenviosmantenimiento historialenviosmantenimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialenviosmantenimiento
    ADD CONSTRAINT historialenviosmantenimiento_pkey PRIMARY KEY (id);


--
-- TOC entry 4684 (class 2606 OID 32841)
-- Name: maquinas maquinas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maquinas
    ADD CONSTRAINT maquinas_pkey PRIMARY KEY (id);


--
-- TOC entry 4688 (class 2606 OID 32895)
-- Name: maquinasmantenimiento maquinasmantenimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maquinasmantenimiento
    ADD CONSTRAINT maquinasmantenimiento_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 2620 OID 41104)
-- Name: historialenvios trigger_update_historial; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_historial AFTER UPDATE ON public.historialenvios FOR EACH ROW EXECUTE FUNCTION public.sync_historial_to_mantenimiento();


--
-- TOC entry 4696 (class 2620 OID 41105)
-- Name: historialenviosmantenimiento trigger_update_historial_mantenimiento; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_historial_mantenimiento AFTER UPDATE ON public.historialenviosmantenimiento FOR EACH ROW EXECUTE FUNCTION public.sync_mantenimiento_to_historial();


--
-- TOC entry 4693 (class 2620 OID 41100)
-- Name: maquinas trigger_update_maquinas; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_maquinas AFTER UPDATE ON public.maquinas FOR EACH ROW EXECUTE FUNCTION public.sync_maquinas_to_mantenimiento();


--
-- TOC entry 4695 (class 2620 OID 41101)
-- Name: maquinasmantenimiento trigger_update_maquinasmantenimiento; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_maquinasmantenimiento AFTER UPDATE ON public.maquinasmantenimiento FOR EACH ROW EXECUTE FUNCTION public.sync_mantenimiento_to_maquinas();


--
-- TOC entry 4692 (class 2606 OID 32901)
-- Name: historialenviosmantenimiento fk_historial_mantenimiento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialenviosmantenimiento
    ADD CONSTRAINT fk_historial_mantenimiento FOREIGN KEY (maquina_mantenimiento_id) REFERENCES public.maquinasmantenimiento(id) ON DELETE CASCADE;


--
-- TOC entry 4691 (class 2606 OID 32851)
-- Name: historialenvios historialenvios_maquina_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialenvios
    ADD CONSTRAINT historialenvios_maquina_id_fkey FOREIGN KEY (maquina_id) REFERENCES public.maquinas(id) ON DELETE CASCADE;


-- Completed on 2025-04-07 12:24:49

--
-- PostgreSQL database dump complete
--

