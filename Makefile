ESLINT = node_modules/.bin/eslint --config node_modules/sanctuary-style/eslint-es6.json --env es6 --env node
NPM = npm

FILES = $(shell find . -name '*.js' -not -path './node_modules/*' | sort)


.PHONY: all
all:


.PHONY: lint
lint:
	$(ESLINT) \
	  --parser-options '{ecmaVersion: 8}' \
	  --rule 'indent: [off]' \
	  --rule 'max-len: [error, {ignoreComments: true}]' \
	  -- $(FILES)


.PHONY: setup
setup:
	$(NPM) install


.PHONY: test
test:
	./test
