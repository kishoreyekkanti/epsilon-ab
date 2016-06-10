CREATE TABLE eps_tests(
    id SERIAL PRIMARY KEY,
    test_name varchar(200) NOT NULL,
    test_description varchar(500),
    option_no integer NOT NULL,
    weightage integer NOT NULL,
    auto_optimise boolean default true,
    status varchar(50) DEFAULT 'active',
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    updated_at datetime DEFAULT NULL,
    index test_name_option_no_idx (test_name, option_no),
    index et_test_name_idx (test_name),
    UNIQUE KEY test_name_option(test_name, option_no)
)ENGINE = InnoDB
