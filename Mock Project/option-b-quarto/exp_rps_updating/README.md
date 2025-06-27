# exp_rps_updating (Option B – Quarto)

This folder mirrors the RPS updating task for a local Quarto workflow.

## Goal:
Replicate the analysis from the web version using Python and Quarto to create a reproducible research document.

## Setup:
1.  Install Python
2.  Install Quarto
3.  Run `pip install -r requirements.txt`

## Usage:
`quarto render analysis.qmd`

Files:
- `rps.py` – command-line runner that stores `data.csv`.
- `analysis.ipynb` – loads the CSV and plots choice entropy across trials. 