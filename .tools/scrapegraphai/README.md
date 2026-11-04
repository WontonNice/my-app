# ScrapeGraphAI local installation

Installed in `.venv` with Python 3.12, separately from the website dependencies.
Official project: https://github.com/ScrapeGraphAI/Scrapegraph-ai

From the repository root in PowerShell:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "$PWD/.tools/scrapegraphai/browsers"
& .tools/scrapegraphai/.venv/Scripts/python.exe your_scraping_script.py
```

Import the library with `from scrapegraphai.graphs import SmartScraperGraph`.
Configure a model before running extraction: the official README shows local
Ollama and API-backed models. No credentials or model downloads are configured
by this installation. No integration into the website is enabled.

Chromium browser files and the virtual environment are ignored by Git.
`requirements.lock.txt` records installed package versions.
