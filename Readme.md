# Bitespeed - Identity Reconciliation

An assignment for identity reconciliation of a customer which has atleast one email or phone while checkout.

## API Reference

#### Home Route

```http
  GET /
```

Home route, as the service is deployed on render, using this route will tell you that if the service is up or not.

#### Identify Route

```http
  POST /identify
```

| Parameter     | Type     | Description   |
| :------------ | :------- | :------------ |
| `email`       | `string` | **Optional**. |
| `phoneNumber` | `string` | **Optional**. |

Atleast one of email or phoneNumber has to be passed

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the root directory. Refer to the .env.example in the root of the project

`DATABASE_NAME`

`DATABASE_USER`

`DATABASE_PASSWORD`

`DATABASE_HOST`

`DB_PORT`

`PORT`

## Live Demo

https://bitespeed-assignment-4m3k.onrender.com

The demo is deployed on the free version of render. Render will spin down with inactivity and can take about 50 seconds to spin back up. So visit the home route before using the Identify route to make sure service is up.

## How to run locally?

### With NPM/YARN

- Setup .env file in root directory
- Run `yarn build` or `npm run build`
- Run `yarn start` or `npm run start`

The application will be up at localhost:${`PORT`} where PORT is defined in .env

### With Docker

- Dockerfile with required config is already present
- Execute `docker build --build-arg PORT=<PORT_IN_ENV> -t <image_name> path/to/Dockerfile`
- Replace `<PORT_IN_ENV>` with PORT in .env, `<image_name>` with name of your choice and put the path to the Dockerfile in the root of the project.
- After succesfull build, execute `docker run -p <LOCAL_PORT>:<PORT_EXPOSED_IN_BUILD> --env-file path/to/env <image_name>`

Example:

`docker build --build-arg PORT=9000 -t bitespeed .`

`docker run -p 9000:9000 --env-file .env bitespeed`

Here I executed both the commands in the root directory of project thus passed `.` as the path.

## 🚀 About Me

I am Lavish Goyal, working on software development since 2020 and have > 20 months of experience building production grade software with fast-paced startups and off-shore clients.

Let's connect at:

[Email](mailto:goellavish10@gmail.com)

[Linkedin](https://linkedin.com/in/goellavish10)

Here's my resume: [Click](https://tinyurl.com/resumelavish)

_PS: I am working as an intern at Xeno (ends this week), due to which I wasn't able to work during the day. the actual time to complete the project is less than the commit history would show._
