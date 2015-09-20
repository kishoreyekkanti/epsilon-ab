insert into eps_tests (test_name, option_no, weightage) values('show_beta_navigation', 1, 50);
insert into eps_tests (test_name, option_no, weightage) values('show_beta_navigation', 2, 25);
insert into eps_tests (test_name, option_no, weightage) values('show_beta_navigation', 3, 25);

insert into eps_test_probability (user_unique_id, test_name, eps_option_no, conversion) values('asff14','show_beta_navigation', 1, 10);
insert into eps_test_probability (user_unique_id, test_name, eps_option_no, conversion) values('assadfdsafff14','show_beta_navigation', 2, 10);
insert into eps_test_probability (user_unique_id, test_name, eps_option_no, conversion) values('asdfasdf','show_beta_navigation', 3, 1);
insert into eps_test_probability (user_unique_id, test_name, eps_option_no, conversion) values('asff14",'show_beta_navigation'', 1, 10);
insert into eps_test_probability (user_unique_id, test_name, eps_option_no, conversion) values('asdf','show_beta_navigation', 1, 0);
insert into eps_test_probability (user_unique_id, test_name, eps_option_no, conversion) values('sadf','show_beta_navigation', 2, 0);