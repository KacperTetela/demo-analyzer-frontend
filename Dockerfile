# ETAP 1: Budowanie (Build Stage)
FROM node:20-alpine as build

WORKDIR /app

# Kopiujemy pliki zależności
COPY package.json package-lock.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę kodu
COPY . .

# Budujemy aplikację (tworzy folder /app/dist)
RUN npm run build

# ETAP 2: Serwowanie (Production Stage)
FROM nginx:alpine

# Kopiujemy zbudowane pliki z Etapu 1 do Nginxa
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiujemy nasz customowy konfig Nginxa
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Otwieramy port 80 (dla Coolify/Traefika)
EXPOSE 80

# Uruchamiamy Nginx
CMD ["nginx", "-g", "daemon off;"]