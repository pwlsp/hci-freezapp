# How to run this app?

```
npm ci
npm run db:migrate
npm run dev -- --experimental-https
```

DONE!
---
Because it uses camera for scanning it needs secure-context (https) or localhost address to function. Thus to use this with local PC as a server you can turn on experimental https (self signed certificates).
