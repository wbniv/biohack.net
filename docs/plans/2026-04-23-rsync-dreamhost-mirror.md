# Copy `wn@biohack.net:~` → `~/SRC/biohack.net/from-dreamhost`

## Context
Mirror the full DreamHost home directory locally. Remote size (from `du -hs`): **35 GB**.

## Command

```bash
rsync -aHAXhv --partial --append-verify --info=progress2 \
  wn@biohack.net:./ \
  ~/SRC/biohack.net/from-dreamhost/
```

Flags:
- `-a` archive (recursive, perms, times, symlinks, owner/group)
- `-H` hardlinks, `-A` ACLs, `-X` xattrs
- `-h` human sizes, `-v` verbose
- `--partial --append-verify` safe to Ctrl-C and re-run; resumes partial files and verifies the overlap
- `--info=progress2` single overall progress line (% / MB/s / ETA)
- Source `wn@biohack.net:./` with trailing slash, dest with trailing slash → remote home *contents* land directly in `from-dreamhost/` (no extra nesting)
- Add `-n` for a dry run first if you want to preview
- No `-z`: home dirs are usually dominated by already-compressed files, so compression just burns CPU on the DH shared host. Add it if it's mostly text/source.
- Re-running is idempotent — it'll skip anything already copied.

## Transfer time estimate

35 GB ≈ 35,840 MiB. The bottleneck on DreamHost shared hosting is almost always the remote side (shared I/O + outbound cap), not your home connection.

| Sustained throughput | ETA |
|---|---|
| 5 MB/s (busy DH) | ~2 hr |
| 10 MB/s | ~1 hr |
| 20 MB/s | ~30 min |
| 50 MB/s (best case) | ~12 min |

**Realistic guess: 45–90 minutes.** DH shared typically sustains 5–15 MB/s on bulk pulls, and a home dir with lots of small files (mail, dotfiles, caches) drags the average down from per-file overhead.

### Tighter estimate before committing
Time one largish file and divide:

```bash
time rsync -h --progress wn@biohack.net:./some-largeish-file ~/tmp/
```

Then: 35840 ÷ (MB/s observed) = seconds.

## Verification
- `du -sh ~/SRC/biohack.net/from-dreamhost/` should be within a few % of 35 GB.
- Re-run the rsync command; a clean pass should transfer ~nothing.
