from pyzbar import pyzbar
from pyzbar.pyzbar import ZBarSymbol
import cv2
import PIL.Image
from PIL.ExifTags import TAGS
import argparse

def metadata_scan(imagepath):
    image = PIL.Image.open(imagepath)
    exif_data = image._getexif()
    for (tag_id, data) in exif_data.items():
        if TAGS.get(tag_id, tag_id) == "Software":
            if isinstance(data, bytes):
                data = data.decode()
            return "Software signatures found: " +  data
    return "no software signatures found"

def barcode_scan(image):
    barcodes = pyzbar.decode(image, symbols = [ZBarSymbol.QRCODE])
    for barcode in barcodes:
        barcodeData = barcode.data.decode("utf-8")
        if validate_aadhar(barcodeData):
            return True
    return False

def validate_aadhar(data):
    pass

if __name__ == "__main__":
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument("-i", "--image", required = True, help = "path to input image")
    image_path = vars(arg_parser.parse_args())["image"]
    barcode_scan(cv2.imread(image_path))
    metadata_scan(image_path)