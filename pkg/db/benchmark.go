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
	maxBenchmarkRows          = 100
	maxBenchmarkSleepInterval = 100
)

func setupData(ds *DS) {
	stmts := []Stmt{
		{Query: "drop index if exists widget_idx"},
		{Query: "drop table if exists widgets"},
		{Query: "create table widgets(id integer,name text)"},
		{Query: "create unique index widget_idx on widgets(id)"},
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
		{Query: "drop index widget_idx"},
		{Query: "drop table widgets"},
	}

	result := ds.process(DBRequest{Exec: &ExecRequest{"test", stmts, 1}})
	if _, ok := result.(ExecReply); !ok {
		panic("bad result")
	}
}

type benchmark func(ds *DS, wg *sync.WaitGroup, errs chan error)

func Benchmark() {
	benchmarks := []struct {
		name      string
		benchmark benchmark
	}{
		{"read", benchmarkReadOneRow},
	}

	kc, _ := keychain.LoadKeychain("test-keychain")
	ds := newDS(DSConf{Keychain: kc, Dir: "."})

	setupData(ds)

	k := 2 // iterations

	results := make([]string, len(benchmarks))
	for i, b := range benchmarks {
		fmt.Printf("benchmark: %s\n", b.name)
		ns := make([]int, k)
		for i := range ns {
			fmt.Printf("  %s: iteration %d/%d\n", b.name, i+1, k)
			ns[i] = findConcurrency(ds, b.benchmark)
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

func stats(values []int) (int, int, int) {
	value, values := values[0], values[1:]
	min := value
	max := value
	sum := 0
	for _, v := range values {
		sum += v
		if v < min {
			min = v
		} else if v > max {
			max = v
		}
	}
	return min, max, sum / len(values)
}

func findConcurrency(ds *DS, b benchmark) int {
	min, max, n := 0, 0, 1
	for {
		if runBenchmark(ds, b, n) {
			fmt.Printf("    n=%d ok\n", n)
			min = n
			if max == 0 {
				n *= 2
				continue
			}
		} else {
			fmt.Printf("    n=%d fail\n", n)
			max = n
		}
		n = min + (max-min)/2
		if max-min <= 1 {
			break
		}
	}
	return n
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

func benchmarkReadOneRow(ds *DS, wg *sync.WaitGroup, errs chan error) {
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
	if len(reply.Results[0][0]) != 1 {
		panic("bad count")
	}
}

// func TestReadConcurrency(t *testing.T) {
// 	r := newTestRunt()

// 	ids := doSetupOneKind(r)

// 	launch := func(r *Runt, concurrency int) {
// 		var wg sync.WaitGroup
// 		for i := 0; i < concurrency; i++ {
// 			wg.Add(1)
// 			go doReadOne(r, ids, &wg)
// 		}
// 		wg.Wait()
// 	}

// 	maxConcurrency := 1024
// 	for c := 1; c < maxConcurrency; c *= 2 {
// 		fmt.Printf("Concurrency=%d\n", c)
// 		launch(r, c)
// 	}
// }

// func TestReadManyConcurrency(t *testing.T) {
// 	r := newTestRunt()

// 	doSetupManyKinds(r)

// 	launch := func(r *Runt, concurrency int) {
// 		var wg sync.WaitGroup
// 		for i := 0; i < concurrency; i++ {
// 			wg.Add(1)
// 			go doReadMany(r, &wg)
// 		}
// 		wg.Wait()
// 	}

// 	maxConcurrency := 1024
// 	for c := 1; c < maxConcurrency; c *= 2 {
// 		fmt.Printf("Concurrency=%d\n", c)
// 		launch(r, c)
// 	}
// }

// func TestWriteConcurrency(t *testing.T) {
// 	r := newTestRunt()

// 	doSetupManyKinds(r)

// 	launch := func(r *Runt, concurrency int) {
// 		var wg sync.WaitGroup
// 		for i := 0; i < concurrency; i++ {
// 			wg.Add(1)
// 			go doWrite(r, &wg)
// 		}
// 		wg.Wait()
// 	}

// 	maxConcurrency := 512
// 	for c := 1; c < maxConcurrency; c *= 2 {
// 		fmt.Printf("Concurrency=%d\n", c)
// 		launch(r, c)
// 	}
// }

// func TestReadWriteConcurrency(t *testing.T) {
// 	r := newTestRunt()

// 	doSetupManyKinds(r)

// 	launch := func(r *Runt, concurrency int) {
// 		var wg sync.WaitGroup
// 		for i := 0; i < concurrency; i++ {
// 			wg.Add(1)
// 			go doReadMany(r, &wg)

// 			wg.Add(1)
// 			go doWrite(r, &wg)
// 		}
// 		wg.Wait()
// 	}

// 	maxConcurrency := 512
// 	for c := 1; c < maxConcurrency; c *= 2 {
// 		fmt.Printf("Concurrency=%d\n", c)
// 		launch(r, c)
// 	}
// }

// const (
// 	maxKinds         = 10
// 	maxRowsPerKind   = 100
// 	maxSleepInterval = 100
// )

// func doSetupManyKinds(r *Runt) {
// 	conn, err := r.Open()
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer conn.Close()

// 	for j := 0; j < maxKinds; j++ {
// 		m := strconv.Itoa(j)
// 		for i := 0; i < maxRowsPerKind; i++ {
// 			n := strconv.Itoa(i)
// 			_, err := conn.Insert("k"+m, "owner", "l"+n, "s"+n, "c"+n, true)
// 			if err != nil {
// 				panic(err)
// 			}
// 		}
// 	}
// }

// func doSetupOneKind(r *Runt) []int64 {
// 	conn, err := r.Open()
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer conn.Close()

// 	var ids []int64

// 	n := maxKinds * maxRowsPerKind

// 	for i := 0; i < n; i++ {
// 		n := strconv.Itoa(i)
// 		id, err := conn.Insert("k", "owner", "l"+n, "s"+n, "c"+n, true)
// 		if err != nil {
// 			panic(err)
// 		}
// 		ids = append(ids, id)
// 	}

// 	return ids
// }

// func doReadOne(r *Runt, ids []int64, wg *sync.WaitGroup) {
// 	defer wg.Done()

// 	time.Sleep(time.Millisecond * time.Duration(rand.Intn(maxSleepInterval)))

// 	conn, err := r.Open()
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer conn.Close()

// 	id := ids[rand.Intn(len(ids))]
// 	doc, err := conn.Read("k", id, "owner")
// 	if err != nil {
// 		panic(err)
// 	}
// 	if doc.ID != id {
// 		panic("wrong doc")
// 	}
// }

// func doReadMany(r *Runt, wg *sync.WaitGroup) {
// 	defer wg.Done()

// 	time.Sleep(time.Millisecond * time.Duration(rand.Intn(maxSleepInterval)))

// 	conn, err := r.Open()
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer conn.Close()

// 	m := strconv.Itoa(rand.Intn(maxKinds))
// 	items, err := conn.List("k"+m, "owner", "name", true, 0, 10)
// 	if err != nil {
// 		panic(err)
// 	}
// 	if len(items) == 0 {
// 		panic("no rows")
// 	}

// }

// func doWrite(r *Runt, wg *sync.WaitGroup) {
// 	defer wg.Done()

// 	time.Sleep(time.Millisecond * time.Duration(rand.Intn(maxSleepInterval)))

// 	conn, err := r.Open()
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer conn.Close()

// 	m := strconv.Itoa(rand.Intn(maxKinds))
// 	if _, err = conn.Insert("k"+m, "owner", "name"+m, "summary"+m, "content"+m, true); err != nil {
// 		panic(err)
// 	}
// }
