# Bukit Vista NodeJS + Express + Sequelize (Mysql)
by Framesta Fernando Wijaya

- Steps to start

  - Inside the root directory run:
    npm install

  - Copy .env.example and fill DB variables

  - DB migrate and seeds
    ./node_modules/.bin/sequelize db:migrate
    ./node_modules/.bin/sequelize db:seed:all

  - Then run
    npm start

- Make sure you login first to acces API (account seed at app/seeders/20210108132300-user)
  name: 'Framesta'
  password: '123456'
