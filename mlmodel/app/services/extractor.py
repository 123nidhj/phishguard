import textract
import pytesseract
from PIL import Image
import tempfile
import os
from pdf2image import convert_from_bytes

def extract_text_from_file(filename: str, content: bytes) -> str:
    ext = os.path.splitext(filename)[1].lower()

    try:
        if ext in ['.pdf']:
            # PDF → images → OCR
            images = convert_from_bytes(content)
            text = ''
            for img in images:
                text += pytesseract.image_to_string(img)
            return text.strip()

        elif ext in ['.jpg', '.jpeg', '.png']:
            with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp:
                temp.write(content)
                temp.close()
                text = pytesseract.image_to_string(Image.open(temp.name))
                os.unlink(temp.name)
                return text.strip()

        elif ext in ['.doc', '.docx']:
            with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp:
                temp.write(content)
                temp.close()
                text = textract.process(temp.name).decode('utf-8')
                os.unlink(temp.name)
                return text.strip()

        else:
            return "Unsupported file type"

    except Exception as e:
        return f"Error extracting text: {str(e)}"
