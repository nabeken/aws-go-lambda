# aws-go-lambda

My working experiment about Go on AWS Lambda.

# Testing

```sh
npm install -g lambda-local
lambda-local -l index.js -h handler -e event_samples/sns.json
```

# Build

```sh
make
```

# Similar works

- https://github.com/jasonmoo/lambda_proc
