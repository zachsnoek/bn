const fs = require("fs");

const topLevelReadmeText = `# book-notes

> Notes and summaries of books that I've read.

<hr>

## Books

_No books have been added yet. Run \`bn add\` to start taking notes!_
`;

const init = () => {
    console.log("bn init: Initializing bn project");

    fs.writeFileSync("./books.json", "{\n}");
    console.log("bn init: Successfully created new books.json file");

    fs.mkdirSync("./books");
    console.log("bn init: Successfully created new books directory");

    fs.writeFileSync("./README.md", topLevelReadmeText);
    console.log("bn init: Successfully created new top-level README.md file");

    console.log(
        "\nYour new bn project has been initialized. Get started taking notes by adding a new book with `bn add`!"
    );
};

module.exports = init;
