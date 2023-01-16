# @aindu/http-client

<p align="center">
    <img src="https://avatars.githubusercontent.com/u/121467350?s=400&u=c2cd1b3deea96ddb8dae7cec440d50791907202f&v=4" width="300px" height="180px"
/>
</p>


An idiomatic and isomorphic HttpClient based on **fetch** with native support for _TypeScript_.

`Only supports modern browsers and NodeJS >= 18`

## Installation

```sh
npm install @aindu/http-client
```

## Usage

### Instancing the client:

This module was thinking like an instantiable HTTP client for that you need to import and create an instance of the client:

```ts
import { HttpClient } from "@aindu/http-client";

const restClient = new HttpClient();
```

This client by default doesn't need any config, but you can set some things in the config to have a better experience.


### HttpClient Config
| field | description | type | default value |
|-------|-------------|------|---------------|
| timeout | timeout of the request in ms | number | infinite |
| retries | the number of retries after the first request | number | 0 |
| basepath | A URL used as a base of all the request | string | null |
| serialization | an object with two fields (input & output Functions) to map the input (body) or output (response) to another naming convention | `{ input: Function, output: Function }` | `{ input: null, output: null }`
|

For instantiating the HttpClient with any config like be:
```ts
import { HttpClient } from "@aindu/http-client";

const restClient = new HttpClient({ ... })
```

### Getting some info
```ts
restClient.get<{ status: "UP" | "DOWN" }>("http://www.api.com/health-check")
```

### Posting some info

```ts
restClient.post<{ userId: string }>("http://www.api.com/users", { name: "Pepe", surname: "Argento" })

```

## HttpClient API
`NOTE: All the methods return Promises.`

| method      | url | body | options |
|-------------|-----|------|---------|
| get         | ✅  | ❌   | ✅     |
| post        | ✅  | ✅   | ✅     |
| put         | ✅  | ✅   | ✅     |
| delete      | ✅  | ❌   | ✅     |
| patch       | ✅  | ✅   | ✅     |
| makeRequest | ❌  | ❌   | ✅     |

