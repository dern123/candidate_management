Backend has stack Node + Express + TS + prisma + SQLlite
Rest api 
get /api/candidates
get /api/candidates/:id
patch /api/candidates/:id/status

command for the start:
`npm install`

before run apply db :
`npx prisma migrate dev`
`npx prisma db seed`

after run beckend
`npm run dev`

server run on port 3002
