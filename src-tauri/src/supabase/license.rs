use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct LicenseValidationResult {
  pub valid: bool,
  pub reason: Option<String>,
}

pub fn validate_license(_license_key: &str, _machine_hash: &str) -> LicenseValidationResult {
  LicenseValidationResult {
    valid: _license_key == "CLARIFILE-DEMO",
    reason: Some("mock".to_string()),
  }
}
