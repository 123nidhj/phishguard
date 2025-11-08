# train/train_link_model.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import re

def preprocess_url(url):
    url = str(url).lower()
    url = re.sub(r"https?://", "", url)
    url = re.sub(r"[^a-zA-Z0-9./]", "", url)
    return url

# Load and clean dataset
df = pd.read_csv("datasets/links.csv")

df.dropna(inplace=True)

df["cleaned"] = df["url"].apply(preprocess_url)
X = df["cleaned"]
y = df["label"]

# TF-IDF on URLs
vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_vec, y, test_size=0.2, random_state=42)

# Train model
model = GradientBoostingClassifier()
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# Save model
os.makedirs("app/models", exist_ok=True)
joblib.dump(model, "app/models/link_model.pkl")
joblib.dump(vectorizer, "app/models/link_vectorizer.pkl")
