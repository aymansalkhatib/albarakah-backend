--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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
-- Name: emergency_aid_requests_request_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.emergency_aid_requests_request_status_enum AS ENUM (
    'pending',
    'approved',
    'disbursed',
    'rejected',
    'cancelled'
);


ALTER TYPE public.emergency_aid_requests_request_status_enum OWNER TO postgres;

--
-- Name: families_archive_location_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.families_archive_location_enum AS ENUM (
    'direct_non_acceptance_interview_forms',
    'acceptance_interview_and_visit_forms_after_visit',
    'non_acceptance_interview_and_visit_forms_after_visit',
    'barzeh_residences',
    'under_visit',
    'archived_in_folder_administration_archive',
    'no_paper_form_created',
    'direct_acceptance_interview_forms'
);


ALTER TYPE public.families_archive_location_enum OWNER TO postgres;

--
-- Name: families_form_organization_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.families_form_organization_status_enum AS ENUM (
    'done',
    'done_outside_sponsorship_conditions',
    'submitted_to_other_association',
    'registered_in_other_association',
    'outside_sponsorship_conditions',
    'did_not_attend_no_apology',
    'no_contact',
    'request_remains_in_relief',
    'no'
);


ALTER TYPE public.families_form_organization_status_enum OWNER TO postgres;

--
-- Name: families_house_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.families_house_type_enum AS ENUM (
    'rent',
    'rent_paid_by_philanthropists',
    'hospitality',
    'hospitality_with_family',
    'hospitality_with_resident_inheritance_share',
    'hospitality_with_rent',
    'hospitality_with_rent_paid_by_philanthropists',
    'hospitality_with_husband_family',
    'hospitality_with_resident',
    'hospitality_with_father_family',
    'owned'
);


ALTER TYPE public.families_house_type_enum OWNER TO postgres;

--
-- Name: families_management_decision_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.families_management_decision_enum AS ENUM (
    'decision_after_visit_opinion',
    'sponsorship',
    'no_sponsorship'
);


ALTER TYPE public.families_management_decision_enum OWNER TO postgres;

--
-- Name: families_previous_request_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.families_previous_request_status_enum AS ENUM (
    'suspend_request',
    'social_sponsorship',
    'orphans_75000',
    'orphans_150000',
    'orphans_225000'
);


ALTER TYPE public.families_previous_request_status_enum OWNER TO postgres;

--
-- Name: families_request_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.families_request_status_enum AS ENUM (
    'suspend_request',
    'social_sponsorship',
    'orphans_75000',
    'orphans_150000',
    'orphans_225000'
);


ALTER TYPE public.families_request_status_enum OWNER TO postgres;

--
-- Name: families_sponsorship_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.families_sponsorship_status_enum AS ENUM (
    'yes',
    'no',
    'under_visit'
);


ALTER TYPE public.families_sponsorship_status_enum OWNER TO postgres;

--
-- Name: families_voucher_value_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.families_voucher_value_enum AS ENUM (
    'unspecified',
    '300000',
    '350000',
    '400000'
);


ALTER TYPE public.families_voucher_value_enum OWNER TO postgres;

--
-- Name: family_members_is_present_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.family_members_is_present_enum AS ENUM (
    'present',
    'married',
    'deceased',
    'convicted',
    'traveling',
    'missing'
);


ALTER TYPE public.family_members_is_present_enum OWNER TO postgres;

--
-- Name: family_members_is_sponsored_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.family_members_is_sponsored_enum AS ENUM (
    'yes',
    'no',
    'stopped'
);


ALTER TYPE public.family_members_is_sponsored_enum OWNER TO postgres;

--
-- Name: family_members_relation_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.family_members_relation_type_enum AS ENUM (
    'daughter',
    'son',
    'mother',
    'father',
    'paternal_uncle',
    'paternal_aunt',
    'maternal_uncle',
    'maternal_aunt',
    'paternal_uncle_cousin',
    'paternal_aunt_cousin',
    'maternal_uncle_cousin',
    'maternal_aunt_cousin',
    'paternal_grandfather',
    'maternal_grandfather',
    'paternal_grandmother',
    'maternal_grandmother',
    'paternal_uncle_wife',
    'other'
);


ALTER TYPE public.family_members_relation_type_enum OWNER TO postgres;

--
-- Name: family_needs_priority_level_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.family_needs_priority_level_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low',
    'minimal'
);


ALTER TYPE public.family_needs_priority_level_enum OWNER TO postgres;

--
-- Name: family_needs_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.family_needs_status_enum AS ENUM (
    'pending',
    'fulfilled',
    'partially',
    'self_resolved'
);


ALTER TYPE public.family_needs_status_enum OWNER TO postgres;

--
-- Name: permissions_name_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.permissions_name_enum AS ENUM (
    'create_role',
    'read_role',
    'update_role',
    'delete_role',
    'create_permission',
    'read_permission',
    'update_permission',
    'delete_permission',
    'create_user_permission',
    'read_user_permission',
    'delete_user_permission',
    'create_family',
    'read_family',
    'update_family',
    'delete_family',
    'create_visit',
    'read_visit',
    'update_visit',
    'delete_visit',
    'create_training_course',
    'read_training_course',
    'update_training_course',
    'delete_training_course',
    'create_emergency_aid',
    'read_emergency_aid',
    'update_emergency_aid',
    'delete_emergency_aid',
    'create_family_need',
    'read_family_need',
    'update_family_need',
    'delete_family_need',
    'create_received_assistance',
    'read_received_assistance',
    'update_received_assistance',
    'delete_received_assistance',
    'create_interview',
    'read_interview',
    'update_interview',
    'delete_interview',
    'create_employee',
    'read_employee',
    'update_employee',
    'delete_employee',
    'create_supporter',
    'read_supporter',
    'update_supporter',
    'delete_supporter',
    'create_supporter_child_sponsorship',
    'read_supporter_child_sponsorship',
    'update_supporter_child_sponsorship',
    'delete_supporter_child_sponsorship',
    'create_system_user',
    'read_system_user',
    'update_system_user',
    'delete_system_user',
    'create_person',
    'read_person',
    'update_person',
    'delete_person',
    'create_family_member',
    'read_family_member',
    'update_family_member',
    'delete_family_member',
    'create_dropdown',
    'read_dropdown',
    'update_dropdown',
    'delete_dropdown',
    'create_upload',
    'read_upload',
    'delete_upload'
);


ALTER TYPE public.permissions_name_enum OWNER TO postgres;

--
-- Name: person_course_batches_attendance_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.person_course_batches_attendance_status_enum AS ENUM (
    'excellent_commitment',
    'good_commitment',
    'moderate_commitment',
    'poor_commitment',
    'minimal_participation',
    'dropped_out'
);


ALTER TYPE public.person_course_batches_attendance_status_enum OWNER TO postgres;

--
-- Name: person_current_study_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.person_current_study_status_enum AS ENUM (
    'completed_all_stages',
    'category_3',
    'grade_1',
    'grade_1_cerebral_palsy',
    'grade_2',
    'grade_3',
    'grade_4',
    'grade_5',
    'grade_6',
    'grade_7',
    'grade_8',
    'grade_9',
    'grade_10',
    'grade_10_science',
    'grade_10_literature',
    'grade_10_medical_equipment',
    'grade_10_computer_tech',
    'grade_10_industry',
    'grade_11',
    'grade_11_science',
    'grade_11_literature',
    'grade_11_technical',
    'grade_11_business',
    'grade_11_medical_equipment',
    'baccalaureate',
    'baccalaureate_science',
    'baccalaureate_literature',
    'baccalaureate_free',
    'baccalaureate_free_science',
    'baccalaureate_free_literature',
    'university',
    'not_enrolled',
    'certificate_1',
    'certificate_2'
);


ALTER TYPE public.person_current_study_status_enum OWNER TO postgres;

--
-- Name: person_education_level_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.person_education_level_enum AS ENUM (
    'primary',
    'preparatory',
    'completed_all_stages',
    'illiterate',
    'vocational',
    'secondary',
    'university',
    'not_enrolled',
    'not_studying',
    'institute',
    'enrolled_university',
    'enrolled_school',
    'basic_literate'
);


ALTER TYPE public.person_education_level_enum OWNER TO postgres;

--
-- Name: person_gender_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.person_gender_enum AS ENUM (
    'male',
    'female'
);


ALTER TYPE public.person_gender_enum OWNER TO postgres;

--
-- Name: person_marital_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.person_marital_status_enum AS ENUM (
    'widowed',
    'single',
    'married',
    'deceased',
    'traveling',
    'divorced'
);


