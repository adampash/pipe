#!/bin/bash

# adjusted from https://github.com/yarnpkg/yarn/blob/master/scripts/release-branch.sh

NEW_VERSION=$1

if [[ -z "$1" ]]
then
	echo "Creates a release for xform-to-js"
	echo "  Usage:"
	echo "    yarn release -- [version-to-release]"
	echo ""
	echo "    E.g.: "
	echo "      yarn release -- 1.0.2"
else
	echo "Checking out branch for $NEW_VERSION"
	git co -b "release-$NEW_VERSION"
	yarn build
	CHANGELOG=$(./node_modules/.bin/changelog-maker postlight xform-to-js)
	DATE=$(date +"%B %d, %Y")
	echo -e "### v$NEW_VERSION ($DATE)\n\n##### Commits\n\n$CHANGELOG\n\n$(cat CHANGELOG.md)" > CHANGELOG.md
	git add .
	yarn version --new-version=$NEW_VERSION --message "release: $NEW_VERSION"
	git push
fi
