"""Converte um documento local com Docling para Markdown e JSON.

Os caminhos de entrada e saída são obrigatórios para evitar coleta implícita de
fontes. Este utilitário não baixa documentos nem publica os resultados.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.document_converter import DocumentConverter, PdfFormatOption


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument(
        "--enable-ocr",
        action="store_true",
        help="Habilita OCR; use apenas quando o documento exigir reconhecimento de imagem.",
    )
    args = parser.parse_args()

    source = args.input.resolve()
    if not source.is_file():
        raise FileNotFoundError(f"Documento não encontrado: {source}")

    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    pdf_options = PdfPipelineOptions()
    pdf_options.do_ocr = args.enable_ocr
    converter = DocumentConverter(
        format_options={
            InputFormat.PDF: PdfFormatOption(pipeline_options=pdf_options),
        }
    )
    document = converter.convert(source).document
    markdown_path = output_dir / f"{source.stem}.md"
    json_path = output_dir / f"{source.stem}.json"
    document.save_as_markdown(markdown_path)
    document.save_as_json(json_path)

    print(
        json.dumps(
            {
                "input": str(source),
                "markdown": str(markdown_path),
                "json": str(json_path),
                "ocr_enabled": args.enable_ocr,
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
