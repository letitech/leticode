# LetiCode

Welcome to **LetiCode**, a lightweight, browser-based Python code editor developed by **Letitech**. LetiCode is designed to provide a simple yet powerful environment for coding, debugging, and managing Python files directly in your web browser, leveraging the power of Pyodide for Python execution.

## Features

- **File Management**: Create, open, save, rename, and delete Python (`.py`) files with an intuitive sidebar explorer.
- **Code Editing**: Utilize a CodeMirror-based editor with syntax highlighting and line numbers for a smooth coding experience.
- **Run Code**: Execute Python code in the browser using Pyodide, with output displayed in an integrated terminal.
- **Context Menu**: Right-click files in the explorer to quickly open, download, rename, or delete them.
- **Keyboard Shortcuts**: Efficient workflow with shortcuts like `Ctrl+Alt+N` (New File), `Ctrl+O` (Open File), `Ctrl+S` (Save), and `Ctrl+Shift+S` (Save As).
- **Tabbed Interface**: Manage multiple open files with a tabbed interface, highlighting modified files.
- **Responsive Design**: Clean, dark-themed UI optimized for productivity.

## Installation

LetiCode is a web-based application and does not require installation. Simply clone the repository and serve the files using a local web server:

1. Clone the repository:
   ```bash
   git clone https://github.com/letitech/leticode.git
   cd leticode
   ```

2. Install dependencies (if using a build tool like Vite or Create React App):
   ```bash
   npm install
   ```

3. Start a local server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by your server).

## Usage

- **New File**: Click the "+" button in the explorer or use `Ctrl+N` to create a new file.
- **Open File**: Use `Ctrl+O` or the file input to load existing `.py` files.
- **Save**: Use `Ctrl+S` to save the current file or `Ctrl+Shift+S` to save as a new file.
- **Run Code**: Click the "Run" button in the top-right corner to execute your code and view output in the terminal.
- **Context Actions**: Right-click a file in the explorer for options like "Open," "Download," "Rename," or "Delete."

## Technologies

- **React**: For building the user interface.
- **Material-UI**: For responsive and customizable components.
- **CodeMirror**: For the code editing experience.
- **Pyodide**: For running Python code in the browser.
- **JavaScript**: Core logic and interactivity.

## Contributing

We welcome contributions to LetiCode! Please fork the repository and submit pull requests with your improvements. For major changes, please open an issue first to discuss.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support or inquiries, reach out to the Letitech team at [letitech.sl@gmail.com](mailto:letitech.sl@gmail.com).

---

*LetiCode - Code Smarter, Created by Letitech.*
