const fs = require("fs");

const configureGitBookProject = async (log) => {
    fs.writeFileSync("./bn.json", `{\n\t"isGitBook": true\n}`);

    fs.writeFileSync(
        "./.gitbook.yaml",
        [
            "root: ./books",
            "\n\nstructure:",
            "\n\treadme: ./README.md",
            "\n\tsummary: ./SUMMARY.md",
        ].join("")
    );
    log("Successfully created .gitbook.yaml file");

    fs.writeFileSync("./books/README.md", "# Book Notes");
    log("Successfully created GitBook README.md file");

    log("Successfully configured project for GitBook");
};

module.exports = { configureGitBookProject };
