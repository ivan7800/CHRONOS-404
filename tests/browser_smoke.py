"""Compatibilidad con el test histórico; ejecuta la suite Chromium sin red."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('browser_offline.py')), run_name='__main__')
