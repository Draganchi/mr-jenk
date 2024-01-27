
# buy-01

## About

Buy-01 is the third project in the java track of 01Edu's curriculum. The goal of
the project is to create a mini e-commerce site using MongoDB, the Spring Boot
java framework and Angular, where sellers can add products they want to sell,
add images to them, while users can browse the products and contact the seller
if they want to buy something. The backend has to be separated into
microservices (user, product and media at least).

## Prerequisites

To run the project on your own machine, you need:

- Docker installed
- access to a MongoDB cluster

### MongoDB

To run the project with your own database, you either need to have access to a
cluster on Atlas, run mongoDB on your machine, or uncomment the mongo service in
the docker-compose.yml file.

Either way you choose, you have to configure your own database connection URI in
the docker-compose file for each of the backend services.

## Running the project

You need to provide an environment file to the docker-compose command for the
cookies and the ssl certificate to work. A self signed certificate to run it
locally is provided, run these commands in the terminal from the project's root
directory:

Building the images:

```bash
docker-compose --env-file .env.dev build
```

Running them:

```bash
docker-compose --env-file .env.dev up
```

<a id="arm64note"></a>

### Note about running the project on ARM64 architecture

If you are running the project on an Apple Silicon (M1, M2, M3), because of the
lack of the imageio-webp support, only jpeg file upload works. On any other
architecture jpeg, png and webp files can be uploaded.

## Kafka

Backend microservices communicate with each other via Apache Kafka to handle JWT
token validation. Validated tokens are cached for a short time to save time.
Some other actions also depend on Kafka:

- Media deletion upon product or user deletion
- Product deletion upon user deletion
- Authorization checks for media and product creation, update and deletion

## API Access

The angular frontend runs on port _443_ using HTTPS. From localhost the API
endpoints are also accessible using an API tool like Postman. An nginx reverse
proxy handles the routing of the request towards the proper microservices.

The main endpoints are

- /api/auth
- /api/users
- /api/products
- /api/media

### Authentication endpoints

#### POST: /api/signup

```json
{
  "name": "chosenName",
  "email": "your@email.com",
  "password": "yourPassword",
  "role": "CLIENT/SELLER"
}
```

#### POST: /api/signin

```json
{
  "name": "chosenName",
  "password": "yourPassword"
}
```

#### POST: /api/signout

An empty post request with the buy-01 cookie in the "Cookie" header sends an
immediately expiring cookie in the response, thus forcing the browser to delete
the existing cookie. Since the API is stateless, it doesn't keep any blacklists,
so the original token still works until the original expiry date.

### User endpoints (require authentication first)

All these endpoints require a cookie with a valid JWT token in the "Cookie"
header.

#### GET: /api/users

Gets all the users in the database.

#### GET: /api/users/{id}

Gets the user specified by the {id}

#### PUT: /api/users/{id}

Users can update their own user details by sending a json object in the request
body and specifying the {id}. The fields are the same as in the authentication
signup request, excluding the role. Only the fields to be updated are necessary,
null fields are ignored. Users cannot update their role, it is ignored. Users
can only update their own details.

#### DELETE: /api/users/{id}

Users can delete their account by specifying their {id}. When a user is deleted,
all products (if there is any) and all media belonging to the user is deleted.

### Product endpoint

All these endpoints require a cookie with a valid JWT token in the "Cookie"
header.

#### GET: /api/products

Gets all the products in the database.

#### GET: /api/products/{id}

Gets a product specified by the {id}.

#### PUT: /api/products/{id}

Product update works the same way as the user update, null fields are ignored.
UserId cannot be updated.

#### DELETE: /api/products/{id}

Sellers can delete their own products by specifying the {id}. All media
belonging to a product is deleted upon product deletion.

### Media endpoints

All these endpoints require a cookie with a valid JWT token in the "Cookie"
header.

#### GET: /api/media/{productId}

Gets all the media belonging to the product specified by the {productId}.

#### GET: /api/media/product/{productId}

Gets a thumbnail image (the first media stored in the database belonging to the
product resized to a maximum 400x400 size). Previous thumbnail requests are
cached in the backend to save processing time.

#### GET: /api/media/user/{userId}

Gets the avatar of the user specified by the {userId}.

#### POST: /api/media?userId={userId}&productId={productId}

**[Apple Silicon: see the note](#arm64note)**

Media can be created belonging to the user (avatar) or product. For product, 6
images can be uploaded. Supported file types are jpeg, png and non-animated
webp. Gif files can be uploaded, but all file types are converted into jpeg to
save storage space. From the query parameters, only one can be specified, the
other has to be left out.

The image has to be submitted as form-data, as a Multipart File with 'image' as
name.

#### DELETE: /api/media/{id}

Deletes media specified by {id}. Users can only delete media belonging to them.

#### DELETE: /api/media?userId={userId}&productId={productId}

Deletes all media belonging to either the user specified by {userId} or the
product specified by {productId}. Only one can be specified, the other has to be
left out.

## Authors



# Licence

[GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html)
