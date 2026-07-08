$ErrorActionPreference = 'Stop'
git add -A
$tree = (git write-tree).Trim()
$parent = (git rev-parse HEAD).Trim()
$commit = (git commit-tree $tree -p $parent -F .git/COMMIT_MSG_TMP.txt).Trim()
git update-ref refs/heads/main $commit
git log --oneline -2
