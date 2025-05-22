import tabula
import pandas as pd

# Step 1: Extract tables from PDF
pdf_path = "anurag.pdf"
tables = tabula.read_pdf(pdf_path, pages='all', multiple_tables=True)

# Step 2: Combine all tables into one DataFrame
pdf_df = pd.concat(tables, ignore_index=True)

# Step 3: Read your CSV file
csv_path = "Pune_Colleges_Cutoff.csv"
csv_df = pd.read_csv(csv_path)

# Step 4: Merge or map college codes
# Let's assume both files have a 'College Name' column to match on
# If the column names are different, adjust accordingly

# Clean up column names for matching
pdf_df.columns = [col.strip() for col in pdf_df.columns]
csv_df.columns = [col.strip() for col in csv_df.columns]

# If the PDF has a 'College Code' and 'College Name' column:
if 'College Code' in pdf_df.columns and 'College Name' in pdf_df.columns:
    code_map = dict(zip(pdf_df['College Name'], pdf_df['College Code']))
    csv_df['College Code'] = csv_df['College Name'].map(code_map)
else:
    print("Check your PDF columns! They must include 'College Code' and 'College Name'.")

# Step 5: Save the updated CSV
csv_df.to_csv("Pune_Colleges_Cutoff_with_codes.csv", index=False)
print("Done! Check Pune_Colleges_Cutoff_with_codes.csv")