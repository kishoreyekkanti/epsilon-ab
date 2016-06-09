1. externalize db and refactor the code in eps_tests.js - DONE
2. Move some code to models - LATER
3. Figure out adapter model - LATER
4. create another api to update/increment reward - DONE
5. create api to update conversion - DONE
6. create api to create/update test - DONE
7. Mark a test as closed - DONE
8. Based on 7 we might have to re do between active in active and winner states - DONE
9. Think of how to use auto optimise - DONE
10. Expose an endpoint to calculate the stats of the tests - DONE
11. General refactoring of code - clear node modules and usage of pm2
12. Publishing as node module?
13. add updated_at to eps_tests - DONE
14. Mysql extension

```
{
  "test_name": "show_beta_navigation",
  "created_by":"kishore",
  "options":[
      {
        "option_no":1,
        "weightage":20,
        "auto_optimise":true,
        "status": "active",
        "test_description":"show to 20% of customers"
      },
      {
        "option_no":2,
        "weightage":40,
        "auto_optimise":true,
        "status": "active",
        "test_description":"show to 40% of customers"
      },
      {
        "option_no":3,
        "weightage":40,
        "auto_optimise":true,
        "status": "active",
        "test_description":"show to 40% of customers"
      }
    ]
}
```

