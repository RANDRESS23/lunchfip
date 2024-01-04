import pyqrcode
import sys
import os

def generate_qr_estudiante(numero_documento, temp_image_path):
  qr = pyqrcode.create(numero_documento, error='L')

  if not os.path.exists(temp_image_path):
    os.makedirs(temp_image_path)

  file_path = os.path.join(temp_image_path, f"{numero_documento}.png")
  qr.png(file_path, scale=20)
  return file_path



if __name__ == '__main__':
  numero_documento = sys.argv[1]
  temp_image_path = sys.argv[2]
  qr_path = generate_qr_estudiante(numero_documento, temp_image_path)
  print(f"QR generado en: {qr_path}")