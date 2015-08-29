# startpage
A clean, typography-focussed start page.

![](https://github.com/logicnotlogical/startpage/blob/master/img/example.png)

## Updating
For release v1.2.0, you will need to do `npm install` again. Also, make sure you backup your config file. A three-way merge *may* occur if not, but this should be ok if you're reasonably confiden with git. Give me a shout if you need a hand.

# Installation
Currently, only Linux is officially supported for the 'music' feature. This project has **not** been tested on Windows or Mac, but you're welcome to try. Please let me know how it goes!

Dependencies:
* nodejs
* npm
* mpc (optional, for music tile)

```
$ git clone https://github.com/logicnotlogical/startpage
$ cd startpage
$ npm install
```
Then, you can either start the server on the command line with
```
$ node server.js
```
or, you could create a daemon file (for instance, a systemd unit) and run it from there. I'll include my example systemd file shortly.

Once the server is running, you can access it by navigating to
```
http://localhost:3000/
```

Currently, the port is hardcoded but the next release will fix this. In the meantime, you can edit it by changing the value on line 27 of server.js.

# Editing config.json

`linkblocks` - an array of link blocks shown on the start screen.

`weather` - weather settings.

`search` - search bar settings.

`music` - mpd track information and control.

`tube` - live London Underground service updates.

`updateInterval` - the interval between refreshing data (in milliseconds, default is 5000)

## linkblocks
`letter` - the label assigned to the link block (the big one). Also corresponds to the key you can press to [un]select it.

`label` - the text below the big letter.

`links` - an array of links that are exposed when the block is selected.

### links
`name` - the label of the text.

`href` - the fully formatted uri of the link.

## weather
`show` - boolean. Not yet implemented.

`location` - a town or city you want to get weather for.

`unit` - can be celcius, kelvin (default) or fahrenheit (not yet implemented)

## search engine
`name` - the name of the search engine.

`searchuri` - the uri of the results page (minus the actual search query of course).

## music
`show` - if true, the tile is visible.

## tube
`show` - if true, the tile is visible.
