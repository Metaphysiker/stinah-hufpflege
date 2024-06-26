--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE abc;




--
-- Drop roles
--

DROP ROLE abc;


--
-- Roles
--

CREATE ROLE abc;
ALTER ROLE abc WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:tP22fBOwF9B9MZn5me6a8g==$xkZO2Y5lPIJVQGXyEpEWu7zC2klTTrSB7VqaQAjYS3g=:qbJfqF7isG1pKZq6ZHsA43NFOGY7cNHEpP9MXHOaBGk=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

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

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: abc
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO abc;

\connect template1

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
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: abc
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: abc
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

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
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: abc
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "abc" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

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
-- Name: abc; Type: DATABASE; Schema: -; Owner: abc
--

CREATE DATABASE abc WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE abc OWNER TO abc;

\connect abc

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
-- Name: AspNetRoleClaims; Type: TABLE; Schema: public; Owner: abc
--

CREATE TABLE public."AspNetRoleClaims" (
    "Id" integer NOT NULL,
    "RoleId" text NOT NULL,
    "ClaimType" text,
    "ClaimValue" text
);


ALTER TABLE public."AspNetRoleClaims" OWNER TO abc;

--
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: abc
--

ALTER TABLE public."AspNetRoleClaims" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."AspNetRoleClaims_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: AspNetRoles; Type: TABLE; Schema: public; Owner: abc
--

CREATE TABLE public."AspNetRoles" (
    "Id" text NOT NULL,
    "Name" character varying(256),
    "NormalizedName" character varying(256),
    "ConcurrencyStamp" text
);


ALTER TABLE public."AspNetRoles" OWNER TO abc;

--
-- Name: AspNetUserClaims; Type: TABLE; Schema: public; Owner: abc
--

CREATE TABLE public."AspNetUserClaims" (
    "Id" integer NOT NULL,
    "UserId" text NOT NULL,
    "ClaimType" text,
    "ClaimValue" text
);


ALTER TABLE public."AspNetUserClaims" OWNER TO abc;

--
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: abc
--

ALTER TABLE public."AspNetUserClaims" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."AspNetUserClaims_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: AspNetUserLogins; Type: TABLE; Schema: public; Owner: abc
--

CREATE TABLE public."AspNetUserLogins" (
    "LoginProvider" text NOT NULL,
    "ProviderKey" text NOT NULL,
    "ProviderDisplayName" text,
    "UserId" text NOT NULL
);


ALTER TABLE public."AspNetUserLogins" OWNER TO abc;

--
-- Name: AspNetUserRoles; Type: TABLE; Schema: public; Owner: abc
--

CREATE TABLE public."AspNetUserRoles" (
    "UserId" text NOT NULL,
    "RoleId" text NOT NULL
);


ALTER TABLE public."AspNetUserRoles" OWNER TO abc;

--
-- Name: AspNetUserTokens; Type: TABLE; Schema: public; Owner: abc
--

CREATE TABLE public."AspNetUserTokens" (
    "UserId" text NOT NULL,
    "LoginProvider" text NOT NULL,
    "Name" text NOT NULL,
    "Value" text
);


ALTER TABLE public."AspNetUserTokens" OWNER TO abc;

--
-- Name: AspNetUsers; Type: TABLE; Schema: public; Owner: abc
--

CREATE TABLE public."AspNetUsers" (
    "Id" text NOT NULL,
    "UserName" character varying(256),
    "NormalizedUserName" character varying(256),
    "Email" character varying(256),
    "NormalizedEmail" character varying(256),
    "EmailConfirmed" boolean NOT NULL,
    "PasswordHash" text,
    "SecurityStamp" text,
    "ConcurrencyStamp" text,
    "PhoneNumber" text,
    "PhoneNumberConfirmed" boolean NOT NULL,
    "TwoFactorEnabled" boolean NOT NULL,
    "LockoutEnd" timestamp with time zone,
    "LockoutEnabled" boolean NOT NULL,
    "AccessFailedCount" integer NOT NULL
);


ALTER TABLE public."AspNetUsers" OWNER TO abc;

--
-- Name: Horses; Type: TABLE; Schema: public; Owner: abc
--

