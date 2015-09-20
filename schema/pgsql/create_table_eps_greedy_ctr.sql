CREATE TABLE eps_greedy_ctr(
    id SERIAL PRIMARY KEY,
    user_unique_id varchar(300) NOT NULL,
    test_name varchar(200) NOT NULL,
    option_no integer NOT NULL,
    trial integer default 1,
    reward integer default 0,
    created_at timestamp NOT NULL DEFAULT current_timestamp
)