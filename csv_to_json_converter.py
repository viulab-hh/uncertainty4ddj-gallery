import csv
import json
import os
import sys
from pathlib import Path
from datetime import datetime

# Month mapping for English to German
MONTH_MAPPING = {
    'January': 'Januar',
    'February': 'Februar',
    'March': 'März',
    'April': 'April',
    'May': 'Mai',
    'June': 'Juni',
    'July': 'Juli',
    'August': 'August',
    'September': 'September',
    'October': 'Oktober',
    'November': 'November',
    'December': 'Dezember'
}

def convert_date_to_german(date_str):
    """
    Convert English date format to German format.
    E.g., "June 3, 2024" -> "3. Juni 2024"
    
    Args:
        date_str (str): Date in English format
    
    Returns:
        str: Date in German format, or original string if conversion fails
    """
    if not date_str or not isinstance(date_str, str):
        return date_str
    
    try:
        # Parse the date (handles "Month Day, Year" format)
        date_obj = datetime.strptime(date_str.strip(), '%B %d, %Y')
        day = date_obj.day
        month_en = date_obj.strftime('%B')
        year = date_obj.year
        
        # Convert month to German
        month_de = MONTH_MAPPING.get(month_en, month_en)
        
        # Return in German format: "D. Monat YYYY"
        return f"{day}. {month_de} {year}"
    except (ValueError, AttributeError):
        # Return original if parsing fails
        return date_str

def convert_and_clean_csv(csv_filename=None):
    """
    Convert CSV to JSON and clean up encoding issues.
    
    Args:
        csv_filename (str): Name of the CSV file to convert. If None, looks for *.csv files.
    
    Returns:
        str: Path to the created JSON file
    """
    
    # Determine which CSV file to process
    if csv_filename is None:
        # Look for CSV files in current directory
        csv_files = list(Path('.').glob('*.csv'))
        if not csv_files:
            print("ERROR: No CSV files found in current directory")
            return None
        if len(csv_files) > 1:
            print(f"Found multiple CSV files. Processing: {csv_files[0]}")
        csv_filename = str(csv_files[0])
    
    # Verify file exists
    if not os.path.exists(csv_filename):
        print(f"ERROR: File '{csv_filename}' not found")
        return None
    
    json_filename = csv_filename.replace('.csv', '.json')
    
    print(f"Reading CSV: {csv_filename}")
    
    # Step 1: Convert CSV to JSON
    try:
        with open(csv_filename, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            data = list(reader)
        
        print(f"  ✓ Loaded {len(data)} records")
        
        # Step 1b: Convert dates to German format if "Datum" field exists
        if data and 'Datum' in data[0]:
            for record in data:
                if 'Datum' in record:
                    record['Datum'] = convert_date_to_german(record['Datum'])
            print(f"  ✓ Converted dates to German format")
    except Exception as e:
        print(f"ERROR reading CSV: {e}")
        return None
    
    # Step 2: Write raw JSON
    try:
        with open(json_filename, 'w', encoding='utf-8') as jsonfile:
            json.dump(data, jsonfile, ensure_ascii=False, indent=2)
        print(f"  ✓ Created JSON: {json_filename}")
    except Exception as e:
        print(f"ERROR writing JSON: {e}")
        return None
    
    # Step 3: Clean up encoding issues
    try:
        with open(json_filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count BOMs for debugging
        bom_count = content.count('\ufeff')
        if bom_count > 0:
            print(f"  Found {bom_count} BOM characters - cleaning...")
            
            # Replace malformed keys with BOM and escaped quotes
            content = content.replace('"\ufeff\\"Titel \\"": ', '"Titel": ')
            content = content.replace('"\ufeff\\"Titel": ', '"Titel": ')
            content = content.replace('"\ufeff\"Titel \"": ', '"Titel": ')
            
            # Write cleaned content
            with open(json_filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Cleaned encoding issues")
        else:
            print(f"  ℹ No encoding issues found")
        
        print(f"\nSUCCESS: Converted and cleaned {csv_filename}")
        print(f"Output file: {json_filename}")
        return json_filename
    
    except Exception as e:
        print(f"ERROR cleaning JSON: {e}")
        return None

if __name__ == '__main__':
    # Allow passing CSV filename as command line argument
    csv_file = sys.argv[1] if len(sys.argv) > 1 else None
    convert_and_clean_csv(csv_file)
