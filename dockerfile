# FROM node:alpine
# FROM node
FROM node:lts-alpine
ENV APP_ROOT /web
# ENV NODE_ENV production

WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