CREATE TABLE public."Horses" (
    "Id" integer NOT NULL,
    "Name" text NOT NULL,
    "LastTimeTreated" timestamp with time zone NOT NULL,
    "NumberOfWeeksUntilNextTreatment" integer NOT NULL,
    "BirthYear" integer DEFAULT 0 NOT NULL,
    "NoteForNextTreatment" text DEFAULT ''::text NOT NULL,
    "HorseId" integer,
    "CreatedAt" timestamp with time zone DEFAULT '-infinity'::timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone DEFAULT '-infinity'::timestamp with time zone NOT NULL,
    "Beschlagen" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Horses" OWNER TO abc;

--
-- Name: Horses_Id_seq; Type: SEQUENCE; Schema: public; Owner: abc
--

ALTER TABLE public."Horses" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Horses_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Treatments; Type: TABLE; Schema: public; Owner: abc
--

CREATE TABLE public."Treatments" (
    "Id" integer NOT NULL,
    "Note" text NOT NULL,
    "NoteForNextTreatment" text NOT NULL,
    "HorseId" integer,
    "CreatedAt" timestamp with time zone DEFAULT '-infinity'::timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone DEFAULT '-infinity'::timestamp with time zone NOT NULL
);


ALTER TABLE public."Treatments" OWNER TO abc;

--
-- Name: Treatments_Id_seq; Type: SEQUENCE; Schema: public; Owner: abc
--

ALTER TABLE public."Treatments" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Treatments_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: abc
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO abc;

--
-- Data for Name: AspNetRoleClaims; Type: TABLE DATA; Schema: public; Owner: abc
--

COPY public."AspNetRoleClaims" ("Id", "RoleId", "ClaimType", "ClaimValue") FROM stdin;
\.


--
-- Data for Name: AspNetRoles; Type: TABLE DATA; Schema: public; Owner: abc
--

COPY public."AspNetRoles" ("Id", "Name", "NormalizedName", "ConcurrencyStamp") FROM stdin;
\.


--
-- Data for Name: AspNetUserClaims; Type: TABLE DATA; Schema: public; Owner: abc
--

COPY public."AspNetUserClaims" ("Id", "UserId", "ClaimType", "ClaimValue") FROM stdin;
\.


--
-- Data for Name: AspNetUserLogins; Type: TABLE DATA; Schema: public; Owner: abc
--

COPY public."AspNetUserLogins" ("LoginProvider", "ProviderKey", "ProviderDisplayName", "UserId") FROM stdin;
\.


--
-- Data for Name: AspNetUserRoles; Type: TABLE DATA; Schema: public; Owner: abc
--

COPY public."AspNetUserRoles" ("UserId", "RoleId") FROM stdin;
\.


--
-- Data for Name: AspNetUserTokens; Type: TABLE DATA; Schema: public; Owner: abc
--

COPY public."AspNetUserTokens" ("UserId", "LoginProvider", "Name", "Value") FROM stdin;
\.


--
-- Data for Name: AspNetUsers; Type: TABLE DATA; Schema: public; Owner: abc
--

COPY public."AspNetUsers" ("Id", "UserName", "NormalizedUserName", "Email", "NormalizedEmail", "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp", "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnd", "LockoutEnabled", "AccessFailedCount") FROM stdin;
\.


--
-- Data for Name: Horses; Type: TABLE DATA; Schema: public; Owner: abc
--

COPY public."Horses" ("Id", "Name", "LastTimeTreated", "NumberOfWeeksUntilNextTreatment", "BirthYear", "NoteForNextTreatment", "HorseId", "CreatedAt", "UpdatedAt", "Beschlagen") FROM stdin;
2	Solitär	2024-04-02 22:00:00+00	8	0		\N	2024-06-15 09:17:16.085+00	2024-06-15 09:17:16.085+00	f
3	Phenix	2024-04-02 22:00:00+00	8	0		\N	2024-06-15 09:17:54.146+00	2024-06-15 09:17:54.146+00	f
4	Tiger	2024-04-02 22:00:00+00	8	0		\N	2024-06-15 09:18:08.872+00	2024-06-15 09:18:08.872+00	f
5	Leila	2024-04-02 22:00:00+00	8	0		\N	2024-06-15 09:18:23.944+00	2024-06-15 09:18:23.944+00	f
6	Tashkira\t	2024-04-02 22:00:00+00	8	0		\N	2024-06-15 09:18:37.009+00	2024-06-15 09:18:37.009+00	f
7	Coragem	2024-04-02 22:00:00+00	8	0		\N	2024-06-15 09:18:53.779+00	2024-06-15 09:18:53.779+00	f
8	Diego	2024-04-02 22:00:00+00	8	0		\N	2024-06-15 09:19:05.553+00	2024-06-15 09:19:05.553+00	f
9	Kappa	2024-05-18 22:00:00+00	8	0		\N	2024-06-15 09:19:15.945+00	2024-06-15 09:19:15.945+00	f
10	Bija	2024-05-18 22:00:00+00	8	0		\N	2024-06-15 09:19:31.387+00	2024-06-15 09:19:31.387+00	f
11	Debora	2024-05-18 22:00:00+00	8	0		\N	2024-06-15 09:19:51.001+00	2024-06-15 09:19:51.001+00	f
12	Hautbois	2024-05-18 22:00:00+00	8	0		\N	2024-06-15 09:20:09.426+00	2024-06-15 09:20:09.426+00	f
13	DER	2024-05-18 22:00:00+00	8	0		\N	2024-06-15 09:20:17.714+00	2024-06-15 09:20:17.714+00	f
14	Jerry	2024-05-29 22:00:00+00	8	0		\N	2024-06-15 09:20:28.713+00	2024-06-15 09:20:28.713+00	f
15	Gingao	2024-05-29 22:00:00+00	8	0		\N	2024-06-15 09:20:40.554+00	2024-06-15 09:20:40.554+00	f
16	Ivory	2024-05-29 22:00:00+00	8	0		\N	2024-06-15 09:20:52.213+00	2024-06-15 09:20:52.213+00	f
17	Elin\t	2024-05-29 22:00:00+00	8	0		\N	2024-06-15 09:21:03.88+00	2024-06-15 09:21:03.88+00	f
18	Elnias	2024-05-29 22:00:00+00	8	0		\N	2024-06-15 09:21:17.729+00	2024-06-15 09:21:17.729+00	f
19	Niran\t	2024-05-29 22:00:00+00	8	0		\N	2024-06-15 09:21:32.587+00	2024-06-15 09:21:32.587+00	f
20	Olinja	2024-05-29 22:00:00+00	8	0		\N	2024-06-15 09:21:43.732+00	2024-06-15 09:21:43.732+00	f
21	Chiara	2024-05-29 22:00:00+00	8	0		\N	2024-06-15 09:21:53.85+00	2024-06-15 09:21:53.85+00	f
22	Scholk	2024-05-29 22:00:00+00	8	0		\N	2024-06-15 09:22:02.314+00	2024-06-15 09:22:02.314+00	f
23	Davino\t	2024-04-29 22:00:00+00	8	0		\N	2024-06-15 09:22:19.923+00	2024-06-15 09:22:19.923+00	f
24	Nadja	2024-04-29 22:00:00+00	8	0		\N	2024-06-15 09:22:33.68+00	2024-06-15 09:22:33.68+00	f
25	Mila\t	2024-04-29 22:00:00+00	8	0		\N	2024-06-15 09:22:45.921+00	2024-06-15 09:22:45.921+00	f
26	Marcella	2024-04-29 22:00:00+00	8	0		\N	2024-06-15 09:22:57.133+00	2024-06-15 09:22:57.133+00	f
27	Marko	2024-04-29 22:00:00+00	8	0		\N	2024-06-15 09:23:18.133+00	2024-06-15 09:23:18.133+00	f
28	Schirano	2024-04-29 22:00:00+00	8	0		\N	2024-06-15 09:23:30.163+00	2024-06-15 09:23:30.163+00	f
29	Elly	2024-04-29 22:00:00+00	8	0		\N	2024-06-15 09:23:42.321+00	2024-06-15 09:23:42.321+00	f
30	Dabija	2024-05-25 22:00:00+00	8	0		\N	2024-06-15 09:23:57.224+00	2024-06-15 09:23:57.224+00	f
31	Jenny	2024-05-25 22:00:00+00	8	0		\N	2024-06-15 09:24:11.149+00	2024-06-15 09:24:11.149+00	f
32	Ronja	2024-05-25 22:00:00+00	8	0		\N	2024-06-15 09:24:20.508+00	2024-06-15 09:24:20.508+00	f
33	Sarai	2024-05-25 22:00:00+00	8	0		\N	2024-06-15 09:24:40.407+00	2024-06-15 09:24:40.407+00	f
34	Eli\t	2024-05-25 22:00:00+00	8	0		\N	2024-06-15 09:24:50.583+00	2024-06-15 09:24:50.583+00	f
35	Shelby\t	2024-05-25 22:00:00+00	8	0		\N	2024-06-15 09:25:08.06+00	2024-06-15 09:25:08.06+00	f
36	Vitez	2024-05-25 22:00:00+00	8	0		\N	2024-06-15 09:25:19.723+00	2024-06-15 09:25:19.723+00	f
37	Cyrano	2024-05-25 22:00:00+00	8	0		\N	2024-06-15 09:25:33.344+00	2024-06-15 09:25:33.344+00	f
38	Amadeus	2024-05-25 22:00:00+00	8	0		\N	2024-06-15 09:25:45.668+00	2024-06-15 09:25:45.668+00	f
39	Aline	2024-06-07 22:00:00+00	2	0		\N	2024-06-15 09:25:59.284+00	2024-06-15 09:25:59.284+00	f
40	Hector	2024-05-06 22:00:00+00	8	0		\N	2024-06-15 09:26:35.48+00	2024-06-15 09:26:35.48+00	f
41	Héros	2024-05-06 22:00:00+00	8	0		\N	2024-06-15 09:26:48.456+00	2024-06-15 09:26:48.456+00	f
42	Lesly	2024-05-06 22:00:00+00	8	0		\N	2024-06-15 09:27:04.035+00	2024-06-15 09:27:04.035+00	f
43	Joker	2024-05-06 22:00:00+00	8	0		\N	2024-06-15 09:27:14.584+00	2024-06-15 09:27:14.584+00	f
44	Lucky	2024-05-06 22:00:00+00	8	0		\N	2024-06-15 09:27:26.277+00	2024-06-15 09:27:26.277+00	f
45	Wizard	2024-05-06 22:00:00+00	8	0		\N	2024-06-15 09:27:37.414+00	2024-06-15 09:27:37.414+00	f
46	Shirkana	2024-05-06 22:00:00+00	8	0		\N	2024-06-15 09:27:50.388+00	2024-06-15 09:27:50.388+00	f
47	Houblon	2024-05-06 22:00:00+00	8	0		\N	2024-06-15 09:28:02.915+00	2024-06-15 09:28:02.915+00	f
48	Kenan	2024-05-06 22:00:00+00	8	0		\N	2024-06-15 09:28:14.851+00	2024-06-15 09:28:14.851+00	f
49	Historic	2023-11-25 23:00:00+00	8	0		\N	2024-06-15 09:28:29.77+00	2024-06-15 09:28:29.77+00	f
\.


--
-- Data for Name: Treatments; Type: TABLE DATA; Schema: public; Owner: abc
--

COPY public."Treatments" ("Id", "Note", "NoteForNextTreatment", "HorseId", "CreatedAt", "UpdatedAt") FROM stdin;
\.


--
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: abc
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20240613152910_InitialCreate	8.0.6
20240613174927_AddDateToHorse	8.0.6
20240613182559_AddBirthYearToHorses	8.0.6
20240613193132_AddNoteForNextTreatment	8.0.6
20240613210430_AddTreatment	8.0.6
20240615041804_AddHorseId	8.0.6
20240615054218_AddTimeStamp	8.0.6
20240615063257_AddBeschlagenToHorse	8.0.6
\.


--
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: abc
--

SELECT pg_catalog.setval('public."AspNetRoleClaims_Id_seq"', 1, false);


--
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: abc
--

SELECT pg_catalog.setval('public."AspNetUserClaims_Id_seq"', 1, false);


--
-- Name: Horses_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: abc
--

SELECT pg_catalog.setval('public."Horses_Id_seq"', 49, true);


--
-- Name: Treatments_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: abc
--

SELECT pg_catalog.setval('public."Treatments_Id_seq"', 1, false);


--
-- Name: AspNetRoleClaims PK_AspNetRoleClaims; Type: CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id");


--
-- Name: AspNetRoles PK_AspNetRoles; Type: CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetRoles"
    ADD CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id");


--
-- Name: AspNetUserClaims PK_AspNetUserClaims; Type: CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id");


--
-- Name: AspNetUserLogins PK_AspNetUserLogins; Type: CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey");


--
-- Name: AspNetUserRoles PK_AspNetUserRoles; Type: CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId");


--
-- Name: AspNetUserTokens PK_AspNetUserTokens; Type: CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name");


--
-- Name: AspNetUsers PK_AspNetUsers; Type: CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetUsers"
    ADD CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id");


--
-- Name: Horses PK_Horses; Type: CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."Horses"
    ADD CONSTRAINT "PK_Horses" PRIMARY KEY ("Id");


--
-- Name: Treatments PK_Treatments; Type: CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."Treatments"
    ADD CONSTRAINT "PK_Treatments" PRIMARY KEY ("Id");


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: EmailIndex; Type: INDEX; Schema: public; Owner: abc
--

CREATE INDEX "EmailIndex" ON public."AspNetUsers" USING btree ("NormalizedEmail");


--
-- Name: IX_AspNetRoleClaims_RoleId; Type: INDEX; Schema: public; Owner: abc
--

CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON public."AspNetRoleClaims" USING btree ("RoleId");


--
-- Name: IX_AspNetUserClaims_UserId; Type: INDEX; Schema: public; Owner: abc
--

CREATE INDEX "IX_AspNetUserClaims_UserId" ON public."AspNetUserClaims" USING btree ("UserId");


--
-- Name: IX_AspNetUserLogins_UserId; Type: INDEX; Schema: public; Owner: abc
--

CREATE INDEX "IX_AspNetUserLogins_UserId" ON public."AspNetUserLogins" USING btree ("UserId");


--
-- Name: IX_AspNetUserRoles_RoleId; Type: INDEX; Schema: public; Owner: abc
--

CREATE INDEX "IX_AspNetUserRoles_RoleId" ON public."AspNetUserRoles" USING btree ("RoleId");


--
-- Name: IX_Horses_HorseId; Type: INDEX; Schema: public; Owner: abc
--

CREATE INDEX "IX_Horses_HorseId" ON public."Horses" USING btree ("HorseId");


--
-- Name: IX_Treatments_HorseId; Type: INDEX; Schema: public; Owner: abc
--

CREATE INDEX "IX_Treatments_HorseId" ON public."Treatments" USING btree ("HorseId");


--
-- Name: RoleNameIndex; Type: INDEX; Schema: public; Owner: abc
--

CREATE UNIQUE INDEX "RoleNameIndex" ON public."AspNetRoles" USING btree ("NormalizedName");


--
-- Name: UserNameIndex; Type: INDEX; Schema: public; Owner: abc
--

CREATE UNIQUE INDEX "UserNameIndex" ON public."AspNetUsers" USING btree ("NormalizedUserName");


--
-- Name: AspNetRoleClaims FK_AspNetRoleClaims_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserClaims FK_AspNetUserClaims_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserLogins FK_AspNetUserLogins_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserTokens FK_AspNetUserTokens_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: Horses FK_Horses_Horses_HorseId; Type: FK CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."Horses"
    ADD CONSTRAINT "FK_Horses_Horses_HorseId" FOREIGN KEY ("HorseId") REFERENCES public."Horses"("Id");


--
-- Name: Treatments FK_Treatments_Horses_HorseId; Type: FK CONSTRAINT; Schema: public; Owner: abc
--

ALTER TABLE ONLY public."Treatments"
    ADD CONSTRAINT "FK_Treatments_Horses_HorseId" FOREIGN KEY ("HorseId") REFERENCES public."Horses"("Id");


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

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

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: abc
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO abc;

\connect postgres

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
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: abc
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

