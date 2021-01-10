#!/usr/bin/env node

const { program } = require("commander");
program.version("1.0.0");

const { init, add } = require("../src");

program
    .command("init")
    .option("-g, --git-book", "Configure as a GitBook project")
    .action(init);
program.command("add").action(add);

program.parse(process.argv);
