run:
	deno --allow-net server.ts

build:
	deno bundle main.ts server.ts

install:
	deno install test_server server.ts --alow-net --alow-read

