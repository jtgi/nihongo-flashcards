# Scrappy flashcard generator for anki decks.
Queries jisho.org and generates a .tsv file importable by Anki.

## Usage
1. `git clone https://github.com/jtgi/nihongo-flashcards`
2. cd ./nihongo-flashcards
3. create a new file with the vocabularly you want to add definitions for. Sample `./vocab/unit1`
4. `node main.js ./path_to_file`, will output in the same directory as the file with a new extension `path_to_file.definitions.tsv`
5. Open Anki, import deck, use separator of `\t`, enable html in fields.
