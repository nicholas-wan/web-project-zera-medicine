
### How to use

1. (optional) Edit the `defaultUserAccount` property in `settings.json` to provide the default account details

    ```json
    "defaultUserAccount":{ 
      "username": "admin", 
      "email": "admin@example.com", 
      "password": "password123", 
      "profile": { 
        "firstname": "Admin", 
        "surname": "User", 
        "contactDetails": { 
          "mobilePhone": "0411111111", 
          "emailAddress": "admin@example.com"
        }
      }
    }
    ````

2. (optional) Edit the role hierarchy in settings.json

    ```json
    "public": {
      "accountsAdmin": {
        "rolesHierarchy": {
          "roleName": "admin",
          "subordinates": [
            {
              "roleName": "user-admin",
              "subordinates": [
                {
                  "roleName": "user",
                  "visibleUserFields": {
                    "_id": 1,
                    "username": 1,
                    "profile.name": 1,
                    "profile.firstname": 1,
                    "profile.surname": 1,
                    "profile.contactDetails.emailAddress": 1,
                    "profile.contactDetails.mobilePhone": 1,
                    "roles": 1,
                    "emails": 1
                  }
                }
              ],
              "defaultNewUserRoles": [
                "user"
              ]
            }
          ],
          "defaultNewUserRoles": [
            "user-admin"
          ]
        },
        "whitelistedUserProperties": [
          "profile.firstname",
          "profile.surname",
          "profile.contactDetails.mobilePhone",
          "profile.contactDetails.emailAddress",
          "roles"
        ]
      }  
    } 
    ```

3. Run meteor
    ```
    meteor --settings settings.json
    ```

4. Login with `admin` as the username and `password123` as the password

5. Add a user. By default they'll be given the `user-admin` role. Login with the new user details.

6. As the new user, add another user. By default they'll be given the `user` role. Note that the `user-admin` role can't see the initial `admin` user.

