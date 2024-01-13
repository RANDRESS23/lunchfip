import pyqrcode
import sys
import os

def generate_qr_estudiante(numero_documento):
  qr = pyqrcode.create(numero_documento, error='L')

  # if not os.path.exists(temp_image_path):
  #   os.makedirs(temp_image_path)
  qrBase64Str = qr.png_as_base64_str(scale=20)
  return qrBase64Str
  # file_path = os.path.join(temp_image_path, f"{numero_documento}.png")
  # qr.png(file_path, scale=20)
  # return file_path



if __name__ == '__main__':
  numero_documento = sys.argv[1]
  qrBase64Str = generate_qr_estudiante(numero_documento)
  print(qrBase64Str)
  