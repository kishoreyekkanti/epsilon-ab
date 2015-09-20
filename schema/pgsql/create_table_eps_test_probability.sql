CREATE TABLE eps_test_probability(
    user_unique_id varchar(300) NOT NULL primary key,
    test_name varchar(200) NOT NULL,
    eps_option_no integer NOT NULL,
    conversion integer,
    created_at timestamp NOT NULL DEFAULT current_timestamp
)