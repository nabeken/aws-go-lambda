package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

// Lambda Server will listen to SocketPath .
var SocketPath = "/tmp/lambda-server.sock"

// ListenAndServe listens on unix socket specifyed by SocketPath.
func ListenAndServe(h http.Handler) error {
	ln, err := net.Listen("unix", "/tmp/lambda-server.sock")
	if err != nil {
		log.Fatal(err)
	}
	defer ln.Close()

	srv := &http.Server{
		Handler: h,
	}

	return srv.Serve(ln)
}

// ServMain wraps ListenAndServe and install signal handler for you.
func ServMain(h http.Handler) {
	done := make(chan error)
	go func() {
		done <- ListenAndServe(h)
	}()

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM, os.Kill)

	log.Print("starting server...")
	select {
	case s := <-sigCh:
		log.Print("signal received: ", s)
	case <-done:
		log.Print("closing...")
	}
}
