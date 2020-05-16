package main

import (
	"flag"

	"github.com/h2oai/telesync"
)

func main() {
	var (
		port string
	)

	flag.StringVar(&port, "port", ":55554", "listen on this port")

	flag.Parse()

	telesync.NewDS().Run(port)
}
