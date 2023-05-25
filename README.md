# Split it

## Overview

Sharing a meal with friends is nice but it may not be that nice when paying the bill. This web app is here to help people calculate and remember the bills they have when splitting them with friends. Register as a user and you will be able to add friends and calculate and record each bill you share with them. There will also be an overall review of how much they owe you or you owe them after all the shared bills. As the saying goes, short account makes long friends. Start managing your friendship from managing your bills with them.


## Data Model


The application will store Users, Friend lists, and bills



An Example User:

```javascript
{
  userId: "Steven93610",
  username: "Steven",
  salt: // a password salt
  hash: // a password hash,
  friends: // an array of friend objects
  bills: // an array of bill objects
}
```

An Example Array of Friends:

```javascript
[
  {userId: "foo357", username: "Leo", remark: "Leo from high school", balance: -15},
  {userId: "hello237", username: "CoolDude", remark: "Sam", balance: 30},
  {userId: "ddddddddeeees222", username: "Nancy", remark: NULL, balance: 150}
]
```

An Example Array of Bills:
```javascript
[
  {
    remark: "McDonald's",
    time: "2022-10-23",
    user: 20,
    people:{
      foo357: 20
    }
    closed: true,
    pic: "a link to a photo of the bill"
  },
  {
    remark: "Peter Luger",
    time: "2022-09-15",
    user: 360,
    people:{
      foo357: 0,
      ddddddddeeees222: 0
    }
    closed: false,
    pic: NULL
  },
]
```


## [Link to Commented First Draft Schema](db.mjs) 


## Wireframes



/login - page for logining in

![list create](documentation/login.png)

/register - page for new user to register

![list](documentation/register.png)

/index - the main page including links to other pages

![list](documentation/index.png)

/friend - page showing all my friends and blance

![list](documentation/friends.png)

/addFriend - the page to add a user as friend

![list](documentation/addFriend.png)

/resetPassword - the page to reset password

![list](documentation/resetPassword.png)

/startBill - the page start a bill and add friends to share

![list](documentation/startBill.png)

/bills - the page showing previous unclosed bills

![list](documentation/bills.png)

## Site map



![list create](documentation/siteMap.png)

## User Stories or Use Cases


1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can add a friend through userId
4. as a user, I can view all my friends, balance, and I can give them remarks so I don't forget who is who.
5. as a user, I can start a bill
6. as a user, I can view unclosede bills and close them
7. as a user, I can reset my password

## Research Topics


* (3 points) Unit testing with JavaScript
    * Mocha
* (5 points) Automated functional testing for all of your routes using any of the following:
    * Selenium
    * Headless Chrome - headless browser testing
* (2 points) Integrate ESLint into your workflow
* (2 points) Use a CSS preprocesser



## [Link to Initial Main Project File](app.mjs) 


## Annotations / References Used

## Milestone 3 update:
 The project remains mostly unchanged. I deleted one schema because I found a better way to do it. Before there's a schema inside of another schema inside of another one. Now I replaced the most inner one with objects. That's for easier access. My initical idea was to make a multi-person plantform sharing bills of each others. When one user adds a bill, all other users in this bill will be notified. I feel this goal is a bit out of my ability as I am working on it. So the current goal was to make this web app like a calculator and notebook for bills for one single user. 

 ## Final update:
 3 points mocha unit test for functions in helperFn.mjs

![list create](documentation/mocha.png)
The first 6 tests for helperFn.mjs, and the rest using selenium for testing possible user behaviors.

5 points tests with selenium
![list create](documentation/1.png)
Selenium 1
![list create](documentation/2.png)
Selenium 2
![list create](documentation/3.png)
Selenium 3
![list create](documentation/4.png)
Selenium 4

2 points with Bootstrap theme New Age, with some adjustment
