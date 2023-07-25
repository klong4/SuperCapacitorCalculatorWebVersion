import os
import sys
import json
import pandas as pd
import tabula

def extract_product_type(filename):
    product_type = filename.split('_')[0]
    return product_type

def extract_tables_from_pdf(pdf_path):
    tables = tabula.read_pdf(pdf_path, pages='all', multiple_tables=True)
    return tables

def process_file(file_path):
    results = []
    try:
        filename = os.path.basename(file_path)
        product_type = extract_product_type(filename)
        tables = extract_tables_from_pdf(file_path)
        tables_json = [table.to_json() for table in tables if isinstance(table, pd.DataFrame)]
        results.append({
            'product_type': product_type,
            'tables': tables_json
        })
    except Exception as e:
        results.append(f"Error processing file {file_path}: {str(e)}")

    return results

if __name__ == "__main__":
    file_path = sys.argv[1]
    results = process_file(file_path)
    print(json.dumps(results))
