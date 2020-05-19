package telesync

import (
	"strings"
	"testing"
)

// Source: https://www.thegeekstuff.com/2012/09/sqlite-command-examples/

const testQueries = `
create table employee(empid integer,name varchar(20),title varchar(10));
create table department(deptid integer,name varchar(20),location varchar(10));
--
create unique index empidx on employee(empid);
--
insert into employee values(101,'John Smith','CEO');
insert into employee values(102,'Raj Reddy','Sysadmin');
insert into employee values(103,'Jason Bourne','Developer');
insert into employee values(104,'Jane Smith','Sale Manager');
insert into employee values(105,'Rita Patel','DBA');
--
insert into department values(1,'Sales','Los Angeles');
insert into department values(2,'Technology','San Jose');
insert into department values(3,'Marketing','Los Angeles');
--
select * from employee;
--
select * from department;
--
alter table department rename to dept;
alter table employee add column deptid integer;
--
update employee set deptid=3 where empid=101;
update employee set deptid=2 where empid=102;
update employee set deptid=2 where empid=103;
update employee set deptid=1 where empid=104;
update employee set deptid=2 where empid=105;
--
select * from employee;
--
create view empdept as select empid, e.name, title, d.name, location from employee e, dept d where e.deptid = d.deptid;
alter table employee add column updatedon date;
--
select * from empdept;
select empid,datetime(updatedon,'localtime') from employee;
select empid,strftime('%d-%m-%Y %w %W',updatedon) from employee;
--
drop index empidx;
drop view empdept;
drop table employee;
drop table dept;
`

var (
	testDatabaseName = "test"
)

func TestQuerying(t *testing.T) {
	ds := NewDS()
	ds.process(DBRequest{Drop: &DropRequest{testDatabaseName}})
	batches := strings.Split(testQueries, "--")
	for _, batch := range batches {
		queries := strings.Split(batch, ";")
		var stmts []Stmt

		for _, query := range queries {
			query = strings.TrimSpace(query)
			if len(query) > 0 {
				stmts = append(stmts, Stmt{query, nil})
			}
		}

		reply := ds.process(DBRequest{Exec: &ExecRequest{testDatabaseName, stmts, true}})
		t.Log("batch", stmts)
		if len(reply.Error) > 0 {
			t.Error(reply.Error)
		} else {
			t.Log("result", reply.Result)
		}
	}
}
