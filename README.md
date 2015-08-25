# startpage
A clean, typography-focussed start page.

# Editing config.json

`linkblocks` - an array of link blocks shown on the start screen.

`weather` - weather settings.

`search` - search bar settings.


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
