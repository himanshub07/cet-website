import requests
import tabula
import json

# URL of the PDF cutoff data
pdf_url = "https://fe2023.mahacet.org/ViewPublicDocument?MenuId=2450"

def download_pdf(url, filename):
    response = requests.get(url)
    with open(filename, 'wb') as f:
        f.write(response.content)

def extract_tables_from_pdf(pdf_path):
    # Extract tables from PDF using tabula-py
    tables = tabula.read_pdf(pdf_path, pages='all', multiple_tables=True)
    return tables

def process_tables(tables):
    # Process extracted tables to create structured JSON data
    colleges = []
    for table in tables:
        # Assuming each table corresponds to a college or a part of college data
        # The actual parsing depends on the PDF table structure
        # Example parsing logic (to be adjusted based on actual table format):
        # Expected columns: CollegeCode, CollegeName, Area, BranchCode, BranchName, Category1Cutoff, Category2Cutoff, ...
        # We will parse rows and group by college

        college_map = {}
        for index, row in table.iterrows():
            college_code = str(row.get('CollegeCode', '')).strip()
            college_name = str(row.get('CollegeName', '')).strip()
            area = str(row.get('Area', '')).strip()
            branch_code = str(row.get('BranchCode', '')).strip()
            branch_name = str(row.get('BranchName', '')).strip()

            # Collect cutoffs for categories dynamically
            cutoffs = {}
            for col in table.columns:
                if col not in ['CollegeCode', 'CollegeName', 'Area', 'BranchCode', 'BranchName']:
                    val = row.get(col)
                    if val is not None and val != '':
                        try:
                            cutoff_val = float(val)
                            cutoffs[col] = cutoff_val
                        except:
                            pass

            if college_code not in college_map:
                college_map[college_code] = {
                    'collegeCode': college_code,
                    'collegeName': college_name,
                    'areas': [area] if area else [],
                    'branches': []
                }
            else:
                # Add area if not already present
                if area and area not in college_map[college_code]['areas']:
                    college_map[college_code]['areas'].append(area)

            college_map[college_code]['branches'].append({
                'branchCode': branch_code,
                'branchName': branch_name,
                'cutoffs': cutoffs
            })

        colleges.extend(college_map.values())

    return colleges

def main():
    pdf_filename = "cutoff_data.pdf"
    download_pdf(pdf_url, pdf_filename)
    tables = extract_tables_from_pdf(pdf_filename)
    colleges_data = process_tables(tables)
    with open('cutoff_data.json', 'w', encoding='utf-8') as f:
        json.dump(colleges_data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()
