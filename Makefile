install:
	npm ci

build:
	npm run build

start:
	npx start-server -s ./dist

start-frontend:
	npm run dev
