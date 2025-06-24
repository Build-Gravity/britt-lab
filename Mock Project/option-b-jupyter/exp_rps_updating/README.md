# exp_rps_updating (Option B – Jupyter)

This folder mirrors the RPS updating task for a local Jupyter workflow.

Files:
- `rps.py` – command-line runner that stores `data.csv`.
- `analysis.ipynb` – loads the CSV and plots choice entropy across trials.

To try it:
```bash
pip install pandas matplotlib
python rps.py
jupyter lab analysis.ipynb
``` 