const fs = require("fs");
const { configureGitBookProject } = require("./git-book");
const { logger } = require("./utils");

const topLevelReadmeText = `# book-notes

> Notes and summaries of books that I've read.

<hr>

## Books

_No books have been added yet. Run \`bn add\` to start taking notes!_
`;

const log = (text) => logger("init", text);

const init = ({ gitBook }) => {
    log("Initializing bn project");

    fs.writeFileSync("./bn.json", "{\n}");
    log("Successfully created new bn.json file");

    fs.mkdirSync("./books");
    log("Successfully created new books directory");

    fs.writeFileSync("./README.md", topLevelReadmeText);
    log("Successfully created new top-level README.md file");

    if (gitBook) {
        configureGitBookProject(log);
    }

    console.log(
        "\nYour new bn project has been initialized. Get started taking notes by adding a new book with `bn add`!"
    );
};

module.exports = init;
