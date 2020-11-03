---
title: Backup and Recovery
---

:::caution
This feature is experimental. Do not rely on this in production!
:::

The Wave server logs all content changes to `stderr`. The changes are written in a format that can be read back in. This means that you can replay the log from beginning to end to recover the server's state (content, pages, everything). The log is, literally, a change log.

To capture the log, redirect `stderr` to a file when you launch the server:

```shell
./waved 2> backup.log
```

To recover state, feed the log file back in the next time you launch the server:

```shell 
./waved -init backup.log
```

To recover state and continue capturing the log, use:

```shell 
./waved -init backup.log 2> other.log
```

If you end up with a big log file, you can compact it like this:

```shell 
./waved -compact big.log 2> small.log
```

