dist: npm_install main
	zip -r lambda.zip main index.js node_modules

npm_install:
	npm install

main: main.go
	GOOS=linux go build -o main

main.go:
	[ -f main.go ] || cat main.go.tmpl > main.go
	gofmt -w .

test-lambda-server:
	go build -o main

distclean: clean
	rm -f lambda.zip

clean:
	rm -rf main node_modules
