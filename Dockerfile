# Étape de construction de l'application React
FROM node:18-alpine as build



WORKDIR /usr/app
COPY ./ /usr/app
RUN chmod +x build.sh

RUN npm install

ARG ENVIRONMENT
ENV ENVIRONMENT=$ENVIRONMENT

RUN  /usr/app/build.sh




# Étape de construction de l'image NGINX
# FROM nginx:alpine


# # Copie du fichier de configuration personnalisé
# # COPY --from=build nginx.conf /etc/nginx/conf.d/default.conf

# # Copie des fichiers construits de l'application React dans le répertoire racine de NGINX
# COPY --from=dist ... /usr/share/nginx/html



EXPOSE 3000
# CMD ["nginx", "-g", "daemon off;"]