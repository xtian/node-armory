
test:
	node_modules/.bin/tap tests

lint:
	node_modules/.bin/jshint --config=.jshintrc index.js utils.js ./tests/
