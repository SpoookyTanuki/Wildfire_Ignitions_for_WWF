import os
import pandas as pd
from deep_translator import GoogleTranslator

# Input
folder_path = "./excel_files"

# Initialize translator
translator = GoogleTranslator(source="el", target="en")

def translate_cell(text):
    """Translate individual cell values safely."""
    if pd.isna(text):  # Skip empty cells
        return text
    try:
        return translator.translate(str(text))
    except Exception as e:
        print(f"Error translating '{text}': {e}")
        return text

# Loop over all Excel files in folder
for file in os.listdir(folder_path):
    if file.endswith(".xlsx") or file.endswith(".xls"):
        file_path = os.path.join(folder_path, file)
        print(f"Translating: {file_path}")

        # Load Excel
        df = pd.read_excel(file_path)

        # Apply translation to every cell
        df_translated = df.applymap(translate_cell)

        # Save to new file
        new_file = os.path.join(folder_path, f"translated_{file}")
        df_translated.to_excel(new_file, index=False)

        print(f"Saved translated file: {new_file}")

print("Translation completed for all files.")
