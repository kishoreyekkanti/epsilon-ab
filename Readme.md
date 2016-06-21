# Features

 1. Setup as many tests as you want with as many branches(options) as you want, using simple REST api
 2. Get which branch to be shown to a given user by providing some user unique id. Once the option is determined then that 
 option is pinned to that user so future requests for that user unique id will always generate the same branch/option
 3. Fetch a single test detail by id (or) all the tests setup in the system
 4. Update the branch/option details on the fly if you want to add more weightage to any specific branch
 5. Reward a branch and update the conversion funnel for any given branch using a simple API
 6. Gather the basic stats about how your AB tests are performing using an API
 7. You can always gather the complex metrics by directly querying the database
 8. Supports Postgresql and Mysql
 9. Runs on Node.js and PM2. So you need not bother about the app being down as PM2 can take care of automatic restarts 
 if in case the app dies
 10. Json based logging using Bunyan
 11. A postman collection of all the apis is attached at the bottom of this documentation, you can download and play with it
 12. This project uses the strategy explained by Steve Hanov in his [blog](http://stevehanov.ca/blog/index.php?id=132)
 
# Usage
### Installation
##### Download
Clone the project and run `npm install` to download all the dependencies.
##### Configuration
 Before you start have a look at `config/config.json` and update the `default` hash appropriately. Don't forget to update
 the `name` key of the `default` hash as it is important to pick up the database type. Other keys in the config file are
 ignored. Example postgresql configuration can be as below. `"dev"` just resembles its being run on dev mode. You can 
 change it to `"production"` (if you want to) and pass in your `NODE_ENV` variable at the start up time.
 
##### Postgresql configuration (config/config.json)

Change the db credentials as required. Below is just an example.

  ```javascript
  {
    "dev": {
        "default": {
          "host": "localhost",
          "port": "5432",
          "database": "eps",
          "user": "epsuser",
          "password": "epsuser",
          "name": "pgsql"
        }
      }
  }
  ```
##### Mysql configuration  (config/config.json)

You need the mysql.sock socketPath if you are on Mac. 
Change the db credentials as required. Below is just an example.

  ```javascript
  {
    "dev": {
        "default": {
        "name": "mysql",
        "host": "localhost",
        "port": "3306",
        "database": "eps",
        "user": "root",
        "password": "root",
        "connectionLimit": 5,
        "socketPath": "/Applications/MAMP/tmp/mysql/mysql.sock"
        }
      }
  }
  ```
##### Table creation
Depending on the above configuration you have to create the tables in your database. Table and index creations are under
`schema/pgsql` and `schema/mysql` for postgres and Mysql respectively. 

##### Running
If you want to test this in your local machine and if you don't bother about `PM2` then you can just run `node app.js` 
within the project root directory and the application will start by default on port 5000.

If you want to run this using `PM2` then you can use the command `pm2 start app.js -i 1 -n epsilon-ab` . This will start 
one instance of the server with the name `epsilon-ab`. You can use `pm2 list` or `pm2 show epsilon-ab` to see the details
of the process. To stop the app use `pm2 stop epsilon-ab`. To understand different options of PM2 use this [link](http://pm2.keymetrics.io/).
  
##### Logging
Once the app starts you should see the logs flowing in json format. Bunyan is used for logging. Have a look at [Bunyan](https://github.com/trentm/node-bunyan)
to understand the best way of grepping etc,. 

# APIs
##### Create a test with 3 branches(options)
Provided the server is running on port 5000 - use the following curl command to create a test. `auto_optimise` is a really
powerful feature if once set its automatically determines the best option based on the user behaviour and slowly becomes
the default behaviour for the entire test. Each branch you want to create will have a unique `option_no` starting from `1`.
`weightage` is the weight you want to attach to each branch. The total wieghtage of all the branches need *NOT* sum up to 100.
`weightage` is more relative than a percentage (though you can use it as a percentage). `status` can take `active` or `inactive`.
`test_description` is a free flowing text to help you identify the purpose of the branch. `test_name` should be unique across
different tests.

*REQUEST*

```curl
curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "test_name":"show_button_colors_for_signup",
    "options":[
        {
            "option_no":1,
            "weightage":30,
            "auto_optimise":true,
            "status":"active",
            "test_description":"Show Red Color"
        },
        {
            "option_no":2,
            "weightage":40,
            "auto_optimise":true,
            "status":"active",
            "test_description":"Show Blue Color"
        },
        {
            "option_no":3,
            "weightage":30,
            "auto_optimise":true,
            "status":"active",
            "test_description":"Show Green Color"
        }
        
        ]
}' "http://localhost:5000/epsTest"
```
*RESPONSE*
```javascript
{
  "response": "Saved the AB tests successfully"
}
```

##### Get an option for a user

Once the tests are setup you want to get the branch selected by the algorithm for a user. Here `user_unique_id` can 
be a cookie or customer id or any id which you can uniquely identify the user visit with. And as mentioned above, once the
option is generated, its pinned for that particular user_unique_id and the same option will be given back for subsequent calls.

*REQUEST*
```curl
curl -X GET -H "Content-Type: application/json" -H "Cache-Control: no-cache"  "http://localhost:5000/epsOption?user_unique_id=aasd2345&test_name=show_beta_navigation"
```
*RESPONSE*
So the option/branch selected by the algorithm is `3`

```javascript
{
  "testName": "show_beta_navigation",
  "option": 3,
  "createdAt": "2016-06-09T21:53:52.234Z"
}
```

##### Update a test option
If you want to change the test description or change the weightage of any option(this will skew the results as the test
was already setup), you can use this api.
 
*REQUEST*
```curl
curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "options":{
        "weightage":30,
        "auto_optimise":false,
        "status":"active",
        "test_description":"updated the Blue color option"
    }
}' "http://localhost:5000/epsTest/20/options/2"
```
*RESPONSE*
```javascript
{
  "response": "Eps option updated successfully"
}
```

##### Award an option
Say in the above example of Red, Blue and Green buttons if the user selected Red button and you want to reward that selection
of user then you should use this api.

*REQUEST*
```curl
curl -X PUT -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "user_unique_id":"aasd2345"
}' "http://localhost:5000/epsTest/reward"
```
*RESPONSE*
```javascript
{
  "response": "reward updated"
}
```

##### Update conversion
If a user has chosen a branch and completed a desired funnel, then you can mark a conversion for the given branch. 
Ex: If a user choses a red button and signs up, checks out and pays successfully, then you can mark a conversion for red button branch.

This conversion updates will really help to determine the quality of traffic for a given ab test branch. Ex: More people click on
 Red button but the conversion is low, where as less people click on green button with huge conversions etc,.
Along with this request you can also optionally send the `user_domain_id`. This is nothing but the other user_unique id but 
 in domain terms. Say for example during the initial branch selection we send the cookie string as unique id, post signup 
 we might have got the real user id of the user and we want to update the real user id(user_domain_id against the cookie id.
 
*REQUEST*
```curl
curl -X PUT -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
    "user_unique_id":"aasd2345",
    "user_domain_id":"12345"
}' "http://localhost:5000/epsTest/conversion"
```
*RESPONSE*
```javascript
{
  "response": "conversion updated"
}
```

##### Get All AB Tests
To fetch all the ab tests setup in the system

*REQUEST*
```curl
curl -X GET -H "Content-Type: application/json" -H "Cache-Control: no-cache" "http://localhost:5000/epsTest"
```
*RESPONSE*
```javascript
[
  {
    "id": 40,
    "test_name": "show_button_coslors_for_signup",
    "test_description": "Show Green Color",
    "option_no": 3,
    "weightage": 30,
    "auto_optimise": true,
    "status": "active",
    "created_at": "2016-06-13T23:23:21.000Z",
    "updated_at": null
  },
  {
    "id": 39,
    "test_name": "show_button_coslors_for_signup",
    "test_description": "Show Blue Color",
    "option_no": 2,
    "weightage": 40,
    "auto_optimise": true,
    "status": "active",
    "created_at": "2016-06-13T23:23:20.988Z",
    "updated_at": null
  },
  {
    "id": 38,
    "test_name": "show_button_coslors_for_signup",
    "test_description": "Show Red Color",
    "option_no": 1,
    "weightage": 30,
    "auto_optimise": true,
    "status": "active",
    "created_at": "2016-06-13T23:23:20.943Z",
    "updated_at": null
  },
  {
    "id": 37,
    "test_name": "show_button_colors_for_signup2",
    "test_description": "Show Green Color",
    "option_no": 3,
    "weightage": 30,
    "auto_optimise": true,
    "status": "active",
    "created_at": "2016-06-10T19:45:05.920Z",
    "updated_at": null
  },
  {
    "id": 36,
    "test_name": "show_button_colors_for_signup2",
    "test_description": "Show Blue Color",
    "option_no": 2,
    "weightage": 40,
    "auto_optimise": true,
    "status": "active",
    "created_at": "2016-06-10T19:45:05.911Z",
    "updated_at": null
  },
  {
    "id": 35,
    "test_name": "show_button_colors_for_signup2",
    "test_description": "Show Red Color",
    "option_no": 1,
    "weightage": 30,
    "auto_optimise": true,
    "status": "active",
    "created_at": "2016-06-10T19:45:05.897Z",
    "updated_at": null
  },
  {
    "id": 33,
    "test_name": "show_button_colors_for_signup1",
    "test_description": "Show Green Color",
    "option_no": 3,
    "weightage": 30,
    "auto_optimise": true,
    "status": "active",
    "created_at": "2016-06-10T19:40:38.589Z",
    "updated_at": null
  },
  {
    "id": 32,
    "test_name": "show_button_colors_for_signup1",
    "test_description": "Show Blue Color",
    "option_no": 2,
    "weightage": 40,
    "auto_optimise": true,
    "status": "active",
    "created_at": "2016-06-10T19:40:38.570Z",
    "updated_at": null
  },
  {
    "id": 31,
    "test_name": "show_button_colors_for_signup1",
    "test_description": "Show Red Color",
    "option_no": 1,
    "weightage": 30,
    "auto_optimise": true,
    "status": "active",
    "created_at": "2016-06-10T19:40:38.533Z",
    "updated_at": null
  }
]
```
##### Get AB tests by id
Fetch AB test by an id

*REQUEST*
```curl
curl -X GET -H "Content-Type: application/json" -H "Cache-Control: no-cache"  "http://localhost:5000/epsTest/21"
```
*RESPONSE*
```javascript
{
  "id": 21,
  "test_name": "show_button_colors_for_signup",
  "test_description": "Show Green Color",
  "option_no": 3,
  "weightage": 30,
  "auto_optimise": true,
  "status": "active",
  "created_at": "2016-06-09T21:35:00.725Z",
  "updated_at": null
}
```

##### Get stats on how the tests are performing
Fetches the performance of the given AB test. `Trails` are the number of times the option is given across different users. 
`Reward` is how many number of times user used the given option/branch. Ex: Out of 30 times(trails) only 3 times(rewards)
users clicked on the red button. `conversion` shows how many times the funnel conversion happened for a given test branch.

*REQUEST*
```curl
curl -X GET -H "Content-Type: application/json" -H "Cookie: PHPSESSID= fd1c94418019fc04f77b63ed5ae8cf1f" -H "Cache-Control: no-cache" "http://localhost:5000/epsTest/show_beta_navigation/stats"
```
*RESPONSE*
```javascript
{
  "test_name": "show_beta_navigation",
  "options": [
    {
      "option_no": 2,
      "trial": 40,
      "reward": 10,
      "weightage": 25,
      "auto_optimise": true,
      "status": "active",
      "test_description": "Shows beta navigation with optional links",
      "conversion": "10"
    },
    {
      "option_no": 3,
      "trial": 80,
      "reward": 75,
      "weightage": 25,
      "auto_optimise": true,
      "status": "active",
      "test_description": "Shows beta navigation with no links",
      "conversion": "14"
    }
  ]
}
```
# Postman collection of the API
Use this [link](https://github.com/kishoreyekkanti/epsilon-ab/blob/master/EpsilonAB.postman_collection) to download the postman collection. You can directly import this collection and play with the api. 
Make sure you run the seed data under `schema/*/seed.sql` to have some dummy data to start with.

# Future enhancements
1. Generating more stats in terms of AB tests like send te time series data of how the ab tests performed over time
2. Create a ORM like adapter across different databases so the sql generation will be easier.
