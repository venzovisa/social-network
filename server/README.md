<img src="https://webassets.telerikacademy.com/images/default-source/logos/telerik-academy.svg" alt="logo" width="300px" style="margin-top: 20px;"/>

# Social Network

## 1. Setup

The backend project is written in **TypeScript**/**NestJS**/**sqlite**. You are free to make changes to the project, however if you break it you are on your own.

To install dependencies run

```sh
npm install
```

To run the project:

```sh
npm start
```

<br>

## 2. Project Settings

There are a few dependencies installed:

<br>

### 2.1 SQLite

This is the in-file database provider, current settings will create the `data` folder inside the root. If at any point you decide the data you have in project is bad, you can stop the project, delete the `data` folder and start it again. The `data` folder (if it doesn't exist) will be generated again.

To create an admin you can open `src/users/users.service.ts` and uncomment this line `userToCreate.role = UserRole.Admin;`. Once you have create the first admin, don't forget to comment out the line again.

The backend you receive has one registered user:

```
username: admin
password: 123456
```

<br>

### 2.2 MySQL

MySQL has been added as a provider as well if you decide to work with a real database or go in the direction of deploying the project (most deployment service providers have immutable file system and `sqlite` will not work there).

To enable MySQL integration open `src/app.module.ts`, comment in

```
type: 'sqlite',
database: './data/data.sql',
```

comment out:

```
// type: 'mariadb',
// host: 'localhost',
// port: 3306,
// username: 'root',
// password: '1234',
// database: 'network',
```

and change the settings to match your database settings.

<br>

### 2.3 `sanitize-html`

You will need this library if you decide to enable embedded content in your app.

This library is used for HTML sanitization, that is removing unsafe tags, attributes, classes, etc. from an HTML string. You will use this in the React app as well to sanitize HTML on both ends.

You can find the `sanitize-html` settings in `src/common/sanitizer/sanitizer-settings.ts`:

```ts
export const sanitizerSettings: sanitize.IOptions = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'em',
    'p',
    'br',
    'iframe',
    'blockquote',
    'ul',
    'ol',
    'li',
    'code',
  ],
  allowedAttributes: {
    '*': ['data-*', 'alt'],
    iframe: ['width', 'height', 'src', 'title', 'allow', 'allowfullscreen'],
    p: ['class'],
    code: ['class'],
  },
  allowedSchemes: ['http', 'https', 'data'],
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
  allowedIframeDomains: ['youtube.com', 'zoom.us'],
};
```

You can change and extend the allowed features, but don't forget to keep the settings synchronized between backend and frontend.

<br>

### 2.4 Swagger

When you run the project you can open `http://localhost:5000/api/` and find documentation about the endpoints, expected query, URI parameters and body, expected return types, etc. You can run queries from this address, except for the case when multiform data needs to be passed (POST queries for creating users, posts, and comments). Those can be tested in Postman.

<br>

## 3. Endpoints

All endpoints are documented with **Swagger** (per the note above). Some endpoints don't need authentication to be accessed, but most do. This is properly shown in the **Swagger** endpoint. A few things to pay attention:

- required properties are marked with `*`, optional ones are not
- when you expand an endpoint you can find what kind of parameters/body need to be passed and what the expected result will be. The values are just placeholders
- the following endpoints work with **FormData** only, they also accept optional `file` property which is a single file
  - POST: `/users` - create/register an user
  - PUT: `/users` - update the logged user's information
  - POST: `/posts` - create a post
  - PUT: `/posts/id` - update a post
  - POST: `/posts/:id/comments` - create a comment
  - PUT: `/comments/:id` - update a comment

Most endpoints are self-explaining. A few to pay attention to are in the `feed` section:

- `GET: /feed/popular` - this endpoint is public, it will return the **20 most popular** posts, considering popularity is based on the amount of user reactions/likes the post has
- `GET: /feed` - this will return the logged user's feed, optional query parameters are `page`, `count`, and `distance`; keep in mind passing `distance` as a parameter will throw an error if the logged user hasn't set their `latitude` and `longitude` (or location)
- `GET: /feed/delta` - this is a **very optional** endpoint, you can use if and when you decide to make your application seem like it's working in real time (receiving new data since the last fetch and partially applying updates); there are two query parameters you can pass: `createdOrUpdatedAfter`: Date (required) which will specify the exact date you have last fetched data and it will return all the posts created or updated after set date, and `trackingPosts` which will specify which posts you are tracking - it will return all new and updated comments made for these posts; a few examples of how to use the endpoint:
  - `localhost:5000/feed/delta?createdOrUpdatedAfter=1636285335999&trackingPosts=1,2,3,4,5,6` - the date is passed as a number (or date.valueOf())
  - `localhost:5000/feed/delta?createdOrUpdatedAfter=11-7-2021&trackingPosts=1,2,3,4,5,6`
  - `localhost:5000/feed/delta?createdOrUpdatedAfter=Mon%20Nov%2008%202021%2013:00:16&trackingPosts=1,2,3,4,5,6` - `%20` is just an encoded blank space

<br>

## 4. Admin functions

Admins can ban and delete other users. No other functionalities have been added.
