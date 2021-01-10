const fs = require("fs");
const {
    askQuestion,
    getBooleanFromAnswer,
    sortObject,
    logger,
} = require("./utils");

const log = (text) => logger("add", text);

const add = async () => {
    // TODO: Check for bn.json and books directory. This command should only run at the top-level of a bn project

    // Get existing bn.json metadata
    const currentMetadata = JSON.parse(fs.readFileSync("./bn.json"));
    const currentBooks = currentMetadata.books;

    // Get new book metadata
    const title = await askQuestion("Book title: ");
    const author = await askQuestion("Book author: ");
    const slug = await askQuestion("Book slug: ");
    const storeKindleNotes = await askQuestion(
        "Store Kindle notes for this book? (Y/N): "
    );
    const isKindleBook = getBooleanFromAnswer(storeKindleNotes) || undefined;

    // Add a new entry to bn.json and sort
    const newBookMetadata = { [title]: { author, slug, isKindleBook } };
    const newBooks = sortObject({ ...currentBooks, ...newBookMetadata });
    const newMetadata = { ...currentMetadata, books: newBooks };

    fs.writeFileSync("./bn.json", JSON.stringify(newMetadata, null, "\t"));
    log(`Successfully added entry for "${title}" in bn.json`);

    const newBookDir = `./books/${slug}`;

    // Create new directory for book slug
    fs.mkdirSync(newBookDir);
    log("Successfully created new directory to store notes");

    // Create README.md in books/slug
    const readmeText = `# ${title}

By ${author}

[Go back](../../README.md)

<hr>

### [Personal Notes](./notes.md)
`;

    fs.writeFileSync(`${newBookDir}/README.md`, readmeText);
    log("Successfully created new README.md file");

    // Create books/slug/notes.md and books/slug/kindle.md
    const personalNotesText = `# Personal Notes

"${title}" by ${author}

[Go back](./README.md)

<hr>

_No notes yet. Simply edit this file to start taking notes!_ 
`;

    fs.writeFileSync(`${newBookDir}/notes.md`, personalNotesText);
    log("Successfully created new notes.md file");

    if (isKindleBook) {
        const kindleNotesText = `# Kindle Notes

"${title}" by ${author}

[Go back](./README.md)

<hr>
`;
        fs.writeFileSync(`${newBookDir}/kindle.md`, kindleNotesText);
        fs.appendFileSync(
            `${newBookDir}/README.md`,
            "### [Kindle Notes](./kindle.md)"
        );
        log("Successfully created new kindle.md file");
    }

    const topLevelReadme = fs.readFileSync("./README.md").toString();
    const oldReadmeHeader = topLevelReadme.split("## Books")[0];
    const newReadmeBookList = createMarkdownBookList(newBooks);

    const newReadme = [oldReadmeHeader, newReadmeBookList].join("");
    fs.writeFileSync("./README.md", newReadme);

    log("Successfully added notes links to top-level README.md");

    console.log(
        `\nA new notes entry for "${title}" has been created. Start taking notes by editing ${newBookDir}/notes.md.`
    );
};

const createMarkdownBookList = (deserializedBooks) => {
    const bookListText = ["## Books\n\n"];

    Object.keys(deserializedBooks).forEach((title) => {
        const { author, slug, isKindleBook } = deserializedBooks[title];
        const bookDir = `./books/${slug}`;

        bookListText.push(`- [${title} by ${author}](${bookDir}/README.md)\n`);
        bookListText.push(`\t- [Personal Notes](${bookDir}/notes.md)\n`);

        if (isKindleBook) {
            bookListText.push(`\t- [Kindle Notes](${bookDir}/kindle.md)\n`);
        }
    });

    return bookListText.join("");
};

module.exports = add;
