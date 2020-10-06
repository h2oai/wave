package main

import (
	"flag"
	"log"
	"net/http"
)

func main() {
	port := flag.String("port", "3000", "port to listen on")
	directory := flag.String("dir", ".", "the directory to serve")
	flag.Parse()

	http.Handle("/", http.FileServer(http.Dir(*directory)))

	log.Printf("Serving directory '%s' on port %s...\n", *directory, *port)
	log.Fatal(http.ListenAndServe(":"+*port, nil))
}