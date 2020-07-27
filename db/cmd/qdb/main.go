package main

import (
	"flag"

	"github.com/h2oai/qd/qdb"
)

func main() {

	var conf qdb.DSConf

	flag.StringVar(&conf.Listen, "listen", ":55554", "listen on this address")
	flag.StringVar(&conf.CertFile, "tls-cert-file", "", "path to certificate file (TLS only)")
	flag.StringVar(&conf.KeyFile, "tls-key-file", "", "path to private key file (TLS only)")

	flag.Parse()

	qdb.NewDS().Run(conf)
}
