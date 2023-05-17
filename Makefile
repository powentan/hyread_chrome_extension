setup:
	npm install .

build:
	npx webpack

package:
	rm -rf package package.zip;
	mkdir package;
	cp -rf background.js dist manifest.json package/.;
	zip -r hyread_annotate_exporter.zip package;

.PHONY: setup build package
