CREATE TABLE eps_greedy_ctr(
    id  INT(11)  NOT NULL  AUTO_INCREMENT,
    user_unique_id varchar(300) NOT NULL,
    test_name varchar(200) NOT NULL,
    option_no INT(5) NOT NULL,
    trial INT(20) default 1,
    reward INT(20) default 0,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (id),
    index egc_user_unique_id_idx (user_unique_id),
    index egc_test_name_idx (test_name),
    index egc_test_name_option_no_idx (test_name, option_no)
)ENGINE = InnoDB
