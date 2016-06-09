CREATE TABLE eps_test_probability(
    user_unique_id varchar(300) NOT NULL primary key,
    test_name varchar(200) NOT NULL,
    option_no integer NOT NULL,
    conversion integer default 0,
    user_domain_id integer default 0,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    unique(user_unique_id, test_name, option_no)
);

create index etp_test_name_idx on eps_test_probability(test_name);
create index etp_test_name_option_no_idx on eps_test_probability(test_name, option_no);