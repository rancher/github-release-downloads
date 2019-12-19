# github-release-downloads
Get the number of downloads of release artifacts for a GitHub repo

# Install
`npm install -g github-release-downloads`

# Usage
```
github-release-downloads
Get the number of downloads of releases of a GitHub repo

Usage: github-release-downloads <org>[/]<repo>

Options:
  --username, -u   Username to authenticate as [default: from $GITHUB_USERNAME or none]
  --token, -t      Personal access token to authenticate with [default: from $GITHUB_TOKEN or none]
  --prerelease[s]  Include prereleases
  --minor          Combine equivalent minor versions, e.g. 1.0.0 and 1.0.1 into 1.0.x
  --patch          Combine equivalent patch versions, e.g. 1.0.0-rc1 and 1.0.0 into 1.0.0
  --match          Which kinds of files to match [sha, binary, all] [default: "binary"]
  --csv            Output comma-separated-values
```

License
=======
Copyright (c) 2019 [Rancher Labs, Inc.](http://rancher.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
