package db

import (
	"errors"
	"fmt"
	"math/rand"
	"sync"
	"time"

	"github.com/h2oai/wave/pkg/keychain"
)

const (
	benchmarkIterations       = 10
	maxBenchmarkRows          = 100
	maxBenchmarkSleepInterval = 100
)

type benchmark func(ds *DS, wg *sync.WaitGroup, errs chan error)

func setupData(ds *DS) {
	stmts := []Stmt{
		{Query: "drop index if exists widget_idx"},
		{Query: "drop table if exists widgets"},
		{Query: "create table widgets(id integer unique,name text)"},
	}

	for i := 0; i < maxBenchmarkRows; i++ {
		stmt := Stmt{
			Query:  "insert into widgets values(?, ?)",
			Params: []interface{}{i, fmt.Sprintf("widget%d", i)},
		}
		stmts = append(stmts, stmt)
	}

	result := ds.process(DBRequest{Exec: &ExecRequest{"test", stmts, 1}})
	if _, ok := result.(ExecReply); !ok {
		panic("bad result")
	}
}

func teardownData(ds *DS) {
	stmts := []Stmt{
		{Query: "drop table widgets"},
	}

	result := ds.process(DBRequest{Exec: &ExecRequest{"test", stmts, 1}})
	if _, ok := result.(ExecReply); !ok {
		panic("bad result")
	}
}

func Benchmark(verbose bool) {
	benchmarks := []struct {
		name      string
		benchmark benchmark
	}{
		{"read1", benchmarkRead1},
		{"read100", benchmarkRead10},
		{"write1", benchmarkWrite1},
		{"write10", benchmarkWrite10},
	}

	kc, _ := keychain.LoadKeychain("test-keychain")
	ds := newDS(DSConf{Keychain: kc, Dir: "."})

	setupData(ds)

	results := make([]string, len(benchmarks))
	for i, b := range benchmarks {
		fmt.Printf("benchmark: %s\n", b.name)
		ns := make([]int, benchmarkIterations)
		for i := range ns {
			n, trials := findConcurrency(ds, b.benchmark, verbose)
			fmt.Printf("  %s (iteration %d/%d, %d trials): %d concurrent\n", b.name, i+1, benchmarkIterations, trials, n)
			ns[i] = n
		}
		min, max, avg := stats(ns)
		results[i] = fmt.Sprintf("%s concurrency: min %d, max %d, avg %d", b.name, min, max, avg)
	}

	teardownData(ds)

	fmt.Println("\n--- benchmark results ---")
	for _, result := range results {
		fmt.Println(result)
	}
}

func stats(xs []int) (int, int, int) {
	x0, xs := xs[0], xs[1:]
	min, max, sum := x0, x0, 0
	if len(xs) == 0 {
		return min, max, x0
	}
	for _, x := range xs {
		sum += x
		if x < min {
			min = x
		} else if x > max {
			max = x
		}
	}
	return min, max, sum / len(xs)
}

func findConcurrency(ds *DS, b benchmark, verbose bool) (int, int) {
	trials := 0
	min, max, n := 0, 0, 1
	for {
		trials++
		if runBenchmark(ds, b, n) {
			if verbose {
				fmt.Printf("    n=%d ok\n", n)
			}
			min = n
			if max == 0 {
				n *= 2
				continue
			}
		} else {
			if verbose {
				fmt.Printf("    n=%d fail\n", n)
			}
			max = n
		}
		n = min + (max-min)/2
		if max-min <= 1 {
			break
		}
	}
	return n, trials
}

func runBenchmark(ds *DS, b benchmark, concurrency int) bool {
	var wg sync.WaitGroup
	errs := make(chan error, concurrency)
	for i := 0; i < concurrency; i++ {
		wg.Add(1)
		go b(ds, &wg, errs)
	}
	wg.Wait()
	close(errs)

	if len(errs) > 0 {
		return false
	}

	return true
}

func benchmarkRead1(ds *DS, wg *sync.WaitGroup, errs chan error) {
	defer wg.Done()

	time.Sleep(time.Millisecond * time.Duration(rand.Intn(maxBenchmarkSleepInterval)))

	id := rand.Intn(maxBenchmarkRows)
	stmt := Stmt{
		Query:  "select name from widgets where id=?",
		Params: []interface{}{id},
	}
	result := ds.process(DBRequest{Exec: &ExecRequest{"test", []Stmt{stmt}, 1}})
	reply, ok := result.(ExecReply)
	if !ok {
		panic("bad result")
	}
	if len(reply.Error) != 0 {
		errs <- errors.New(reply.Error)
		return
	}
	if len(reply.Results[0]) != 1 {
		panic("bad count")
	}
}

func benchmarkRead10(ds *DS, wg *sync.WaitGroup, errs chan error) {
	defer wg.Done()

	time.Sleep(time.Millisecond * time.Duration(rand.Intn(maxBenchmarkSleepInterval)))

	stmt := Stmt{
		Query:  "select name from widgets limit ?",
		Params: []interface{}{maxBenchmarkRows},
	}
	result := ds.process(DBRequest{Exec: &ExecRequest{"test", []Stmt{stmt}, 1}})
	reply, ok := result.(ExecReply)
	if !ok {
		panic("bad result")
	}
	if len(reply.Error) != 0 {
		errs <- errors.New(reply.Error)
		return
	}
	if len(reply.Results[0]) != maxBenchmarkRows {
		panic("bad count")
	}
}

func benchmarkWrite1(ds *DS, wg *sync.WaitGroup, errs chan error) {
	defer wg.Done()

	time.Sleep(time.Millisecond * time.Duration(rand.Intn(maxBenchmarkSleepInterval)))

	stmt := Stmt{
		Query:  "update widgets set name=? where id=?",
		Params: []interface{}{fmt.Sprintf("widget%d", rand.Intn(10000)), rand.Intn(maxBenchmarkRows)},
	}
	result := ds.process(DBRequest{Exec: &ExecRequest{"test", []Stmt{stmt}, 1}})
	reply, ok := result.(ExecReply)
	if !ok {
		panic("bad result")
	}
	if len(reply.Error) != 0 {
		errs <- errors.New(reply.Error)
	}
}

func benchmarkWrite10(ds *DS, wg *sync.WaitGroup, errs chan error) {
	defer wg.Done()

	time.Sleep(time.Millisecond * time.Duration(rand.Intn(maxBenchmarkSleepInterval)))

	const k = 10

	// update k consecutive rows
	stmts := make([]Stmt, k)
	i0 := rand.Intn(maxBenchmarkRows - k)
	for i := range stmts {
		stmts[i] = Stmt{
			Query:  "update widgets set name=? where id=?",
			Params: []interface{}{fmt.Sprintf("widget%d", rand.Intn(10000)), i0 + i},
		}
	}

	result := ds.process(DBRequest{Exec: &ExecRequest{"test", stmts, 1}})
	reply, ok := result.(ExecReply)
	if !ok {
		panic("bad result")
	}
	if len(reply.Error) != 0 {
		errs <- errors.New(reply.Error)
	}
}
