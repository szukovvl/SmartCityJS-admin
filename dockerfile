# FROM node:alpine
# FROM node
FROM node:lts-alpine
# ENV APP_ROOT /web
# ENV NODE_ENV production

ENV HOST 0.0.0.0
WORKDIR /usr/app
EXPOSE 3000

COPY ./ ./

# WORKDIR ${APP_ROOT}
# ADD . ${APP_ROOT}

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
