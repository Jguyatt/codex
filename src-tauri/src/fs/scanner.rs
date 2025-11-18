use crate::fs::metadata;
use serde::Serialize;
use std::path::PathBuf;
use walkdir::WalkDir;

#[derive(Debug, Serialize)]
pub struct ScannedFile {
  pub path: String,
  pub classification: String,
  pub size: u64,
  pub junk: bool,
  pub metadata: serde_json::Value,
}

pub fn scan_paths(paths: Vec<PathBuf>) -> anyhow::Result<Vec<ScannedFile>> {
  let mut results = Vec::new();
  for path in paths {
    for entry in WalkDir::new(&path).into_iter().filter_map(|e| e.ok()) {
      if !entry.file_type().is_file() {
        continue;
      }
      let metadata_fs = match entry.metadata() {
        Ok(meta) => meta,
        Err(_) => continue,
      };
      let size = metadata_fs.len();
      let classification = metadata::classify(entry.path());
      let junk = metadata::is_junk(entry.file_name().to_string_lossy().as_ref(), size);
      let extracted = metadata::extract(entry.path()).unwrap_or_default();
      results.push(ScannedFile {
        path: entry.path().display().to_string(),
        classification,
        size,
        junk,
        metadata: extracted,
      });
    }
  }
  Ok(results)
}
