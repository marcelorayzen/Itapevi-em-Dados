"""Converte um documento local com Docling para Markdown e JSON.

Os caminhos de entrada e saída são obrigatórios para evitar coleta implícita de
fontes. Este utilitário não baixa documentos nem publica os resultados.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import traceback
from pathlib import Path

from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.document_converter import DocumentConverter, PdfFormatOption


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--page-start", type=int, default=1, help="Primeira página inclusiva a converter.")
    parser.add_argument("--page-end", type=int, help="Última página inclusiva a converter; padrão: até o fim.")
    parser.add_argument(
        "--enable-ocr",
        action="store_true",
        help="Habilita OCR; use apenas quando o documento exigir reconhecimento de imagem.",
    )
    args = parser.parse_args()

    source = args.input.resolve()
    if not source.is_file():
        raise FileNotFoundError(f"Documento não encontrado: {source}")
    if args.page_start < 1:
        raise ValueError("--page-start deve ser maior ou igual a 1")
    if args.page_end is not None and args.page_end < args.page_start:
        raise ValueError("--page-end deve ser maior ou igual a --page-start")

    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    started_at = time.monotonic()
    print(
        json.dumps(
            {
                "stage": "conversion_started",
                "input": str(source),
                "output_dir": str(output_dir),
                "ocr_enabled": args.enable_ocr,
                "page_start": args.page_start,
                "page_end": args.page_end,
            },
            ensure_ascii=False,
        ),
        flush=True,
    )

    pdf_options = PdfPipelineOptions()
    pdf_options.do_ocr = args.enable_ocr
    converter = DocumentConverter(
        format_options={
            InputFormat.PDF: PdfFormatOption(pipeline_options=pdf_options),
        }
    )
    print(json.dumps({"stage": "converter_ready"}), flush=True)
    conversion_kwargs = {"page_range": (args.page_start, args.page_end)} if args.page_end is not None else {"page_range": (args.page_start, 2**63 - 1)}
    document = converter.convert(source, **conversion_kwargs).document
    print(json.dumps({"stage": "conversion_finished"}), flush=True)
    markdown_path = output_dir / f"{source.stem}.md"
    json_path = output_dir / f"{source.stem}.json"
    document.save_as_markdown(markdown_path)
    print(json.dumps({"stage": "markdown_written", "path": str(markdown_path)}), flush=True)
    document.save_as_json(json_path)

    print(
        json.dumps(
            {
                "input": str(source),
                "markdown": str(markdown_path),
                "json": str(json_path),
                "ocr_enabled": args.enable_ocr,
                "page_start": args.page_start,
                "page_end": args.page_end,
                "elapsed_seconds": round(time.monotonic() - started_at, 2),
            },
            ensure_ascii=False,
        ),
        flush=True,
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(
            json.dumps(
                {
                    "stage": "conversion_failed",
                    "error_type": type(error).__name__,
                    "error": str(error),
                },
                ensure_ascii=False,
            ),
            file=sys.stderr,
            flush=True,
        )
        traceback.print_exc()
        raise