ALTER TYPE public.person_marital_status_enum OWNER TO postgres;

--
-- Name: person_school_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.person_school_type_enum AS ENUM (
    'public',
    'private',
    'private_martyrs_children',
    'sharia_boarding',
    'sharia',
    'private_institute',
    'hearing_imp_institute'
);


ALTER TYPE public.person_school_type_enum OWNER TO postgres;

--
-- Name: person_success_certificate_submission_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.person_success_certificate_submission_enum AS ENUM (
    'submitted_passed',
    'submitted_failed',
    'submitted_passed_repeating',
    'submitted_passed_with_help',
    'no',
    'not_needed_certificate',
    'not_needed'
);


ALTER TYPE public.person_success_certificate_submission_enum OWNER TO postgres;

--
-- Name: received_assistance_assistance_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.received_assistance_assistance_type_enum AS ENUM (
    'cash',
    'food',
    'clothes',
    'medicine',
    'shelter',
    'education',
    'hygiene',
    'transportation',
    'other'
);


ALTER TYPE public.received_assistance_assistance_type_enum OWNER TO postgres;

--
-- Name: supporter_child_sponsorships_sponsorship_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.supporter_child_sponsorships_sponsorship_status_enum AS ENUM (
    'active',
    'ended',
    'paused',
    'cancelled'
);


ALTER TYPE public.supporter_child_sponsorships_sponsorship_status_enum OWNER TO postgres;

--
-- Name: supporters_support_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.supporters_support_type_enum AS ENUM (
    'one_time',
    'occasional',
    'child_sponsorship'
);


ALTER TYPE public.supporters_support_type_enum OWNER TO postgres;

--
-- Name: visits_baraka_association_income_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.visits_baraka_association_income_enum AS ENUM (
    'lbp_75000',
    'lbp_150000',
    'lbp_225000',
    'none'
);


ALTER TYPE public.visits_baraka_association_income_enum OWNER TO postgres;

--
-- Name: visits_guardian_relationship_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.visits_guardian_relationship_enum AS ENUM (
    'daughter',
    'son',
    'mother',
    'father',
    'paternal_uncle',
    'paternal_aunt',
    'maternal_uncle',
    'maternal_aunt',
    'paternal_uncle_cousin',
    'paternal_aunt_cousin',
    'maternal_uncle_cousin',
    'maternal_aunt_cousin',
    'paternal_grandfather',
    'maternal_grandfather',
    'paternal_grandmother',
    'maternal_grandmother',
    'paternal_uncle_wife',
    'other'
);


ALTER TYPE public.visits_guardian_relationship_enum OWNER TO postgres;

--
-- Name: visits_house_condition_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.visits_house_condition_enum AS ENUM (
    'floor',
    'arabic',
    'shared',
    'arabic_european',
    'building_basement',
    'ground_floor'
);


ALTER TYPE public.visits_house_condition_enum OWNER TO postgres;

--
-- Name: visits_house_ownership_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.visits_house_ownership_enum AS ENUM (
    'owner',
    'state_owned',
    'installment',
    'rent',
    'guest_at_rent',
    'guest_at_resident',
    'guest_at_resident_inheritance_share',
    'with_family',
    'guest',
    'private_owner_inheritance_share',
    'inheritance_share'
);


