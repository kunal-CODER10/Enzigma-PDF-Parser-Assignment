from transformers import DonutProcessor, VisionEncoderDecoderModel
from PIL import Image
import fitz  # PyMuPDF
import sys
import json

# Check if input file is provided
if len(sys.argv) < 2:
    print("Usage: python form_parser.py <pdf_path>")
    sys.exit(1)

pdf_path = sys.argv[1]

# Convert PDF to images
def convert_pdf_to_images(pdf_path):
    try:
        pdf_document = fitz.open(pdf_path)
        images = []
        for page_number in range(len(pdf_document)):
            page = pdf_document[page_number]
            pix = page.get_pixmap(dpi=300)  # Adjust DPI for quality
            image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            images.append(image)
        return images
    except Exception as e:
        print(f"Error: Unable to convert PDF to images. Details: {e}")
        sys.exit(1)

# Load model and processor
try:
    processor = DonutProcessor.from_pretrained("naver-clova-ix/donut-base-finetuned-docvqa")
    model = VisionEncoderDecoderModel.from_pretrained("naver-clova-ix/donut-base-finetuned-docvqa")
except Exception as e:
    print(f"Error: Unable to load model or processor. Details: {e}")
    sys.exit(1)

# Main logic
try:
    # Convert PDF to images
    images = convert_pdf_to_images(pdf_path)

    # Process each page
    results = []
    for page_number, image in enumerate(images):
        pixel_values = processor(image, return_tensors="pt").pixel_values
        outputs = model.generate(pixel_values)

        # Decode and append result
        result = processor.batch_decode(outputs, skip_special_tokens=True)[0]
        results.append({"page": page_number + 1, "result": result})

    # Print results
    print(json.dumps({"results": results}, indent=4))

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
