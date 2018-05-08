# **Generic Mock API Server**

This program is basically to mock an API server, which will be used mainly for development purposes for mobile app. It is written in NodeJS and highly rely on ExpressJS's Middlewares.

To launch program, open project root directory with CLI, then type `npm start`.



## Functionality
1. Allow user to read files from local disk for its content (JSON file, etc) and response it back to the API caller (GET Request).
2. Allow user to submit data (raw JSON body) together with the POST request to get something back (JSON file, etc).
3. Allow user to use JSON file to do configuration on how the POST will response.
4. Allow user to use JSON file to do configuration on how the ERROR will response. (Details)

### 1. GET Request

When user call the GET Request of `http://localhost:3000/api/user1`, the program will retrieve the `user1.json` file that store in the `api` folder and display its contents.

**Example:**

Submit a GET Request

![A][GET]

Output

        {
           "user1" : {
              "name" : "mahesh",
              "password" : "password1",
              "profession" : "teacher",
              "id": 1
           }
        }

### 2. POST Request

When user call a POST Request with a raw JSON Body such as `{"userid":"2"}`, the program will response back the content (Configurable).

**Example:**

Submit a POST Request with raw JSON body

![A][POST]

Output

        {
           "user2" : {
              "name" : "suresh",
              "password" : "password2",
              "profession" : "librarian",
              "id": 2
           }
        }

**NOTE:** The program will get all the root object from the raw JSON body and match with its data with the configured value.

**NOTE** Example:
- configured `request` is `userid`
- configured `value` is `3`
- configured `path` is `/api/user3.json`
- raw JSON body is:

      {
        "address" : {
         "postcode" : "30100",
         "city" : "IPOH",
         "state" : "PERAK",
         "country" : "MALAYSIA"
        },
        "user" : {
         "id" : {
            "userid" : "3",
            "tempid" : "abc"
         },
         "name" : "slnn3r"
        }
      }

**NOTE** Explanation:

The program will get all the root Object, in this case, `postcode, city, state, country, userid, tempid, name` will be obtain and program will do checking and ignore all other object but only take object of `userid` (the configured `request`) and see if its value matched with the configured `value`. Since the configured `value` is 3 and the raw body request `userid` object value is `3`, it is a match and the program will return `user3.json` (the configured `path`) content back to the user.

### 3. POST configuration

**Example Configuration ( config.json in config folder ) :**

    [{
      "url" : "/api",
      "condition" : [{
        "value" : "1",
        "path" : "/api/user1.json"
       }, {
        "value" : "2",
        "path" : "/api/user2.json"
       }, {
        "value" : "3",
        "path" : "/api/user3.json"
       }],
       "request" : "userid"

     }, {
      "url" : "/plus",
      "condition" : [{
        "value" : "122",
        "path" : "/plus/plus122.json"
       }, {
        "value" : "2",
        "path" : "/plus/plus2.json"
       }
      ],
      "request" : "plu2sid"
    }]

- **url**

  User can add multiple `url` and specify it with any value they want so that the program check if the Request URL is match with the configure `url`. In this case, the program is able to response to POST url request of `http://localhost:3000/api/` and `http://localhost:3000/plus/`.

- **request**

  User can specify the `request` for specific `url`, in this case, when user call a POST request of `http://localhost:3000/api/` and if its raw JSON body is `{"user":"1"}`, the program will display an **error** message, because the submitted raw JSON body's `request` is `user` but the configured `request` is `userid`.

- **value**

  If the raw JSON body's `request` is matched with the configured `request`, the program will proceed to check their `value` and see if they are match or not. User can specify multiple `value`. In this case, when user call a POST request of `http://localhost:3000/api/` and if its raw JSON body is `{"userid":"1"}`, the system will response `user1.json` file content to user as the raw JSON body's `value` and the configured value are matched.

- **path**

  After program find the raw JSON body's `request` and `value` is matched with the configured's `request` and `value`. The program will use the configured `path` that specify by user to get the file content and response back to user.

### 4. ERROR configuration

**Example Configuration (404.json in config folder ) :**

    {
        "error": {
            "code": "404 - Configured Error Message"
        }
    }

Just write any type of error information in JSON format in `404.json` file then when error occurred such as user enter invalid `url`, the error message will be display. In the case, the Error Output will be display with the exactly code written in the `404.json` file.




[GET]:https://i.stack.imgur.com/c9sdF.png
[POST]:https://i.stack.imgur.com/N15h8.png
