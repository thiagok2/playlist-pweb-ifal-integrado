###
1. Instalar docker desktop
2. Instalar extensão no vcscode 'Dev Containers'
3. Criar na pasta do projeto um docker-compose.yml
```
  services:
  postgres:
    image: postgres:latest
    container_name: postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  node:
    image: node:latest
    container_name: node_app
    working_dir: /app
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    command: >
      sh -c "npm install"   
    depends_on:
      - postgres

volumes:
  postgres_data:

```
4. Renomeie `.env.example` para `.env`.

5. Clonar projeto `https://github.com/00educaio/PWEB2-docker`
```
	git clone https://github.com/00educaio/PWEB2-docker
 
```
6. Levantar container
```
	docker compose up -d

```


