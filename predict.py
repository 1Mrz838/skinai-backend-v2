import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Загружаем модель
model = tf.keras.models.load_model("skin_disease_model.h5")

# Классы HAM10000
class_names = [
    "Actinic keratoses (akiec)",      
    "Basal cell carcinoma (bcc)",     
    "Benign keratosis-like lesions (bkl)",  
    "Dermatofibroma (df)",            
    "Melanoma (mel)",                 
    "Melanocytic nevi (nv)",          
    "Vascular lesions (vasc)"         
]

# Загружаем тестовое изображение
img_path = "test.jpg"
img = image.load_img(img_path, target_size=(128, 128))  # под размер модели
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0) / 255.0

# Предсказание
predictions = model.predict(img_array)
predicted_class = np.argmax(predictions, axis=1)[0]

print("Предсказания по классам:", predictions)
print("Индекс предсказанного класса:", predicted_class)
print("Название предсказанного класса:", class_names[predicted_class])
