# ------------- BUILD ----------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# RUN npm run build

CMD ["npm", "run", "dev", "--", "--host"]

# -------------- SERVE --------------

# FROM nginx:apline 

# COPY --from=builder /app/dist /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off"]