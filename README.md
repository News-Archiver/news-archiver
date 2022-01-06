# News Archiver

## Start server for React

```console
$ npm start
```

## Run CNN bot for scraping website

```console
$ npm run bot
```

## SQL commands
```
DELETE t1 FROM news.cnn t1 INNER JOIN news.cnn t2 WHERE t1.id < t2.id AND t1.link = t2.link;
```
