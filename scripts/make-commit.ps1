$ErrorActionPreference = 'Stop'
git add -A
$tree = (git write-tree).Trim()
Write-Host "tree=$tree"
$parent = (git rev-parse HEAD).Trim()
Write-Host "parent=$parent"
$commit = (git commit-tree $tree -p $parent -F .git/COMMIT_MSG_TMP.txt).Trim()
Write-Host "commit=$commit"
git update-ref refs/heads/main $commit
Write-Host "---LOG---"
git log --oneline -3
Write-Host "---STATUS---"
git status