ALTER TYPE public.visits_house_ownership_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: course_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_batches (
    id integer NOT NULL,
    training_course_id integer NOT NULL,
    batch_number integer NOT NULL,
    start_date date,
    end_date date,
    location character varying(255),
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.course_batches OWNER TO postgres;

--
-- Name: course_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_batches_id_seq OWNER TO postgres;

--
-- Name: course_batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_batches_id_seq OWNED BY public.course_batches.id;


--
-- Name: dropdown; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dropdown (
    id integer NOT NULL,
    dropdown_name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.dropdown OWNER TO postgres;

--
-- Name: dropdown_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dropdown_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dropdown_id_seq OWNER TO postgres;

--
-- Name: dropdown_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dropdown_id_seq OWNED BY public.dropdown.id;


--
-- Name: dropdown_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dropdown_option (
    id integer NOT NULL,
    dropdown_id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.dropdown_option OWNER TO postgres;

--
-- Name: dropdown_option_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dropdown_option_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dropdown_option_id_seq OWNER TO postgres;

--
-- Name: dropdown_option_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dropdown_option_id_seq OWNED BY public.dropdown_option.id;


--
-- Name: emergency_aid_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency_aid_requests (
    id integer NOT NULL,
    family_id integer NOT NULL,
    request_status public.emergency_aid_requests_request_status_enum DEFAULT 'pending'::public.emergency_aid_requests_request_status_enum NOT NULL,
    requested_amount integer NOT NULL,
    disbursed_amount integer,
    notes text,
    request_date timestamp without time zone DEFAULT now() NOT NULL,
    disbursement_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.emergency_aid_requests OWNER TO postgres;

--
-- Name: emergency_aid_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergency_aid_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergency_aid_requests_id_seq OWNER TO postgres;

--
-- Name: emergency_aid_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergency_aid_requests_id_seq OWNED BY public.emergency_aid_requests.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    person_id integer NOT NULL,
    "position" character varying(100),
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    hire_date date,
    termination_date date
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: families; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.families (
    id integer NOT NULL,
    landline_phone character varying(10),
    is_extremely_poor boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    request_number character varying(32),
    is_husband_palestinian boolean DEFAULT false NOT NULL,
    identity_documents text,
    email_arrival_date date,
    contacted_by_employee_id integer,
    is_registered_in_other_orphan_association boolean,
    other_orphan_association_name character varying(128),
    form_organization_status public.families_form_organization_status_enum,
    form_number character varying(64) NOT NULL,
    interview_date timestamp without time zone,
    management_decision public.families_management_decision_enum,
    form_organizer_notes text,
    archive_location public.families_archive_location_enum,
    mobile_phone character varying(15),
    is_refugee boolean DEFAULT false NOT NULL,
    sponsorship_status public.families_sponsorship_status_enum,
    family_book_number character varying(12) NOT NULL,
    request_acceptance_date date,
    request_suspension_date date,
    is_status_updated_at_social_affairs boolean DEFAULT false NOT NULL,
    family_members_with_guardian_count integer,
    shared_meal_members_count integer,
    current_residence_address character varying,
    current_residence_area character varying,
    request_status public.families_request_status_enum,
    voucher_value public.families_voucher_value_enum,
    house_type public.families_house_type_enum,
    previous_request_status public.families_previous_request_status_enum
);


ALTER TABLE public.families OWNER TO postgres;

--
-- Name: families_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.families_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.families_id_seq OWNER TO postgres;

--
-- Name: families_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.families_id_seq OWNED BY public.families.id;


--
-- Name: family_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.family_members (
    id integer NOT NULL,
    person_id integer NOT NULL,
    family_id integer NOT NULL,
    relation_type public.family_members_relation_type_enum NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    member_number integer,
    is_guardian boolean DEFAULT false NOT NULL,
    is_present public.family_members_is_present_enum,
    is_sponsored public.family_members_is_sponsored_enum DEFAULT 'no'::public.family_members_is_sponsored_enum NOT NULL
);


ALTER TABLE public.family_members OWNER TO postgres;

--
-- Name: family_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.family_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.family_members_id_seq OWNER TO postgres;

--
-- Name: family_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.family_members_id_seq OWNED BY public.family_members.id;


--
-- Name: family_needs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.family_needs (
    id integer NOT NULL,
    family_id integer NOT NULL,
    family_member_id integer,
    need_type character varying(100) NOT NULL,
    notes text,
    quantity integer,
    priority_level public.family_needs_priority_level_enum DEFAULT 'medium'::public.family_needs_priority_level_enum NOT NULL,
    status public.family_needs_status_enum DEFAULT 'pending'::public.family_needs_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.family_needs OWNER TO postgres;

--
-- Name: family_needs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.family_needs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.family_needs_id_seq OWNER TO postgres;

--
-- Name: family_needs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.family_needs_id_seq OWNED BY public.family_needs.id;


--
-- Name: interviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interviews (
    id integer NOT NULL,
    family_id integer NOT NULL,
    interviewer_id integer,
    interview_date date NOT NULL,
    purpose character varying(255),
    summary text,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.interviews OWNER TO postgres;

--
-- Name: interviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.interviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.interviews_id_seq OWNER TO postgres;

--
-- Name: interviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.interviews_id_seq OWNED BY public.interviews.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name public.permissions_name_enum NOT NULL,
    description text
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.person (
    id integer NOT NULL,
    full_name character varying(300) NOT NULL,
    mother_name character varying(100),
    birth_date date,
    birth_place character varying(200),
    national_id character varying(50),
    nationality character varying(100),
    mother_nationality character varying(100),
    gender public.person_gender_enum,
    shoe_size integer,
    marital_status public.person_marital_status_enum,
    is_working boolean,
    current_job character varying(200),
    job_details text,
    is_smoker boolean,
    health_status character varying,
    is_health_insurance_used boolean,
    success_certificate_submission public.person_success_certificate_submission_enum DEFAULT 'no'::public.person_success_certificate_submission_enum NOT NULL,
    education_level public.person_education_level_enum,
    university_major character varying(150),
    current_study_status public.person_current_study_status_enum,
    school_type public.person_school_type_enum,
    school_name character varying(200),
    "mobilePhone" character varying(15),
    "whatsappNumber" character varying(15),
    notes text
);


ALTER TABLE public.person OWNER TO postgres;

--
-- Name: person_course_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.person_course_batches (
    id integer NOT NULL,
    family_member_id integer NOT NULL,
    course_batch_id integer NOT NULL,
    attendance_status public.person_course_batches_attendance_status_enum,
    evaluation text,
    join_date date,
    drop_out_date date,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.person_course_batches OWNER TO postgres;

--
-- Name: person_course_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.person_course_batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.person_course_batches_id_seq OWNER TO postgres;

--
-- Name: person_course_batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.person_course_batches_id_seq OWNED BY public.person_course_batches.id;


--
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.person_id_seq OWNER TO postgres;

--
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- Name: received_assistance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.received_assistance (
    id integer NOT NULL,
    family_id integer NOT NULL,
    family_member_id integer,
    assistance_type public.received_assistance_assistance_type_enum,
    amount integer,
    delivery_date date NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.received_assistance OWNER TO postgres;

--
-- Name: received_assistance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.received_assistance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.received_assistance_id_seq OWNER TO postgres;

--
-- Name: received_assistance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.received_assistance_id_seq OWNED BY public.received_assistance.id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    id integer NOT NULL,
    permission_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_permissions_id_seq OWNER TO postgres;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: supporter_child_sponsorships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supporter_child_sponsorships (
    id integer NOT NULL,
    supporter_id integer NOT NULL,
    family_member_id integer NOT NULL,
    sponsorship_start_date date NOT NULL,
    sponsorship_end_date date,
    sponsorship_status public.supporter_child_sponsorships_sponsorship_status_enum DEFAULT 'active'::public.supporter_child_sponsorships_sponsorship_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.supporter_child_sponsorships OWNER TO postgres;

--
-- Name: supporter_child_sponsorships_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supporter_child_sponsorships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supporter_child_sponsorships_id_seq OWNER TO postgres;

--
-- Name: supporter_child_sponsorships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supporter_child_sponsorships_id_seq OWNED BY public.supporter_child_sponsorships.id;


--
-- Name: supporters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supporters (
    id integer NOT NULL,
    person_id integer NOT NULL,
    support_type public.supporters_support_type_enum,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    notes text
);


ALTER TABLE public.supporters OWNER TO postgres;

--
-- Name: supporters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supporters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supporters_id_seq OWNER TO postgres;

--
-- Name: supporters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supporters_id_seq OWNED BY public.supporters.id;


--
-- Name: system_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_users (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    role_id integer NOT NULL,
    username character varying(100) NOT NULL,
    password text NOT NULL,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    password_changed_at timestamp without time zone
);


ALTER TABLE public.system_users OWNER TO postgres;

--
-- Name: system_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_users_id_seq OWNER TO postgres;

--
-- Name: system_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_users_id_seq OWNED BY public.system_users.id;


--
-- Name: training_courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.training_courses (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.training_courses OWNER TO postgres;

--
-- Name: training_courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.training_courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_courses_id_seq OWNER TO postgres;

--
-- Name: training_courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.training_courses_id_seq OWNED BY public.training_courses.id;


--
-- Name: uploads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uploads (
    id integer NOT NULL,
    person_id integer NOT NULL,
    file_name character varying(255) NOT NULL,
    original_name character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_size integer NOT NULL,
    mime_type character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.uploads OWNER TO postgres;

--
-- Name: uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.uploads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.uploads_id_seq OWNER TO postgres;

--
-- Name: uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.uploads_id_seq OWNED BY public.uploads.id;


--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_permissions (
    id integer NOT NULL,
    system_user_id integer NOT NULL,
    permission_id integer NOT NULL,
    is_allowed boolean NOT NULL
);


ALTER TABLE public.user_permissions OWNER TO postgres;

--
-- Name: user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_permissions_id_seq OWNER TO postgres;

--
-- Name: user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_permissions_id_seq OWNED BY public.user_permissions.id;


--
-- Name: visits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visits (
    id integer NOT NULL,
    family_id integer NOT NULL,
    visit_date date NOT NULL,
    committee_notes_and_suggestions_of_the_visit_committee text,
    paper_sent_date_of_the_visit date,
    guardian_relationship public.visits_guardian_relationship_enum,
    number_of_family_members integer NOT NULL,
    number_of_remaining_family_members_in_the_house integer NOT NULL,
    road json,
    house_condition public.visits_house_condition_enum,
    notes text,
    house_ownership public.visits_house_ownership_enum,
    furnishings json,
    carpets_and_mats json,
    blankets json,
    quilts json,
    beds json,
    wardrobes json,
    household_items json,
    washing_machine json,
    gas_oven json,
    cooling_devices json,
    refrigerator json,
    heating_devices json,
    waste_basket text,
    school_expenses numeric(10,2),
    clothes_condition text,
    shoes_condition text,
    food_supplies_condition text,
    income json,
    available_spending_without_association numeric(10,2),
    total_income_without_association numeric(10,2),
    amount_of_rent_if_the_applicant_is_the_one_paying_it numeric(10,2),
    working_individual json,
    disability_or_illness json,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    visit_committee_evaluation json,
    baraka_association_income public.visits_baraka_association_income_enum,
    needs_or_luxuries_not_reported_in_the_paper character varying(1000),
    committee_members character varying[]
);


ALTER TABLE public.visits OWNER TO postgres;

--
-- Name: visits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visits_id_seq OWNER TO postgres;

--
-- Name: visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visits_id_seq OWNED BY public.visits.id;


--
-- Name: course_batches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_batches ALTER COLUMN id SET DEFAULT nextval('public.course_batches_id_seq'::regclass);


--
-- Name: dropdown id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dropdown ALTER COLUMN id SET DEFAULT nextval('public.dropdown_id_seq'::regclass);


--
-- Name: dropdown_option id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dropdown_option ALTER COLUMN id SET DEFAULT nextval('public.dropdown_option_id_seq'::regclass);


--
-- Name: emergency_aid_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_aid_requests ALTER COLUMN id SET DEFAULT nextval('public.emergency_aid_requests_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: families id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.families ALTER COLUMN id SET DEFAULT nextval('public.families_id_seq'::regclass);


--
-- Name: family_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_members ALTER COLUMN id SET DEFAULT nextval('public.family_members_id_seq'::regclass);


--
-- Name: family_needs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_needs ALTER COLUMN id SET DEFAULT nextval('public.family_needs_id_seq'::regclass);


--
-- Name: interviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews ALTER COLUMN id SET DEFAULT nextval('public.interviews_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: person id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- Name: person_course_batches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person_course_batches ALTER COLUMN id SET DEFAULT nextval('public.person_course_batches_id_seq'::regclass);


--
-- Name: received_assistance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.received_assistance ALTER COLUMN id SET DEFAULT nextval('public.received_assistance_id_seq'::regclass);


--
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: supporter_child_sponsorships id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supporter_child_sponsorships ALTER COLUMN id SET DEFAULT nextval('public.supporter_child_sponsorships_id_seq'::regclass);


--
-- Name: supporters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supporters ALTER COLUMN id SET DEFAULT nextval('public.supporters_id_seq'::regclass);


--
-- Name: system_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users ALTER COLUMN id SET DEFAULT nextval('public.system_users_id_seq'::regclass);


--
-- Name: training_courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training_courses ALTER COLUMN id SET DEFAULT nextval('public.training_courses_id_seq'::regclass);


--
-- Name: uploads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploads ALTER COLUMN id SET DEFAULT nextval('public.uploads_id_seq'::regclass);


--
-- Name: user_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions ALTER COLUMN id SET DEFAULT nextval('public.user_permissions_id_seq'::regclass);


--
-- Name: visits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits ALTER COLUMN id SET DEFAULT nextval('public.visits_id_seq'::regclass);


--
-- Data for Name: course_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_batches (id, training_course_id, batch_number, start_date, end_date, location, notes, created_at, updated_at) FROM stdin;
1	4	1	2023-02-02	2024-02-03	Al-Barakah Training Center - Room A1	Morning batch for working professionals. Classes held on weekends (Friday and Saturday) from 9 AM to 5 PM. Maximum capacity: 25 students.	2025-09-04 15:10:01.351217	2025-09-04 15:10:01.351217
2	4	2	2023-02-02	2024-02-03	Al-Barakah Training Center - Room A1	Morning batch for working professionals. Classes held on weekends (Friday and Saturday) from 9 AM to 5 PM. Maximum capacity: 25 students.	2025-09-04 15:21:02.527651	2025-09-04 15:21:02.527651
\.


--
-- Data for Name: dropdown; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dropdown (id, dropdown_name, created_at, updated_at) FROM stdin;
26	Marital Status	2025-09-04 21:31:31.511898	2025-09-04 21:31:31.511898
27	Health Status	2025-09-04 21:31:31.511898	2025-09-04 21:31:31.511898
28	Education Level	2025-09-04 21:31:31.511898	2025-09-04 21:31:31.511898
29	School Type	2025-09-04 21:31:31.511898	2025-09-04 21:31:31.511898
30	Grade Level	2025-09-04 21:31:31.511898	2025-09-04 21:31:31.511898
\.


--
-- Data for Name: dropdown_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dropdown_option (id, dropdown_id, name, created_at, is_active) FROM stdin;
276	26	Single	2025-09-04 21:31:31.511898	t
277	26	Married	2025-09-04 21:31:31.511898	t
278	26	Divorced	2025-09-04 21:31:31.511898	t
279	26	Widowed	2025-09-04 21:31:31.511898	t
280	27	Healthy	2025-09-04 21:31:31.511898	t
281	27	Chronic Illness	2025-09-04 21:31:31.511898	t
282	27	Disabled	2025-09-04 21:31:31.511898	t
283	27	Temporarily Ill	2025-09-04 21:31:31.511898	t
284	27	Recovering from Surgery	2025-09-04 21:31:31.511898	t
285	27	Mental Health Condition	2025-09-04 21:31:31.511898	t
286	27	Contagious Disease	2025-09-04 21:31:31.511898	t
287	28	Illiterate	2025-09-04 21:31:31.511898	t
288	28	Primary School	2025-09-04 21:31:31.511898	t
289	28	Middle School	2025-09-04 21:31:31.511898	t
290	28	High School	2025-09-04 21:31:31.511898	t
291	28	Diploma	2025-09-04 21:31:31.511898	t
292	28	Bachelor's Degree	2025-09-04 21:31:31.511898	t
293	28	Master's Degree	2025-09-04 21:31:31.511898	t
294	28	Doctorate (PhD)	2025-09-04 21:31:31.511898	t
295	29	Public School	2025-09-04 21:31:31.511898	t
296	29	Private School	2025-09-04 21:31:31.511898	t
297	29	International School	2025-09-04 21:31:31.511898	t
298	29	Religious School	2025-09-04 21:31:31.511898	t
299	29	Homeschooling	2025-09-04 21:31:31.511898	t
300	29	Charter School	2025-09-04 21:31:31.511898	t
301	29	Vocational School	2025-09-04 21:31:31.511898	t
302	29	Online School	2025-09-04 21:31:31.511898	t
303	30	Kindergarten	2025-09-04 21:31:31.511898	t
304	30	1st Grade	2025-09-04 21:31:31.511898	t
305	30	2nd Grade	2025-09-04 21:31:31.511898	t
306	30	3rd Grade	2025-09-04 21:31:31.511898	t
307	30	4th Grade	2025-09-04 21:31:31.511898	t
308	30	5th Grade	2025-09-04 21:31:31.511898	t
309	30	6th Grade	2025-09-04 21:31:31.511898	t
310	30	7th Grade	2025-09-04 21:31:31.511898	t
311	30	8th Grade	2025-09-04 21:31:31.511898	t
312	30	9th Grade	2025-09-04 21:31:31.511898	t
313	30	10th Grade - Scientific	2025-09-04 21:31:31.511898	t
314	30	11th Grade - Scientific	2025-09-04 21:31:31.511898	t
315	30	12th Grade - Scientific	2025-09-04 21:31:31.511898	t
316	30	10th Grade - Literary	2025-09-04 21:31:31.511898	t
317	30	11th Grade - Literary	2025-09-04 21:31:31.511898	t
318	30	12th Grade - Literary	2025-09-04 21:31:31.511898	t
319	30	10th Grade - Industrial	2025-09-04 21:31:31.511898	t
320	30	11th Grade - Industrial	2025-09-04 21:31:31.511898	t
321	30	12th Grade - Industrial	2025-09-04 21:31:31.511898	t
322	30	10th Grade - Commercial	2025-09-04 21:31:31.511898	t
323	30	11th Grade - Commercial	2025-09-04 21:31:31.511898	t
324	30	12th Grade - Commercial	2025-09-04 21:31:31.511898	t
325	30	10th Grade - Agricultural	2025-09-04 21:31:31.511898	t
326	30	11th Grade - Agricultural	2025-09-04 21:31:31.511898	t
327	30	12th Grade - Agricultural	2025-09-04 21:31:31.511898	t
328	30	10th Grade - Sharia	2025-09-04 21:31:31.511898	t
329	30	11th Grade - Sharia	2025-09-04 21:31:31.511898	t
330	30	12th Grade - Sharia	2025-09-04 21:31:31.511898	t
\.


--
-- Data for Name: emergency_aid_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emergency_aid_requests (id, family_id, request_status, requested_amount, disbursed_amount, notes, request_date, disbursement_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, person_id, "position", notes, created_at, updated_at, hire_date, termination_date) FROM stdin;
1	3	System Administrator	\N	2025-08-31 10:57:19.714059	2025-08-31 10:57:19.714059	\N	\N
\.


--
-- Data for Name: families; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.families (id, landline_phone, is_extremely_poor, created_at, updated_at, request_number, is_husband_palestinian, identity_documents, email_arrival_date, contacted_by_employee_id, is_registered_in_other_orphan_association, other_orphan_association_name, form_organization_status, form_number, interview_date, management_decision, form_organizer_notes, archive_location, mobile_phone, is_refugee, sponsorship_status, family_book_number, request_acceptance_date, request_suspension_date, is_status_updated_at_social_affairs, family_members_with_guardian_count, shared_meal_members_count, current_residence_address, current_residence_area, request_status, voucher_value, house_type, previous_request_status) FROM stdin;
13	0112345678	t	2025-09-04 11:09:04.509026	2025-09-04 11:09:04.509026	REQ001	f	Passport, ID Card	2024-01-15	1	f	Other Association	done	FORM001	2024-01-20 13:00:00	sponsorship	Family needs immediate assistance	direct_acceptance_interview_forms	0991234567	t	yes	FB123456789	2024-01-25	2024-02-01	f	5	7	123 Main Street, Damascus	Damascus City	orphans_75000	300000	rent	\N
22	0112345678	t	2025-09-07 13:23:39.106709	2025-09-07 13:23:39.106709	REQ005	f	Passport, ID Card	2024-01-15	1	f	Other Association	done	FORM005	2024-01-20 13:00:00	sponsorship	Family needs immediate assistance	direct_acceptance_interview_forms	0991234567	t	yes	FB123456775	2024-01-25	2024-02-01	f	5	7	123 Main Street, Damascus	Damascus City	orphans_75000	300000	rent	suspend_request
23	0112345678	t	2025-09-07 13:23:51.209392	2025-09-07 13:23:51.209392	REQ006	f	Passport, ID Card	2024-02-15	1	f	Other Association	done	FORM006	2024-01-20 13:00:00	sponsorship	Family needs immediate assistance	direct_acceptance_interview_forms	0991234567	t	yes	FB123456776	2024-01-25	2024-02-01	f	5	7	123 Main Street, Damascus	Damascus City	orphans_75000	300000	rent	suspend_request
20	0211234567	t	2025-04-30 20:59:59.999	2025-09-04 22:56:53.432868	REQ-2024-001	f	Passport, ID Card	2024-01-15	1	f	Other Association Name	done	FORM-2024-001	2024-01-20 00:00:00	sponsorship	Family interview notes	direct_acceptance_interview_forms	0991234567	f	yes	FB123456	2024-01-10	\N	f	5	7	Damascus, Syria	Old City	social_sponsorship	300000	rent	\N
\.


--
-- Data for Name: family_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.family_members (id, person_id, family_id, relation_type, notes, created_at, updated_at, member_number, is_guardian, is_present, is_sponsored) FROM stdin;
15	25	20	son	Sample notes	2025-09-05 20:55:17.816308	2025-09-05 20:55:17.816308	1	t	\N	no
16	26	13	son	Sample notes	2025-09-07 14:05:35.824906	2025-09-07 14:05:35.824906	1	f	\N	no
14	24	20	son	Sample notes	2025-01-05 20:54:56.71124	2025-09-05 20:54:56.71124	1	f	\N	no
\.


--
-- Data for Name: family_needs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.family_needs (id, family_id, family_member_id, need_type, notes, quantity, priority_level, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: interviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interviews (id, family_id, interviewer_id, interview_date, purpose, summary, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, name, description) FROM stdin;
141	create_role	create_role
142	read_role	read_role
143	update_role	update_role
144	delete_role	delete_role
145	create_permission	create_permission
146	read_permission	read_permission
147	update_permission	update_permission
148	delete_permission	delete_permission
149	create_user_permission	create_user_permission
150	read_user_permission	read_user_permission
151	delete_user_permission	delete_user_permission
152	create_family	create_family
153	read_family	read_family
154	update_family	update_family
155	delete_family	delete_family
156	create_visit	create_visit
157	read_visit	read_visit
158	update_visit	update_visit
159	delete_visit	delete_visit
160	create_training_course	create_training_course
161	read_training_course	read_training_course
162	update_training_course	update_training_course
163	delete_training_course	delete_training_course
164	create_emergency_aid	create_emergency_aid
165	read_emergency_aid	read_emergency_aid
166	update_emergency_aid	update_emergency_aid
167	delete_emergency_aid	delete_emergency_aid
168	create_family_need	create_family_need
169	read_family_need	read_family_need
170	update_family_need	update_family_need
171	delete_family_need	delete_family_need
172	create_received_assistance	create_received_assistance
173	read_received_assistance	read_received_assistance
174	update_received_assistance	update_received_assistance
175	delete_received_assistance	delete_received_assistance
176	create_interview	create_interview
177	read_interview	read_interview
178	update_interview	update_interview
179	delete_interview	delete_interview
180	create_employee	create_employee
181	read_employee	read_employee
182	update_employee	update_employee
183	delete_employee	delete_employee
184	create_supporter	create_supporter
185	read_supporter	read_supporter
186	update_supporter	update_supporter
187	delete_supporter	delete_supporter
188	create_supporter_child_sponsorship	create_supporter_child_sponsorship
189	read_supporter_child_sponsorship	read_supporter_child_sponsorship
190	update_supporter_child_sponsorship	update_supporter_child_sponsorship
191	delete_supporter_child_sponsorship	delete_supporter_child_sponsorship
192	create_system_user	create_system_user
193	read_system_user	read_system_user
194	update_system_user	update_system_user
195	delete_system_user	delete_system_user
196	create_person	create_person
197	read_person	read_person
198	update_person	update_person
199	delete_person	delete_person
200	create_family_member	create_family_member
201	read_family_member	read_family_member
202	update_family_member	update_family_member
203	delete_family_member	delete_family_member
204	create_dropdown	create_dropdown
205	read_dropdown	read_dropdown
206	update_dropdown	update_dropdown
207	delete_dropdown	delete_dropdown
211	create_upload	create_upload
212	read_upload	read_upload
213	delete_upload	delete_upload
\.


--
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.person (id, full_name, mother_name, birth_date, birth_place, national_id, nationality, mother_nationality, gender, shoe_size, marital_status, is_working, current_job, job_details, is_smoker, health_status, is_health_insurance_used, success_certificate_submission, education_level, university_major, current_study_status, school_type, school_name, "mobilePhone", "whatsappNumber", notes) FROM stdin;
5	Ahmed Ali Hassan	Fatima Hassan	1990-05-15	Damascus	12345678901	Syrian	Syrian	male	42	single	t	Software Engineer	Full-stack development	f	Healthy	f	no	university	Computer Science	university	public	Damascus University	+963912345678	+963912345678	Test person for API testing
3	Ahmad Ali	Fatima	1990-01-01	Damascus	12345678902	Syrian	Syrian	male	42	married	t	Engineer	Software engineer	f	Healthy	f	submitted_passed	primary	Computer Science	completed_all_stages	private_institute	Damascus University	+963991234567	+963991234567	Additional person notes
14	Ahmad Al-Mahmoud	Fatima Al-Hassan	1990-05-15	Damascus	12345678905	Syrian	Syrian	male	42	married	t	Engineer	Software development	f	Good	f	no	university	Computer Science	university	public	Damascus University	0933123456	0933123456	Additional person notes
24	Ahmad Ali4	Fatima	1990-01-01	Damascus	12345678906	Syrian	Syrian	male	42	married	t	Engineer	Software engineer	f	Healthy	f	submitted_passed	primary	Computer Science	completed_all_stages	private_institute	Damascus University	0991234567	+963991234567	Additional person notes
25	Ahmad Ali8	Fatima	1990-01-01	Damascus	12345678908	Syrian	Syrian	male	42	married	t	Engineer	Software engineer	f	Healthy	f	submitted_passed	primary	Computer Science	completed_all_stages	private_institute	Damascus University	0991234567	+963991234567	Additional person notes
26	Ahmad Ali3	Fatima	1990-01-01	Damascus	12345678978	Syrian	Syrian	male	42	married	t	Engineer	Software engineer	f	Healthy	f	submitted_passed	primary	Computer Science	completed_all_stages	private_institute	Damascus University	0991234567	+963991234567	Additional person notes
\.


--
-- Data for Name: person_course_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.person_course_batches (id, family_member_id, course_batch_id, attendance_status, evaluation, join_date, drop_out_date, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: received_assistance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.received_assistance (id, family_id, family_member_id, assistance_type, amount, delivery_date, notes, created_at, updated_at) FROM stdin;
2	13	\N	medicine	2500	2024-01-15	Monthly medicine supply delivered	2025-09-04 15:05:22.871617	2025-09-04 15:05:22.871617
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (id, permission_id, role_id) FROM stdin;
279	141	7
280	142	7
281	142	9
282	143	7
283	144	7
284	145	7
285	146	7
286	146	9
287	147	7
288	148	7
289	149	7
290	150	7
291	150	9
292	151	7
293	152	7
294	152	8
295	153	7
296	153	8
297	153	9
298	154	7
299	154	8
300	155	7
301	155	8
302	156	7
303	156	8
304	157	7
305	157	8
306	157	9
307	158	7
308	158	8
309	159	7
310	159	8
311	160	7
312	160	8
313	161	7
314	161	8
315	161	9
316	162	7
317	162	8
318	163	7
319	163	8
320	164	7
321	164	8
322	165	7
323	165	8
324	165	9
325	166	7
326	166	8
327	167	7
328	167	8
329	168	7
330	168	8
331	169	7
332	169	8
333	169	9
334	170	7
335	170	8
336	171	7
337	171	8
338	172	7
339	172	8
340	173	7
341	173	8
342	173	9
343	174	7
344	174	8
345	175	7
346	175	8
347	176	7
348	176	8
349	177	7
350	177	8
351	177	9
352	178	7
353	178	8
354	179	7
355	179	8
356	180	7
357	181	7
358	181	9
359	182	7
360	183	7
361	184	7
362	184	8
363	185	7
364	185	8
365	185	9
366	186	7
367	186	8
368	187	7
369	187	8
370	188	7
371	188	8
372	189	7
373	189	8
374	189	9
375	190	7
376	190	8
377	191	7
378	191	8
379	192	7
380	193	7
381	193	9
382	194	7
383	195	7
384	196	7
385	196	8
386	197	7
387	197	8
388	197	9
389	198	7
390	198	8
391	199	7
392	199	8
393	200	7
394	200	8
395	201	7
396	201	8
397	201	9
398	202	7
399	202	8
400	203	7
401	203	8
402	204	7
403	204	8
404	205	7
405	205	8
406	205	9
407	206	7
408	206	8
409	207	7
410	207	8
418	211	7
419	211	8
420	212	7
421	212	8
422	212	9
423	213	7
424	213	8
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, created_at, updated_at) FROM stdin;
7	superadmin	Super Admin role with all permissions including system management	2025-08-31 10:57:19.714059	2025-08-31 10:57:19.714059
8	admin	Admin role with business operations permissions (excluding system/employee management)	2025-08-31 10:57:19.714059	2025-08-31 10:57:19.714059
9	viewer	Read-only access to all data	2025-08-31 10:57:19.714059	2025-08-31 10:57:19.714059
\.


--
-- Data for Name: supporter_child_sponsorships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supporter_child_sponsorships (id, supporter_id, family_member_id, sponsorship_start_date, sponsorship_end_date, sponsorship_status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: supporters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supporters (id, person_id, support_type, created_at, updated_at, notes) FROM stdin;
2	14	one_time	2025-09-04 12:31:28.096189	2025-09-04 12:31:28.096189	Supporter notes
\.


--
-- Data for Name: system_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_users (id, employee_id, role_id, username, password, last_login, created_at, updated_at, password_changed_at) FROM stdin;
1	1	7	superadmin	$2b$10$jUVN5nPK6SVkyEPc/kNPc.ZxGyPSBCSuLYyYpyE30KkUjJ5n9CBDK	2025-08-31 10:57:51.24	2025-08-31 10:57:19.714059	2025-08-31 10:57:51.24536	2025-08-31 10:57:20.274
\.


--
-- Data for Name: training_courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.training_courses (id, name, description, notes, created_at, updated_at) FROM stdin;
4	11	111	\N	2025-09-04 15:09:18.56578	2025-09-04 15:09:26.153479
5	Web Development Fundamentals	A comprehensive course covering HTML, CSS, JavaScript, and basic web development concepts. Students will learn to build responsive websites and understand modern web development practices.	Prerequisites: Basic computer literacy. Course duration: 8 weeks. Certificate provided upon completion.	2025-09-04 15:11:37.874437	2025-09-04 15:11:37.874437
\.


--
-- Data for Name: uploads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uploads (id, person_id, file_name, original_name, file_path, file_size, mime_type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_permissions (id, system_user_id, permission_id, is_allowed) FROM stdin;
\.


--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visits (id, family_id, visit_date, committee_notes_and_suggestions_of_the_visit_committee, paper_sent_date_of_the_visit, guardian_relationship, number_of_family_members, number_of_remaining_family_members_in_the_house, road, house_condition, notes, house_ownership, furnishings, carpets_and_mats, blankets, quilts, beds, wardrobes, household_items, washing_machine, gas_oven, cooling_devices, refrigerator, heating_devices, waste_basket, school_expenses, clothes_condition, shoes_condition, food_supplies_condition, income, available_spending_without_association, total_income_without_association, amount_of_rent_if_the_applicant_is_the_one_paying_it, working_individual, disability_or_illness, created_at, updated_at, visit_committee_evaluation, baraka_association_income, needs_or_luxuries_not_reported_in_the_paper, committee_members) FROM stdin;
1	13	2024-01-15	Family needs immediate assistance	2024-01-16	father	5	3	{"isExtreme":true,"isPaved":false,"isDirt":true,"isClose":false,"notes":"Road is difficult to access"}	floor	House is in poor condition	rent	{"sofaSets":1,"sofas":2,"mattresses":3,"notes":"Basic furnishings available"}	{"carpetsCount":2,"matsCount":4,"notes":"Some carpets and mats present"}	{"blanketsCount":3,"notes":"Limited blankets available"}	{"quiltsCount":2,"notes":"Some quilts present"}	{"bedsCount":2,"notes":"Two beds available"}	{"wardrobesCount":1,"notes":"One wardrobe present"}	{"tables":1,"chairs":4,"batteries":2,"televisions":1,"screens":0,"waterCoolers":1,"microwaves":0,"vacuumCleaners":0,"computers":0,"laptops":0,"routers":0,"landlinePhones":1,"mobilePhones":"old","electricOvens":0,"freezers":0,"notes":"Basic household items present"}	{"count":1,"type":"automatic","notes":"One automatic washing machine"}	{"count":1,"type":"standard","notes":"One gas oven available"}	{"airConditionersCount":0,"fansCount":2,"notes":"Two fans available"}	{"count":1,"notes":"One refrigerator working"}	{"dieselHeatersCount":0,"gasHeatersCount":1,"woodHeatersCount":0,"electricHeatersCount":0,"notes":"One gas heater available"}	Present but needs cleaning	150000.00	Worn but usable	Poor condition	Limited supplies	{"amount":200000,"source":"Father's salary"}	50000.00	250000.00	100000.00	{"age":"one_over_15","notes":"Father works as construction worker"}	{"status":"one","notes":"Mother has diabetes"}	2025-09-07 15:23:57.649839	2025-09-07 15:23:57.649839	{"cleanlinessAndOrder":"50%","generalMorals":"70%","physicalAndMentalHealth":"50%","surroundingEnvironment":"30%"}	lbp_150000	\N	\N
2	13	2024-01-15	Family needs immediate assistance	2024-01-16	father	5	3	{"isExtreme":true,"isPaved":false,"isDirt":true,"isClose":false,"notes":"Road is difficult to access"}	floor	House is in poor condition	rent	{"sofaSets":1,"sofas":2,"mattresses":3,"notes":"Basic furnishings available"}	{"carpetsCount":2,"matsCount":4,"notes":"Some carpets and mats present"}	{"blanketsCount":3,"notes":"Limited blankets available"}	{"quiltsCount":2,"notes":"Some quilts present"}	{"bedsCount":2,"notes":"Two beds available"}	{"wardrobesCount":1,"notes":"One wardrobe present"}	{"tables":1,"chairs":4,"batteries":2,"televisions":1,"screens":0,"waterCoolers":1,"microwaves":0,"vacuumCleaners":0,"computers":0,"laptops":0,"routers":0,"landlinePhones":1,"mobilePhones":"old","electricOvens":0,"freezers":0,"notes":"Basic household items present"}	{"count":1,"type":"automatic","notes":"One automatic washing machine"}	{"count":1,"type":"standard","notes":"One gas oven available"}	{"airConditionersCount":0,"fansCount":2,"notes":"Two fans available"}	{"count":1,"notes":"One refrigerator working"}	{"dieselHeatersCount":0,"gasHeatersCount":1,"woodHeatersCount":0,"electricHeatersCount":0,"notes":"One gas heater available"}	Present but needs cleaning	150000.00	Worn but usable	Poor condition	Limited supplies	{"amount":200000,"source":"Father's salary"}	50000.00	250000.00	100000.00	{"age":"one_over_15","notes":"Father works as construction worker"}	{"status":"one","notes":"Mother has diabetes"}	2025-09-07 15:24:45.910137	2025-09-07 15:24:45.910137	{"cleanlinessAndOrder":"50%","generalMorals":"70%","physicalAndMentalHealth":"50%","surroundingEnvironment":"30%"}	lbp_150000	\N	\N
3	13	2024-01-15	Family needs immediate assistance	2024-01-16	father	5	3	{"isExtreme":true,"isPaved":false,"isDirt":true,"isClose":false,"notes":"Road is difficult to access"}	floor	House is in poor condition	rent	{"sofaSets":1,"sofas":2,"mattresses":3,"notes":"Basic furnishings available"}	{"carpetsCount":2,"matsCount":4,"notes":"Some carpets and mats present"}	{"blanketsCount":3,"notes":"Limited blankets available"}	{"quiltsCount":2,"notes":"Some quilts present"}	{"bedsCount":2,"notes":"Two beds available"}	{"wardrobesCount":1,"notes":"One wardrobe present"}	{"tables":1,"chairs":4,"batteries":2,"televisions":1,"screens":0,"waterCoolers":1,"microwaves":0,"vacuumCleaners":0,"computers":0,"laptops":0,"routers":0,"landlinePhones":1,"mobilePhones":"old","electricOvens":0,"freezers":0,"notes":"Basic household items present"}	{"count":1,"type":"automatic","notes":"One automatic washing machine"}	{"count":1,"type":"standard","notes":"One gas oven available"}	{"airConditionersCount":0,"fansCount":2,"notes":"Two fans available"}	{"count":1,"notes":"One refrigerator working"}	{"dieselHeatersCount":0,"gasHeatersCount":1,"woodHeatersCount":0,"electricHeatersCount":0,"notes":"One gas heater available"}	Present but needs cleaning	150000.00	Worn but usable	Poor condition	Limited supplies	{"amount":200000,"source":"Father's salary"}	50000.00	250000.00	100000.00	{"age":"one_over_15","notes":"Father works as construction worker"}	{"status":"one","notes":"Mother has diabetes"}	2025-09-07 15:26:14.261611	2025-09-07 15:26:14.261611	{"cleanlinessAndOrder":"50%","generalMorals":"70%","physicalAndMentalHealth":"50%","surroundingEnvironment":"30%"}	lbp_150000	\N	\N
4	13	2024-01-15	Family needs immediate assistance	2024-01-16	father	5	3	{"isExtreme":true,"isPaved":false,"isDirt":true,"isClose":false,"notes":"Road is difficult to access"}	floor	House is in poor condition	rent	{"sofaSets":1,"sofas":2,"mattresses":3,"notes":"Basic furnishings available"}	{"carpetsCount":2,"matsCount":4,"notes":"Some carpets and mats present"}	{"blanketsCount":3,"notes":"Limited blankets available"}	{"quiltsCount":2,"notes":"Some quilts present"}	{"bedsCount":2,"notes":"Two beds available"}	{"wardrobesCount":1,"notes":"One wardrobe present"}	{"tables":1,"chairs":4,"batteries":2,"televisions":1,"screens":0,"waterCoolers":1,"microwaves":0,"vacuumCleaners":0,"computers":0,"laptops":0,"routers":0,"landlinePhones":1,"mobilePhones":"old","electricOvens":0,"freezers":0,"notes":"Basic household items present"}	{"count":1,"type":"automatic","notes":"One automatic washing machine"}	{"count":1,"type":"standard","notes":"One gas oven available"}	{"airConditionersCount":0,"fansCount":2,"notes":"Two fans available"}	{"count":1,"notes":"One refrigerator working"}	{"dieselHeatersCount":0,"gasHeatersCount":1,"woodHeatersCount":0,"electricHeatersCount":0,"notes":"One gas heater available"}	Present but needs cleaning	150000.00	Worn but usable	Poor condition	Limited supplies	{"amount":200000,"source":"Father's salary"}	50000.00	250000.00	100000.00	{"age":"one_over_15","notes":"Father works as construction worker"}	{"status":"one","notes":"Mother has diabetes"}	2025-09-07 15:55:09.786871	2025-09-07 15:55:09.786871	{"cleanlinessAndOrder":"50%","generalMorals":"70%","physicalAndMentalHealth":"50%","surroundingEnvironment":"30%"}	lbp_150000	Additional blankets needed	{"Ahmed Ali","Fatima Hassan"}
\.


--
-- Name: course_batches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_batches_id_seq', 2, true);


--
-- Name: dropdown_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dropdown_id_seq', 30, true);


--
-- Name: dropdown_option_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dropdown_option_id_seq', 330, true);


--
-- Name: emergency_aid_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emergency_aid_requests_id_seq', 5, true);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 1, true);


--
-- Name: families_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.families_id_seq', 23, true);


--
-- Name: family_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.family_members_id_seq', 16, true);


--
-- Name: family_needs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.family_needs_id_seq', 2, true);


--
-- Name: interviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.interviews_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 213, true);


--
-- Name: person_course_batches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.person_course_batches_id_seq', 2, true);


--
-- Name: person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.person_id_seq', 26, true);


--
-- Name: received_assistance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.received_assistance_id_seq', 2, true);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 424, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 9, true);


--
-- Name: supporter_child_sponsorships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supporter_child_sponsorships_id_seq', 2, true);


--
-- Name: supporters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supporters_id_seq', 2, true);


--
-- Name: system_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_users_id_seq', 1, true);


--
-- Name: training_courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.training_courses_id_seq', 6, true);


--
-- Name: uploads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.uploads_id_seq', 1, false);


--
-- Name: user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_permissions_id_seq', 1, false);


--
-- Name: visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visits_id_seq', 4, true);


--
-- Name: user_permissions PK_01f4295968ba33d73926684264f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "PK_01f4295968ba33d73926684264f" PRIMARY KEY (id);


--
-- Name: visits PK_0b0b322289a41015c6ea4e8bf30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT "PK_0b0b322289a41015c6ea4e8bf30" PRIMARY KEY (id);


--
-- Name: training_courses PK_13bbeecb2ed8a1f45be3c02d68e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training_courses
    ADD CONSTRAINT "PK_13bbeecb2ed8a1f45be3c02d68e" PRIMARY KEY (id);


--
-- Name: course_batches PK_18337ef2cb15ca9f60ed616f3b4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_batches
    ADD CONSTRAINT "PK_18337ef2cb15ca9f60ed616f3b4" PRIMARY KEY (id);


--
-- Name: family_members PK_186da7c7fcbf23775fdd888a747; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_members
    ADD CONSTRAINT "PK_186da7c7fcbf23775fdd888a747" PRIMARY KEY (id);


--
-- Name: dropdown_option PK_4f4382835119a83db753737e206; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dropdown_option
    ADD CONSTRAINT "PK_4f4382835119a83db753737e206" PRIMARY KEY (id);


--
-- Name: family_needs PK_4ff447866020af8661c427301cf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_needs
    ADD CONSTRAINT "PK_4ff447866020af8661c427301cf" PRIMARY KEY (id);


--
-- Name: person PK_5fdaf670315c4b7e70cce85daa3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY (id);


--
-- Name: families PK_70414ac0c8f45664cf71324b9bb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.families
    ADD CONSTRAINT "PK_70414ac0c8f45664cf71324b9bb" PRIMARY KEY (id);


--
-- Name: dropdown PK_71729f6673c45ea11d1a6c1c5c9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dropdown
    ADD CONSTRAINT "PK_71729f6673c45ea11d1a6c1c5c9" PRIMARY KEY (id);


--
-- Name: emergency_aid_requests PK_80031018200735fafc7f0d9f887; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_aid_requests
    ADD CONSTRAINT "PK_80031018200735fafc7f0d9f887" PRIMARY KEY (id);


--
-- Name: role_permissions PK_84059017c90bfcb701b8fa42297; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY (id);


--
-- Name: permissions PK_920331560282b8bd21bb02290df; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY (id);


--
-- Name: received_assistance PK_a3d0eb1468c63eb60266e366878; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.received_assistance
    ADD CONSTRAINT "PK_a3d0eb1468c63eb60266e366878" PRIMARY KEY (id);


--
-- Name: employees PK_b9535a98350d5b26e7eb0c26af4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY (id);


--
-- Name: person_course_batches PK_bee973df89ddb324afba0d07658; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person_course_batches
    ADD CONSTRAINT "PK_bee973df89ddb324afba0d07658" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: supporter_child_sponsorships PK_c30118bf783963f829628f7b1da; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supporter_child_sponsorships
    ADD CONSTRAINT "PK_c30118bf783963f829628f7b1da" PRIMARY KEY (id);


--
-- Name: system_users PK_cd8917a46de98ec75f9197911c0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users
    ADD CONSTRAINT "PK_cd8917a46de98ec75f9197911c0" PRIMARY KEY (id);


--
-- Name: uploads PK_d1781d1eedd7459314f60f39bd3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT "PK_d1781d1eedd7459314f60f39bd3" PRIMARY KEY (id);


--
-- Name: supporters PK_df583237353494c8061a6ed731c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supporters
    ADD CONSTRAINT "PK_df583237353494c8061a6ed731c" PRIMARY KEY (id);


--
-- Name: interviews PK_fd41af1f96d698fa33c2f070f47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT "PK_fd41af1f96d698fa33c2f070f47" PRIMARY KEY (id);


--
-- Name: supporters REL_8d9b38da8dd01ad98c1a4e9ffd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supporters
    ADD CONSTRAINT "REL_8d9b38da8dd01ad98c1a4e9ffd" UNIQUE (person_id);


--
-- Name: system_users REL_bfb469be6c33467532b42a07f7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users
    ADD CONSTRAINT "REL_bfb469be6c33467532b42a07f7" UNIQUE (employee_id);


--
-- Name: person UQ_0956bce9971d7f1953c39ef97ba; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT "UQ_0956bce9971d7f1953c39ef97ba" UNIQUE (national_id);


--
-- Name: training_courses UQ_2129a31974a8eefed0b65ba13e5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training_courses
    ADD CONSTRAINT "UQ_2129a31974a8eefed0b65ba13e5" UNIQUE (name);


--
-- Name: course_batches UQ_30992b6b580427472f5e5be19a7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_batches
    ADD CONSTRAINT "UQ_30992b6b580427472f5e5be19a7" UNIQUE (batch_number, training_course_id);


--
-- Name: permissions UQ_48ce552495d14eae9b187bb6716; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE (name);


--
-- Name: user_permissions UQ_8b564e81e1ca6f27b07f2ab1d5c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "UQ_8b564e81e1ca6f27b07f2ab1d5c" UNIQUE (system_user_id, permission_id);


--
-- Name: employees UQ_bcffd813608ecb48db10645a49f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "UQ_bcffd813608ecb48db10645a49f" UNIQUE (person_id);


--
-- Name: dropdown_option UQ_dropdown_option_name_dropdown; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dropdown_option
    ADD CONSTRAINT "UQ_dropdown_option_name_dropdown" UNIQUE (name, dropdown_id);


--
-- Name: families UQ_ee7b32de8c923856059b535260d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.families
    ADD CONSTRAINT "UQ_ee7b32de8c923856059b535260d" UNIQUE (form_number);


--
-- Name: role_permissions UQ_role_permission_roleId_permissionId; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "UQ_role_permission_roleId_permissionId" UNIQUE (role_id, permission_id);


--
-- Name: IDX_62434674cc4fe3dcb29324f56c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_62434674cc4fe3dcb29324f56c" ON public.supporter_child_sponsorships USING btree (supporter_id, family_member_id) WHERE (sponsorship_status = 'active'::public.supporter_child_sponsorships_sponsorship_status_enum);


--
-- Name: IDX_7673dbe545d8d43d12d85bd3f0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7673dbe545d8d43d12d85bd3f0" ON public.emergency_aid_requests USING btree (family_id);


--
-- Name: IDX_7deb4f73026916b7cf9d43413d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_7deb4f73026916b7cf9d43413d" ON public.families USING btree (family_book_number);


--
-- Name: IDX_97a92608081a6e55c667aa0195; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_97a92608081a6e55c667aa0195" ON public.families USING btree (request_number);


--
-- Name: IDX_a17f6a81d7da32373b32cb5243; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_a17f6a81d7da32373b32cb5243" ON public.person_course_batches USING btree (family_member_id, course_batch_id);


--
-- Name: IDX_ce0a99819e2f95347d38e6245b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_ce0a99819e2f95347d38e6245b" ON public.family_members USING btree (family_id, person_id);


--
-- Name: IDX_ee7b32de8c923856059b535260; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_ee7b32de8c923856059b535260" ON public.families USING btree (form_number);


--
-- Name: idx_employees_person_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_employees_person_id ON public.employees USING btree (person_id);


--
-- Name: idx_person_full_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_person_full_name ON public.person USING btree (full_name);


--
-- Name: idx_person_national_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_person_national_id ON public.person USING btree (national_id) WHERE (national_id IS NOT NULL);


--
-- Name: idx_roles_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_roles_name ON public.roles USING btree (name);


--
-- Name: idx_system_users_employee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_system_users_employee_id ON public.system_users USING btree (employee_id);


--
-- Name: idx_system_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_system_users_username ON public.system_users USING btree (username);


--
-- Name: supporter_child_sponsorships FK_02e9fdf89fb24fdb4ddbab1da19; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supporter_child_sponsorships
    ADD CONSTRAINT "FK_02e9fdf89fb24fdb4ddbab1da19" FOREIGN KEY (supporter_id) REFERENCES public.supporters(id) ON DELETE CASCADE;


--
-- Name: uploads FK_08a47cdd624239585e31a27969c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT "FK_08a47cdd624239585e31a27969c" FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: family_members FK_0bb82eed69c26581e0884653814; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_members
    ADD CONSTRAINT "FK_0bb82eed69c26581e0884653814" FOREIGN KEY (family_id) REFERENCES public.families(id) ON DELETE CASCADE;


--
-- Name: role_permissions FK_17022daf3f885f7d35423e9971e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions FK_178199805b901ccd220ab7740ec; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: person_course_batches FK_25b0ec3a4136e2f3c3bd41f5fac; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person_course_batches
    ADD CONSTRAINT "FK_25b0ec3a4136e2f3c3bd41f5fac" FOREIGN KEY (family_member_id) REFERENCES public.family_members(id) ON DELETE CASCADE;


--
-- Name: received_assistance FK_2ae3ea374309328c0bb0e3bc162; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.received_assistance
    ADD CONSTRAINT "FK_2ae3ea374309328c0bb0e3bc162" FOREIGN KEY (family_id) REFERENCES public.families(id) ON DELETE CASCADE;


--
-- Name: supporter_child_sponsorships FK_340b47e89060fe9cc8c48ef35af; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supporter_child_sponsorships
    ADD CONSTRAINT "FK_340b47e89060fe9cc8c48ef35af" FOREIGN KEY (family_member_id) REFERENCES public.family_members(id) ON DELETE CASCADE;


--
-- Name: course_batches FK_353ad0ee67dabdfb62a7bda76d5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_batches
    ADD CONSTRAINT "FK_353ad0ee67dabdfb62a7bda76d5" FOREIGN KEY (training_course_id) REFERENCES public.training_courses(id) ON DELETE CASCADE;


--
-- Name: received_assistance FK_3fd752442a9e8ee1e113fb93567; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.received_assistance
    ADD CONSTRAINT "FK_3fd752442a9e8ee1e113fb93567" FOREIGN KEY (family_member_id) REFERENCES public.family_members(id) ON DELETE CASCADE;


--
-- Name: dropdown_option FK_61ae052a351790eecf71060389a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dropdown_option
    ADD CONSTRAINT "FK_61ae052a351790eecf71060389a" FOREIGN KEY (dropdown_id) REFERENCES public.dropdown(id) ON DELETE RESTRICT;


--
-- Name: emergency_aid_requests FK_7673dbe545d8d43d12d85bd3f08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_aid_requests
    ADD CONSTRAINT "FK_7673dbe545d8d43d12d85bd3f08" FOREIGN KEY (family_id) REFERENCES public.families(id) ON DELETE CASCADE;


--
-- Name: user_permissions FK_8145f5fadacd311693c15e41f10; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "FK_8145f5fadacd311693c15e41f10" FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: family_needs FK_86294211bbf84e892a79ba9bbc2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_needs
    ADD CONSTRAINT "FK_86294211bbf84e892a79ba9bbc2" FOREIGN KEY (family_id) REFERENCES public.families(id) ON DELETE CASCADE;


--
-- Name: supporters FK_8d9b38da8dd01ad98c1a4e9ffdd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supporters
    ADD CONSTRAINT "FK_8d9b38da8dd01ad98c1a4e9ffdd" FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: family_members FK_9c917782fa266b78d3878102754; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_members
    ADD CONSTRAINT "FK_9c917782fa266b78d3878102754" FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: families FK_a0e863c6b9ccc0987ab70cd99f3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.families
    ADD CONSTRAINT "FK_a0e863c6b9ccc0987ab70cd99f3" FOREIGN KEY (contacted_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- Name: employees FK_bcffd813608ecb48db10645a49f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "FK_bcffd813608ecb48db10645a49f" FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: system_users FK_bfb469be6c33467532b42a07f73; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users
    ADD CONSTRAINT "FK_bfb469be6c33467532b42a07f73" FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: visits FK_cbad89edc07e713ded0656afbe0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT "FK_cbad89edc07e713ded0656afbe0" FOREIGN KEY (family_id) REFERENCES public.families(id) ON DELETE CASCADE;


--
-- Name: interviews FK_d0c4ee604c301f56b29536ee779; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT "FK_d0c4ee604c301f56b29536ee779" FOREIGN KEY (family_id) REFERENCES public.families(id) ON DELETE CASCADE;


--
-- Name: interviews FK_dab087b7d082364ae58637eafbb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT "FK_dab087b7d082364ae58637eafbb" FOREIGN KEY (interviewer_id) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- Name: user_permissions FK_e7c0e3cc736673e748985b892ca; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "FK_e7c0e3cc736673e748985b892ca" FOREIGN KEY (system_user_id) REFERENCES public.system_users(id) ON DELETE CASCADE;


--
-- Name: family_needs FK_f2cbbe79e355846e22863efb8ff; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_needs
    ADD CONSTRAINT "FK_f2cbbe79e355846e22863efb8ff" FOREIGN KEY (family_member_id) REFERENCES public.family_members(id) ON DELETE CASCADE;


--
-- Name: person_course_batches FK_fcbec4965743f366f7ec3a3edca; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person_course_batches
    ADD CONSTRAINT "FK_fcbec4965743f366f7ec3a3edca" FOREIGN KEY (course_batch_id) REFERENCES public.course_batches(id) ON DELETE CASCADE;


--
-- Name: system_users FK_fdff3108f5a19283657bc2c798f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users
    ADD CONSTRAINT "FK_fdff3108f5a19283657bc2c798f" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

