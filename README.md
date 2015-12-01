# aws-go-lambda

My working experiment about Go on AWS Lambda.

This repository is a template repository.

# Bootstrapping

```sh
curl -L https://github.com/nabeken/aws-go-lambda/archive/master.tar.gz | tar -zxvf -
cd aws-go-lambda-master
make
```

`make` will generate `main.go` that implements ping handler for you. You can start implementing with it.

# Testing

```sh
npm install -g lambda-local
lambda-local -l index.js -h handler -e event_samples/sns.json
```

# Building

```sh
make
```

# Shipping

```sh
make dist
```

It will generate `lambda.zip` for you. You can put it on S3 or just upload it from AWS Management Console.

# Similar works

- https://github.com/jasonmoo/lambda_proc (index.js is taken from this)
