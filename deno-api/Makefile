run:
	deno --allow-net main.ts

build:
	deno bundle main.ts server.ts

install:
	deno install test_server server.ts --alow-net --alow-read
test:
	deno test --allow-env --allow-write --allow-net