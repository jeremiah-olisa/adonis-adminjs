# Adonis AdminJS

[![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

This is a NON-official AdminJS plugin that integrates it to the AdonisJS framework.

## AdminJS

AdminJS is an automatic admin interface which can be plugged into your application. You, as a developer, provide
database models (like posts, comments, stores, products or whatever else your application uses), and AdminJS generates
UI which allows you (or other trusted users) to manage content.

Check out the example application with mongo and postgres models
here: https://admin-bro-example-app-staging.herokuapp.com/admin/login

Or visit AdminJS github page.

## Installation

Install the package with the command \
`npm i adminjs @vidiemme/adonis-adminjs`

Configure the package with the command \
`node ace configure @vidiemme/adonis-adminjs`

## Usage

You can edit your AdminJs configuration via the `start/adminjs.ts` file:

```typescript
import AdminJS from 'adminjs'

import {AdminjsAdonisInstance} from '@ioc:Vidiemme/Adminjs/Adonis'

const adminJs = new AdminJS({
  databases: [],
  rootPath: '/admin',
})
AdminjsAdonisInstance.buildRouter(adminjs)
```

Or you can use the AdminJS login screens (authentication is handled by Adonis)

```typescript
AdminjsAdonisInstance.buildAuthenticatedRouter(adminjs)
```

The `buildRouter` and `buildAuthenticatedRouter` methods return an Adonis Router, so you can then append middleware or
manage groups just as you do with other routes.

```typescript
Route.group(() => {
  AdminjsAdonisInstance
    .buildRouter(new AdminJS())
    .middleware(SomeMiddleware)

  ...
})
  .middleware(SomeGroupMiddleware)
```

[npm-image]: https://img.shields.io/npm/v/@vidiemme/adonis-adminjs?logo=npm&style=for-the-badge

[npm-url]: https://www.npmjs.com/package/@vidiemme/adonis-adminjs

[license-image]: https://img.shields.io/npm/l/@vidiemme/adonis-adminjs?style=for-the-badge&color=blueviolet

[license-url]: https://github.com/vidiemme/adonis-adminjs/blob/main/LICENSE.md

[typescript-image]: https://img.shields.io/npm/types/@vidiemme/adonis-adminjs?color=294E80&label=%20&logo=typescript&style=for-the-badge

[typescript-url]: https://github.com/vidiemme
