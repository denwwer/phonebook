# Docker
## Build
```
docker build -t phonebook-api .
```
## Run
`DB_URI` - MongoDB connection URI
```
docker run -p 8080:8080 -e DB_URI=${url here} phonebook-api
```

# Localy

## Install packages
```
npm install
```

 Check `.env.sample`

## Run
```
node app.js
```

## Testing
```
npm test
```
