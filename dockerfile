# FROM node:alpine
# FROM node
# FROM node:lts-alpine
FROM node:16.17.1-alpine3.15
# ENV APP_ROOT /web
# ENV NODE_ENV production

ENV HOST 0.0.0.0
WORKDIR /usr/app
EXPOSE 3005

COPY ./ ./

# WORKDIR ${APP_ROOT}
# ADD . ${APP_ROOT}

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
