# ExpressApi
Express Api for login and register using JWT token.

# Step 1
run npm i to install packages.
# Step 2
run nodemon command.

# Routes

1. ForResgistration:
POST : localhost:3000/api/v1/Registration
param : {
    "email":email_id,
    "password" : "password",
    "lastname":"lastname",
    "firstname" : "firstname"
}

Response on success : {
    "status": "success",
    "data": {
        "id": id,
        "email": "email",
        "firstname": "firstname",
        "lastname": "lastname",
        "created_at": "2022-02-15T15:37:08.755Z"
    }
}

Response on fail : {
    "status": "error",
    "error_message": "error"
}


2. For Login
POST : localhost:3000/api/v1/login
param : {
    "email":email_id,
    "password" : "password",
    "lastname":"lastname",
    "firstname" : "firstname"
}

Response on success : {
    "status": "success",
    "data": {
        "id": id,
        "email": "email",
        "firstname": "firstname",
        "lastname": "lastname",
        "created_at": "2022-02-15T15:37:08.755Z",
        "token" : "jwt_token"
    }
}

Response on fail : {
    "status": "error",
    "error_message": "error"
}

4. For request response dump logs
GET : 
Without param : localhost:3000/api/v1/login (count from all data)
With Param    :  localhost:3000/api/v1/login?from_data="from_date"&to_date="to_date"


Response on success : {
    "status": "success",
    "data": [
            {
            "total_login_count" : count
            },
            {
            "total_registeration_count" : count,
            }
            ]
}

Response on fail : {
    "status": "error",
    "error_message": "error"
}
