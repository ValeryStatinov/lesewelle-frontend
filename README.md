# Lesewelle
A Chrome extension for immersive German language learning, semantic text analysis, translation, and vocabulary building.

> **Read anything. Learn everywhere.**

## Features

1. **Text Selection & Translation**  
  - Users can select text on any webpage.  
  - Translation to selected target language is streamed to client (OpenAI api is used for translations).

2. **Semantic Analysis & Tokenization**  
  - Text is sent to a Python NLP service.
  - Each word is tokenized and semantically analyzed.
  - Special handling for complex linguistic structures:
    - Reflexive verbs
    - Separable-prefix verbs *(These are highlighted as one unit, even if composed of multiple words)*

3. **User's Dictionary**  
  - Clicking a highlighted word shows its translation.
  - Users can add words to a personal dictionary.

4. **Spaced repetition learning**
  - Is under active development. 

## Architecture
```
Chrome Extension <--> Go API Gateway <--> Python NLP Service
```
- **Chrome Extension**:  
  Handles user interactions, text selection, and displays translations/highlighting.
- **Go API Gateway**: 
  Central API for handling requests from the extension and forwarding them to the NLP service.
- **Python NLP Service**: 
  Performs semantic analysis, tokenization, and language-specific word grouping.

## Tech Stack
- **Frontend**: Chrome Extension (TypeScript, Vite, React)  
- **Backend**: Go (Chi, OpenAI API)
- **NLP Service**: Python (Spacy)

## Development
1) run `yarn install`
2) run `yarn dev`
3) load unpacked extension
    - open `chrome://extensions` in browser
    - turn on developer mode
    - click load unpacked
    - choose dist folder

## Release
1) Run one of
```bash
yarn version --patch
yarn version --minor
yarn version --major
```

2) Run `yarn build`
3) Run 
```
cd dist
zip -r ../extension.zip .
```
4) upload created `extension.zip` to chrome web store
