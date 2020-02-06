run:
	deno --allow-net --allow-read main.ts

build:
	deno bundle main.ts server.ts

install:
	deno install test_server server.ts --alow-net --alow-read

