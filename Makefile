.PHONY: help install test coverage clean-coverage

# Which files to test
file=all

help:
	@echo
	@echo "Please use 'make <target>' where <target> is one of"
	@echo "  test           to run all tests"
	@echo "  test file=name to run a specific file's tests"
	@echo "  coverage       to generate and review test coverage reports"
	@echo "  install        to install modules and run migrations"
	@echo

# Install the required NPM modules
install:
	@npm update
	@npm install

# Run tests
test:
ifeq (${file},all)
	@NODE_ENV=test jest --forceExit
else
	@NODE_ENV=test jest --forceExit $(file)
endif

# Create test coverage report
coverage: clean-coverage
	@NODE_ENV=test jest --forceExit --coverage
	@open coverage/lcov-report/index.html

clean-coverage:
	@rm -rf coverage
