import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import FeatureUnion
from sklearn.preprocessing import FunctionTransformer
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import re

# Cleaners
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def clean_domain(domain):
    return str(domain).lower().replace("www.", "").strip()

# Load dataset
df = pd.read_csv("datasets/emails.csv")

df.dropna(inplace=True)

df["cleaned_text"] = df["text_content"].apply(clean_text)
df["cleaned_domain"] = df["sender_domain"].apply(clean_domain)

X = df[["cleaned_text", "cleaned_domain"]]
y = df["label"]

# Column-based TF-IDF
preprocessor = ColumnTransformer(transformers=[
    ("text_vec", TfidfVectorizer(max_features=4000), "cleaned_text"),
    ("domain_vec", TfidfVectorizer(), "cleaned_domain")
])

X_vec = preprocessor.fit_transform(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_vec, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# Save
os.makedirs("app/models", exist_ok=True)
joblib.dump(model, "app/models/email_model.pkl")
joblib.dump(preprocessor, "app/models/email_vectorizer.pkl")
