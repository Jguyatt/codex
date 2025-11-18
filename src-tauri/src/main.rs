#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod ai;
mod fs;
mod supabase;
mod utils;

use ai::mock_routes::{self, MockAiResponse};
use fs::{apply_moves, scan_paths, undo_last_log, ProposedMove, ScannedFile, UndoSummary};
use std::path::PathBuf;
use supabase::license::{self, LicenseValidationResult};

type CommandResult<T> = Result<T, String>;

#[tauri::command]
fn scan_files(paths: Vec<String>) -> CommandResult<Vec<ScannedFile>> {
  if paths.is_empty() {
    return Err("no paths supplied".into());
  }
  let resolved: Vec<PathBuf> = paths.into_iter().map(PathBuf::from).collect();
  scan_paths(resolved).map_err(|err| err.to_string())
}

#[tauri::command]
fn apply_changes(entries: Vec<ProposedMove>) -> CommandResult<serde_json::Value> {
  apply_moves(entries)
    .map(|summary| serde_json::to_value(summary).unwrap_or_default())
    .map_err(|err| err.to_string())
}

#[tauri::command]
fn undo_last_run() -> CommandResult<UndoSummary> {
  undo_last_log().map_err(|err| err.to_string())
}

#[tauri::command]
fn ai_name_document() -> MockAiResponse {
  mock_routes::name_document()
}

#[tauri::command]
fn ai_name_image() -> MockAiResponse {
  mock_routes::name_image()
}

#[tauri::command]
fn ai_name_video() -> MockAiResponse {
  mock_routes::name_video()
}

#[tauri::command]
fn validate_license(license_key: String, machine_hash: String) -> LicenseValidationResult {
  license::validate_license(&license_key, &machine_hash)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      scan_files,
      apply_changes,
      undo_last_run,
      ai_name_document,
      ai_name_image,
      ai_name_video,
      validate_license
    ])
    .run(tauri::generate_context!())
    .expect("error while running Clarifile");
}
