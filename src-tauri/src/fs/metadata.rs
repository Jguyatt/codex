use serde_json::json;
use std::{fs, io::Read, path::Path};

pub fn classify(path: &Path) -> String {
  let lower = path
    .extension()
    .and_then(|ext| ext.to_str())
    .map(|s| s.to_lowercase())
    .unwrap_or_default();

  match lower.as_str() {
    "jpg" | "jpeg" | "png" | "heic" | "gif" => "images".into(),
    "mp4" | "mov" | "m4v" => "videos".into(),
    "zip" | "gz" => "zips".into(),
    "pdf" => "pdfs".into(),
    "doc" | "docx" | "txt" | "md" => "docs".into(),
    _ => "misc".into(),
  }
}

pub fn is_junk(name: &str, size: u64) -> bool {
  let lower = name.to_lowercase();
  let junk_terms = ["screenshot", "installer", "setup"];
  size < 20_000 || junk_terms.iter().any(|term| lower.contains(term))
}

pub fn extract(path: &Path) -> anyhow::Result<serde_json::Value> {
  let classification = classify(path);
  match classification.as_str() {
    "images" => {
      let thumb = base64::encode_config(b"mock-thumbnail", base64::STANDARD);
      Ok(json!({ "thumbnail": thumb }))
    }
    "docs" | "pdfs" => {
      let mut file = fs::File::open(path)?;
      let mut buffer = vec![0u8; 5 * 1024];
      let read = file.read(&mut buffer)?;
      let snippet = String::from_utf8_lossy(&buffer[..read]).to_string();
      Ok(json!({ "snippet": snippet }))
    }
    _ => Ok(json!({}))
  }
}
