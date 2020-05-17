package main

import (
	"flag"

	"github.com/h2oai/telesync"
)

func main() {
	var (
		listen string
	)

	flag.StringVar(&listen, "listen", ":55554", "listen on this address")

	flag.Parse()

	telesync.NewDS().Run(listen)
}
