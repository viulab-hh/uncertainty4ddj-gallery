# CSV to JSON Converter

A Python script that automatically converts CSV files to JSON format and cleans up common encoding issues (BOM characters and escaped quotes).

## Usage

### Option 1: Specify the CSV filename
```bash
python csv_to_json_converter.py data.csv
```

### Option 2: Auto-detect CSV files
If you run the script without arguments, it will automatically find and process the first CSV file in the current directory:
```bash
python csv_to_json_converter.py
```

## What it does

1. **Reads CSV**: Loads the CSV file with UTF-8 encoding
2. **Converts to JSON**: Creates a JSON file with the same name (`.csv` → `.json`)
3. **Cleans encoding**: Removes:
   - BOM (Byte Order Mark) characters (`\ufeff`)
   - Escaped quotes in dictionary keys (e.g., `"﻿\"Titel \""` → `"Titel"`)

## Output

- **Input**: `mydata.csv`
- **Output**: `mydata.json`

The script displays progress with status indicators:
- ✓ Success
- ℹ Information
- ERROR: Problems

## Example

```bash
python csv_to_json_converter.py new_data.csv
```

Output:
```
Reading CSV: new_data.csv
  ✓ Loaded 100 records
  ✓ Created JSON: new_data.json
  Found 75 BOM characters - cleaning...
  ✓ Cleaned encoding issues

SUCCESS: Converted and cleaned new_data.csv
Output file: new_data.json
```

## Notes

- The script automatically handles UTF-8 encoding
- Original CSV files are not modified
- JSON output is formatted with 2-space indentation for readability
- Non-ASCII characters (umlauts, special symbols) are preserved
