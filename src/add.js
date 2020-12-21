const fs = require("fs");
const { askQuestion, getBooleanFromAnswer, sortObject } = require("./utils");

const add = async () => {
    // TODO: Check for books.json and books directory. This command should only run at the top-level of a bn project

    // Get existing books.json metadata
    const currentMetadata = JSON.parse(fs.readFileSync("./books.json"));

    // Get new book metadata
    const title = await askQuestion("Book title: ");
    const author = await askQuestion("Book author: ");
    const slug = await askQuestion("Book slug: ");
    const storeKindleNotes = await askQuestion(
        "Store Kindle notes for this book? (Y/N): "
    );
    const isKindleBook = getBooleanFromAnswer(storeKindleNotes);

    // Add a new entry to books.json and sort
    const newBookMetadata = { [title]: { author, slug, isKindleBook } };
    const newMetadata = sortObject({ ...currentMetadata, ...newBookMetadata });

    fs.writeFileSync("./books.json", JSON.stringify(newMetadata, null, "\t"));
    console.log(
        `bn add: Successfully added entry for "${title}" in books.json`
    );

    const newBookDir = `./books/${slug}`;

    // Create new directory for book slug
    fs.mkdirSync(newBookDir);
    console.log(`bn add: Successfully created new directory to store notes`);

    // Create README.md in books/slug
    const readmeText = `# ${title}

By ${author}

[Go back](../../README.md)

<hr>

### [Personal notes](./notes.md)
`;

    fs.writeFileSync(`${newBookDir}/README.md`, readmeText);
    console.log("bn add: Successfully created new README.md file");

    // Create books/slug/notes.md and books/slug/kindle.md
    const personalNotesText = `# ${title}

By ${author}

[Go back](./README.md)

<hr>

_No notes yet. Simply edit this file to start taking notes!_ 
`;

    fs.writeFileSync(`${newBookDir}/notes.md`, personalNotesText);
    console.log("bn add: Successfully created new notes.md file");

    if (isKindleBook) {
        const kindleNotesText = `# ${title}

By ${author}

[Go back](./README.md)

<hr>
`;
        fs.writeFileSync(`${newBookDir}/kindle.md`, kindleNotesText);
        fs.appendFileSync(
            `${newBookDir}/README.md`,
            "### [Kindle notes](./kindle.md)"
        );
        console.log("bn add: Successfully created new kindle.md file");
    }

    const topLevelReadme = fs.readFileSync("./README.md").toString();
    const oldReadmeHeader = topLevelReadme.split("## Books")[0];
    const newReadmeBookList = createReadmeBookList(newMetadata);

    const newReadme = [oldReadmeHeader, newReadmeBookList].join("");
    fs.writeFileSync("./README.md", newReadme);

    console.log(
        `bn add: Successfully added notes links to top-level README.md`
    );

    console.log(
        `\nA new notes entry for "${title}" has been created. Start taking notes by editing ${newBookDir}/notes.md.`
    );
};

const createReadmeBookList = (deserializedBooks) => {
    const bookListText = ["## Books\n\n"];

    Object.keys(deserializedBooks).forEach((title) => {
        const { author, slug, isKindleBook } = deserializedBooks[title];
        const bookDir = `./books/${slug}`;

        bookListText.push(`- [${title} by ${author}](${bookDir}/README.md)\n`);
        bookListText.push(`\t- [Personal notes](${bookDir}/notes.md)\n`);

        if (isKindleBook) {
            bookListText.push(`\t- [Kindle notes](${bookDir}/kindle.md)\n`);
        }
    });

    return bookListText.join("");
};

module.exports = add;
