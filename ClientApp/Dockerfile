FROM node:latest as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY /packages/InvexTrade/build /usr/src/app/build

# RUN chmod 666 /clientapp/build
# # production environment
# production environment
FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]