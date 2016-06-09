CREATE TABLE eps_greedy_ctr(
    id SERIAL PRIMARY KEY,
    user_unique_id varchar(300) NOT NULL,
    test_name varchar(200) NOT NULL,
    option_no integer NOT NULL,
    trial integer default 1,
    reward integer default 0,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    unique(user_unique_id, test_name, option_no)
);

create index egc_user_unique_id_idx on eps_greedy_ctr(user_unique_id);
create index egc_test_name_idx on eps_greedy_ctr(test_name);
create index egc_test_name_option_no_idx on eps_greedy_ctr(test_name, option_no);