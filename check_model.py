import tensorflow as tf

# Укажи путь к своей модели
model_path = "skin_disease_model.h5"   # если твоя модель называется model.h5 и лежит в skinai-backend/

# Загружаем модель
model = tf.keras.models.load_model(model_path)

# Выводим архитектуру
model.summary()

