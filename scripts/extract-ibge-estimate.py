import argparse
import json
from pathlib import Path

import openpyxl


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--municipality", default="Itapevi")
    args = parser.parse_args()
    workbook = openpyxl.load_workbook(Path(args.input), read_only=True, data_only=True)
    worksheet = workbook.worksheets[1]
    for row in worksheet.iter_rows(min_row=3, values_only=True):
        if str(row[3]).strip().casefold() == args.municipality.casefold():
            print(json.dumps({
                "reference_date": "2026-07-01",
                "uf": row[0],
                "uf_code": row[1],
                "municipality_code_suffix": str(row[2]),
                "municipality": row[3],
                "estimated_population": row[4],
                "source_sheet": worksheet.title,
            }, ensure_ascii=False))
            return
    raise SystemExit(f"Município não encontrado: {args.municipality}")


if __name__ == "__main__":
    main()
